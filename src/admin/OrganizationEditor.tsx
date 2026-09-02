import { useEffect, useState } from 'react'
import { collection, deleteDoc, doc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from './firebase'
import { uploadPhoto } from './photo-upload'
import LocalizedInput from './fields/LocalizedInput'
import type { LocalizedField } from '../i18n/text'

/**
 * 団体の追加・編集。
 *
 * 新規追加と削除は運営のみ（firestore.rules）。編集者は自分の団体だけを
 * 編集でき、公開状態と URL は変えられない。ここでの出し分けは見た目のみで、
 * 実際の権限はルール側が担保している。
 */

type Scope = { kind: 'admin' } | { kind: 'editor'; organizationId: string }

type Draft = {
  id: string
  slug: string
  name: LocalizedField
  shortName: LocalizedField
  philosophy: LocalizedField
  description: LocalizedField[]
  activities: LocalizedField[]
  email: string
  links: Array<{ label: string; url: string }>
  imageId: string
  sourceUrl: string
  sourceLabel: LocalizedField
  recruiting: boolean
  status: 'draft' | 'published'
}

const emptyField = (): LocalizedField => ({ ja: '', en: '' })

const newDraft = (): Draft => ({
  id: '',
  slug: '',
  name: emptyField(),
  shortName: emptyField(),
  philosophy: emptyField(),
  description: [emptyField()],
  activities: [emptyField()],
  email: '',
  links: [],
  imageId: '',
  sourceUrl: '',
  sourceLabel: emptyField(),
  recruiting: false,
  status: 'draft',
})

export default function OrganizationEditor({ scope }: { scope: Scope }) {
  const [orgs, setOrgs] = useState<Draft[]>([])
  const [draft, setDraft] = useState<Draft | null>(null)
  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

  const canCreate = scope.kind === 'admin'

  async function load() {
    setError('')
    try {
      const snapshot = await getDocs(collection(db(), 'organizations'))
      const all = snapshot.docs.map((row): Draft => {
        const data = row.data()
        return {
          id: row.id,
          slug: String(data.slug ?? ''),
          name: (data.name as LocalizedField) ?? emptyField(),
          shortName: (data.shortName as LocalizedField) ?? emptyField(),
          philosophy: (data.philosophy as LocalizedField) ?? emptyField(),
          description: (data.description as LocalizedField[]) ?? [emptyField()],
          activities: (data.activities as LocalizedField[]) ?? [emptyField()],
          email: String(data.email ?? ''),
          links: (data.links as Array<{ label: string; url: string }>) ?? [],
          imageId: String(data.imageId ?? ''),
          sourceUrl: String(data.sourceUrl ?? ''),
          sourceLabel: (data.sourceLabel as LocalizedField) ?? emptyField(),
          recruiting: !!data.recruiting,
          status: (data.status as 'draft' | 'published') ?? 'draft',
        }
      })
      setOrgs(
        scope.kind === 'admin' ? all : all.filter((org) => org.id === scope.organizationId),
      )
    } catch {
      setError('団体の一覧を取得できませんでした。')
    }
  }

  useEffect(() => {
    void load()
  }, [])

  async function pickImage(file: File | undefined) {
    if (!file || !draft) return
    setBusy(true)
    setError('')
    try {
      const uploaded = await uploadPhoto(file, draft.id || draft.slug || 'new')
      setDraft({ ...draft, imageId: uploaded.photoId })
      setPreview(uploaded.dataUrl)
    } catch (e) {
      setError(e instanceof Error ? e.message : '画像を追加できませんでした。')
    } finally {
      setBusy(false)
    }
  }

  async function save() {
    if (!draft) return
    if (!draft.name.ja?.trim()) return setError('日本語の団体名は必須です。')
    if (!/^[a-z0-9-]+$/.test(draft.slug)) {
      return setError('URL は英小文字・数字・ハイフンだけで入力してください。')
    }
    if (orgs.some((org) => org.slug === draft.slug && org.id !== draft.id)) {
      return setError('この URL はすでに使われています。')
    }

    setBusy(true)
    setError('')
    try {
      const id = draft.id || draft.slug
      await setDoc(
        doc(db(), 'organizations', id),
        {
          slug: draft.slug,
          name: draft.name,
          shortName: draft.shortName.ja?.trim() ? draft.shortName : draft.name,
          philosophy: draft.philosophy,
          description: draft.description.filter((p) => p.ja?.trim()),
          activities: draft.activities.filter((a) => a.ja?.trim()),
          ...(draft.email.trim() ? { email: draft.email.trim() } : {}),
          links: draft.links.filter((link) => link.label.trim() && link.url.trim()),
          ...(draft.imageId ? { imageId: draft.imageId } : {}),
          ...(draft.sourceUrl.trim() ? { sourceUrl: draft.sourceUrl.trim() } : {}),
          ...(draft.sourceLabel.ja?.trim() ? { sourceLabel: draft.sourceLabel } : {}),
          recruiting: draft.recruiting,
          status: draft.status,
          updatedAt: serverTimestamp(),
        },
        // 編集者は status / slug を変えられないため、既存項目を消さないよう統合保存
        { merge: true },
      )
      setNotice(
        draft.status === 'published'
          ? '保存しました。公開サイトには最大30分ほどで反映されます。'
          : '下書きとして保存しました。サイトにはまだ出ません。',
      )
      setDraft(null)
      setPreview('')
      await load()
    } catch {
      setError('保存できませんでした。権限またはメールアドレスの確認状況をご確認ください。')
    } finally {
      setBusy(false)
    }
  }

  async function remove(id: string) {
    if (!confirm('この団体を削除します。所属する活動報告やイベントは残ります。よろしいですか？')) return
    try {
      await deleteDoc(doc(db(), 'organizations', id))
      await load()
      setNotice('削除しました。')
    } catch {
      setError('削除できませんでした。')
    }
  }

  /** 繰り返し項目（活動概要・主な活動）の共通UI */
  const repeatable = (
    label: string,
    hint: string,
    items: LocalizedField[],
    onChange: (next: LocalizedField[]) => void,
  ) => (
    <fieldset className="rounded-card border border-faded-gray bg-white p-4">
      <legend className="px-1 text-sm font-bold text-charcoal">{label}</legend>
      <p className="mb-3 text-xs text-pencil-gray">{hint}</p>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index}>
            <LocalizedInput
              label={`${index + 1}つ目`}
              value={item}
              multiline
              onChange={(next) => onChange(items.map((v, i) => (i === index ? next : v)))}
            />
            {items.length > 1 && (
              <button type="button"
                onClick={() => onChange(items.filter((_, i) => i !== index))}
                className="mt-1 rounded px-2 py-1 text-xs font-bold text-rose-700 hover:bg-rose-50">
                削除
              </button>
            )}
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...items, emptyField()])}
        className="mt-3 rounded-card px-4 py-2 text-xs font-bold text-blue-text border-2 border-eager-green hover:bg-storybook-green">
        追加
      </button>
    </fieldset>
  )

  if (draft) {
    const lockedForEditor = scope.kind === 'editor'
    return (
      <section className="rounded-card bg-white p-6 border-2 border-faded-gray">
        <h2 className="text-lg font-bold">{draft.id ? '団体を編集' : '団体を追加'}</h2>

        <div className="mt-5 space-y-5">
          <LocalizedInput label="団体名" value={draft.name}
            onChange={(name) => setDraft({ ...draft, name })} />

          <LocalizedInput label="略称（省略可）" value={draft.shortName}
            hint="カードなど狭い場所で使います。空欄なら団体名がそのまま使われます。"
            onChange={(shortName) => setDraft({ ...draft, shortName })} />

          <LocalizedInput label="理念・ひとこと" value={draft.philosophy} multiline
            hint="一覧や団体ページの見出し下に出る短い紹介です。"
            onChange={(philosophy) => setDraft({ ...draft, philosophy })} />

          {repeatable('活動概要', '段落ごとに分けて入力します。', draft.description,
            (description) => setDraft({ ...draft, description }))}

          {repeatable('主な活動', '箇条書きで並びます。', draft.activities,
            (activities) => setDraft({ ...draft, activities }))}

          <fieldset className="rounded-card border border-faded-gray bg-white p-4">
            <legend className="px-1 text-sm font-bold text-charcoal">イメージ画像（省略可）</legend>
            <p className="mb-3 text-xs text-pencil-gray">
              未設定のときは、団体ごとに決まった模様が自動で表示されます。
            </p>
            {(preview || draft.imageId) && (
              <img
                src={preview || `/photos/${draft.imageId}.jpg`}
                alt=""
                className="mb-3 h-32 w-full rounded-card object-cover"
              />
            )}
            <input type="file" accept="image/*" disabled={busy}
              onChange={(e) => void pickImage(e.target.files?.[0])}
              className="block w-full text-sm file:mr-3 file:rounded-card file:border-0 file:bg-eager-green file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-eager-green" />
            {draft.imageId && (
              <button type="button" onClick={() => { setDraft({ ...draft, imageId: '' }); setPreview('') }}
                className="mt-2 rounded px-2 py-1 text-xs font-bold text-rose-700 hover:bg-rose-50">
                画像を外す
              </button>
            )}
          </fieldset>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-pencil-gray">連絡先メール（省略可）</label>
            <input type="email" value={draft.email}
              onChange={(e) => setDraft({ ...draft, email: e.target.value })}
              className="w-full rounded-card border border-faded-gray px-3 py-2.5 text-sm" />
          </div>

          <fieldset className="rounded-card border border-faded-gray bg-white p-4">
            <legend className="px-1 text-sm font-bold text-charcoal">リンク</legend>
            <p className="mb-3 text-xs text-pencil-gray">Instagram や公式サイトなど。</p>
            <div className="space-y-2">
              {draft.links.map((link, index) => (
                <div key={index} className="flex flex-wrap gap-2">
                  <input value={link.label} placeholder="表示名（例：Instagram）"
                    onChange={(e) => setDraft({
                      ...draft,
                      links: draft.links.map((l, i) => (i === index ? { ...l, label: e.target.value } : l)),
                    })}
                    className="min-w-0 flex-1 rounded-card border border-faded-gray px-3 py-2 text-sm" />
                  <input value={link.url} placeholder="https://…" inputMode="url"
                    onChange={(e) => setDraft({
                      ...draft,
                      links: draft.links.map((l, i) => (i === index ? { ...l, url: e.target.value } : l)),
                    })}
                    className="min-w-0 flex-[2] rounded-card border border-faded-gray px-3 py-2 text-sm" />
                  <button type="button"
                    onClick={() => setDraft({ ...draft, links: draft.links.filter((_, i) => i !== index) })}
                    className="rounded-card px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-50">
                    削除
                  </button>
                </div>
              ))}
            </div>
            <button type="button"
              onClick={() => setDraft({ ...draft, links: [...draft.links, { label: '', url: '' }] })}
              className="mt-3 rounded-card px-4 py-2 text-xs font-bold text-blue-text border-2 border-eager-green hover:bg-storybook-green">
              リンクを追加
            </button>
          </fieldset>

          <label className="flex items-center gap-2 text-sm font-medium text-charcoal">
            <input type="checkbox" checked={draft.recruiting}
              onChange={(e) => setDraft({ ...draft, recruiting: e.target.checked })}
              className="size-4 rounded border-faded-gray" />
            メンバーを募集中として表示する
          </label>

          <details className="rounded-card border border-faded-gray p-4">
            <summary className="cursor-pointer text-sm font-bold text-charcoal">出典（省略可）</summary>
            <p className="mt-2 mb-3 text-xs text-pencil-gray">
              公開情報をもとに掲載している場合、その出典を明示できます。
            </p>
            <input value={draft.sourceUrl} placeholder="https://…" inputMode="url"
              onChange={(e) => setDraft({ ...draft, sourceUrl: e.target.value })}
              className="mb-3 w-full rounded-card border border-faded-gray px-3 py-2 text-sm" />
            <LocalizedInput label="出典の名称" value={draft.sourceLabel}
              onChange={(sourceLabel) => setDraft({ ...draft, sourceLabel })} />
          </details>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-pencil-gray">
              URL（公開ページのアドレス）
            </label>
            <input value={draft.slug} disabled={lockedForEditor}
              onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
              className="w-full rounded-card border border-faded-gray px-3 py-2.5 font-mono text-sm disabled:bg-paper-white disabled:text-pencil-gray" />
            <p className="mt-1 text-xs text-pencil-gray">
              /organizations/{draft.slug || '…'}
              {lockedForEditor && '（変更は運営のみ）'}
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-pencil-gray">公開状態</label>
            <select value={draft.status} disabled={lockedForEditor}
              onChange={(e) => setDraft({ ...draft, status: e.target.value as 'draft' | 'published' })}
              className="w-full rounded-card border border-faded-gray px-3 py-2.5 text-sm disabled:bg-paper-white disabled:text-pencil-gray">
              <option value="draft">下書き（サイトには出ません）</option>
              <option value="published">公開する</option>
            </select>
            {lockedForEditor && (
              <p className="mt-1 text-xs text-pencil-gray">公開状態の変更は運営のみ行えます。</p>
            )}
          </div>
        </div>

        {error && <p role="alert" className="mt-4 rounded-card bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p>}

        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={() => void save()} disabled={busy}
            className="rounded-card bg-eager-green px-6 py-3 text-sm font-bold text-white hover:bg-eager-green disabled:opacity-50">
            {busy ? '保存中…' : '保存する'}
          </button>
          <button onClick={() => { setDraft(null); setPreview(''); setError('') }}
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
        <h2 className="text-lg font-bold">団体</h2>
        {canCreate && (
          <button onClick={() => { setDraft(newDraft()); setNotice(''); setPreview('') }}
            className="rounded-card bg-eager-green px-5 py-2.5 text-sm font-bold text-white hover:bg-eager-green">
            団体を追加する
          </button>
        )}
      </div>

      {notice && <p className="mt-4 rounded-card bg-emerald-50 px-3 py-2 text-sm text-emerald-900">{notice}</p>}
      {error && <p role="alert" className="mt-4 rounded-card bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p>}

      {orgs.length === 0 ? (
        <p className="mt-5 rounded-card border border-dashed border-faded-gray px-4 py-10 text-center text-sm text-pencil-gray">
          {canCreate ? 'まだ団体がありません。「団体を追加する」から登録してください。' : '担当する団体が見つかりません。'}
        </p>
      ) : (
        <ul className="mt-5 divide-y divide-faded-gray">
          {orgs.map((org) => (
            <li key={org.id} className="flex flex-wrap items-center gap-3 py-3">
              <span className={`rounded-card px-2 py-0.5 text-xs font-bold ${
                org.status === 'published' ? 'bg-emerald-50 text-emerald-800' : 'bg-paper-white text-pencil-gray'
              }`}>
                {org.status === 'published' ? '公開中' : '下書き'}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-charcoal">{org.name.ja || '(名称未設定)'}</span>
                <span className="mt-0.5 block font-mono text-xs text-pencil-gray">/{org.slug}</span>
              </span>
              <button onClick={() => { setDraft(org); setNotice(''); setPreview('') }}
                className="rounded-card px-3 py-1.5 text-xs font-bold text-blue-text border-2 border-eager-green hover:bg-storybook-green">
                編集
              </button>
              {canCreate && (
                <button onClick={() => void remove(org.id)}
                  className="rounded-card px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-50">
                  削除
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
