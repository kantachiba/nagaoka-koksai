import { useMemo, useState } from 'react'
import { formatMonth, isPast, parseIso } from '../lib/date'
import { usePageTitle } from '../lib/usePageTitle'
import { useLanguage } from '../i18n/LanguageContext'
import {
  AREAS,
  CATEGORIES,
  SUPPORT_LANGS,
  events as allEvents,
  getEventMonths,
} from '../data'
import type { EventItem } from '../data/types'
import { EventCard } from '../components/EventCard'
import { PageHero } from '../components/layout/PageHero'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { EmptyState } from '../components/ui/EmptyState'
import { FilterChip, FilterSelect, SearchInput, ToggleSwitch } from '../components/ui/FilterControls'
import { Icon } from '../components/ui/Icon'
import { Pagination } from '../components/ui/Pagination'
import { ResultCount } from '../components/ui/ResultCount'

const PER_PAGE = 9
const ALL = 'all'

type Filters = {
  keyword: string
  category: string
  area: string
  month: string
  language: string
  sort: 'asc' | 'desc'
  showPast: boolean
}

const INITIAL_FILTERS: Filters = {
  keyword: '',
  category: ALL,
  area: ALL,
  month: ALL,
  language: ALL,
  sort: 'asc',
  showPast: false,
}

export function EventsPage() {
  const { lang, t, tx } = useLanguage()
  usePageTitle(t('events.title'))
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS)
  const [page, setPage] = useState(1)

  /** フィルタを1項目更新する。更新のたびに1ページ目へ戻す */
  const update = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((current) => ({ ...current, [key]: value }))
    setPage(1)
  }

  const filtered = useMemo(() => {
    const keyword = filters.keyword.trim().toLowerCase()

    const matched = allEvents.filter((event) => {
      if (!filters.showPast && isPast(event.endDate ?? event.date)) return false
      if (filters.category !== ALL && event.category !== filters.category) return false
      if (filters.area !== ALL && event.area !== filters.area) return false
      if (filters.month !== ALL && !event.date.startsWith(filters.month)) return false
      if (filters.language !== ALL && !event.languages.includes(filters.language as never))
        return false
      if (keyword && !matchesKeyword(event, keyword)) return false
      return true
    })

    return matched.sort((a, b) => {
      const diff = parseIso(a.date).getTime() - parseIso(b.date).getTime()
      return filters.sort === 'asc' ? diff : -diff
    })
  }, [filters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  const isFiltered = JSON.stringify(filters) !== JSON.stringify(INITIAL_FILTERS)

  const withAll = (options: Array<{ value: string; label: string }>) => [
    { value: ALL, label: t('common.all') },
    ...options,
  ]

  return (
    <>
      <PageHero
        title={t('events.title')}
        lead={t('events.lead')}
        crumbs={[{ label: t('nav.home'), to: '/' }, { label: t('events.title') }]}
      />

      <Container className="pt-10 pb-16">
        {/* 絞り込みパネル */}
        <section aria-label={t('common.filter')} className="rounded-card bg-white p-5 ring-1 ring-snow-200 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SearchInput
              label={t('common.keyword')}
              value={filters.keyword}
              placeholder={t('common.searchPlaceholder')}
              onChange={(value) => update('keyword', value)}
              className="sm:col-span-2 lg:col-span-2"
            />
            <FilterSelect
              label={t('events.filter.area')}
              value={filters.area}
              onChange={(value) => update('area', value)}
              options={withAll(AREAS.map((a) => ({ value: a.id, label: tx(a.label) })))}
            />
            <FilterSelect
              label={t('events.filter.month')}
              value={filters.month}
              onChange={(value) => update('month', value)}
              options={withAll(
                getEventMonths().map((m) => ({ value: m, label: formatMonth(m, lang) })),
              )}
            />
            <FilterSelect
              label={t('events.filter.language')}
              value={filters.language}
              onChange={(value) => update('language', value)}
              options={withAll(SUPPORT_LANGS.map((l) => ({ value: l.id, label: tx(l.label) })))}
            />
            <FilterSelect
              label={t('common.sort')}
              value={filters.sort}
              onChange={(value) => update('sort', value as Filters['sort'])}
              options={[
                { value: 'asc', label: t('events.sort.dateAsc') },
                { value: 'desc', label: t('events.sort.dateDesc') },
              ]}
            />
          </div>

          <div className="mt-5 border-t border-snow-200 pt-5">
            <p className="mb-2.5 text-xs font-bold text-snow-600">{t('events.filter.category')}</p>
            <div className="flex flex-wrap gap-2">
              <FilterChip
                active={filters.category === ALL}
                onClick={() => update('category', ALL)}
              >
                {t('common.all')}
              </FilterChip>
              {CATEGORIES.map((category) => (
                <FilterChip
                  key={category.id}
                  active={filters.category === category.id}
                  onClick={() => update('category', category.id)}
                >
                  {tx(category.label)}
                </FilterChip>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-snow-200 pt-5">
            <ToggleSwitch
              label={t('events.filter.showPast')}
              checked={filters.showPast}
              onChange={(checked) => update('showPast', checked)}
            />
            {isFiltered && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilters(INITIAL_FILTERS)
                  setPage(1)
                }}
              >
                <Icon name="close" className="size-4" />
                {t('common.clearFilters')}
              </Button>
            )}
          </div>
        </section>

        <div className="mt-8 mb-5 flex items-center justify-between">
          <ResultCount count={filtered.length} />
        </div>

        {pageItems.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
            <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
          </>
        ) : (
          <EmptyState
            title={t('events.empty')}
            description={t('common.noResultsHint')}
            action={
              <Button variant="outline" onClick={() => setFilters(INITIAL_FILTERS)}>
                {t('common.clearFilters')}
              </Button>
            }
          />
        )}
      </Container>
    </>
  )
}

/** タイトル・概要・会場を横断してキーワード検索する（3言語すべてを対象） */
function matchesKeyword(event: EventItem, keyword: string): boolean {
  const haystack = [
    ...Object.values(event.title),
    ...Object.values(event.summary),
    ...Object.values(event.venue),
    ...event.body.flatMap((paragraph) => Object.values(paragraph)),
  ]
    .join(' ')
    .toLowerCase()
  return haystack.includes(keyword)
}
