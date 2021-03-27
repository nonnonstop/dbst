import path from 'path';
import type {Configuration} from 'webpack';
import {DllReferencePlugin} from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import baseConfig from './webpack.config.base';

const config: Configuration = {
  ...baseConfig,
  target: 'electron-renderer',
  entry: {
    renderer: [
      './src/renderer.tsx',
      './src/components/App.tsx',
      './src/components/RaceHorseTable.tsx',
      './src/components/BreedHorseTable.tsx',
    ],
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'renderer.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      inject: false,
    }),
    new DllReferencePlugin({
      manifest: require(
          path.resolve(__dirname, '../dist/rendererdll-manifest.json'),
      ),
    }),
  ],
};

export default config;
