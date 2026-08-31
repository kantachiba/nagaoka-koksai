import type { EventItem } from './types'
import { paragraphsToLocalizedDoc } from './blocks'

/**
 * 表示確認のためだけのサンプルイベント。
 *
 * ⚠️ 本番では読み込まれない。`CONTENT_FIXTURES=1 npm run build` のときだけ
 *    モックに合流する（src/lib/content.ts 参照）。
 *    実在団体に架空のイベントを紐づけたまま公開しないための隔離。
 *
 * カレンダー表示・絞り込み・公開レベルの出し分けを確認できるよう、
 * 月をまたぐ日程と、4種類の visibility を含めてある。
 */

const iso = (daysFromNow: number, time: string): string => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + daysFromNow)
  const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  return `${date}T${time}:00+09:00`
}

const base = {
  status: 'published' as const,
  updatedAt: new Date().toISOString(),
  address: { ja: '新潟県長岡市（サンプル住所）', en: 'Nagaoka, Niigata (sample)' },
  access: { ja: 'JR長岡駅から徒歩5分', en: '5 min walk from JR Nagaoka Station' },
  mapUrl: 'https://maps.google.com/?q=Nagaoka+Station',
  supportLanguages: ['ja', 'en'],
  commentsEnabled: false,
  instagramUrl: '',
}

export const DEV_EVENTS: EventItem[] = [
  {
    ...base, id: 'fx-1', slug: 'fx-nihongo-cafe', organizationId: 'wa',
    title: { ja: '【サンプル】にほんごカフェ', en: '[Sample] Nihongo Café' },
    summary: { ja: 'お茶を飲みながら日本語で話す、申込不要の集まりです。', en: 'Drop in and talk in Japanese over a cup of tea.' },
    body: paragraphsToLocalizedDoc([{ ja: 'これは表示確認用のサンプルです。', en: 'This is sample content for layout checking.' }]),
    startAt: iso(4, '19:00'), endAt: iso(4, '20:30'),
    venue: { ja: 'まちなかキャンパス長岡', en: 'Machinaka Campus Nagaoka' },
    fee: { ja: '無料', en: 'Free' }, isFree: true,
    audience: 'anyone', tagIds: ['language', 'free', 'meetup'],
    applicationType: 'none', visibility: 'public',
  },
  {
    ...base, id: 'fx-2', slug: 'fx-world-food', organizationId: 'wa',
    title: { ja: '【サンプル】ワールドフードフェス', en: '[Sample] World Food Festival' },
    summary: { ja: '15の国と地域の家庭料理が並ぶ2日間です。', en: 'Home cooking from fifteen countries over two days.' },
    body: paragraphsToLocalizedDoc([{ ja: 'これは表示確認用のサンプルです。', en: 'This is sample content for layout checking.' }]),
    startAt: iso(12, '10:00'), endAt: iso(13, '17:00'),
    venue: { ja: 'アオーレ長岡 ナカドマ', en: 'Aore Nagaoka' },
    fee: { ja: '入場無料（飲食は別途）', en: 'Free entry' }, isFree: true,
    audience: 'family', tagIds: ['food', 'festival', 'free'],
    applicationType: 'none', visibility: 'public',
  },
  {
    ...base, id: 'fx-3', slug: 'fx-bosai', organizationId: 'world-lamp-kai',
    title: { ja: '【サンプル】やさしい日本語で学ぶ防災', en: '[Sample] Disaster preparedness workshop' },
    summary: { ja: '地震のときどうするかを、いっしょに確認します。', en: 'What to do in an earthquake.' },
    body: paragraphsToLocalizedDoc([{ ja: 'これは表示確認用のサンプルです。', en: 'This is sample content for layout checking.' }]),
    startAt: iso(26, '13:30'), endAt: iso(26, '16:00'),
    venue: { ja: 'きおくみらい', en: 'Kioku Mirai' },
    fee: { ja: '無料', en: 'Free' }, isFree: true,
    capacity: 30, audience: 'anyone', tagIds: ['support', 'free'],
    applicationType: 'internal', visibility: 'public',
  },
  {
    ...base, id: 'fx-4', slug: 'fx-cooking', organizationId: 'world-lamp-kai',
    title: { ja: '【サンプル】世界のごはん教室', en: '[Sample] World kitchen' },
    summary: { ja: '長岡在住の方に教わる家庭料理の会です。', en: 'Learn home cooking from a local resident.' },
    body: paragraphsToLocalizedDoc([{ ja: 'これは表示確認用のサンプルです。', en: 'This is sample content for layout checking.' }]),
    startAt: iso(40, '10:00'), endAt: iso(40, '13:00'),
    venue: { ja: 'ながおか市民センター', en: 'Nagaoka Civic Center' },
    fee: { ja: '1,200円（材料費込み）', en: '¥1,200' }, isFree: false,
    capacity: 20, audience: 'anyone', tagIds: ['food', 'culture'],
    applicationType: 'external', applicationUrl: 'https://example.jp/apply', visibility: 'public',
  },
  {
    ...base, id: 'fx-5', slug: 'fx-invite-only', organizationId: 'world-lamp-kai',
    title: { ja: '【サンプル】ワールドランプ会（招待制）', en: '[Sample] World Lamp Kai gathering' },
    summary: { ja: '招待者限定の交流会です。', en: 'An invitation-only gathering.' },
    body: paragraphsToLocalizedDoc([{ ja: 'これは表示確認用のサンプルです。', en: 'This is sample content for layout checking.' }]),
    startAt: iso(55, '19:00'), endAt: iso(55, '21:00'),
    venue: { ja: 'ミライエ長岡', en: 'Miraie Nagaoka' },
    fee: { ja: '実費', en: 'Actual cost' }, isFree: false,
    audience: 'invited', tagIds: ['meetup'],
    applicationType: 'none', visibility: 'invite',
  },
  {
    ...base, id: 'fx-6', slug: 'fx-announce-only', organizationId: 'wa',
    title: { ja: '【サンプル】告知のみのイベント', en: '[Sample] Announcement-only event' },
    summary: { ja: '申込は受け付けていない告知のみの掲載です。', en: 'Announcement only; registration is not open.' },
    body: paragraphsToLocalizedDoc([{ ja: 'これは表示確認用のサンプルです。', en: 'This is sample content for layout checking.' }]),
    startAt: iso(70, '14:00'), endAt: iso(70, '16:00'),
    venue: { ja: '長岡市立劇場', en: 'Nagaoka Civic Theatre' },
    fee: { ja: '観覧無料', en: 'Free to attend' }, isFree: true,
    audience: 'anyone', tagIds: ['culture', 'free'],
    applicationType: 'none', visibility: 'announce',
  },
  {
    ...base, id: 'fx-7', slug: 'fx-past', organizationId: 'wa',
    title: { ja: '【サンプル】終了したイベント', en: '[Sample] Past event' },
    summary: { ja: 'アーカイブ表示の確認用です。', en: 'For checking the archive view.' },
    body: paragraphsToLocalizedDoc([{ ja: 'これは表示確認用のサンプルです。', en: 'This is sample content for layout checking.' }]),
    startAt: iso(-20, '13:00'), endAt: iso(-20, '16:00'),
    venue: { ja: '悠久山公園', en: 'Yukyuzan Park' },
    fee: { ja: '無料', en: 'Free' }, isFree: true,
    audience: 'anyone', tagIds: ['meetup', 'free'],
    applicationType: 'none', visibility: 'public',
  },
  {
    ...base, id: 'fx-8', slug: 'fx-hidden', organizationId: 'world-lamp-kai',
    title: { ja: '【サンプル】告知なし（活動報告のみ）', en: '[Sample] Not announced' },
    summary: { ja: '一覧にも詳細にも出ないはずのイベントです。', en: 'Should not appear anywhere.' },
    body: paragraphsToLocalizedDoc([{ ja: 'これは表示確認用のサンプルです。', en: 'This is sample content for layout checking.' }]),
    startAt: iso(33, '18:00'), endAt: iso(33, '20:00'),
    venue: { ja: '非公開', en: 'Not disclosed' },
    fee: { ja: '—', en: '—' }, isFree: false,
    audience: 'invited', tagIds: ['other'],
    applicationType: 'none', visibility: 'hidden',
  },
]
