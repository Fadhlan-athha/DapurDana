const { spawn } = require('node:child_process')

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'

const processes = [
  {
    name: 'backend',
    command: npmCommand,
    args: ['start'],
    cwd: 'backend',
  },
  {
    name: 'frontend',
    command: npmCommand,
    args: ['run', 'dev'],
    cwd: 'frontend',
  },
]

const children = processes.map((processConfig) => {
  const child = spawn(processConfig.command, processConfig.args, {
    cwd: processConfig.cwd,
    stdio: 'inherit',
    shell: false,
  })

  child.on('exit', (code) => {
    if (code && code !== 0) {
      console.error(`${processConfig.name} exited with code ${code}`)
      stopAll()
      process.exit(code)
    }
  })

  return child
})

function stopAll() {
  for (const child of children) {
    if (!child.killed) {
      child.kill()
    }
  }
}

process.on('SIGINT', () => {
  stopAll()
  process.exit(0)
})

process.on('SIGTERM', () => {
  stopAll()
  process.exit(0)
})
