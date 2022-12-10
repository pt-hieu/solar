import { ComponentMeta, ComponentStory } from '@storybook/react'
import React, { ComponentProps } from 'react'

import { Tag } from '../components/Tag'

export default {
  title: 'Component/Tag',
  component: Tag,
  argTypes: {
    color: {
      control: {
        type: 'select',
        options: [
          'primary',
          'danger',
          'warning',
          'success',
          'trivial',
          undefined,
        ],
      },
    },
    outlined: {
      control: {
        type: 'select',
        options: [
          'primary',
          'danger',
          'warning',
          'success',
          'trivial',
          undefined,
        ],
      },
    },
  },
} as ComponentMeta<typeof Tag>

const Template: ComponentStory<typeof Tag> = (args) => {
  return <Tag {...args}>Hello world!</Tag>
}

export const Default = Template.bind({})
Default.args = {
  color: 'primary',
  outlined: undefined,
  closable: true,
  disabled: false,
} as ComponentProps<typeof Tag>
