import { Link, useParams } from 'react-router-dom'
import { formatDate, formatDateRange } from '../lib/date'
import { getEventStatus } from '../lib/event'
import { withUnit } from '../lib/units'
import { usePageTitle } from '../lib/usePageTitle'
import { useLanguage } from '../i18n/LanguageContext'
import {
  getArea,
  getCategory,
  getEventBySlug,
  getOrganizationById,
  getRelatedEvents,
  getSupportLang,
} from '../data'
import { EventRow } from '../components/EventCard'
import { Badge } from '../components/ui/Badge'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { Icon } from '../components/ui/Icon'
import { InfoList } from '../components/ui/InfoList'
import type { InfoRow } from '../components/ui/InfoList'
import { PlaceholderImage } from '../components/ui/PlaceholderImage'
import { NotFoundPage } from './NotFoundPage'

export function EventDetailPage() {
  const { slug } = useParams()
  const { lang, t, tx } = useLanguage()
  const event = slug ? getEventBySlug(slug) : undefined
  usePageTitle(event ? tx(event.title) : t('notfound.title'))

  if (!event) return <NotFoundPage />

  const category = getCategory(event.category)
  const area = getArea(event.area)
  const status = getEventStatus(event)
  const organizer = getOrganizationById(event.organizerId)
  const related = getRelatedEvents(event)

  const infoRows: InfoRow[] = [
    {
      icon: 'calendar',
      label: t('event.date'),
      value: formatDateRange(event.date, event.endDate, lang),
    },
    { icon: 'clock', label: t('event.time'), value: `${event.startTime}〜${event.endTime}` },
    {
      icon: 'map-pin',
      label: t('event.venue'),
      value: (
        <>
          <span className="font-medium">{tx(event.venue)}</span>
          <span className="mt-0.5 block text-sm text-snow-500">{tx(event.address)}</span>
        </>
      ),
    },
    {
      icon: 'ticket',
      label: t('event.fee'),
      value: <span className={event.isFree ? 'font-bold text-emerald-700' : ''}>{tx(event.fee)}</span>,
    },
    ...(event.capacity
      ? [
          {
            icon: 'users' as const,
            label: t('event.capacity'),
            value: withUnit(event.capacity, t('unit.people'), lang),
          },
        ]
      : []),
    { icon: 'info', label: t('event.target'), value: tx(event.target) },
    {
      icon: 'globe',
      label: t('event.languages'),
      value: (
        <span className="flex flex-wrap gap-1.5">
          {event.languages.map((id) => (
            <Badge key={id}>{tx(getSupportLang(id).label)}</Badge>
          ))}
        </span>
      ),
    },
    ...(organizer
      ? [
          {
            icon: 'building' as const,
            label: t('event.organizer'),
            value: (
              <Link
                to={`/organizations/${organizer.slug}`}
                className="font-medium text-brand-700 underline-offset-2 hover:underline"
              >
                {tx(organizer.name)}
              </Link>
            ),
          },
        ]
      : []),
  ]

  return (
    <>
      <Container>
        <Breadcrumb
          items={[
            { label: t('nav.home'), to: '/' },
            { label: t('events.title'), to: '/events' },
            { label: tx(event.title) },
          ]}
        />
      </Container>

      {/* キービジュアル */}
      <Container className="pb-8">
        <div className="relative aspect-21/9 overflow-hidden rounded-card bg-brand-900 max-sm:aspect-16/9">
          <PlaceholderImage visual={event.visual} />
          <div className="absolute inset-0 bg-linear-to-t from-snow-900/70 via-snow-900/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-2 p-5 sm:p-7">
            <Badge tone={category.tone} variant="solid" size="md">
              {tx(category.label)}
            </Badge>
            <Badge tone={status.tone} variant="solid" size="md">
              {t(status.key)}
            </Badge>
            <Badge tone="slate" variant="solid" size="md">
              <Icon name="map-pin" className="size-3.5" />
              {tx(area.label)}
            </Badge>
          </div>
        </div>

        <h1 className="text-balance-ja mt-7 text-3xl leading-snug sm:text-4xl">
          {tx(event.title)}
        </h1>
        <p className="text-balance-ja mt-4 max-w-3xl text-lg leading-relaxed text-snow-600">
          {tx(event.summary)}
        </p>
      </Container>

      <Container className="pb-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
          {/* 本文 */}
          <div className="min-w-0">
            <section>
              <h2 className="flex items-center gap-2 text-xl">
                <Icon name="info" className="size-5 text-hanabi-600" />
                {t('event.overview')}
              </h2>
              <div className="mt-5 space-y-5">
                {event.body.map((paragraph, index) => (
                  <p key={index} className="text-balance-ja leading-loose text-snow-700">
                    {tx(paragraph)}
                  </p>
                ))}
              </div>
            </section>

            <section className="mt-12">
              <h2 className="flex items-center gap-2 text-xl">
                <Icon name="map-pin" className="size-5 text-hanabi-600" />
                {t('event.access')}
              </h2>
              <p className="text-balance-ja mt-4 leading-loose text-snow-700">{tx(event.access)}</p>

              {/* 地図はバックエンド／地図APIの接続後に差し替える想定のプレースホルダー */}
              <div className="mt-5 flex aspect-16/9 flex-col items-center justify-center gap-3 rounded-card border border-dashed border-snow-300 bg-snow-100 text-snow-400 sm:aspect-21/9">
                <Icon name="map-pin" className="size-8" />
                <p className="px-4 text-center text-sm">{t('event.mapPlaceholder')}</p>
              </div>
            </section>

            {related.length > 0 && (
              <section className="mt-12">
                <h2 className="text-xl">{t('event.related')}</h2>
                <div className="mt-5 flex flex-col gap-3">
                  {related.map((item) => (
                    <EventRow key={item.id} event={item} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* サイドバー */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-card bg-white p-6 ring-1 ring-snow-200">
              <h2 className="text-lg">{t('event.details')}</h2>
              <div className="mt-2">
                <InfoList rows={infoRows} />
              </div>
            </div>

            <div className="mt-5 rounded-card bg-brand-50 p-6 ring-1 ring-brand-100">
              {event.applicationRequired ? (
                <>
                  {event.applicationDeadline && (
                    <p className="flex items-center gap-2 text-sm font-bold text-brand-800">
                      <Icon name="clock" className="size-4" />
                      {t('event.deadline')}：{formatDate(event.applicationDeadline, lang)}
                    </p>
                  )}
                  <Button
                    variant="accent"
                    size="lg"
                    className="mt-4 w-full"
                    disabled={!status.isUpcoming || status.key === 'event.status.closed'}
                  >
                    {t('event.apply')}
                    <Icon name="arrow-right" className="size-5" />
                  </Button>
                  <p className="mt-3 text-xs leading-relaxed text-snow-500">
                    {t('event.applyNote')}
                  </p>
                </>
              ) : (
                <p className="flex items-start gap-2 text-sm font-bold text-brand-800">
                  <Icon name="check" className="mt-0.5 size-4 shrink-0" />
                  {t('event.noApply')}
                </p>
              )}

              <div className="mt-5 border-t border-brand-200 pt-5">
                <p className="text-xs font-bold text-snow-600">{t('event.contact')}</p>
                <p className="mt-2 flex items-center gap-2 text-sm text-snow-700">
                  <Icon name="mail" className="size-4 text-brand-500" />
                  {event.contactEmail}
                </p>
                <p className="mt-1.5 flex items-center gap-2 text-sm text-snow-700">
                  <Icon name="phone" className="size-4 text-brand-500" />
                  {event.contactPhone}
                </p>
              </div>
            </div>

            {organizer && (
              <Link
                to={`/organizations/${organizer.slug}`}
                className="group mt-5 flex gap-4 rounded-card bg-white p-5 ring-1 ring-snow-200 transition-all hover:shadow-md hover:ring-brand-200"
              >
                <div className="size-14 shrink-0 overflow-hidden rounded-xl bg-brand-900">
                  <PlaceholderImage visual={organizer.visual} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-snow-500">{t('event.organizer')}</p>
                  <p className="text-balance-ja mt-0.5 line-clamp-2 text-sm font-bold transition-colors group-hover:text-brand-700">
                    {tx(organizer.name)}
                  </p>
                </div>
                <Icon
                  name="arrow-right"
                  className="size-5 shrink-0 self-center text-snow-300 transition-all group-hover:translate-x-0.5 group-hover:text-brand-600"
                />
              </Link>
            )}
          </aside>
        </div>
      </Container>
    </>
  )
}
