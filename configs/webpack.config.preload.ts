import path from 'path';
import type {Configuration} from 'webpack';
import baseConfig from './webpack.config.base';

const config: Configuration = {
  ...baseConfig,
  target: 'electron-preload',
  entry: './src/preload.ts',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'preload.js',
  },
};

export default config;
