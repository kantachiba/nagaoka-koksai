import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { FIREBASE_CONFIG } from '../config/firebase'

/**
 * 管理画面用の Firebase 初期化。
 *
 * 公開ページは Firestore の REST API をビルド時に読むだけなので SDK を使わない。
 * SDK が読み込まれるのは /admin だけ（client:only のアイランド）。
 */
let app: FirebaseApp | undefined

function getFirebaseApp(): FirebaseApp {
  app ??= getApps()[0] ?? initializeApp(FIREBASE_CONFIG)
  return app
}

export const auth = (): Auth => getAuth(getFirebaseApp())
export const db = (): Firestore => getFirestore(getFirebaseApp())
