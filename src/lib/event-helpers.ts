import type { UiKey } from '../i18n'
import type { EventItem } from './types'

/**
 * イベントの並べ替え・状態判定。
 * 日時は ISO 8601（'2026-06-27T19:00:00+09:00'）で保持している。
 */

/** ISO 日時から 'YYYY-MM-DD' の日付部分を取り出す */
export const dateOf = (iso: string): string => iso.slice(0, 10)

/** 'YYYY-MM' を取り出す */
export const monthOf = (iso: string): string => iso.slice(0, 7)

/** 'HH:MM' を取り出す */
export const timeOf = (iso: string): string => iso.slice(11, 16)

/** そのイベントが終了しているか（終了日時を過ぎているか） */
export function isFinished(event: EventItem, now = new Date()): boolean {
  return new Date(event.endAt).getTime() < now.getTime()
}

export type EventStatus = {
  key: UiKey
  tone: 'emerald' | 'hanabi' | 'slate'
}

/**
 * 受付状況。
 * 申込方法や公開レベルによる出し分けは詳細ページ側で行い、
 * ここでは日付だけを見る。
 */
export function getEventStatus(event: EventItem, now = new Date()): EventStatus {
  if (isFinished(event, now)) return { key: 'event.status.finished', tone: 'slate' }

  const days = (new Date(event.startAt).getTime() - now.getTime()) / 86_400_000
  if (days <= 7) return { key: 'event.status.soon', tone: 'hanabi' }
  return { key: 'event.status.upcoming', tone: 'emerald' }
}

/** 開催日の早い順 */
export const byStartAsc = (a: EventItem, b: EventItem): number =>
  new Date(a.startAt).getTime() - new Date(b.startAt).getTime()

/** これから開催されるもの（開催日の早い順） */
export function upcoming(events: EventItem[], now = new Date()): EventItem[] {
  return events.filter((event) => !isFinished(event, now)).sort(byStartAsc)
}

/** 終了したもの（新しい順） */
export function past(events: EventItem[], now = new Date()): EventItem[] {
  return events.filter((event) => isFinished(event, now)).sort((a, b) => byStartAsc(b, a))
}

/** カレンダー表示のために 'YYYY-MM' 単位でまとめる（月の昇順） */
export function groupByMonth(events: EventItem[]): Array<{ month: string; events: EventItem[] }> {
  const map = new Map<string, EventItem[]>()
  for (const event of events) {
    const key = monthOf(event.startAt)
    map.set(key, [...(map.get(key) ?? []), event])
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, list]) => ({ month, events: list.sort(byStartAsc) }))
}

/**
 * 月間カレンダーのマス目を作る。日曜始まりの6週ぶん（42マス）を返す。
 * 前後の月にはみ出すマスは inMonth: false になる。
 */
export function calendarCells(month: string): Array<{ date: string; inMonth: boolean }> {
  const [year, m] = month.split('-').map(Number)
  const first = new Date(year, m - 1, 1)
  const start = new Date(first)
  start.setDate(1 - first.getDay())

  return Array.from({ length: 42 }, (_, i) => {
    const day = new Date(start)
    day.setDate(start.getDate() + i)
    const iso = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`
    return { date: iso, inMonth: day.getMonth() === m - 1 }
  })
}
