import { doc, getDocs, collection, writeBatch } from 'firebase/firestore'
import { db } from './firebase'
import { MOCK_CONTENT } from '../lib/mock-content'

/**
 * 初期データの投入。
 *
 * src/lib/mock-content.ts の内容（タグ9種・実在2団体・出典つき活動報告1件）を
 * Firestore へ書き込む。既にデータがある場合は上書きしない。
 *
 * ⚠️ イベントは1件も入れない。実際の開催予定が分からないまま架空のイベントを
 *    実在団体に紐づけないため、管理画面から手で登録する。
 */

export type SeedResult = {
  created: { tags: number; organizations: number; reports: number }
  skipped: boolean
  message: string
}

/** id はドキュメントIDとして使うので、本文からは外す */
const withoutId = <T extends { id: string }>(item: T): Omit<T, 'id'> => {
  const { id: _id, ...rest } = item
  return rest
}

export async function seedInitialData(): Promise<SeedResult> {
  const firestore = db()

  // 既存データがあるなら何もしない（誤って上書きしないため）
  const existing = await Promise.all(
    ['tags', 'organizations', 'reports'].map((name) => getDocs(collection(firestore, name))),
  )
  if (existing.some((snapshot) => !snapshot.empty)) {
    return {
      created: { tags: 0, organizations: 0, reports: 0 },
      skipped: true,
      message: 'すでにデータが入っているため、何もしませんでした。',
    }
  }

  const batch = writeBatch(firestore)

  for (const tag of MOCK_CONTENT.tags) {
    batch.set(doc(firestore, 'tags', tag.id), withoutId(tag))
  }
  for (const organization of MOCK_CONTENT.organizations) {
    batch.set(doc(firestore, 'organizations', organization.id), withoutId(organization))
  }
  for (const report of MOCK_CONTENT.reports) {
    batch.set(doc(firestore, 'reports', report.id), withoutId(report))
  }

  await batch.commit()

  return {
    created: {
      tags: MOCK_CONTENT.tags.length,
      organizations: MOCK_CONTENT.organizations.length,
      reports: MOCK_CONTENT.reports.length,
    },
    skipped: false,
    message: '初期データを投入しました。',
  }
}
