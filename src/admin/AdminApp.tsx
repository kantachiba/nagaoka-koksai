import { useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from './firebase'
import { seedInitialData, type SeedResult } from './seed'
import InvitePanel from './InvitePanel'
import ReportEditor from './ReportEditor'

/**
 * 管理画面。運営メンバーと、招待を受けた団体の編集者が使う。
 *
 * 役割は Firestore の admins / editors コレクションで決まる（firestore.rules）。
 * この画面の表示はあくまで見た目の出し分けで、実際の権限はルール側が担保している。
 */

type Role =
  | { kind: 'admin' }
  | { kind: 'editor'; organizationId: string; organizationName: string }
  | { kind: 'none' }

type Phase =
  | { kind: 'loading' }
  | { kind: 'signed-out' }
  | { kind: 'signed-in'; user: User; role: Role }

export default function AdminApp() {
  const [phase, setPhase] = useState<Phase>({ kind: 'loading' })

  useEffect(() => {
    return onAuthStateChanged(auth(), async (user) => {
      if (!user) return setPhase({ kind: 'signed-out' })
      setPhase({ kind: 'signed-in', user, role: await resolveRole(user) })
    })
  }, [])

  if (phase.kind === 'loading') {
    return <p className="py-16 text-center text-snow-500">読み込み中…</p>
  }
  if (phase.kind === 'signed-out') return <SignIn />

  return <SignedIn user={phase.user} role={phase.role} />
}

async function resolveRole(user: User): Promise<Role> {
  try {
    if ((await getDoc(doc(db(), 'admins', user.uid))).exists()) return { kind: 'admin' }

    const editor = await getDoc(doc(db(), 'editors', user.uid))
    if (!editor.exists()) return { kind: 'none' }

    const organizationId = String(editor.data().organizationId ?? '')
    let organizationName = organizationId
    try {
      const org = await getDoc(doc(db(), 'organizations', organizationId))
      const field = org.data()?.name as Record<string, string> | undefined
      if (field?.ja) organizationName = field.ja
    } catch {
      // 団体名が読めなくても編集者であることは変わらない
    }
    return { kind: 'editor', organizationId, organizationName }
  } catch {
    return { kind: 'none' }
  }
}

function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit() {
    setBusy(true)
    setError('')
    try {
      await signInWithEmailAndPassword(auth(), email, password)
    } catch {
      // どちらが違うかは伝えない（総当たりの手がかりを与えないため）
      setError('メールアドレスまたはパスワードが正しくありません。')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={(event) => { event.preventDefault(); void submit() }} className="mx-auto max-w-sm rounded-card bg-white p-6 ring-1 ring-snow-200">
      <h2 className="text-lg font-bold">ログイン</h2>
      <p className="mt-1 text-sm text-snow-500">運営メンバーと、招待された団体の編集者が使えます。</p>

      <label className="mt-5 block text-xs font-bold text-snow-600" htmlFor="email">メールアドレス</label>
      <input id="email" type="email" autoComplete="username" required value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-1.5 w-full rounded-lg border border-snow-300 px-3 py-2.5 text-sm" />

      <label className="mt-4 block text-xs font-bold text-snow-600" htmlFor="password">パスワード</label>
      <input id="password" type="password" autoComplete="current-password" required value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mt-1.5 w-full rounded-lg border border-snow-300 px-3 py-2.5 text-sm" />

      {error && <p role="alert" className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p>}

      <button type="submit" disabled={busy}
        className="mt-5 w-full rounded-full bg-brand-700 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-800 disabled:opacity-50">
        {busy ? '確認中…' : 'ログイン'}
      </button>

      <p className="mt-5 border-t border-snow-200 pt-4 text-xs leading-relaxed text-snow-500">
        招待コードをお持ちの方は<a href="/admin/join" className="font-bold text-brand-700 hover:underline">こちらから登録</a>してください。
      </p>
    </form>
  )
}

function SignedIn({ user, role }: { user: User; role: Role }) {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-card bg-white p-5 ring-1 ring-snow-200">
        <div>
          <p className="text-sm text-snow-600">
            <span className="font-bold text-snow-800">{user.email}</span> でログイン中
          </p>
          <p className="mt-0.5 text-xs text-snow-500">
            {role.kind === 'admin' && '運営（すべての内容を編集できます）'}
            {role.kind === 'editor' && `${role.organizationName} の編集者`}
            {role.kind === 'none' && '編集権限なし'}
          </p>
        </div>
        <button onClick={() => signOut(auth())}
          className="rounded-full px-4 py-2 text-sm font-bold text-snow-600 transition-colors hover:bg-snow-100">
          ログアウト
        </button>
      </header>

      {role.kind !== 'admin' && !user.emailVerified && <VerifyEmail user={user} />}
      {role.kind === 'none' && <NoRole user={user} />}
      {role.kind === 'admin' && <AdminSections uid={user.uid} />}
      {role.kind === 'editor' && <EditorSections organizationId={role.organizationId} />}
    </div>
  )
}

function VerifyEmail({ user }: { user: User }) {
  const [sent, setSent] = useState(false)
  return (
    <section className="rounded-card bg-amber-50 p-5 ring-1 ring-amber-200">
      <h2 className="text-sm font-bold text-amber-900">メールアドレスの確認が必要です</h2>
      <p className="mt-2 text-sm leading-relaxed text-amber-900">
        確認が済むまで、活動報告やイベントの保存はできません。
        {user.email} 宛のメールにあるリンクを開いてください。
        確認したあとは、このページを再読み込みしてください。
      </p>
      <button
        onClick={async () => {
          await sendEmailVerification(user)
          setSent(true)
        }}
        className="mt-3 rounded-full bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700"
      >
        {sent ? '送信しました' : '確認メールを再送する'}
      </button>
    </section>
  )
}

function NoRole({ user }: { user: User }) {
  return (
    <section className="rounded-card bg-white p-6 ring-1 ring-snow-200">
      <h2 className="text-lg font-bold">編集権限がありません</h2>
      <p className="mt-2 text-sm leading-relaxed text-snow-600">
        招待コードをお持ちの場合は
        <a href="/admin/join" className="font-bold text-brand-700 hover:underline">登録ページ</a>
        からお進みください。運営メンバーの方は、Firebase コンソールの Firestore で
        <code className="mx-1 rounded bg-snow-100 px-1">admins</code>
        コレクションに下のUIDを追加してください。
      </p>
      <p className="mt-3 rounded-lg bg-snow-100 px-3 py-2 font-mono text-sm break-all">{user.uid}</p>
    </section>
  )
}

function AdminSections({ uid }: { uid: string }) {
  return (
    <>
      <ReportEditor scope={{ kind: 'admin' }} />
      <InvitePanel uid={uid} />
      <SeedSection />
      <ComingSoon />
    </>
  )
}

function EditorSections({ organizationId }: { organizationId: string }) {
  return (
    <>
      <ReportEditor scope={{ kind: 'editor', organizationId }} />
      <section className="rounded-card border border-dashed border-snow-300 bg-white/60 p-6">
        <h2 className="text-lg font-bold text-snow-700">イベント・団体情報の編集</h2>
        <p className="mt-2 text-sm text-snow-500">
          この先のフェーズで実装します。まずは活動報告からお使いください。
        </p>
      </section>
    </>
  )
}

function SeedSection() {
  const [result, setResult] = useState<SeedResult | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  return (
    <section className="rounded-card bg-white p-6 ring-1 ring-snow-200">
      <h2 className="text-lg font-bold">初期データの投入</h2>
      <p className="mt-2 text-sm leading-relaxed text-snow-600">
        タグ9種・団体2件（市民活動団体 WA!! / ワールドランプ会）・活動報告1件を登録します。
        すでにデータがある場合は何もしません。イベントは実際の予定が分からないため含めていません。
      </p>
      <button
        onClick={async () => {
          setBusy(true)
          setError('')
          try {
            setResult(await seedInitialData())
          } catch (e) {
            setError(e instanceof Error ? e.message : '投入に失敗しました。')
          } finally {
            setBusy(false)
          }
        }}
        disabled={busy}
        className="mt-4 rounded-full bg-hanabi-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-hanabi-700 disabled:opacity-50"
      >
        {busy ? '投入中…' : '初期データを投入する'}
      </button>
      {result && (
        <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          {result.message}
          {!result.skipped &&
            ` タグ ${result.created.tags} 件 / 団体 ${result.created.organizations} 件 / 活動報告 ${result.created.reports} 件`}
        </p>
      )}
      {error && <p role="alert" className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p>}
    </section>
  )
}

function ComingSoon() {
  return (
    <section className="rounded-card border border-dashed border-snow-300 bg-white/60 p-6">
      <h2 className="text-lg font-bold text-snow-700">イベント・団体情報の編集</h2>
      <p className="mt-2 text-sm text-snow-500">この先のフェーズで実装します。</p>
    </section>
  )
}
