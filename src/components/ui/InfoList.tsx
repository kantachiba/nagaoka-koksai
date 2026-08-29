import type { ReactNode } from 'react'
import { Icon } from './Icon'
import type { IconName } from './Icon'

export type InfoRow = {
  icon: IconName
  label: string
  value: ReactNode
}

/**
 * 「開催日 / 会場 / 参加費」のような項目を並べる定義リスト。
 *
 * ビューポートではなく「置かれた場所の幅」で切り替えるため、コンテナクエリを
 * 使っています。狭いサイドバーでは縦積み、広い本文カラムではラベルと値が
 * 横並びになります。
 */
export function InfoList({ rows }: { rows: InfoRow[] }) {
  return (
    <dl className="@container divide-y divide-snow-200">
      {rows.map((row) => (
        <div key={row.label} className="flex flex-col gap-1 py-3.5 @md:flex-row @md:gap-6">
          <dt className="flex shrink-0 items-center gap-2 text-sm font-bold text-snow-600 @md:w-36">
            <Icon name={row.icon} className="size-4 text-brand-500" />
            {row.label}
          </dt>
          <dd className="text-balance-ja min-w-0 flex-1 text-snow-800">{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}
