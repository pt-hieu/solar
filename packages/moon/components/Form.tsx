import { yupResolver } from '@hookform/resolvers/yup'
import { PropsWithChildren, useCallback } from 'react'
import {
  DeepPartial,
  DeepRequired,
  FieldErrorsImpl,
  FormProvider,
  useForm,
} from 'react-hook-form'
import * as yup from 'yup'
import { ObjectShape } from 'yup/lib/object'

type Props<T> = {
  schema?: yup.ObjectSchema<ObjectShape>
  default?: DeepPartial<T>
  onSubmit?: (
    data:
      | { success: true; value: T }
      | {
          success: false
          value: Partial<FieldErrorsImpl<DeepRequired<T>>>
        },
  ) => void
}

export const Form = <T extends Record<string, any>>({
  schema,
  default: defaultValues,
  children,
  onSubmit,
}: PropsWithChildren<Props<T>>) => {
  const form = useForm<T>({
    ...(!!schema && { resolver: yupResolver(schema) }),
    defaultValues,
  })

  const handleSubmit = useCallback(
    form.handleSubmit(
      (data) => {
        onSubmit?.({ success: true, value: data })
      },
      (e) => {
        onSubmit?.({ success: false, value: e })
      },
    ),
    [onSubmit],
  )

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit}>{children}</form>
    </FormProvider>
  )
}
