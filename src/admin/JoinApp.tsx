import { useEffect, useState } from 'react'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from './firebase'
import { claimInvite, lookupInvite, type InviteStatus } from './invites'

/**
 * 招待コードから編集者として新規登録する画面。
 *
 * 運営が発行したコードを持っている人だけが、自分でアカウントを作れる。
 * どの団体に属するかは招待側で決まっており、本人は選べない
 * （firestore.rules の editors 参照）。
 */

type Step =
  | { kind: 'checking' }
  | { kind: 'invalid'; status: InviteStatus }
  | { kind: 'form'; organizationId: string; organizationName: string }
  | { kind: 'done'; email: string }

const MESSAGES: Record<InviteStatus, string> = {
  missing: '招待コードが見つかりません。コードを確認するか、運営にお問い合わせください。',
  used: 'この招待コードはすでに使われています。運営に新しいコードを発行してもらってください。',
  expired: 'この招待コードは有効期限が切れています。運営に新しいコードを発行してもらってください。',
  valid: '',
}

export default function JoinApp() {
  const [code, setCode] = useState('')
  const [step, setStep] = useState<Step>({ kind: 'checking' })

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get('code') ?? ''
    setCode(fromUrl)
    if (!fromUrl) return setStep({ kind: 'invalid', status: 'missing' })
    void check(fromUrl)
  }, [])

  async function check(value: string) {
    setStep({ kind: 'checking' })
    const result = await lookupInvite(value)
    if (result.status !== 'valid' || !result.organizationId) {
      return setStep({ kind: 'invalid', status: result.status })
    }
    // 団体名を出して「どこに招待されたか」を分かるようにする
    let name = result.organizationId
    try {
      const snapshot = await getDoc(doc(db(), 'organizations', result.organizationId))
      const field = snapshot.data()?.name as Record<string, string> | undefined
      if (field?.ja) name = field.ja
    } catch {
      // 団体名が読めなくても登録自体は続けられる
    }
    setStep({ kind: 'form', organizationId: result.organizationId, organizationName: name })
  }

  if (step.kind === 'checking') {
    return <p className="py-16 text-center text-snow-500">招待コードを確認しています…</p>
  }

  if (step.kind === 'invalid') {
    return (
      <div className="mx-auto max-w-md rounded-card bg-white p-6 ring-1 ring-snow-200">
        <h2 className="text-lg font-bold">招待コードを確認してください</h2>
        <p className="mt-2 text-sm leading-relaxed text-snow-600">{MESSAGES[step.status]}</p>

        <label className="mt-5 block text-xs font-bold text-snow-600" htmlFor="code">
          招待コード
        </label>
        <input
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="XXXX-XXXX-XXXX-XXXX"
          className="mt-1.5 w-full rounded-lg border border-snow-300 px-3 py-2.5 font-mono text-sm"
        />
        <button
          onClick={() => void check(code)}
          disabled={!code.trim()}
          className="mt-4 w-full rounded-full bg-brand-700 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-800 disabled:opacity-50"
        >
          確認する
        </button>
      </div>
    )
  }

  if (step.kind === 'done') {
    return (
      <div className="mx-auto max-w-md rounded-card bg-white p-6 ring-1 ring-snow-200">
        <h2 className="text-lg font-bold">登録が完了しました</h2>
        <p className="mt-2 text-sm leading-relaxed text-snow-600">
          <span className="font-medium">{step.email}</span> 宛に確認メールを送りました。
          メール内のリンクを開いて、メールアドレスの確認を済ませてください。
          確認が終わると、活動報告やイベントを登録できるようになります。
        </p>
        <a
          href="/admin"
          className="mt-5 inline-block rounded-full bg-brand-700 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-800"
        >
          管理画面へ
        </a>
      </div>
    )
  }

  return <SignUpForm step={step} code={code} onDone={(email) => setStep({ kind: 'done', email })} />
}

function SignUpForm({
  step,
  code,
  onDone,
}: {
  step: { organizationId: string; organizationName: string }
  code: string
  onDone: (email: string) => void
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit() {
    if (password.length < 8) return setError('パスワードは8文字以上にしてください。')
    setBusy(true)
    setError('')
    try {
      const credential = await createUserWithEmailAndPassword(auth(), email, password)
      await claimInvite({ code, uid: credential.user.uid, email })
      await sendEmailVerification(credential.user)
      onDone(email)
    } catch (e) {
      const message = e instanceof Error ? e.message : ''
      setError(
        message.includes('email-already-in-use')
          ? 'このメールアドレスはすでに登録されています。管理画面からログインしてください。'
          : '登録できませんでした。招待コードが有効か確認してください。',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={(event) => { event.preventDefault(); void submit() }} className="mx-auto max-w-md rounded-card bg-white p-6 ring-1 ring-snow-200">
      <h2 className="text-lg font-bold">編集者として登録</h2>
      <p className="mt-2 rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-900">
        <span className="font-bold">{step.organizationName}</span> の編集者として登録します。
      </p>
      <p className="mt-3 text-sm leading-relaxed text-snow-600">
        登録すると、この団体の活動報告・イベント・団体情報を編集できるようになります。
        ほかの団体の内容は編集できません。
      </p>

      <label className="mt-5 block text-xs font-bold text-snow-600" htmlFor="join-email">
        メールアドレス
      </label>
      <input
        id="join-email"
        type="email"
        autoComplete="username"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-1.5 w-full rounded-lg border border-snow-300 px-3 py-2.5 text-sm"
      />

      <label className="mt-4 block text-xs font-bold text-snow-600" htmlFor="join-password">
        パスワード（8文字以上）
      </label>
      <input
        id="join-password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
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
        className="mt-5 w-full rounded-full bg-hanabi-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-hanabi-700 disabled:opacity-50"
      >
        {busy ? '登録中…' : '登録する'}
      </button>
    </form>
  )
}
