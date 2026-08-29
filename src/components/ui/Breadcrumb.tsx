import { Link } from 'react-router-dom'
import { useLanguage } from '../../i18n/LanguageContext'

export type Crumb = { label: string; to?: string }

/** 現在位置を示すパンくずリスト */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  const { t } = useLanguage()

  return (
    <nav aria-label={t('common.breadcrumb')} className="py-4">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-snow-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.to && !isLast ? (
                <Link to={item.to} className="rounded hover:text-brand-700 hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? 'font-medium text-snow-700' : undefined} aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span aria-hidden="true" className="text-snow-300">
                  ／
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
