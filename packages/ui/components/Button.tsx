import { VariantProps, cva } from 'class-variance-authority'
import { MouseEvent, PropsWithChildren } from 'react'

const styles = cva(['rounded-md', 'duration-100', 'focus:scale-95'], {
  variants: {
    intent: {
      primary: ['bg-sky-500', 'hover:bg-sky-400', 'text-white'],
      outline: [
        'ring-1',
        'text-sky-500',
        'ring-sky-500',
        'hover:border-sky-400',
        'hover:text-sky-400',
      ],
      danger: ['bg-rose-500', 'hover:bg-rose-400', 'text-white'],
      ghost: ['text-sky-500', 'hover:text-sky-400', 'hover:bg-slate-100'],
    },
    disabled: {
      true: ['text-white', 'bg-slate-500', 'hover:bg-slate-500'],
    },
    disabledGhost: {
      true: ['text-slate-500', 'bg-transparent', 'hover:bg-transparent'],
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
})

type Props = {
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void | Promise<void>
  className?: string
  icon?: `fa fa-${string}`
} & Omit<VariantProps<typeof styles>, 'disabledGhost'>

export const Button = ({
  intent,
  children,
  disabled,
  className,
  size,
  icon,
  loading,
  onClick,
}: PropsWithChildren<Props>) => {
  const isDisabled = disabled || loading
  const disabledGhost = isDisabled && intent === 'ghost'

  return (
    <button
      className={styles({
        intent: isDisabled ? undefined : intent,
        disabled: disabledGhost ? undefined : isDisabled,
        className,
        size,
        disabledGhost,
      })}
      disabled={isDisabled || undefined}
      onClick={onClick}
    >
      {icon && !loading ? (
        <span className={`${icon} mr-2 translate-y-[0.5px]`} />
      ) : null}

      {loading ? (
        <span
          // @ts-ignore
          style={{ '--fa-animation-timing': 'ease-in-out' }}
          className="fa-solid fa-circle-notch fa-spin mr-2 relative top-[0.5px]"
        />
      ) : null}

      {children}
    </button>
  )
}
