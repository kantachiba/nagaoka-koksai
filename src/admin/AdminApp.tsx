import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from './firebase'
import { seedInitialData, type SeedResult } from './seed'

/**
 * 管理画面。運営メンバーがコードを触らずにコンテンツを追加できるようにする。
 *
 * 認証は Firebase Authentication（メール／パスワード）。
 * 書き込み権限は Firestore の admins コレクションに UID があるかで決まる
 * （firestore.rules 参照）。admins への登録は Firebase コンソールからのみ行う。
 */

type Phase =
  | { kind: 'loading' }
  | { kind: 'signed-out' }
  | { kind: 'not-admin'; user: User }
  | { kind: 'ready'; user: User }

export default function AdminApp() {
  const [phase, setPhase] = useState<Phase>({ kind: 'loading' })

  useEffect(() => {
    return onAuthStateChanged(auth(), async (user) => {
      if (!user) return setPhase({ kind: 'signed-out' })
      try {
        const snapshot = await getDoc(doc(db(), 'admins', user.uid))
        setPhase(snapshot.exists() ? { kind: 'ready', user } : { kind: 'not-admin', user })
      } catch {
        setPhase({ kind: 'not-admin', user })
      }
    })
  }, [])

  if (phase.kind === 'loading') {
    return <p className="py-16 text-center text-snow-500">読み込み中…</p>
  }
  if (phase.kind === 'signed-out') return <SignIn />
  if (phase.kind === 'not-admin') return <NotAdmin user={phase.user} />
  return <Dashboard user={phase.user} />
}

function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await signInWithEmailAndPassword(auth(), email, password)
    } catch {
      // 認証エラーの詳細は攻撃者への手がかりになるため、区別せず1つの文言にする
      setError('メールアドレスまたはパスワードが正しくありません。')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-sm rounded-card bg-white p-6 ring-1 ring-snow-200">
      <h2 className="text-lg font-bold">ログイン</h2>
      <p className="mt-1 text-sm text-snow-500">運営メンバー向けの管理画面です。</p>

      <label className="mt-5 block text-xs font-bold text-snow-600" htmlFor="email">
        メールアドレス
      </label>
      <input
        id="email"
        type="email"
        autoComplete="username"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-1.5 w-full rounded-lg border border-snow-300 px-3 py-2.5 text-sm"
      />

      <label className="mt-4 block text-xs font-bold text-snow-600" htmlFor="password">
        パスワード
      </label>
      <input
        id="password"
        type="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mt-1.5 w-full rounded-lg border border-snow-300 px-3 py-2.5 text-sm"
      />

      {error && (
        <p role="alert" className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="mt-5 w-full rounded-full bg-brand-700 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-800 disabled:opacity-50"
      >
        {busy ? '確認中…' : 'ログイン'}
      </button>
    </form>
  )
}

function NotAdmin({ user }: { user: User }) {
  return (
    <div className="mx-auto max-w-lg rounded-card bg-white p-6 ring-1 ring-snow-200">
      <h2 className="text-lg font-bold">編集権限がありません</h2>
      <p className="mt-2 text-sm leading-relaxed text-snow-600">
        ログインはできましたが、このアカウントには編集権限が設定されていません。
        Firebase コンソールの Firestore で <code className="rounded bg-snow-100 px-1">admins</code>{' '}
        コレクションに、下のUIDをドキュメントIDとして追加してください。
      </p>
      <p className="mt-3 rounded-lg bg-snow-100 px-3 py-2 font-mono text-sm break-all">{user.uid}</p>
      <button
        onClick={() => signOut(auth())}
        className="mt-5 rounded-full px-4 py-2 text-sm font-bold text-snow-600 hover:bg-snow-100"
      >
        ログアウト
      </button>
    </div>
  )
}

function Dashboard({ user }: { user: User }) {
  const [result, setResult] = useState<SeedResult | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function seed() {
    setBusy(true)
    setError('')
    try {
      setResult(await seedInitialData())
    } catch (e) {
      setError(e instanceof Error ? e.message : '投入に失敗しました。')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-card bg-white p-5 ring-1 ring-snow-200">
        <p className="text-sm text-snow-600">
          <span className="font-bold text-snow-800">{user.email}</span> でログイン中
        </p>
        <button
          onClick={() => signOut(auth())}
          className="rounded-full px-4 py-2 text-sm font-bold text-snow-600 transition-colors hover:bg-snow-100"
        >
          ログアウト
        </button>
      </header>

      <section className="rounded-card bg-white p-6 ring-1 ring-snow-200">
        <h2 className="text-lg font-bold">初期データの投入</h2>
        <p className="mt-2 text-sm leading-relaxed text-snow-600">
          タグ9種・団体2件（市民活動団体 WA!! / ワールドランプ会）・活動報告1件
          （ワールドランプ会 第1回）を登録します。すでにデータがある場合は何もしません。
          イベントは実際の予定が分からないため含めていません。
        </p>
        <button
          onClick={seed}
          disabled={busy}
          className="mt-4 rounded-full bg-hanabi-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-hanabi-700 disabled:opacity-50"
        >
          {busy ? '投入中…' : '初期データを投入する'}
        </button>

        {result && (
          <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
            {result.message}
            {!result.skipped && (
              <>
                {' '}タグ {result.created.tags} 件 / 団体 {result.created.organizations} 件 / 活動報告{' '}
                {result.created.reports} 件
              </>
            )}
          </p>
        )}
        {error && (
          <p role="alert" className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800">
            {error}
          </p>
        )}
      </section>

      <section className="rounded-card border border-dashed border-snow-300 bg-white/60 p-6">
        <h2 className="text-lg font-bold text-snow-700">イベント・団体・活動報告の編集</h2>
        <p className="mt-2 text-sm text-snow-500">
          この先のフェーズで実装します。3言語を横並びで入力でき、ふりがなはその場で
          プレビューできる編集画面にする予定です。
        </p>
      </section>
    </div>
  )
}
