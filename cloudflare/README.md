# tibanian.com/international-portal の公開手順

このポータルは Firebase Hosting（`nagaoka-kokusai-portal.web.app`）でルート
（プレフィックスなし）のまま配信している。`tibanian.com` のドメイン直下には
既存の別サイトがあるため、`tibanian.com/international-portal/*` だけを
Cloudflare Worker で Firebase Hosting へ橋渡しする。

既存サイト側（ドメイン直下）は一切変更不要。この Worker は
`/international-portal` 配下のパスにしか反応しない。

## 手順

### 1. Worker を作成する

**ダッシュボードから貼り付ける場合（wrangler不要・一番簡単）**

1. Cloudflare ダッシュボード → Workers & Pages → 「Workers を作成する」
2. 名前は任意（例: `international-portal-proxy`）
3. エディタが開いたら中身を全部削除し、
   [`international-portal-proxy.js`](./international-portal-proxy.js) の
   内容を貼り付けてデプロイ

**wrangler CLI を使う場合**

```sh
cd cloudflare
npx wrangler login
npx wrangler deploy
```

`wrangler.toml` にルートの設定も含めているので、この方法なら手順2は不要。

### 2. ルートを登録する（ダッシュボードから作った場合のみ）

Worker の設定 → トリガー → ルートを追加。**2本登録する**こと。

| パターン | ゾーン |
|---|---|
| `tibanian.com/international-portal` | tibanian.com |
| `tibanian.com/international-portal/*` | tibanian.com |

1本目（末尾スラッシュなし）を忘れると、`tibanian.com/international-portal`
への直接アクセス（トップページ）がこの Worker を通らず、既存サイト側の
404にぶつかる。

### 3. 動作確認

デプロイ後、数秒〜数分で反映される。

```sh
curl -sI https://tibanian.com/international-portal | head -5
curl -s https://tibanian.com/international-portal | grep -o '<title>[^<]*</title>'
curl -s https://tibanian.com/international-portal | grep -o 'href="/international-portal[^"]*"' | head -5
```

- トップページのHTMLが返り、`<title>` にサイト名が入っていること
- 内部リンクが `/international-portal/...` に書き換わっていること
- 既存サイト（`tibanian.com/` トップなど）が今まで通り表示されること
  （＝この Worker の影響を受けていないこと）

### 補足：robots.txt

robots.txt はドメイン直下（`tibanian.com/robots.txt`）にあるものしか
クローラーは見ない。このポータル用の robots.txt
（`public/robots.txt` → `tibanian.com/international-portal/robots.txt`
として配信される）はクローラーからは参照されないため、既存サイト側の
`tibanian.com/robots.txt` に以下を足しておくと確実。

```
Disallow: /international-portal/admin
Sitemap: https://tibanian.com/international-portal/sitemap-index.xml
```
