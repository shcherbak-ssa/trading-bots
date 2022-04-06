const path = require('path');

const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');


module.exports = (env = {}) => {
  const isDev = env.mode && env.mode === 'development';

  const config = {
    mode: isDev ? 'development' : 'production',
    devtool: isDev ? 'eval-source-map' : false,
    entry: path.join(__dirname, 'index.ts'),
    output: {
      filename: path.join('js', 'main.js'),
      path: path.resolve(__dirname, '..', 'build', 'client'),
      clean: true,
    },
    watchOptions: {
      ignored: /node_modules/,
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          include: path.resolve(__dirname),
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
                configFile: path.join(__dirname, 'tsconfig.json'),
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
          test: /\.(jpg|png|svg|ico)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'assets',
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js', '.vue'],
    },
    plugins: [],
  };

  const configWithTimeMeasures = new SpeedMeasurePlugin().wrap(config);
  
  configWithTimeMeasures.plugins.push(
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: path.join('styles', '[name].css'),
      chunkFilename: path.join('styles', '[id].css'),
    }),
    new TsconfigPathsPlugin({
      configFile: path.join(__dirname, 'tsconfig.json'),
    }),
  );

  return configWithTimeMeasures;
};
