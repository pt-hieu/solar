module.exports = {
  framework: '@storybook/react',
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  addons: ['@storybook/addon-a11y', '@storybook/addon-essentials'],
  core: {
    builder: '@storybook/builder-vite',
    disableTelemetry: true,
  },
  viteFinal: (config) => {
    return config
  },
}
