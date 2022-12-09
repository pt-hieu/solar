import { VariantProps, cva } from 'class-variance-authority'
import { MouseEvent, PropsWithChildren } from 'react'

const styles = cva([], {
  variants: {
    layout: {
      row: 'grid grid-cols-[min-content,1fr] gap-8',
      column: 'flex flex-col gap-1',
    },
  },
})

type Props = {
  label: string
  id?: string
  required?: boolean
  hasError?: boolean
  onClick?: (e: MouseEvent<HTMLLabelElement>) => void
} & Omit<VariantProps<typeof styles>, `_${string}`>

export const FormField = ({
  layout,
  label,
  id,
  hasError,
  required,
  children,
  onClick,
}: PropsWithChildren<Props>) => {
  return (
    <div className={styles({ layout, className: 'my-3' })}>
      {label && (
        <label
          className={`${layout === 'row' ? 'mt-2' : 'mb-2'} ${
            hasError ? 'text-rose-500' : ''
          }`}
          htmlFor={id}
          onClick={onClick}
        >
          {label}
          {required ? '*' : ''}
        </label>
      )}

      {children}
    </div>
  )
}
