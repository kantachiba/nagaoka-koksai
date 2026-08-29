import { Link } from 'react-router-dom'
import { useLanguage } from '../../i18n/LanguageContext'
import type { UiKey } from '../../i18n/dictionary'
import { Container } from '../ui/Container'
import { Icon } from '../ui/Icon'
import { LanguageSwitcher } from '../LanguageSwitcher'
import { LogoMark } from './Logo'

const LINKS: Array<{ to: string; key: UiKey }> = [
  { to: '/', key: 'nav.home' },
  { to: '/events', key: 'nav.events' },
  { to: '/reports', key: 'nav.reports' },
  { to: '/organizations', key: 'nav.organizations' },
]

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-brand-900 text-brand-100">
      <Container className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <LogoMark className="size-10" />
              <span className="text-balance-ja text-lg font-bold text-white">{t('site.name')}</span>
            </div>
            <p className="text-balance-ja mt-4 max-w-md text-sm leading-relaxed text-brand-200">
              {t('footer.aboutBody')}
            </p>
            <div className="mt-6">
              <p className="mb-2 text-xs font-bold text-brand-300">{t('lang.label')}</p>
              <div className="inline-block">
                <LanguageSwitcher />
              </div>
            </div>
          </div>

          <nav aria-label={t('footer.contents')}>
            <h2 className="text-sm font-bold text-white">{t('footer.contents')}</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="inline-flex items-center gap-1.5 text-brand-200 transition-colors hover:text-white hover:underline"
                  >
                    <Icon name="arrow-right" className="size-3.5 text-brand-400" />
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-bold text-white">{t('footer.contact')}</h2>
            <p className="text-balance-ja mt-4 text-sm leading-relaxed text-brand-200">
              {t('footer.contactBody')}
            </p>
            <p className="mt-4 flex items-center gap-2 text-sm text-brand-200">
              <Icon name="mail" className="size-4 text-brand-400" />
              info@example.jp
            </p>
            <p className="mt-1.5 flex items-center gap-2 text-sm text-brand-200">
              <Icon name="phone" className="size-4 text-brand-400" />
              0258-00-0000
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-brand-800 pt-6 text-xs text-brand-300 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Nagaoka International Portal (prototype)</p>
          <p className="flex items-center gap-1.5">
            <Icon name="info" className="size-3.5" />
            {t('footer.copyright')}
          </p>
        </div>
      </Container>
    </footer>
  )
}
