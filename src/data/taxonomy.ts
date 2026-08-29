import type { AreaId, CategoryId, FieldId, SupportLangId, Taxon } from './types'

/** イベントのジャンル一覧（絞り込みUIの並び順もこの順） */
export const CATEGORIES: Taxon<CategoryId>[] = [
  {
    id: 'exchange',
    tone: 'brand',
    label: { ja: '交流会', en: 'Meetups', easy: 'おしゃべり会（かい）' },
  },
  {
    id: 'language',
    tone: 'emerald',
    label: { ja: '日本語・語学', en: 'Language', easy: 'ことばの べんきょう' },
  },
  {
    id: 'culture',
    tone: 'violet',
    label: { ja: '文化・体験', en: 'Culture', easy: 'ぶんか たいけん' },
  },
  {
    id: 'festival',
    tone: 'hanabi',
    label: { ja: 'まつり・フェス', en: 'Festivals', easy: 'おまつり' },
  },
  { id: 'food', tone: 'rose', label: { ja: '料理・食', en: 'Food', easy: 'りょうり' } },
  {
    id: 'support',
    tone: 'sky',
    label: { ja: '生活サポート', en: 'Living support', easy: 'くらしの サポート' },
  },
  {
    id: 'seminar',
    tone: 'amber',
    label: { ja: '講座・セミナー', en: 'Lectures', easy: 'べんきょう会（かい）' },
  },
  {
    id: 'youth',
    tone: 'slate',
    label: { ja: 'こども・ユース', en: 'Kids & youth', easy: 'こども・わかい 人（ひと）' },
  },
]

/** 市内のエリア区分 */
export const AREAS: Taxon<AreaId>[] = [
  {
    id: 'chuo',
    tone: 'brand',
    label: { ja: '中心市街地', en: 'City center', easy: 'まちの まんなか' },
  },
  {
    id: 'nagaoka-eki',
    tone: 'brand',
    label: { ja: '長岡駅周辺', en: 'Nagaoka Sta. area', easy: '長岡駅（ながおかえき）の ちかく' },
  },
  { id: 'settaya', tone: 'brand', label: { ja: '摂田屋', en: 'Settaya', easy: '摂田屋（せったや）' } },
  {
    id: 'yamakoshi',
    tone: 'brand',
    label: { ja: '山古志', en: 'Yamakoshi', easy: '山古志（やまこし）' },
  },
  { id: 'koshiji', tone: 'brand', label: { ja: '越路', en: 'Koshiji', easy: '越路（こしじ）' } },
  {
    id: 'teradomari',
    tone: 'brand',
    label: { ja: '寺泊', en: 'Teradomari', easy: '寺泊（てらどまり）' },
  },
  { id: 'tochio', tone: 'brand', label: { ja: '栃尾', en: 'Tochio', easy: '栃尾（とちお）' } },
  { id: 'yoita', tone: 'brand', label: { ja: '与板', en: 'Yoita', easy: '与板（よいた）' } },
  { id: 'online', tone: 'slate', label: { ja: 'オンライン', en: 'Online', easy: 'オンライン' } },
]

/** 対応言語（イベント・団体の両方で使用） */
export const SUPPORT_LANGS: Taxon<SupportLangId>[] = [
  { id: 'ja', tone: 'slate', label: { ja: '日本語', en: 'Japanese', easy: '日本語（にほんご）' } },
  {
    id: 'easy',
    tone: 'slate',
    label: { ja: 'やさしい日本語', en: 'Easy Japanese', easy: 'やさしい 日本語（にほんご）' },
  },
  { id: 'en', tone: 'slate', label: { ja: '英語', en: 'English', easy: 'えいご' } },
  { id: 'zh', tone: 'slate', label: { ja: '中国語', en: '中文', easy: 'ちゅうごくご' } },
  { id: 'vi', tone: 'slate', label: { ja: 'ベトナム語', en: 'Tiếng Việt', easy: 'ベトナムご' } },
  { id: 'pt', tone: 'slate', label: { ja: 'ポルトガル語', en: 'Português', easy: 'ポルトガルご' } },
  { id: 'ko', tone: 'slate', label: { ja: '韓国語', en: '한국어', easy: 'かんこくご' } },
  { id: 'tl', tone: 'slate', label: { ja: 'タガログ語', en: 'Tagalog', easy: 'タガログご' } },
  {
    id: 'id',
    tone: 'slate',
    label: { ja: 'インドネシア語', en: 'Bahasa Indonesia', easy: 'インドネシアご' },
  },
  { id: 'ne', tone: 'slate', label: { ja: 'ネパール語', en: 'नेपाली', easy: 'ネパールご' } },
]

/** 団体の活動分野 */
export const FIELDS: Taxon<FieldId>[] = [
  {
    id: 'exchange',
    tone: 'brand',
    label: { ja: '国際交流', en: 'Exchange', easy: 'こくさいこうりゅう' },
  },
  {
    id: 'japanese',
    tone: 'emerald',
    label: { ja: '日本語支援', en: 'Japanese support', easy: '日本語（にほんご）の サポート' },
  },
  {
    id: 'culture',
    tone: 'violet',
    label: { ja: '文化紹介', en: 'Culture', easy: 'ぶんかの しょうかい' },
  },
  {
    id: 'youth',
    tone: 'sky',
    label: { ja: '青少年育成', en: 'Youth', easy: 'こどもの かつどう' },
  },
  {
    id: 'living',
    tone: 'amber',
    label: { ja: '生活支援', en: 'Living support', easy: 'くらしの サポート' },
  },
  {
    id: 'community',
    tone: 'sky',
    label: { ja: '地域づくり', en: 'Community building', easy: 'まちづくり' },
  },
  { id: 'disaster', tone: 'rose', label: { ja: '防災', en: 'Disaster prep', easy: 'ぼうさい' } },
  { id: 'food', tone: 'rose', label: { ja: '食文化', en: 'Food culture', easy: 'たべものの ぶんか' } },
  { id: 'sports', tone: 'emerald', label: { ja: 'スポーツ', en: 'Sports', easy: 'スポーツ' } },
]

// ------------------------------------------------------------------ 参照ヘルパー

const byId = <T extends { id: string }>(list: T[]) =>
  new Map(list.map((item) => [item.id, item] as const))

const categoryMap = byId(CATEGORIES)
const areaMap = byId(AREAS)
const langMap = byId(SUPPORT_LANGS)
const fieldMap = byId(FIELDS)

export const getCategory = (id: CategoryId) => categoryMap.get(id)!
export const getArea = (id: AreaId) => areaMap.get(id)!
export const getSupportLang = (id: SupportLangId) => langMap.get(id)!
export const getField = (id: FieldId) => fieldMap.get(id)!
