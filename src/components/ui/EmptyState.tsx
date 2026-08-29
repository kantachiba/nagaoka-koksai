import type { ReactNode } from 'react'
import { Icon } from './Icon'
import type { IconName } from './Icon'

type Props = {
  title: string
  description?: string
  icon?: IconName
  action?: ReactNode
}

/** 絞り込み結果が0件のときなどに表示する空状態 */
export function EmptyState({ title, description, icon = 'search', action }: Props) {
  return (
    <div className="rounded-card border border-dashed border-snow-300 bg-white/60 px-6 py-16 text-center">
      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-snow-100 text-snow-500">
        <Icon name={icon} className="size-6" />
      </div>
      <p className="font-bold text-snow-800">{title}</p>
      {description && <p className="mt-2 text-sm text-snow-500">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
