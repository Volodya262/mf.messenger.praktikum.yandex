const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'development',
    // entry: ['./src/index.ts', './src/main.css'],
    entry: {
        'scripts-bundle.js': './src/index.ts',
        'styles-bundle': './src/main.css'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "[name]"
    },
    resolve: {
        extensions: ['.ts', '.js', '.json', '.css']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: path.resolve(__dirname, 'tsconfig.json'),
                        },
                    },
                ],
                exclude: /(node_modules)/
            },
            {
                test: /\.css$/,
                loader: [MiniCssExtractPlugin.loader, 'css-loader']
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin(),
    ]
};