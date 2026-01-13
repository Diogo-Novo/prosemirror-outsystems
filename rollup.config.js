/**
 * Rollup Build Configuration
 * Bundles all source files into single JS and CSS files
 */

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/prosemirror-outsystems.js',
    format: 'iife',
    name: 'ProseMirrorOutSystems',
    sourcemap: !production
  },
  plugins: [
    resolve({
      browser: true
    }),
    commonjs(),
    postcss({
      extract: 'prosemirror-outsystems.css',
      minimize: production,
      sourceMap: !production
    }),
    production && terser()
  ]
};