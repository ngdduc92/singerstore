const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
	entry: {
		app: ['@babel/polyfill', './src/shopadmin/client/index.js'],
		vendor: [
			'react',
			'react-dom',
			'react-redux',
			'redux-thunk',
			'react-router-dom',
			'react-dropzone',
			'redux',
			'redux-form',
			'redux-form-material-ui',
			'material-ui'
		]
	},

	performance: {
		hints: false
	},

	output: {
		publicPath: '/',
		path: path.resolve(__dirname, 'public'),
		filename: 'admin-assets/js/[name]-[chunkhash].js',
		chunkFilename: 'admin-assets/js/[name]-[chunkhash].js'
	},

	optimization: {
		splitChunks: {
			cacheGroups: {
				vendor: {
					chunks: 'initial',
					name: 'vendor',
					test: 'vendor',
					enforce: true
				}
			}
		}
	},

	resolve: {
		alias: {
			src: path.resolve(__dirname, 'src/shopadmin/client'),
			routes: path.resolve(__dirname, 'src/shopadmin/client/routes'),
			modules: path.resolve(__dirname, 'src/shopadmin/client/modules'),
			lib: path.resolve(__dirname, 'src/shopadmin/client/lib')
		}
	},

	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env', '@babel/preset-react'],
						plugins: [
							'@babel/plugin-proposal-class-properties',
							'@babel/plugin-syntax-dynamic-import'
						]
					}
				}
			},
			{
				test: /\.css$/,
				include: [path.resolve(__dirname, 'public')],
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							modules: false,
							importLoaders: true
						}
					},
					'postcss-loader'
				]
			},
			{
				test: /\.css$/,
				exclude: /node_modules|public/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							modules: true,
							importLoaders: true,
							localIdentName: '[name]__[local]___[hash:base64:5]'
						}
					},
					'postcss-loader'
				]
			}
		]
	},

	plugins: [
		new CleanWebpackPlugin(
			[
				'public/admin-assets/js/app-*.js',
				'public/admin-assets/js/vendor-*.js',
				'public/admin-assets/css/bundle-*.css'
			],
			{ verbose: false }
		),
		new MiniCssExtractPlugin({
			filename: 'admin-assets/css/bundle-[contenthash].css',
			chunkFilename: 'admin-assets/css/bundle-[contenthash].css'
		}),
		new HtmlWebpackPlugin({
			template: 'src/shopadmin/client/index.html',
			inject: 'body',
			filename: 'admin/index.html'
		}),
		new webpack.BannerPlugin({
			banner: `Created: ${new Date().toUTCString()}`,
			raw: false,
			entryOnly: false
		})
	],

	stats: {
		children: false,
		entrypoints: false,
		modules: false
	}
};
