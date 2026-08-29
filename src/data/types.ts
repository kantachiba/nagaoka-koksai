import type { LocalizedText } from '../i18n/types'

/** イベントのジャンル */
export type CategoryId =
  | 'exchange'
  | 'language'
  | 'culture'
  | 'festival'
  | 'food'
  | 'support'
  | 'seminar'
  | 'youth'

/** 長岡市内のエリア区分 */
export type AreaId =
  | 'chuo'
  | 'nagaoka-eki'
  | 'settaya'
  | 'yamakoshi'
  | 'koshiji'
  | 'teradomari'
  | 'tochio'
  | 'yoita'
  | 'online'

/** イベント・団体が対応できる言語 */
export type SupportLangId = 'ja' | 'easy' | 'en' | 'zh' | 'vi' | 'pt' | 'ko' | 'tl' | 'id' | 'ne'

/** 団体の活動分野 */
export type FieldId =
  | 'exchange'
  | 'japanese'
  | 'culture'
  | 'youth'
  | 'living'
  | 'community'
  | 'disaster'
  | 'food'
  | 'sports'

/** 分類マスタの1件ぶん。`tone` はバッジの配色キー */
export type Taxon<Id extends string> = {
  id: Id
  label: LocalizedText
  tone: BadgeTone
}

export type BadgeTone =
  | 'brand'
  | 'hanabi'
  | 'emerald'
  | 'violet'
  | 'sky'
  | 'amber'
  | 'rose'
  | 'slate'

/** プレースホルダー画像（SVG）の生成に使う見た目のヒント */
export type Visual = {
  /** グラデーションの配色パターン（0-5） */
  palette: number
  /** 装飾モチーフ（0-4） */
  motif: number
}

export type EventItem = {
  id: string
  slug: string
  title: LocalizedText
  summary: LocalizedText
  /** 本文（段落ごとの配列） */
  body: LocalizedText[]
  category: CategoryId
  area: AreaId
  /** ISO 形式の日付 'YYYY-MM-DD' */
  date: string
  /** 複数日開催の場合の終了日 */
  endDate?: string
  startTime: string
  endTime: string
  venue: LocalizedText
  address: LocalizedText
  /** 会場までのアクセス */
  access: LocalizedText
  fee: LocalizedText
  /** 無料イベントか（バッジ表示に使用） */
  isFree: boolean
  capacity?: number
  target: LocalizedText
  languages: SupportLangId[]
  organizerId: string
  contactEmail: string
  contactPhone: string
  applicationRequired: boolean
  /** 申込締切（ISO 日付） */
  applicationDeadline?: string
  featured: boolean
  visual: Visual
}

export type ReportItem = {
  id: string
  slug: string
  title: LocalizedText
  summary: LocalizedText
  body: LocalizedText[]
  /** 実施日 */
  heldOn: string
  /** 記事公開日 */
  publishedAt: string
  organizerId: string
  /** 関連イベント（あれば） */
  relatedEventId?: string
  participants: number
  author: LocalizedText
  category: CategoryId
  /** ギャラリー用のダミー写真（キャプション＋見た目ヒント） */
  photos: Array<{ caption: LocalizedText; visual: Visual }>
  /** 公開情報にもとづく記事の場合の出典 URL */
  sourceUrl?: string
  sourceLabel?: LocalizedText
  visual: Visual
}

/**
 * 団体情報。
 *
 * 公開情報に記載がない項目は、値を推測せず省略できるよう任意にしています
 * （UI 側は未設定の行を出しません）。
 */
export type Organization = {
  id: string
  slug: string
  name: LocalizedText
  /** 略称・通称 */
  shortName: LocalizedText
  catchphrase: LocalizedText
  about: LocalizedText[]
  activities: LocalizedText[]
  fields: FieldId[]
  languages: SupportLangId[]
  foundedYear?: number
  /** 設立年月など、年だけでは表せない場合の表記（foundedYear より優先して表示） */
  foundedLabel?: LocalizedText
  memberCount?: number
  meetingPlace?: LocalizedText
  frequency?: LocalizedText
  membershipFee?: LocalizedText
  contactEmail?: string
  contactPhone?: string
  website?: string
  /** SNS アカウント（表示名と URL） */
  socials?: Array<{ label: string; url: string }>
  /** 掲載情報の出典（公開ページの URL） */
  sourceUrl?: string
  /** 出典の名称（「長岡市市民活動団体データベース」など） */
  sourceLabel?: LocalizedText
  recruiting: boolean
  visual: Visual
}
