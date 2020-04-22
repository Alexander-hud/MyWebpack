const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const fs =require('fs')
const webpack = require('webpack')

const PATHS = {
    src:path.join(__dirname, './src'),
    dist: path.join(__dirname, './dist'),
    assets: 'assets/'
}
const PAGES_DIR = `${PATHS.src}/pug/pages`
const PAGES = fs.readdirSync(PAGES_DIR).filter(filename => filename.endsWith('.pug'))

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }

    if (isProd) {
        config.minimizer = [
            new OptimizeCssAssetWebpackPlugin(),
            new TerserWebpackPlugin()
        ]
    }

    return config
}

module.exports = {
    context:path.resolve(__dirname,'src'),
    mode: 'development',
    entry: {
        main:'./index.js'
    },
    output: {
        filename:'[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions:['.js', '.json', '.png', '.xml','.jpeg', '.csv','.css', '.scss'],
        alias: {
            '@models': path.resolve(__dirname, 'src/models'),
            '@': path.resolve(__dirname, 'src'),
        }
        
    },
    optimization: optimization(),
    devServer: {
        port:4200
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            jquery: 'jquery'
          }),
        new CopyWebpackPlugin([
            {
                from:path.resolve(__dirname, 'src/favicon.ico'),
                to: path.resolve(__dirname, 'dist')
            }
        ]),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
        }),
        ...PAGES.map(page => new HTMLWebpackPlugin({
            template: `${PAGES_DIR}/${page}`,
            filename: `./${page.replace(/\.pug/,'.html')}`
          }))
    ],
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                  'style-loader',
                  MiniCssExtractPlugin.loader,
                  {
                    loader: 'css-loader',
                    options: { sourceMap: true }
                  }, {
                    loader: 'sass-loader',
                    options: { sourceMap: true }
                  }
                ]
              },
            {
                test: /\.css$/,
                use:[{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        hmr: isDev,
                        reloadAll:true
                    },
                    }, 'css-loader'
                ]
            },
            
            {
                test: /\.sass$/,
                use:[{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        hmr: isDev,
                        reloadAll:true
                    },
                    }, 'css-loader',
                       'sass-loader'
                ]
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use:['file-loader']

            },
            {
                test:/\.(ttf|woff|svg)$/,
                use: ['file-loader']
            },
            {    test: /\.xml$/,
                use:['xml-loader']
            },
            {    test: /\.csv$/,
                use:['csv-loader']
            },  
            {
                test: /\.pug$/,
                loader: 'pug-loader'
            }
         
        ]
    }
} 