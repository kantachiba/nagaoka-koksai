import { useLanguage } from '../../i18n/LanguageContext'

/** 「12件」「12 results」のような件数表示（言語ごとに区切りを調整） */
export function ResultCount({ count }: { count: number }) {
  const { lang, t } = useLanguage()
  return (
    <p className="text-sm text-snow-500" aria-live="polite">
      <span className="text-base font-bold text-snow-800 tabular-nums">{count}</span>
      {lang === 'en' ? ' ' : ''}
      {t('common.count')}
    </p>
  )
}
