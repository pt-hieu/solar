import * as yup from 'yup'

export const createSchema = <T extends Record<string, any>>(
  shape: Record<keyof T, yup.AnySchema>,
) => {
  return yup.object().shape(shape)
}

export const string = () => yup.string()
type StringSchema = ReturnType<typeof string>

export const stringType = (v: StringSchema) =>
  v.typeError('$$ is not a valid string')
export const required = (v: StringSchema) =>
  v.required('$$ is required') as StringSchema

export const pipe =
  <T extends yup.AnySchema<any, any, any> = StringSchema>(
    ...fns: Array<(v: T) => T>
  ) =>
  (value: T) =>
    fns.reduce((v, f) => f(v), value)
