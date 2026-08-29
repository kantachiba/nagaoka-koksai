import { cn } from '../../lib/cn'

/**
 * サイトのロゴマーク。長岡花火をモチーフにした放射のシンボル。
 * 正式なロゴが決まるまでの仮デザインです。
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn('size-9', className)} aria-hidden="true">
      <circle cx="20" cy="20" r="20" className="fill-brand-800" />
      <g stroke="currentColor" strokeLinecap="round" className="text-hanabi-400">
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i / 12) * Math.PI * 2 - Math.PI / 2
          const inner = 6
          const outer = i % 2 === 0 ? 15 : 11
          return (
            <line
              key={i}
              x1={20 + Math.cos(angle) * inner}
              y1={20 + Math.sin(angle) * inner}
              x2={20 + Math.cos(angle) * outer}
              y2={20 + Math.sin(angle) * outer}
              strokeWidth={i % 2 === 0 ? 2 : 1.4}
              opacity={i % 2 === 0 ? 1 : 0.7}
            />
          )
        })}
      </g>
      <circle cx="20" cy="20" r="3.4" className="fill-white" />
    </svg>
  )
}
