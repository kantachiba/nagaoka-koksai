import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from './firebase'
import { createInvite, inviteUrl, listInvites, revokeInvite } from './invites'
import type { Invite } from '../lib/types'

/**
 * 招待の発行・管理（運営のみ）。
 *
 * 発行したコードは、運営が編集者へ private に渡す前提。
 * コードそのものが鍵なので、画面上でもコピーしやすくしている。
 */

type Org = { id: string; name: string }

export default function InvitePanel({ uid }: { uid: string }) {
  const [orgs, setOrgs] = useState<Org[]>([])
  const [invites, setInvites] = useState<Invite[]>([])
  const [organizationId, setOrganizationId] = useState('')
  const [days, setDays] = useState(14)
  const [note, setNote] = useState('')
  const [issued, setIssued] = useState<Invite | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)

  async function refresh() {
    try {
      const snapshot = await getDocs(collection(db(), 'organizations'))
      const list = snapshot.docs.map((row) => ({
        id: row.id,
        name: String((row.data().name as Record<string, string> | undefined)?.ja ?? row.id),
      }))
      setOrgs(list)
      setOrganizationId((current) => current || list[0]?.id || '')
      setInvites(await listInvites())
    } catch {
      setError('団体または招待の一覧を取得できませんでした。')
    }
  }

  useEffect(() => {
    void refresh()
  }, [])

  async function issue() {
    if (!organizationId) return
    setBusy(true)
    setError('')
    setCopied(false)
    try {
      const invite = await createInvite({ organizationId, createdBy: uid, days, note: note.trim() })
      setIssued(invite)
      setNote('')
      setInvites(await listInvites())
    } catch {
      setError('招待を発行できませんでした。')
    } finally {
      setBusy(false)
    }
  }

  async function copy(text: string) {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const orgName = (id: string) => orgs.find((org) => org.id === id)?.name ?? id

  const statusOf = (invite: Invite): { label: string; className: string } => {
    if (invite.usedBy) return { label: '使用済み', className: 'bg-snow-100 text-snow-600' }
    if (new Date(invite.expiresAt).getTime() < Date.now())
      return { label: '期限切れ', className: 'bg-amber-50 text-amber-800' }
    return { label: '有効', className: 'bg-emerald-50 text-emerald-800' }
  }

  return (
    <section className="rounded-card bg-white p-6 ring-1 ring-snow-200">
      <h2 className="text-lg font-bold">編集者を招待する</h2>
      <p className="mt-2 text-sm leading-relaxed text-snow-600">
        団体を選んで招待コードを発行し、その団体の担当者に送ってください。
        受け取った人は自分でアカウントを作り、<strong>その団体の内容だけ</strong>を編集できるようになります。
        コードは1回だけ使えます。
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="inv-org" className="mb-1.5 block text-xs font-bold text-snow-600">
            団体
          </label>
          <select
            id="inv-org"
            value={organizationId}
            onChange={(e) => setOrganizationId(e.target.value)}
            className="w-full rounded-lg border border-snow-300 px-3 py-2.5 text-sm"
          >
            {orgs.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="inv-days" className="mb-1.5 block text-xs font-bold text-snow-600">
            有効期限
          </label>
          <select
            id="inv-days"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-full rounded-lg border border-snow-300 px-3 py-2.5 text-sm"
          >
            <option value={7}>7日</option>
            <option value={14}>14日</option>
            <option value={30}>30日</option>
          </select>
        </div>

        <div>
          <label htmlFor="inv-note" className="mb-1.5 block text-xs font-bold text-snow-600">
            メモ（任意）
          </label>
          <input
            id="inv-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="誰に送ったか"
            className="w-full rounded-lg border border-snow-300 px-3 py-2.5 text-sm"
          />
        </div>
      </div>

      <button
        onClick={issue}
        disabled={busy || !organizationId}
        className="mt-4 rounded-full bg-hanabi-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-hanabi-700 disabled:opacity-50"
      >
        {busy ? '発行中…' : '招待コードを発行する'}
      </button>

      {error && (
        <p role="alert" className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800">
          {error}
        </p>
      )}

      {issued && (
        <div className="mt-5 rounded-card bg-brand-50 p-5 ring-1 ring-brand-100">
          <p className="text-sm font-bold text-brand-900">
            {orgName(issued.organizationId)} の招待を発行しました
          </p>
          <p className="mt-3 rounded-lg bg-white px-3 py-2.5 font-mono text-base tracking-wider break-all">
            {issued.id}
          </p>
          <p className="mt-2 rounded-lg bg-white px-3 py-2 text-xs break-all text-snow-600">
            {inviteUrl(issued.id, window.location.origin)}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => void copy(inviteUrl(issued.id, window.location.origin))}
              className="rounded-full bg-brand-700 px-4 py-2 text-xs font-bold text-white hover:bg-brand-800"
            >
              {copied ? 'コピーしました' : '招待URLをコピー'}
            </button>
            <button
              onClick={() => void copy(issued.id)}
              className="rounded-full px-4 py-2 text-xs font-bold text-brand-700 ring-1 ring-brand-200 ring-inset hover:bg-white"
            >
              コードだけコピー
            </button>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-snow-500">
            このコードは鍵そのものです。SNSや公開の場ではなく、本人に直接送ってください。
          </p>
        </div>
      )}

      {invites.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-bold text-snow-700">発行済みの招待</h3>
          <ul className="mt-3 divide-y divide-snow-200">
            {invites.map((invite) => {
              const status = statusOf(invite)
              return (
                <li key={invite.id} className="flex flex-wrap items-center gap-3 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${status.className}`}>
                    {status.label}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-xs break-all text-snow-700">{invite.id}</span>
                    <span className="mt-0.5 block text-xs text-snow-500">
                      {orgName(invite.organizationId)}
                      {invite.note && ` ・ ${invite.note}`}
                    </span>
                  </span>
                  {!invite.usedBy && (
                    <button
                      onClick={async () => {
                        await revokeInvite(invite.id)
                        setInvites(await listInvites())
                      }}
                      className="rounded-full px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-50"
                    >
                      取り消す
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </section>
  )
}
