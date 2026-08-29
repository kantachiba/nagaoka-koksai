import { cn } from '../../lib/cn'
import { useLanguage } from '../../i18n/LanguageContext'
import { Icon } from './Icon'

type Props = {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

export function Pagination({ page, totalPages, onChange }: Props) {
  const { t } = useLanguage()
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav aria-label={t('common.pagination')} className="mt-10 flex items-center justify-center gap-1.5">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-snow-600 transition-colors hover:bg-snow-100 disabled:pointer-events-none disabled:opacity-40"
      >
        <Icon name="arrow-left" className="size-4" />
        <span className="hidden sm:inline">{t('common.prev')}</span>
      </button>

      {pages.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-current={n === page ? 'page' : undefined}
          className={cn(
            'size-9 rounded-full text-sm font-bold transition-colors',
            n === page
              ? 'bg-brand-700 text-white'
              : 'text-snow-600 hover:bg-snow-100 hover:text-snow-900',
          )}
        >
          {n}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-snow-600 transition-colors hover:bg-snow-100 disabled:pointer-events-none disabled:opacity-40"
      >
        <span className="hidden sm:inline">{t('common.next')}</span>
        <Icon name="arrow-right" className="size-4" />
      </button>
    </nav>
  )
}
