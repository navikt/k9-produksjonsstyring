module.exports = function (api) {
	// eslint-disable-next-line no-unused-expressions
	api ? api.cache(true) : null;

	return {
		presets: [
			'@babel/react',
			[
				'@babel/preset-env',
				{
					targets: { node: 'current', esmodules: true },
				},
			],
			'@babel/typescript',
		],
	};
};
