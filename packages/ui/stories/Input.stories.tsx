import { yupResolver } from '@hookform/resolvers/yup'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import * as yup from 'yup'

import { Input } from '../components/Input'

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
const schema = yup.object().shape({
  value: yup.string().required('$$ is required'),
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
