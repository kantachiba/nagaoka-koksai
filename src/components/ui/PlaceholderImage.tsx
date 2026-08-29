import { useId } from 'react'
import { cn } from '../../lib/cn'
import type { Visual } from '../../data/types'

/**
 * 写真の代わりに表示するプレースホルダー。
 *
 * 外部画像に依存せず、`visual` の指定（配色 × モチーフ）から
 * 決定的にSVGを描画します。実写真を差し替えるときは、この
 * コンポーネントを <img> に置き換えるだけで済むようにしてあります。
 */

/** グラデーションの配色パターン */
const PALETTES: Array<[string, string, string]> = [
  ['#111b33', '#2b4d97', '#5b84cc'], // 信濃川の夜
  ['#0f3a4d', '#1f7f96', '#5fbccb'], // 川面
  ['#5c1c0c', '#dd4708', '#ffa971'], // 長岡花火
  ['#2f2359', '#6b4fb8', '#a996e0'], // 宵闇
  ['#11402f', '#2b8a63', '#7fc9a5'], // 棚田
  ['#4d1c36', '#a34468', '#e29ab0'], // 紅梅
]

type Props = {
  visual: Visual
  /** アスペクト比のユーティリティクラス（例: 'aspect-[16/9]'） */
  className?: string
  /** 装飾目的なので既定では読み上げ対象外。説明が必要なときだけ渡す */
  alt?: string
}

export function PlaceholderImage({ visual, className, alt }: Props) {
  const uid = useId().replace(/:/g, '')
  const [dark, mid, light] = PALETTES[visual.palette % PALETTES.length]
  const gradientId = `grad-${uid}`

  return (
    <svg
      viewBox="0 0 400 225"
      preserveAspectRatio="xMidYMid slice"
      className={cn('block h-full w-full', className)}
      role={alt ? 'img' : 'presentation'}
      aria-label={alt}
      aria-hidden={alt ? undefined : true}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={dark} />
          <stop offset="55%" stopColor={mid} />
          <stop offset="100%" stopColor={light} />
        </linearGradient>
      </defs>
      <rect width="400" height="225" fill={`url(#${gradientId})`} />
      <Motif index={visual.motif} light={light} dark={dark} />
    </svg>
  )
}

function Motif({ index, light, dark }: { index: number; light: string; dark: string }) {
  switch (index % 5) {
    // 花火 —— 中心から放射する光跡
    case 0:
      return (
        <g stroke={light} strokeLinecap="round" fill="none">
          {Array.from({ length: 16 }, (_, i) => {
            const angle = (i / 16) * Math.PI * 2
            const inner = 22
            const outer = i % 2 === 0 ? 96 : 68
            return (
              <line
                key={i}
                x1={280 + Math.cos(angle) * inner}
                y1={78 + Math.sin(angle) * inner}
                x2={280 + Math.cos(angle) * outer}
                y2={78 + Math.sin(angle) * outer}
                strokeWidth={i % 2 === 0 ? 2 : 1.2}
                opacity={0.45}
              />
            )
          })}
          <circle cx="280" cy="78" r="8" fill={light} opacity="0.55" stroke="none" />
          <circle cx="280" cy="78" r="104" opacity="0.16" strokeWidth="1" />
        </g>
      )

    // 川 —— 重なる水の流れ
    case 1:
      return (
        <g fill="none" stroke={light} strokeWidth="1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              d={`M -20 ${130 + i * 22} C 90 ${100 + i * 22}, 180 ${170 + i * 22}, 430 ${118 + i * 22}`}
              opacity={0.14 + i * 0.06}
              strokeWidth={1 + i * 0.5}
            />
          ))}
        </g>
      )

    // 円 —— 交わるコミュニティ
    case 2:
      return (
        <g>
          <circle cx="120" cy="112" r="72" fill={light} opacity="0.14" />
          <circle cx="196" cy="112" r="72" fill={light} opacity="0.14" />
          <circle cx="272" cy="112" r="72" fill={light} opacity="0.14" />
          <circle cx="120" cy="112" r="72" fill="none" stroke={light} strokeWidth="1" opacity="0.3" />
          <circle cx="196" cy="112" r="72" fill="none" stroke={light} strokeWidth="1" opacity="0.3" />
          <circle cx="272" cy="112" r="72" fill="none" stroke={light} strokeWidth="1" opacity="0.3" />
        </g>
      )

    // 山と棚田 —— 重なる稜線
    case 3:
      return (
        <g>
          <path d="M -20 225 L 90 96 L 190 225 Z" fill={dark} opacity="0.35" />
          <path d="M 110 225 L 236 74 L 380 225 Z" fill={dark} opacity="0.28" />
          <path d="M 250 225 L 360 122 L 430 225 Z" fill={light} opacity="0.18" />
          {[168, 186, 204].map((y, i) => (
            <path
              key={y}
              d={`M -20 ${y} C 120 ${y - 12}, 260 ${y + 10}, 430 ${y - 6}`}
              fill="none"
              stroke={light}
              strokeWidth="1"
              opacity={0.22 - i * 0.04}
            />
          ))}
        </g>
      )

    // 雪 —— 舞う粒
    default:
      return (
        <g fill={light}>
          {Array.from({ length: 34 }, (_, i) => {
            // 疑似乱数（決定的）で配置
            const x = ((i * 137.5) % 400) + ((i % 3) - 1) * 6
            const y = ((i * 71.3) % 225) + ((i % 5) - 2) * 4
            const r = 1.4 + ((i * 7) % 5) * 0.8
            return <circle key={i} cx={x} cy={y} r={r} opacity={0.15 + ((i * 3) % 5) * 0.06} />
          })}
          <path
            d="M -20 200 C 120 172, 250 214, 430 178 L 430 245 L -20 245 Z"
            fill={light}
            opacity="0.14"
          />
        </g>
      )
  }
}
