import type { LocalizedField } from '../i18n/text'

/**
 * サイト全体の設定。仕様書 A-5 / A-6 / B の「設定ファイルで一元管理」は
 * すべてこのファイルで満たす。ここ以外に名前・URL・フラグを直書きしないこと。
 */

// ------------------------------------------------------------------ A-6 サイト名

/**
 * サイト名。ロゴ・ページタイトル・OGP はすべてここを参照しているので、
 * 変えるときはこの1か所だけ差し替える。
 */
export const SITE_NAME: LocalizedField = {
  ja: 'ながおか国際交流ポータル',
  en: 'Nagaoka International Portal',
}

export const SITE_DESCRIPTION: LocalizedField = {
  ja: '長岡市の国際交流イベント・活動報告・団体情報を集約するポータルサイトです。',
  en: 'Events, activity reports and groups working on international exchange in Nagaoka.',
}

// ------------------------------------------------------------------ Firebase

/** Firestore / Auth / Storage を置いている Firebase プロジェクト */
export const FIREBASE_PROJECT_ID = 'nagaoka-kokusai-portal'

/**
 * 本番URL。OGP と sitemap の絶対URL生成に使う。
 *
 * ⚠️ chibanian.com のサブパスで公開しているため、末尾にパスが付く。
 *    Firebase Hosting 自体はこのパスを知らず、ルート（/events など）で
 *    配信している。ドメイン直下には既存の個人サイトがあるため、
 *    Cloudflare Worker が chibanian.com/international-portal/* を
 *    Firebase Hosting へプロキシし、HTML内の相対パスにこのプレフィックスを
 *    付け直している（cloudflare/international-portal-proxy.js）。
 *    パスを含むぶん、素の `new URL(p, SITE_URL)` は使わないこと
 *    （先頭が '/' の相対参照は WHATWG URL 仕様でパス部分を丸ごと
 *    上書きしてしまい、このパスが消える）。絶対URLは必ず absoluteUrl() で作る。
 */
export const SITE_URL = 'https://chibanian.com/international-portal'

/**
 * ルート相対パスを、このサイトの絶対URLにする。
 * `new URL(p, SITE_URL)` は SITE_URL 側のパス部分を消してしまうため使わない。
 */
export function absoluteUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`
  return p === '/' ? SITE_URL : `${SITE_URL}${p}`
}

/** ロゴ画像を用意したらここにパスを入れる。空ならシンボルマークを描画する */
export const SITE_LOGO_PATH = ''

// ------------------------------------------------------------------ A-5 ハッシュタグ

/**
 * SNSシェア時に付ける共通ハッシュタグ。
 * ⚠️ 候補段階。確定したらこの配列だけ差し替える。
 */
export const HASHTAGS = ['#長岡国際交流', '#NagaokaGlobal']

// ------------------------------------------------------------------ A-2 一覧の見せ方

/**
 * 絞り込みUIを表示し始める件数。
 * イベントがこの数以下のときは、UIが過剰にならないよう絞り込みを隠す。
 */
export const FILTER_VISIBLE_THRESHOLD = 8

// ------------------------------------------------------------------ B群 機能フラグ

/**
 * 検討中の機能。**既定はすべて false**。
 * false のときは画面に痕跡を残さない（DOMごと出力しない）。
 */
export const FEATURES = {
  /** B-1 コメント（管理者承認後に公開） */
  comments: false,
  /** B-2 意見箱（企画案・手伝いたい人の受付） */
  suggestionBox: false,
  /** B-3 参加申請フォーム（サイト内で申込を受ける） */
  applicationForm: false,
  /** B-4 LINE オープンチャットへの導線 */
  lineOpenChat: false,
} as const

export type FeatureName = keyof typeof FEATURES

export function isEnabled(feature: FeatureName): boolean {
  return FEATURES[feature]
}

// ------------------------------------------------------------------ B-4 グループチャット

/**
 * LINE オープンチャットの招待URL。
 * ⚠️ 空文字のあいだは、FEATURES.lineOpenChat が true でも導線ごと表示しない。
 */
export const LINE_OPEN_CHAT_URL = ''

// ------------------------------------------------------------------ 公開状態

/**
 * true にすると全ページに noindex を入れ、検索エンジンに登録させない。
 * 実データが揃うまでの措置だったので、公開に合わせて false にした。
 * （/admin は BaseLayout を使わず、各ページで個別に noindex を入れている）
 */
export const NOINDEX = false
