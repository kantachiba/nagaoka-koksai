import { Link } from 'react-router-dom'
import { formatDate } from '../lib/date'
import { useLanguage } from '../i18n/LanguageContext'
import { getCategory, getOrganizationById } from '../data'
import type { ReportItem } from '../data/types'
import { Badge } from './ui/Badge'
import { Icon } from './ui/Icon'
import { PlaceholderImage } from './ui/PlaceholderImage'

/** 活動報告のカード */
export function ReportCard({ report }: { report: ReportItem }) {
  const { lang, t, tx } = useLanguage()
  const category = getCategory(report.category)
  const organizer = getOrganizationById(report.organizerId)

  return (
    <article className="group h-full min-w-0">
      <Link
        to={`/reports/${report.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-card bg-white ring-1 ring-snow-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-900/5 hover:ring-brand-200"
      >
        <div className="relative aspect-16/9 overflow-hidden bg-brand-900">
          <PlaceholderImage
            visual={report.visual}
            className="transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <Badge tone={category.tone} variant="solid">
              {tx(category.label)}
            </Badge>
          </div>
          {/* 写真枚数のインジケーター */}
          {report.photos.length > 0 && (
            <div className="absolute right-3 bottom-3 inline-flex items-center gap-1 rounded-full bg-snow-900/70 px-2.5 py-1 text-xs font-semibold text-white">
              <Icon name="camera" className="size-3.5" />
              {report.photos.length}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center gap-2 text-xs text-snow-500">
            <time dateTime={report.heldOn}>{formatDate(report.heldOn, lang, { weekday: false })}</time>
            <span aria-hidden="true">・</span>
            <span className="flex items-center gap-1">
              <Icon name="users" className="size-3.5" />
              {report.participants}
              {lang === 'en' ? ' joined' : '名参加'}
            </span>
          </div>

          <h3 className="text-balance-ja mt-2 line-clamp-2 text-lg leading-snug font-bold transition-colors group-hover:text-brand-700">
            {tx(report.title)}
          </h3>

          <p className="text-balance-ja mt-2 line-clamp-3 flex-1 text-sm text-snow-600">
            {tx(report.summary)}
          </p>

          {organizer && (
            <p className="mt-4 flex items-center gap-1.5 border-t border-snow-200 pt-3 text-xs text-snow-500">
              <Icon name="building" className="size-3.5" />
              <span className="min-w-0 truncate">
                {t('report.relatedOrg')}：{tx(organizer.shortName)}
              </span>
            </p>
          )}
        </div>
      </Link>
    </article>
  )
}
