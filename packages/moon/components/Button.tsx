import { VariantProps, cva } from 'class-variance-authority'
import { AnimatePresence, motion } from 'framer-motion'
import { MouseEvent, PropsWithChildren } from 'react'

const styles = cva(
  ['rounded-[3px]', 'duration-100', 'focus-visible:outline-none'],
  {
    variants: {
      intent: {
        primary: [
          'bg-sky-500',
          'hover:bg-sky-400 focus-visible:bg-sky-400',
          'text-white',
        ],
        outline: [
          'ring-1',
          'text-sky-500',
          'ring-sky-500',
          'hover:text-sky-400 hover:ring-sky-400',
          'focus-visible:text-sky-400 focus-visible:ring-sky-400',
        ],
        danger: [
          'bg-rose-500',
          'hover:bg-rose-400 focus-visible:bg-rose-400',
          'text-white',
        ],
        ghost: [
          'text-sky-500',
          'hover:text-sky-400 focus-visible:text-sky-400',
          'hover:bg-slate-100 focus-visible:bg-slate-100',
        ],
      },
      disabled: {
        true: [
          'text-white',
          'bg-slate-500',
          'hover:bg-slate-500',
          'focus-visible:bg-slate-500',
        ],
      },
      _disabledGhost: {
        true: [
          'text-slate-500',
          'bg-transparent',
          'hover:bg-transparent',
          'focus-visible:bg-transparent',
        ],
      },
      loading: {
        true: [],
      },
      size: {
        normal: ['px-3', 'py-2'],
        compact: ['px-3', 'py-1'],
      },
    },
    defaultVariants: {
      intent: 'primary',
      size: 'normal',
    },
  },
)

type Props = {
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void | Promise<void>
  className?: string
  icon?: `fa fa-${string}`
  type?: 'button' | 'submit' | 'reset'
} & Omit<VariantProps<typeof styles>, `_${string}`>

export const Button = ({
  intent,
  children,
  disabled,
  type,
  className,
  size,
  icon,
  loading,
  onClick,
}: PropsWithChildren<Props>) => {
  const isDisabled = disabled || loading
  const disabledGhost = isDisabled && intent === 'ghost'

  return (
    <motion.button
      className={styles({
        intent: isDisabled ? undefined : intent,
        disabled: disabledGhost ? undefined : isDisabled,
        className,
        size,
        _disabledGhost: disabledGhost,
      })}
      disabled={isDisabled || undefined}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      type={type}
    >
      <AnimatePresence mode="wait" initial={false}>
        {icon || loading ? (
          <motion.span
            // @ts-ignore
            style={{ '--fa-animation-timing': 'ease-in-out' }}
            className={`${
              loading ? 'fa-solid fa-circle-notch fa-spin' : icon
            } relative ${children ? 'top-[0.5px] mr-2' : 'top-[2px]'}`}
            key={loading ? 'loading' : 'not-loading'}
            initial={{ maxWidth: '0px', opacity: 0 }}
            animate={{ maxWidth: '30px', opacity: 1 }}
            exit={{ maxWidth: '0px', opacity: 0 }}
            transition={{ ease: 'linear' }}
          />
        ) : null}
      </AnimatePresence>

      {children}
    </motion.button>
  )
}
