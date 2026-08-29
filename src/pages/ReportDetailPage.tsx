import { Link, useParams } from 'react-router-dom'
import { formatDate } from '../lib/date'
import { usePageTitle } from '../lib/usePageTitle'
import { useLanguage } from '../i18n/LanguageContext'
import {
  getCategory,
  getEventById,
  getOrganizationById,
  getOtherReports,
  getReportBySlug,
} from '../data'
import { ReportCard } from '../components/ReportCard'
import { Badge } from '../components/ui/Badge'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { Container } from '../components/ui/Container'
import { Icon } from '../components/ui/Icon'
import { PlaceholderImage } from '../components/ui/PlaceholderImage'
import { NotFoundPage } from './NotFoundPage'

export function ReportDetailPage() {
  const { slug } = useParams()
  const { lang, t, tx } = useLanguage()
  const report = slug ? getReportBySlug(slug) : undefined
  usePageTitle(report ? tx(report.title) : t('notfound.title'))

  if (!report) return <NotFoundPage />

  const category = getCategory(report.category)
  const organizer = getOrganizationById(report.organizerId)
  const relatedEvent = report.relatedEventId ? getEventById(report.relatedEventId) : undefined
  const others = getOtherReports(report)

  return (
    <>
      <Container>
        <Breadcrumb
          items={[
            { label: t('nav.home'), to: '/' },
            { label: t('reports.title'), to: '/reports' },
            { label: tx(report.title) },
          ]}
        />
      </Container>

      <Container size="narrow" className="pb-16">
        <article>
          <header>
            <Badge tone={category.tone} size="md">
              {tx(category.label)}
            </Badge>
            <h1 className="text-balance-ja mt-4 text-3xl leading-snug sm:text-4xl">
              {tx(report.title)}
            </h1>

            <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-snow-500">
              <div className="flex items-center gap-1.5">
                <dt className="sr-only">{t('report.heldOn')}</dt>
                <Icon name="calendar" className="size-4 text-brand-500" />
                <dd>
                  {t('report.heldOn')}：
                  <time dateTime={report.heldOn}>{formatDate(report.heldOn, lang)}</time>
                </dd>
              </div>
              <div className="flex items-center gap-1.5">
                <dt className="sr-only">{t('report.participants')}</dt>
                <Icon name="users" className="size-4 text-brand-500" />
                <dd>
                  {t('report.participants')}：{report.participants}
                  {lang === 'en' ? '' : '名'}
                </dd>
              </div>
              <div className="flex items-center gap-1.5">
                <dt className="sr-only">{t('report.author')}</dt>
                <Icon name="building" className="size-4 text-brand-500" />
                <dd>{tx(report.author)}</dd>
              </div>
            </dl>
          </header>

          <div className="mt-8 aspect-16/9 overflow-hidden rounded-card bg-brand-900">
            <PlaceholderImage visual={report.visual} alt={tx(report.title)} />
          </div>

          <p className="text-balance-ja mt-8 rounded-card border-l-4 border-hanabi-400 bg-hanabi-50 px-5 py-4 leading-relaxed font-medium text-snow-700">
            {tx(report.summary)}
          </p>

          <div className="mt-8 space-y-6">
            {report.body.map((paragraph, index) => (
              <p key={index} className="text-balance-ja leading-loose text-snow-700">
                {tx(paragraph)}
              </p>
            ))}
          </div>

          {/* 写真ギャラリー（写真がない記事では出さない） */}
          {report.photos.length > 0 && (
            <section className="mt-12">
              <h2 className="flex items-center gap-2 text-xl">
                <Icon name="camera" className="size-5 text-hanabi-600" />
                {t('report.photos')}
              </h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                {report.photos.map((photo, index) => (
                  <figure key={index} className={index === 0 ? 'sm:col-span-2' : undefined}>
                    <div className="aspect-16/9 overflow-hidden rounded-card bg-brand-900">
                      <PlaceholderImage visual={photo.visual} />
                    </div>
                    <figcaption className="text-balance-ja mt-2 text-sm text-snow-500">
                      {tx(photo.caption)}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
          )}

          {report.sourceUrl && (
            <p className="mt-10 flex items-start gap-2 rounded-card bg-snow-100 px-5 py-4 text-sm text-snow-600">
              <Icon name="info" className="mt-0.5 size-4 shrink-0 text-brand-500" />
              <span className="min-w-0">
                {t('common.source')}：
                <a
                  href={report.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="break-all text-brand-700 underline-offset-2 hover:underline"
                >
                  {report.sourceLabel ? tx(report.sourceLabel) : report.sourceUrl}
                </a>
              </span>
            </p>
          )}

          <footer className="mt-12 space-y-4">
            {relatedEvent && (
              <Link
                to={`/events/${relatedEvent.slug}`}
                className="group flex gap-4 rounded-card bg-white p-5 ring-1 ring-snow-200 transition-all hover:shadow-md hover:ring-brand-200"
              >
                <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-brand-900">
                  <PlaceholderImage visual={relatedEvent.visual} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-snow-500">{t('event.related')}</p>
                  <p className="text-balance-ja mt-0.5 line-clamp-2 font-bold transition-colors group-hover:text-brand-700">
                    {tx(relatedEvent.title)}
                  </p>
                </div>
                <Icon
                  name="arrow-right"
                  className="size-5 shrink-0 self-center text-snow-300 transition-all group-hover:translate-x-0.5 group-hover:text-brand-600"
                />
              </Link>
            )}

            {organizer && (
              <Link
                to={`/organizations/${organizer.slug}`}
                className="group flex gap-4 rounded-card bg-white p-5 ring-1 ring-snow-200 transition-all hover:shadow-md hover:ring-brand-200"
              >
                <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-brand-900">
                  <PlaceholderImage visual={organizer.visual} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-snow-500">{t('report.relatedOrg')}</p>
                  <p className="text-balance-ja mt-0.5 line-clamp-2 font-bold transition-colors group-hover:text-brand-700">
                    {tx(organizer.name)}
                  </p>
                </div>
                <Icon
                  name="arrow-right"
                  className="size-5 shrink-0 self-center text-snow-300 transition-all group-hover:translate-x-0.5 group-hover:text-brand-600"
                />
              </Link>
            )}
          </footer>
        </article>
      </Container>

      {others.length > 0 && (
        <div className="bg-white py-16">
          <Container>
            <h2 className="mb-8 text-2xl">
              <span className="mr-3 inline-block h-6 w-1 translate-y-0.5 rounded-full bg-hanabi-500 align-middle" />
              {t('report.others')}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((item) => (
                <ReportCard key={item.id} report={item} />
              ))}
            </div>
          </Container>
        </div>
      )}
    </>
  )
}
