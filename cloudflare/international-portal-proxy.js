/**
 * chibanian.com/international-portal を Firebase Hosting へ橋渡しする
 * Cloudflare Worker。
 *
 * ドメイン直下（chibanian.com）には既存の別サイトがあるため、この
 * ポータルは Firebase Hosting 上ではルート（/events など、プレフィックス
 * なし）のまま配信している。この Worker が
 *   1. chibanian.com/international-portal/* 宛のリクエストだけを受け取り、
 *   2. プレフィックスを外して Firebase Hosting（nagaoka-kokusai-portal.web.app）
 *      へ転送し、
 *   3. 返ってきた HTML 内のルート相対パス（href / src / srcset）に
 *      /international-portal を付け直してから返す。
 *
 * ドメイン直下のリクエストはこの Worker が登録された経路以外を通るため、
 * 既存サイト側は一切変更不要（ルーティングの詳細は cloudflare/README.md）。
 *
 * canonical・hreflang・OGP・sitemap の絶対URLはビルド時点
 * （src/config/site.ts の SITE_URL）で /international-portal を
 * 含めて生成済みなので、ここでは書き換えない（すでに絶対URLなので
 * 下記のルート相対判定にも掛からない）。
 */

const BASE_PATH = '/international-portal'
const ORIGIN = 'https://nagaoka-kokusai-portal.web.app'

/** ルート相対パス（'/'始まり・'//'ではない）だけを対象にする */
function isRootRelative(value) {
  return value.startsWith('/') && !value.startsWith('//')
}

/** href / src / action など、単一URLの属性を書き換える */
class AttributeRewriter {
  constructor(attributeName) {
    this.attributeName = attributeName
  }
  element(element) {
    const value = element.getAttribute(this.attributeName)
    if (value && isRootRelative(value)) {
      element.setAttribute(this.attributeName, BASE_PATH + value)
    }
  }
}

/** srcset は「URL 記述子」のカンマ区切りなので個別にパースする */
class SrcsetRewriter {
  element(element) {
    const value = element.getAttribute('srcset')
    if (!value) return
    const rewritten = value
      .split(',')
      .map((part) => {
        const trimmed = part.trim()
        if (!trimmed) return trimmed
        const spaceIndex = trimmed.indexOf(' ')
        const url = spaceIndex === -1 ? trimmed : trimmed.slice(0, spaceIndex)
        const descriptor = spaceIndex === -1 ? '' : trimmed.slice(spaceIndex)
        return isRootRelative(url) ? `${BASE_PATH}${url}${descriptor}` : trimmed
      })
      .join(', ')
    element.setAttribute('srcset', rewritten)
  }
}

const rewriter = new HTMLRewriter()
  .on('a[href]', new AttributeRewriter('href'))
  .on('link[href]', new AttributeRewriter('href'))
  .on('script[src]', new AttributeRewriter('src'))
  .on('img[src]', new AttributeRewriter('src'))
  .on('img[srcset]', new SrcsetRewriter())
  .on('source[srcset]', new SrcsetRewriter())
  .on('form[action]', new AttributeRewriter('action'))

export default {
  async fetch(request) {
    const url = new URL(request.url)

    // 想定外のパス（例: /international-portalxyz）が紛れ込んだ場合の保険。
    // 本来は Cloudflare 側のルート設定で弾かれるはずだが、念のため。
    const isExact = url.pathname === BASE_PATH
    const isUnder = url.pathname.startsWith(`${BASE_PATH}/`)
    if (!isExact && !isUnder) {
      return new Response('Not Found', { status: 404 })
    }

    const remainder = isExact ? '/' : url.pathname.slice(BASE_PATH.length)
    const originUrl = `${ORIGIN}${remainder}${url.search}`

    const originResponse = await fetch(originUrl, {
      method: request.method,
      headers: request.headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
      redirect: 'manual',
    })

    // Firebase側がリダイレクトを返した場合、Location にも
    // プレフィックスを付け直す（同一オリジン内への相対/絶対どちらでも）。
    if ([301, 302, 303, 307, 308].includes(originResponse.status)) {
      const location = originResponse.headers.get('location')
      if (location) {
        const target = new URL(location, ORIGIN)
        const newLocation =
          target.origin === ORIGIN ? `${BASE_PATH}${target.pathname}${target.search}` : location
        const headers = new Headers(originResponse.headers)
        headers.set('location', newLocation)
        return new Response(originResponse.body, { status: originResponse.status, headers })
      }
    }

    const contentType = originResponse.headers.get('content-type') ?? ''
    if (!contentType.includes('text/html')) {
      // HTML以外（CSS/JS/画像など）はパスの書き換え不要なのでそのまま流す。
      return originResponse
    }

    const headers = new Headers(originResponse.headers)
    // 書き換えでサイズが変わるため、古い Content-Length は外す
    // （HTMLRewriter がストリーミングで正しく転送してくれる）。
    headers.delete('content-length')

    return rewriter.transform(new Response(originResponse.body, { status: originResponse.status, headers }))
  },
}
