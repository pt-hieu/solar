import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { Form } from '../components/Form'
import { TagInput } from '../components/TagInput'

export default {
  title: 'Component/TagInput',
  component: TagInput,
} as ComponentMeta<typeof TagInput>

const Template: ComponentStory<typeof TagInput> = (args) => {
  return (
    <Form>
      <TagInput {...args} />
    </Form>
  )
}

export const Default = Template.bind({})
Default.args = {
  label: 'Tags',
  name: 'tag',
} as React.ComponentProps<typeof TagInput>
