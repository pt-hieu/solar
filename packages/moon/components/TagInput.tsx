import { VariantProps, cva } from 'class-variance-authority'
import {
  ComponentProps,
  forwardRef,
  useCallback,
  useId,
  useRef,
  useState,
} from 'react'
import { FieldPath, useFormContext, useFormState } from 'react-hook-form'
import { useKey } from 'react-use'

import { Tag } from './Tag'

import { styles as inputStyles } from '../components/Input'
import { mergeRefs } from '../helpers/ref'
import { FormField } from '../private/FormField'

const styles = cva([], {
  variants: {
    _focus: {
      true: ['!ring-sky-500'],
    },
    _element: {
      internalInput: ['outline-none border-none p-0 focus:ring-0', 'w-full'],
    },
  },
})

type Props<T extends Record<string, any>> = {
  name: FieldPath<T>
} & Pick<ComponentProps<typeof FormField>, 'label' | 'layout' | 'required'> &
  Omit<VariantProps<typeof styles>, `_${string}`>

export const TagInput = forwardRef(function <
  T extends Record<string, any> = Record<string, any>,
>({ label, layout, required, name }: Props<T>) {
  const id = useId()

  const internalInput = useRef<HTMLInputElement>(null)

  const { register, control, watch, setValue } = useFormContext<T>()
  const { ref: formRef, ...regis } = register(name)

  const { errors } = useFormState({ control })

  const [isFocused, setIsFocused] = useState(false)
  const tags = watch(name) as Array<string>

  useKey(
    'Enter',
    () => {
      if (!isFocused) return
      if (!internalInput.current) return

      setValue(name, [...tags, internalInput.current.value] as any)
      internalInput.current.value = ''
    },
    {},
    [isFocused, tags?.length],
  )

  useKey(
    'Backspace',
    () => {
      if (!isFocused) return
      if (internalInput.current?.value) return

      const array = [...tags]
      array.pop()

      setValue(name, array as any)
    },
    {},
    [isFocused, tags?.length],
  )

  const removeTag = useCallback(
    (tag?: string) => () => {
      setValue(name, tags.filter((t) => t !== tag) as any)
    },
    [tags?.length, name],
  )

  return (
    <FormField
      label={label}
      error={errors[name]}
      id={id}
      layout={layout}
      required={required}
    >
      <input type="hidden" {...regis} ref={mergeRefs([formRef])} />
      <div
        tabIndex={0}
        onClick={() => internalInput.current?.focus()}
        onFocus={() => internalInput.current?.focus()}
        className={styles({
          _focus: isFocused,
          className: inputStyles({
            _element: 'input',
            className:
              'relative focus-visible:ring-sky-500 focus-visible:outline-none group cursor-text flex gap-2',
          }),
        })}
      >
        {tags?.map?.((tag, index) => (
          <Tag size="small" closable onClose={removeTag(tag)} key={index}>
            {tag}
          </Tag>
        ))}

        <input
          ref={internalInput}
          tabIndex={0}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={styles({ _element: 'internalInput' })}
          type="text"
        />
      </div>
    </FormField>
  )
})
