import {spawn as nodeSpawn} from 'node:child_process'
import {stat, readFile as fsReadFile, rm} from 'node:fs/promises'

export function spawn(command, args, options) {
  return new Promise((resolve, reject) => {
    const child = nodeSpawn(command, args, {
      stdio: 'inherit',
      env: process.env,
      cwd: process.cwd(),
      ...options,
    })

    child.on('error', reject)

    child.on('close', (code) => {
      if (code) {
        reject(new Error(`${command} exited with code: ${code}`))
        return
      }
      resolve()
    })
  })
}

export async function isDirectory(path) {
  try {
    const result = await stat(path)
    return result.isDirectory()
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false
    }

    throw error
  }
}

export async function isFile(path) {
  try {
    const result = await stat(path)
    return result.isFile()
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false
    }

    throw error
  }
}

export async function readFile(path, options) {
  const {parser, ...opts} = options
  const data = await fsReadFile(path, opts)
  if (parser === 'json') {
    return JSON.parse(data.toString())
  }

  if (parser === 'toml') {
    const toml = await import('toml')
    return toml.parse(data)
  }

  return data
}

export async function removeDirectory(path) {
  const isDir = await isDirectory(path)
  if (!isDir) return false
  await rm(path, {
    recursive: true,
    force: true,
  })
  return true
}
