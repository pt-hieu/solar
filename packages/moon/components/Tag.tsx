import { VariantProps, cva } from 'class-variance-authority'
import { PropsWithChildren, forwardRef } from 'react'

const styles = cva([], {
  variants: {
    _element: {
      root: ['rounded-[3px] px-2 py-1 cursor-default text-white'],
      closeIcon: ['fa fa-times mr-2 text-sm'],
      closeButton: ['relative top-[0.5px]'],
    },
    color: {
      primary: 'bg-sky-500',
      danger: 'bg-rose-500',
      warning: 'bg-amber-400',
      success: 'bg-emerald-500',
      trivial: 'bg-slate-500',
    },
    outlined: {
      primary: 'text-sky-500 ring-1 ring-sky-500 bg-transparent',
      danger: 'text-rose-500 ring-1 ring-rose-500 bg-transparent',
      warning: 'text-amber-500 ring-1 ring-amber-500 bg-transparent',
      success: 'text-emerald-500 ring-1 ring-emerald-500 bg-transparent',
      trivial: 'text-slate-500 ring-1 ring-slate-500 bg-transparent',
    },
  },
})

type PrimitiveVariants = Omit<VariantProps<typeof styles>, `_${string}`>

type ColorVariant = NonNullable<PrimitiveVariants['color']>
type OutlinedVariant = NonNullable<PrimitiveVariants['outlined']>

type Variants = PrimitiveVariants &
  (
    | { color: ColorVariant; outlined?: never }
    | { color?: never; outlined: OutlinedVariant }
  )

type TagCloseProps =
  | { closable: true; disabled?: boolean; onClose: () => void | Promise<void> }
  | { closable?: false; disabled?: never; onClose?: never }

type Props = {} & TagCloseProps & Variants

export const Tag = forwardRef<HTMLSpanElement, PropsWithChildren<Props>>(
  function (
    { children, closable, onClose, disabled, color = 'primary', outlined },
    ref,
  ) {
    return (
      <span className={styles({ _element: 'root', color, outlined })} ref={ref}>
        {closable && (
          <button
            className={styles({ _element: 'closeButton' })}
            onClick={onClose}
            disabled={disabled}
          >
            <span className={styles({ _element: 'closeIcon' })} />
          </button>
        )}

        {children}
      </span>
    )
  },
)
