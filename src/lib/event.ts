import type { UiKey } from '../i18n/dictionary'
import type { BadgeTone, EventItem } from '../data/types'
import { daysUntil, isPast } from './date'

export type EventStatus = {
  /** 辞書キー（表示ラベル） */
  key: UiKey
  tone: BadgeTone
  /** 開催予定かどうか */
  isUpcoming: boolean
}

/**
 * イベントの受付状況を判定する。
 * 実データでは「定員に達したか」も加味することになるため、
 * ここは API 側のステータスに置き換わる想定の暫定ロジックです。
 */
export function getEventStatus(event: EventItem): EventStatus {
  if (isPast(event.endDate ?? event.date)) {
    return { key: 'event.status.finished', tone: 'slate', isUpcoming: false }
  }

  if (event.applicationRequired && event.applicationDeadline && isPast(event.applicationDeadline)) {
    return { key: 'event.status.closed', tone: 'slate', isUpcoming: true }
  }

  if (daysUntil(event.date) <= 7) {
    return { key: 'event.status.soon', tone: 'hanabi', isUpcoming: true }
  }

  return { key: 'event.status.upcoming', tone: 'emerald', isUpcoming: true }
}
