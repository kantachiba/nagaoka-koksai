#!/usr/bin/env node
/**
 * sitemap-index.xml 内の各 <loc> にサブパスを付け直す。
 *
 * @astrojs/sitemap は astro.config.mjs の site（サブパス込み）から
 * 各ページの URL を組み立てる際は astro.config.mjs の serialize フックで
 * 正しく直せるが、sitemap-index.xml 自身（各 sitemap-N.xml への索引）は
 * 内部で使っているライブラリ（sitemap パッケージ）がオリジンだけで組み立てて
 * おり、こちらには serialize に相当するフックが無い。ビルド後にこの
 * ファイルだけ文字列置換で直す。
 */
import { readFile, writeFile } from 'node:fs/promises'

const BASE_PATH = '/international-portal'
const path = new URL('../dist/sitemap-index.xml', import.meta.url)

const xml = await readFile(path, 'utf8')
const fixed = xml.replace(
  /<loc>(https?:\/\/[^/]+)(\/sitemap-\d+\.xml)<\/loc>/g,
  (match, origin, file) => (match.includes(BASE_PATH) ? match : `<loc>${origin}${BASE_PATH}${file}</loc>`),
)

if (fixed === xml) {
  console.warn('[fix-sitemap-index] 置換対象が見つからなかった（sitemap-index.xml が無い、または既に修正済み）')
} else {
  await writeFile(path, fixed)
  console.log('[fix-sitemap-index] sitemap-index.xml のURLに /international-portal を付けた')
}
