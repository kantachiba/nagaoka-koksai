import type { LocalizedField } from '../../i18n/text'

/**
 * 日本語と英語をまとめて入力する欄。
 *
 * 英語を空欄のままにしても保存でき、その場合は公開側で日本語に
 * フォールバックし「この項目は日本語のみです」と明示される。
 */

const LANGS = [
  { key: 'ja', label: '日本語', required: true },
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
  const set = (key: string, text: string) => onChange({ ...value, [key]: text })

  return (
    <fieldset className="rounded-card border border-snow-200 bg-white p-4">
      <legend className="px-1 text-sm font-bold text-snow-800">{label}</legend>
      {hint && <p className="mb-3 text-xs text-snow-500">{hint}</p>}

      <div className="space-y-3">
        {LANGS.map((lang) => (
          <div key={lang.key}>
            <label className="mb-1 block text-xs font-bold text-snow-600">
              {lang.label}
              {lang.required && <span className="ml-1 text-rose-600">*</span>}
            </label>

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
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-snow-500">
        英語を空欄にすると、英語版では日本語が表示されます。
      </p>
    </fieldset>
  )
}
