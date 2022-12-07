import { ForwardedRef } from 'react'

declare module 'react' {
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null,
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null
}

export const handleForwardRef = <T>(ref: ForwardedRef<T>, ele: T) => {
  if (!ref) return

  if (typeof ref === 'object') {
    ref.current = ele
  }

  if (typeof ref === 'function') {
    ref(ele)
  }
}
