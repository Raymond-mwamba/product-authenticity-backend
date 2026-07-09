const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const webpack = require('webpack');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Webpack 4 compatible: mock process so expo-constants doesn't crash at module load time
  config.node = { process: 'mock' };

  // Define process globally via DefinePlugin (webpack 4 compatible)
  config.plugins.push(
    new webpack.DefinePlugin({
      'process': {
        env: {},
        browser: true,
        version: '',
        nextTick: require('process/browser').nextTick,
        cwd: () => '/',
        chdir: () => {},
        umask: () => 0,
      },
    })
  );

  return config;
};
