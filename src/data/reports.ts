import { isoDaysFromToday } from '../lib/date'
import type { ReportItem } from './types'

/**
 * 活動報告のデータ。
 *
 * ✅ rep-09（ワールドランプ会 第1回）だけは実在の活動で、JICA東京の公開記事に
 *    書かれている事実のみを記載しています（`sourceUrl` に出典あり／写真なし）。
 *
 * ⚠️ それ以外の rep-01〜rep-08 はレイアウト確認用のサンプル記事です。実在の2団体を
 *    実施団体として割り当てていますが、実際の活動とは関係ありません。
 *
 * 🖼 写真は用意せず、`visual` の指定にもとづいてプレースホルダーのSVG
 *    （PlaceholderImage コンポーネント）を描画します。実写真に差し替えるときは
 *    `photos[].src` などのフィールドを追加してください。
 */
export const reports: ReportItem[] = [
  {
    id: 'rep-01',
    slug: 'hanabi-guide-2026',
    title: {
      ja: '花火の3日間、8か国のことばで「ようこそ」を届けました',
      en: 'Three days of fireworks, and “welcome” in eight languages',
      easy: '花火（はなび）の 3日間（みっかかん）、8つの ことばで あんない しました',
    },
    summary: {
      ja: '長岡まつり大花火大会の期間中、駅と会場周辺の6か所で案内ボランティアを行いました。',
      en: 'During the Nagaoka Festival Grand Fireworks, volunteers staffed six information points around the station and venue.',
      easy: '花火（はなび）の とき、6つの ばしょで あんない を しました。',
    },
    body: [
      {
        ja: '長岡まつり大花火大会の3日間、ながおかグローバルフレンズは長岡駅大手口、駅東口、河川敷の各ゲート付近など計6か所に案内デスクを設置しました。のべ42名のボランティアが交代で立ち、英語・中国語・韓国語・ベトナム語など8か国語で対応にあたりました。',
        en: 'Over the three days of the Nagaoka Grand Fireworks, Nagaoka Global Friends set up six information desks: at the station’s Otte and east exits, and near each riverside gate. Forty-two volunteers took shifts, answering questions in eight languages including English, Chinese, Korean and Vietnamese.',
        easy: '花火（はなび）の 3日間（みっかかん）、えきや かわの ちかく 6つの ばしょで あんない を しました。42人（にん）の ボランティアが 8つの ことばで こたえました。',
      },
      {
        ja: 'いちばん多かった質問は「有料席のゲートはどこか」「トイレはどこか」「帰りの電車は何時まであるか」の3つ。これらは事前に多言語カードを用意していたため、スムーズに案内できました。一方で、雨天時の対応や落とし物の相談など、想定していなかった質問も少なくありませんでした。',
        en: 'The three most common questions were where to find the paid-seating gates, where the toilets are, and how late the trains run. We had prepared multilingual cards for all three, which made things smooth. Less expected were questions about what to do if it rained, and reports of lost property.',
        easy: 'おおかった しつもんは「せきは どこ？」「トイレは どこ？」「でんしゃは 何時（なんじ）まで？」でした。カードを つくって いたので、すぐ こたえられました。',
      },
      {
        ja: '3日間で対応した人数は約1,200人。「日本語がわからず不安だったが、母語で話せて安心した」という声を多くいただきました。来年に向けて、雨天時の案内表現の多言語化と、案内所の位置を示すマップの改良を進めます。',
        en: 'We helped around 1,200 people over the three days. Many told us they had been anxious about not speaking Japanese and were relieved to find someone who spoke their language. For next year we are translating our wet-weather guidance and redrawing the map showing where each desk stands.',
        easy: '3日間（みっかかん）で 1,200人（にん）くらいに あんない しました。「じぶんの ことばで はなせて あんしん した」と 言（い）われました。らいねんも がんばります。',
      },
    ],
    heldOn: isoDaysFromToday(-6),
    publishedAt: isoDaysFromToday(-3),
    organizerId: 'org-01',
    relatedEventId: 'evt-14',
    participants: 42,
    author: {
      ja: '市民活動団体 WA!!',
      en: 'Civic Group WA!!',
      easy: 'しみん かつどう だんたい WA!!（ワ）',
    },
    category: 'support',
    photos: [
      {
        caption: {
          ja: '長岡駅大手口に設置した案内デスク',
          en: 'The information desk at the Otte exit of Nagaoka Station',
          easy: '長岡駅（ながおかえき）の あんないデスク',
        },
        visual: { palette: 0, motif: 0 },
      },
      {
        caption: {
          ja: '8か国語の案内カード。指さしで使えるよう工夫しました',
          en: 'Point-and-show information cards in eight languages',
          easy: '8つの ことばの カード。ゆびで さして つかいます',
        },
        visual: { palette: 2, motif: 2 },
      },
      {
        caption: {
          ja: '打ち上げ直前、河川敷ゲート付近のボランティア',
          en: 'Volunteers near the riverside gate just before the show',
          easy: '花火（はなび）の まえの ボランティア',
        },
        visual: { palette: 4, motif: 4 },
      },
    ],
    visual: { palette: 0, motif: 4 },
  },
  {
    id: 'rep-02',
    slug: 'speech-contest-26',
    title: {
      ja: '12人のスピーチが伝えた「長岡で見つけたもの」',
      en: 'Twelve speeches on “What I found in Nagaoka”',
      easy: '12人（にん）が はなした「長岡（ながおか）で 見（み）つけた もの」',
    },
    summary: {
      ja: '第26回日本語スピーチ大会。8か国12名が、自分のことばで長岡での日々を語りました。',
      en: 'At the 26th Japanese speech contest, twelve speakers from eight countries described life in Nagaoka in their own words.',
      easy: '26回目（かいめ）の スピーチ大会（たいかい）。8つの くにの 12人（にん）が はなしました。',
    },
    body: [
      {
        ja: '長岡市立劇場の小ホールに約180名が集まり、第26回外国人による日本語スピーチ大会が開かれました。登壇したのはベトナム、フィリピン、中国、ブラジル、ネパール、韓国、インドネシア、ミャンマーの8か国から12名です。',
        en: 'Around 180 people filled the small hall of the Nagaoka Civic Theatre for the 26th Japanese speech contest. Twelve speakers took the stage, from Vietnam, the Philippines, China, Brazil, Nepal, South Korea, Indonesia and Myanmar.',
        easy: '長岡市立劇場（ながおかしりつげきじょう）に 180人（にん）くらい 来（き）ました。8つの くにの 12人（にん）が はなしました。',
      },
      {
        ja: '最優秀賞は、技能実習生として来日し現在は市内の製造業で働くグエン・ティ・ランさんの「雪が教えてくれたこと」。初めての冬に雪かきを近所の方に手伝ってもらった経験から、地域とのつながりが生まれていく過程を丁寧に語りました。',
        en: 'First prize went to Nguyen Thi Lan, who came to Japan as a technical intern and now works in manufacturing in the city, for “What the snow taught me” — a careful account of how a neighbour helping her shovel snow that first winter grew into a real connection with the community.',
        easy: 'いちばんは グエン・ティ・ランさんの「ゆきが おしえて くれた こと」でした。はじめての ふゆに、となりの 人（ひと）が ゆきかきを てつだって くれた はなしです。',
      },
      {
        ja: '来場者アンケートでは「日本語学習者の努力だけでなく、受け入れる側の姿勢を考えさせられた」という感想が多く寄せられました。全12名のスピーチ原稿は、後日やさしい日本語版とあわせて公開予定です。',
        en: 'In the audience survey, many wrote that the contest made them think not only about the effort learners put in, but about the attitude of the community receiving them. All twelve scripts will be published later, alongside Easy Japanese versions.',
        easy: '見（み）に きた 人（ひと）から「じぶんたちの こと も かんがえた」と いう こえが ありました。12人（にん）の スピーチは あとで ホームページに のせます。',
      },
    ],
    heldOn: isoDaysFromToday(-23),
    publishedAt: isoDaysFromToday(-18),
    organizerId: 'org-01',
    relatedEventId: 'evt-15',
    participants: 180,
    author: {
      ja: '市民活動団体 WA!!',
      en: 'Civic Group WA!!',
      easy: 'しみん かつどう だんたい WA!!（ワ）',
    },
    category: 'language',
    photos: [
      {
        caption: {
          ja: '緊張の面持ちで登壇する出場者',
          en: 'A speaker taking the stage',
          easy: 'ステージで はなす 人（ひと）',
        },
        visual: { palette: 1, motif: 3 },
      },
      {
        caption: {
          ja: '客席は約180名でほぼ満席に',
          en: 'The hall was nearly full with around 180 people',
          easy: 'きゃくせきは いっぱいでした',
        },
        visual: { palette: 3, motif: 1 },
      },
      {
        caption: {
          ja: '表彰式。出場者全員に記念品が贈られました',
          en: 'The award ceremony — every speaker received a keepsake',
          easy: 'ひょうしょうしき。ぜんいんが プレゼントを もらいました',
        },
        visual: { palette: 5, motif: 0 },
      },
    ],
    visual: { palette: 1, motif: 3 },
  },
  {
    id: 'rep-03',
    slug: 'nihongo-cafe-100',
    title: {
      ja: 'にほんごカフェが100回を迎えました',
      en: 'Nihongo Café reaches its 100th session',
      easy: 'にほんご カフェが 100回（かい）に なりました',
    },
    summary: {
      ja: '2019年に始まった水曜夜の日本語おしゃべり会が、通算100回を迎えました。',
      en: 'The Wednesday evening conversation circle, started in 2019, held its 100th session.',
      easy: '2019年に はじまった 水（すい）ようびの 会（かい）が 100回（かい）に なりました。',
    },
    body: [
      {
        ja: '2019年5月に10人ほどで始まった「にほんごカフェ」が、このたび通算100回を迎えました。当日は現在の参加者に加え、かつて通っていた卒業生も駆けつけ、22名が集まりました。',
        en: 'The Nihongo Café, which began in May 2019 with about ten people, has now held its 100th session. Twenty-two people came along on the day, including several who used to attend and returned for the occasion.',
        easy: '2019年に 10人（にん）くらいで はじまった 「にほんご カフェ」が 100回（かい）に なりました。この日（ひ）は 22人（にん）が 来（き）ました。',
      },
      {
        ja: '記念の回では、これまでのテーマの中から人気のあった「わたしの国の朝ごはん」を再演。ベトナム、ネパール、中国、ペルーの朝の食卓が写真で紹介され、日本の「納豆ごはん」の是非で盛り上がりました。',
        en: 'To mark the occasion we brought back a favourite topic: “breakfast in my country”. Photos of morning tables from Vietnam, Nepal, China and Peru went round the room, and the merits of Japanese nattō on rice were debated at length.',
        easy: 'この日（ひ）は 「わたしの くにの あさごはん」に ついて はなしました。ベトナム、ネパール、中国（ちゅうごく）、ペルーの しゃしんを 見（み）ました。',
      },
      {
        ja: '「日本語の教室ではなく、話す練習ができる場所がほしかった」という設立当初の思いは、100回を経てもそのままです。今後も毎週水曜19時から、変わらず開き続けます。',
        en: 'The founding wish — for a place to practise talking, rather than another classroom — has not changed in a hundred sessions. We will keep opening every Wednesday at 19:00, just as before.',
        easy: '「べんきょうでは なく、はなす ばしょが ほしい」と いう きもちは いまも おなじです。これからも 水（すい）ようびの 19時（じ）に します。',
      },
    ],
    heldOn: isoDaysFromToday(-31),
    publishedAt: isoDaysFromToday(-28),
    organizerId: 'org-02',
    participants: 22,
    author: {
      ja: 'ワールドランプ会',
      en: 'World Lamp Kai',
      easy: 'ワールド ランプかい',
    },
    category: 'language',
    photos: [
      {
        caption: {
          ja: '4〜5人の小さなグループで話します',
          en: 'Conversation happens in small groups of four or five',
          easy: '4〜5人（にん）の グループで はなします',
        },
        visual: { palette: 1, motif: 1 },
      },
      {
        caption: {
          ja: '100回記念のケーキを囲んで',
          en: 'Cutting the cake for the 100th session',
          easy: '100回（かい）の ケーキ',
        },
        visual: { palette: 4, motif: 0 },
      },
    ],
    visual: { palette: 1, motif: 1 },
  },
  {
    id: 'rep-04',
    slug: 'yoita-tea-report',
    title: {
      ja: '与板の古民家で、一服のお茶をいただく',
      en: 'A bowl of tea in an old house in Yoita',
      easy: '与板（よいた）の ふるい 家（いえ）で おちゃを のみました',
    },
    summary: {
      ja: '茶の湯の作法体験と、打刃物の工房見学。18名が参加しました。',
      en: 'Eighteen participants learned the manners of the tea ceremony and visited a blade-smithing workshop.',
      easy: 'おちゃの さほうを ならって、はものの こうぼうも 見（み）ました。18人（にん）が 来（き）ました。',
    },
    body: [
      {
        ja: '与板の古民家「和」を会場に、茶の湯の体験会を開きました。参加者18名のうち11名が海外出身。畳の上での歩き方から始まり、抹茶の点て方、和菓子のいただき方までを2時間かけて丁寧に体験しました。',
        en: 'We held a tea ceremony session at “Nagomi”, a traditional house in Yoita. Eleven of the eighteen participants were from overseas. Over two unhurried hours we went from how to walk on tatami to whisking matcha and receiving a sweet.',
        easy: '与板（よいた）の ふるい 家（いえ）で おちゃの 会（かい）を しました。18人（にん）の うち 11人（にん）は 外国（がいこく）の 人（ひと）でした。',
      },
      {
        ja: '「作法が細かくて難しい」という声がある一方で、「相手をもてなすための手順だと聞いて納得した」という感想も。所作のひとつひとつに理由があることを、通訳を交えて説明しました。',
        en: 'Some found the etiquette fussy and hard to follow; others said it made sense once they heard that every step exists to look after the guest. With an interpreter’s help, we explained the reasoning behind each movement.',
        easy: '「むずかしい」と いう 人（ひと）も いました。でも「おきゃくさんの ための ルールだ」と きいて、わかったと 言（い）う 人（ひと）も いました。',
      },
      {
        ja: '後半は、与板に受け継がれる打刃物の工房を見学。鋼を打つ音が響く作業場で、鍛冶職人の手仕事に参加者から自然と拍手が起こりました。',
        en: 'In the second half we visited a workshop where Yoita’s blade-smithing tradition continues. In a workshop ringing with the sound of hammered steel, the participants broke into applause of their own accord.',
        easy: 'あとで、はものを つくる ところを 見（み）ました。てつを たたく おとが ひびいて、みんな はくしゅ しました。',
      },
    ],
    heldOn: isoDaysFromToday(-41),
    publishedAt: isoDaysFromToday(-35),
    organizerId: 'org-01',
    relatedEventId: 'evt-16',
    participants: 18,
    author: { ja: '米百俵国際塾', en: 'Kome-Hyappyo Global Academy', easy: 'こくさいじゅく' },
    category: 'culture',
    photos: [
      {
        caption: {
          ja: '抹茶を点てる。思ったより力が要ります',
          en: 'Whisking matcha takes more effort than it looks',
          easy: 'まっちゃを つくります。ちからが いります',
        },
        visual: { palette: 3, motif: 0 },
      },
      {
        caption: {
          ja: '和菓子は季節をかたどったもの',
          en: 'The sweets were shaped after the season',
          easy: 'おかしは きせつの かたちです',
        },
        visual: { palette: 5, motif: 2 },
      },
      {
        caption: {
          ja: '打刃物の工房見学。鋼を打つ音が響きます',
          en: 'At the blade workshop, with steel ringing under the hammer',
          easy: 'はものの こうぼう。てつを たたく おと',
        },
        visual: { palette: 3, motif: 4 },
      },
    ],
    visual: { palette: 3, motif: 0 },
  },
  {
    id: 'rep-05',
    slug: 'cooking-brazil',
    title: {
      ja: '世界のごはん教室 ブラジル編 —— フェイジョアーダを囲んで',
      en: 'World Kitchen Brazil: gathering around feijoada',
      easy: 'せかいの ごはん教室（きょうしつ）ブラジル',
    },
    summary: {
      ja: '長岡在住20年のブラジル出身講師が、家庭の味フェイジョアーダを教えてくれました。',
      en: 'A Brazilian resident of twenty years’ standing taught us feijoada, the taste of home.',
      easy: 'ブラジルの 人（ひと）が フェイジョアーダを おしえて くれました。',
    },
    body: [
      {
        ja: '毎月恒例の「世界のごはん教室」、今回はブラジルです。講師は長岡市に20年暮らすシルバさん。黒豆と豚肉を煮込んだ国民食フェイジョアーダ、パン・デ・ケイジョ、そしてブリガデイロの3品をつくりました。',
        en: 'This month’s World Kitchen went to Brazil, taught by Ms. Silva, a Nagaoka resident of twenty years. On the menu: feijoada, the national dish of black beans and pork; pão de queijo; and brigadeiro.',
        easy: 'こんかいは ブラジルの りょうりです。せんせいは 長岡（ながおか）に 20年（ねん）すんで いる シルバさんです。3つの りょうりを つくりました。',
      },
      {
        ja: '黒豆を一晩水に浸すところから始める本格的なレシピですが、今回は圧力鍋を使った時短版も紹介。「日本のスーパーで手に入るもので、どこまで本場の味に近づけるか」がこの教室のテーマです。',
        en: 'The proper recipe starts with soaking black beans overnight, but we also showed a quicker pressure-cooker version. The theme of this class is always the same: how close can you get to the real thing with what a Japanese supermarket sells?',
        easy: 'くろまめを 一晩（ひとばん）みずに 入（い）れます。でも、はやい つくりかたも おしえました。日本（にほん）の スーパーの ざいりょうで つくります。',
      },
      {
        ja: '参加者20名のうち、半数は「ブラジル料理を食べるのは初めて」。食事のあとは、ブラジルの家庭で日曜の昼に大人数で食卓を囲む習慣について話を聞きました。',
        en: 'Half of the twenty participants had never eaten Brazilian food before. Over the meal, we heard about the Brazilian custom of gathering a crowd around the table on a Sunday afternoon.',
        easy: '20人（にん）の はんぶんは ブラジルの りょうりが はじめてでした。ブラジルでは 日（にち）ようびに かぞくが たくさん あつまって たべます。',
      },
    ],
    heldOn: isoDaysFromToday(-52),
    publishedAt: isoDaysFromToday(-47),
    organizerId: 'org-02',
    participants: 20,
    author: {
      ja: 'ワールドランプ会',
      en: 'World Lamp Kai',
      easy: 'ワールド ランプかい',
    },
    category: 'food',
    photos: [
      {
        caption: {
          ja: '黒豆と豚肉を煮込むフェイジョアーダ',
          en: 'Feijoada, simmering black beans and pork',
          easy: 'フェイジョアーダを につめます',
        },
        visual: { palette: 2, motif: 2 },
      },
      {
        caption: {
          ja: 'パン・デ・ケイジョは子どもたちに大人気',
          en: 'Pão de queijo was a hit with the children',
          easy: 'パン・デ・ケイジョは 子（こ）どもに にんきでした',
        },
        visual: { palette: 4, motif: 0 },
      },
      {
        caption: {
          ja: '完成した3品を全員で試食',
          en: 'Tasting all three dishes together',
          easy: '3つの りょうりを みんなで たべました',
        },
        visual: { palette: 0, motif: 1 },
      },
    ],
    visual: { palette: 2, motif: 2 },
  },
  {
    id: 'rep-06',
    slug: 'bosai-drill-multilingual',
    title: {
      ja: '多言語での避難訓練 —— 「わからない」をなくすために',
      en: 'A multilingual evacuation drill: closing the gap of “I didn’t understand”',
      easy: 'いろいろな ことばで ひなんの れんしゅうを しました',
    },
    summary: {
      ja: '市内の自治会と合同で、外国人住民65名が参加する避難訓練を実施しました。',
      en: 'Together with a local neighbourhood association, we ran an evacuation drill with 65 foreign residents.',
      easy: 'じちかいと いっしょに、65人（にん）で ひなんの れんしゅうを しました。',
    },
    body: [
      {
        ja: '市内の自治会と合同で、外国人住民を対象とした避難訓練を実施しました。参加者65名の母語はベトナム語、タガログ語、ネパール語、英語、中国語など。訓練は「やさしい日本語＋多言語掲示」の二本立てで行いました。',
        en: 'With a local neighbourhood association we ran an evacuation drill for foreign residents. The 65 participants spoke Vietnamese, Tagalog, Nepali, English and Chinese among others, and the drill combined Easy Japanese announcements with multilingual signage.',
        easy: 'じちかいと いっしょに、ひなんの れんしゅうを しました。65人（にん）が きました。やさしい 日本語（にほんご）と、いろいろな ことばの かんばんを つかいました。',
      },
      {
        ja: '訓練でとくに課題として浮かび上がったのは、緊急放送の聞き取りです。防災行政無線の日本語は速く、専門用語も多いため、ほとんどの参加者が「サイレンは聞こえたが内容はわからなかった」と回答しました。',
        en: 'The clearest problem was the emergency broadcast. The city’s public address announcements are fast and full of technical vocabulary, and almost every participant said they heard the siren but understood nothing of the message.',
        easy: 'いちばんの もんだいは 「ほうそうが わからない」ことでした。ほとんどの 人（ひと）が「サイレンは きこえたけど、ことばは わからなかった」と 言（い）いました。',
      },
      {
        ja: 'この結果を受け、当会では「聞き取れなくても行動できる」ための絵記号カードの配布と、避難所での指さし会話シートの改訂に着手します。訓練の記録は市の防災担当課にも共有しました。',
        en: 'In response we are distributing pictogram cards that let people act even without catching the words, and revising the point-and-show sheets used at shelters. A record of the drill has been shared with the city’s disaster management division.',
        easy: 'だから、えの カードを くばります。ひなんじょの 「ゆびさし シート」も なおします。この きろくは 市（し）にも わたしました。',
      },
    ],
    heldOn: isoDaysFromToday(-76),
    publishedAt: isoDaysFromToday(-70),
    organizerId: 'org-02',
    participants: 65,
    author: {
      ja: 'ワールドランプ会',
      en: 'World Lamp Kai',
      easy: 'ワールド ランプかい',
    },
    category: 'support',
    photos: [
      {
        caption: {
          ja: '多言語の掲示を使った避難誘導',
          en: 'Guiding people to safety with multilingual signage',
          easy: 'いろいろな ことばの かんばんで あんない します',
        },
        visual: { palette: 4, motif: 4 },
      },
      {
        caption: {
          ja: '避難所での受付シミュレーション',
          en: 'A simulated reception desk at the shelter',
          easy: 'ひなんじょの うけつけの れんしゅう',
        },
        visual: { palette: 0, motif: 1 },
      },
      {
        caption: {
          ja: '訓練後のふりかえり。課題を全員で共有しました',
          en: 'Debriefing afterwards, sharing what we found',
          easy: 'あとで みんなで はなしました',
        },
        visual: { palette: 2, motif: 3 },
      },
    ],
    visual: { palette: 4, motif: 4 },
  },
  {
    id: 'rep-07',
    slug: 'hanami-meetup-report',
    title: {
      ja: '悠久山の桜の下、54人の持ち寄りごはん',
      en: 'A potluck for 54 under the cherry trees at Yukyuzan',
      easy: '悠久山（ゆうきゅうざん）の さくらの 下（した）で 54人（にん）が ごはんを たべました',
    },
    summary: {
      ja: '一品持ち寄りのお花見交流会。13か国の家庭料理が芝生の上に並びました。',
      en: 'A bring-a-dish hanami picnic, with home cooking from thirteen countries spread out on the lawn.',
      easy: 'りょうりを 1つずつ もって きて、お花見（はなみ）を しました。13の くにの りょうりが ならびました。',
    },
    body: [
      {
        ja: '長岡市を代表する桜の名所・悠久山公園で、恒例のお花見交流会を開きました。参加者は54名、うち33名が海外出身。「一品持ち寄り」というルールのおかげで、シートの上には13か国の家庭料理が並びました。',
        en: 'Our annual hanami gathering took place at Yukyuzan Park, one of Nagaoka’s best-loved cherry blossom spots. Of the 54 who came, 33 were from overseas — and thanks to the bring-a-dish rule, home cooking from thirteen countries covered the picnic sheets.',
        easy: '悠久山（ゆうきゅうざん）こうえんで お花見（はなみ）を しました。54人（にん）が 来（き）ました。33人（にん）は 外国（がいこく）の 人（ひと）です。13の くにの りょうりが ならびました。',
      },
      {
        ja: '「桜を見ながら食事をする」という習慣が新鮮だったという声が多く、「自分の国では花を見るために集まることはない」「花よりごはんに夢中になってしまった」という感想も。',
        en: 'For many, eating while looking at blossom was a novelty. “In my country we don’t gather just to look at flowers,” said one; another admitted to being more absorbed in the food than the petals.',
        easy: '「さくらを 見（み）ながら たべる」ことが めずらしいと いう 人（ひと）が おおかったです。「はなより ごはんに むちゅうに なった」と いう 人（ひと）も いました。',
      },
    ],
    heldOn: isoDaysFromToday(-68),
    publishedAt: isoDaysFromToday(-64),
    organizerId: 'org-02',
    relatedEventId: 'evt-17',
    participants: 54,
    author: {
      ja: 'ワールドランプ会',
      en: 'World Lamp Kai',
      easy: 'ワールド ランプかい',
    },
    category: 'exchange',
    photos: [
      {
        caption: {
          ja: '芝生広場に広げたシートと持ち寄りの料理',
          en: 'Sheets on the lawn, covered with dishes people brought',
          easy: 'しばふに シートを ひろげました',
        },
        visual: { palette: 2, motif: 1 },
      },
      {
        caption: {
          ja: '13か国の家庭料理が並びました',
          en: 'Home cooking from thirteen countries',
          easy: '13の くにの りょうり',
        },
        visual: { palette: 4, motif: 3 },
      },
    ],
    visual: { palette: 2, motif: 1 },
  },
  {
    id: 'rep-08',
    slug: 'futsal-cup-8',
    title: {
      ja: '第8回インターナショナルフットサルカップ、10チームが参加',
      en: '8th International Futsal Cup: ten teams take the court',
      easy: '8回目（かいめ）の フットサル大会（たいかい）。10チームが 来（き）ました',
    },
    summary: {
      ja: '越路体育館で開催。国籍混成のチーム編成で、優勝は「チーム・シナノ」。',
      en: 'Held at Koshiji Gymnasium with mixed-nationality teams; “Team Shinano” took the trophy.',
      easy: '越路（こしじ）たいいくかんで しました。ゆうしょうは 「チーム・シナノ」です。',
    },
    body: [
      {
        ja: '年に一度のインターナショナルフットサルカップを越路体育館で開催しました。参加は10チーム、96名。今回もルールは同じで、「1チームに3か国以上の出身者を含めること」。国ごとの対抗戦にしないための工夫です。',
        en: 'Our annual International Futsal Cup returned to Koshiji Gymnasium, with ten teams and 96 players. The rule was unchanged: every team must include people from at least three countries — deliberately, so it never becomes country versus country.',
        easy: '1年（ねん）に 1回（かい）の フットサル大会（たいかい）を しました。10チーム、96人（にん）が 来（き）ました。1つの チームに 3つ 以上（いじょう）の くにの 人（ひと）が 入（はい）ります。',
      },
      {
        ja: '優勝は日本・ブラジル・ベトナム・中国の混成チーム「チーム・シナノ」。決勝は延長の末のPK戦となり、会場は大いに盛り上がりました。フェアプレー賞は、初参加ながら全試合で無警告だった「ユースU-18」に贈られました。',
        en: 'The cup went to “Team Shinano”, a mix of Japanese, Brazilian, Vietnamese and Chinese players, after a final that went to extra time and then penalties. The fair play award went to “Youth U-18”, first-timers who finished the tournament without a single caution.',
        easy: 'ゆうしょうは 「チーム・シナノ」でした。けっしょうは PKまで いきました。フェアプレーしょうは 「ユースU-18」です。',
      },
    ],
    heldOn: isoDaysFromToday(-95),
    publishedAt: isoDaysFromToday(-90),
    organizerId: 'org-01',
    participants: 96,
    author: {
      ja: '市民活動団体 WA!!',
      en: 'Civic Group WA!!',
      easy: 'しみん かつどう だんたい WA!!（ワ）',
    },
    category: 'exchange',
    photos: [
      {
        caption: {
          ja: '開会式。10チーム96名が集合しました',
          en: 'Opening ceremony with all ten teams',
          easy: 'はじまりの あいさつ',
        },
        visual: { palette: 5, motif: 3 },
      },
      {
        caption: {
          ja: '決勝戦はPK戦にもつれ込みました',
          en: 'The final went all the way to penalties',
          easy: 'けっしょうは PKでした',
        },
        visual: { palette: 1, motif: 1 },
      },
      {
        caption: {
          ja: '優勝したチーム・シナノ',
          en: 'The winners, Team Shinano',
          easy: 'ゆうしょうの チーム・シナノ',
        },
        visual: { palette: 3, motif: 0 },
      },
    ],
    visual: { palette: 5, motif: 3 },
  },
  {
    // ✅ この記事だけは実在の活動です。JICA東京の公開記事に書かれている事実のみを
    //    もとにしており、写真は掲載していません（photos は空配列）。
    id: 'rep-09',
    slug: 'world-lamp-kai-1',
    title: {
      ja: '「ワールドランプ会」第1回 —— ご飯のお供を囲んで',
      en: 'The first World Lamp Kai gathering — around the rice toppings',
      easy: '「ワールドランプ会（かい）」1回目（かいめ）— ごはんの おともを かこんで',
    },
    summary: {
      ja: '長岡市とJICA長岡デスクが立ち上げた交流の会。第1回はミライエ長岡で、ご飯のお供の試食会を行いました。',
      en: 'A new gathering launched by Nagaoka City and the JICA Nagaoka Desk. The first meeting, at Miraie Nagaoka, was a tasting of toppings for rice.',
      easy: '長岡市（ながおかし）と JICA が つくった 会（かい）です。1回目（かいめ）は ミライエ長岡（ながおか）で ごはんの おともを たべました。',
    },
    body: [
      {
        ja: '長岡市は、高度な技能をもつ外国人材が地域で孤立しやすいという課題についてJICA長岡デスクに相談し、長岡市とともに「ワールドランプ会」を立ち上げました。会の名前は、戊辰戦争のあとに長岡の復興を担った人々の集まり「ランプ会」へのオマージュです。',
        en: 'Nagaoka City raised with the JICA Nagaoka Desk the problem of highly skilled foreign professionals becoming isolated in the community, and together they launched the World Lamp Kai. The name is an homage to the “Lamp Kai”, the gatherings of those who rebuilt Nagaoka after the Boshin War.',
        easy: '外国（がいこく）から きて はたらく 人（ひと）が ひとりに なりやすい ことから、長岡市（ながおかし）と JICA が この 会（かい）を つくりました。なまえは むかしの 「ランプ会（かい）」から とりました。',
      },
      {
        ja: '第1回は2025年6月27日（金）の夜、米百俵プレイス ミライエ長岡で開かれ、ご飯のお供の試食会が行われました。',
        en: 'The first gathering took place on the evening of Friday 27 June 2025 at Kome-Hyappyo Place Miraie Nagaoka, with a tasting session of toppings for rice.',
        easy: '1回目（かいめ）は 2025年 6月27日（金（きん）よう日）の よる、ミライエ長岡（ながおか）で しました。ごはんの おともを ためして たべました。',
      },
      {
        ja: '参加したのは、技術・人文知識・国際業務の在留資格で働く外国人9名、長岡技術科学大学のベトナム人短期留学生6名、日本人8名（長岡市4名、長岡技科大学生2名、企業関係者2名）。国籍別ではインド7名、バングラデシュ1名、ベトナム7名でした。飲食をともなう交流を通じて、日本語や日本文化の紹介、参加国どうしの文化紹介、そして参加者どうしの友人関係づくりを進めることを目的としています。',
        en: 'Participants included nine foreign professionals working under the engineer/specialist in humanities/international services visa, six Vietnamese short-term exchange students from Nagaoka University of Technology, and eight Japanese participants (four from Nagaoka City, two university students, two from local companies). By nationality: seven from India, one from Bangladesh and seven from Vietnam. Through get-togethers over food and drink, the group aims to introduce Japanese language and culture, share culture between the countries represented, and help participants build friendships.',
        easy: 'はたらいて いる 外国（がいこく）の 人（ひと）9人（にん）、ベトナムの りゅうがくせい 6人（にん）、日本人（にほんじん）8人（にん）が きました。インド 7人（にん）、バングラデシュ 1人（にん）、ベトナム 7人（にん）です。ごはんを たべながら 友（とも）だちに なる ことが 目的（もくてき）です。',
      },
    ],
    heldOn: '2025-06-27',
    publishedAt: '2025-07-24',
    organizerId: 'org-02',
    participants: 23,
    author: {
      ja: 'ワールドランプ会',
      en: 'World Lamp Kai',
      easy: 'ワールド ランプかい',
    },
    category: 'exchange',
    photos: [],
    sourceUrl: 'https://www.jica.go.jp/domestic/tokyo/information/topics/2025/1572126_67054.html',
    sourceLabel: {
      ja: 'JICA東京 トピックス（2025年7月24日）',
      en: 'JICA Tokyo topics (24 July 2025)',
      easy: 'JICA の おしらせ（2025年 7月24日）',
    },
    visual: { palette: 0, motif: 2 },
  },
]
