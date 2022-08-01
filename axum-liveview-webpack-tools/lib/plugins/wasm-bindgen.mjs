import fs from 'node:fs/promises'
import {info} from '../utils.mjs'

export default class WasmBindgenPlugin {
  #options = {}
  #webpackCompilerOptions = {}
  #count = 0
  #error

  constructor(options = {}) {
    this.#options = {}
  }

  apply(compiler) {
    const {hooks, options} = compiler
    this.#webpackCompilerOptions = options
    const tapOptions = {
      name: this.constructor.name,
    }

    hooks.beforeCompile.tapPromise(tapOptions, this.#beforeCompile.bind(this))

    hooks.thisCompilation.tap(tapOptions, this.#emitErrorIfAny.bind(this))
  }

  async #beforeCompile() {
    info('test')
  }

  #emitErrorIfAny(compilation) {
    console.log(this.#count++)

    if (this.#error != null) {
      compilation.errors.push(this.#error)
    }
  }
}
