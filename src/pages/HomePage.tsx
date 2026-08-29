import { Fragment } from 'react'
import { cn } from '../lib/cn'
import { usePageTitle } from '../lib/usePageTitle'
import { useLanguage } from '../i18n/LanguageContext'
import type { UiKey } from '../i18n/dictionary'
import {
  getFeaturedEvents,
  getSortedReports,
  getUpcomingEvents,
  organizations,
  siteStats,
} from '../data'
import { EventCard, EventRow } from '../components/EventCard'
import { ReportCard } from '../components/ReportCard'
import { OrganizationCard } from '../components/OrganizationCard'
import { ButtonLink } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { Icon } from '../components/ui/Icon'
import type { IconName } from '../components/ui/Icon'
import { SectionHeading } from '../components/ui/SectionHeading'

export function HomePage() {
  const { t } = useLanguage()
  usePageTitle()

  const featured = getFeaturedEvents().slice(0, 3)
  const upcoming = getUpcomingEvents().slice(0, 5)
  const latestReports = getSortedReports().slice(0, 3)
  const featuredOrgs = organizations.slice(0, 3)

  return (
    <>
      <Hero />

      {featured.length > 0 && (
        <Container className="py-16 sm:py-20">
          <SectionHeading
            eyebrow="Pick up"
            title={t('home.pickup.title')}
            lead={t('home.pickup.lead')}
            action={{ label: t('common.viewAll'), to: '/events' }}
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </Container>
      )}

      <div className="bg-white py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Upcoming"
            title={t('home.upcoming.title')}
            lead={t('home.upcoming.lead')}
            action={{ label: t('common.viewAll'), to: '/events' }}
          />
          <div className="flex flex-col gap-3">
            {upcoming.map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
          </div>
        </Container>
      </div>

      <GuideSection />

      <Container className="py-16 sm:py-20">
        <SectionHeading
          eyebrow="Reports"
          title={t('home.reports.title')}
          lead={t('home.reports.lead')}
          action={{ label: t('common.viewAll'), to: '/reports' }}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latestReports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      </Container>

      <div className="bg-white py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Groups"
            title={t('home.orgs.title')}
            lead={t('home.orgs.lead')}
            action={{ label: t('common.viewAll'), to: '/organizations' }}
          />
          {/* 団体が少ないうちは2カラムに留めて、間延びして見えないようにする */}
          <div
            className={cn(
              'grid gap-6 sm:grid-cols-2',
              featuredOrgs.length > 2 && 'lg:grid-cols-3',
            )}
          >
            {featuredOrgs.map((organization) => (
              <OrganizationCard key={organization.id} organization={organization} />
            ))}
          </div>
        </Container>
      </div>
    </>
  )
}

// ------------------------------------------------------------------ ヒーロー

function Hero() {
  const { t } = useLanguage()
  const titleLines = t('home.hero.title').split('\n')

  return (
    <section className="relative overflow-hidden bg-brand-950 text-white">
      <HeroDecoration />

      <Container className="relative py-16 sm:py-24 lg:py-28">
        <div className="max-w-2xl animate-fade-up">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-bold text-brand-100 ring-1 ring-white/15 ring-inset">
            <span className="size-1.5 rounded-full bg-hanabi-400" />
            {t('home.hero.badge')}
          </p>

          <h1 className="text-balance-ja mt-6 text-4xl leading-[1.25] font-bold text-white sm:text-5xl lg:text-6xl">
            {titleLines.map((line, index) => (
              <Fragment key={line}>
                {index > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </h1>

          <p className="text-balance-ja mt-6 max-w-xl leading-relaxed text-brand-100">
            {t('home.hero.lead')}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink to="/events" variant="accent" size="lg">
              <Icon name="calendar" className="size-5" />
              {t('home.hero.ctaEvents')}
            </ButtonLink>
            <ButtonLink
              to="/organizations"
              size="lg"
              className="bg-white/10 text-white ring-1 ring-white/25 ring-inset hover:bg-white/20"
            >
              <Icon name="users" className="size-5" />
              {t('home.hero.ctaOrgs')}
            </ButtonLink>
          </div>
        </div>

        <dl className="mt-14 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-card bg-white/15 sm:grid-cols-4">
          <Stat labelKey="home.stats.events" value={siteStats.events} />
          <Stat labelKey="home.stats.organizations" value={siteStats.organizations} />
          <Stat labelKey="home.stats.reports" value={siteStats.reports} />
          <Stat labelKey="home.stats.languages" value={siteStats.languages} />
        </dl>
      </Container>
    </section>
  )
}

function Stat({ labelKey, value }: { labelKey: UiKey; value: number }) {
  const { t } = useLanguage()
  return (
    <div className="bg-brand-950/80 px-4 py-5 text-center backdrop-blur-sm">
      <dt className="text-[0.7rem] font-bold tracking-wide text-brand-200">{t(labelKey)}</dt>
      <dd className="mt-1 text-3xl font-bold text-white tabular-nums">{value}</dd>
    </div>
  )
}

/** ヒーロー背景の装飾（花火と信濃川をイメージした抽象パターン） */
function HeroDecoration() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <svg
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 size-full"
      >
        <defs>
          <radialGradient id="hero-glow" cx="0.78" cy="0.28" r="0.6">
            <stop offset="0%" stopColor="#3b64b4" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#111b33" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1200" height="600" fill="url(#hero-glow)" />

        {/* 花火 */}
        {[
          { cx: 930, cy: 170, r: 130, spokes: 24, color: '#ffa971', opacity: 0.5 },
          { cx: 1090, cy: 330, r: 84, spokes: 18, color: '#8aabdf', opacity: 0.35 },
          { cx: 790, cy: 380, r: 56, spokes: 14, color: '#ffcda8', opacity: 0.25 },
        ].map((burst) => (
          <g key={`${burst.cx}-${burst.cy}`} stroke={burst.color} strokeLinecap="round">
            {Array.from({ length: burst.spokes }, (_, i) => {
              const angle = (i / burst.spokes) * Math.PI * 2
              const inner = burst.r * 0.18
              const outer = burst.r * (i % 2 === 0 ? 1 : 0.72)
              return (
                <line
                  key={i}
                  x1={burst.cx + Math.cos(angle) * inner}
                  y1={burst.cy + Math.sin(angle) * inner}
                  x2={burst.cx + Math.cos(angle) * outer}
                  y2={burst.cy + Math.sin(angle) * outer}
                  strokeWidth={i % 2 === 0 ? 1.8 : 1}
                  opacity={burst.opacity}
                />
              )
            })}
          </g>
        ))}

        {/* 信濃川 */}
        <g fill="none" stroke="#5b84cc">
          {[0, 1, 2, 3].map((i) => (
            <path
              key={i}
              d={`M -50 ${470 + i * 34} C 260 ${430 + i * 34}, 560 ${540 + i * 34}, 1250 ${450 + i * 34}`}
              strokeWidth={1 + i * 0.6}
              opacity={0.16 + i * 0.05}
            />
          ))}
        </g>
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-brand-950 to-transparent" />
    </div>
  )
}

// -------------------------------------------------------------- はじめての方へ

const GUIDE_STEPS: Array<{ icon: IconName; titleKey: UiKey; bodyKey: UiKey }> = [
  { icon: 'search', titleKey: 'home.guide.step1.title', bodyKey: 'home.guide.step1.body' },
  { icon: 'mail', titleKey: 'home.guide.step2.title', bodyKey: 'home.guide.step2.body' },
  { icon: 'users', titleKey: 'home.guide.step3.title', bodyKey: 'home.guide.step3.body' },
]

function GuideSection() {
  const { t } = useLanguage()

  return (
    <div className="bg-brand-50 py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Guide"
          title={t('home.guide.title')}
          lead={t('home.guide.lead')}
        />
        <ol className="grid gap-6 sm:grid-cols-3">
          {GUIDE_STEPS.map((step, index) => (
            <li
              key={step.titleKey}
              className="relative rounded-card bg-white p-6 ring-1 ring-brand-100"
            >
              <span className="absolute top-5 right-5 text-4xl font-bold text-brand-100 tabular-nums">
                {index + 1}
              </span>
              <div className="flex size-11 items-center justify-center rounded-xl bg-brand-700 text-white">
                <Icon name={step.icon} className="size-5" />
              </div>
              <h3 className="mt-4 text-lg">{t(step.titleKey)}</h3>
              <p className="text-balance-ja mt-2 text-sm leading-relaxed text-snow-600">
                {t(step.bodyKey)}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </div>
  )
}
