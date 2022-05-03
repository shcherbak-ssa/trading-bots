const path = require('path');

const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const CssUrlRelativePlugin = require('css-url-relative-plugin');


module.exports = (env = {}) => {
  const isDev = process.env.NODE_ENV === 'development';

  const config = {
    mode: isDev ? 'development' : 'production',
    devtool: isDev ? 'eval-source-map' : false,
    entry: path.resolve(__dirname, 'client', 'app', 'index.ts'),
    output: {
      filename: path.join('js', 'main.js'),
      path: path.resolve(__dirname, 'build', 'client'),
      clean: true,
    },
    watchOptions: {
      ignored: /node_modules/,
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          include: path.resolve(__dirname, 'client'),
          use: [
            {
              loader: 'vue-loader',
            },
          ],
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
              options: {
                sources: false,
                minimize: !isDev,
              }
            },
            {
              loader: 'file-loader',
              options: {
                name: '[name].html',
              }
            }
          ]
        },
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                configFile: path.join(__dirname, 'tsconfig.client.json'),
                appendTsSuffixTo: [/\.vue$/],
              },
            }
          ],
        },
        {
          test: /\.(sc|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                url: false,
                importLoaders: 1,
                sourceMap: isDev,
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: isDev,
              }
            }
          ]
        },
        {
          test: /\.(woff|woff2|eot|ttf|svg)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'fonts',
              },
            },
          ],
        },
        {
          test: /\.(jpg|jpeg|png|svg|ico)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'images',
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js', '.vue'],
      plugins: [
        new TsconfigPathsPlugin({
          configFile: path.join(__dirname, 'tsconfig.client.json'),
        }),
      ],
    },
    plugins: [
      new CssUrlRelativePlugin(),
    ],
  };

  const configWithTimeMeasures = new SpeedMeasurePlugin().wrap(config);
  
  configWithTimeMeasures.plugins.push(
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: path.join('styles', '[name].css'),
      chunkFilename: path.join('styles', '[id].css'),
    }),
  );

  return configWithTimeMeasures;
};
