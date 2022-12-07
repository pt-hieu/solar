import { ComponentMeta, ComponentStory } from '@storybook/react'
import React, { ComponentProps, useState } from 'react'

import { Button } from '../components/Button'
import { Form } from '../components/Form'
import { Select } from '../components/Select'

export default {
  component: Select,
} as ComponentMeta<typeof Select>

const Template: ComponentStory<typeof Select> = (args) => {
  const [v, setV] = useState('')

  return (
    <Form
      onSubmit={({ success, value }) => {
        if (success) setV(JSON.stringify(value))
      }}
    >
      <Select {...args} />
      <br />
      <Button type="submit">Submit</Button>
      <div>{v}</div>
    </Form>
  )
}

export const Default = Template.bind({})
Default.args = {
  label: 'Value',
  name: 'value',
  placeholder: 'Placeholder',
  layout: 'row',
  options: [
    'Option 1',
    'Option 2',
    { label: 'labeled Option 3', value: 'Option 3' },
  ],
} as ComponentProps<typeof Select>
