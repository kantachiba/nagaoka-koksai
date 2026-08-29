import type { Organization } from './types'

/**
 * 団体情報。
 *
 * ✅ この2団体は実在します。掲載内容は下記の公開ページに記載されている事実のみを
 *    もとにしており、公開されていない項目（会員数・会費・活動頻度・電話番号など）は
 *    値を推測せず省略しています（UI 側は未設定の行を表示しません）。
 *
 *    - 市民活動団体 WA!!  … 長岡市民活動団体データベース（nkyod.org）
 *    - ワールドランプ会    … JICA 東京 トピックス（2025.07.24）
 *
 * ⚠️ 一方で src/data/events.ts と src/data/reports.ts のイベント・活動報告は、
 *    レイアウト確認用に作ったサンプルです（rep-09 を除く）。実際の活動内容とは
 *    関係がないため、公開前に必ず実データへ差し替えてください。
 *
 * ℹ️ 代表者名は公開ページに記載がありますが、個人名のため本データには含めていません。
 *    必要であれば `representative` フィールドを追加してください。
 */
export const organizations: Organization[] = [
  {
    id: 'org-01',
    slug: 'shimin-katsudo-dantai-wa',
    name: {
      ja: '市民活動団体 WA!!',
      en: 'Civic Group WA!!',
      easy: 'しみん かつどう だんたい WA!!（ワ）',
    },
    shortName: { ja: 'WA!!', en: 'WA!!', easy: 'WA!!（ワ）' },
    catchphrase: {
      ja: '文化のちがいを、楽しむ。高校生からはじまる多文化共生',
      en: 'Enjoying our differences — multicultural Nagaoka, led by high school students',
      easy: '文化（ぶんか）の ちがいを 楽（たの）しむ。高校生（こうこうせい）の グループです',
    },
    about: [
      {
        ja: '高校生を中心に活動する市民活動団体です。2020年4月に設立し、異文化にふれること・学ぶことのおもしろさを発信しています。活動分野は「地域づくり」と「国際」の2つです。',
        en: 'A civic group run mainly by high school students, founded in April 2020. They share the interest and enjoyment of encountering and learning about other cultures. Their registered fields of activity are community building and international exchange.',
        easy: '高校生（こうこうせい）が 中心（ちゅうしん）の グループです。2020年 4月に できました。ちがう 文化（ぶんか）を 知（し）る おもしろさを つたえて います。',
      },
      {
        ja: '目指しているのは、異なる文化や価値観を持つ人への偏見をなくし、どんな人でも住みやすい多文化のまち長岡をつくること。あわせて長岡の魅力をさらに発信することも掲げています。',
        en: 'Their aim is to remove prejudice towards people with different cultures and values, and to build a multicultural Nagaoka where anyone can live comfortably — while also sharing more of what makes Nagaoka appealing.',
        easy: 'ちがう 文化（ぶんか）の 人（ひと）への へんけんを なくして、だれでも すみやすい 長岡（ながおか）を つくりたいと かんがえて います。',
      },
      {
        ja: '団体としてできることは、イベントの企画・運営、国際交流イベントのサポート、通訳。イベント当日のお手伝いボランティア（年代は問いません）と寄付を募集しています。',
        en: 'The group can plan and run events, support international exchange events, and provide interpreting. They are looking for volunteers to help on event days — any age is welcome — and for donations.',
        easy: 'イベントを つくる こと、国際交流（こくさいこうりゅう）の てつだい、つうやくが できます。てつだって くれる 人（ひと）を さがして います。',
      },
    ],
    activities: [
      {
        ja: 'International Halloween Party の開催（前身の有志団体として実施）',
        en: 'Held an International Halloween Party (as the volunteer group that preceded WA!!)',
        easy: 'インターナショナル ハロウィン パーティーを しました',
      },
      {
        ja: '「hand in hand」動画制作',
        en: 'Produced the “hand in hand” video',
        easy: '「hand in hand」の どうがを つくりました',
      },
      {
        ja: 'イベントの企画・運営',
        en: 'Planning and running events',
        easy: 'イベントを つくる・すすめる',
      },
      {
        ja: '国際交流イベントのサポート',
        en: 'Supporting international exchange events',
        easy: '国際交流（こくさいこうりゅう）の イベントを てつだう',
      },
      { ja: '通訳', en: 'Interpreting', easy: 'つうやく' },
    ],
    fields: ['community', 'exchange', 'youth'],
    // ⚠️ 対応言語は公開情報に明記がありません。「通訳ができる」という記載から
    //    暫定で設定しています。実際の対応言語は団体へご確認ください。
    languages: ['ja', 'en'],
    foundedYear: 2020,
    foundedLabel: { ja: '2020年4月', en: 'April 2020', easy: '2020年 4月' },
    meetingPlace: {
      ja: '旧長岡エリア',
      en: 'The former Nagaoka city area',
      easy: 'むかしの 長岡（ながおか）の エリア',
    },
    contactEmail: 'civicgroupswa2019@gmail.com',
    socials: [{ label: 'Instagram @wa_ngok.jp', url: 'https://www.instagram.com/wa_ngok.jp/' }],
    sourceUrl: 'https://nkyod.org/group-list/shiminkatsudodantai-wa',
    sourceLabel: {
      ja: '長岡市民活動団体データベース',
      en: 'Nagaoka civic group database',
      easy: '長岡（ながおか）の だんたいの データベース',
    },
    recruiting: true,
    visual: { palette: 2, motif: 0 },
  },
  {
    id: 'org-02',
    slug: 'world-lamp-kai',
    name: {
      ja: 'ワールドランプ会',
      en: 'World Lamp Kai',
      easy: 'ワールド ランプかい',
    },
    shortName: { ja: 'ワールドランプ会', en: 'World Lamp Kai', easy: 'ワールド ランプかい' },
    catchphrase: {
      ja: '同じ食卓を囲んで、長岡で働く世界の仲間と',
      en: 'Around one table, with colleagues from around the world living in Nagaoka',
      easy: 'いっしょに ごはんを たべて、なかよく なる 会（かい）です',
    },
    about: [
      {
        ja: '高度な技能をもつ外国人材が地域で孤立しやすいという課題を受けて、長岡市が JICA 長岡デスクに相談し、長岡市とともに立ち上げた交流の会です。',
        en: 'Set up by Nagaoka City together with the JICA Nagaoka Desk, after the city sought advice on the isolation often faced by highly skilled foreign professionals living in the area.',
        easy: '外国（がいこく）から きて はたらく 人（ひと）が ひとりに なりやすい ことから、長岡市（ながおかし）と JICA が いっしょに つくった 会（かい）です。',
      },
      {
        ja: '飲食をともなう交流を通じて、日本語や日本文化の紹介、参加国どうしの文化紹介、そして参加者どうしの友人関係づくりを進めることを目的にしています。',
        en: 'Through get-togethers over food and drink, the group introduces Japanese language and culture, shares culture between the countries represented, and helps participants build friendships.',
        easy: 'ごはんを たべながら、日本（にほん）の ことばや 文化（ぶんか）を しょうかい します。おたがいの くにの 文化（ぶんか）も 話（はな）します。友（とも）だちを つくる 会（かい）です。',
      },
      {
        ja: '会の名前は、戊辰戦争のあと、長岡の復興を担った人々が集まった「ランプ会」へのオマージュです。',
        en: 'The name is an homage to the “Lamp Kai”, the gatherings of those who rebuilt Nagaoka after the Boshin War.',
        easy: 'なまえは、むかし 長岡（ながおか）を たてなおした 人（ひと）たちの 「ランプ会（かい）」から とりました。',
      },
    ],
    activities: [
      {
        ja: '第1回交流会（2025年6月27日／米百俵プレイス ミライエ長岡）— ご飯のお供の試食会',
        en: 'First gathering (27 June 2025, Kome-Hyappyo Place Miraie Nagaoka) — a tasting session of toppings for rice',
        easy: '1回目（かいめ）の 会（かい）（2025年 6月27日・ミライエ長岡（ながおか））— ごはんの おともの ためしたべ',
      },
      {
        ja: '日本語・日本文化の紹介',
        en: 'Introducing Japanese language and culture',
        easy: '日本語（にほんご）と 日本（にほん）の 文化（ぶんか）の しょうかい',
      },
      {
        ja: '参加国どうしの文化紹介',
        en: 'Sharing culture between the countries represented',
        easy: 'いろいろな くにの 文化（ぶんか）の しょうかい',
      },
      {
        ja: '参加者どうしの交流・friendship づくり',
        en: 'Building friendships among participants',
        easy: '友（とも）だちを つくる',
      },
    ],
    fields: ['exchange', 'living', 'food'],
    // ⚠️ 対応言語は公開情報に明記がありません。第1回の参加者構成（日本・インド・
    //    バングラデシュ・ベトナム）から暫定で設定しています。要確認。
    languages: ['ja', 'en'],
    foundedYear: 2025,
    meetingPlace: {
      ja: '米百俵プレイス ミライエ長岡 ほか',
      en: 'Kome-Hyappyo Place Miraie Nagaoka and other venues',
      easy: 'ミライエ長岡（ながおか）など',
    },
    sourceUrl: 'https://www.jica.go.jp/domestic/tokyo/information/topics/2025/1572126_67054.html',
    sourceLabel: {
      ja: 'JICA東京 トピックス（2025年7月24日）',
      en: 'JICA Tokyo topics (24 July 2025)',
      easy: 'JICA の おしらせ（2025年 7月24日）',
    },
    recruiting: false,
    visual: { palette: 0, motif: 2 },
  },
]
