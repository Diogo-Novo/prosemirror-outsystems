import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';

const production = process.env.NODE_ENV === 'production';

export default [
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
      resolve({
        browser: true,
      }),
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