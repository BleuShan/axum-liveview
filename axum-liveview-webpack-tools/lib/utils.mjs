import {spawn as nodeSpawn} from 'node:child_process'
import chalk from 'chalk'

export function spawn(command, args, options) {
  return new Promise((resolve, reject) => {
    const child = nodeSpawn(command, args, {
      stdio: 'inherit',
      env: process.env,
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

export function error(msg) {
  console.error(chalk.bold.red(msg))
}

export function info(msg) {
  console.info(chalk.blue(msg))
}
