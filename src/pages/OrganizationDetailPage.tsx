import { useParams } from 'react-router-dom'
import { withUnit } from '../lib/units'
import { usePageTitle } from '../lib/usePageTitle'
import { useLanguage } from '../i18n/LanguageContext'
import {
  getField,
  getOrganizationBySlug,
  getReportsByOrganization,
  getSupportLang,
  getUpcomingEventsByOrganization,
} from '../data'
import { EventRow } from '../components/EventCard'
import { ReportCard } from '../components/ReportCard'
import { Badge } from '../components/ui/Badge'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { Container } from '../components/ui/Container'
import { EmptyState } from '../components/ui/EmptyState'
import { Icon } from '../components/ui/Icon'
import { InfoList } from '../components/ui/InfoList'
import type { InfoRow } from '../components/ui/InfoList'
import { PlaceholderImage } from '../components/ui/PlaceholderImage'
import { NotFoundPage } from './NotFoundPage'

export function OrganizationDetailPage() {
  const { slug } = useParams()
  const { lang, t, tx } = useLanguage()
  const organization = slug ? getOrganizationBySlug(slug) : undefined
  usePageTitle(organization ? tx(organization.name) : t('notfound.title'))

  if (!organization) return <NotFoundPage />

  const upcomingEvents = getUpcomingEventsByOrganization(organization.id)
  const reports = getReportsByOrganization(organization.id)

  // 公開情報にない項目は行ごと出さない（値を推測して埋めない）
  const founded = organization.foundedLabel
    ? tx(organization.foundedLabel)
    : organization.foundedYear !== undefined
      ? `${organization.foundedYear}`
      : undefined

  const infoRows: InfoRow[] = [
    founded && { icon: 'calendar' as const, label: t('org.founded'), value: founded },
    organization.memberCount !== undefined && {
      icon: 'users' as const,
      label: t('org.members'),
      value: withUnit(organization.memberCount, t('org.members.unit'), lang),
    },
    organization.frequency && {
      icon: 'clock' as const,
      label: t('org.frequency'),
      value: tx(organization.frequency),
    },
    organization.meetingPlace && {
      icon: 'map-pin' as const,
      label: t('org.place'),
      value: tx(organization.meetingPlace),
    },
    organization.membershipFee && {
      icon: 'ticket' as const,
      label: t('org.fee'),
      value: tx(organization.membershipFee),
    },
    {
      icon: 'globe' as const,
      label: t('org.languages'),
      value: (
        <span className="flex flex-wrap gap-1.5">
          {organization.languages.map((id) => (
            <Badge key={id}>{tx(getSupportLang(id).label)}</Badge>
          ))}
        </span>
      ),
    },
  ].filter(Boolean) as InfoRow[]

  return (
    <>
      <Container>
        <Breadcrumb
          items={[
            { label: t('nav.home'), to: '/' },
            { label: t('orgs.title'), to: '/organizations' },
            { label: tx(organization.name) },
          ]}
        />
      </Container>

      {/* 団体のキービジュアル */}
      <Container className="pb-8">
        <div className="relative overflow-hidden rounded-card bg-brand-900">
          <div className="absolute inset-0">
            <PlaceholderImage visual={organization.visual} />
            <div className="absolute inset-0 bg-linear-to-r from-brand-950/90 via-brand-950/70 to-brand-950/30" />
          </div>
          <div className="relative px-6 py-10 sm:px-10 sm:py-14">
            {organization.recruiting && (
              <Badge tone="hanabi" variant="solid" size="md">
                <Icon name="sparkles" className="size-3.5" />
                {t('org.recruiting')}
              </Badge>
            )}
            <h1 className="text-balance-ja mt-4 text-3xl leading-snug text-white sm:text-4xl">
              {tx(organization.name)}
            </h1>
            <p className="text-balance-ja mt-3 max-w-2xl text-lg text-brand-100">
              {tx(organization.catchphrase)}
            </p>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {organization.fields.map((fieldId) => (
                <Badge key={fieldId} tone="slate" variant="solid">
                  {tx(getField(fieldId).label)}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Container>

      <Container className="pb-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
          <div className="min-w-0">
            <section>
              <h2 className="flex items-center gap-2 text-xl">
                <Icon name="info" className="size-5 text-hanabi-600" />
                {t('org.about')}
              </h2>
              <div className="mt-5 space-y-5">
                {organization.about.map((paragraph, index) => (
                  <p key={index} className="text-balance-ja leading-loose text-snow-700">
                    {tx(paragraph)}
                  </p>
                ))}
              </div>
            </section>

            <section className="mt-12">
              <h2 className="flex items-center gap-2 text-xl">
                <Icon name="check" className="size-5 text-hanabi-600" />
                {t('org.activities')}
              </h2>
              <ul className="mt-5 space-y-3">
                {organization.activities.map((activity, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 rounded-card bg-white p-4 ring-1 ring-snow-200"
                  >
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-800">
                      {index + 1}
                    </span>
                    <span className="text-balance-ja text-snow-700">{tx(activity)}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-12">
              <h2 className="flex items-center gap-2 text-xl">
                <Icon name="calendar" className="size-5 text-hanabi-600" />
                {t('org.upcomingEvents')}
              </h2>
              <div className="mt-5">
                {upcomingEvents.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {upcomingEvents.map((event) => (
                      <EventRow key={event.id} event={event} />
                    ))}
                  </div>
                ) : (
                  <EmptyState title={t('org.noEvents')} icon="calendar" />
                )}
              </div>
            </section>

            {reports.length > 0 && (
              <section className="mt-12">
                <h2 className="flex items-center gap-2 text-xl">
                  <Icon name="camera" className="size-5 text-hanabi-600" />
                  {t('org.reports')}
                </h2>
                <div className="mt-5 grid gap-6 sm:grid-cols-2">
                  {reports.map((report) => (
                    <ReportCard key={report.id} report={report} />
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-card bg-white p-6 ring-1 ring-snow-200">
              <h2 className="text-lg">{t('org.info')}</h2>
              <div className="mt-2">
                <InfoList rows={infoRows} />
              </div>
            </div>

            <div className="mt-5 rounded-card bg-brand-50 p-6 ring-1 ring-brand-100">
              <h2 className="text-sm font-bold text-snow-700">{t('org.contact')}</h2>

              {organization.contactEmail && (
                <p className="mt-3 flex items-start gap-2 text-sm text-snow-700">
                  <Icon name="mail" className="mt-0.5 size-4 shrink-0 text-brand-500" />
                  <a
                    href={`mailto:${organization.contactEmail}`}
                    className="min-w-0 break-all underline-offset-2 hover:text-brand-700 hover:underline"
                  >
                    {organization.contactEmail}
                  </a>
                </p>
              )}

              {organization.contactPhone && (
                <p className="mt-1.5 flex items-center gap-2 text-sm text-snow-700">
                  <Icon name="phone" className="size-4 shrink-0 text-brand-500" />
                  {organization.contactPhone}
                </p>
              )}

              {organization.website && (
                <p className="mt-1.5 flex items-center gap-2 text-sm">
                  <Icon name="link" className="size-4 shrink-0 text-brand-500" />
                  <span className="min-w-0 truncate text-snow-500">{organization.website}</span>
                </p>
              )}

              {organization.socials?.map((social) => (
                <p key={social.url} className="mt-1.5 flex items-start gap-2 text-sm">
                  <Icon name="external" className="mt-0.5 size-4 shrink-0 text-brand-500" />
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="min-w-0 break-all text-brand-700 underline-offset-2 hover:underline"
                  >
                    {social.label}
                  </a>
                </p>
              ))}

              {organization.sourceUrl && (
                <p className="mt-4 flex items-start gap-2 border-t border-brand-200 pt-4 text-xs leading-relaxed text-snow-500">
                  <Icon name="info" className="mt-0.5 size-3.5 shrink-0" />
                  <span className="min-w-0">
                    {t('common.source')}：
                    <a
                      href={organization.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="break-all text-brand-700 underline-offset-2 hover:underline"
                    >
                      {organization.sourceLabel ? tx(organization.sourceLabel) : organization.sourceUrl}
                    </a>
                  </span>
                </p>
              )}
            </div>
          </aside>
        </div>
      </Container>
    </>
  )
}
