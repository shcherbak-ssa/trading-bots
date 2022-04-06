const path = require('path');

const nodeExternals = require('webpack-node-externals');
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');


module.exports = {
  mode: 'production',
  target: 'node',
  devtool: false,
  entry: path.join(__dirname, 'index.ts'),
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, '..', 'build', 'server'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: path.join(__dirname, 'tsconfig.json'),
            },
          }
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.join(__dirname, 'tsconfig.json'),
      }),
    ],
  },
  externals: [ nodeExternals() ],
};
