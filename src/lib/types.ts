import type { LocalizedField } from '../i18n/text'

/**
 * 公開コンテンツの型。Firestore のドキュメント構造とそのまま対応する。
 *
 * 多言語フィールドは { ja, furigana, en } のマップ。日本語以外が空のときは
 * resolveText が日本語へフォールバックする（src/i18n/text.ts）。
 */

/** 公開レベル（仕様 B-5） */
export type Visibility =
  /** 公開・申込可 */
  | 'public'
  /** 公開・告知のみ（申込不可） */
  | 'announce'
  /** 招待者限定（「※招待制」を表示） */
  | 'invite'
  /** 告知なし（活動報告だけ載せる。一覧にも詳細にも出さない） */
  | 'hidden'

/** 申込方法（仕様 B-3） */
export type ApplicationType =
  /** 申込不要・直接会場へ */
  | 'none'
  /** サイト内フォームで申込（FEATURES.applicationForm が true のときだけ機能する） */
  | 'internal'
  /** 外部リンク・メールへ誘導 */
  | 'external'

/** 参加対象 */
export type Audience = 'anyone' | 'family' | 'invited'

/** 下書きか公開か */
export type Status = 'draft' | 'published'

/** タグ（仕様 A-2）。管理画面から追加・改名できる */
export type Tag = {
  id: string
  slug: string
  name: LocalizedField
  /** バッジの配色キー */
  tone: 'brand' | 'hanabi' | 'emerald' | 'violet' | 'sky' | 'amber' | 'rose' | 'slate'
  order: number
}

/** 団体（仕様 A-4） */
export type Organization = {
  id: string
  slug: string
  name: LocalizedField
  shortName: LocalizedField
  /** 理念 */
  philosophy: LocalizedField
  /** 活動概要（段落ごと） */
  description: LocalizedField[]
  /** 主な活動 */
  activities: LocalizedField[]
  email?: string
  /** Instagram・公式サイトなど */
  links: Array<{ label: string; url: string }>
  /** Cloud Storage 上のパス。未設定ならプレースホルダーを描画する */
  imagePath?: string
  /** 掲載情報の出典 */
  sourceUrl?: string
  sourceLabel?: LocalizedField
  /** メンバー募集中か */
  recruiting: boolean
  status: Status
  updatedAt: string
}

/** イベント（仕様 A-2） */
export type EventItem = {
  id: string
  slug: string
  title: LocalizedField
  summary: LocalizedField
  body: LocalizedField[]
  organizationId: string
  /** ISO 8601（'2026-06-27T19:00:00+09:00'） */
  startAt: string
  endAt: string
  venue: LocalizedField
  address: LocalizedField
  /** 地図サービスへのリンク */
  mapUrl?: string
  access: LocalizedField
  fee: LocalizedField
  /** 「無料」を明示するためのフラグ */
  isFree: boolean
  /** 対応言語（i18n の locale ではなく、現地で通じる言語） */
  supportLanguages: string[]
  audience: Audience
  /** 未設定なら定員の行を出さない */
  capacity?: number
  tagIds: string[]
  applicationType: ApplicationType
  applicationUrl?: string
  applicationEmail?: string
  visibility: Visibility
  /** イベント単位のコメント可否（仕様 B-1） */
  commentsEnabled: boolean
  imagePath?: string
  instagramUrl?: string
  status: Status
  updatedAt: string
}

/** 活動報告（仕様 A-3） */
export type ReportItem = {
  id: string
  slug: string
  title: LocalizedField
  summary: LocalizedField
  body: LocalizedField[]
  organizationId: string
  /** 実施日 'YYYY-MM-DD' */
  heldOn: string
  /** 公開日 'YYYY-MM-DD' */
  publishedAt: string
  /** 任意項目。入力があるときだけ表示する */
  participants?: number
  tagIds: string[]
  /** 対応するイベント（あれば相互リンクする） */
  relatedEventId?: string
  photos: Array<{ path: string; caption: LocalizedField }>
  instagramUrl?: string
  /** 公開情報にもとづく記事の場合の出典 */
  sourceUrl?: string
  sourceLabel?: LocalizedField
  status: Status
  updatedAt: string
}

/** サイト全体のコンテンツ一式（ビルド時に一度だけ取得する） */
export type ContentBundle = {
  tags: Tag[]
  organizations: Organization[]
  events: EventItem[]
  reports: ReportItem[]
  /** Firestore から取れず、モックで描画しているか */
  isMock: boolean
}
