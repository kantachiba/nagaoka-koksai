import { useEffect, useMemo, useRef, useState } from 'react'
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import { db } from './firebase'
import LocalizedInput from './fields/LocalizedInput'
import BodyInput, { normalizeStoredBody } from './fields/BodyInput'
import type { LocalizedField } from '../i18n/text'
import { emptyDoc, prepareBodyForSave, type LocalizedDoc } from '../lib/blocks'
import { SUPPORT_LANGUAGES } from '../lib/support-languages'
import type { ApplicationType, Audience, Status, Visibility } from '../lib/types'

/**
 * イベントの編集。
 *
 * 運営はすべての団体の、編集者は自分の団体のものだけを扱える。
 * 実際の権限は Firestore ルールが担保しており、ここでの出し分けは見た目のみ。
 */

type Scope = { kind: 'admin' } | { kind: 'editor'; organizationId: string }

type Org = { id: string; name: string }
type Tag = { id: string; name: string }

type Draft = {
  id: string
  slug: string
  organizationId: string
  title: LocalizedField
  summary: LocalizedField
  body: LocalizedDoc
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  venue: LocalizedField
  address: LocalizedField
  access: LocalizedField
  mapUrl: string
  fee: LocalizedField
  isFree: boolean
  supportLanguages: string[]
  audience: Audience
  capacity: string
  tagIds: string[]
  applicationType: ApplicationType
  applicationUrl: string
  applicationEmail: string
  visibility: Visibility
  status: Status
  /** 管理画面ではまだ編集しない項目。保存し直しても消えないよう持ち回る */
  preserved: { commentsEnabled: boolean; imageId?: string; instagramUrl?: string }
}

const emptyField = (): LocalizedField => ({ ja: '', en: '' })

const randomSuffix = () => Math.random().toString(36).slice(2, 6)

/** 端末のローカル日付（toISOString は UTC になり、朝9時前に前日になるため使わない） */
function localToday(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/**
 * 公開側は日時文字列をそのまま切り出して表示する（lib/event-helpers.ts の dateOf / timeOf）。
 * 日本時間の表記で保存しておかないと、表示がずれる。
 */
const toIso = (date: string, time: string) => `${date}T${time}:00+09:00`

const VISIBILITY_OPTIONS: Array<{ value: Visibility; label: string }> = [
  { value: 'public', label: '公開（申込を受け付ける）' },
  { value: 'announce', label: '告知のみ（申込は受け付けない）' },
  { value: 'invite', label: '招待制（「※招待制」と表示）' },
  { value: 'hidden', label: '告知しない（一覧・詳細に出さず、活動報告からだけ辿れる）' },
]

const AUDIENCE_OPTIONS: Array<{ value: Audience; label: string }> = [
  { value: 'anyone', label: 'どなたでも' },
  { value: 'family', label: '親子・ファミリー向け' },
  { value: 'invited', label: '招待された方' },
]

function newDraft(organizationId: string): Draft {
  const today = localToday()
  return {
    id: '',
    slug: `${today}-${randomSuffix()}`,
    organizationId,
    title: emptyField(),
    summary: emptyField(),
    body: { ja: emptyDoc() },
    startDate: today,
    startTime: '10:00',
    endDate: today,
    endTime: '12:00',
    venue: emptyField(),
    address: emptyField(),
    access: emptyField(),
    mapUrl: '',
    fee: { ja: '無料', en: 'Free' },
    isFree: true,
    supportLanguages: ['ja'],
    audience: 'anyone',
    capacity: '',
    tagIds: [],
    applicationType: 'none',
    applicationUrl: '',
    applicationEmail: '',
    visibility: 'public',
    status: 'draft',
    preserved: { commentsEnabled: false },
  }
}

function fromStored(id: string, data: Record<string, unknown>): Draft {
  const startAt = String(data.startAt ?? '')
  const endAt = String(data.endAt ?? '')
  const field = (key: string) => (data[key] as LocalizedField | undefined) ?? emptyField()
  return {
    id,
    slug: String(data.slug ?? ''),
    organizationId: String(data.organizationId ?? ''),
    title: field('title'),
    summary: field('summary'),
    body: normalizeStoredBody(data.body),
    startDate: startAt.slice(0, 10),
    startTime: startAt.slice(11, 16),
    endDate: endAt.slice(0, 10),
    endTime: endAt.slice(11, 16),
    venue: field('venue'),
    address: field('address'),
    access: field('access'),
    mapUrl: String(data.mapUrl ?? ''),
    fee: field('fee'),
    isFree: data.isFree === true,
    supportLanguages: (data.supportLanguages as string[]) ?? [],
    audience: (data.audience as Audience) ?? 'anyone',
    capacity: data.capacity === undefined ? '' : String(data.capacity),
    tagIds: (data.tagIds as string[]) ?? [],
    applicationType: (data.applicationType as ApplicationType) ?? 'none',
    applicationUrl: String(data.applicationUrl ?? ''),
    applicationEmail: String(data.applicationEmail ?? ''),
    visibility: (data.visibility as Visibility) ?? 'public',
    status: (data.status as Status) ?? 'draft',
    preserved: {
      commentsEnabled: data.commentsEnabled === true,
      ...(data.imageId ? { imageId: String(data.imageId) } : {}),
      ...(data.instagramUrl ? { instagramUrl: String(data.instagramUrl) } : {}),
    },
  }
}

/** 保存前の確認。問題があればその内容を返す */
function validate(draft: Draft): string {
  if (!draft.title.ja?.trim()) return '日本語のタイトルは必須です。'
  if (!draft.startDate || !draft.startTime || !draft.endDate || !draft.endTime) {
    return '開始・終了の日付と時刻を入力してください。'
  }
  if (toIso(draft.endDate, draft.endTime) < toIso(draft.startDate, draft.startTime)) {
    return '終了日時が開始日時より前になっています。'
  }
  if (draft.status === 'published' && !draft.venue.ja?.trim()) {
    return '公開するには、日本語の会場名が必要です。'
  }
  if (draft.capacity.trim() && !(Number(draft.capacity) > 0)) {
    return '定員は1以上の数字で入力してください。'
  }
  if (draft.mapUrl.trim() && !/^https?:\/\//.test(draft.mapUrl.trim())) {
    return '地図のリンクは https:// から始まるURLで入力してください。'
  }
  if (draft.visibility === 'public' && draft.applicationType === 'external') {
    const url = draft.applicationUrl.trim()
    const email = draft.applicationEmail.trim()
    if (!url && !email) return '申込先のURLかメールアドレスのどちらかを入力してください。'
    if (url && !/^https?:\/\//.test(url)) return '申込先のURLは https:// から始まる形で入力してください。'
  }
  if (!/^[a-z0-9-]+$/.test(draft.slug)) return 'URL は英小文字・数字・ハイフンだけで入力してください。'
  return ''
}

export default function EventEditor({ scope }: { scope: Scope }) {
  const [orgs, setOrgs] = useState<Org[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [events, setEvents] = useState<Draft[]>([])
  const [draft, setDraft] = useState<Draft | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const [savedAt, setSavedAt] = useState('')
  const autosaveTimer = useRef<number | null>(null)

  const defaultOrg = scope.kind === 'editor' ? scope.organizationId : (orgs[0]?.id ?? '')

  async function load() {
    setError('')
    try {
      const [orgSnap, tagSnap, eventSnap] = await Promise.all([
        getDocs(collection(db(), 'organizations')),
        getDocs(collection(db(), 'tags')),
        getDocs(collection(db(), 'events')),
      ])

      setOrgs(
        orgSnap.docs.map((row) => ({
          id: row.id,
          name: String((row.data().name as Record<string, string> | undefined)?.ja ?? row.id),
        })),
      )
      setTags(
        tagSnap.docs
          .map((row) => ({
            id: row.id,
            name: String((row.data().name as Record<string, string> | undefined)?.ja ?? row.id),
            order: Number(row.data().order ?? 0),
          }))
          .sort((a, b) => a.order - b.order),
      )

      const all = eventSnap.docs
        .map((row) => fromStored(row.id, row.data()))
        .sort((a, b) => toIso(b.startDate, b.startTime).localeCompare(toIso(a.startDate, a.startTime)))

      // 編集者には自分の団体のぶんだけ見せる（書き込みはルール側で制限済み）
      setEvents(
        scope.kind === 'admin'
          ? all
          : all.filter((event) => event.organizationId === scope.organizationId),
      )
    } catch {
      setError('データを読み込めませんでした。')
    }
  }

  useEffect(() => {
    void load()
  }, [])

  /** 既存と重複しない slug か（ビルドが壊れる原因になるため事前に弾く） */
  const slugTaken = useMemo(() => {
    if (!draft) return false
    return events.some((event) => event.slug === draft.slug && event.id !== draft.id)
  }, [draft, events])

  async function save(options: { silent?: boolean } = {}) {
    if (!draft) return
    const problem = validate(draft) || (slugTaken ? 'この URL はすでに使われています。別の値にしてください。' : '')
    if (problem) {
      if (options.silent) return
      return setError(problem)
    }

    setBusy(true)
    setError('')
    try {
      const id = draft.id || draft.slug
      const external = draft.applicationType === 'external'
      await setDoc(doc(db(), 'events', id), {
        slug: draft.slug,
        organizationId: draft.organizationId,
        title: draft.title,
        summary: draft.summary,
        body: prepareBodyForSave(draft.body),
        startAt: toIso(draft.startDate, draft.startTime),
        endAt: toIso(draft.endDate, draft.endTime),
        venue: draft.venue,
        address: draft.address,
        access: draft.access,
        ...(draft.mapUrl.trim() ? { mapUrl: draft.mapUrl.trim() } : {}),
        fee: draft.fee,
        isFree: draft.isFree,
        supportLanguages: draft.supportLanguages,
        audience: draft.audience,
        ...(draft.capacity.trim() ? { capacity: Number(draft.capacity) } : {}),
        tagIds: draft.tagIds,
        applicationType: draft.applicationType,
        ...(external && draft.applicationUrl.trim() ? { applicationUrl: draft.applicationUrl.trim() } : {}),
        ...(external && draft.applicationEmail.trim() ? { applicationEmail: draft.applicationEmail.trim() } : {}),
        visibility: draft.visibility,
        ...draft.preserved,
        status: draft.status,
        updatedAt: serverTimestamp(),
      })
      if (options.silent) {
        // 自動保存では編集を続けられるよう、画面はそのままにする
        setSavedAt(new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }))
        if (!draft.id) setDraft({ ...draft, id })
        return
      }
      setNotice(
        draft.status === 'published'
          ? '保存しました。公開サイトには最大30分ほどで反映されます。'
          : '下書きとして保存しました。',
      )
      setDraft(null)
      await load()
    } catch {
      setError('保存できませんでした。権限またはメールアドレスの確認状況をご確認ください。')
    } finally {
      setBusy(false)
    }
  }

  /**
   * オートセーブ。
   * 下書きのあいだだけ、入力が止まって数秒たったら静かに保存する。
   * 公開中のイベントを勝手に書き換えないよう、status が draft のときに限る。
   */
  useEffect(() => {
    if (!draft || draft.status !== 'draft' || !draft.title.ja?.trim()) return
    if (autosaveTimer.current) window.clearTimeout(autosaveTimer.current)
    autosaveTimer.current = window.setTimeout(() => void save({ silent: true }), 3000)
    return () => {
      if (autosaveTimer.current) window.clearTimeout(autosaveTimer.current)
    }
  }, [draft])

  async function remove(id: string) {
    if (!confirm('このイベントを削除します。よろしいですか？')) return
    try {
      await deleteDoc(doc(db(), 'events', id))
      await load()
      setNotice('削除しました。')
    } catch {
      setError('削除できませんでした。')
    }
  }

  function openDraft(next: Draft) {
    setDraft(next)
    setNotice('')
    setError('')
    setSavedAt('')
  }

  const orgName = (id: string) => orgs.find((org) => org.id === id)?.name ?? id

  const toggle = (list: string[], value: string) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value]

  const chip = (on: boolean) =>
    `rounded-card px-3.5 py-1.5 text-sm font-semibold border-2 ${
      on ? 'bg-eager-green text-white border-eager-green' : 'bg-white text-pencil-gray border-faded-gray'
    }`

  const inputClass = 'w-full rounded-card border border-faded-gray px-3 py-2.5 text-sm'
  const labelClass = 'mb-1.5 block text-xs font-bold text-pencil-gray'

  if (draft) {
    return (
      <section className="rounded-card bg-white p-6 border-2 border-faded-gray">
        <h2 className="text-lg font-bold">{draft.id ? 'イベントを編集' : 'イベントを作成'}</h2>

        <div className="mt-5 space-y-5">
          {scope.kind === 'admin' && (
            <div>
              <label className={labelClass}>主催団体</label>
              <select value={draft.organizationId}
                onChange={(e) => setDraft({ ...draft, organizationId: e.target.value })}
                className={inputClass}>
                {orgs.map((org) => (
                  <option key={org.id} value={org.id}>{org.name}</option>
                ))}
              </select>
            </div>
          )}

          <LocalizedInput label="タイトル" value={draft.title}
            onChange={(title) => setDraft({ ...draft, title })} />

          <LocalizedInput label="ひとこと説明" value={draft.summary} multiline
            hint="一覧やSNSシェアに出る短い紹介です。"
            onChange={(summary) => setDraft({ ...draft, summary })} />

          <BodyInput value={draft.body} organizationId={draft.organizationId}
            onChange={(body) => setDraft({ ...draft, body })} />

          <fieldset className="rounded-card border border-faded-gray p-4">
            <legend className="px-1 text-sm font-bold text-charcoal">日時</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>開始</label>
                <div className="flex gap-2">
                  <input type="date" value={draft.startDate}
                    onChange={(e) => {
                      // 終了日が開始日より前にならないよう、未調整なら一緒に動かす
                      const startDate = e.target.value
                      const endDate = draft.endDate < startDate || draft.endDate === draft.startDate ? startDate : draft.endDate
                      setDraft({ ...draft, startDate, endDate })
                    }}
                    className={inputClass} />
                  <input type="time" value={draft.startTime}
                    onChange={(e) => setDraft({ ...draft, startTime: e.target.value })}
                    className={`${inputClass} max-w-32`} />
                </div>
              </div>
              <div>
                <label className={labelClass}>終了</label>
                <div className="flex gap-2">
                  <input type="date" value={draft.endDate} min={draft.startDate}
                    onChange={(e) => setDraft({ ...draft, endDate: e.target.value })}
                    className={inputClass} />
                  <input type="time" value={draft.endTime}
                    onChange={(e) => setDraft({ ...draft, endTime: e.target.value })}
                    className={`${inputClass} max-w-32`} />
                </div>
              </div>
            </div>
            <p className="mt-2 text-xs text-pencil-gray">日本時間で入力してください。</p>
          </fieldset>

          <LocalizedInput label="会場名" value={draft.venue}
            onChange={(venue) => setDraft({ ...draft, venue })} />

          <LocalizedInput label="住所" value={draft.address}
            onChange={(address) => setDraft({ ...draft, address })} />

          <LocalizedInput label="アクセス" value={draft.access} multiline
            hint="最寄り駅からの行き方や駐車場の有無など。"
            onChange={(access) => setDraft({ ...draft, access })} />

          <div>
            <label className={labelClass}>地図のリンク（任意）</label>
            <input type="url" value={draft.mapUrl} placeholder="https://maps.google.com/..."
              onChange={(e) => setDraft({ ...draft, mapUrl: e.target.value })}
              className={inputClass} />
          </div>

          <div>
            <LocalizedInput label="参加費" value={draft.fee}
              hint="「無料」「500円（材料費込み）」など、そのまま表示されます。"
              onChange={(fee) => setDraft({ ...draft, fee })} />
            <label className="mt-2 flex items-center gap-2 text-sm text-charcoal">
              <input type="checkbox" checked={draft.isFree}
                onChange={(e) => setDraft({ ...draft, isFree: e.target.checked })} />
              無料のイベントとして「無料」のバッジを付ける
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>参加対象</label>
              <select value={draft.audience}
                onChange={(e) => setDraft({ ...draft, audience: e.target.value as Audience })}
                className={inputClass}>
                {AUDIENCE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>定員（任意）</label>
              <input type="number" min="1" value={draft.capacity}
                onChange={(e) => setDraft({ ...draft, capacity: e.target.value })}
                className={inputClass} />
            </div>
          </div>

          <fieldset className="rounded-card border border-faded-gray p-4">
            <legend className="px-1 text-sm font-bold text-charcoal">対応言語</legend>
            <p className="mb-3 text-xs text-pencil-gray">会場で通じる言語を選んでください。</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(SUPPORT_LANGUAGES).map(([code, label]) => {
                const on = draft.supportLanguages.includes(code)
                return (
                  <button key={code} type="button" aria-pressed={on}
                    onClick={() => setDraft({ ...draft, supportLanguages: toggle(draft.supportLanguages, code) })}
                    className={chip(on)}>
                    {label.ja}
                  </button>
                )
              })}
            </div>
          </fieldset>

          <fieldset className="rounded-card border border-faded-gray p-4">
            <legend className="px-1 text-sm font-bold text-charcoal">タグ</legend>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const on = draft.tagIds.includes(tag.id)
                return (
                  <button key={tag.id} type="button" aria-pressed={on}
                    onClick={() => setDraft({ ...draft, tagIds: toggle(draft.tagIds, tag.id) })}
                    className={chip(on)}>
                    {tag.name}
                  </button>
                )
              })}
            </div>
          </fieldset>

          <fieldset className="rounded-card border border-faded-gray p-4">
            <legend className="px-1 text-sm font-bold text-charcoal">告知と申込</legend>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>告知のしかた</label>
                <select value={draft.visibility}
                  onChange={(e) => setDraft({ ...draft, visibility: e.target.value as Visibility })}
                  className={inputClass}>
                  {VISIBILITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {draft.visibility === 'public' && (
                <div>
                  <label className={labelClass}>申込方法</label>
                  <select value={draft.applicationType}
                    onChange={(e) => setDraft({ ...draft, applicationType: e.target.value as ApplicationType })}
                    className={inputClass}>
                    <option value="none">申込不要（直接会場へ）</option>
                    <option value="external">外部のフォーム・メールで受け付ける</option>
                    {draft.applicationType === 'internal' && (
                      <option value="internal">サイト内フォーム（準備中のため問い合わせ案内が出ます）</option>
                    )}
                  </select>
                </div>
              )}

              {draft.visibility === 'public' && draft.applicationType === 'external' && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>申込フォームのURL</label>
                    <input type="url" value={draft.applicationUrl} placeholder="https://..."
                      onChange={(e) => setDraft({ ...draft, applicationUrl: e.target.value })}
                      className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>申込先メールアドレス</label>
                    <input type="email" value={draft.applicationEmail}
                      onChange={(e) => setDraft({ ...draft, applicationEmail: e.target.value })}
                      className={inputClass} />
                  </div>
                  <p className="text-xs text-pencil-gray sm:col-span-2">
                    どちらか一方で構いません。両方あるときはURLが優先されます。
                  </p>
                </div>
              )}
            </div>
          </fieldset>

          <div>
            <label className={labelClass}>URL（公開ページのアドレスになります）</label>
            <input value={draft.slug}
              onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
              className={`${inputClass} font-mono`} />
            <p className="mt-1 text-xs text-pencil-gray">
              /events/{draft.slug || '…'}
              {slugTaken && <span className="ml-2 font-bold text-rose-700">すでに使われています</span>}
            </p>
          </div>

          <div>
            <label className={labelClass}>公開状態</label>
            <select value={draft.status}
              onChange={(e) => setDraft({ ...draft, status: e.target.value as Status })}
              className={inputClass}>
              <option value="draft">下書き（サイトには出ません）</option>
              <option value="published">公開する</option>
            </select>
          </div>
        </div>

        {error && <p role="alert" className="mt-4 rounded-card bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p>}

        <div className="mt-6 flex flex-wrap gap-3">
          {savedAt && (
            <span className="self-center text-xs text-pencil-gray">自動保存しました {savedAt}</span>
          )}
          <button onClick={() => void save()} disabled={busy}
            className="rounded-card bg-eager-green px-6 py-3 text-sm font-bold text-white hover:bg-eager-green disabled:opacity-50">
            {busy ? '保存中…' : '保存する'}
          </button>
          <button onClick={() => { setDraft(null); setError(''); void load() }}
            className="rounded-card px-6 py-3 text-sm font-bold text-pencil-gray hover:bg-paper-white">
            やめる
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="rounded-card bg-white p-6 border-2 border-faded-gray">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold">イベント</h2>
        <button onClick={() => openDraft(newDraft(defaultOrg))}
          disabled={!defaultOrg}
          className="rounded-card bg-eager-green px-5 py-2.5 text-sm font-bold text-white hover:bg-eager-green disabled:opacity-50">
          新しく作る
        </button>
      </div>

      {notice && <p className="mt-4 rounded-card bg-emerald-50 px-3 py-2 text-sm text-emerald-900">{notice}</p>}
      {error && <p role="alert" className="mt-4 rounded-card bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p>}

      {events.length === 0 ? (
        <p className="mt-5 rounded-card border border-dashed border-faded-gray px-4 py-10 text-center text-sm text-pencil-gray">
          まだイベントがありません。「新しく作る」から追加してください。
        </p>
      ) : (
        <ul className="mt-5 divide-y divide-faded-gray">
          {events.map((event) => (
            <li key={event.id} className="flex flex-wrap items-center gap-3 py-3">
              <span className={`rounded-card px-2 py-0.5 text-xs font-bold ${
                event.status === 'published' ? 'bg-emerald-50 text-emerald-800' : 'bg-paper-white text-pencil-gray'
              }`}>
                {event.status === 'published' ? '公開中' : '下書き'}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-charcoal">{event.title.ja || '(無題)'}</span>
                <span className="mt-0.5 block text-xs text-pencil-gray">
                  {event.startDate} {event.startTime}
                  {event.visibility === 'hidden' && ' ・ 告知なし'}
                  {scope.kind === 'admin' && ` ・ ${orgName(event.organizationId)}`}
                </span>
              </span>
              <button onClick={() => openDraft(event)}
                className="rounded-card px-3 py-1.5 text-xs font-bold text-blue-text border-2 border-eager-green hover:bg-storybook-green">
                編集
              </button>
              <button onClick={() => void remove(event.id)}
                className="rounded-card px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-50">
                削除
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
