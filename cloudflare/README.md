# 旧URL（tibanian.com/international-portal）の転送

本番は Firebase Hosting のカスタムドメイン
`https://nagaoka-international.nitnc.club` で配信している。

この Worker は、以前のアドレス
`https://tibanian.com/international-portal/*` を新しいドメインへ
301 で転送するだけ。既存サイト（`tibanian.com/` 直下）には触れない。

## デプロイ

```sh
cd cloudflare
npx wrangler deploy
```

Worker 名はダッシュボードで最初に作った `autumn-sky-fb61`。
`wrangler.toml` に合わせてあり、別名だとルートの競合で失敗する。

## 動作確認

```sh
curl -sI https://tibanian.com/international-portal
curl -sI https://tibanian.com/international-portal/events
```

`location: https://nagaoka-international.nitnc.club/...` が返ればよい。
