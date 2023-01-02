import { VariantProps, cva } from 'class-variance-authority'
import FocusTrap from 'focus-trap-react'
import { AnimatePresence, motion } from 'framer-motion'
import { PropsWithChildren, forwardRef, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useClickAway } from 'react-use'

import { Button } from './Button'

import { mergeRefs } from '../helpers/ref'

const styles = cva([], {
  variants: {
    _element: {
      root: ['h-screen w-screen absolute top-0 left-0 overflow-hidden'],
      container: [
        'h-screen bg-white border-l absolute right-0 p-4 grid grid-rows-[34px,1fr] gap-4',
      ],
      header: ['flex items-center justify-between'],
      body: ['overflow-x-hidden overflow-y-auto'],
    },
    size: {
      small: 'w-[350px]',
      medium: 'w-[450px]',
      large: 'w-[550px]',
    },
  },
})

type CloseSource = 'close-icon' | 'click-away'

type Props = {
  open: boolean
  onClose?: (source: CloseSource) => void
  title?: string
} & Omit<VariantProps<typeof styles>, `_${string}`>

const Drawer = forwardRef<HTMLDivElement, PropsWithChildren<Props>>(
  ({ open, onClose, size = 'small', title }, ref) => {
    const internalRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    useClickAway(containerRef, (e) => {
      onClose?.('click-away')
    })

    return createPortal(
      <FocusTrap paused={!open}>
        <AnimatePresence>
          {open && (
            <div
              className={styles({ _element: 'root' })}
              ref={mergeRefs([internalRef, ref])}
            >
              <motion.div
                ref={containerRef}
                className={styles({ _element: 'container', size })}
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: '0', opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              >
                <div className={styles({ _element: 'header' })}>
                  <div className="font-medium text-lg">{title}</div>

                  <Button
                    onClick={() => onClose?.('close-icon')}
                    intent="ghost"
                    icon="fa fa-times"
                    size="compact"
                    rounded
                  />
                </div>

                <div className={styles({ _element: 'body' })}></div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </FocusTrap>,
      document.querySelector('body')!,
    )
  },
)

export { Drawer }
