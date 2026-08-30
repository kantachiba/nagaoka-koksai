import { parseRuby } from '../../lib/ruby'

/**
 * ルビ記法をその場で描いて見せる。
 * 運営が {漢字|よみ} を書いたときに、実際の見え方をすぐ確認できるようにする。
 */
export default function RubyPreview({ text }: { text: string }) {
  const segments = parseRuby(text)
  if (segments.length === 0) {
    return <span className="text-snow-400">（ここに表示されます）</span>
  }
  return (
    <>
      {segments.map((segment, index) =>
        segment.ruby ? (
          <ruby key={index}>
            {segment.text}
            <rp>(</rp>
            <rt>{segment.ruby}</rt>
            <rp>)</rp>
          </ruby>
        ) : (
          <span key={index}>{segment.text}</span>
        ),
      )}
    </>
  )
}
