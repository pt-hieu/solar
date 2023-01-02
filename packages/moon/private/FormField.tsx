import { VariantProps, cva } from 'class-variance-authority'
import { AnimatePresence, motion } from 'framer-motion'
import { ForwardedRef, MouseEvent, PropsWithChildren, forwardRef } from 'react'
import {
  DeepRequired,
  FieldError,
  FieldErrorsImpl,
  Merge,
  Path,
} from 'react-hook-form'

const styles = cva([], {
  variants: {
    layout: {
      row: 'grid grid-cols-[min-content,1fr] gap-8',
      column: 'flex flex-col gap-1',
    },
  },
})

type Props<T extends Record<string, any>> = {
  label: string
  id?: string
  required?: boolean
  error?:
    | FieldError
    | Merge<FieldError, FieldErrorsImpl<DeepRequired<T>[Path<T>]>>
  onLabelClick?: (e: MouseEvent<HTMLLabelElement>) => void
  labelClassname?: string
} & Omit<VariantProps<typeof styles>, `_${string}`>

export const FormField = forwardRef(function <T extends Record<string, any>>(
  {
    layout = 'column',
    label,
    id,
    required,
    error,
    children,
    onLabelClick,
    labelClassname,
  }: PropsWithChildren<Props<T>>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const hasError = !!error

  return (
    <div ref={ref} className={styles({ layout, className: 'my-3' })}>
      {label && (
        <label
          className={`${layout === 'row' ? 'mt-2' : 'mb-2'} ${
            hasError ? 'text-rose-500' : ''
          } select-none ${labelClassname}`}
          htmlFor={id}
          onClick={onLabelClick}
        >
          {label}
          {required ? '*' : ''}
        </label>
      )}

      <div>
        {children}
        <AnimatePresence>
          {error?.message && (
            <motion.div
              initial={{ marginTop: 0, maxHeight: 0, opacity: 0 }}
              animate={{ marginTop: '8px', maxHeight: '30px', opacity: 1 }}
              exit={{ marginTop: 0, maxHeight: 0, opacity: 0 }}
              className="text-rose-500"
            >
              {error.message.toString().replace('$$', label || 'This field')}
            </motion.div>
          )}
        </AnimatePresence>{' '}
      </div>
    </div>
  )
})
