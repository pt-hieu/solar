import { type VariantProps, cva } from 'class-variance-authority'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ComponentProps,
  ForwardedRef,
  HTMLInputTypeAttribute,
  forwardRef,
  useId,
} from 'react'
import { FieldPath, useFormContext, useFormState } from 'react-hook-form'

import { mergeRefs } from '../helpers/ref'
import { FormField } from '../private/FormField'

export const styles = cva([], {
  variants: {
    _element: {
      input: [
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
    _hasError: {
      true: ['ring-rose-500', 'focus:!ring-rose-500'],
    },
  },
})

type Props<T extends Record<string, any>> = {
  type?: Omit<HTMLInputTypeAttribute, 'radio' | 'checkbox'>
  placeholder?: string
  name: FieldPath<T>
} & Pick<ComponentProps<typeof FormField>, 'label' | 'layout' | 'required'> &
  Omit<VariantProps<typeof styles>, `_${string}`>

const Input = forwardRef(function <
  T extends Record<string, any> = Record<string, any>,
>(
  { type = 'text', label, required, name, placeholder, layout }: Props<T>,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const id = useId()

  const { register, control } = useFormContext<T>()
  const { ref: formRef, ...regis } = register(name)

  const { errors } = useFormState({ control })

  const error = errors[name]
  const hasError = !!error

  return (
    <FormField
      label={label}
      hasError={hasError}
      id={id}
      layout={layout}
      required={required}
    >
      <div>
        <input
          className={styles({ _element: 'input', _hasError: hasError })}
          id={id}
          // @ts-expect-error: false positive
          type={type}
          placeholder={placeholder}
          {...regis}
          ref={mergeRefs([formRef, ref])}
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
    </FormField>
  )
})

export { Input }
