import { ComponentMeta, ComponentStory } from '@storybook/react'
import React, { ComponentProps } from 'react'

import { FormField } from '../private/FormField'

export default {
  component: FormField,
  title: 'Internal/FormField',
  argTypes: {
    layout: {
      control: {
        type: 'radio',
        options: ['row', 'column'],
      },
    },
  },
} as ComponentMeta<typeof FormField>

const Template: ComponentStory<typeof FormField> = (args) => {
  return <FormField {...args}></FormField>
}

export const Default = Template.bind({})
Default.args = {
  layout: 'row',
  label: 'Field',
  hasError: false,
  required: false,
} as ComponentProps<typeof FormField>
