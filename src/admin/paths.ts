/**
 * 管理画面内のリンク先。
 * 専用ドメイン直下で公開しているので、渡されたパスをそのまま使う。
 */
export function adminHref(path: string): string {
  return path.startsWith('/') ? path : `/${path}`
}
