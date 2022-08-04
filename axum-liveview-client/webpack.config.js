import {fileURLToPath} from 'node:url'
import {constants as zlibConstants} from 'node:zlib'
import WasmBindgenPlugin from 'axum-liveview-webpack-tools/plugins/wasm-bindgen'
import CompressionPlugin from 'compression-webpack-plugin'
import upath from 'upath'

const {dirname, resolve, join, sep} = upath
const __dirname = dirname(fileURLToPath(import.meta.url))
const {BROTLI_PARAM_MODE, BROTLI_MODE_TEXT} = zlibConstants
const COMPRESSION_OPTIONS = {
  test: /\.((?:m?jsx?)|(?:(sa|sc|c)ss)|html)$/,
  threshold: 860,
}

function resolvePath(...paths) {
  return resolve(__dirname, ...paths)
}

function resolveOutputPath(...paths) {
  return resolvePath('dist', ...paths)
}

/**
 * Configures a webpack configuration to build the project.
 *
 * @param {object} env
 * @param {object} argv
 * @returns {import('webpack').Configuration} a webpack configuration based on
 * the environment
 */
export default function configure(env, argv) {
  let {mode} = argv
  mode = mode || 'production'
  return {
    devtool: mode !== 'production' ? 'inline-source-map' : undefined,
    entry: {
      'axum-liveview-client': resolvePath('src', 'main'),
    },
    experiments: {
      futureDefaults: true,
      outputModule: true,
    },
    mode,
    optimization: {
      flagIncludedChunks: true,
      providedExports: true,
      sideEffects: true,
      removeEmptyChunks: true,
      concatenateModules: false,
      runtimeChunk: 'single',
      moduleIds: 'deterministic',
      chunkIds: 'deterministic',
      minimize: true,
      splitChunks: {
        hidePathInfo: true,
        minSize: 860,
        name: false,
        maxAsyncRequests: Infinity,
        maxInitialRequests: 6,
        automaticNameDelimiter: sep,
        cacheGroups: {
          lib: {
            chunks: 'all',
            name(module, chunks, cacheGroupKey) {
              const id = module.identifier()
              const packageNameParts = id
                .replace(/.+[\\/]node_modules[\\/]@?/i, '')
                .replace(/[\\/](build|dist)/, '')
                .replace(/(\.(es|((c|m)?js)))+$/i, '')
                .split(/[\\/]/)
              const fileNameIndex = packageNameParts.length - 1
              if (packageNameParts[fileNameIndex]?.toLowerCase() === 'index') {
                packageNameParts[fileNameIndex] =
                  packageNameParts[fileNameIndex - 1]
              }

              return join(cacheGroupKey, ...packageNameParts)
            },
            test({type, context}) {
              return (
                /^javascript/.test(type) &&
                /[\\/]node_modules[\\/]/.test(context)
              )
            },
            reuseExistingChunk: true,
            enforce: true,
          },
          defaultVendors: false,
          default: false,
        },
      },
    },
    output: {
      filename: '[name].mjs',
      path: resolveOutputPath(),
      clean: true,
      module: true,
    },
    plugins: [
      new CompressionPlugin(COMPRESSION_OPTIONS),
      new CompressionPlugin({
        ...COMPRESSION_OPTIONS,
        algorithm: 'brotliCompress',
        filename: '[path][base].br[query]',
        compressionOptions: {
          level: 11,
          params: {
            [BROTLI_PARAM_MODE]: BROTLI_MODE_TEXT,
          },
        },
      }),
      new WasmBindgenPlugin({
        outDir: resolvePath('src', 'generated'),
        referenceTypes: false,
      }),
    ],
    resolve: {
      extensions: ['.mjs', '.js', '.ts'],
    },
  }
}
