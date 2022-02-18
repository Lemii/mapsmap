const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const WebpackBar = require('webpackbar');
const CracoAntDesignPlugin = require('craco-antd');
const path = require('path');

module.exports = {
	webpack: {
		plugins: [
			new WebpackBar({ profile: true }),
			...(process.env.NODE_ENV === 'development' ? [new BundleAnalyzerPlugin({ openAnalyzer: false })] : []),
		],
	},
	plugins: [
		{
			plugin: CracoAntDesignPlugin,
			options: {
				customizeThemeLessPath: path.join(__dirname, 'src/theme/custom-theme.less'),
			},
		},
	],
};