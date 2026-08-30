import { useEffect, useMemo, useState } from 'react'
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
import PhotoInput, { type PhotoEntry } from './fields/PhotoInput'
import type { LocalizedField } from '../i18n/text'

/**
 * 活動報告の編集。
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
  body: LocalizedField[]
  heldOn: string
  publishedAt: string
  participants: string
  tagIds: string[]
  photos: PhotoEntry[]
  status: 'draft' | 'published'
}

const emptyField = (): LocalizedField => ({ ja: '', furigana: '', en: '' })

const randomSuffix = () => Math.random().toString(36).slice(2, 6)

const todayIso = () => new Date().toISOString().slice(0, 10)

function newDraft(organizationId: string): Draft {
  const heldOn = todayIso()
  return {
    id: '',
    slug: `${heldOn}-${randomSuffix()}`,
    organizationId,
    title: emptyField(),
    summary: emptyField(),
    body: [emptyField()],
    heldOn,
    publishedAt: heldOn,
    participants: '',
    tagIds: [],
    photos: [],
    status: 'draft',
  }
}

export default function ReportEditor({ scope }: { scope: Scope }) {
  const [orgs, setOrgs] = useState<Org[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [reports, setReports] = useState<Draft[]>([])
  const [draft, setDraft] = useState<Draft | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

  const defaultOrg = scope.kind === 'editor' ? scope.organizationId : (orgs[0]?.id ?? '')

  async function load() {
    setError('')
    try {
      const [orgSnap, tagSnap, reportSnap] = await Promise.all([
        getDocs(collection(db(), 'organizations')),
        getDocs(collection(db(), 'tags')),
        getDocs(collection(db(), 'reports')),
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

      const all = reportSnap.docs.map((row) => {
        const data = row.data()
        return {
          id: row.id,
          slug: String(data.slug ?? ''),
          organizationId: String(data.organizationId ?? ''),
          title: (data.title as LocalizedField) ?? emptyField(),
          summary: (data.summary as LocalizedField) ?? emptyField(),
          body: (data.body as LocalizedField[]) ?? [emptyField()],
          heldOn: String(data.heldOn ?? ''),
          publishedAt: String(data.publishedAt ?? ''),
          participants: data.participants === undefined ? '' : String(data.participants),
          tagIds: (data.tagIds as string[]) ?? [],
          photos: (data.photos as PhotoEntry[]) ?? [],
          status: (data.status as 'draft' | 'published') ?? 'draft',
        }
      })

      // 編集者には自分の団体のぶんだけ見せる（書き込みはルール側で制限済み）
      setReports(
        scope.kind === 'admin'
          ? all
          : all.filter((report) => report.organizationId === scope.organizationId),
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
    return reports.some((report) => report.slug === draft.slug && report.id !== draft.id)
  }, [draft, reports])

  async function save() {
    if (!draft) return
    if (!draft.title.ja?.trim()) return setError('日本語のタイトルは必須です。')
    if (!/^[a-z0-9-]+$/.test(draft.slug)) return setError('URL は英小文字・数字・ハイフンだけで入力してください。')
    if (slugTaken) return setError('この URL はすでに使われています。別の値にしてください。')

    setBusy(true)
    setError('')
    try {
      const id = draft.id || `${draft.slug}`
      await setDoc(doc(db(), 'reports', id), {
        slug: draft.slug,
        organizationId: draft.organizationId,
        title: draft.title,
        summary: draft.summary,
        body: draft.body.filter((paragraph) => paragraph.ja?.trim()),
        heldOn: draft.heldOn,
        publishedAt: draft.publishedAt,
        ...(draft.participants.trim() ? { participants: Number(draft.participants) } : {}),
        tagIds: draft.tagIds,
        photos: draft.photos,
        status: draft.status,
        updatedAt: serverTimestamp(),
      })
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

  async function remove(id: string) {
    if (!confirm('この活動報告を削除します。よろしいですか？')) return
    try {
      await deleteDoc(doc(db(), 'reports', id))
      await load()
      setNotice('削除しました。')
    } catch {
      setError('削除できませんでした。')
    }
  }

  const orgName = (id: string) => orgs.find((org) => org.id === id)?.name ?? id

  if (draft) {
    return (
      <section className="rounded-card bg-white p-6 ring-1 ring-snow-200">
        <h2 className="text-lg font-bold">{draft.id ? '活動報告を編集' : '活動報告を作成'}</h2>

        <div className="mt-5 space-y-5">
          {scope.kind === 'admin' && (
            <div>
              <label className="mb-1.5 block text-xs font-bold text-snow-600">団体</label>
              <select
                value={draft.organizationId}
                onChange={(e) => setDraft({ ...draft, organizationId: e.target.value })}
                className="w-full rounded-lg border border-snow-300 px-3 py-2.5 text-sm"
              >
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

          <fieldset className="rounded-card border border-snow-200 bg-white p-4">
            <legend className="px-1 text-sm font-bold text-snow-800">本文</legend>
            <p className="mb-3 text-xs text-snow-500">段落ごとに分けて入力します。</p>
            <div className="space-y-4">
              {draft.body.map((paragraph, index) => (
                <div key={index}>
                  <LocalizedInput label={`${index + 1}段落目`} value={paragraph} multiline
                    onChange={(next) =>
                      setDraft({
                        ...draft,
                        body: draft.body.map((p, i) => (i === index ? next : p)),
                      })
                    } />
                  {draft.body.length > 1 && (
                    <button type="button"
                      onClick={() => setDraft({ ...draft, body: draft.body.filter((_, i) => i !== index) })}
                      className="mt-1 rounded px-2 py-1 text-xs font-bold text-rose-700 hover:bg-rose-50">
                      この段落を削除
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button type="button"
              onClick={() => setDraft({ ...draft, body: [...draft.body, emptyField()] })}
              className="mt-3 rounded-full px-4 py-2 text-xs font-bold text-brand-700 ring-1 ring-brand-200 ring-inset hover:bg-brand-50">
              段落を追加
            </button>
          </fieldset>

          <PhotoInput organizationId={draft.organizationId} photos={draft.photos}
            onChange={(photos) => setDraft({ ...draft, photos })} />

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-snow-600">実施日</label>
              <input type="date" value={draft.heldOn}
                onChange={(e) => setDraft({ ...draft, heldOn: e.target.value })}
                className="w-full rounded-lg border border-snow-300 px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-snow-600">公開日</label>
              <input type="date" value={draft.publishedAt}
                onChange={(e) => setDraft({ ...draft, publishedAt: e.target.value })}
                className="w-full rounded-lg border border-snow-300 px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-snow-600">参加者数（任意）</label>
              <input type="number" min="0" value={draft.participants}
                onChange={(e) => setDraft({ ...draft, participants: e.target.value })}
                className="w-full rounded-lg border border-snow-300 px-3 py-2.5 text-sm" />
            </div>
          </div>

          <fieldset className="rounded-card border border-snow-200 p-4">
            <legend className="px-1 text-sm font-bold text-snow-800">タグ</legend>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const on = draft.tagIds.includes(tag.id)
                return (
                  <button key={tag.id} type="button"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        tagIds: on
                          ? draft.tagIds.filter((id) => id !== tag.id)
                          : [...draft.tagIds, tag.id],
                      })
                    }
                    aria-pressed={on}
                    className={`rounded-full px-3.5 py-1.5 text-sm font-semibold ring-1 ring-inset ${
                      on ? 'bg-brand-700 text-white ring-brand-700' : 'bg-white text-snow-600 ring-snow-300'
                    }`}>
                    {tag.name}
                  </button>
                )
              })}
            </div>
          </fieldset>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-snow-600">
              URL（公開ページのアドレスになります）
            </label>
            <input value={draft.slug}
              onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
              className="w-full rounded-lg border border-snow-300 px-3 py-2.5 font-mono text-sm" />
            <p className="mt-1 text-xs text-snow-500">
              /reports/{draft.slug || '…'}
              {slugTaken && <span className="ml-2 font-bold text-rose-700">すでに使われています</span>}
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-snow-600">公開状態</label>
            <select value={draft.status}
              onChange={(e) => setDraft({ ...draft, status: e.target.value as 'draft' | 'published' })}
              className="w-full rounded-lg border border-snow-300 px-3 py-2.5 text-sm">
              <option value="draft">下書き（サイトには出ません）</option>
              <option value="published">公開する</option>
            </select>
          </div>
        </div>

        {error && <p role="alert" className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p>}

        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={() => void save()} disabled={busy}
            className="rounded-full bg-hanabi-600 px-6 py-3 text-sm font-bold text-white hover:bg-hanabi-700 disabled:opacity-50">
            {busy ? '保存中…' : '保存する'}
          </button>
          <button onClick={() => { setDraft(null); setError('') }}
            className="rounded-full px-6 py-3 text-sm font-bold text-snow-600 hover:bg-snow-100">
            やめる
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="rounded-card bg-white p-6 ring-1 ring-snow-200">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold">活動報告</h2>
        <button onClick={() => { setDraft(newDraft(defaultOrg)); setNotice('') }}
          disabled={!defaultOrg}
          className="rounded-full bg-hanabi-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-hanabi-700 disabled:opacity-50">
          新しく作る
        </button>
      </div>

      {notice && <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900">{notice}</p>}
      {error && <p role="alert" className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p>}

      {reports.length === 0 ? (
        <p className="mt-5 rounded-lg border border-dashed border-snow-300 px-4 py-10 text-center text-sm text-snow-500">
          まだ活動報告がありません。「新しく作る」から追加してください。
        </p>
      ) : (
        <ul className="mt-5 divide-y divide-snow-200">
          {reports.map((report) => (
            <li key={report.id} className="flex flex-wrap items-center gap-3 py-3">
              <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                report.status === 'published' ? 'bg-emerald-50 text-emerald-800' : 'bg-snow-100 text-snow-600'
              }`}>
                {report.status === 'published' ? '公開中' : '下書き'}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-snow-800">{report.title.ja || '(無題)'}</span>
                <span className="mt-0.5 block text-xs text-snow-500">
                  {report.heldOn}
                  {scope.kind === 'admin' && ` ・ ${orgName(report.organizationId)}`}
                </span>
              </span>
              <button onClick={() => { setDraft(report); setNotice('') }}
                className="rounded-full px-3 py-1.5 text-xs font-bold text-brand-700 ring-1 ring-brand-200 ring-inset hover:bg-brand-50">
                編集
              </button>
              <button onClick={() => void remove(report.id)}
                className="rounded-full px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-50">
                削除
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
