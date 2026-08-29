import type { LocalizedText } from './types'

/**
 * UI（ナビゲーション・ボタン・見出しなど）のラベル辞書。
 * コンテンツ側の多言語テキストは各データファイル（src/data/*）が持ちます。
 *
 * `easy` = やさしい日本語。短い文・分かち書き・難しい漢字にはカッコ書きのふりがな。
 */
export const dictionary = {
  // ---------------------------------------------------------------- サイト
  'site.name': {
    ja: 'ながおか国際交流ポータル',
    en: 'Nagaoka International Portal',
    easy: 'ながおか こくさいこうりゅう ポータル',
  },
  'site.nameShort': {
    ja: 'ながおか国際交流',
    en: 'Nagaoka Intl.',
    easy: 'ながおか こくさいこうりゅう',
  },
  'site.tagline': {
    ja: '長岡のまちで、世界とつながる。',
    en: 'Where Nagaoka meets the world.',
    easy: '長岡（ながおか）で 世界（せかい）の 人（ひと）と 友（とも）だちに なろう。',
  },

  // ------------------------------------------------------------ ナビゲーション
  'nav.home': { ja: 'ホーム', en: 'Home', easy: 'ホーム' },
  'nav.events': { ja: 'イベント情報', en: 'Events', easy: 'イベント' },
  'nav.reports': { ja: '活動報告', en: 'Reports', easy: 'かつどうの ようす' },
  'nav.organizations': { ja: '団体情報', en: 'Groups', easy: 'グループ' },
  'nav.openMenu': { ja: 'メニューを開く', en: 'Open menu', easy: 'メニューを ひらく' },
  'nav.closeMenu': { ja: 'メニューを閉じる', en: 'Close menu', easy: 'メニューを とじる' },
  'nav.main': { ja: 'メインナビゲーション', en: 'Main navigation', easy: 'メインメニュー' },
  'nav.skipToContent': {
    ja: '本文へスキップ',
    en: 'Skip to main content',
    easy: '本文（ほんぶん）へ すすむ',
  },

  // -------------------------------------------------------------------- 言語
  'lang.label': { ja: '言語', en: 'Language', easy: 'ことば' },
  'lang.switch': {
    ja: '表示言語を切り替える',
    en: 'Change display language',
    easy: 'ことばを かえる',
  },

  // ------------------------------------------------------------------ 汎用
  'common.readMore': { ja: '詳しく見る', en: 'Read more', easy: 'くわしく 見（み）る' },
  'common.viewAll': { ja: 'すべて見る', en: 'View all', easy: 'ぜんぶ 見（み）る' },
  'common.search': { ja: '検索', en: 'Search', easy: 'さがす' },
  'common.keyword': { ja: 'キーワード', en: 'Keyword', easy: 'ことば' },
  'common.searchPlaceholder': {
    ja: 'キーワードで探す（例：日本語、こども、料理）',
    en: 'Search by keyword (e.g. Japanese, kids, cooking)',
    easy: 'ことばを 入（い）れて さがす',
  },
  'common.filter': { ja: '絞り込み', en: 'Filter', easy: 'えらぶ' },
  'common.clearFilters': { ja: '条件をリセット', en: 'Clear filters', easy: 'ぜんぶ もどす' },
  'common.count': { ja: '件', en: 'results', easy: 'こ' },
  'common.noResults': {
    ja: '条件に合う情報が見つかりませんでした',
    en: 'No results found',
    easy: '見（み）つかりませんでした',
  },
  'common.noResultsHint': {
    ja: '絞り込み条件を減らすか、別のキーワードでお試しください。',
    en: 'Try removing some filters or searching with different keywords.',
    easy: 'ほかの ことばで さがして ください。',
  },
  'common.all': { ja: 'すべて', en: 'All', easy: 'ぜんぶ' },
  'common.new': { ja: 'NEW', en: 'NEW', easy: 'あたらしい' },
  'common.featured': { ja: '注目', en: 'Featured', easy: 'おすすめ' },
  'common.free': { ja: '無料', en: 'Free', easy: 'ただ（0円）' },
  'common.prev': { ja: '前へ', en: 'Previous', easy: 'まえ' },
  'common.next': { ja: '次へ', en: 'Next', easy: 'つぎ' },
  'common.pagination': { ja: 'ページ送り', en: 'Pagination', easy: 'ページ' },
  'common.pageTop': { ja: 'ページ上部へ', en: 'Back to top', easy: '上（うえ）へ もどる' },
  'common.breadcrumb': { ja: '現在位置', en: 'Breadcrumb', easy: 'いまの ばしょ' },
  'common.share': { ja: 'このページを共有', en: 'Share this page', easy: 'この ページを おしえる' },
  'common.print': { ja: '印刷する', en: 'Print', easy: 'いんさつ する' },
  'common.copyLink': { ja: 'リンクをコピー', en: 'Copy link', easy: 'リンクを コピーする' },
  'common.copied': { ja: 'コピーしました', en: 'Copied', easy: 'コピー しました' },
  'common.sort': { ja: '並び順', en: 'Sort', easy: 'ならびかた' },
  'common.source': { ja: '出典', en: 'Source', easy: 'どこの じょうほう？' },

  // ------------------------------------------------------------ トップページ
  'home.hero.badge': {
    ja: '長岡市の国際交流ポータル',
    en: 'Nagaoka City International Exchange Portal',
    easy: '長岡（ながおか）の こくさいこうりゅう サイト',
  },
  'home.hero.title': {
    ja: '長岡のまちで、\n世界とつながる。',
    en: 'Where Nagaoka\nmeets the world.',
    easy: '長岡（ながおか）で\n世界（せかい）の 人（ひと）と 会（あ）おう。',
  },
  'home.hero.lead': {
    ja: '市内で開かれる国際交流イベント、活動している団体、これまでの活動のようす。長岡の「国際交流」に関する情報をひとつに集めました。日本語・English・やさしい日本語でご覧いただけます。',
    en: 'International events across the city, the groups that run them, and reports from past activities — everything about international exchange in Nagaoka, gathered in one place. Available in Japanese, English and Easy Japanese.',
    easy: '長岡（ながおか）で ある イベント、かつどうして いる グループ、いままでの ようすを あつめました。日本語（にほんご）・English・やさしい 日本語（にほんご）で 読（よ）めます。',
  },
  'home.hero.ctaEvents': {
    ja: 'イベントを探す',
    en: 'Find an event',
    easy: 'イベントを さがす',
  },
  'home.hero.ctaOrgs': {
    ja: '団体を知る',
    en: 'Meet the groups',
    easy: 'グループを 見（み）る',
  },
  'home.stats.events': { ja: '掲載イベント', en: 'Events listed', easy: 'イベントの かず' },
  'home.stats.organizations': { ja: '登録団体', en: 'Groups', easy: 'グループの かず' },
  'home.stats.reports': { ja: '活動報告', en: 'Reports', easy: 'かつどうの きろく' },
  'home.stats.languages': { ja: '対応言語', en: 'Languages', easy: 'つかえる ことば' },
  'home.pickup.title': { ja: '注目のイベント', en: 'Featured events', easy: 'おすすめの イベント' },
  'home.pickup.lead': {
    ja: '今おすすめしたい、参加しやすいイベントを紹介します。',
    en: 'Hand-picked events that are easy to join.',
    easy: 'かんたんに さんかできる イベントです。',
  },
  'home.upcoming.title': {
    ja: 'これからのイベント',
    en: 'Upcoming events',
    easy: 'これからの イベント',
  },
  'home.upcoming.lead': {
    ja: '開催日が近い順に並べています。',
    en: 'Listed by date, soonest first.',
    easy: '日（ひ）が ちかい じゅんばんです。',
  },
  'home.reports.title': { ja: '活動報告', en: 'Activity reports', easy: 'かつどうの ようす' },
  'home.reports.lead': {
    ja: '市内でおこなわれた交流のようすをお届けします。',
    en: 'A look back at exchange activities around the city.',
    easy: '長岡（ながおか）で あった ことを しょうかい します。',
  },
  'home.orgs.title': { ja: '活動している団体', en: 'Groups in Nagaoka', easy: 'グループ' },
  'home.orgs.lead': {
    ja: '長岡市内で国際交流に取り組む団体です。見学・参加を歓迎しています。',
    en: 'Groups working on international exchange in Nagaoka. Visitors are welcome.',
    easy: '長岡（ながおか）で かつどう して いる グループです。だれでも 見学（けんがく）できます。',
  },
  'home.guide.title': {
    ja: 'はじめての方へ',
    en: 'New here?',
    easy: 'はじめての 人（ひと）へ',
  },
  'home.guide.lead': {
    ja: '3つのステップで、あなたに合った交流の場が見つかります。',
    en: 'Three steps to find the right place for you.',
    easy: '3つの ステップで さがせます。',
  },
  'home.guide.step1.title': { ja: '探す', en: 'Search', easy: 'さがす' },
  'home.guide.step1.body': {
    ja: 'ジャンル・地域・日付でイベントを絞り込めます。日本語が不安な方向けの「対応言語」表示もあります。',
    en: 'Filter events by genre, area and date. Each event shows which languages are supported.',
    easy: 'ジャンル・ばしょ・日（ひ）で さがせます。つかえる ことばも 書（か）いて あります。',
  },
  'home.guide.step2.title': { ja: '申し込む', en: 'Apply', easy: 'もうしこむ' },
  'home.guide.step2.body': {
    ja: '申込が必要なイベントには、締切日と連絡先を掲載しています。当日参加できるものもあります。',
    en: 'Events that need registration show a deadline and contact details. Some accept walk-ins.',
    easy: 'もうしこみが いる ときは、しめきりと れんらくさきが あります。',
  },
  'home.guide.step3.title': { ja: '参加する', en: 'Join', easy: 'さんかする' },
  'home.guide.step3.body': {
    ja: 'ひとりでの参加も大歓迎です。活動報告を読むと、当日の雰囲気がわかります。',
    en: 'Coming alone is perfectly fine. Read the reports to see what it is really like.',
    easy: 'ひとりでも だいじょうぶです。「かつどうの ようす」を 読（よ）むと わかります。',
  },

  // -------------------------------------------------------------- イベント
  'events.title': { ja: 'イベント情報', en: 'Events', easy: 'イベント' },
  'events.lead': {
    ja: '長岡市内で開かれる国際交流イベントの一覧です。ジャンル・エリア・開催月で絞り込めます。',
    en: 'International exchange events happening in Nagaoka. Filter by genre, area or month.',
    easy: '長岡（ながおか）の イベントです。ジャンル・ばしょ・月（つき）で さがせます。',
  },
  'events.filter.category': { ja: 'ジャンル', en: 'Genre', easy: 'しゅるい' },
  'events.filter.area': { ja: 'エリア', en: 'Area', easy: 'ばしょ' },
  'events.filter.month': { ja: '開催月', en: 'Month', easy: '月（つき）' },
  'events.filter.language': { ja: '対応言語', en: 'Support language', easy: 'つかえる ことば' },
  'events.filter.showPast': {
    ja: '終了したイベントも表示する',
    en: 'Include past events',
    easy: 'おわった イベントも 見（み）る',
  },
  'events.sort.dateAsc': { ja: '開催日が近い順', en: 'Date: soonest', easy: '日（ひ）が ちかい じゅん' },
  'events.sort.dateDesc': { ja: '開催日が遠い順', en: 'Date: latest', easy: '日（ひ）が とおい じゅん' },
  'events.empty': {
    ja: '該当するイベントはありません',
    en: 'No events match your filters',
    easy: 'イベントが ありません',
  },
  'event.date': { ja: '開催日', en: 'Date', easy: '日（ひ）にち' },
  'event.time': { ja: '時間', en: 'Time', easy: 'じかん' },
  'event.venue': { ja: '会場', en: 'Venue', easy: 'ばしょ' },
  'event.address': { ja: '住所', en: 'Address', easy: 'じゅうしょ' },
  'event.fee': { ja: '参加費', en: 'Fee', easy: 'おかね' },
  'event.capacity': { ja: '定員', en: 'Capacity', easy: 'にんずう' },
  'event.target': { ja: '対象', en: 'Who can join', easy: 'さんか できる 人（ひと）' },
  'event.languages': { ja: '対応言語', en: 'Languages', easy: 'つかえる ことば' },
  'event.organizer': { ja: '主催', en: 'Organizer', easy: 'する グループ' },
  'event.contact': { ja: 'お問い合わせ', en: 'Contact', easy: 'れんらくさき' },
  'event.deadline': { ja: '申込締切', en: 'Application deadline', easy: 'もうしこみの しめきり' },
  'event.apply': { ja: '申し込む', en: 'Apply', easy: 'もうしこむ' },
  'event.applyNote': {
    ja: '※このサイトはUIプロトタイプのため、申込ボタンは動作しません。',
    en: 'Note: this is a UI prototype — the apply button is not functional.',
    easy: '※これは れんしゅうの サイトです。ボタンは うごきません。',
  },
  'event.noApply': {
    ja: '申込不要・直接会場へ',
    en: 'No registration — just come along',
    easy: 'もうしこみは いりません。ばしょへ きて ください。',
  },
  'event.overview': { ja: 'イベント概要', en: 'About this event', easy: 'どんな イベント？' },
  'event.details': { ja: '開催情報', en: 'Details', easy: 'くわしい こと' },
  'event.access': { ja: 'アクセス', en: 'Access', easy: 'いきかた' },
  'event.mapPlaceholder': {
    ja: '地図はバックエンド連携後に表示されます',
    en: 'Map will appear once the backend is connected',
    easy: 'ちずは あとで 出（で）ます',
  },
  'event.related': { ja: '関連するイベント', en: 'Related events', easy: 'にて いる イベント' },
  'event.status.upcoming': { ja: '受付中', en: 'Open', easy: 'もうしこみ できます' },
  'event.status.soon': { ja: 'まもなく開催', en: 'Starting soon', easy: 'もうすぐ' },
  'event.status.closed': { ja: '受付終了', en: 'Closed', easy: 'おわりました' },
  'event.status.finished': { ja: '終了', en: 'Finished', easy: 'おわりました' },

  // -------------------------------------------------------------- 活動報告
  'reports.title': { ja: '活動報告', en: 'Activity reports', easy: 'かつどうの ようす' },
  'reports.lead': {
    ja: '長岡市内でおこなわれた国際交流の活動のようすをお届けします。写真とあわせてご覧ください。',
    en: 'Reports and photos from international exchange activities held in Nagaoka.',
    easy: '長岡（ながおか）で あった ことを、しゃしんと いっしょに しょうかい します。',
  },
  'reports.filter.year': { ja: '年', en: 'Year', easy: 'とし' },
  'report.publishedAt': { ja: '公開日', en: 'Published', easy: '出（だ）した 日（ひ）' },
  'report.heldOn': { ja: '実施日', en: 'Held on', easy: 'した 日（ひ）' },
  'report.author': { ja: '執筆', en: 'Written by', easy: '書（か）いた 人（ひと）' },
  'report.participants': { ja: '参加者数', en: 'Participants', easy: 'きた 人（ひと）の かず' },
  'report.photos': { ja: '当日のようす', en: 'Photo gallery', easy: 'その 日（ひ）の しゃしん' },
  'report.relatedOrg': { ja: '実施団体', en: 'Organized by', easy: 'した グループ' },
  'report.others': { ja: 'ほかの活動報告', en: 'More reports', easy: 'ほかの きろく' },
  'report.empty': {
    ja: '該当する活動報告はありません',
    en: 'No reports match your filters',
    easy: 'きろくが ありません',
  },

  // -------------------------------------------------------------- 団体情報
  'orgs.title': { ja: '団体情報', en: 'Groups & organizations', easy: 'グループ' },
  'orgs.lead': {
    ja: '長岡市内で国際交流に取り組む団体・サークルの一覧です。活動分野や対応言語から探せます。',
    en: 'Groups and circles working on international exchange in Nagaoka. Search by activity or language.',
    easy: '長岡（ながおか）で かつどう する グループです。しゅるいや ことばで さがせます。',
  },
  'orgs.filter.field': { ja: '活動分野', en: 'Activity', easy: 'なにを する？' },
  'orgs.filter.recruiting': { ja: 'メンバー募集中のみ', en: 'Recruiting members only', easy: 'なかまを さがして いる グループだけ' },
  'orgs.empty': {
    ja: '該当する団体はありません',
    en: 'No groups match your filters',
    easy: 'グループが ありません',
  },
  'org.about': { ja: '団体紹介', en: 'About', easy: 'どんな グループ？' },
  'org.info': { ja: '団体情報', en: 'Group information', easy: 'グループの こと' },
  'org.activities': { ja: '主な活動', en: 'Main activities', easy: 'すること' },
  'org.founded': { ja: '設立', en: 'Founded', easy: 'はじめた とし' },
  'org.members': { ja: '会員数', en: 'Members', easy: 'メンバーの かず' },
  'org.frequency': { ja: '活動頻度', en: 'How often', easy: 'どのくらい する？' },
  'org.place': { ja: '主な活動場所', en: 'Where', easy: 'ばしょ' },
  'org.fee': { ja: '会費', en: 'Membership fee', easy: 'おかね' },
  'org.languages': { ja: '対応言語', en: 'Languages', easy: 'つかえる ことば' },
  'org.contact': { ja: '連絡先', en: 'Contact', easy: 'れんらくさき' },
  'org.website': { ja: 'ウェブサイト', en: 'Website', easy: 'ホームページ' },
  'org.recruiting': { ja: 'メンバー募集中', en: 'Recruiting', easy: 'なかまを さがして います' },
  'org.upcomingEvents': { ja: 'この団体のイベント', en: 'Events by this group', easy: 'この グループの イベント' },
  'org.reports': { ja: 'この団体の活動報告', en: 'Reports by this group', easy: 'この グループの きろく' },
  'org.noEvents': {
    ja: '現在予定されているイベントはありません',
    en: 'No upcoming events at the moment',
    easy: 'いまは イベントが ありません',
  },
  'org.members.unit': { ja: '名', en: 'members', easy: '人（にん）' },
  'unit.people': { ja: '名', en: 'people', easy: '人（にん）' },

  // ------------------------------------------------------------------ 共通UI
  'footer.aboutSite': { ja: 'このサイトについて', en: 'About this site', easy: 'この サイトに ついて' },
  'footer.aboutBody': {
    ja: '長岡市の国際交流に関する情報を集約し、日本語を母語としない方にも届く形で発信することを目指しています。',
    en: 'We gather information about international exchange in Nagaoka and share it in a form that reaches non-Japanese speakers too.',
    easy: '長岡（ながおか）の こくさいこうりゅうの じょうほうを あつめて、みんなに つたえる サイトです。',
  },
  'footer.contents': { ja: 'コンテンツ', en: 'Contents', easy: 'ページ' },
  'footer.contact': { ja: 'お問い合わせ', en: 'Contact', easy: 'といあわせ' },
  'footer.contactBody': {
    ja: 'イベント掲載・団体登録のご相談はお問い合わせフォームから受け付ける予定です。',
    en: 'To list an event or register a group, a contact form will be available here.',
    easy: 'イベントを のせたい ときは、ここから れんらく できます（じゅんび中）。',
  },
  'footer.copyright': {
    ja: '本サイトは開発中のプロトタイプです',
    en: 'This site is a prototype under development',
    easy: 'この サイトは れんしゅう中（ちゅう）です',
  },
  'notice.dummy': {
    ja: 'これはUIプロトタイプです。団体情報は公開情報にもとづきますが、イベント情報と活動報告はレイアウト確認用のサンプルです（出典つきの記事を除く）。',
    en: 'This is a UI prototype. Group profiles are based on published sources, but the events and reports are sample content for layout purposes (except articles that cite a source).',
    easy: 'これは れんしゅうの サイトです。グループの じょうほうは 本当（ほんとう）ですが、イベントと きろくは サンプルです。',
  },

  // --------------------------------------------------------------- 404ページ
  'notfound.title': { ja: 'ページが見つかりません', en: 'Page not found', easy: 'ページが ありません' },
  'notfound.body': {
    ja: 'お探しのページは移動または削除された可能性があります。',
    en: 'The page you are looking for may have been moved or deleted.',
    easy: 'さがして いる ページは ありません。',
  },
  'notfound.back': { ja: 'ホームへ戻る', en: 'Back to home', easy: 'ホームへ もどる' },
} satisfies Record<string, LocalizedText>

export type UiKey = keyof typeof dictionary
