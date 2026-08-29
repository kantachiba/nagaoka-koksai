import { FIREBASE_PROJECT_ID } from '../config/site'
import { decodeDocuments, type FirestoreDocument } from './firestore-rest'
import { MOCK_CONTENT } from './mock-content'
import { DEV_EVENTS } from './dev-fixtures'
import type { ContentBundle, EventItem, Organization, ReportItem, Tag } from './types'

/**
 * 公開コンテンツの取得層。
 *
 * ビルド時に Firestore の REST API から読み、静的HTMLに焼き込む。
 * こうすることでページごとに OGP を出せて、閲覧時は CDN から返るだけになる。
 *
 * Firestore がまだ用意できていない／取得に失敗した場合は、
 * src/lib/mock-content.ts の内容で描画してビルドを通す。
 * （運営が管理画面を触り始める前でも、サイトの見た目を確認できるようにするため）
 */

const BASE = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`

type ListResponse = { documents?: FirestoreDocument[]; error?: unknown }
type QueryRow = { document?: FirestoreDocument }

/**
 * タグのように「下書き」の概念が無く、常に公開されるコレクションを一覧取得する。
 */
async function fetchAll(collection: string): Promise<Record<string, unknown>[] | null> {
  try {
    const response = await fetch(`${BASE}/${collection}?pageSize=300`)
    if (!response.ok) return null
    const json = (await response.json()) as ListResponse
    if (json.error) return null
    return decodeDocuments(json.documents)
  } catch {
    return null
  }
}

/**
 * 公開済みドキュメントだけを取得する。
 *
 * Firestore は「ルールはフィルタではない」ため、単純な一覧取得だと
 * status を評価できず拒否される。クエリ自体に status の条件を入れることで
 * セキュリティルールの条件を満たす（firestore.rules のコメントを参照）。
 */
async function fetchPublished(collection: string): Promise<Record<string, unknown>[] | null> {
  try {
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
    if (!response.ok) return null
    const rows = (await response.json()) as QueryRow[]
    if (!Array.isArray(rows)) return null
    // 該当0件のときは document を持たない行が1つ返るため、取り除く
    return decodeDocuments(rows.map((row) => row.document).filter((d): d is FirestoreDocument => !!d))
  } catch {
    return null
  }
}

/**
 * 表示確認用のサンプルイベントを混ぜるか。
 * `CONTENT_FIXTURES=1 npm run build` のときだけ有効になり、本番ビルドでは読まれない。
 */
const useFixtures = process.env.CONTENT_FIXTURES === '1'

let cached: Promise<ContentBundle> | null = null

export function getContent(): Promise<ContentBundle> {
  cached ??= load()
  return cached
}

async function load(): Promise<ContentBundle> {
  const [tags, organizations, events, reports] = await Promise.all([
    fetchAll('tags'),
    fetchPublished('organizations'),
    fetchPublished('events'),
    fetchPublished('reports'),
  ])

  // 1つでも取得できなければ、中途半端な状態で出さずモックへ倒す
  if (!tags || !organizations || !events || !reports) {
    console.warn(
      '[content] Firestore から取得できませんでした。モックデータで描画します。' +
        '（Firestore API の有効化と初期データ投入が必要です）',
    )
    return {
      ...MOCK_CONTENT,
      events: useFixtures ? DEV_EVENTS : MOCK_CONTENT.events,
      isMock: true,
    }
  }

  return {
    tags: (tags as unknown as Tag[]).sort((a, b) => a.order - b.order),
    organizations: organizations as unknown as Organization[],
    events: useFixtures
      ? [...(events as unknown as EventItem[]), ...DEV_EVENTS]
      : (events as unknown as EventItem[]),
    reports: reports as unknown as ReportItem[],
    isMock: false,
  }
}

// ------------------------------------------------------------------ 参照ヘルパー

export function findTag(bundle: ContentBundle, id: string): Tag | undefined {
  return bundle.tags.find((tag) => tag.id === id)
}

export function findOrganization(bundle: ContentBundle, id: string): Organization | undefined {
  return bundle.organizations.find((organization) => organization.id === id)
}

/** 一覧・詳細に出してよいイベント（'hidden' は活動報告からしか辿れない） */
export function listableEvents(bundle: ContentBundle): EventItem[] {
  return bundle.events.filter((event) => event.visibility !== 'hidden')
}

export function findEventBySlug(bundle: ContentBundle, slug: string): EventItem | undefined {
  return bundle.events.find((event) => event.slug === slug)
}

export function findReportBySlug(bundle: ContentBundle, slug: string): ReportItem | undefined {
  return bundle.reports.find((report) => report.slug === slug)
}
