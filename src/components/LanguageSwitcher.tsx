import { cn } from '../lib/cn'
import { useLanguage } from '../i18n/LanguageContext'
import { LANGUAGES, LANGUAGE_LABELS } from '../i18n/types'
import { Icon } from './ui/Icon'

/**
 * 日本語 / English / やさしい日本語 の切替。
 * 選択状態は localStorage に保存され、次回アクセス時も維持されます。
 */
export function LanguageSwitcher({ variant = 'inline' }: { variant?: 'inline' | 'block' }) {
  const { lang, setLang, t } = useLanguage()

  return (
    <div
      role="group"
      aria-label={t('lang.switch')}
      className={cn(
        'flex items-center gap-0.5 rounded-full bg-snow-100 p-1',
        variant === 'block' && 'w-full',
      )}
    >
      <Icon name="globe" className="ml-1.5 size-4 shrink-0 text-snow-500" />
      {LANGUAGES.map((code) => {
        const isActive = code === lang
        return (
          <button
            key={code}
            type="button"
            lang={LANGUAGE_LABELS[code].htmlLang}
            onClick={() => setLang(code)}
            aria-pressed={isActive}
            className={cn(
              'rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap transition-colors',
              variant === 'block' && 'flex-1',
              isActive
                ? 'bg-white text-brand-800 shadow-sm'
                : 'text-snow-500 hover:text-snow-800',
            )}
          >
            {LANGUAGE_LABELS[code].short}
          </button>
        )
      })}
    </div>
  )
}
