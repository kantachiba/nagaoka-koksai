import { Link } from 'react-router-dom'
import { cn } from '../lib/cn'
import { dateParts, formatDateRange } from '../lib/date'
import { getEventStatus } from '../lib/event'
import { useLanguage } from '../i18n/LanguageContext'
import { getArea, getCategory, getOrganizationById } from '../data'
import type { EventItem } from '../data/types'
import { Badge } from './ui/Badge'
import { Icon } from './ui/Icon'
import { PlaceholderImage } from './ui/PlaceholderImage'

/** 一覧・トップページで使うイベントカード（縦型） */
export function EventCard({ event }: { event: EventItem }) {
  const { lang, t, tx } = useLanguage()
  const category = getCategory(event.category)
  const area = getArea(event.area)
  const status = getEventStatus(event)
  const organizer = getOrganizationById(event.organizerId)

  return (
    <article className="group h-full min-w-0">
      <Link
        to={`/events/${event.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-card bg-white ring-1 ring-snow-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-900/5 hover:ring-brand-200"
      >
        <div className="relative aspect-16/9 overflow-hidden bg-brand-900">
          <PlaceholderImage
            visual={event.visual}
            className="transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <Badge tone={category.tone} variant="solid">
              {tx(category.label)}
            </Badge>
            {event.featured && status.isUpcoming && (
              <Badge tone="hanabi" variant="solid">
                <Icon name="sparkles" className="size-3" />
                {t('common.featured')}
              </Badge>
            )}
          </div>
          {!status.isUpcoming && (
            <div className="absolute inset-0 flex items-center justify-center bg-snow-900/55">
              <span className="rounded-full bg-white/95 px-4 py-1.5 text-sm font-bold text-snow-700">
                {t('event.status.finished')}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center gap-2 text-sm font-bold text-brand-700">
            <Icon name="calendar" className="size-4" />
            <time dateTime={event.date}>{formatDateRange(event.date, event.endDate, lang)}</time>
          </div>

          <h3 className="text-balance-ja mt-2 line-clamp-2 text-lg leading-snug font-bold transition-colors group-hover:text-brand-700">
            {tx(event.title)}
          </h3>

          <p className="text-balance-ja mt-2 line-clamp-2 flex-1 text-sm text-snow-600">
            {tx(event.summary)}
          </p>

          <div className="mt-4 space-y-1.5 border-t border-snow-200 pt-3 text-xs text-snow-500">
            <p className="flex items-center gap-1.5">
              <Icon name="map-pin" className="size-3.5" />
              <span className="min-w-0 truncate">
                {tx(area.label)}／{tx(event.venue)}
              </span>
            </p>
            <p className="flex items-center gap-1.5">
              <Icon name="ticket" className="size-3.5" />
              <span className={cn('min-w-0 truncate', event.isFree && 'font-bold text-emerald-700')}>
                {tx(event.fee)}
              </span>
            </p>
            {organizer && (
              <p className="flex items-center gap-1.5">
                <Icon name="building" className="size-3.5" />
                <span className="min-w-0 truncate">{tx(organizer.shortName)}</span>
              </p>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}

/** 横長のイベント行（トップページの一覧・関連イベントなどで使用） */
export function EventRow({ event }: { event: EventItem }) {
  const { lang, t, tx } = useLanguage()
  const category = getCategory(event.category)
  const area = getArea(event.area)
  const status = getEventStatus(event)
  const parts = dateParts(event.date, lang)

  return (
    <article className="group min-w-0">
      <Link
        to={`/events/${event.slug}`}
        className="flex gap-4 rounded-card bg-white p-4 ring-1 ring-snow-200 transition-all duration-200 hover:shadow-md hover:shadow-brand-900/5 hover:ring-brand-200 sm:gap-5 sm:p-5"
      >
        {/* 日付ブロック */}
        <div className="flex size-16 shrink-0 flex-col items-center justify-center rounded-xl bg-brand-50 text-brand-800 sm:size-20">
          <span className="text-[0.65rem] font-bold tracking-wide sm:text-xs">{parts.month}</span>
          <span className="text-2xl leading-none font-bold sm:text-3xl">{parts.day}</span>
          <span className="text-[0.65rem] text-brand-500 sm:text-xs">({parts.weekday})</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge tone={category.tone}>{tx(category.label)}</Badge>
            <Badge tone={status.tone}>{t(status.key)}</Badge>
            {event.isFree && <Badge tone="emerald">{t('common.free')}</Badge>}
          </div>

          <h3 className="text-balance-ja mt-2 line-clamp-2 font-bold transition-colors group-hover:text-brand-700">
            {tx(event.title)}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-snow-500">
            <span className="flex items-center gap-1">
              <Icon name="clock" className="size-3.5" />
              {event.startTime}〜{event.endTime}
            </span>
            <span className="flex min-w-0 items-center gap-1">
              <Icon name="map-pin" className="size-3.5" />
              <span className="min-w-0 truncate">
                {tx(area.label)}／{tx(event.venue)}
              </span>
            </span>
          </div>
        </div>

        <Icon
          name="arrow-right"
          className="hidden size-5 self-center text-snow-300 transition-all group-hover:translate-x-0.5 group-hover:text-brand-600 sm:block"
        />
      </Link>
    </article>
  )
}
