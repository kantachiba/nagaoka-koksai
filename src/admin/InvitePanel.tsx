import { useEffect, useState } from 'react'
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore'
import { db } from './firebase'
import { createInvite, inviteUrl, listInvites, revokeInvite } from './invites'
import type { Invite, InviteRole } from '../lib/types'

/**
 * 招待の発行・管理（運営のみ）。
 *
 * 発行したコードは、運営が本人へ private に渡す前提。
 * コードそのものが鍵なので、画面上でもコピーしやすくしている。
 *
 * 運営の招待は編集者の招待より強い（全団体の内容を操作でき、招待も発行できる）。
 * 取り違えないよう、役割の選択と発行後の表示で区別している。
 */

type Org = { id: string; name: string }
type Admin = { uid: string; email: string }

const ROLE_LABEL: Record<InviteRole, string> = { editor: '団体の編集者', admin: '運営' }

export default function InvitePanel({ uid }: { uid: string }) {
  const [orgs, setOrgs] = useState<Org[]>([])
  const [admins, setAdmins] = useState<Admin[]>([])
  const [invites, setInvites] = useState<Invite[]>([])
  const [role, setRole] = useState<InviteRole>('editor')
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

      const adminSnapshot = await getDocs(collection(db(), 'admins'))
      setAdmins(
        adminSnapshot.docs.map((row) => ({
          uid: row.id,
          email: String(row.data().email ?? row.id),
        })),
      )
    } catch {
      setError('団体または招待の一覧を取得できませんでした。')
    }
  }

  useEffect(() => {
    void refresh()
  }, [])

  async function issue() {
    if (role === 'editor' && !organizationId) return
    setBusy(true)
    setError('')
    setCopied(false)
    try {
      const invite = await createInvite({
        role,
        organizationId: role === 'editor' ? organizationId : undefined,
        createdBy: uid,
        days,
        note: note.trim(),
      })
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

  async function removeAdmin(target: Admin) {
    if (!confirm(`${target.email} を運営から外します。よろしいですか？`)) return
    try {
      await deleteDoc(doc(db(), 'admins', target.uid))
      await refresh()
    } catch {
      setError('運営を外せませんでした。')
    }
  }

  const orgName = (id: string) => orgs.find((org) => org.id === id)?.name ?? id

  /** 招待の宛先を1行で表す */
  const targetOf = (invite: Invite) =>
    invite.role === 'admin' ? '運営' : orgName(invite.organizationId ?? '')

  const statusOf = (invite: Invite): { label: string; className: string } => {
    if (invite.usedBy) return { label: '使用済み', className: 'bg-paper-white text-pencil-gray' }
    if (new Date(invite.expiresAt).getTime() < Date.now())
      return { label: '期限切れ', className: 'bg-paper-white text-charcoal border-2 border-faded-gray' }
    return { label: '有効', className: 'bg-storybook-green text-green-text' }
  }

  return (
    <section className="rounded-card border-2 border-faded-gray bg-white p-6">
      <h2 className="text-lg font-bold">メンバーを招待する</h2>
      <p className="mt-2 text-sm leading-relaxed text-pencil-gray">
        招待コードを発行して、本人に送ってください。受け取った人は自分でアカウントを作れます。
        コードは1回だけ使えます。
      </p>

      <fieldset className="mt-5">
        <legend className="mb-2 text-xs font-bold text-pencil-gray">招待する役割</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {(['editor', 'admin'] as const).map((value) => (
            <label
              key={value}
              className={`flex cursor-pointer gap-3 rounded-card border-2 p-4 transition-colors ${
                role === value ? 'border-eager-green bg-storybook-green' : 'border-faded-gray bg-white'
              }`}
            >
              <input
                type="radio"
                name="invite-role"
                value={value}
                checked={role === value}
                onChange={() => setRole(value)}
                className="mt-0.5"
              />
              <span className="min-w-0">
                <span className="block text-sm font-bold text-charcoal">{ROLE_LABEL[value]}</span>
                <span className="mt-1 block text-xs leading-relaxed text-pencil-gray">
                  {value === 'editor'
                    ? '選んだ団体の活動報告・イベント・団体情報だけを編集できます。'
                    : 'すべての団体の内容を編集でき、招待も発行できます。信頼できる人にだけ送ってください。'}
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {role === 'editor' && (
          <div>
            <label htmlFor="inv-org" className="mb-1.5 block text-xs font-bold text-pencil-gray">
              団体
            </label>
            <select
              id="inv-org"
              value={organizationId}
              onChange={(e) => setOrganizationId(e.target.value)}
              className="w-full rounded-card border-2 border-faded-gray px-3 py-2.5 text-sm"
            >
              {orgs.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label htmlFor="inv-days" className="mb-1.5 block text-xs font-bold text-pencil-gray">
            有効期限
          </label>
          <select
            id="inv-days"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-full rounded-card border-2 border-faded-gray px-3 py-2.5 text-sm"
          >
            <option value={7}>7日</option>
            <option value={14}>14日</option>
            <option value={30}>30日</option>
          </select>
        </div>

        <div>
          <label htmlFor="inv-note" className="mb-1.5 block text-xs font-bold text-pencil-gray">
            メモ（任意）
          </label>
          <input
            id="inv-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="誰に送ったか"
            className="w-full rounded-card border-2 border-faded-gray px-3 py-2.5 text-sm"
          />
        </div>
      </div>

      <button
        onClick={issue}
        disabled={busy || (role === 'editor' && !organizationId)}
        className="mt-4 rounded-card bg-eager-green px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
      >
        {busy ? '発行中…' : `${ROLE_LABEL[role]}の招待コードを発行する`}
      </button>

      {error && (
        <p role="alert" className="mt-4 rounded-card border-2 border-faded-gray px-3 py-2 text-sm text-charcoal">
          {error}
        </p>
      )}

      {issued && (
        <div className="mt-5 rounded-card border-2 border-eager-green bg-storybook-green p-5">
          <p className="text-sm font-bold text-charcoal">
            {issued.role === 'admin' ? '運営' : orgName(issued.organizationId ?? '')} の招待を発行しました
          </p>
          <p className="mt-3 rounded-card bg-white px-3 py-2.5 font-mono text-base tracking-wider break-all">
            {issued.id}
          </p>
          <p className="mt-2 rounded-card bg-white px-3 py-2 text-xs break-all text-pencil-gray">
            {inviteUrl(issued.id, window.location.origin)}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => void copy(inviteUrl(issued.id, window.location.origin))}
              className="rounded-card bg-eager-green px-4 py-2 text-xs font-bold text-white"
            >
              {copied ? 'コピーしました' : '招待URLをコピー'}
            </button>
            <button
              onClick={() => void copy(issued.id)}
              className="rounded-card border-2 border-eager-green px-4 py-2 text-xs font-bold text-blue-text hover:bg-white"
            >
              コードだけコピー
            </button>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-pencil-gray">
            {issued.role === 'admin'
              ? 'このコードはサイト全体を操作できる権限そのものです。SNSや公開の場ではなく、本人に直接送ってください。'
              : 'このコードは鍵そのものです。SNSや公開の場ではなく、本人に直接送ってください。'}
          </p>
        </div>
      )}

      {invites.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-bold text-charcoal">発行済みの招待</h3>
          <ul className="mt-3 divide-y divide-faded-gray">
            {invites.map((invite) => {
              const status = statusOf(invite)
              return (
                <li key={invite.id} className="flex flex-wrap items-center gap-3 py-3">
                  <span className={`rounded-card px-2 py-0.5 text-xs font-bold ${status.className}`}>
                    {status.label}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-xs break-all text-charcoal">{invite.id}</span>
                    <span className="mt-0.5 block text-xs text-pencil-gray">
                      {ROLE_LABEL[invite.role]} ・ {targetOf(invite)}
                      {invite.note && ` ・ ${invite.note}`}
                    </span>
                  </span>
                  {!invite.usedBy && (
                    <button
                      onClick={async () => {
                        await revokeInvite(invite.id)
                        setInvites(await listInvites())
                      }}
                      className="rounded-card px-3 py-1.5 text-xs font-bold text-charcoal hover:bg-storybook-green"
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

      {admins.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-bold text-charcoal">現在の運営</h3>
          <ul className="mt-3 divide-y divide-faded-gray">
            {admins.map((admin) => (
              <li key={admin.uid} className="flex flex-wrap items-center gap-3 py-3">
                <span className="min-w-0 flex-1 text-sm break-all text-charcoal">
                  {admin.email}
                  {admin.uid === uid && (
                    <span className="ml-2 text-xs font-bold text-pencil-gray">あなた</span>
                  )}
                </span>
                {admin.uid !== uid && (
                  <button
                    onClick={() => void removeAdmin(admin)}
                    className="rounded-card px-3 py-1.5 text-xs font-bold text-charcoal hover:bg-storybook-green"
                  >
                    運営から外す
                  </button>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs leading-relaxed text-pencil-gray">
            自分を外すことはできません。外れてしまった場合は Firebase コンソールの Firestore で
            admins コレクションに自分のUIDを追加すると戻せます。
          </p>
        </div>
      )}
    </section>
  )
}
