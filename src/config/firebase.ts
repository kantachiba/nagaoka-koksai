/**
 * Firebase のクライアント設定。
 *
 * ⚠️ ここに載っている apiKey などは「秘密の鍵」ではない。Firebase の web 設定は
 *    公開前提の識別子で、実際の保護は Firestore / Storage のセキュリティルールと
 *    Authentication が担っている（firestore.rules を参照）。
 *    そのため、静的サイトのJSに含めて問題ない。
 */
export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyD2iie-nKRHdojuVkEKq0lCjuvfFY6h7bg',
  authDomain: 'nagaoka-kokusai-portal.firebaseapp.com',
  projectId: 'nagaoka-kokusai-portal',
  storageBucket: 'nagaoka-kokusai-portal.firebasestorage.app',
  messagingSenderId: '126738286449',
  appId: '1:126738286449:web:463c62b4025552697f18d0',
} as const
