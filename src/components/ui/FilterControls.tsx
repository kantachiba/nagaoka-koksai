import { useId } from 'react'
import { cn } from '../../lib/cn'
import { Icon } from './Icon'

/** 絞り込みパネル用の入力部品まとめ */

type SelectOption = { value: string; label: string }

export function FilterSelect({
  label,
  value,
  options,
  onChange,
  className,
}: {
  label: string
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
  className?: string
}) {
  const id = useId()
  return (
    <div className={cn('min-w-0', className)}>
      <label htmlFor={id} className="mb-1.5 block text-xs font-bold text-snow-600">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full appearance-none rounded-lg border border-snow-300 bg-white py-2.5 pr-9 pl-3 text-sm font-medium text-snow-800 transition-colors hover:border-snow-400 focus:border-brand-500"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Icon
          name="chevron-down"
          className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-snow-400"
        />
      </div>
    </div>
  )
}

export function SearchInput({
  label,
  value,
  placeholder,
  onChange,
  className,
}: {
  label: string
  value: string
  placeholder?: string
  onChange: (value: string) => void
  className?: string
}) {
  const id = useId()
  return (
    <div className={cn('min-w-0', className)}>
      <label htmlFor={id} className="mb-1.5 block text-xs font-bold text-snow-600">
        {label}
      </label>
      <div className="relative">
        <Icon
          name="search"
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-snow-400"
        />
        <input
          id={id}
          type="search"
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-lg border border-snow-300 bg-white py-2.5 pr-3 pl-9 text-sm text-snow-800 transition-colors placeholder:text-snow-400 hover:border-snow-400 focus:border-brand-500"
        />
      </div>
    </div>
  )
}

/** 押すたびに ON / OFF が切り替わるチップ型の絞り込み */
export function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors',
        active
          ? 'bg-brand-700 text-white ring-1 ring-brand-700 ring-inset'
          : 'bg-white text-snow-600 ring-1 ring-snow-300 ring-inset hover:bg-snow-100 hover:text-snow-800',
      )}
    >
      {active && <Icon name="check" className="size-3.5" strokeWidth={2.5} />}
      {children}
    </button>
  )
}

export function ToggleSwitch({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  const id = useId()
  return (
    <div className="flex items-center gap-2.5">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full transition-colors',
          checked ? 'bg-brand-600' : 'bg-snow-300',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 size-5 rounded-full bg-white shadow transition-[left]',
            checked ? 'left-[1.375rem]' : 'left-0.5',
          )}
        />
      </button>
      <label htmlFor={id} className="cursor-pointer text-sm font-medium text-snow-700">
        {label}
      </label>
    </div>
  )
}
