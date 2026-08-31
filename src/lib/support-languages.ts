import type { LocalizedField } from '../i18n/text'

/**
 * イベント・団体が「現地で対応できる言語」のマスタ。
 *
 * サイトの表示言語（src/i18n の locale）とは別物であることに注意。
 * 表示言語は日本語と英語の2つだが、現地対応言語はもっと多い。
 *
 * 言語を増やすときはここに1行足す。管理画面の選択肢もここから生成する。
 */
export const SUPPORT_LANGUAGES: Record<string, LocalizedField> = {
  ja: { ja: '日本語', en: 'Japanese' },
  'ja-easy': { ja: 'やさしい日本語', en: 'Easy Japanese' },
  en: { ja: '英語', en: 'English' },
  zh: { ja: '中国語', en: 'Chinese' },
  vi: { ja: 'ベトナム語', en: 'Vietnamese' },
  pt: { ja: 'ポルトガル語', en: 'Portuguese' },
  ko: { ja: '韓国語', en: 'Korean' },
  tl: { ja: 'タガログ語', en: 'Tagalog' },
  id: { ja: 'インドネシア語', en: 'Indonesian' },
  ne: { ja: 'ネパール語', en: 'Nepali' },
  bn: { ja: 'ベンガル語', en: 'Bengali' },
  hi: { ja: 'ヒンディー語', en: 'Hindi' },
}

export const supportLanguageLabel = (code: string): LocalizedField =>
  SUPPORT_LANGUAGES[code] ?? { ja: code, en: code }
