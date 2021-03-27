import path from 'path';
import type {Configuration} from 'webpack';
import {DllPlugin} from 'webpack';
import baseConfig from './webpack.config.base';

const config: Configuration = {
  ...baseConfig,
  target: 'electron-renderer',
  entry: {
    rendererdll: [
      'react',
      'react-dom',
      '@material-ui/core',
      '@material-ui/icons',
      '@material-ui/data-grid',
      '@material-ui/styles',
      '@material-ui/system',
      '@material-ui/utils',
    ],
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    library: '[name]_[fullhash]',
  },
  plugins: [
    new DllPlugin({
      path: path.resolve(__dirname, '../dist', '[name]-manifest.json'),
      name: '[name]_[fullhash]',
    }),
  ],
};

export default config;
