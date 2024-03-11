const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
    "mode": "development",//"production",//
    "entry": {
    	"app": "./src/App.jsx"
    },
    "output": {
        "path": __dirname+'/docs',
        "filename": "[name].[chunkhash:8].js",
        "publicPath": "/"
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
            "path": __dirname+'/static',
            "filename": 'index.html' //relative to root of the application
        }),
        new CopyPlugin({"patterns": [{
        		"from": "src/assets",
        		"to":  "assets"
        	}
        ]})
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
    },
    "cache": false,
}