import { VariantProps, cva } from 'class-variance-authority'
import { AnimatePresence, motion } from 'framer-motion'
import { ForwardedRef, forwardRef, useCallback, useState } from 'react'
import { FieldPath, useFormContext, useFormState } from 'react-hook-form'

import { styles as inputStyles } from './Input'

import { handleForwardRef } from '../helper/ref'

const styles = cva([], {
  variants: {
    _focus: {
      true: ['!ring-sky-500'],
    },
    _optionContainer: {
      true: 'py-2 bg-white w-full ring-1 ring-sky-500 rounded-[3px] shadow-md',
    },
    _optionItem: {
      true: 'px-3 py-1 hover:bg-sky-500 hover:text-white',
    },
  },
})

const caretStyle = cva(
  ['fa', 'fa-caret-down', 'w-fit', 'absolute', 'top-[12px]', 'right-4'],
  {
    variants: {
      active: {
        true: 'text-sky-500',
        false: 'text-slate-500',
      },
    },
  },
)

type Option =
  | {
      label: string
      value: string
    }
  | string

type Props<T extends Record<string, any>> = {
  label: string
  name: FieldPath<T>
  placeholder?: string
  required?: boolean
  options: Option[]
} & Omit<VariantProps<typeof styles>, `_${string}`> &
  Pick<VariantProps<typeof inputStyles>, 'layout'>

export const Select = forwardRef(function <
  T extends Record<string, any> = Record<string, any>,
>(
  { label, placeholder, name, options, layout = 'row', required }: Props<T>,
  propsRef: ForwardedRef<HTMLInputElement>,
) {
  const {
    formState: { defaultValues },
    register,
    setValue,
    control,
  } = useFormContext()
  const { ref, ...regis } = register(name)

  const { errors } = useFormState({ control })

  const error = errors[name]
  const hasError = !!error

  const [isOpened, setIsOpened] = useState(false)
  const [internalValue, setInternalValue] = useState(defaultValues?.[name])

  const parsedOptions = options.map((o) => {
    if (typeof o === 'string') return { label: o, value: o }
    return o
  })

  const onItemSelect = useCallback(
    ({ label, value }: { value: string; label: string }) =>
      () => {
        setInternalValue(label)
        setValue(name, value as any)
      },
    [name],
  )

  return (
    <div className={inputStyles({ layout })}>
      <input
        ref={(ele) => {
          ref(ele)
          handleForwardRef(propsRef, ele)
        }}
        type="text"
        hidden
        {...regis}
      />

      {label && (
        <label
          className={`${layout === 'row' ? 'mt-2' : ''} ${
            hasError ? 'text-rose-500' : ''
          }`}
          onClick={() => setIsOpened(true)}
        >
          {label}
          {required ? '*' : ''}
        </label>
      )}

      <div
        onClick={() => setIsOpened((o) => !o)}
        className={styles({
          _focus: isOpened,
          className: inputStyles({
            inputClassname: true,
            className: 'cursor-pointer relative',
          }),
        })}
      >
        {internalValue}
        {!internalValue && placeholder && (
          <span className="text-slate-500">{placeholder}</span>
        )}

        <motion.span
          initial={{ rotate: '0deg' }}
          animate={{ ...(isOpened && { rotate: '180deg' }) }}
          className={caretStyle({ active: isOpened })}
          style={{
            transformOrigin: 'center',
          }}
        />

        <AnimatePresence mode="wait">
          {isOpened && (
            <motion.div
              className={styles({
                _optionContainer: true,
                class: 'absolute top-[calc(100%+10px)] left-0',
              })}
              style={{ transformOrigin: 'bottom left' }}
              initial={{ maxHeight: '0px', opacity: 0 }}
              animate={{ maxHeight: '300px', opacity: 1 }}
              exit={{
                maxHeight: '0px',
                opacity: 0,
              }}
              transition={{ ease: 'linear', duration: 0.15 }}
            >
              {parsedOptions.map(({ label, value }, index) => (
                <div
                  onClick={onItemSelect({ label, value })}
                  className={styles({ _optionItem: true })}
                  key={value}
                >
                  {label}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
})
