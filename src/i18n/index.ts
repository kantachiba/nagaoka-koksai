import jaDictionary from './locales/ja.json'

/**
 * 多言語の中核。
 *
 * 言語を増やすときは `src/i18n/locales/<コード>.json` を1つ足すだけでよい。
 * ファイル内の `_meta` に表示名・htmlLang・並び順を書けば、切替UIにも自動で並ぶ。
 */

export type LocaleMeta = {
  /** 言語切替UIのフルラベル */
  label: string
  /** 狭い場所で使う短いラベル */
  shortLabel: string
  /** <html lang> と hreflang に使う値。ふりがな版は日本語なので 'ja' */
  htmlLang: string
  /** 切替UIでの並び順 */
  order: number
  note?: string
}

type LocaleFile = { _meta: LocaleMeta } & Record<string, string>

/** 言語コード。JSON を足すだけで増やせるようにするため、文字列型にしている */
export type Locale = string

/** UI辞書のキー。ja.json を正としているので、タイポは型エラーになる */
export type UiKey = Exclude<keyof typeof jaDictionary, '_meta'>

/** 日本語が基準。未翻訳はここへフォールバックする */
export const DEFAULT_LOCALE: Locale = 'ja'

const files = import.meta.glob<LocaleFile>('./locales/*.json', {
  eager: true,
  import: 'default',
})

const registry = new Map<Locale, LocaleFile>(
  Object.entries(files).map(([path, file]) => [
    path.replace('./locales/', '').replace('.json', ''),
    file,
  ]),
)

/** 定義されている言語コード（_meta.order 順） */
export const LOCALES: Locale[] = [...registry.entries()]
  .sort(([, a], [, b]) => a._meta.order - b._meta.order)
  .map(([code]) => code)

export function getLocaleMeta(locale: Locale): LocaleMeta {
  return (registry.get(locale) ?? registry.get(DEFAULT_LOCALE)!)._meta
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && registry.has(value)
}

/**
 * UIラベルを引く。
 *
 * 未定義のキーは日本語へ**静かに**フォールバックする（画面まわりの文言に
 * 「日本語のみです」と出すとかえって読みにくいため）。コンテンツ側の
 * 未翻訳表示は resolveText（src/i18n/text.ts）が担当する。
 */
export function useTranslations(locale: Locale) {
  const dictionary = registry.get(locale)
  const fallback = registry.get(DEFAULT_LOCALE)!

  return function t(key: UiKey): string {
    return dictionary?.[key] ?? fallback[key] ?? key
  }
}

// ------------------------------------------------------------------ ルーティング

/**
 * 言語つきのパスを作る。日本語はプレフィックスなし。
 *   localizePath('/events', 'ja')       → '/events'
 *   localizePath('/events', 'furigana') → '/furigana/events'
 */
export function localizePath(path: string, locale: Locale): string {
  const clean = path.startsWith('/') ? path : `/${path}`
  if (locale === DEFAULT_LOCALE) return clean === '/' ? '/' : clean.replace(/\/$/, '')
  return clean === '/' ? `/${locale}` : `/${locale}${clean.replace(/\/$/, '')}`
}

/** getStaticPaths 用。日本語は params を undefined にしてルート直下へ出す */
export function localeStaticPaths() {
  return LOCALES.map((locale) => ({
    params: { locale: locale === DEFAULT_LOCALE ? undefined : locale },
    props: { locale },
  }))
}

/** URL から言語プレフィックスを外して、言語非依存のパスに戻す */
export function stripLocale(pathname: string): string {
  for (const locale of LOCALES) {
    if (locale === DEFAULT_LOCALE) continue
    if (pathname === `/${locale}`) return '/'
    if (pathname.startsWith(`/${locale}/`)) return pathname.slice(locale.length + 1)
  }
  return pathname
}
