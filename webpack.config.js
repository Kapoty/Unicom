const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    //"mode": "development",//"production",//
    "entry": {
    	"app": "./src/App.jsx"
    },
    "output": {
        "path": __dirname+'/docs',
        "filename": "assets/js/[name].[chunkhash:8].js",
        "publicPath": "/",
    },
    "module": {
        "rules": [
            {
                "test": /\.(js|jsx)$/,
                "exclude": /node_modules/,
                "use": {
                    "loader": "babel-loader",
                    "options": {
                        "presets": [
                            "@babel/env",
                            "@babel/react"
                        ],
                        plugins: [
                            ['@babel/plugin-transform-nullish-coalescing-operator'],
                            ['@babel/plugin-transform-optional-chaining']
                        ]
                    }
                }
            },
            {
                "test": /\.(scss|css)$/,
                "use": [
                    "style-loader",
                    {
                        "loader": "css-loader",
                        "options": {
                            "url": false
                        }
                    }
                ]
            }
        ]
    },
    "plugins": [
    	new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
        	"template": 'src/index.html',
        	"title": "UniSystem",
            "hash": true,
            "chunks": ["app"],
            "path": __dirname+'/docs',
            "filename": 'index.html' //relative to root of the application
        }),
        new CopyPlugin({"patterns": [
            {
        		"from": "src/assets",
        		"to":  "assets"
        	},
            { from: 'src/manifest', to: 'manifest' },
            { from: 'src/service-worker.js', to: 'service-worker.js' },
        ]}),
        //new BundleAnalyzerPlugin()
    ],
    "resolve": {
        "modules": [path.resolve(__dirname, "src"), "node_modules"],
        "extensions": [".js", ".json", ".jsx", ".scss", "css"]
    },
    "target": "web",
    "devServer": {
        historyApiFallback: true,
        hot: true,
        watchFiles: ['src'],
        server: {
            type: 'https',
            options: {
                key: __dirname+'/cert/private.key',
                cert: __dirname+'/cert/private.pem',
            }
        },
    },
    "cache": false,
}