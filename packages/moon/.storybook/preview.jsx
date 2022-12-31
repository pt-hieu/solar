import './tailwind.css'

/** @type {import('@storybook/react').Parameters} */
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

/** @type {Array<import('@storybook/react').DecoratorFn>} */
export const decorators = [(Story) => <Story />]
