import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Invite, InviteRole } from '../lib/types'

/**
 * 招待コードの発行と消費。
 *
 * Cloud Functions を使えないため、正当性の検証はすべて Firestore の
 * セキュリティルール側で行っている（firestore.rules の invites / editors）。
 * ここはその手順を呼び出すだけで、クライアントを信頼していない。
 */

/**
 * 紛らわしい文字（0/O/1/I/L）を除いた32文字。
 * 電話や紙で伝えても間違えにくいようにしている。
 */
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

/**
 * 16文字（約78ビット）のコードを作る。
 * レート制限を作れない構成なので、総当たりが成立しない長さを確保する。
 */
export function generateInviteCode(): string {
  const bytes = new Uint32Array(16)
  crypto.getRandomValues(bytes)
  const chars = Array.from(bytes, (value) => ALPHABET[value % ALPHABET.length])
  return [
    chars.slice(0, 4).join(''),
    chars.slice(4, 8).join(''),
    chars.slice(8, 12).join(''),
    chars.slice(12, 16).join(''),
  ].join('-')
}

/**
 * 招待URL。運営はこれをそのまま相手に送る。
 * base には window.location.origin ではなく SITE_URL を渡すこと
 * （サブパスで公開しているため、origin だけだとパスが欠ける）。
 */
export const inviteUrl = (code: string, base: string): string =>
  `${base}/admin/join?code=${encodeURIComponent(code)}`

export async function createInvite(options: {
  role: InviteRole
  /** 編集者の招待では必須。運営の招待では使わない */
  organizationId?: string
  createdBy: string
  /** 有効日数 */
  days: number
  note?: string
}): Promise<Invite> {
  if (options.role === 'editor' && !options.organizationId) {
    throw new Error('編集者の招待には団体が必要です')
  }

  const code = generateInviteCode()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + options.days)

  await setDoc(doc(db(), 'invites', code), {
    role: options.role,
    // 運営の招待に organizationId を混ぜるとルール側で弾かれる
    ...(options.role === 'editor' ? { organizationId: options.organizationId } : {}),
    createdBy: options.createdBy,
    createdAt: serverTimestamp(),
    expiresAt: Timestamp.fromDate(expiresAt),
    usedBy: null,
    ...(options.note ? { note: options.note } : {}),
  })

  return {
    id: code,
    role: options.role,
    organizationId: options.organizationId,
    createdBy: options.createdBy,
    createdAt: new Date().toISOString(),
    expiresAt: expiresAt.toISOString(),
    usedBy: null,
    note: options.note,
  }
}

/** role を持たない古い招待は編集者として扱う */
const toRole = (value: unknown): InviteRole => (value === 'admin' ? 'admin' : 'editor')

const toIso = (value: unknown): string =>
  value instanceof Timestamp ? value.toDate().toISOString() : String(value ?? '')

export async function listInvites(): Promise<Invite[]> {
  const snapshot = await getDocs(collection(db(), 'invites'))
  return snapshot.docs
    .map((row) => {
      const data = row.data()
      return {
        id: row.id,
        role: toRole(data.role),
        organizationId: data.organizationId ? String(data.organizationId) : undefined,
        createdBy: String(data.createdBy ?? ''),
        createdAt: toIso(data.createdAt),
        expiresAt: toIso(data.expiresAt),
        usedBy: (data.usedBy as string | null) ?? null,
        usedAt: data.usedAt ? toIso(data.usedAt) : undefined,
        note: data.note as string | undefined,
      }
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export const revokeInvite = (code: string): Promise<void> => deleteDoc(doc(db(), 'invites', code))

export type InviteStatus = 'valid' | 'used' | 'expired' | 'missing'

export type InviteLookup = {
  status: InviteStatus
  role?: InviteRole
  organizationId?: string
}

/** 招待コードの状態を調べる。サインアップ前に招待の内容を見せるため未認証でも引ける */
export async function lookupInvite(code: string): Promise<InviteLookup> {
  const snapshot = await getDoc(doc(db(), 'invites', code.trim().toUpperCase()))
  if (!snapshot.exists()) return { status: 'missing' }

  const data = snapshot.data()
  if (data.usedBy) return { status: 'used' }

  const expiresAt = data.expiresAt instanceof Timestamp ? data.expiresAt.toDate() : null
  if (!expiresAt || expiresAt.getTime() < Date.now()) return { status: 'expired' }

  const role = toRole(data.role)
  return {
    status: 'valid',
    role,
    organizationId: role === 'editor' ? String(data.organizationId ?? '') : undefined,
  }
}

/**
 * 招待を消費して、運営または編集者として登録する。
 *
 * 1. invites の usedBy に自分の UID を書く（未使用・期限内のときだけルールが通す）
 * 2. admins / editors に自分の1件を作る（1 の結果とルール側で突き合わせられる）
 *
 * 2 が失敗しても 1 は残るため、その招待は使えなくなる。運営が発行し直す。
 *
 * どちらの名簿に入るかは招待の role で決まる。ここで役割を偽っても、
 * ルール側が招待の role と突き合わせるため通らない（firestore.rules）。
 */
export async function claimInvite(params: {
  code: string
  uid: string
  email: string
}): Promise<void> {
  const code = params.code.trim().toUpperCase()
  const inviteRef = doc(db(), 'invites', code)

  await updateDoc(inviteRef, { usedBy: params.uid, usedAt: serverTimestamp() })

  const data = (await getDoc(inviteRef)).data()

  if (toRole(data?.role) === 'admin') {
    await setDoc(doc(db(), 'admins', params.uid), {
      role: 'admin',
      inviteCode: code,
      email: params.email,
      createdAt: serverTimestamp(),
    })
    return
  }

  await setDoc(doc(db(), 'editors', params.uid), {
    organizationId: String(data?.organizationId ?? ''),
    role: 'editor',
    inviteCode: code,
    email: params.email,
    createdAt: serverTimestamp(),
  })
}
