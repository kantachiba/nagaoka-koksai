/**
 * Firestore の REST API レスポンスを素の JavaScript の値に戻す。
 *
 * ビルド時にコンテンツを取得するために使う。公開済みドキュメントは
 * セキュリティルールで誰でも読めるようにしてあるので、認証情報は要らない。
 * （Admin SDK とサービスアカウント鍵を CI に置かずに済む）
 */

type FirestoreValue = Record<string, unknown>

/** { stringValue: 'x' } のような型付きの値を素の値に戻す */
function decodeValue(value: FirestoreValue): unknown {
  if ('nullValue' in value) return null
  if ('stringValue' in value) return value.stringValue
  if ('booleanValue' in value) return value.booleanValue
  // integerValue は精度確保のため文字列で返ってくる
  if ('integerValue' in value) return Number(value.integerValue)
  if ('doubleValue' in value) return value.doubleValue
  if ('timestampValue' in value) return value.timestampValue
  if ('arrayValue' in value) {
    const values = (value.arrayValue as { values?: FirestoreValue[] })?.values ?? []
    return values.map(decodeValue)
  }
  if ('mapValue' in value) {
    return decodeFields((value.mapValue as { fields?: Record<string, FirestoreValue> })?.fields)
  }
  return undefined
}

function decodeFields(fields: Record<string, FirestoreValue> | undefined): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(fields ?? {})) {
    const decoded = decodeValue(value)
    if (decoded !== undefined) result[key] = decoded
  }
  return result
}

export type FirestoreDocument = {
  /** 'projects/../documents/events/abc123' 形式 */
  name: string
  fields?: Record<string, FirestoreValue>
}

/** ドキュメント1件を { id, ...fields } の形に変換する */
export function decodeDocument(doc: FirestoreDocument): Record<string, unknown> {
  return { id: doc.name.split('/').pop()!, ...decodeFields(doc.fields) }
}

export function decodeDocuments(docs: FirestoreDocument[] | undefined): Record<string, unknown>[] {
  return (docs ?? []).map(decodeDocument)
}
