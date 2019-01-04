import ora from 'ora'
import shell from 'shelljs'
import { prepareArguments } from './../libs/utils'

/**
 * Build clone operation arguments and runs it
 * @param {Object} argv Arguments passed by user
 * @param {Function} done callback function
 */
export default function clone (argv, done) {
  const spinner = ora('Cloning your repository').start()
  const repoNPath = argv._[1] + ' ' + (typeof argv._[2] === 'undefined' ? '' : argv._[2])
  const args = argv.b ? `-b ${argv.b}${argv.d ? ' -v' : ''}` : prepareArguments(argv)
  shell.exec(
    `git clone ${args} ${repoNPath}`,
    {
      silent: true,
      async: true
    },
    (exitCode, output, errOutput) => {
      if (!exitCode) {
        spinner.succeed('Cloning repository is completed successfully')
        return done(null, output)
      }
      spinner.fail('Cloning repository is not completed successfully')
      return done(exitCode, errOutput)
    }
  )
}
