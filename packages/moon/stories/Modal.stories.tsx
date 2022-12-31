import { ComponentMeta, ComponentStory } from '@storybook/react'
import React, { useState } from 'react'

import { Button } from '../components/Button'
import { Modal } from '../components/Modal'

export default {
  title: 'Component/Modal',
  component: Modal,
  argTypes: {
    size: {
      control: {
        type: 'radio',
        options: ['small', 'medium', 'large'],
      },
    },
  },
} as ComponentMeta<typeof Modal>

const Template: ComponentStory<typeof Modal> = (args) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <Modal {...args} open={open} onClose={() => setOpen(false)} />
    </>
  )
}

export const Default = Template.bind({})
Default.args = {
  size: 'medium',
  title: 'Hello',
  iconClosable: true,
  maskClosable: true,
} as React.ComponentProps<typeof Modal>
