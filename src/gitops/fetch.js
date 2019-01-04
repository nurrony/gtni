import shell from 'shelljs'
import { isGitRepo, log, prepareArguments } from './../libs/utils'

/**
 * Build fetch operation arguments and runs it
 * @param {Object} argv Arguments passed by user
 * @param {Function} done callback function
 */
export default function fetch (argv, done) {
  let args = ''
  let cmd = ''
  const branchToFetch = argv.b || false
  const repoToFetch = argv.repo || false

  if (isGitRepo()) {
    log.info(`fetching ${!branchToFetch ? 'current' : branchToFetch} branch...`)

    if (branchToFetch) {
      args = (argv.d ? '-v ' : '') + 'origin ' + branchToFetch
    } else if (repoToFetch) {
      args = +(argv.d ? '-v ' : '') + repoToFetch
    } else {
      args = prepareArguments(argv)
    }

    cmd = 'git fetch ' + args

    shell.exec(
      cmd,
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
  } else {
    return done(true, 'Current directory is not a git repository')
  }
}
