import { type VariantProps, cva } from 'class-variance-authority'
import { AnimatePresence, motion } from 'framer-motion'
import { ForwardedRef, HTMLInputTypeAttribute, forwardRef, useId } from 'react'
import { FieldPath, useFormContext, useFormState } from 'react-hook-form'

import { handleForwardRef } from '../helper/ref'

export const styles = cva([], {
  variants: {
    layout: {
      row: 'grid grid-cols-[min-content,1fr] gap-8',
      column: 'flex flex-col gap-1',
    },
    inputClassname: {
      true: [
        'border-none',
        'ring-1',
        'ring-slate-400',
        'focus:ring-sky-500',
        'rounded-[3px]',
        'px-3',
        'py-2',
        'w-full',
      ],
    },
    hasError: {
      true: ['ring-rose-500', 'focus:!ring-rose-500'],
    },
  },
})

type Props<T extends Record<string, any>> = {
  type?: Omit<HTMLInputTypeAttribute, 'radio' | 'checkbox'>
  label: string
  placeholder?: string
  name: FieldPath<T>
  required?: boolean
} & Omit<VariantProps<typeof styles>, 'inputClassname' | 'hasError'>

const Input = forwardRef(function <
  T extends Record<string, any> = Record<string, any>,
>(
  {
    type = 'text',
    label,
    layout = 'row',
    required,
    name,
    placeholder,
  }: Props<T>,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const id = useId()

  const { register, control } = useFormContext<T>()
  const { ref: formRef, ...regis } = register(name)

  const { errors } = useFormState({ control })

  const error = errors[name]
  const hasError = !!error

  return (
    <div className={styles({ layout, className: 'my-3' })}>
      {label && (
        <label
          className={`${layout === 'row' ? 'mt-2' : ''} ${
            hasError ? 'text-rose-500' : ''
          }`}
          htmlFor={id}
        >
          {label}
          {required ? '*' : ''}
        </label>
      )}

      <div>
        <input
          className={styles({ inputClassname: true, hasError })}
          id={id}
          // @ts-expect-error: false positive
          type={type}
          placeholder={placeholder}
          {...regis}
          ref={(ele) => {
            formRef(ele)
            handleForwardRef(ref, ele)
          }}
        />

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
        </AnimatePresence>
      </div>
    </div>
  )
})

export { Input }
