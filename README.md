# ながおか国際交流ポータル（UIプロトタイプ）

長岡市の国際交流イベント・活動報告・団体情報を集約するポータルサイトの**フロントエンド先行開発**です。
バックエンド／DBは未接続で、すべての表示は `src/data/` のローカルデータから描画しています。

- 公開URL: https://nagaoka-kokusai-portal.web.app （検索エンジン非登録 / `noindex`）
- Firebase コンソール: https://console.firebase.google.com/project/nagaoka-kokusai-portal/overview

## 起動

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # 型チェック + 本番ビルド → dist/
npm run preview    # ビルド結果をローカル確認
npm run typecheck  # 型チェックのみ
```

## デプロイ

```bash
npm run build
firebase deploy --only hosting
```

デプロイ先は `.firebaserc`（`nagaoka-kokusai-portal`）で固定しています。
アカウントは `cnt.goodboy@gmail.com`。切り替えは `firebase login:use <mail>`。

## 技術スタック

| | |
|---|---|
| ビルド | Vite 8 |
| UI | React 19 + TypeScript 7 |
| ルーティング | React Router 7（`BrowserRouter`） |
| スタイル | Tailwind CSS 4（`@theme` によるトークン定義） |
| ホスティング | Firebase Hosting（SPA rewrite） |

外部UIライブラリ・アイコンライブラリ・Webフォントは使っていません。
アイコンは `src/components/ui/Icon.tsx`、写真は `PlaceholderImage.tsx` が生成するSVGです。

## 画面構成

| パス | 内容 |
|---|---|
| `/` | トップ（ヒーロー / 注目イベント / これからのイベント / はじめての方へ / 活動報告 / 団体） |
| `/events` | イベント一覧（キーワード・ジャンル・エリア・開催月・対応言語・並び順・終了分の表示切替・ページネーション） |
| `/events/:slug` | イベント詳細（開催情報・アクセス・地図プレースホルダ・申込・関連イベント） |
| `/reports` | 活動報告一覧（キーワード・ジャンル・年） |
| `/reports/:slug` | 活動報告詳細（本文・写真ギャラリー・出典・関連イベント／団体） |
| `/organizations` | 団体一覧（キーワード・活動分野・対応言語・募集中のみ） |
| `/organizations/:slug` | 団体詳細（紹介・主な活動・イベント・活動報告・連絡先・出典） |
| その他 | 404 |

## 多言語対応（日本語 / English / やさしい日本語）

`src/i18n/` に集約しています。

- `types.ts` — 言語コード `ja | en | easy` と `LocalizedText` 型
- `dictionary.ts` — UIラベル（ナビ・ボタン・見出し）の3言語辞書
- `LanguageContext.tsx` — `useLanguage()` で `lang` / `setLang` / `t()` / `tx()` を提供

コンテンツ側の多言語テキストは各データファイルが `{ ja, en, easy }` の形で持ち、`tx()` で取り出します。
選択言語は `localStorage` に保存され、`<html lang>` と `<title>` も追随します。

新しい文言を足すときは `dictionary.ts` にキーを追加してください。`UiKey` 型が自動で拡張され、
タイポや3言語のうち1つを書き忘れた場合は型エラーになります。

## データについて（重要）

| ファイル | 実在性 |
|---|---|
| `src/data/organizations.ts` | ✅ **実在の2団体**。公開ページに記載のある事実のみ。未公開の項目（会員数・会費・活動頻度など）は値を推測せず省略 |
| `src/data/reports.ts` の `rep-09` | ✅ **実在の活動**（ワールドランプ会 第1回）。JICA東京の公開記事にもとづく。写真なし・出典リンクあり |
| `src/data/events.ts` 全件 | ⚠️ **架空**。レイアウト確認用のサンプル |
| `src/data/reports.ts` の `rep-01`〜`rep-08` | ⚠️ **架空**。レイアウト確認用のサンプル |

掲載団体と出典:

- 市民活動団体 WA!! — [長岡市民活動団体データベース](https://nkyod.org/group-list/shiminkatsudodantai-wa)
- ワールドランプ会 — [JICA東京 トピックス（2025年7月24日）](https://www.jica.go.jp/domestic/tokyo/information/topics/2025/1572126_67054.html)

サンプルのイベント・活動報告には、主催団体としてこの2団体を機械的に割り当てています
（ジャンルで振り分けただけで、実際の活動とは関係ありません）。連絡先も `sample@example.jp` /
`0258-00-0000` のダミーで統一しています。**公開前に必ず実データへ差し替えてください。**

その旨はサイト上部の告知バー（`notice.dummy`）でも3言語で表示しています。

### 未確認の項目

`organizations.ts` にコメントで印を付けています。

- 両団体の **対応言語** — 公開情報に明記がないため暫定値（要確認）
- 代表者名は公開ページに記載がありますが、個人名のためデータには含めていません

### 日付の扱い

イベントの日付は `isoDaysFromToday(n)` で「今日からの相対日」として生成しています。
時間が経ってもプロトタイプ上に「開催予定のイベント」が並び続けるようにするためです。
API接続時は固定の日付文字列に置き換わります（`rep-09` はすでに実日付です）。

## ディレクトリ

```
src/
├── data/            # ダミーデータと分類マスタ（← API に置き換える層）
│   ├── types.ts     # EventItem / ReportItem / Organization
│   ├── taxonomy.ts  # ジャンル・エリア・対応言語・活動分野
│   ├── events.ts / reports.ts / organizations.ts
│   └── index.ts     # 取得・並べ替え・絞り込み用のセレクタ
├── i18n/            # 3言語対応
├── lib/             # 日付整形・イベント状態判定・小ヘルパー
├── components/
│   ├── layout/      # Header / Footer / Layout / PageHero / Logo
│   ├── ui/          # Badge / Button / Icon / Container / InfoList など
│   └── *Card.tsx    # EventCard / EventRow / ReportCard / OrganizationCard
└── pages/           # 各ルートのページ
```

## バックエンド接続時の作業

1. `src/data/index.ts` のセレクタ（`getUpcomingEvents()` など）を API 呼び出しに差し替える。
   ページ側は配列・単体取得しか使っていないため、ここが唯一の接続点です。
2. `src/data/types.ts` をAPIのレスポンス型に合わせる。多言語フィールドは `LocalizedText` のまま
   CMS側で `{ja, en, easy}` を返すのが最も変更が少ない構成です。
3. 写真は `PlaceholderImage` を `<img>` に置き換え。`ReportItem.photos[]` に `src` を追加します。
4. 地図は `EventDetailPage.tsx` の「地図プレースホルダ」ブロックを地図APIに差し替え。
5. 申込ボタン（`EventDetailPage.tsx`）は現在 `disabled` の見た目のみです。

## 既知の制限・今後の課題

- ダークモード未対応（配色トークンは `src/index.css` に集約済みなので追加は容易）
- 申込フォーム・お問い合わせフォームは未実装（今回のスコープ外）
- 検索はクライアント側の部分一致のみ（3言語すべてを横断）
- SSR/SSG なし。SEOが必要になった段階で Next.js などへの移行を検討
- サイト名・ロゴは仮（`site.name` と `components/layout/Logo.tsx`）
