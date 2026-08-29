import { events } from './events'
import { organizations } from './organizations'
import { reports } from './reports'
import { isPast, parseIso } from '../lib/date'
import type { EventItem, Organization, ReportItem } from './types'

export { events, organizations, reports }
export * from './taxonomy'
export type * from './types'

// -------------------------------------------------------------------- 単体取得

const eventBySlug = new Map(events.map((e) => [e.slug, e]))
const eventById = new Map(events.map((e) => [e.id, e]))
const orgBySlug = new Map(organizations.map((o) => [o.slug, o]))
const orgById = new Map(organizations.map((o) => [o.id, o]))
const reportBySlug = new Map(reports.map((r) => [r.slug, r]))

export const getEventBySlug = (slug: string): EventItem | undefined => eventBySlug.get(slug)
export const getEventById = (id: string): EventItem | undefined => eventById.get(id)
export const getOrganizationBySlug = (slug: string): Organization | undefined => orgBySlug.get(slug)
export const getOrganizationById = (id: string): Organization | undefined => orgById.get(id)
export const getReportBySlug = (slug: string): ReportItem | undefined => reportBySlug.get(slug)

// ------------------------------------------------------------------ 並べ替え

const byDateAsc = (a: EventItem, b: EventItem) =>
  parseIso(a.date).getTime() - parseIso(b.date).getTime()

const byPublishedDesc = (a: ReportItem, b: ReportItem) =>
  parseIso(b.publishedAt).getTime() - parseIso(a.publishedAt).getTime()

/** 開催予定のイベント（開催日が近い順） */
export const getUpcomingEvents = (): EventItem[] =>
  events.filter((e) => !isPast(e.endDate ?? e.date)).sort(byDateAsc)

/** 開催済みのイベント（新しい順） */
export const getPastEvents = (): EventItem[] =>
  events.filter((e) => isPast(e.endDate ?? e.date)).sort((a, b) => byDateAsc(b, a))

/** 注目イベント（開催予定のもののみ） */
export const getFeaturedEvents = (): EventItem[] => getUpcomingEvents().filter((e) => e.featured)

/** 活動報告（公開日の新しい順） */
export const getSortedReports = (): ReportItem[] => [...reports].sort(byPublishedDesc)

// ------------------------------------------------------------------ 関連取得

export const getEventsByOrganization = (organizationId: string): EventItem[] =>
  events.filter((e) => e.organizerId === organizationId).sort(byDateAsc)

export const getUpcomingEventsByOrganization = (organizationId: string): EventItem[] =>
  getUpcomingEvents().filter((e) => e.organizerId === organizationId)

export const getReportsByOrganization = (organizationId: string): ReportItem[] =>
  reports.filter((r) => r.organizerId === organizationId).sort(byPublishedDesc)

/** 同じジャンルの開催予定イベント（自分自身は除く） */
export const getRelatedEvents = (event: EventItem, limit = 3): EventItem[] =>
  getUpcomingEvents()
    .filter((e) => e.id !== event.id && (e.category === event.category || e.area === event.area))
    .slice(0, limit)

/** 指定した記事以外の活動報告 */
export const getOtherReports = (report: ReportItem, limit = 3): ReportItem[] =>
  getSortedReports()
    .filter((r) => r.id !== report.id)
    .slice(0, limit)

// -------------------------------------------------------------- 絞り込み用の値

/** イベントが存在する「YYYY-MM」の一覧（昇順） */
export const getEventMonths = (): string[] =>
  [...new Set(events.map((e) => e.date.slice(0, 7)))].sort()

/** 活動報告が存在する年の一覧（降順） */
export const getReportYears = (): string[] =>
  [...new Set(reports.map((r) => r.heldOn.slice(0, 4)))].sort().reverse()

// ------------------------------------------------------------------ サイト統計

export const siteStats = {
  events: events.length,
  organizations: organizations.length,
  reports: reports.length,
  /** イベント・団体で対応している言語の総数 */
  languages: new Set([
    ...events.flatMap((e) => e.languages),
    ...organizations.flatMap((o) => o.languages),
  ]).size,
}
