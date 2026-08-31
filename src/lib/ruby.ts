/**
 * ルビ記法のパーサ。
 *
 * 「ふりがな版」という言語は廃止したが、難しい固有名詞などに部分的に
 * ルビを振りたい場合に備えて記法自体は残してある。
 * 記法を含まない文字列はそのまま素通しするので、通常の文章に影響はない。
 *
 *   入力: {長岡|ながおか}市の{国際交流|こくさいこうりゅう}
 *   出力: <ruby>長岡<rp>(</rp><rt>ながおか</rt><rp>)</rp></ruby>市の…
 *
 * 波かっこ自体を書きたいときは \{ \} のようにバックスラッシュで打ち消す。
 */

export type RubySegment = {
  /** 基底文字（漢字など） */
  text: string
  /** ふりがな。無い場合はルビを振らない素のテキスト */
  ruby?: string
}

/** {漢字|よみ} 形式。かっこ・区切り文字自体は中に含められない */
const RUBY_PATTERN = /\{([^{}|\\]+)\|([^{}|\\]+)\}/g

/** エスケープ（\{ \} \|）を実際の文字へ戻す */
function unescape(text: string): string {
  return text.replace(/\\([{}|])/g, '$1')
}

/**
 * ルビ記法を解析してセグメントの配列にする。
 * 記法を含まない文字列は、単一の素セグメントとして返る。
 */
export function parseRuby(input: string): RubySegment[] {
  if (!input) return []

  const segments: RubySegment[] = []
  let lastIndex = 0

  // 正規表現は使い回すと lastIndex が残るため、毎回作り直す
  const pattern = new RegExp(RUBY_PATTERN.source, 'g')
  let match: RegExpExecArray | null

  while ((match = pattern.exec(input)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: unescape(input.slice(lastIndex, match.index)) })
    }
    segments.push({ text: unescape(match[1]), ruby: unescape(match[2]) })
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < input.length) {
    segments.push({ text: unescape(input.slice(lastIndex)) })
  }

  return segments
}

/**
 * ルビ記法を取り除いて基底文字だけにする。
 * <title> や og:description などマークアップを置けない場所で使う。
 */
export function stripRuby(input: string): string {
  return parseRuby(input)
    .map((segment) => segment.text)
    .join('')
}

/** ルビ記法を含むかどうか */
export function hasRuby(input: string): boolean {
  return parseRuby(input).some((segment) => segment.ruby !== undefined)
}
