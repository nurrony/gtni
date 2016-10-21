import shell from 'shelljs'

export default function npmInstall (debug = '', done) {
  const env = process.env.NODE_ENV ? 'NODE_ENV=' + process.env.NODE_ENV + ' ' : ''
  const command = env + 'npm i --no-spin --no-progress ' + debug
  shell.exec(command, {silent: true, async: true}, done)
}
