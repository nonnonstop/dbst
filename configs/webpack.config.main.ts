import path from 'path';
import type {Configuration} from 'webpack';
import baseConfig from './webpack.config.base';

const config: Configuration = {
  ...baseConfig,
  target: 'electron-main',
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'main.js',
  },
  externals: {
    'ffi-napi': 'require("ffi-napi")',
    'ref-napi': 'require("ref-napi")',
    './dbst': 'require("./dbst")',
  },
};

export default config;
