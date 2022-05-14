const path = require('path');

const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');
const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  runtimeCompiler: true,

  outputDir: path.resolve(__dirname, '..', 'build', 'client'),

  configureWebpack: (config) => {
    const tsconfigPathsPlugin = new TsconfigPathsPlugin({
      configFile: path.join(__dirname, 'tsconfig.json'),
    });

    if (config.resolve.plugins && Array.isArray(config.resolve.plugins)) {
      config.resolve.plugins.push(tsconfigPathsPlugin);
    } else {
      config.resolve.plugins = [ tsconfigPathsPlugin ];
    }

    config.module.rules.push({
      test: /\.(jpg|jpeg|png)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'images',
          },
        },
      ],
    });
  },

  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3333',
      },
      '/auth': {
        target: 'http://localhost:3333',
      },
    },
  },
});
