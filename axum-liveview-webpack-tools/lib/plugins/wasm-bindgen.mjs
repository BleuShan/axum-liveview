import {spawn, isFile, readFile, removeDirectory} from '../utils.mjs'
import * as logger from '../logger.mjs'
import upath from 'upath'

const {resolve, dirname, addExt} = upath

export default class WasmBindgenPlugin {
  #options = {}
  #error
  constructor(options = {}) {
    const cwd = process.cwd()
    this.#options = {
      manifestPath: resolve(cwd, 'Cargo.toml'),
      target: 'bundler',
      outDir: resolve(cwd, 'generated'),
      typescript: true,
      weakRefs: true,
      referencesTypes: true,
      ...options,
    }
  }

  apply(compiler) {
    const {hooks, options} = compiler
    const tapOptions = {
      name: this.constructor.name,
    }
    this.#options.mode = this.#options.mode ?? options.mode
    this.#options.clean = options.output.clean
    hooks.beforeCompile.tapPromise(tapOptions, this.#beforeCompile.bind(this))

    hooks.thisCompilation.tap(tapOptions, this.#emitErrorIfAny.bind(this))
  }

  async #beforeCompile() {
    try {
      const result = await this.#runCargoBuild()
      await this.#runWasmBindgen(result)
    } catch (error) {
      this.#error = error
    }
  }

  #emitErrorIfAny(compilation) {
    if (this.#error != null) {
      compilation.errors.push(this.#error)
    }
  }

  async #runCargoBuild() {
    const {manifestPath, mode} = this.#options
    const {package: cargoPackage} = await readFile(manifestPath, {
      parser: 'toml',
    })
    logger.info`Running cargo build:`

    const args = [
      'build',
      '--target',
      'wasm32-unknown-unknown',
      '--manifest-path',
      manifestPath,
    ]

    let flavor = 'debug'
    if (mode === 'production') {
      args.push('--release')
      flavor = 'release'
    }

    await spawn('cargo', args)
    const fileName = addExt(cargoPackage.name.replaceAll('-', '_'), 'wasm')

    let currentPath = dirname(manifestPath)

    while (currentPath) {
      const filePath = resolve(
        currentPath,
        'target',
        'wasm32-unknown-unknown',
        flavor,
        fileName
      )

      if (await isFile(filePath)) {
        return {filePath, ...cargoPackage}
      }

      currentPath = dirname(currentPath)
    }
  }

  async #runWasmBindgen({filePath, name}) {
    logger.info`Running wasm-bindgen:`
    const args = [filePath, '--out-name', `${name}-wasm`]
    const {outDir, clean, typescript, target, weakRefs, referenceTypes, mode} =
      this.#options

    if (mode !== 'production') {
      args.push('--debug')
    }

    if (weakRefs) {
      args.push('--weak-refs')
    }

    if (referenceTypes) {
      args.push('--reference-types')
    }

    if (target) {
      args.push('--target', target)
    }

    if (!typescript) {
      args.push('--no-typescript')
    }

    if (outDir) {
      if (clean) {
        await removeDirectory(outDir)
      }
      args.push('--out-dir', outDir)
    }

    await spawn('wasm-bindgen', args)
  }
}
