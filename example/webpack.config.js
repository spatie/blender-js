const path = require('path');
const merge = require('webpack-merge');

module.exports = merge(require('../webpack.base'), {
    context: __dirname,

    entry: './app.js',

    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'app.js',
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: { url: false }
                    },
                ],
            },
        ],
    },

    resolve: {
        alias: {
            vue: 'vue/dist/vue.js',
        },
    },

    devServer: {
        publicPath: '/',
        contentBase: __dirname,
    },
});
