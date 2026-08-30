import RubyPreview from './RubyPreview'
import type { LocalizedField } from '../../i18n/text'

/**
 * 3言語をまとめて入力する欄。
 *
 * 日本語・ふりがな・英語を縦に並べ、ふりがなは書いたそばから
 * 実際の見え方を確認できるようにしている。
 * 空欄のままでも保存でき、公開side では日本語にフォールバックする。
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
  /** 説明文 */
  hint?: string
}

export default function LocalizedInput({ label, value, onChange, multiline, hint }: Props) {
  const set = (key: string, text: string) => onChange({ ...value, [key]: text })

  return (
    <fieldset className="rounded-card border border-snow-200 bg-white p-4">
      <legend className="px-1 text-sm font-bold text-snow-800">{label}</legend>
      {hint && <p className="mb-3 text-xs text-snow-500">{hint}</p>}

      <div className="space-y-3">
        {LANGS.map((lang) => (
          <div key={lang.key}>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-xs font-bold text-snow-600">
                {lang.label}
                {lang.required && <span className="ml-1 text-rose-600">*</span>}
              </label>
              {lang.key === 'furigana' && (
                <button
                  type="button"
                  onClick={() => set('furigana', value.ja ?? '')}
                  className="rounded px-2 py-0.5 text-xs font-bold text-brand-700 hover:bg-brand-50"
                >
                  日本語からコピー
                </button>
              )}
            </div>

            {multiline ? (
              <textarea
                rows={3}
                value={value[lang.key] ?? ''}
                onChange={(e) => set(lang.key, e.target.value)}
                className="w-full rounded-lg border border-snow-300 px-3 py-2 text-sm"
              />
            ) : (
              <input
                value={value[lang.key] ?? ''}
                onChange={(e) => set(lang.key, e.target.value)}
                className="w-full rounded-lg border border-snow-300 px-3 py-2 text-sm"
              />
            )}

            {lang.key === 'furigana' && (
              <div className="mt-1.5 rounded-lg bg-snow-50 px-3 py-2 text-sm leading-loose ring-1 ring-snow-200">
                <RubyPreview text={value.furigana ?? ''} />
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-snow-500">
        ふりがなは <code className="rounded bg-snow-100 px-1">{'{漢字|よみ}'}</code> と書きます。
        例：<code className="rounded bg-snow-100 px-1">{'{長岡|ながおか}市'}</code>
        <br />
        空欄のままにすると、その言語では日本語が表示されます。
      </p>
    </fieldset>
  )
}
