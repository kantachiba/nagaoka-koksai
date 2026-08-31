#!/usr/bin/env node
/**
 * Firestore に置いた写真を、ビルド前に静的ファイルとして書き出す。
 *
 * Cloud Storage は Blaze プラン必須なので、写真は base64 で Firestore に持っている。
 * ただし閲覧者に Firestore を読ませると遅いうえ無料枠を消費するため、
 * ビルド時にここで画像ファイル化し、以降は Firebase Hosting が静的配信する。
 *
 * セキュリティルールで photos の全件取得（list）は塞いでいるので、
 * 記事・団体・イベントが参照している ID を集めて1件ずつ取りに行く。
 */
import { mkdir, writeFile, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'

const PROJECT_ID = 'nagaoka-kokusai-portal'
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`
const OUT_DIR = 'public/photos'

const EXTENSIONS = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

/** 公開済みドキュメントを取得する（ルールの条件に合わせて status を絞る） */
async function fetchPublished(collection) {
  const response = await fetch(`${BASE}:runQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: collection }],
        where: {
          fieldFilter: {
            field: { fieldPath: 'status' },
            op: 'EQUAL',
            value: { stringValue: 'published' },
          },
        },
        limit: 300,
      },
    }),
  })
  if (!response.ok) return []
  const rows = await response.json()
  return Array.isArray(rows) ? rows.filter((row) => row.document).map((row) => row.document) : []
}

/**
 * 本文（ブロックエディタの JSON）の中から image ノードの写真IDを拾う。
 * Firestore の REST 形式は型つきの入れ子なので、再帰で潜る。
 */
function collectFromBody(value, ids) {
  if (!value || typeof value !== 'object') return

  const photoId = value.mapValue?.fields?.attrs?.mapValue?.fields?.photoId?.stringValue
  if (photoId) ids.add(photoId)

  for (const child of Object.values(value)) {
    if (Array.isArray(child)) child.forEach((item) => collectFromBody(item, ids))
    else if (child && typeof child === 'object') collectFromBody(child, ids)
  }
}

/** 参照されている写真IDを集める */
function collectIds(documents) {
  const ids = new Set()
  for (const document of documents) {
    const fields = document.fields ?? {}

    const imageId = fields.imageId?.stringValue
    if (imageId) ids.add(imageId)

    // 活動報告の写真ギャラリー
    for (const entry of fields.photos?.arrayValue?.values ?? []) {
      const photoId = entry.mapValue?.fields?.photoId?.stringValue
      if (photoId) ids.add(photoId)
    }

    // 本文に差し込まれた画像
    collectFromBody(fields.body, ids)
  }
  return ids
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })

  const [reports, organizations, events] = await Promise.all([
    fetchPublished('reports'),
    fetchPublished('organizations'),
    fetchPublished('events'),
  ])

  const ids = new Set([
    ...collectIds(reports),
    ...collectIds(organizations),
    ...collectIds(events),
  ])

  if (ids.size === 0) {
    console.log('[photos] 参照されている写真はありません')
    return
  }

  // すでに書き出し済みのものは取りに行かない（読み取り回数の節約）
  const existing = new Set(
    existsSync(OUT_DIR) ? (await readdir(OUT_DIR)).map((name) => name.split('.')[0]) : [],
  )

  let written = 0
  let failed = 0

  for (const id of ids) {
    if (existing.has(id)) continue
    try {
      const response = await fetch(`${BASE}/photos/${id}`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const fields = (await response.json()).fields ?? {}
      const data = fields.data?.stringValue
      const mimeType = fields.mimeType?.stringValue ?? 'image/jpeg'
      if (!data) throw new Error('data が空')

      const extension = EXTENSIONS[mimeType] ?? 'jpg'
      await writeFile(`${OUT_DIR}/${id}.${extension}`, Buffer.from(data, 'base64'))
      written++
    } catch (error) {
      // 1枚の失敗でビルド全体を止めない。該当箇所はプレースホルダーで描画される。
      console.warn(`[photos] ${id} を取得できませんでした: ${error.message}`)
      failed++
    }
  }

  console.log(
    `[photos] 参照 ${ids.size} 件 / 新規書き出し ${written} 件 / 失敗 ${failed} 件`,
  )
}

await main()
