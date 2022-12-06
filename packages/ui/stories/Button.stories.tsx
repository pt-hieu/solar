import { ComponentMeta, ComponentStory } from '@storybook/react'
import * as React from 'react'

import { Button } from '../components/Button'

export default {
  component: Button,
  argTypes: {
    intent: {
      control: {
        type: 'radio',
        options: ['primary', 'outline', 'danger', 'ghost'],
      },
    },
    size: {
      control: {
        type: 'radio',
        options: ['normal', 'compact'],
      },
    },
    loading: {
      control: {
        type: 'boolean',
      },
    },
  },
} as ComponentMeta<typeof Button>

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />

export const Default = Template.bind({})
Default.args = {
  intent: 'primary',
  disabled: false,
  loading: false,
  icon: 'fa fa-home',
  size: 'normal',
  children: 'Boop',
}
