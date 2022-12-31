import { VariantProps, cva } from 'class-variance-authority'
import FocusTrap from 'focus-trap-react'
import { AnimatePresence, motion } from 'framer-motion'
import { FC, PropsWithChildren } from 'react'
import { createPortal } from 'react-dom'

import { Button } from './Button'

const styles = cva([], {
  variants: {
    _element: {
      root: [
        'h-screen w-screen grid place-content-center absolute top-0 left-0',
      ],
      mask: ['h-screen w-screen absolute top-0 left-0 bg-black/30'],
      modal: [
        'max-w-[calc(100vw-64px)] max-h-[calc(100vh-64px)]',
        'bg-white z-[1] rounded-[3px] border p-4 px-8',
        'grid grid-rows-[40px,12px,1fr,12px,40px]',
      ],
      header: ['flex items-center justify-between'],
      body: [''],
      footer: ['flex gap-2 justify-end items-center'],
    },
    size: {
      small: ['w-[416px] min-h-[312px]'],
      medium: ['w-[760px] min-h-[570px]'],
      large: ['w-[1080px] min-h-[810px]'],
    },
    centerFooter: {
      true: ['justify-center'],
    },
  },
})

type CloseSource = 'mask' | 'close-icon' | 'cancel-button'

type Props = {
  open?: boolean
  onClose?: (source: CloseSource) => void | Promise<void>

  title?: string

  maskClosable?: boolean
  iconClosable?: boolean
} & Omit<VariantProps<typeof styles>, `_${string}`>

const Modal: FC<PropsWithChildren<Props>> = function ({
  children,
  title,
  size = 'medium',
  onClose,
  open,
  centerFooter,
  maskClosable = true,
  iconClosable = true,
}) {
  return createPortal(
    <FocusTrap paused={!open}>
      <AnimatePresence>
        {open && (
          <div className={styles({ _element: 'root' })}>
            <motion.div
              className={styles({ _element: 'mask' })}
              onClick={() => maskClosable && onClose?.('mask')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 0 }}
              transition={{ duration: 0.15 }}
              className={styles({ _element: 'modal', size })}
            >
              <div className={styles({ _element: 'header' })}>
                <div className="font-medium text-lg">{title}</div>

                {iconClosable && (
                  <Button
                    onClick={() => onClose?.('close-icon')}
                    intent="ghost"
                    icon="fa fa-times"
                  />
                )}
              </div>

              <div />
              <div className={styles({ _element: 'body' })}>{children}</div>
              <div />

              <div className={styles({ _element: 'footer', centerFooter })}>
                <Button
                  onClick={() => onClose?.('cancel-button')}
                  intent="ghost"
                >
                  Cancel
                </Button>

                <Button intent="primary">Confirm</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </FocusTrap>,
    document.querySelector('body')!,
  )
}

export { Modal }
