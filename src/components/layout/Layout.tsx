import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { useLanguage } from '../../i18n/LanguageContext'
import { Container } from '../ui/Container'
import { Icon } from '../ui/Icon'
import { Footer } from './Footer'
import { Header } from './Header'

export function Layout() {
  const { t } = useLanguage()

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-brand-800 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
      >
        {t('nav.skipToContent')}
      </a>

      <DummyDataNotice />
      <Header />

      <main id="main" className="flex-1">
        <ScrollToTopOnNavigate />
        <Outlet />
      </main>

      <Footer />
      <BackToTopButton />
    </div>
  )
}

/** 「これはダミーデータです」という開発中の告知バー */
function DummyDataNotice() {
  const { t } = useLanguage()
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  return (
    <div className="bg-hanabi-800 text-hanabi-50">
      <Container className="flex items-start gap-3 py-2.5">
        <Icon name="info" className="mt-0.5 size-4 shrink-0 text-hanabi-300" />
        <p className="text-balance-ja flex-1 text-xs leading-relaxed">{t('notice.dummy')}</p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label={t('nav.closeMenu')}
          className="-mt-0.5 shrink-0 rounded p-1 transition-colors hover:bg-hanabi-700"
        >
          <Icon name="close" className="size-4" />
        </button>
      </Container>
    </div>
  )
}

/** ページ遷移のたびに先頭へスクロールを戻す */
function ScrollToTopOnNavigate() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

/** 一定量スクロールしたら現れるページトップボタン */
function BackToTopButton() {
  const { t } = useLanguage()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={t('common.pageTop')}
      className={cn(
        'fixed right-4 bottom-4 z-30 inline-flex size-11 items-center justify-center rounded-full bg-brand-800 text-white shadow-lg transition-all hover:bg-brand-700',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0',
      )}
    >
      <Icon name="arrow-up" className="size-5" />
    </button>
  )
}
