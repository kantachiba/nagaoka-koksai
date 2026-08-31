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
      name: { ja: '無料', furigana: '{無料|むりょう}', en: 'Free' } },
    { id: 'food', slug: 'food', order: 2, tone: 'rose',
      name: { ja: '料理・食', furigana: '{料理|りょうり}・{食|しょく}', en: 'Food' } },
    { id: 'culture', slug: 'culture', order: 3, tone: 'violet',
      name: { ja: '文化', furigana: '{文化|ぶんか}', en: 'Culture' } },
    { id: 'festival', slug: 'festival', order: 4, tone: 'hanabi',
      name: { ja: 'まつり・フェス', furigana: 'まつり・フェス', en: 'Festivals' } },
    { id: 'language', slug: 'language', order: 5, tone: 'brand',
      name: { ja: '言語', furigana: '{言語|げんご}', en: 'Language' } },
    { id: 'kids', slug: 'kids', order: 6, tone: 'sky',
      name: { ja: 'こども', furigana: 'こども', en: 'Kids' } },
    { id: 'support', slug: 'support', order: 7, tone: 'amber',
      name: { ja: '生活・サポート', furigana: '{生活|せいかつ}・サポート', en: 'Living support' } },
    { id: 'meetup', slug: 'meetup', order: 8, tone: 'brand',
      name: { ja: '交流会', furigana: '{交流会|こうりゅうかい}', en: 'Meetups' } },
    { id: 'other', slug: 'other', order: 9, tone: 'slate',
      name: { ja: 'その他', furigana: 'その{他|た}', en: 'Other' } },
  ],

  organizations: [
    {
      id: 'wa',
      slug: 'shimin-katsudo-dantai-wa',
      status: 'published',
      updatedAt: now,
      name: { ja: '市民活動団体 WA!!', furigana: '{市民活動団体|しみんかつどうだんたい} WA!!', en: 'Civic Group WA!!' },
      shortName: { ja: 'WA!!', furigana: 'WA!!', en: 'WA!!' },
      philosophy: {
        ja: '文化のちがいを楽しむ。高校生からはじまる多文化共生',
        furigana: '{文化|ぶんか}のちがいを{楽|たの}しむ。{高校生|こうこうせい}からはじまる{多文化共生|たぶんかきょうせい}',
        en: 'Enjoying our differences — multicultural Nagaoka, led by high school students',
      },
      description: [
        {
          ja: '高校生を中心に活動する市民活動団体です。2020年4月に設立し、異文化にふれること・学ぶことのおもしろさを発信しています。活動分野は「地域づくり」と「国際」の2つです。',
          furigana: '{高校生|こうこうせい}を{中心|ちゅうしん}に{活動|かつどう}する{市民活動団体|しみんかつどうだんたい}です。2020{年|ねん}4{月|がつ}に{設立|せつりつ}し、{異文化|いぶんか}にふれること・{学|まな}ぶことのおもしろさを{発信|はっしん}しています。',
          en: 'A civic group run mainly by high school students, founded in April 2020. They share the interest and enjoyment of encountering and learning about other cultures.',
        },
        {
          ja: '目指しているのは、異なる文化や価値観を持つ人への偏見をなくし、どんな人でも住みやすい多文化のまち長岡をつくること。あわせて長岡の魅力をさらに発信することも掲げています。',
          furigana: '{目指|めざ}しているのは、{異|こと}なる{文化|ぶんか}や{価値観|かちかん}を{持|も}つ{人|ひと}への{偏見|へんけん}をなくし、どんな{人|ひと}でも{住|す}みやすい{多文化|たぶんか}のまち{長岡|ながおか}をつくることです。',
          en: 'Their aim is to remove prejudice towards people with different cultures and values, and to build a multicultural Nagaoka where anyone can live comfortably.',
        },
      ],
      activities: [
        { ja: 'International Halloween Party の開催（前身の有志団体として実施）', furigana: 'International Halloween Party の{開催|かいさい}', en: 'Held an International Halloween Party' },
        { ja: '「hand in hand」動画制作', furigana: '「hand in hand」{動画制作|どうがせいさく}', en: 'Produced the “hand in hand” video' },
        { ja: 'イベントの企画・運営', furigana: 'イベントの{企画|きかく}・{運営|うんえい}', en: 'Planning and running events' },
        { ja: '国際交流イベントのサポート', furigana: '{国際交流|こくさいこうりゅう}イベントのサポート', en: 'Supporting international exchange events' },
        { ja: '通訳', furigana: '{通訳|つうやく}', en: 'Interpreting' },
      ],
      email: 'civicgroupswa2019@gmail.com',
      links: [{ label: 'Instagram @wa_ngok.jp', url: 'https://www.instagram.com/wa_ngok.jp/' }],
      sourceUrl: 'https://nkyod.org/group-list/shiminkatsudodantai-wa',
      sourceLabel: { ja: '長岡市民活動団体データベース', furigana: '{長岡|ながおか}{市民活動団体|しみんかつどうだんたい}データベース', en: 'Nagaoka civic group database' },
      recruiting: true,
    },
    {
      id: 'world-lamp-kai',
      slug: 'world-lamp-kai',
      status: 'published',
      updatedAt: now,
      name: { ja: 'ワールドランプ会', furigana: 'ワールドランプ{会|かい}', en: 'World Lamp Kai' },
      shortName: { ja: 'ワールドランプ会', furigana: 'ワールドランプ{会|かい}', en: 'World Lamp Kai' },
      philosophy: {
        ja: '同じ食卓を囲んで、長岡で働く世界の仲間と',
        furigana: '{同|おな}じ{食卓|しょくたく}を{囲|かこ}んで、{長岡|ながおか}で{働|はたら}く{世界|せかい}の{仲間|なかま}と',
        en: 'Around one table, with colleagues from around the world living in Nagaoka',
      },
      description: [
        {
          ja: '高度な技能をもつ外国人材が地域で孤立しやすいという課題を受けて、長岡市が JICA 長岡デスクに相談し、長岡市とともに立ち上げた交流の会です。',
          furigana: '{高度|こうど}な{技能|ぎのう}をもつ{外国人材|がいこくじんざい}が{地域|ちいき}で{孤立|こりつ}しやすいという{課題|かだい}を{受|う}けて、{長岡市|ながおかし}が JICA {長岡|ながおか}デスクに{相談|そうだん}し、ともに{立|た}ち{上|あ}げた{会|かい}です。',
          en: 'Set up by Nagaoka City together with the JICA Nagaoka Desk, after the city sought advice on the isolation often faced by highly skilled foreign professionals living in the area.',
        },
        {
          ja: '飲食をともなう交流を通じて、日本語や日本文化の紹介、参加国どうしの文化紹介、そして参加者どうしの友人関係づくりを進めることを目的にしています。',
          furigana: '{飲食|いんしょく}をともなう{交流|こうりゅう}を{通|つう}じて、{日本語|にほんご}や{日本文化|にほんぶんか}の{紹介|しょうかい}、{参加国|さんかこく}どうしの{文化紹介|ぶんかしょうかい}、{参加者|さんかしゃ}どうしの{友人関係|ゆうじんかんけい}づくりを{進|すす}めます。',
          en: 'Through get-togethers over food and drink, the group introduces Japanese language and culture, shares culture between the countries represented, and helps participants build friendships.',
        },
        {
          ja: '会の名前は、戊辰戦争のあと、長岡の復興を担った人々が集まった「ランプ会」へのオマージュです。',
          furigana: '{会|かい}の{名前|なまえ}は、{戊辰戦争|ぼしんせんそう}のあと{長岡|ながおか}の{復興|ふっこう}を{担|にな}った{人々|ひとびと}の「ランプ{会|かい}」へのオマージュです。',
          en: 'The name is an homage to the “Lamp Kai”, the gatherings of those who rebuilt Nagaoka after the Boshin War.',
        },
      ],
      activities: [
        { ja: '第1回交流会（2025年6月27日／米百俵プレイス ミライエ長岡）— ご飯のお供の試食会', furigana: '{第|だい}1{回|かい}{交流会|こうりゅうかい}（2025{年|ねん}6{月|がつ}27{日|にち}）— ごはんのおともの{試食会|ししょくかい}', en: 'First gathering (27 June 2025) — a tasting session of toppings for rice' },
        { ja: '日本語・日本文化の紹介', furigana: '{日本語|にほんご}・{日本文化|にほんぶんか}の{紹介|しょうかい}', en: 'Introducing Japanese language and culture' },
        { ja: '参加国どうしの文化紹介', furigana: '{参加国|さんかこく}どうしの{文化紹介|ぶんかしょうかい}', en: 'Sharing culture between the countries represented' },
      ],
      links: [],
      sourceUrl: 'https://www.jica.go.jp/domestic/tokyo/information/topics/2025/1572126_67054.html',
      sourceLabel: { ja: 'JICA東京 トピックス（2025年7月24日）', furigana: 'JICA{東京|とうきょう} トピックス（2025{年|ねん}7{月|がつ}24{日|にち}）', en: 'JICA Tokyo topics (24 July 2025)' },
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
        furigana: '「ワールドランプ{会|かい}」{第|だい}1{回|かい} —— ごはんのおともを{囲|かこ}んで',
        en: 'The first World Lamp Kai gathering — around the rice toppings',
      },
      summary: {
        ja: '長岡市とJICA長岡デスクが立ち上げた交流の会。第1回はミライエ長岡で、ご飯のお供の試食会を行いました。',
        furigana: '{長岡市|ながおかし}と JICA {長岡|ながおか}デスクが{立|た}ち{上|あ}げた{交流|こうりゅう}の{会|かい}。{第|だい}1{回|かい}はミライエ{長岡|ながおか}で、ごはんのおともの{試食会|ししょくかい}を{行|おこな}いました。',
        en: 'A new gathering launched by Nagaoka City and the JICA Nagaoka Desk. The first meeting, at Miraie Nagaoka, was a tasting of toppings for rice.',
      },
      body: paragraphsToLocalizedDoc([
        {
          ja: '長岡市は、高度な技能をもつ外国人材が地域で孤立しやすいという課題についてJICA長岡デスクに相談し、長岡市とともに「ワールドランプ会」を立ち上げました。会の名前は、戊辰戦争のあとに長岡の復興を担った人々の集まり「ランプ会」へのオマージュです。',
          furigana: '{長岡市|ながおかし}は、{高度|こうど}な{技能|ぎのう}をもつ{外国人材|がいこくじんざい}が{地域|ちいき}で{孤立|こりつ}しやすいという{課題|かだい}について JICA {長岡|ながおか}デスクに{相談|そうだん}し、ともに「ワールドランプ{会|かい}」を{立|た}ち{上|あ}げました。',
          en: 'Nagaoka City raised with the JICA Nagaoka Desk the problem of highly skilled foreign professionals becoming isolated in the community, and together they launched the World Lamp Kai.',
        },
        {
          ja: '第1回は2025年6月27日（金）の夜、米百俵プレイス ミライエ長岡で開かれ、ご飯のお供の試食会が行われました。',
          furigana: '{第|だい}1{回|かい}は 2025{年|ねん}6{月|がつ}27{日|にち}（{金|きん}）の{夜|よる}、{米百俵|こめひゃっぴょう}プレイス ミライエ{長岡|ながおか}で{開|ひら}かれました。',
          en: 'The first gathering took place on the evening of Friday 27 June 2025 at Kome-Hyappyo Place Miraie Nagaoka, with a tasting session of toppings for rice.',
        },
        {
          ja: '参加したのは、技術・人文知識・国際業務の在留資格で働く外国人9名、長岡技術科学大学のベトナム人短期留学生6名、日本人8名（長岡市4名、長岡技科大学生2名、企業関係者2名）。国籍別ではインド7名、バングラデシュ1名、ベトナム7名でした。',
          furigana: '{参加|さんか}したのは、{働|はたら}いている{外国|がいこく}の{人|ひと}9{名|めい}、ベトナムの{留学生|りゅうがくせい}6{名|めい}、{日本人|にほんじん}8{名|めい}です。インド7{名|めい}、バングラデシュ1{名|めい}、ベトナム7{名|めい}でした。',
          en: 'Participants included nine foreign professionals working under the engineer/specialist visa, six Vietnamese short-term exchange students from Nagaoka University of Technology, and eight Japanese participants. By nationality: seven from India, one from Bangladesh and seven from Vietnam.',
        },
      ]),
      sourceUrl: 'https://www.jica.go.jp/domestic/tokyo/information/topics/2025/1572126_67054.html',
      sourceLabel: { ja: 'JICA東京 トピックス（2025年7月24日）', furigana: 'JICA{東京|とうきょう} トピックス（2025{年|ねん}7{月|がつ}24{日|にち}）', en: 'JICA Tokyo topics (24 July 2025)' },
    },
  ],
}
