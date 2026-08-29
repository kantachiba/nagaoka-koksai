import { getLocaleMeta, type Locale } from '../i18n'

/**
 * 日付の整形。
 *
 * ふりがな版では単位の漢字にルビ記法を付けて返す。呼び出し側は
 * <Ruby> を通して描画するので、そのまま <ruby> になる。
 */

const WEEKDAY_JA = ['日', '月', '火', '水', '木', '金', '土']
const WEEKDAY_JA_YOMI = ['にち', 'げつ', 'か', 'すい', 'もく', 'きん', 'ど']
const WEEKDAY_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** 'YYYY-MM-DD' をローカルタイムの Date に変換（UTC解釈による日付ズレを避ける） */
export function parseIso(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** Date を 'YYYY-MM-DD' に変換（ローカルタイム基準） */
export function toIso(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export const todayIso = (): string => toIso(new Date())

/** 指定日までの残り日数（過去なら負数） */
export function daysUntil(iso: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((parseIso(iso).getTime() - today.getTime()) / 86_400_000)
}

export const isPast = (iso: string): boolean => daysUntil(iso) < 0

/** その言語が日本語表記かどうか（ja と furigana が該当） */
const isJapanese = (locale: Locale): boolean => getLocaleMeta(locale).htmlLang === 'ja'

type FormatOptions = {
  /** 曜日を含めるか（既定: true） */
  weekday?: boolean
  /** 年を含めるか（既定: true） */
  year?: boolean
}

/**
 * 日付を表示用に整形する。
 * ふりがな版は「2026{年|ねん}8{月|がつ}15{日|にち}（{土|ど}）」のように返す。
 */
export function formatDate(iso: string, locale: Locale, options: FormatOptions = {}): string {
  const { weekday = true, year = true } = options
  const date = parseIso(iso)
  const y = date.getFullYear()
  const m = date.getMonth()
  const d = date.getDate()
  const w = date.getDay()

  if (!isJapanese(locale)) {
    const head = weekday ? `${WEEKDAY_EN[w]}, ` : ''
    const tail = year ? `, ${y}` : ''
    return `${head}${MONTH_EN[m]} ${d}${tail}`
  }

  const ruby = locale !== 'ja'
  const unit = (kanji: string, yomi: string) => (ruby ? `{${kanji}|${yomi}}` : kanji)

  const head = year ? `${y}${unit('年', 'ねん')}` : ''
  const body = `${m + 1}${unit('月', 'がつ')}${d}${unit('日', 'にち')}`
  const tail = weekday ? `（${unit(WEEKDAY_JA[w], WEEKDAY_JA_YOMI[w])}）` : ''
  return `${head}${body}${tail}`
}

/** 開始日〜終了日の範囲表記（終了日がなければ単日表記） */
export function formatDateRange(startIso: string, endIso: string | undefined, locale: Locale): string {
  if (!endIso || endIso === startIso) return formatDate(startIso, locale)
  const sameYear = startIso.slice(0, 4) === endIso.slice(0, 4)

  if (!isJapanese(locale)) {
    return `${formatDate(startIso, locale, { year: !sameYear })} – ${formatDate(endIso, locale)}`
  }
  return `${formatDate(startIso, locale)}〜${formatDate(endIso, locale, { year: !sameYear })}`
}

/** 'YYYY-MM' を月名表記に */
export function formatMonth(yearMonth: string, locale: Locale): string {
  const [y, m] = yearMonth.split('-').map(Number)
  if (!isJapanese(locale)) return `${MONTH_EN[m - 1]} ${y}`
  const unit = (kanji: string, yomi: string) => (locale === 'ja' ? kanji : `{${kanji}|${yomi}}`)
  return `${y}${unit('年', 'ねん')}${m}${unit('月', 'がつ')}`
}

/** カードの日付ブロック用の短い表記（ルビは付けない） */
export function dateParts(iso: string, locale: Locale) {
  const date = parseIso(iso)
  const japanese = isJapanese(locale)
  return {
    month: japanese ? `${date.getMonth() + 1}月` : MONTH_EN[date.getMonth()],
    day: String(date.getDate()),
    weekday: japanese ? WEEKDAY_JA[date.getDay()] : WEEKDAY_EN[date.getDay()],
    year: String(date.getFullYear()),
  }
}
