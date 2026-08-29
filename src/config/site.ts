import type { LocalizedField } from '../i18n/text'

/**
 * サイト全体の設定。仕様書 A-5 / A-6 / B の「設定ファイルで一元管理」は
 * すべてこのファイルで満たす。ここ以外に名前・URL・フラグを直書きしないこと。
 */

// ------------------------------------------------------------------ A-6 サイト名

/**
 * ⚠️ サイト名・チーム名は未確定。決まったらこの1か所だけ差し替える。
 *    ロゴ・ページタイトル・OGP はすべてここを参照している。
 */
export const SITE_NAME: LocalizedField = {
  ja: 'ながおか国際交流ポータル（仮）',
  furigana: 'ながおか{国際交流|こくさいこうりゅう}ポータル（{仮|かり}）',
  en: 'Nagaoka International Portal (working title)',
}

export const SITE_DESCRIPTION: LocalizedField = {
  ja: '長岡市の国際交流イベント・活動報告・団体情報を集約するポータルサイトです。',
  furigana:
    '{長岡市|ながおかし}の{国際交流|こくさいこうりゅう}イベント・{活動報告|かつどうほうこく}・{団体|だんたい}の{情報|じょうほう}をまとめたサイトです。',
  en: 'Events, activity reports and groups working on international exchange in Nagaoka.',
}

/** 本番URL。OGP と sitemap の絶対URL生成に使う */
export const SITE_URL = 'https://nagaoka-kokusai-portal.web.app'

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
 * 実データが揃うまでは検索エンジンに登録させない。
 * 公開準備が整ったら false にする。
 */
export const NOINDEX = true
