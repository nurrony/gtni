import shell from 'shelljs'
import { log, prepareArguments } from './../libs/utils'
/**
 * Build clone operation arguments and runs it
 * @param {Object} argv Arguments passed by user
 * @param {Function} done callback function
 */
export default function clone (argv, done) {
  const repoNPath = argv._[1] + ' ' + (typeof argv._[2] === 'undefined' ? '' : argv._[2])
  const args = argv.b ? `-b ${argv.b}${argv.d ? ' -v' : ''}` : prepareArguments(argv)
  log.info('cloning gtni your repository...')
  shell.exec(
    `git clone ${args} ${repoNPath}`,
    {
      silent: true,
      async: true
    },
    (exitCode, output, errOutput) => {
      if (!exitCode) {
        return done(null, output)
      }
      return done(exitCode, errOutput)
    }
  )
}
