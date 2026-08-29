// @ts-check
import { defineConfig } from 'astro/config'
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

  // React アイランドが必要になったら @astrojs/react を入れ直す。
  // 現状は素のJSで足りており、未使用のランタイムを配信しないため外している。
  integrations: [sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },
})
