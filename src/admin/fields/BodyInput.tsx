import { useState } from 'react'
import type { LocalizedField } from '../../i18n/text'
import BlockEditor from '../BlockEditor'
import { emptyDoc, type LocalizedDoc, type RichDoc } from '../../lib/blocks'

/**
 * 本文の入力欄。言語ごとにブロックエディタを切り替える。
 * 活動報告・イベントで共通。
 */

const BODY_TABS = [
  { key: 'ja', label: '日本語' },
  { key: 'en', label: 'English' },
] as const

/** 旧形式（段落の配列）で保存された本文も編集できるように読み替える */
export function normalizeStoredBody(raw: unknown): LocalizedDoc {
  if (Array.isArray(raw)) {
    const paragraphs = raw as LocalizedField[]
    const build = (locale: 'ja' | 'en'): RichDoc => ({
      type: 'doc',
      content: paragraphs
        .map((paragraph) => paragraph[locale] ?? paragraph.ja ?? '')
        .filter((text) => text.trim())
        .map((text) => ({ type: 'paragraph', content: [{ type: 'text', text }] })),
    })
    return { ja: build('ja'), en: build('en') }
  }
  if (raw && typeof raw === 'object') return raw as LocalizedDoc
  return { ja: emptyDoc() }
}

interface Props {
  value: LocalizedDoc
  organizationId: string
  onChange: (next: LocalizedDoc) => void
}

export default function BodyInput({ value, organizationId, onChange }: Props) {
  const [tab, setTab] = useState<'ja' | 'en'>('ja')

  return (
    <fieldset className="rounded-card border border-faded-gray bg-white p-4">
      <legend className="px-1 text-sm font-bold text-charcoal">本文</legend>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div role="tablist" className="flex items-center gap-0.5 rounded-card bg-paper-white p-1">
          {BODY_TABS.map((item) => (
            <button key={item.key} type="button" role="tab"
              aria-selected={tab === item.key}
              onClick={() => setTab(item.key)}
              className={`rounded-card px-4 py-1.5 text-sm font-bold transition-colors ${
                tab === item.key ? 'bg-white text-blue-text' : 'text-pencil-gray'
              }`}>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'en' && (
        <p className="mb-2 text-xs text-pencil-gray">
          空のままにすると、英語版では日本語の本文が表示されます。
        </p>
      )}

      <BlockEditor
        localeKey={tab}
        doc={value[tab]}
        organizationId={organizationId}
        onChange={(next) => onChange({ ...value, [tab]: next })}
      />
    </fieldset>
  )
}
