const { merge } = require('webpack-merge')
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')
const commonConfig = require('./webpack.common.js')
const packageJson = require('../package.json')

const devConfig = {
    mode: 'development',
    output: {
        publicPath: 'http://localhost:8070/'
    },
    devServer: {
        port: 8070,
        historyApiFallback: {
            index: '/index.html'
        }
    },
    plugins: [
        new ModuleFederationPlugin({
            name: 'container',
            remotes: {
                auth: 'auth@http://localhost:8071/remoteEntry.js',
                dashboard: 'dashboard@http://localhost:8072/remoteEntry.js',
            },
            shared: packageJson.dependencies, 
        }),
    ]
};

module.exports = merge(commonConfig, devConfig)