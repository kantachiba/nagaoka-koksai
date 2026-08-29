import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { Icon } from './Icon'

type Props = {
  title: string
  lead?: string
  /** 「すべて見る」リンク */
  action?: { label: string; to: string }
  /** 見出しの左に添える小さなラベル */
  eyebrow?: ReactNode
  className?: string
}

export function SectionHeading({ title, lead, action, eyebrow, className }: Props) {
  return (
    <div
      className={cn(
        'mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="mb-2 text-xs font-bold tracking-widest text-hanabi-700 uppercase">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl sm:text-3xl">
          {/* 見出しの左に立てる縦のアクセント */}
          <span className="mr-3 inline-block h-6 w-1 translate-y-0.5 rounded-full bg-hanabi-500 align-middle sm:h-7" />
          {title}
        </h2>
        {lead && <p className="text-balance-ja mt-3 text-snow-600">{lead}</p>}
      </div>

      {action && (
        <Link
          to={action.to}
          className="group inline-flex shrink-0 items-center gap-1.5 self-start rounded-full px-4 py-2 text-sm font-bold text-brand-700 ring-1 ring-brand-200 ring-inset transition-colors hover:bg-brand-50 sm:self-auto"
        >
          {action.label}
          <Icon
            name="arrow-right"
            className="size-4 transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      )}
    </div>
  )
}
