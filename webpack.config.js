import { resolve as _resolve } from 'path';
import { readdirSync } from 'fs';

const nodeModules = {};
readdirSync(_resolve(__dirname, 'node_modules'))
  .filter((x) => ['.bin'].indexOf(x) === -1)
  .forEach((mod) => {
    nodeModules[mod] = `commonjs ${mod}`;
  });

const isProduction = process.env.NODE_ENV === 'production';

export const mode = isProduction ? 'production' : 'development';
export const devtool = isProduction ? 'source-map' : 'eval-source-map';
export const entry = './src/server.ts';
export const output = {
  path: _resolve(__dirname, 'dist'),
  filename: 'server.js',
};
export const externals = nodeModules;
export const target = 'node';
export const module = {
  rules: [
    {
      test: /\.ts$/,
      use: 'ts-loader',
      exclude: /node_modules/,
    },
  ],
};
export const resolve = {
  extensions: ['.ts', '.js'],
};