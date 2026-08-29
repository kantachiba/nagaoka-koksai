import { usePageTitle } from '../lib/usePageTitle'
import { useLanguage } from '../i18n/LanguageContext'
import { ButtonLink } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { Icon } from '../components/ui/Icon'

export function NotFoundPage() {
  const { t } = useLanguage()
  usePageTitle(t('notfound.title'))

  return (
    <Container className="py-24 text-center sm:py-32">
      <p className="text-6xl font-bold text-brand-100 sm:text-8xl">404</p>
      <h1 className="mt-4 text-2xl sm:text-3xl">{t('notfound.title')}</h1>
      <p className="text-balance-ja mx-auto mt-4 max-w-md text-snow-600">{t('notfound.body')}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink to="/" size="lg">
          <Icon name="arrow-left" className="size-5" />
          {t('notfound.back')}
        </ButtonLink>
        <ButtonLink to="/events" variant="outline" size="lg">
          {t('nav.events')}
        </ButtonLink>
      </div>
    </Container>
  )
}
