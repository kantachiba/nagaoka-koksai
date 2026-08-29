import { getLocaleMeta, type Locale } from '../i18n'

/**
 * 数値と単位を言語に合わせて連結する。
 * 日本語は「28名」と詰め、英語は「28 members」と空白を入れる。
 */
export function withUnit(value: number | string, unit: string, locale: Locale): string {
  return getLocaleMeta(locale).htmlLang === 'ja' ? `${value}${unit}` : `${value} ${unit}`
}
