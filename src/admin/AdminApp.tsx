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
import OrganizationEditor from './OrganizationEditor'

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
    return <p className="py-16 text-center text-pencil-gray">読み込み中…</p>
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
    <form onSubmit={(event) => { event.preventDefault(); void submit() }} className="mx-auto max-w-sm rounded-card bg-white p-6 border-2 border-faded-gray">
      <h2 className="text-lg font-bold">ログイン</h2>
      <p className="mt-1 text-sm text-pencil-gray">運営メンバーと、招待された団体の編集者が使えます。</p>

      <label className="mt-5 block text-xs font-bold text-pencil-gray" htmlFor="email">メールアドレス</label>
      <input id="email" type="email" autoComplete="username" required value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-1.5 w-full rounded-card border border-faded-gray px-3 py-2.5 text-sm" />

      <label className="mt-4 block text-xs font-bold text-pencil-gray" htmlFor="password">パスワード</label>
      <input id="password" type="password" autoComplete="current-password" required value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mt-1.5 w-full rounded-card border border-faded-gray px-3 py-2.5 text-sm" />

      {error && <p role="alert" className="mt-4 rounded-card bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p>}

      <button type="submit" disabled={busy}
        className="mt-5 w-full rounded-card bg-eager-green px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-eager-green disabled:opacity-50">
        {busy ? '確認中…' : 'ログイン'}
      </button>

      <p className="mt-5 border-t border-faded-gray pt-4 text-xs leading-relaxed text-pencil-gray">
        招待コードをお持ちの方は<a href="/admin/join" className="font-bold text-blue-text hover:underline">こちらから登録</a>してください。
      </p>
    </form>
  )
}

function SignedIn({ user, role }: { user: User; role: Role }) {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-card bg-white p-5 border-2 border-faded-gray">
        <div>
          <p className="text-sm text-pencil-gray">
            <span className="font-bold text-charcoal">{user.email}</span> でログイン中
          </p>
          <p className="mt-0.5 text-xs text-pencil-gray">
            {role.kind === 'admin' && '運営（すべての内容を編集できます）'}
            {role.kind === 'editor' && `${role.organizationName} の編集者`}
            {role.kind === 'none' && '編集権限なし'}
          </p>
        </div>
        <button onClick={() => signOut(auth())}
          className="rounded-card px-4 py-2 text-sm font-bold text-pencil-gray transition-colors hover:bg-paper-white">
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
    <section className="rounded-card bg-amber-50 p-5 border-2 border-amber-200">
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
        className="mt-3 rounded-card bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700"
      >
        {sent ? '送信しました' : '確認メールを再送する'}
      </button>
    </section>
  )
}

function NoRole({ user }: { user: User }) {
  return (
    <section className="rounded-card bg-white p-6 border-2 border-faded-gray">
      <h2 className="text-lg font-bold">編集権限がありません</h2>
      <p className="mt-2 text-sm leading-relaxed text-pencil-gray">
        招待コードをお持ちの場合は
        <a href="/admin/join" className="font-bold text-blue-text hover:underline">登録ページ</a>
        からお進みください。運営メンバーの方は、Firebase コンソールの Firestore で
        <code className="mx-1 rounded bg-paper-white px-1">admins</code>
        コレクションに下のUIDを追加してください。
      </p>
      <p className="mt-3 rounded-card bg-paper-white px-3 py-2 font-mono text-sm break-all">{user.uid}</p>
    </section>
  )
}

function AdminSections({ uid }: { uid: string }) {
  return (
    <>
      <PublishNote />
      <ReportEditor scope={{ kind: 'admin' }} />
      <OrganizationEditor scope={{ kind: 'admin' }} />
      <InvitePanel uid={uid} />
      <SeedSection />
      <ComingSoon />
    </>
  )
}

function EditorSections({ organizationId }: { organizationId: string }) {
  return (
    <>
      <PublishNote />
      <ReportEditor scope={{ kind: 'editor', organizationId }} />
      <OrganizationEditor scope={{ kind: 'editor', organizationId }} />
      <section className="rounded-card border border-dashed border-faded-gray bg-white/60 p-6">
        <h2 className="text-lg font-bold text-charcoal">イベントの編集</h2>
        <p className="mt-2 text-sm text-pencil-gray">この先のフェーズで実装します。</p>
      </section>
    </>
  )
}

/**
 * 公開までの流れの案内。
 * 「保存したのにサイトに出ない」と迷いやすいので、下書きと公開の違いと
 * 反映までの時間をここで明示しておく。
 */
function PublishNote() {
  return (
    <section className="rounded-card bg-storybook-green p-5 border-2 border-eager-green">
      <h2 className="text-sm font-bold text-charcoal">サイトに出るまでの流れ</h2>
      <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-relaxed text-charcoal">
        <li>内容を書いて保存します（このとき「下書き」だとサイトには出ません）</li>
        <li>公開状態を「公開する」にして保存します</li>
        <li>最大30分ほどでサイトに反映されます</li>
      </ol>
      <p className="mt-3 text-xs text-pencil-gray">
        すぐ反映したいときは{' '}
        <a
          href="https://github.com/kantachiba/nagaoka-koksai/actions/workflows/deploy.yml"
          target="_blank"
          rel="noreferrer"
          className="font-bold text-blue-text underline underline-offset-2"
        >
          こちらのページ
        </a>{' '}
        で「Run workflow」を押すと、数分で反映されます（GitHub アカウントが必要です）。
      </p>
    </section>
  )
}

function SeedSection() {
  const [result, setResult] = useState<SeedResult | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  return (
    <section className="rounded-card bg-white p-6 border-2 border-faded-gray">
      <h2 className="text-lg font-bold">初期データの投入</h2>
      <p className="mt-2 text-sm leading-relaxed text-pencil-gray">
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
        className="mt-4 rounded-card bg-eager-green px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-eager-green disabled:opacity-50"
      >
        {busy ? '投入中…' : '初期データを投入する'}
      </button>
      {result && (
        <p className="mt-4 rounded-card bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          {result.message}
          {!result.skipped &&
            ` タグ ${result.created.tags} 件 / 団体 ${result.created.organizations} 件 / 活動報告 ${result.created.reports} 件`}
        </p>
      )}
      {error && <p role="alert" className="mt-4 rounded-card bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p>}
    </section>
  )
}

function ComingSoon() {
  return (
    <section className="rounded-card border border-dashed border-faded-gray bg-white/60 p-6">
      <h2 className="text-lg font-bold text-charcoal">イベントの編集</h2>
      <p className="mt-2 text-sm text-pencil-gray">この先のフェーズで実装します。</p>
    </section>
  )
}
