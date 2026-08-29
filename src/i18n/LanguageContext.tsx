import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { dictionary } from './dictionary'
import type { UiKey } from './dictionary'
import { isLang, LANGUAGE_LABELS } from './types'
import type { Lang, LocalizedText } from './types'

const STORAGE_KEY = 'nagaoka-kokusai:lang'

type LanguageContextValue = {
  /** 現在の表示言語 */
  lang: Lang
  setLang: (next: Lang) => void
  /** UI辞書からラベルを引く */
  t: (key: UiKey) => string
  /** データに埋め込まれた多言語テキストを現在の言語で取り出す */
  tx: (text: LocalizedText | undefined) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function readStoredLang(): Lang {
  if (typeof window === 'undefined') return 'ja'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return isLang(stored) ? stored : 'ja'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStoredLang)

  // <html lang> を実際の言語に追随させる（スクリーンリーダーの読み上げ用）
  useEffect(() => {
    document.documentElement.lang = LANGUAGE_LABELS[lang].htmlLang
    window.localStorage.setItem(STORAGE_KEY, lang)
  }, [lang])

  const setLang = useCallback((next: Lang) => setLangState(next), [])

  const value = useMemo<LanguageContextValue>(() => {
    return {
      lang,
      setLang,
      t: (key: UiKey) => dictionary[key][lang] || dictionary[key].ja,
      tx: (text?: LocalizedText) => (text ? text[lang] || text.ja : ''),
    }
  }, [lang, setLang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage は LanguageProvider の内側で呼び出してください')
  return ctx
}
