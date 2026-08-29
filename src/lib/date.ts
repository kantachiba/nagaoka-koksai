import type { Lang } from '../i18n/types'

const WEEKDAY_JA = ['日', '月', '火', '水', '木', '金', '土']
const WEEKDAY_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_EN = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

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

/** 今日から n 日後（負数なら n 日前）の 'YYYY-MM-DD' */
export function isoDaysFromToday(days: number): string {
  const base = new Date()
  base.setHours(0, 0, 0, 0)
  base.setDate(base.getDate() + days)
  return toIso(base)
}

/** 今日の 'YYYY-MM-DD' */
export const todayIso = (): string => isoDaysFromToday(0)

/** 指定日までの残り日数（過去なら負数） */
export function daysUntil(iso: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = parseIso(iso).getTime() - today.getTime()
  return Math.round(diff / 86_400_000)
}

export const isPast = (iso: string): boolean => daysUntil(iso) < 0

type FormatOptions = {
  /** 曜日を含めるか（既定: true） */
  weekday?: boolean
  /** 年を含めるか（既定: true） */
  year?: boolean
}

/** 日付を各言語の表記で整形する */
export function formatDate(iso: string, lang: Lang, options: FormatOptions = {}): string {
  const { weekday = true, year = true } = options
  const date = parseIso(iso)
  const y = date.getFullYear()
  const m = date.getMonth()
  const d = date.getDate()
  const w = date.getDay()

  if (lang === 'en') {
    const head = weekday ? `${WEEKDAY_EN[w]}, ` : ''
    const tail = year ? `, ${y}` : ''
    return `${head}${MONTH_EN[m]} ${d}${tail}`
  }

  if (lang === 'easy') {
    const head = year ? `${y}年 ` : ''
    const tail = weekday ? `（${WEEKDAY_JA[w]}よう日）` : ''
    return `${head}${m + 1}月${d}日${tail}`
  }

  const head = year ? `${y}年` : ''
  const tail = weekday ? `（${WEEKDAY_JA[w]}）` : ''
  return `${head}${m + 1}月${d}日${tail}`
}

/**
 * 開始日〜終了日の範囲表記（終了日がなければ単日表記）。
 * 同じ年をまたがない場合、年は日本語なら先頭に、英語なら末尾に一度だけ置きます。
 */
export function formatDateRange(startIso: string, endIso: string | undefined, lang: Lang): string {
  if (!endIso || endIso === startIso) return formatDate(startIso, lang)
  const sameYear = startIso.slice(0, 4) === endIso.slice(0, 4)

  if (lang === 'en') {
    const start = formatDate(startIso, lang, { year: !sameYear })
    return `${start} – ${formatDate(endIso, lang)}`
  }

  const end = formatDate(endIso, lang, { year: !sameYear })
  return `${formatDate(startIso, lang)}〜${end}`
}

/** 'YYYY-MM' を月名表記に */
export function formatMonth(yearMonth: string, lang: Lang): string {
  const [y, m] = yearMonth.split('-').map(Number)
  if (lang === 'en') return `${MONTH_EN[m - 1]} ${y}`
  return `${y}年${m}月`
}

/** カードの日付ブロック用の短い表記 */
export function dateParts(iso: string, lang: Lang) {
  const date = parseIso(iso)
  return {
    month: lang === 'en' ? MONTH_EN[date.getMonth()] : `${date.getMonth() + 1}月`,
    day: String(date.getDate()),
    weekday: lang === 'en' ? WEEKDAY_EN[date.getDay()] : WEEKDAY_JA[date.getDay()],
    year: String(date.getFullYear()),
  }
}
