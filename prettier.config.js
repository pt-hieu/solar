module.exports = {
  singleQuote: true,
  trailingComma: 'all',
  semi: false,
  bracketSpacing: true,
  importOrder: ['^ui(.*)$', '<THIRD_PARTY_MODULES>', '^./', '^../'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderParserPlugins: ['decorators-legacy', 'typescript', 'jsx'],
  plugins: [require('@trivago/prettier-plugin-sort-imports')],
};