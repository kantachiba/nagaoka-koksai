import { readFileSync } from 'node:fs'
import test, { before, after, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} from '@firebase/rules-unit-testing'
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs } from 'firebase/firestore'

/**
 * Firestore セキュリティルールの検証。
 *
 * Cloud Functions を使わない構成では、ルールが唯一の防御線になる。
 * とくに「招待コードから編集者が自分で登録する」経路は権限昇格の温床なので、
 * 攻撃側の視点で通らないことを確かめる。
 */

const ADMIN = 'admin-uid'
const EDITOR = 'editor-uid'
const OUTSIDER = 'outsider-uid'
const ORG_A = 'org-a'
const ORG_B = 'org-b'
const VALID_CODE = 'AAAA-BBBB-CCCC-DDDD'
const USED_CODE = 'USED-USED-USED-USED'
const EXPIRED_CODE = 'EXPI-EXPI-EXPI-EXPI'

const future = new Date(Date.now() + 7 * 86_400_000)
const pastDate = new Date(Date.now() - 86_400_000)

let env

before(async () => {
  env = await initializeTestEnvironment({
    projectId: 'rules-test',
    firestore: { rules: readFileSync('firestore.rules', 'utf8'), host: '127.0.0.1', port: 8080 },
  })
})

after(async () => env?.cleanup())

beforeEach(async () => {
  await env.clearFirestore()
  // ルールを迂回して初期状態を作る
  await env.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore()
    await setDoc(doc(db, 'admins', ADMIN), { email: 'admin@example.jp' })
    await setDoc(doc(db, 'editors', EDITOR), {
      organizationId: ORG_A, role: 'editor', inviteCode: 'seed', createdAt: new Date(),
    })
    await setDoc(doc(db, 'organizations', ORG_A), { slug: 'org-a', status: 'published', name: { ja: 'A' } })
    await setDoc(doc(db, 'organizations', ORG_B), { slug: 'org-b', status: 'published', name: { ja: 'B' } })
    await setDoc(doc(db, 'reports', 'rep-a'), { slug: 'a', status: 'published', organizationId: ORG_A })
    await setDoc(doc(db, 'reports', 'rep-b'), { slug: 'b', status: 'published', organizationId: ORG_B })
    await setDoc(doc(db, 'reports', 'draft-a'), { slug: 'd', status: 'draft', organizationId: ORG_A })
    await setDoc(doc(db, 'photos', 'photo-1'), { organizationId: ORG_A, data: 'x', mimeType: 'image/jpeg' })
    await setDoc(doc(db, 'invites', VALID_CODE), {
      organizationId: ORG_B, createdBy: ADMIN, createdAt: new Date(), expiresAt: future, usedBy: null,
    })
    await setDoc(doc(db, 'invites', USED_CODE), {
      organizationId: ORG_B, createdBy: ADMIN, createdAt: new Date(), expiresAt: future, usedBy: 'someone-else',
    })
    await setDoc(doc(db, 'invites', EXPIRED_CODE), {
      organizationId: ORG_B, createdBy: ADMIN, createdAt: new Date(), expiresAt: pastDate, usedBy: null,
    })
  })
})

/** メール確認済みの認証コンテキスト */
const verified = (uid) => env.authenticatedContext(uid, { email_verified: true }).firestore()
const unverified = (uid) => env.authenticatedContext(uid, { email_verified: false }).firestore()
const anon = () => env.unauthenticatedContext().firestore()

// ---------------------------------------------------------------- 招待と権限昇格

test('招待なしでは編集者になれない', async () => {
  await assertFails(setDoc(doc(verified(OUTSIDER), 'editors', OUTSIDER), {
    organizationId: ORG_B, role: 'editor', inviteCode: 'NO-SUCH-CODE', createdAt: new Date(),
  }))
})

test('招待を消費せずに（usedBy を書かずに）編集者にはなれない', async () => {
  await assertFails(setDoc(doc(verified(OUTSIDER), 'editors', OUTSIDER), {
    organizationId: ORG_B, role: 'editor', inviteCode: VALID_CODE, createdAt: new Date(),
  }))
})

test('招待を消費すれば編集者になれる', async () => {
  const db = verified(OUTSIDER)
  await assertSucceeds(updateDoc(doc(db, 'invites', VALID_CODE), { usedBy: OUTSIDER, usedAt: new Date() }))
  await assertSucceeds(setDoc(doc(db, 'editors', OUTSIDER), {
    organizationId: ORG_B, role: 'editor', inviteCode: VALID_CODE, createdAt: new Date(),
  }))
})

test('role に admin を指定して昇格することはできない', async () => {
  const db = verified(OUTSIDER)
  await updateDoc(doc(db, 'invites', VALID_CODE), { usedBy: OUTSIDER, usedAt: new Date() })
  await assertFails(setDoc(doc(db, 'editors', OUTSIDER), {
    organizationId: ORG_B, role: 'admin', inviteCode: VALID_CODE, createdAt: new Date(),
  }))
})

test('招待に書かれた団体と違う団体の編集者にはなれない', async () => {
  const db = verified(OUTSIDER)
  await updateDoc(doc(db, 'invites', VALID_CODE), { usedBy: OUTSIDER, usedAt: new Date() })
  await assertFails(setDoc(doc(db, 'editors', OUTSIDER), {
    organizationId: ORG_A, role: 'editor', inviteCode: VALID_CODE, createdAt: new Date(),
  }))
})

test('他人の UID で編集者レコードを作れない', async () => {
  const db = verified(OUTSIDER)
  await updateDoc(doc(db, 'invites', VALID_CODE), { usedBy: OUTSIDER, usedAt: new Date() })
  await assertFails(setDoc(doc(db, 'editors', 'someone-else-uid'), {
    organizationId: ORG_B, role: 'editor', inviteCode: VALID_CODE, createdAt: new Date(),
  }))
})

test('使用済みの招待は消費できない', async () => {
  await assertFails(updateDoc(doc(verified(OUTSIDER), 'invites', USED_CODE), {
    usedBy: OUTSIDER, usedAt: new Date(),
  }))
})

test('期限切れの招待は消費できない', async () => {
  await assertFails(updateDoc(doc(verified(OUTSIDER), 'invites', EXPIRED_CODE), {
    usedBy: OUTSIDER, usedAt: new Date(),
  }))
})

test('招待の消費時に団体を書き換えることはできない', async () => {
  await assertFails(updateDoc(doc(verified(OUTSIDER), 'invites', VALID_CODE), {
    usedBy: OUTSIDER, usedAt: new Date(), organizationId: ORG_A,
  }))
})

test('招待の一覧は運営しか取れない', async () => {
  await assertFails(getDocs(collection(anon(), 'invites')))
  await assertFails(getDocs(collection(verified(EDITOR), 'invites')))
  await assertSucceeds(getDocs(collection(verified(ADMIN), 'invites')))
})

test('編集者は自分の所属団体を後から書き換えられない', async () => {
  await assertFails(updateDoc(doc(verified(EDITOR), 'editors', EDITOR), { organizationId: ORG_B }))
})

test('admins には誰も書き込めない', async () => {
  await assertFails(setDoc(doc(verified(OUTSIDER), 'admins', OUTSIDER), { x: 1 }))
  await assertFails(setDoc(doc(verified(ADMIN), 'admins', OUTSIDER), { x: 1 }))
})

// ---------------------------------------------------------------- コンテンツの境界

test('編集者は自分の団体の活動報告を編集できる', async () => {
  await assertSucceeds(updateDoc(doc(verified(EDITOR), 'reports', 'rep-a'), { slug: 'a2' }))
})

test('編集者は他団体の活動報告を編集できない', async () => {
  await assertFails(updateDoc(doc(verified(EDITOR), 'reports', 'rep-b'), { slug: 'b2' }))
})

test('編集者は活動報告を他団体へ付け替えられない', async () => {
  await assertFails(updateDoc(doc(verified(EDITOR), 'reports', 'rep-a'), { organizationId: ORG_B }))
})

test('編集者は他団体の活動報告を作れない', async () => {
  await assertFails(setDoc(doc(verified(EDITOR), 'reports', 'new-b'), {
    slug: 'nb', status: 'draft', organizationId: ORG_B,
  }))
})

test('メール未確認の編集者は書き込めない', async () => {
  await assertFails(updateDoc(doc(unverified(EDITOR), 'reports', 'rep-a'), { slug: 'a3' }))
})

test('編集者はタグを編集できない（サイト全体の分類のため）', async () => {
  await assertFails(setDoc(doc(verified(EDITOR), 'tags', 'evil'), { slug: 'evil', order: 1 }))
  await assertSucceeds(setDoc(doc(verified(ADMIN), 'tags', 'ok'), { slug: 'ok', order: 1 }))
})

test('編集者は自団体の公開状態と slug を変えられない', async () => {
  await assertFails(updateDoc(doc(verified(EDITOR), 'organizations', ORG_A), { status: 'draft' }))
  await assertFails(updateDoc(doc(verified(EDITOR), 'organizations', ORG_A), { slug: 'hijack' }))
  await assertSucceeds(updateDoc(doc(verified(EDITOR), 'organizations', ORG_A), { email: 'x@example.jp' }))
})

test('編集者は団体を削除できない', async () => {
  await assertFails(deleteDoc(doc(verified(EDITOR), 'organizations', ORG_A)))
})

// ---------------------------------------------------------------- 公開読み取り

test('未認証では公開済みだけ読める', async () => {
  await assertSucceeds(getDoc(doc(anon(), 'reports', 'rep-a')))
  await assertFails(getDoc(doc(anon(), 'reports', 'draft-a')))
})

test('写真は ID 指定でしか読めない（全件ダウンロードを防ぐ）', async () => {
  await assertSucceeds(getDoc(doc(anon(), 'photos', 'photo-1')))
  await assertFails(getDocs(collection(anon(), 'photos')))
})

test('未提供機能の書き込み口は閉じている', async () => {
  await assertFails(setDoc(doc(anon(), 'suggestions', 's1'), {
    kind: 'idea', body: 'x', createdAt: new Date(),
  }))
  await assertFails(setDoc(doc(anon(), 'comments', 'c1'), {
    targetType: 'event', targetId: 'e', displayName: 'n', body: 'x', approved: false, createdAt: new Date(),
  }))
})
