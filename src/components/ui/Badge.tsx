import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import type { BadgeTone } from '../../data/types'

/**
 * ジャンル・エリア・状態などを示す小さなラベル。
 * 配色は data/taxonomy.ts の `tone` から決まります。
 */

const TONE_CLASSES: Record<BadgeTone, string> = {
  brand: 'bg-brand-50 text-brand-700 ring-brand-200',
  hanabi: 'bg-hanabi-50 text-hanabi-800 ring-hanabi-200',
  emerald: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  violet: 'bg-violet-50 text-violet-800 ring-violet-200',
  sky: 'bg-sky-50 text-sky-800 ring-sky-200',
  amber: 'bg-amber-50 text-amber-900 ring-amber-200',
  rose: 'bg-rose-50 text-rose-800 ring-rose-200',
  slate: 'bg-snow-100 text-snow-700 ring-snow-300',
}

/** 濃色（画像の上など、背景がある場所で使う） */
const SOLID_TONE_CLASSES: Record<BadgeTone, string> = {
  brand: 'bg-brand-700 text-white ring-brand-700',
  hanabi: 'bg-hanabi-600 text-white ring-hanabi-600',
  emerald: 'bg-emerald-700 text-white ring-emerald-700',
  violet: 'bg-violet-700 text-white ring-violet-700',
  sky: 'bg-sky-700 text-white ring-sky-700',
  amber: 'bg-amber-600 text-white ring-amber-600',
  rose: 'bg-rose-700 text-white ring-rose-700',
  slate: 'bg-snow-700 text-white ring-snow-700',
}

type Props = {
  children: ReactNode
  tone?: BadgeTone
  variant?: 'soft' | 'solid'
  size?: 'sm' | 'md'
  className?: string
}

export function Badge({
  children,
  tone = 'slate',
  variant = 'soft',
  size = 'sm',
  className,
}: Props) {
  const palette = variant === 'solid' ? SOLID_TONE_CLASSES : TONE_CLASSES
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1 rounded-full font-semibold whitespace-nowrap ring-1 ring-inset',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        palette[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
