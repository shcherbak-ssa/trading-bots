const path = require('path');

const nodeExternals = require('webpack-node-externals');
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');


module.exports = {
  mode: 'production',
  target: 'node',
  devtool: false,
  entry: path.resolve(__dirname, 'server', 'index.ts'),
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'build', 'server'),
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
              configFile: path.join(__dirname, 'tsconfig.server.json'),
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
        configFile: path.join(__dirname, 'tsconfig.server.json'),
      }),
    ],
  },
  externals: [ nodeExternals() ],
};
