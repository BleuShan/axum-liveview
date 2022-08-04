import chalk from 'chalk'

function format(stringSegments, args) {
  const strings = [...stringSegments]
  const msg = []
  function pushArg() {
    if (args?.length) {
      const item = args.shift()
      const s = typeof item === 'object' ? JSON.stringify(item, null, 2) : item
      msg.push(s)
    }
  }

  while (strings?.length) {
    msg.push(strings.shift())
    pushArg()
  }

  while (args?.length) {
    pushArg()
  }
  return msg.join('')
}

export function error(strings, ...args) {
  const msg = format(strings, args)
  console.error(chalk.bold.red(msg))
}

export function info(strings, ...args) {
  const msg = format(strings, args)
  console.info(chalk.blue(msg))
}

export function debug(strings, ...args) {
  const msg = format(strings, args)
  console.debug(chalk.gray(msg))
}
