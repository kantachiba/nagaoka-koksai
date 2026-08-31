import { useState } from 'react'
import RubyPreview from './RubyPreview'
import { generateFurigana, isReady } from '../furigana-engine'
import type { LocalizedField } from '../../i18n/text'

/**
 * 3言語をまとめて入力する欄。
 *
 * ふりがなは日本語から自動生成でき、生成後は手で直せる。
 * 辞書が約17MBあるため、初回は明示的にボタンを押してもらい、
 * 一度読み込んだあとは日本語欄を離れた時点で自動的に生成する。
 */

const LANGS = [
  { key: 'ja', label: '日本語', required: true },
  { key: 'furigana', label: 'ふりがな', required: false },
  { key: 'en', label: 'English', required: false },
] as const

interface Props {
  label: string
  value: LocalizedField
  onChange: (next: LocalizedField) => void
  multiline?: boolean
  hint?: string
}

export default function LocalizedInput({ label, value, onChange, multiline, hint }: Props) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const set = (key: string, text: string) => onChange({ ...value, [key]: text })

  async function generate() {
    const japanese = value.ja ?? ''
    if (!japanese.trim()) return
    setBusy(true)
    setError('')
    try {
      onChange({ ...value, furigana: await generateFurigana(japanese) })
    } catch {
      setError('ふりがなを生成できませんでした。通信状況を確認するか、手で入力してください。')
    } finally {
      setBusy(false)
    }
  }

  /**
   * 日本語欄を離れたとき、辞書が読み込み済みでふりがなが空なら自動で入れる。
   * 初回の重い読み込みを勝手に始めないよう、辞書未読込のときは何もしない。
   */
  async function autoGenerateOnBlur() {
    if (!isReady()) return
    if ((value.furigana ?? '').trim()) return
    await generate()
  }

  return (
    <fieldset className="rounded-card border border-snow-200 bg-white p-4">
      <legend className="px-1 text-sm font-bold text-snow-800">{label}</legend>
      {hint && <p className="mb-3 text-xs text-snow-500">{hint}</p>}

      <div className="space-y-3">
        {LANGS.map((lang) => (
          <div key={lang.key}>
            <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-bold text-snow-600">
                {lang.label}
                {lang.required && <span className="ml-1 text-rose-600">*</span>}
              </label>

              {lang.key === 'furigana' && (
                <span className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => void generate()}
                    disabled={busy || !(value.ja ?? '').trim()}
                    className="rounded-full bg-brand-700 px-3 py-1 text-xs font-bold text-white hover:bg-brand-800 disabled:opacity-40"
                  >
                    {busy ? '生成中…' : 'ふりがなを自動生成'}
                  </button>
                  <button
                    type="button"
                    onClick={() => set('furigana', value.ja ?? '')}
                    className="rounded px-2 py-1 text-xs font-bold text-snow-500 hover:bg-snow-100"
                  >
                    日本語のまま
                  </button>
                </span>
              )}
            </div>

            {multiline ? (
              <textarea
                rows={3}
                value={value[lang.key] ?? ''}
                onChange={(e) => set(lang.key, e.target.value)}
                onBlur={lang.key === 'ja' ? () => void autoGenerateOnBlur() : undefined}
                className="w-full rounded-lg border border-snow-300 px-3 py-2 text-sm"
              />
            ) : (
              <input
                value={value[lang.key] ?? ''}
                onChange={(e) => set(lang.key, e.target.value)}
                onBlur={lang.key === 'ja' ? () => void autoGenerateOnBlur() : undefined}
                className="w-full rounded-lg border border-snow-300 px-3 py-2 text-sm"
              />
            )}

            {lang.key === 'furigana' && (
              <>
                <div className="mt-1.5 rounded-lg bg-snow-50 px-3 py-2 text-sm leading-loose ring-1 ring-snow-200">
                  <RubyPreview text={value.furigana ?? ''} />
                </div>
                {busy && !isReady() && (
                  <p className="mt-1 text-xs text-snow-500">
                    初回のみ辞書を読み込みます（数十MB・少し時間がかかります）。
                    2回目からは自動で入ります。
                  </p>
                )}
                {error && (
                  <p role="alert" className="mt-1 rounded-lg bg-rose-50 px-3 py-1.5 text-xs text-rose-800">
                    {error}
                  </p>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-snow-500">
        自動生成は下書きです。人名や地名は読みを外すことがあるので、
        <strong>上のプレビューを見て直してください</strong>。
        記法は <code className="rounded bg-snow-100 px-1">{'{漢字|よみ}'}</code> です。
        <br />
        英語を空欄にすると、英語版では日本語が表示されます。
      </p>
    </fieldset>
  )
}
