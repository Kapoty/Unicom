const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
	entry: {
		app: "./src/index.tsx"
	},
	output: {
		path: __dirname + '/docs',
		filename: "assets/js/[name].[chunkhash:8].js",
		publicPath: "/",
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			},
			{
				test: /\.(scss|css)$/,
				use: [
					"style-loader",
					{
						"loader": "css-loader",
						"options": {
							"url": false
						}
					}
				]
			},
			{
				test: /\.svg$/i,
				issuer: /\.[jt]sx?$/,
				use: ['@svgr/webpack'],
			},
		]
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			"template": 'src/index.html',
			"title": "UniSystem",
			"hash": true,
			"chunks": ["app"],
			"path": __dirname + '/docs',
			"filename": 'index.html'
		}),
		new CopyPlugin({
			"patterns": [
				{
					"from": "src/assets",
					"to": "assets"
				},
				{ from: 'src/manifest', to: 'manifest' },
				{ from: 'src/service-worker.js', to: 'service-worker.js' },
			]
		}),
		//new BundleAnalyzerPlugin()
	],
	resolve: {
		modules: [path.resolve(__dirname, "src"), "node_modules"],
		extensions: [".js", ".json", ".jsx", ".scss", ".css", ".ts", ".tsx"]
	},
	target: "web",
	devServer: {
		historyApiFallback: true,
		hot: true,
		watchFiles: ['src'],
		server: {
			type: 'https',
			options: {
				key: __dirname + '/cert/server.key',
				cert: __dirname + '/cert/server.pem',
			}
		},
	},
	cache: {
		type: "filesystem", // Ativa o cache no sistema de arquivos
		buildDependencies: {
			// Recompila caso a configuração do Webpack seja alterada
			config: [__filename],
		},
	},
	optimization: {
		usedExports: true, // Tree-shaking
	},
}