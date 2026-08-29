import { Link } from 'react-router-dom'
import { withUnit } from '../lib/units'
import { useLanguage } from '../i18n/LanguageContext'
import { getField, getSupportLang } from '../data'
import type { Organization } from '../data/types'
import { Badge } from './ui/Badge'
import { Icon } from './ui/Icon'
import { PlaceholderImage } from './ui/PlaceholderImage'

/** 団体カード。上部にビジュアル帯、その上に団体名を重ねる構成 */
export function OrganizationCard({ organization }: { organization: Organization }) {
  const { lang, t, tx } = useLanguage()

  return (
    <article className="group h-full min-w-0">
      <Link
        to={`/organizations/${organization.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-card bg-white ring-1 ring-snow-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-900/5 hover:ring-brand-200"
      >
        <div className="relative h-28 overflow-hidden bg-brand-900">
          <PlaceholderImage
            visual={organization.visual}
            className="transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-snow-900/80 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <h3 className="text-balance-ja line-clamp-2 leading-snug font-bold text-white">
              {tx(organization.name)}
            </h3>
          </div>
          {organization.recruiting && (
            <div className="absolute top-3 right-3">
              <Badge tone="hanabi" variant="solid">
                {t('org.recruiting')}
              </Badge>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <p className="text-balance-ja line-clamp-2 text-sm font-medium text-brand-700">
            {tx(organization.catchphrase)}
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {organization.fields.map((fieldId) => {
              const field = getField(fieldId)
              return (
                <Badge key={fieldId} tone={field.tone}>
                  {tx(field.label)}
                </Badge>
              )
            })}
          </div>

          <dl className="mt-4 flex-1 space-y-1.5 text-xs text-snow-500">
            {/* 会員数・設立年は公開されていない団体があるため、ある項目だけを並べる */}
            {(organization.memberCount !== undefined || organization.foundedYear !== undefined) && (
              <div className="flex items-center gap-1.5">
                <dt className="sr-only">{t('org.info')}</dt>
                <Icon name="users" className="size-3.5" />
                <dd>
                  {[
                    organization.memberCount !== undefined &&
                      withUnit(organization.memberCount, t('org.members.unit'), lang),
                    organization.foundedYear !== undefined &&
                      `${t('org.founded')} ${organization.foundedYear}`,
                  ]
                    .filter(Boolean)
                    .join('・')}
                </dd>
              </div>
            )}
            <div className="flex items-start gap-1.5">
              <dt className="sr-only">{t('org.languages')}</dt>
              <Icon name="globe" className="mt-0.5 size-3.5" />
              <dd className="line-clamp-1">
                {organization.languages.map((id) => tx(getSupportLang(id).label)).join('・')}
              </dd>
            </div>
          </dl>

          <span className="mt-4 inline-flex items-center gap-1 border-t border-snow-200 pt-3 text-sm font-bold text-brand-700">
            {t('common.readMore')}
            <Icon
              name="arrow-right"
              className="size-4 transition-transform group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </Link>
    </article>
  )
}
