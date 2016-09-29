import shell from 'shelljs'
import utils from './../libs/utils'

/**
 * Build clone operation arguments and runs it
 * @param {Object} argv Arguments passed by user
 * @param {Function} done callback function
 */
export default function clone (argv, done) {
  let args = ''
  const repoNPath = argv._[ 1 ] + ' ' +
    (typeof argv._[ 2 ] === 'undefined' ? '' : argv._[ 2 ])

  if (argv.b) {
    args = '-b ' + argv.b + (argv.d ? ' -v' : '')
  } else {
    args = utils.prepareArguments(argv)
  }

  const cmd = 'git clone ' + args + ' ' + repoNPath

  utils.log.info('cloning your repository...')
  shell.exec(cmd, {
    silent: true,
    async: true
  }, (exitCode, output, errOutput) => {
    if (!exitCode) {
      return done(null, output)
    }
    return done(exitCode, errOutput)
  })
}
