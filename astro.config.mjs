// @ts-check
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // ⚠️ tibanian.com/international-portal で公開している（ドメイン直下は
  // 別の既存サイトのため、そちらとの共存に Cloudflare Worker のプロキシを
  // 使う。詳細は src/config/site.ts の SITE_URL のコメントと
  // cloudflare/international-portal-proxy.js を参照）。
  //
  // Astro の `base` はあえて設定していない。base を付けると astro:assets の
  // 画像パスなど一部だけが自動でプレフィックスされ、手書きの内部リンク
  // （localizePath が返すパス）とズレて壊れることを確認した。
  // ビルド成果物は今まで通りルート相対のまま出力し、プレフィックスの付与は
  // Cloudflare Worker 側で一括して行う方針にしている。
  site: 'https://tibanian.com/international-portal',

  // 全ページを静的HTMLとして書き出す。ページごとに OGP を埋められるようにするため。
  output: 'static',
  trailingSlash: 'ignore',

  i18n: {
    defaultLocale: 'ja',
    locales: [
      'ja',
      // ふりがな付き日本語。URLは /furigana/ だが、言語としては日本語なので
      // hreflang / lang 属性は 'ja' を使う。
      { path: 'furigana', codes: ['ja'] },
      'en',
    ],
    // 日本語（既定）はプレフィックスなしのルートに置く
    routing: { prefixDefaultLocale: false },
  },

  integrations: [
    // React は管理画面（/admin）のアイランドでのみ使う。
    // 公開ページは .astro のみで組んでおり、JS はほぼ配信されない。
    react(),
    sitemap({
      // 管理画面は検索対象にしない
      filter: (page) => !page.includes('/admin'),
      // @astrojs/sitemap は site にパスが含まれていると、その部分を
      // 落として起源（オリジン）だけで URL を組み立ててしまう。
      // ここで /international-portal を必ず付け直す。
      serialize(item) {
        const url = new URL(item.url)
        if (!url.pathname.startsWith('/international-portal')) {
          url.pathname = `/international-portal${url.pathname === '/' ? '' : url.pathname}`
        }
        return { ...item, url: url.href }
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
})
