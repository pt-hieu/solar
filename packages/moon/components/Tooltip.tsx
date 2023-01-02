import { VariantProps, cva } from 'class-variance-authority'
import { Variants, motion, useAnimationControls } from 'framer-motion'
import {
  ComponentProps,
  ElementType,
  PropsWithChildren,
  Ref,
  forwardRef,
  useRef,
} from 'react'
import { useAsync, useHoverDirty } from 'react-use'

import { mergeRefs } from '../helpers/ref'

const styles = cva([], {
  variants: {
    _element: {
      root: 'relative inline-block',
      popover: [
        'absolute w-max max-w-[200px] p-2 px-4 bg-sky-500',
        'rounded-[3px] text-white text-sm ',
        '-top-[calc(100%+4px)] left-1/2 -translate-x-1/2',
      ],
      anchor: [
        'bg-sky-500',
        'w-[10px]',
        'h-[4px]',
        'absolute bottom-[-4px] left-1/2 -translate-x-1/2',
      ],
    },
  },
})

const variants: Variants = {
  visible: { opacity: 1, scale: 1, x: '-50%' },
  hidden: { opacity: 0, scale: 0.8, x: '-50%' },
}

const TooltipDefaultAsType = 'div' as const
type TooltipDefaultAsType = typeof TooltipDefaultAsType

type BaseProps = {
  as?: ElementType
  message: string
  showTooltip?: boolean
} & Omit<VariantProps<typeof styles>, `_${string}`>

type Props<E extends ElementType = TooltipDefaultAsType> = BaseProps &
  Omit<ComponentProps<E>, keyof BaseProps>

export const Tooltip = forwardRef(function <
  R extends HTMLElement,
  E extends ElementType = TooltipDefaultAsType,
>(
  {
    as,
    children,
    message,
    showTooltip,
    ...restProps
  }: PropsWithChildren<Props<E>>,
  ref: Ref<R>,
) {
  const Tag = as || 'div'

  const rootRef = useRef<R>(null)
  const isControlled = typeof showTooltip === 'boolean'
  const isHovered = useHoverDirty(rootRef, !isControlled)

  const control = useAnimationControls()

  useAsync(async () => {
    if (isHovered || (isControlled && showTooltip)) {
      control.set({ visibility: 'unset' })
      control.start('visible')

      return
    }

    await control.start('hidden')
    control.set({ visibility: 'hidden' })
  }, [isHovered || (isControlled && showTooltip)])

  return (
    <Tag
      {...restProps}
      className={styles({ _element: 'root', className: restProps.className })}
      ref={mergeRefs(ref, rootRef)}
    >
      {children}

      <motion.div
        initial={{ x: '-50%', visibility: 'hidden' }}
        variants={variants}
        animate={control}
        transition={{ duration: 0.25 }}
        className={styles({ _element: 'popover' })}
        style={{ transformOrigin: '50% 100%' }}
      >
        {message}

        <div
          className={styles({ _element: 'anchor' })}
          style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }}
        />
      </motion.div>
    </Tag>
  )
})
