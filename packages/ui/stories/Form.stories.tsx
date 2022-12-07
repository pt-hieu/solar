import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { Button } from '../components/Button'
import { Form } from '../components/Form'
import { Input } from '../components/Input'
import { createSchema, pipe, required, string } from '../helper/form'

export default {
  component: Form,
} as ComponentMeta<typeof Form>

const schema = createSchema({
  value: pipe(required)(string()),
})

const Template: ComponentStory<typeof Form> = (args) => {
  return (
    <Form schema={schema} default={{ value: 'hehe' }} {...args}>
      <Input layout="column" label="Value" name="value" />
      <Button type="submit">Submit</Button>
    </Form>
  )
}

export const Default = Template.bind({})

Default.args = {}
