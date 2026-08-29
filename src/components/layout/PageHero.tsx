import type { ReactNode } from 'react'
import { Breadcrumb } from '../ui/Breadcrumb'
import type { Crumb } from '../ui/Breadcrumb'
import { Container } from '../ui/Container'

/** 一覧ページ共通の見出しエリア */
export function PageHero({
  title,
  lead,
  crumbs,
  children,
}: {
  title: string
  lead?: string
  crumbs: Crumb[]
  children?: ReactNode
}) {
  return (
    <div className="border-b border-snow-200 bg-linear-to-b from-brand-50 to-snow-50">
      <Container>
        <Breadcrumb items={crumbs} />
        <div className="max-w-3xl pt-2 pb-10">
          <h1 className="text-balance-ja text-3xl sm:text-4xl">
            <span className="mr-3 inline-block h-7 w-1.5 translate-y-0.5 rounded-full bg-hanabi-500 align-middle sm:h-9" />
            {title}
          </h1>
          {lead && <p className="text-balance-ja mt-4 leading-relaxed text-snow-600">{lead}</p>}
          {children}
        </div>
      </Container>
    </div>
  )
}
