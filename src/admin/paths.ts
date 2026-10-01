const BASE_PATH = '/international-portal'

/**
 * 管理画面内のリンク先を、いま開いているURLに合わせて組み立てる。
 *
 * React が描画したリンクは Cloudflare Worker の HTML 書き換えを通らないため、
 * tibanian.com/international-portal 経由で開いているときはここでプレフィックスを付ける
 * （nagaoka-kokusai-portal.web.app 直アクセスや localhost ではルートのまま）。
 */
export function adminHref(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`
  const { pathname } = window.location
  const underBase = pathname === BASE_PATH || pathname.startsWith(`${BASE_PATH}/`)
  return underBase ? `${BASE_PATH}${p}` : p
}
