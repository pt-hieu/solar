import { VariantProps, cva } from 'class-variance-authority'
import { motion } from 'framer-motion'
import {
  ComponentProps,
  ForwardedRef,
  forwardRef,
  useCallback,
  useId,
} from 'react'
import { FieldPath, useFormContext, useFormState } from 'react-hook-form'

import { mergeRefs } from '../helpers/ref'
import { FormField } from '../private/FormField'

const styles = cva([], {
  variants: {
    _element: {
      track: 'relative w-[46px] h-[24px] rounded-full p-[2px] px-[5px]',
      thumb:
        'inline-block h-[16px] aspect-square rounded-full bg-white relative',
    },
  },
})

type Props<T extends Record<string, any>> = {
  name?: FieldPath<T>
} & Omit<VariantProps<typeof styles>, `_${string}`> &
  Pick<ComponentProps<typeof FormField>, 'label' | 'layout' | 'required'>

const Switch = forwardRef(function <
  T extends Record<string, any> = Record<string, any>,
>(
  { label, layout = 'row', required, name }: Props<T>,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const id = useId()

  const { register, control, watch, setValue } = useFormContext<T>()
  const { ref: formRef, ...regis } = register(name || (id as any))

  const checked = watch(name || (id as any))

  const handleClick = useCallback(() => {
    setValue(name || (id as any), !checked as any)
  }, [checked, name, id])

  const { errors } = useFormState({ control })

  return (
    <FormField
      label={label}
      layout={layout}
      required={required}
      id={id}
      error={errors[name || id]}
      onLabelClick={handleClick}
      labelClassname="!mt-0"
    >
      <input
        id={id}
        type="checkbox"
        className="hidden"
        {...regis}
        ref={mergeRefs(formRef, ref)}
      />

      <button
        onClick={handleClick}
        className={styles({
          _element: 'track',
          className: checked ? 'bg-sky-500' : 'bg-slate-400',
        })}
      >
        <motion.span
          key={JSON.stringify(checked)}
          className={styles({
            _element: 'thumb',
            className: checked ? 'float-right' : 'float-left',
          })}
          transition={{ duration: 0.2 }}
          layoutId="thumb"
        />
      </button>
    </FormField>
  )
})

export { Switch }
