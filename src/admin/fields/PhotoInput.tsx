import { useState } from 'react'
import { uploadPhoto } from '../photo-upload'
import LocalizedInput from './LocalizedInput'
import type { LocalizedField } from '../../i18n/text'

/** 活動報告のギャラリーに並べる写真1枚ぶん */
export type PhotoEntry = { photoId: string; caption: LocalizedField }

/**
 * 写真の追加。
 *
 * Cloud Storage は Blaze プラン必須なので、ブラウザ側で縮小・圧縮してから
 * base64 で Firestore に保存する。ビルド時に静的画像として書き出される
 * （scripts/fetch-photos.mjs）ので、閲覧者は普通の画像として受け取る。
 */

interface Props {
  organizationId: string
  photos: PhotoEntry[]
  onChange: (photos: PhotoEntry[]) => void
}

export default function PhotoInput({ organizationId, photos, onChange }: Props) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [previews, setPreviews] = useState<Record<string, string>>({})

  async function add(files: FileList | null) {
    if (!files?.length) return
    setBusy(true)
    setError('')
    try {
      const added: PhotoEntry[] = []
      const newPreviews: Record<string, string> = {}

      for (const file of Array.from(files)) {
        const uploaded = await uploadPhoto(file, organizationId)
        added.push({ photoId: uploaded.photoId, caption: { ja: '', en: '' } })
        newPreviews[uploaded.photoId] = uploaded.dataUrl
      }

      setPreviews((current) => ({ ...current, ...newPreviews }))
      onChange([...photos, ...added])
    } catch (e) {
      setError(e instanceof Error ? e.message : '写真を追加できませんでした。')
    } finally {
      setBusy(false)
    }
  }

  const move = (index: number, direction: -1 | 1) => {
    const next = [...photos]
    const target = index + direction
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  return (
    <fieldset className="rounded-card border border-faded-gray bg-white p-4">
      <legend className="px-1 text-sm font-bold text-charcoal">写真</legend>
      <p className="mb-3 text-xs leading-relaxed text-pencil-gray">
        選ぶだけで自動的に縮小・圧縮されます（長辺1600pxまで）。
        1枚目が一覧やSNSシェアの画像になります。
      </p>

      <input
        type="file"
        accept="image/*"
        multiple
        disabled={busy}
        onChange={(e) => void add(e.target.files)}
        className="block w-full text-sm file:mr-3 file:rounded-card file:border-0 file:bg-eager-green file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-eager-green"
      />
      {busy && <p className="mt-2 text-sm text-pencil-gray">処理中…</p>}
      {error && (
        <p role="alert" className="mt-2 rounded-card bg-rose-50 px-3 py-2 text-sm text-rose-800">
          {error}
        </p>
      )}

      {photos.length > 0 && (
        <ul className="mt-4 space-y-4">
          {photos.map((photo, index) => (
            <li key={photo.photoId} className="rounded-card bg-paper-white p-3 border-2 border-faded-gray">
              <div className="flex items-start gap-3">
                {previews[photo.photoId] ? (
                  <img
                    src={previews[photo.photoId]}
                    alt=""
                    className="size-20 shrink-0 rounded object-cover"
                  />
                ) : (
                  <span className="flex size-20 shrink-0 items-center justify-center rounded bg-faded-gray text-xs text-pencil-gray">
                    保存済み
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-pencil-gray">
                    {index === 0 ? '1枚目（一覧・SNSに使われます）' : `${index + 1}枚目`}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button type="button" onClick={() => move(index, -1)} disabled={index === 0}
                      className="rounded-card px-3 py-1 text-xs font-bold text-pencil-gray border-2 border-faded-gray disabled:opacity-40">
                      上へ
                    </button>
                    <button type="button" onClick={() => move(index, 1)} disabled={index === photos.length - 1}
                      className="rounded-card px-3 py-1 text-xs font-bold text-pencil-gray border-2 border-faded-gray disabled:opacity-40">
                      下へ
                    </button>
                    <button type="button"
                      onClick={() => onChange(photos.filter((_, i) => i !== index))}
                      className="rounded-card px-3 py-1 text-xs font-bold text-rose-700 hover:bg-rose-50">
                      外す
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <LocalizedInput
                  label="キャプション（任意）"
                  value={photo.caption}
                  onChange={(caption) =>
                    onChange(photos.map((p, i) => (i === index ? { ...p, caption } : p)))
                  }
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </fieldset>
  )
}
