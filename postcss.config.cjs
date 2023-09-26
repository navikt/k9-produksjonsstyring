const autoprefixer = require('autoprefixer');
const postcssImport = require('postcss-import');
const tailwindcss = require('tailwindcss');

module.exports = {
	plugins: [postcssImport, tailwindcss('./tailwind.config.cjs'), autoprefixer],
};
