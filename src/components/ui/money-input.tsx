import * as React from 'react'

import { Input } from './input'

function formatVnd(value: number) {
  return new Intl.NumberFormat('vi-VN').format(value)
}

function parseDigits(raw: string) {
  const digits = raw.replace(/[^\d]/g, '')
  if (!digits) return null
  // tránh số quá lớn làm tràn Number trong UI
  const n = Number(digits)
  if (!Number.isFinite(n)) return null
  return n
}

export type MoneyInputProps = Omit<React.ComponentProps<typeof Input>, 'value' | 'onChange' | 'type'> & {
  value: number | null
  onValueChange: (value: number | null) => void
}

export const MoneyInput = React.forwardRef<HTMLInputElement, MoneyInputProps>(
  ({ value, onValueChange, inputMode = 'numeric', ...props }, ref) => {
    const displayValue = value === null ? '' : formatVnd(value)

    return (
      <Input
        {...props}
        ref={ref}
        inputMode={inputMode}
        value={displayValue}
        onChange={(e) => onValueChange(parseDigits(e.target.value))}
      />
    )
  }
)

MoneyInput.displayName = 'MoneyInput'
