import ora from 'ora'
import shell from 'shelljs'
import { isGitRepo, prepareArguments } from './../libs/utils'
/**
 * Build pull operation arguments and runs it
 * @param {Object} argv Arguments passed by user
 * @param {Function} done callback function
 */
export default function pull (argv, done) {
  let args = ''
  const branchToPull = argv.b || false
  const repoToPull = argv.repo || false

  if (isGitRepo()) {
    const spinner = ora(`Pulling ${!branchToPull ? 'current' : branchToPull} branch.`).start()

    if (branchToPull) {
      args = (argv.d ? '-v ' : '') + 'origin ' + branchToPull
    } else if (repoToPull) {
      args = (argv.d ? '-v ' : '') + repoToPull
    } else {
      args = prepareArguments(argv)
    }

    shell.exec(
      `git pull ${args}`,
      {
        silent: true,
        async: true
      },
      (exitCode, output, errOutput) => {
        if (!exitCode) {
          spinner.succeed(`Pulling ${!branchToPull ? 'current' : branchToPull} branch is successful.`)
          return done(null, output)
        }
        spinner.succeed(`Pulling ${!branchToPull ? 'current' : branchToPull} branch is failed.`)
        return done(exitCode, errOutput)
      }
    )
  } else {
    return done(true, 'Current directory is not a git repository')
  }
}
