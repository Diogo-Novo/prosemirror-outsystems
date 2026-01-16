const resolve = require('@rollup/plugin-node-resolve').default;
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');
const postcss = require('rollup-plugin-postcss');
const terser = require('@rollup/plugin-terser').default;

const production = process.env.NODE_ENV === 'production';

module.exports = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/prosemirror-outsystems.js',
        format: 'iife',
        name: 'ProseMirrorOS',
        sourcemap: !production,
      },
      production && {
        file: 'dist/prosemirror-outsystems.min.js',
        format: 'iife',
        name: 'ProseMirrorOS',
        plugins: [terser()],
      },
    ].filter(Boolean),
    plugins: [
      resolve({ browser: true }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: './dist',
      }),
      postcss({
        extract: 'prosemirror-outsystems.css',
        minimize: production,
        sourceMap: !production,
      }),
    ],
  },
];
