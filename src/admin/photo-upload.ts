import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'

/**
 * 写真の圧縮と保存。
 *
 * Cloud Storage は Blaze プラン必須なので、ブラウザ側で縮小・圧縮してから
 * base64 で Firestore に保存する。ビルド時に静的画像として書き出される
 * （scripts/fetch-photos.mjs）ため、閲覧者は普通の画像として受け取る。
 */

/** Firestore の 1ドキュメント上限は 1MiB。base64 は約1.33倍になるので余裕を持たせる */
const MAX_BASE64_BYTES = 700_000
const MAX_EDGE = 1600

export type CompressedImage = { base64: string; width: number; height: number }

/** 長辺を MAX_EDGE に収め、容量に収まるまで品質を落として JPEG にする */
export async function compressImage(file: File): Promise<CompressedImage> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, width, height)

  for (const quality of [0.82, 0.7, 0.6, 0.5, 0.4]) {
    const base64 = canvas.toDataURL('image/jpeg', quality).split(',')[1] ?? ''
    if (base64.length <= MAX_BASE64_BYTES) return { base64, width, height }
  }
  throw new Error('画像を十分に小さくできませんでした。別の写真をお試しください。')
}

export type UploadedPhoto = CompressedImage & { photoId: string; dataUrl: string }

/** 圧縮して Firestore に保存し、その場のプレビュー用 URL も返す */
export async function uploadPhoto(file: File, organizationId: string): Promise<UploadedPhoto> {
  const image = await compressImage(file)
  const reference = await addDoc(collection(db(), 'photos'), {
    organizationId,
    data: image.base64,
    mimeType: 'image/jpeg',
    width: image.width,
    height: image.height,
    fileName: file.name,
    createdAt: serverTimestamp(),
  })
  return { ...image, photoId: reference.id, dataUrl: `data:image/jpeg;base64,${image.base64}` }
}
