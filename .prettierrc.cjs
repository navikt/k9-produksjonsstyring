module.exports = {
	htmlWhitespaceSensitivity: 'css',
	printWidth: 120,
	proseWrap: 'preserve',
	requirePragma: false,
	singleQuote: true,
	useTabs: true,
	importOrder: ['^react', '<THIRD_PARTY_MODULES>', '^@navikt/(.*)$', '^[../]', '^[./]'],
	importOrderSortSpecifiers: true,
	plugins: ['@trivago/prettier-plugin-sort-imports'],
};
