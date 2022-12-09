import { ComponentMeta, ComponentStory } from '@storybook/react'
import React, { ComponentProps } from 'react'

import { Button } from '../components/Button'
import { Tooltip } from '../components/Tooltip'

export default {
  title: 'Component/Tooltip',
  component: Tooltip,
  argTypes: {
    showTooltip: {
      control: {
        type: 'radio',
        options: [true, false, undefined],
      },
    },
  },
} as ComponentMeta<typeof Tooltip>

const Template: ComponentStory<typeof Tooltip> = (args) => {
  return (
    /* @ts-ignore */
    <Tooltip {...args} className="mt-10">
      <Button intent="ghost">Hover me</Button>
    </Tooltip>
  )
}

export const Default = Template.bind({})
Default.args = {
  as: 'span',
  message: 'Hello world!',
  showTooltip: undefined,
} as ComponentProps<typeof Tooltip>
