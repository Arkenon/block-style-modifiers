const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

// Get all default config settings
const config = {
    ...defaultConfig,
    entry: {
        'editor': './src/editor.js',
        'admin': './src/admin.js',
    },
    output: {
        path: path.resolve(process.cwd(), 'build'),
        filename: '[name].js'
    },
    resolve: {
        ...defaultConfig.resolve,
        alias: {
            ...defaultConfig.resolve.alias,
            '@bsm': path.resolve(__dirname, 'src')
        }
    },
    watchOptions: {
        ignored: /node_modules/,
        aggregateTimeout: 300,
        poll: 1000,
    }
};

module.exports = config;