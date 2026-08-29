// @ts-check
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: 'https://nagaoka-kokusai-portal.web.app',

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
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
})
