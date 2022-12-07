import { yupResolver } from '@hookform/resolvers/yup'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { Input } from '../components/Input'
import { createSchema, pipe, required, string } from '../helpers/form'

export default {
  component: Input,
  argTypes: {
    type: {
      control: {
        type: 'radio',
        options: ['text', 'number', 'datetime-local'],
      },
    },
    layout: {
      control: {
        type: 'radio',
        options: ['row', 'column'],
      },
    },
  },
} as ComponentMeta<typeof Input>

type FormData = { value: string }
const schema = createSchema<FormData>({
  value: pipe(required)(string()),
})

const Template: ComponentStory<typeof Input<FormData>> = (args) => {
  const form = useForm<FormData>({
    resolver: yupResolver(schema),
  })

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(() => {})}>
        <Input<FormData> {...args} />

        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  )
}

export const Default = Template.bind({})
Default.args = {
  type: 'text',
  label: 'Value',
  required: false,
  name: 'value',
}
