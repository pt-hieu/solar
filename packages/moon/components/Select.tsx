import { VariantProps, cva } from 'class-variance-authority'
import { motion } from 'framer-motion'
import {
  ComponentProps,
  ForwardedRef,
  MouseEvent,
  forwardRef,
  useCallback,
  useRef,
  useState,
} from 'react'
import { FieldPath, useFormContext, useFormState } from 'react-hook-form'
import { useClickAway } from 'react-use'

import { styles as inputStyles } from './Input'

import { mergeRefs } from '../helpers/ref'
import { FormField } from '../private/FormField'
import { SelectPanel } from '../private/SelectPanel'

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
  Pick<ComponentProps<typeof FormField>, 'label' | 'layout' | 'required'>

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
    (inputOption: Extract<Option, { label: string }>) =>
      (e?: MouseEvent<HTMLDivElement>) => {
        if (multiple) {
          e?.stopPropagation()

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
        setIsOpened(false)
      },
    [name, multiple],
  )

  const fieldRef = useRef<HTMLDivElement>(null)
  useClickAway(
    fieldRef,
    useCallback(() => {
      setIsOpened(false)
    }, []),
  )

  const handleEnterHit = useCallback(
    (e: KeyboardEvent) => {
      if (e.key !== 'Enter') return
      if (isOpened) return

      setIsOpened(true)
    },
    [isOpened],
  )

  const handleInputFocus = useCallback(
    ({ isFocused }: { isFocused: boolean }) =>
      () => {
        if (isFocused) {
          document.addEventListener('keydown', handleEnterHit)
          return
        }

        setIsOpened(false)
        document.removeEventListener('keydown', handleEnterHit)
      },
    [],
  )

  return (
    <FormField
      label={label}
      ref={fieldRef}
      error={errors[name]}
      layout={layout}
      required={required}
      onLabelClick={() => setIsOpened(true)}
    >
      <input ref={mergeRefs(ref, propsRef)} type="text" hidden {...regis} />

      <div
        tabIndex={0}
        onFocus={handleInputFocus({ isFocused: true })}
        onBlur={handleInputFocus({ isFocused: false })}
        onClick={() => setIsOpened((o) => !o)}
        className={styles({
          _focus: isOpened,
          className: inputStyles({
            _element: 'input',
            className:
              'cursor-pointer relative focus-visible:ring-sky-500 focus-visible:outline-none group',
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
          className={caretStyle({
            active: isOpened,
            className: 'group-focus-visible:text-sky-500',
          })}
          style={{
            transformOrigin: 'center',
          }}
        />

        <SelectPanel
          options={parsedOptions}
          selectedOptions={selectedOptions}
          multiple={multiple}
          onItemSelect={selectItem}
          open={isOpened}
        />
      </div>
    </FormField>
  )
})
