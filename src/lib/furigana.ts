/**
 * 形態素解析の結果から、ルビ記法 {漢字|よみ} を組み立てる。
 *
 * 解析器そのもの（kuromoji）は管理画面でのみ読み込む。このファイルは
 * 「表層形」と「読み」からルビ記法を作る部分だけを担い、単体で検証できる。
 *
 * ⚠️ 自動生成の読みは万能ではない（人名・地名・固有名詞で外しやすい）。
 *    運営があとから手で直せることを前提にした「下書き生成」と位置づける。
 */

const KATAKANA_START = 0x30a1
const KATAKANA_END = 0x30f6

/** カタカナをひらがなに直す（読みはカタカナで返ってくるため） */
export function toHiragana(text: string): string {
  return text.replace(/[ァ-ヶ]/g, (char) => {
    const code = char.charCodeAt(0)
    return code >= KATAKANA_START && code <= KATAKANA_END
      ? String.fromCharCode(code - 0x60)
      : char
  })
}

const KANJI = /[一-鿿々〇〻]/

export const hasKanji = (text: string): boolean => KANJI.test(text)

type Run = { text: string; kanji: boolean }

/** 表層形を「漢字のかたまり」と「かなのかたまり」に分ける */
function splitRuns(surface: string): Run[] {
  const runs: Run[] = []
  for (const char of surface) {
    const kanji = KANJI.test(char)
    const last = runs.at(-1)
    if (last && last.kanji === kanji) last.text += char
    else runs.push({ text: char, kanji })
  }
  return runs
}

/**
 * 表層形と読みを突き合わせ、漢字の部分だけにルビを振る。
 *
 *   annotate('読む', 'ヨム')         → '{読|よ}む'
 *   annotate('お問い合わせ', 'オトイアワセ') → 'お{問|と}い{合|あ}わせ'
 *
 * 送りがなの位置をかなのかたまりで対応づけるため、
 * 「{読む|よむ}」のようにまとめてルビを振ってしまうことがない。
 */
export function annotate(surface: string, reading: string): string {
  if (!hasKanji(surface)) return surface

  const yomi = toHiragana(reading)
  if (!yomi || yomi === surface) return surface

  const runs = splitRuns(surface)
  let rest = yomi
  let result = ''

  for (let i = 0; i < runs.length; i++) {
    const run = runs[i]

    if (!run.kanji) {
      // かなの部分は読みからそのまま消費する
      if (!rest.startsWith(run.text)) return fallback(surface, yomi)
      rest = rest.slice(run.text.length)
      result += run.text
      continue
    }

    const next = runs[i + 1]
    if (!next) {
      // 末尾の漢字：残りすべてが読み
      if (!rest) return fallback(surface, yomi)
      result += `{${run.text}|${rest}}`
      rest = ''
      continue
    }

    // 次のかなのかたまりが現れる位置までが、この漢字の読み
    const boundary = rest.indexOf(next.text)
    if (boundary <= 0) return fallback(surface, yomi)
    result += `{${run.text}|${rest.slice(0, boundary)}}`
    rest = rest.slice(boundary)
  }

  // 読みが余ったら対応づけに失敗している
  return rest ? fallback(surface, yomi) : result
}

/** 対応づけできないときは、語全体にまとめてルビを振る */
const fallback = (surface: string, yomi: string): string => `{${surface}|${yomi}}`

export type Token = { surface_form: string; reading?: string }

/**
 * 解析結果の並びからルビ記法つきの文字列を組み立てる。
 * 読みが取れなかった語（記号・未知語）はそのまま通す。
 */
export function tokensToRuby(tokens: Token[]): string {
  return tokens
    .map((token) =>
      token.reading && token.reading !== '*'
        ? annotate(token.surface_form, token.reading)
        : token.surface_form,
    )
    .join('')
}
