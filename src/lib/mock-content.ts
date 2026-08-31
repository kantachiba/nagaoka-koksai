import type { ContentBundle } from './types'
import { paragraphsToLocalizedDoc } from './blocks'

/**
 * Firestore が使えないときの表示用データ。初期投入データの原本も兼ねる。
 *
 * ✅ 2団体と活動報告1件は実在する。公開ページに書かれている事実のみを載せており、
 *    公開されていない項目（会員数・会費など）は推測せず省略している。
 *      - 市民活動団体 WA!!  … https://nkyod.org/group-list/shiminkatsudodantai-wa
 *      - ワールドランプ会    … JICA東京 トピックス（2025.07.24）
 *
 * ⚠️ イベントは1件も入れていない。実際の予定が分からない以上、
 *    架空のイベントを実在団体に紐づけないため。管理画面から登録する。
 */

const now = '2026-08-29T00:00:00+09:00'

export const MOCK_CONTENT: ContentBundle = {
  isMock: true,

  // 仕様 A-2 のタグ。管理画面から追加・改名できる
  tags: [
    { id: 'free', slug: 'free', order: 1, tone: 'emerald',
      name: { ja: '無料', en: 'Free' } },
    { id: 'food', slug: 'food', order: 2, tone: 'rose',
      name: { ja: '料理・食', en: 'Food' } },
    { id: 'culture', slug: 'culture', order: 3, tone: 'violet',
      name: { ja: '文化', en: 'Culture' } },
    { id: 'festival', slug: 'festival', order: 4, tone: 'hanabi',
      name: { ja: 'まつり・フェス', en: 'Festivals' } },
    { id: 'language', slug: 'language', order: 5, tone: 'brand',
      name: { ja: '言語', en: 'Language' } },
    { id: 'kids', slug: 'kids', order: 6, tone: 'sky',
      name: { ja: 'こども', en: 'Kids' } },
    { id: 'support', slug: 'support', order: 7, tone: 'amber',
      name: { ja: '生活・サポート', en: 'Living support' } },
    { id: 'meetup', slug: 'meetup', order: 8, tone: 'brand',
      name: { ja: '交流会', en: 'Meetups' } },
    { id: 'other', slug: 'other', order: 9, tone: 'slate',
      name: { ja: 'その他', en: 'Other' } },
  ],

  organizations: [
    {
      id: 'wa',
      slug: 'shimin-katsudo-dantai-wa',
      status: 'published',
      updatedAt: now,
      name: { ja: '市民活動団体 WA!!', en: 'Civic Group WA!!' },
      shortName: { ja: 'WA!!', en: 'WA!!' },
      philosophy: {
        ja: '文化のちがいを楽しむ。高校生からはじまる多文化共生',
        en: 'Enjoying our differences — multicultural Nagaoka, led by high school students',
      },
      description: [
        {
          ja: '高校生を中心に活動する市民活動団体です。2020年4月に設立し、異文化にふれること・学ぶことのおもしろさを発信しています。活動分野は「地域づくり」と「国際」の2つです。',
          en: 'A civic group run mainly by high school students, founded in April 2020. They share the interest and enjoyment of encountering and learning about other cultures.',
        },
        {
          ja: '目指しているのは、異なる文化や価値観を持つ人への偏見をなくし、どんな人でも住みやすい多文化のまち長岡をつくること。あわせて長岡の魅力をさらに発信することも掲げています。',
          en: 'Their aim is to remove prejudice towards people with different cultures and values, and to build a multicultural Nagaoka where anyone can live comfortably.',
        },
      ],
      activities: [
        { ja: 'International Halloween Party の開催（前身の有志団体として実施）', en: 'Held an International Halloween Party' },
        { ja: '「hand in hand」動画制作', en: 'Produced the “hand in hand” video' },
        { ja: 'イベントの企画・運営', en: 'Planning and running events' },
        { ja: '国際交流イベントのサポート', en: 'Supporting international exchange events' },
        { ja: '通訳', en: 'Interpreting' },
      ],
      email: 'civicgroupswa2019@gmail.com',
      links: [{ label: 'Instagram @wa_ngok.jp', url: 'https://www.instagram.com/wa_ngok.jp/' }],
      sourceUrl: 'https://nkyod.org/group-list/shiminkatsudodantai-wa',
      sourceLabel: { ja: '長岡市民活動団体データベース', en: 'Nagaoka civic group database' },
      recruiting: true,
    },
    {
      id: 'world-lamp-kai',
      slug: 'world-lamp-kai',
      status: 'published',
      updatedAt: now,
      name: { ja: 'ワールドランプ会', en: 'World Lamp Kai' },
      shortName: { ja: 'ワールドランプ会', en: 'World Lamp Kai' },
      philosophy: {
        ja: '同じ食卓を囲んで、長岡で働く世界の仲間と',
        en: 'Around one table, with colleagues from around the world living in Nagaoka',
      },
      description: [
        {
          ja: '高度な技能をもつ外国人材が地域で孤立しやすいという課題を受けて、長岡市が JICA 長岡デスクに相談し、長岡市とともに立ち上げた交流の会です。',
          en: 'Set up by Nagaoka City together with the JICA Nagaoka Desk, after the city sought advice on the isolation often faced by highly skilled foreign professionals living in the area.',
        },
        {
          ja: '飲食をともなう交流を通じて、日本語や日本文化の紹介、参加国どうしの文化紹介、そして参加者どうしの友人関係づくりを進めることを目的にしています。',
          en: 'Through get-togethers over food and drink, the group introduces Japanese language and culture, shares culture between the countries represented, and helps participants build friendships.',
        },
        {
          ja: '会の名前は、戊辰戦争のあと、長岡の復興を担った人々が集まった「ランプ会」へのオマージュです。',
          en: 'The name is an homage to the “Lamp Kai”, the gatherings of those who rebuilt Nagaoka after the Boshin War.',
        },
      ],
      activities: [
        { ja: '第1回交流会（2025年6月27日／米百俵プレイス ミライエ長岡）— ご飯のお供の試食会', en: 'First gathering (27 June 2025) — a tasting session of toppings for rice' },
        { ja: '日本語・日本文化の紹介', en: 'Introducing Japanese language and culture' },
        { ja: '参加国どうしの文化紹介', en: 'Sharing culture between the countries represented' },
      ],
      links: [],
      sourceUrl: 'https://www.jica.go.jp/domestic/tokyo/information/topics/2025/1572126_67054.html',
      sourceLabel: { ja: 'JICA東京 トピックス（2025年7月24日）', en: 'JICA Tokyo topics (24 July 2025)' },
      recruiting: false,
    },
  ],

  // ⚠️ 実際の開催予定が分からないため、イベントは空。管理画面から登録する。
  events: [],

  reports: [
    {
      id: 'world-lamp-kai-1',
      slug: 'world-lamp-kai-1',
      status: 'published',
      updatedAt: now,
      organizationId: 'world-lamp-kai',
      heldOn: '2025-06-27',
      publishedAt: '2025-07-24',
      participants: 23,
      tagIds: ['meetup', 'food'],
      photos: [],
      title: {
        ja: '「ワールドランプ会」第1回 —— ご飯のお供を囲んで',
        en: 'The first World Lamp Kai gathering — around the rice toppings',
      },
      summary: {
        ja: '長岡市とJICA長岡デスクが立ち上げた交流の会。第1回はミライエ長岡で、ご飯のお供の試食会を行いました。',
        en: 'A new gathering launched by Nagaoka City and the JICA Nagaoka Desk. The first meeting, at Miraie Nagaoka, was a tasting of toppings for rice.',
      },
      body: paragraphsToLocalizedDoc([
        {
          ja: '長岡市は、高度な技能をもつ外国人材が地域で孤立しやすいという課題についてJICA長岡デスクに相談し、長岡市とともに「ワールドランプ会」を立ち上げました。会の名前は、戊辰戦争のあとに長岡の復興を担った人々の集まり「ランプ会」へのオマージュです。',
          en: 'Nagaoka City raised with the JICA Nagaoka Desk the problem of highly skilled foreign professionals becoming isolated in the community, and together they launched the World Lamp Kai.',
        },
        {
          ja: '第1回は2025年6月27日（金）の夜、米百俵プレイス ミライエ長岡で開かれ、ご飯のお供の試食会が行われました。',
          en: 'The first gathering took place on the evening of Friday 27 June 2025 at Kome-Hyappyo Place Miraie Nagaoka, with a tasting session of toppings for rice.',
        },
        {
          ja: '参加したのは、技術・人文知識・国際業務の在留資格で働く外国人9名、長岡技術科学大学のベトナム人短期留学生6名、日本人8名（長岡市4名、長岡技科大学生2名、企業関係者2名）。国籍別ではインド7名、バングラデシュ1名、ベトナム7名でした。',
          en: 'Participants included nine foreign professionals working under the engineer/specialist visa, six Vietnamese short-term exchange students from Nagaoka University of Technology, and eight Japanese participants. By nationality: seven from India, one from Bangladesh and seven from Vietnam.',
        },
      ]),
      sourceUrl: 'https://www.jica.go.jp/domestic/tokyo/information/topics/2025/1572126_67054.html',
      sourceLabel: { ja: 'JICA東京 トピックス（2025年7月24日）', en: 'JICA Tokyo topics (24 July 2025)' },
    },
  ],
}
