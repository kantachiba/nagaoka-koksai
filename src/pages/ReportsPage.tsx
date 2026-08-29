import { useMemo, useState } from 'react'
import { parseIso } from '../lib/date'
import { usePageTitle } from '../lib/usePageTitle'
import { useLanguage } from '../i18n/LanguageContext'
import { CATEGORIES, getReportYears, reports as allReports } from '../data'
import type { ReportItem } from '../data/types'
import { ReportCard } from '../components/ReportCard'
import { PageHero } from '../components/layout/PageHero'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { EmptyState } from '../components/ui/EmptyState'
import { FilterChip, FilterSelect, SearchInput } from '../components/ui/FilterControls'
import { Icon } from '../components/ui/Icon'
import { Pagination } from '../components/ui/Pagination'
import { ResultCount } from '../components/ui/ResultCount'

const PER_PAGE = 9
const ALL = 'all'

type Filters = { keyword: string; category: string; year: string }
const INITIAL_FILTERS: Filters = { keyword: '', category: ALL, year: ALL }

export function ReportsPage() {
  const { t, tx } = useLanguage()
  usePageTitle(t('reports.title'))
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS)
  const [page, setPage] = useState(1)

  const update = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((current) => ({ ...current, [key]: value }))
    setPage(1)
  }

  /** 記事に登場するジャンルだけを絞り込みの選択肢にする */
  const usedCategories = useMemo(() => {
    const used = new Set(allReports.map((report) => report.category))
    return CATEGORIES.filter((category) => used.has(category.id))
  }, [])

  const filtered = useMemo(() => {
    const keyword = filters.keyword.trim().toLowerCase()

    return allReports
      .filter((report) => {
        if (filters.category !== ALL && report.category !== filters.category) return false
        if (filters.year !== ALL && !report.heldOn.startsWith(filters.year)) return false
        if (keyword && !matchesKeyword(report, keyword)) return false
        return true
      })
      .sort((a, b) => parseIso(b.publishedAt).getTime() - parseIso(a.publishedAt).getTime())
  }, [filters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)
  const isFiltered = JSON.stringify(filters) !== JSON.stringify(INITIAL_FILTERS)

  return (
    <>
      <PageHero
        title={t('reports.title')}
        lead={t('reports.lead')}
        crumbs={[{ label: t('nav.home'), to: '/' }, { label: t('reports.title') }]}
      />

      <Container className="pt-10 pb-16">
        <section
          aria-label={t('common.filter')}
          className="rounded-card bg-white p-5 ring-1 ring-snow-200 sm:p-6"
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <SearchInput
              label={t('common.keyword')}
              value={filters.keyword}
              placeholder={t('common.searchPlaceholder')}
              onChange={(value) => update('keyword', value)}
              className="sm:col-span-2"
            />
            <FilterSelect
              label={t('reports.filter.year')}
              value={filters.year}
              onChange={(value) => update('year', value)}
              options={[
                { value: ALL, label: t('common.all') },
                ...getReportYears().map((year) => ({ value: year, label: year })),
              ]}
            />
          </div>

          <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-snow-200 pt-5">
            <div>
              <p className="mb-2.5 text-xs font-bold text-snow-600">{t('events.filter.category')}</p>
              <div className="flex flex-wrap gap-2">
                <FilterChip active={filters.category === ALL} onClick={() => update('category', ALL)}>
                  {t('common.all')}
                </FilterChip>
                {usedCategories.map((category) => (
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

        <div className="mt-8 mb-5">
          <ResultCount count={filtered.length} />
        </div>

        {pageItems.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
            <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
          </>
        ) : (
          <EmptyState
            title={t('report.empty')}
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

function matchesKeyword(report: ReportItem, keyword: string): boolean {
  const haystack = [
    ...Object.values(report.title),
    ...Object.values(report.summary),
    ...report.body.flatMap((paragraph) => Object.values(paragraph)),
  ]
    .join(' ')
    .toLowerCase()
  return haystack.includes(keyword)
}
