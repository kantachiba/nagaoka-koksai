import type { ImageMetadata } from 'astro'
import type { LocalizedField } from '../../i18n/text'

import group from './exchange-group.jpg'
import groupWide from './exchange-group-wide.jpg'
import activityCircle from './exchange-activity-circle.jpg'
import activityGame from './exchange-activity-game.jpg'

/**
 * サイト自身が使う写真（記事の写真とは別）。
 *
 * 記事や団体の写真は Firestore から取得して public/photos/ に書き出すが、
 * こちらはトップページや OGP などサイトの構造に組み込まれた写真なので、
 * リポジトリで管理して Astro の画像最適化（webp 変換・リサイズ）に通す。
 *
 * ⚠️ 実際の参加者が写っている写真です。差し替える場合も、掲載の同意が
 *    取れているものを使ってください。
 */
export type SitePhoto = {
  image: ImageMetadata
  alt: LocalizedField
}

export const SITE_PHOTOS = {
  /** 集合写真（トップのヒーロー用） */
  group: {
    image: group,
    alt: {
      ja: '国際交流イベントに参加した高校生たちの集合写真',
      en: 'Students gathered at an international exchange event in Nagaoka',
    },
  },
  /** 集合写真（横長・OGP用） */
  groupWide: {
    image: groupWide,
    alt: {
      ja: '国際交流イベントの参加者による集合写真',
      en: 'Participants at an international exchange event in Nagaoka',
    },
  },
  /** 輪になって話す様子 */
  activityCircle: {
    image: activityCircle,
    alt: {
      ja: '輪になって交流する参加者たち',
      en: 'Participants talking together in a circle',
    },
  },
  /** ゲームで交流する様子 */
  activityGame: {
    image: activityGame,
    alt: {
      ja: 'ゲームを通じて交流する参加者たち',
      en: 'Participants getting to know each other through a game',
    },
  },
} as const satisfies Record<string, SitePhoto>
