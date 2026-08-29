import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { useLanguage } from '../../i18n/LanguageContext'
import type { UiKey } from '../../i18n/dictionary'
import { LanguageSwitcher } from '../LanguageSwitcher'
import { Container } from '../ui/Container'
import { Icon } from '../ui/Icon'
import { LogoMark } from './Logo'

const NAV_ITEMS: Array<{ to: string; key: UiKey }> = [
  { to: '/events', key: 'nav.events' },
  { to: '/reports', key: 'nav.reports' },
  { to: '/organizations', key: 'nav.organizations' },
]

export function Header() {
  const { lang, t } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  // ページ遷移したらモバイルメニューを閉じる
  useEffect(() => setMenuOpen(false), [location.pathname])

  return (
    <header className="sticky top-0 z-40 border-b border-snow-200 bg-white/90 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4 sm:h-18">
          <Link
            to="/"
            className="flex min-w-0 items-center gap-2.5 rounded-lg py-1 transition-opacity hover:opacity-80"
          >
            <LogoMark className="size-9 shrink-0" />
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="text-balance-ja text-sm font-bold text-brand-900 sm:text-base">
                {t('site.name')}
              </span>
              {/* 英語表示のときはサイト名そのものが英語なので、欧文の副題は省く */}
              {lang !== 'en' && (
                <span className="hidden text-[0.65rem] font-medium tracking-wide text-snow-500 sm:block">
                  NAGAOKA INTERNATIONAL PORTAL
                </span>
              )}
            </span>
          </Link>

          <nav aria-label={t('nav.main')} className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'relative rounded-lg px-4 py-2 text-sm font-bold transition-colors',
                    isActive
                      ? 'text-brand-800 after:absolute after:inset-x-4 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-hanabi-500'
                      : 'text-snow-600 hover:bg-snow-100 hover:text-snow-900',
                  )
                }
              >
                {t(item.key)}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
              className="inline-flex size-10 items-center justify-center rounded-lg text-snow-700 transition-colors hover:bg-snow-100 lg:hidden"
            >
              <Icon name={menuOpen ? 'close' : 'menu'} className="size-6" />
            </button>
          </div>
        </div>
      </Container>

      {/* モバイルメニュー */}
      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="border-t border-snow-200 bg-white lg:hidden"
      >
        <Container className="py-4">
          <nav aria-label={t('nav.main')} className="flex flex-col gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-4 py-3 font-bold transition-colors',
                  isActive ? 'bg-brand-50 text-brand-800' : 'text-snow-700 hover:bg-snow-100',
                )
              }
            >
              {t('nav.home')}
            </NavLink>
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-4 py-3 font-bold transition-colors',
                    isActive ? 'bg-brand-50 text-brand-800' : 'text-snow-700 hover:bg-snow-100',
                  )
                }
              >
                {t(item.key)}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 border-t border-snow-200 pt-4 sm:hidden">
            <p className="mb-2 text-xs font-bold text-snow-500">{t('lang.label')}</p>
            <LanguageSwitcher variant="block" />
          </div>
        </Container>
      </div>
    </header>
  )
}
