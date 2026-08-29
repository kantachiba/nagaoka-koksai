/**
 * クラス名を結合する小さなヘルパー。
 * falsy な値（false / null / undefined / ''）は無視されます。
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}
