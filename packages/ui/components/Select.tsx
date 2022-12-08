import { VariantProps, cva } from 'class-variance-authority'
import { AnimatePresence, motion } from 'framer-motion'
import { ForwardedRef, forwardRef, useCallback, useState } from 'react'
import { FieldPath, useFormContext, useFormState } from 'react-hook-form'

import { styles as inputStyles } from './Input'

import { handleForwardRef } from '../helpers/ref'

const styles = cva([], {
  variants: {
    _focus: {
      true: ['!ring-sky-500'],
    },
    _element: {
      'option-container':
        'py-2 bg-white w-full ring-1 ring-sky-500 rounded-[3px] shadow-md',
      'option-item': 'px-3 py-1 hover:bg-sky-500 hover:text-white',
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
  options: Option[]
  placeholder?: string
  required?: boolean
  multiple?: boolean
} & Omit<VariantProps<typeof styles>, `_${string}`> &
  Pick<VariantProps<typeof inputStyles>, 'layout'>

export const Select = forwardRef(function <
  T extends Record<string, any> = Record<string, any>,
>(
  {
    label,
    placeholder,
    name,
    options,
    layout = 'row',
    required,
    multiple,
  }: Props<T>,
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

  const parsedOptions = options.map((o) => {
    if (typeof o === 'string') return { label: o, value: o }
    return o
  })

  const [isOpened, setIsOpened] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<
    Extract<Option, { label: string }>[]
  >(() => {
    const initValue = defaultValues?.[name]
    if (!initValue) return []

    return parsedOptions.filter((option) => option.value === initValue)
  })

  const selectItem = useCallback(
    (inputOption: Extract<Option, { label: string }>) => () => {
      if (multiple) {
        setSelectedOptions((selectedOptions) => {
          let results = [...selectedOptions]

          if (!selectedOptions.some((opt) => opt.value === inputOption.value))
            results.push(inputOption)
          else
            results = results.filter((opt) => opt.value !== inputOption.value)

          setValue(name, results.map((r) => r.value) as any)

          return results
        })

        return
      }

      setSelectedOptions([inputOption])
      setValue(name, inputOption.value as any)
    },
    [name, multiple],
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
            _element: 'input',
            className: 'cursor-pointer relative',
          }),
        })}
      >
        {selectedOptions.map((o) => o.label).join(', ')}
        {!selectedOptions.length && placeholder && (
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
                _element: 'option-container',
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
              {parsedOptions.map(({ label, value }) => (
                <div
                  onClick={selectItem({ label, value })}
                  className={styles({
                    _element: 'option-item',
                  })}
                  key={value}
                >
                  {multiple && (
                    <span
                      className={`fa fa-check mr-2 text-xs ${
                        selectedOptions.some((opt) => opt.value === value)
                          ? 'visible'
                          : 'invisible'
                      }`}
                    />
                  )}
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
