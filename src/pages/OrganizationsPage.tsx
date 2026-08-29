import { useMemo, useState } from 'react'
import { cn } from '../lib/cn'
import { usePageTitle } from '../lib/usePageTitle'
import { useLanguage } from '../i18n/LanguageContext'
import { FIELDS, SUPPORT_LANGS, organizations as allOrganizations } from '../data'
import type { Organization } from '../data/types'
import { OrganizationCard } from '../components/OrganizationCard'
import { PageHero } from '../components/layout/PageHero'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { EmptyState } from '../components/ui/EmptyState'
import { FilterChip, FilterSelect, SearchInput, ToggleSwitch } from '../components/ui/FilterControls'
import { Icon } from '../components/ui/Icon'
import { ResultCount } from '../components/ui/ResultCount'

const ALL = 'all'

type Filters = { keyword: string; field: string; language: string; recruitingOnly: boolean }
const INITIAL_FILTERS: Filters = {
  keyword: '',
  field: ALL,
  language: ALL,
  recruitingOnly: false,
}

export function OrganizationsPage() {
  const { t, tx } = useLanguage()
  usePageTitle(t('orgs.title'))
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS)

  const update = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setFilters((current) => ({ ...current, [key]: value }))

  const filtered = useMemo(() => {
    const keyword = filters.keyword.trim().toLowerCase()

    return allOrganizations.filter((organization) => {
      if (filters.recruitingOnly && !organization.recruiting) return false
      if (filters.field !== ALL && !organization.fields.includes(filters.field as never)) return false
      if (filters.language !== ALL && !organization.languages.includes(filters.language as never))
        return false
      if (keyword && !matchesKeyword(organization, keyword)) return false
      return true
    })
  }, [filters])

  const isFiltered = JSON.stringify(filters) !== JSON.stringify(INITIAL_FILTERS)

  return (
    <>
      <PageHero
        title={t('orgs.title')}
        lead={t('orgs.lead')}
        crumbs={[{ label: t('nav.home'), to: '/' }, { label: t('orgs.title') }]}
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
              label={t('org.languages')}
              value={filters.language}
              onChange={(value) => update('language', value)}
              options={[
                { value: ALL, label: t('common.all') },
                ...SUPPORT_LANGS.map((l) => ({ value: l.id, label: tx(l.label) })),
              ]}
            />
          </div>

          <div className="mt-5 border-t border-snow-200 pt-5">
            <p className="mb-2.5 text-xs font-bold text-snow-600">{t('orgs.filter.field')}</p>
            <div className="flex flex-wrap gap-2">
              <FilterChip active={filters.field === ALL} onClick={() => update('field', ALL)}>
                {t('common.all')}
              </FilterChip>
              {FIELDS.map((field) => (
                <FilterChip
                  key={field.id}
                  active={filters.field === field.id}
                  onClick={() => update('field', field.id)}
                >
                  {tx(field.label)}
                </FilterChip>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-snow-200 pt-5">
            <ToggleSwitch
              label={t('orgs.filter.recruiting')}
              checked={filters.recruitingOnly}
              onChange={(checked) => update('recruitingOnly', checked)}
            />
            {isFiltered && (
              <Button variant="ghost" size="sm" onClick={() => setFilters(INITIAL_FILTERS)}>
                <Icon name="close" className="size-4" />
                {t('common.clearFilters')}
              </Button>
            )}
          </div>
        </section>

        <div className="mt-8 mb-5">
          <ResultCount count={filtered.length} />
        </div>

        {filtered.length > 0 ? (
          <div
            className={cn('grid gap-6 sm:grid-cols-2', filtered.length > 2 && 'lg:grid-cols-3')}
          >
            {filtered.map((organization) => (
              <OrganizationCard key={organization.id} organization={organization} />
            ))}
          </div>
        ) : (
          <EmptyState
            title={t('orgs.empty')}
            description={t('common.noResultsHint')}
            icon="users"
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

function matchesKeyword(organization: Organization, keyword: string): boolean {
  const haystack = [
    ...Object.values(organization.name),
    ...Object.values(organization.catchphrase),
    ...organization.about.flatMap((paragraph) => Object.values(paragraph)),
    ...organization.activities.flatMap((activity) => Object.values(activity)),
  ]
    .join(' ')
    .toLowerCase()
  return haystack.includes(keyword)
}
