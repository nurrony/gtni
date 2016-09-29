import shell from 'shelljs'

export default function npmInstall (debug = '', done) {
  const env = process.env.NODE_ENV ? ' --' + process.env.NODE_ENV : ''
  const command = 'npm i --no-spin --no-progress ' + debug + env
  shell.exec(command, {silent: true, async: true}, done)
}
