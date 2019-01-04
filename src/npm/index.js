import shell from 'shelljs'

export default function npmInstall (done, debug = '', yarn = false) {
  const env = process.env.NODE_ENV ? 'NODE_ENV=' + process.env.NODE_ENV + ' ' : ''
  const command = env + (yarn ? 'yarn install ' : 'npm i --no-spin --no-progress ') + debug
  shell.exec(command, { silent: true, async: true }, done)
}
