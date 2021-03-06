const webpack = require('webpack');
const commonConfig = require('./webpack.common.js');
const helpers = require('./helpers');
/**
 * Webpack Plugins
 */
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * Used to merge webpack configs
 */
const webpackMerge = require('webpack-merge');

/**
 * Webpack Constants
 */
const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const HOST = process.env.HOST || '172.16.5.89'; // 172.17.0.1
const PORT = process.env.PORT || 3339;

const METADATA = webpackMerge(commonConfig({
    env: ENV
}).metadata, {
    host: HOST,
    port: PORT,
    ENV: ENV,
    HMR: false
});

module.exports = (options) => {
    return webpackMerge(commonConfig({ env: ENV }), {
        /**
         * Developer tool to enhance debugging
         *
         * See: http://webpack.github.io/docs/configuration.html#devtool
         * See: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
         */
        devtool: 'cheap-module-source-map',
        entry: {
            main: helpers.root('./docs/index.tsx')
        },
        /**
         * Options affecting the output of the compilation.
         *
         * See: http://webpack.github.io/docs/configuration.html#output
         */
        output: {
            path: helpers.root('build'),
            filename: '[name].bundle.js',
            sourceMapFilename: '[file].map',
            chunkFilename: '[id].chunk.js'
        },
        externals: [
            {
                'react': {
                    root: 'React',
                    commonjs2: 'react',
                    commonjs: 'react',
                    amd: 'react'
                }
            }, {
                'react-dom': {
                    root: 'ReactDOM',
                    commonjs2: 'react-dom',
                    commonjs: 'react-dom',
                    amd: 'react-dom'
                }
            }, {
                'react-motion': {
                    root: 'ReactMotion',
                    commonjs2: 'react-motion',
                    commonjs: 'react-motion',
                    amd: 'react-motion'
                }
            }
        ],
        module: {
            rules: [
                {
                    text: /\.md$/,
                    loader: ''
                }
            ]
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new HtmlWebpackPlugin({
                title: 'Bee Mobile',
                chunksSortMode: function (a, b) {
                    const entryPoints = ['vendor', 'main'];
                    return entryPoints.indexOf(a.names[0]) - entryPoints.indexOf(b.names[0]);
                },
                inject: 'body',
                template: './docs/index.html',
                hash: true,
                minify: {
                    collapseWhitespace: true,
                    collapseInlineTagWhitespace: true,
                    removeRedundantAttributes: true,
                    removeEmptyAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    removeComments: true
                }
            }),
            /**
             * Plugin: DefinePlugin
             * Description: Define free variables.
             * Useful for having development builds with debug logging or adding global constants.
             *
             * Environment helpers
             *
             * See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
             */
            new webpack.DefinePlugin({
                'process.env': {
                    ENV: JSON.stringify(METADATA.ENV),
                    NODE_ENV: JSON.stringify(METADATA.ENV)
                }
            }),
            new ExtractTextPlugin({
                filename: '[name].bundle.css',
                allChunks: true
            }),
            //new BundleAnalyzerPlugin()
        ],
        /**
         * Webpack Development Server configuration
         * Description: The webpack-dev-server is a little node.js Express server.
         * The server emits information about the compilation state to the client,
         * which reacts to those events.
         *
         * See: https://webpack.github.io/docs/webpack-dev-server.html
         */
        devServer: {
            port: METADATA.port,
            host: METADATA.host,
            historyApiFallback: true,
            watchOptions: {
                aggregateTimeout: 300,
                poll: 1000,
                ignored: /node_modules/
            },
            disableHostCheck: true
        }
    });
};
