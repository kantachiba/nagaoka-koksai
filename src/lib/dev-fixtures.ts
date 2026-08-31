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
  address: { ja: '新潟県長岡市（サンプル住所）', furigana: '{新潟県|にいがたけん}{長岡市|ながおかし}', en: 'Nagaoka, Niigata (sample)' },
  access: { ja: 'JR長岡駅から徒歩5分', furigana: 'JR{長岡駅|ながおかえき}から{歩|ある}いて5{分|ふん}', en: '5 min walk from JR Nagaoka Station' },
  mapUrl: 'https://maps.google.com/?q=Nagaoka+Station',
  supportLanguages: ['ja', 'en'],
  commentsEnabled: false,
  instagramUrl: '',
}

export const DEV_EVENTS: EventItem[] = [
  {
    ...base, id: 'fx-1', slug: 'fx-nihongo-cafe', organizationId: 'wa',
    title: { ja: '【サンプル】にほんごカフェ', furigana: '【サンプル】にほんごカフェ', en: '[Sample] Nihongo Café' },
    summary: { ja: 'お茶を飲みながら日本語で話す、申込不要の集まりです。', furigana: 'おちゃを{飲|の}みながら{日本語|にほんご}で{話|はな}します。', en: 'Drop in and talk in Japanese over a cup of tea.' },
    body: paragraphsToLocalizedDoc([{ ja: 'これは表示確認用のサンプルです。', furigana: 'これは{表示確認|ひょうじかくにん}のサンプルです。', en: 'This is sample content for layout checking.' }]),
    startAt: iso(4, '19:00'), endAt: iso(4, '20:30'),
    venue: { ja: 'まちなかキャンパス長岡', furigana: 'まちなかキャンパス{長岡|ながおか}', en: 'Machinaka Campus Nagaoka' },
    fee: { ja: '無料', furigana: '{無料|むりょう}', en: 'Free' }, isFree: true,
    audience: 'anyone', tagIds: ['language', 'free', 'meetup'],
    applicationType: 'none', visibility: 'public',
  },
  {
    ...base, id: 'fx-2', slug: 'fx-world-food', organizationId: 'wa',
    title: { ja: '【サンプル】ワールドフードフェス', furigana: '【サンプル】ワールドフードフェス', en: '[Sample] World Food Festival' },
    summary: { ja: '15の国と地域の家庭料理が並ぶ2日間です。', furigana: '15の{国|くに}の{料理|りょうり}が{並|なら}びます。', en: 'Home cooking from fifteen countries over two days.' },
    body: paragraphsToLocalizedDoc([{ ja: 'これは表示確認用のサンプルです。', furigana: 'これは{表示確認|ひょうじかくにん}のサンプルです。', en: 'This is sample content for layout checking.' }]),
    startAt: iso(12, '10:00'), endAt: iso(13, '17:00'),
    venue: { ja: 'アオーレ長岡 ナカドマ', furigana: 'アオーレ{長岡|ながおか}', en: 'Aore Nagaoka' },
    fee: { ja: '入場無料（飲食は別途）', furigana: '{入場|にゅうじょう}は{無料|むりょう}', en: 'Free entry' }, isFree: true,
    audience: 'family', tagIds: ['food', 'festival', 'free'],
    applicationType: 'none', visibility: 'public',
  },
  {
    ...base, id: 'fx-3', slug: 'fx-bosai', organizationId: 'world-lamp-kai',
    title: { ja: '【サンプル】やさしい日本語で学ぶ防災', furigana: '【サンプル】やさしい{日本語|にほんご}で{学|まな}ぶ{防災|ぼうさい}', en: '[Sample] Disaster preparedness workshop' },
    summary: { ja: '地震のときどうするかを、いっしょに確認します。', furigana: '{地震|じしん}のとき どうするかを{確認|かくにん}します。', en: 'What to do in an earthquake.' },
    body: paragraphsToLocalizedDoc([{ ja: 'これは表示確認用のサンプルです。', furigana: 'これは{表示確認|ひょうじかくにん}のサンプルです。', en: 'This is sample content for layout checking.' }]),
    startAt: iso(26, '13:30'), endAt: iso(26, '16:00'),
    venue: { ja: 'きおくみらい', furigana: 'きおくみらい', en: 'Kioku Mirai' },
    fee: { ja: '無料', furigana: '{無料|むりょう}', en: 'Free' }, isFree: true,
    capacity: 30, audience: 'anyone', tagIds: ['support', 'free'],
    applicationType: 'internal', visibility: 'public',
  },
  {
    ...base, id: 'fx-4', slug: 'fx-cooking', organizationId: 'world-lamp-kai',
    title: { ja: '【サンプル】世界のごはん教室', furigana: '【サンプル】{世界|せかい}のごはん{教室|きょうしつ}', en: '[Sample] World kitchen' },
    summary: { ja: '長岡在住の方に教わる家庭料理の会です。', furigana: '{長岡|ながおか}に{住|す}む{人|ひと}に{習|なら}う{料理|りょうり}の{会|かい}です。', en: 'Learn home cooking from a local resident.' },
    body: paragraphsToLocalizedDoc([{ ja: 'これは表示確認用のサンプルです。', furigana: 'これは{表示確認|ひょうじかくにん}のサンプルです。', en: 'This is sample content for layout checking.' }]),
    startAt: iso(40, '10:00'), endAt: iso(40, '13:00'),
    venue: { ja: 'ながおか市民センター', furigana: 'ながおか{市民|しみん}センター', en: 'Nagaoka Civic Center' },
    fee: { ja: '1,200円（材料費込み）', furigana: '1,200{円|えん}', en: '¥1,200' }, isFree: false,
    capacity: 20, audience: 'anyone', tagIds: ['food', 'culture'],
    applicationType: 'external', applicationUrl: 'https://example.jp/apply', visibility: 'public',
  },
  {
    ...base, id: 'fx-5', slug: 'fx-invite-only', organizationId: 'world-lamp-kai',
    title: { ja: '【サンプル】ワールドランプ会（招待制）', furigana: '【サンプル】ワールドランプ{会|かい}', en: '[Sample] World Lamp Kai gathering' },
    summary: { ja: '招待者限定の交流会です。', furigana: '{招待|しょうたい}された{人|ひと}だけの{会|かい}です。', en: 'An invitation-only gathering.' },
    body: paragraphsToLocalizedDoc([{ ja: 'これは表示確認用のサンプルです。', furigana: 'これは{表示確認|ひょうじかくにん}のサンプルです。', en: 'This is sample content for layout checking.' }]),
    startAt: iso(55, '19:00'), endAt: iso(55, '21:00'),
    venue: { ja: 'ミライエ長岡', furigana: 'ミライエ{長岡|ながおか}', en: 'Miraie Nagaoka' },
    fee: { ja: '実費', furigana: '{実費|じっぴ}', en: 'Actual cost' }, isFree: false,
    audience: 'invited', tagIds: ['meetup'],
    applicationType: 'none', visibility: 'invite',
  },
  {
    ...base, id: 'fx-6', slug: 'fx-announce-only', organizationId: 'wa',
    title: { ja: '【サンプル】告知のみのイベント', furigana: '【サンプル】おしらせだけのイベント', en: '[Sample] Announcement-only event' },
    summary: { ja: '申込は受け付けていない告知のみの掲載です。', furigana: '{申|もう}し{込|こ}みはできません。おしらせだけです。', en: 'Announcement only; registration is not open.' },
    body: paragraphsToLocalizedDoc([{ ja: 'これは表示確認用のサンプルです。', furigana: 'これは{表示確認|ひょうじかくにん}のサンプルです。', en: 'This is sample content for layout checking.' }]),
    startAt: iso(70, '14:00'), endAt: iso(70, '16:00'),
    venue: { ja: '長岡市立劇場', furigana: '{長岡|ながおか}{市立劇場|しりつげきじょう}', en: 'Nagaoka Civic Theatre' },
    fee: { ja: '観覧無料', furigana: '{見|み}るのは{無料|むりょう}', en: 'Free to attend' }, isFree: true,
    audience: 'anyone', tagIds: ['culture', 'free'],
    applicationType: 'none', visibility: 'announce',
  },
  {
    ...base, id: 'fx-7', slug: 'fx-past', organizationId: 'wa',
    title: { ja: '【サンプル】終了したイベント', furigana: '【サンプル】{終|お}わったイベント', en: '[Sample] Past event' },
    summary: { ja: 'アーカイブ表示の確認用です。', furigana: 'アーカイブの{表示確認|ひょうじかくにん}です。', en: 'For checking the archive view.' },
    body: paragraphsToLocalizedDoc([{ ja: 'これは表示確認用のサンプルです。', furigana: 'これは{表示確認|ひょうじかくにん}のサンプルです。', en: 'This is sample content for layout checking.' }]),
    startAt: iso(-20, '13:00'), endAt: iso(-20, '16:00'),
    venue: { ja: '悠久山公園', furigana: '{悠久山|ゆうきゅうざん}{公園|こうえん}', en: 'Yukyuzan Park' },
    fee: { ja: '無料', furigana: '{無料|むりょう}', en: 'Free' }, isFree: true,
    audience: 'anyone', tagIds: ['meetup', 'free'],
    applicationType: 'none', visibility: 'public',
  },
  {
    ...base, id: 'fx-8', slug: 'fx-hidden', organizationId: 'world-lamp-kai',
    title: { ja: '【サンプル】告知なし（活動報告のみ）', furigana: '【サンプル】おしらせなし', en: '[Sample] Not announced' },
    summary: { ja: '一覧にも詳細にも出ないはずのイベントです。', furigana: '{一覧|いちらん}に{出|で}ないイベントです。', en: 'Should not appear anywhere.' },
    body: paragraphsToLocalizedDoc([{ ja: 'これは表示確認用のサンプルです。', furigana: 'これは{表示確認|ひょうじかくにん}のサンプルです。', en: 'This is sample content for layout checking.' }]),
    startAt: iso(33, '18:00'), endAt: iso(33, '20:00'),
    venue: { ja: '非公開', furigana: '{非公開|ひこうかい}', en: 'Not disclosed' },
    fee: { ja: '—', furigana: '—', en: '—' }, isFree: false,
    audience: 'invited', tagIds: ['other'],
    applicationType: 'none', visibility: 'hidden',
  },
]
