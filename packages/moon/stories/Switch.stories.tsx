import { ComponentMeta, ComponentStory } from '@storybook/react'
import React, { ComponentProps } from 'react'

import { Form } from '../components/Form'
import { Switch } from '../components/Switch'

export default {
  title: 'Component/Switch',
  component: Switch,
} as ComponentMeta<typeof Switch>

const Template: ComponentStory<typeof Switch> = (args) => {
  return (
    <Form>
      <Switch {...args} />
    </Form>
  )
}

export const Default = Template.bind({})
Default.args = {
  label: 'Switch',
} as ComponentProps<typeof Switch>
