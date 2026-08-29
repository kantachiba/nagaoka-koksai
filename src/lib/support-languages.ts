import type { LocalizedField } from '../i18n/text'

/**
 * イベント・団体が「現地で対応できる言語」のマスタ。
 *
 * サイトの表示言語（src/i18n の locale）とは別物であることに注意。
 * 表示言語は日本語・ふりがな・英語の3つだが、現地対応言語はもっと多い。
 *
 * 言語を増やすときはここに1行足す。管理画面の選択肢もここから生成する。
 */
export const SUPPORT_LANGUAGES: Record<string, LocalizedField> = {
  ja: { ja: '日本語', furigana: '{日本語|にほんご}', en: 'Japanese' },
  'ja-easy': { ja: 'やさしい日本語', furigana: 'やさしい{日本語|にほんご}', en: 'Easy Japanese' },
  en: { ja: '英語', furigana: '{英語|えいご}', en: 'English' },
  zh: { ja: '中国語', furigana: '{中国語|ちゅうごくご}', en: 'Chinese' },
  vi: { ja: 'ベトナム語', furigana: 'ベトナム{語|ご}', en: 'Vietnamese' },
  pt: { ja: 'ポルトガル語', furigana: 'ポルトガル{語|ご}', en: 'Portuguese' },
  ko: { ja: '韓国語', furigana: '{韓国語|かんこくご}', en: 'Korean' },
  tl: { ja: 'タガログ語', furigana: 'タガログ{語|ご}', en: 'Tagalog' },
  id: { ja: 'インドネシア語', furigana: 'インドネシア{語|ご}', en: 'Indonesian' },
  ne: { ja: 'ネパール語', furigana: 'ネパール{語|ご}', en: 'Nepali' },
  bn: { ja: 'ベンガル語', furigana: 'ベンガル{語|ご}', en: 'Bengali' },
  hi: { ja: 'ヒンディー語', furigana: 'ヒンディー{語|ご}', en: 'Hindi' },
}

export const supportLanguageLabel = (code: string): LocalizedField =>
  SUPPORT_LANGUAGES[code] ?? { ja: code, furigana: code, en: code }
