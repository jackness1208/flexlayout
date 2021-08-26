import pkg from './package.json'
import typescript from 'rollup-plugin-typescript2'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import json from 'rollup-plugin-json'
import { terser } from 'rollup-plugin-terser'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import postcssReporter from 'postcss-reporter'
import sass from 'sass'

function buildBanner(type) {
  return [
    '/*!',
    ` * ${pkg.name} ${type} ${pkg.version}`,
    ` * (c) 2020 - ${new Date().getFullYear()} jackness`,
    ' * Released under the MIT License.',
    ' */'
  ].join('\n')
}

const IS_PUBLISH = process.env.NODE_ENV === 'production'

const config = {
  input: './src/index.ts',
  output: [],
  plugins: [
    postcss({
      extract: true,
      extensions: ['css', 'scss'],
      process(context, payload) {
        return new Promise((resolve, reject) => {
          sass.render(
            {
              file: context
            },
            (err, result) => {
              if (!err) {
                resolve(result)
              } else {
                reject(err)
              }
            }
          )
        })
      },
      plugins: [autoprefixer(), postcssReporter()]
    }),
    nodeResolve({ mainFields: ['jsnext:main'] }),
    commonjs(),
    json(),
    typescript({
      typescript: require('typescript')
    })
  ],
  external: ['@yy/allblue-qiankun', 'fetch-polyfill']
}

export default [
  {
    input: config.input,
    output: [
      {
        file: './output/index.js',
        format: 'cjs',
        banner: buildBanner('cjs'),
        exports: 'named',
        sourcemap: false
      }
    ],
    plugins: config.plugins.concat([
      IS_PUBLISH &&
        terser({
          compress: {
            passes: 2
          }
        })
    ]),
    external: config.external
  },
  {
    input: config.input,
    output: [
      {
        file: './output/index.esm.js',
        format: 'esm',
        banner: buildBanner('esm'),
        sourcemap: false
      }
    ],
    plugins: config.plugins,
    external: config.external
  }
]
