import ora from 'ora'
import shell from 'shelljs'
import { isGitRepo, prepareArguments } from './../libs/utils'
/**
 * Build fetch operation arguments and runs it
 * @param {Object} argv Arguments passed by user
 * @param {Function} done callback function
 */
export default function fetch (argv, done) {
  let args = ''
  const branchToFetch = argv.b || false
  const repoToFetch = argv.repo || false

  if (isGitRepo()) {
    const spinner = ora(`Fetching ${!branchToFetch ? 'current' : branchToFetch} branch.`).start()
    if (branchToFetch) {
      args = (argv.d ? '-v ' : '') + 'origin ' + branchToFetch
    } else if (repoToFetch) {
      args = +(argv.d ? '-v ' : '') + repoToFetch
    } else {
      args = prepareArguments(argv)
    }

    shell.exec(
      `git fetch ${args}`,
      {
        silent: true,
        async: true
      },
      (exitCode, output, errOutput) => {
        if (!exitCode) {
          spinner.succeed(`Fetching ${!branchToFetch ? 'current' : branchToFetch} branch is successful.`)
          return done(null, output)
        }
        spinner.fail(`Fetching ${!branchToFetch ? 'current' : branchToFetch} branch is failed.`)
        return done(exitCode, errOutput)
      }
    )
  } else {
    return done(true, 'Current directory is not a git repository')
  }
}
