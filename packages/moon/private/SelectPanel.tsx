import { VariantProps, cva } from 'class-variance-authority'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ForwardedRef,
  forwardRef,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react'
import { useKey } from 'react-use'

const styles = cva([], {
  variants: {
    _element: {
      root: [
        'py-2 bg-white w-full ring-1 ring-sky-500 rounded-[3px] shadow-md',
      ],
      item: ['px-3 py-1 hover:bg-sky-500 hover:text-white'],
    },
    active: {
      true: ['bg-sky-500 text-white'],
    },
  },
})

type Option = {
  label: string
  value: string
}

type Props = {
  options: Option[]
  selectedOptions: Option[]
  onItemSelect?: (item: Option) => () => void | Promise<void>
  open?: boolean
  multiple?: boolean
} & Omit<VariantProps<typeof styles>, `_${string}`>

export const SelectPanel = forwardRef(function (
  { options, selectedOptions, onItemSelect: selectItem, open, multiple }: Props,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const [activeIndex, setActiveIndex] = useState<number>()

  useLayoutEffect(() => {
    if (!open) return
    setActiveIndex(undefined)
  }, [open])

  useKey(
    'Enter',
    () => {
      if (!open) return
      if (activeIndex === undefined) return

      selectItem?.(options[activeIndex])()
    },
    {},
    [open, options, activeIndex],
  )

  useKey(
    'ArrowDown',
    () => {
      if (!open) return

      setActiveIndex((index) => {
        if (index === undefined) return 0
        return (index + 1) % options.length
      })
    },
    {},
    [open, options.length],
  )

  useKey(
    'ArrowUp',
    () => {
      if (!open) return

      setActiveIndex((index) => {
        if (index === undefined) return options.length - 1
        if (index - 1 === -1) return options.length - 1

        return (index || 0) - 1
      })
    },
    {},
    [open, options.length],
  )

  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          ref={ref}
          className={styles({
            _element: 'root',
            class: 'absolute top-[calc(100%+10px)] left-0 overflow-hidden',
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
          {options.map(({ value, label }, index) => (
            <div
              className={styles({
                _element: 'item',
                active: index === activeIndex,
              })}
              key={value}
              onClick={selectItem?.({ label, value })}
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
  )
})
