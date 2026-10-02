/**
 * 旧URL（tibanian.com/international-portal）を
 * https://nagaoka-international.nitnc.club へ転送する。
 *
 * 本番は Firebase Hosting のカスタムドメイン直下で配信している。
 * この Worker は古いリンク・ブックマーク用の橋渡しだけを担う。
 */

const BASE_PATH = '/international-portal'
const NEW_ORIGIN = 'https://nagaoka-international.nitnc.club'

export default {
  async fetch(request) {
    const url = new URL(request.url)

    const isExact = url.pathname === BASE_PATH || url.pathname === `${BASE_PATH}/`
    const isUnder = url.pathname.startsWith(`${BASE_PATH}/`)
    if (!isExact && !isUnder) {
      return new Response('Not Found', { status: 404 })
    }

    const remainder = isExact ? '/' : url.pathname.slice(BASE_PATH.length)
    return Response.redirect(`${NEW_ORIGIN}${remainder}${url.search}`, 301)
  },
}
