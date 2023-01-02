import { ComponentMeta, ComponentStory } from '@storybook/react'
import React, { useState } from 'react'

import { Button } from '../components/Button'
import { Drawer } from '../components/Drawer'

export default {
  title: 'Component/Drawer',
  component: Drawer,
  argTypes: {
    size: {
      control: {
        type: 'radio',
        options: ['small', 'medium', 'large'],
      },
    },
  },
} as ComponentMeta<typeof Drawer>

const Template: ComponentStory<typeof Drawer> = (args) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Drawer</Button>
      <Drawer
        {...args}
        open={open || args.open}
        onClose={() => setOpen(false)}
      />
    </>
  )
}

export const Default = Template.bind({})
Default.args = {
  open: false,
  title: 'Drawer Stories',
} as React.ComponentProps<typeof Drawer>
