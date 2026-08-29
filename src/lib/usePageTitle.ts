import { useEffect } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

/**
 * ページごとの <title> を設定する。
 * 表示言語を切り替えたときもタイトルが追随します。
 */
export function usePageTitle(title?: string) {
  const { lang, t } = useLanguage()
  const siteName = t('site.name')

  useEffect(() => {
    const separator = lang === 'en' ? ' | ' : '｜'
    document.title = title ? `${title}${separator}${siteName}` : siteName
  }, [title, siteName, lang])
}
