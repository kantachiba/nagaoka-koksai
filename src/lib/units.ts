import type { Lang } from '../i18n/types'

/**
 * 数値と単位を言語に合わせて連結する。
 * 日本語は「28名」と詰め、英語は「28 members」と空白を入れる。
 */
export function withUnit(value: number | string, unit: string, lang: Lang): string {
  return lang === 'en' ? `${value} ${unit}` : `${value}${unit}`
}
