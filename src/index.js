#!/usr/bin/env node

import each from 'async-each'
import waterfall from 'async-waterfall'
import ora from 'ora'
import shell from 'shelljs'
import yargs from 'yargs'
import gitops from './gitops'
import { cloneSubCommands, fetchSubCommands, pullSubCommands } from './helpers'
import { checkOutBranch, currentBranchName, detectPackageManager, getRepoName, log, packagePaths } from './libs/utils'
import npmInstall from './npm'
import shellConfig from './shellconfig'
// User defined constants
const errorLog = []
const warningLog = []
const NO_ERROR = 200
const HAS_ERROR = 400
const HAS_WARNING = 422
const NO_PACKAGE_FOUND = 404

const argv = yargs
  .usage('Usage: $0 <command> [options]')
  .command('pull', 'git pull and install npm dependencies', pullSubCommands)
  .command('fetch', 'git fetch and install npm dependencies', fetchSubCommands)
  .command('clone', 'clone a git repository and install npm dependencies', cloneSubCommands)
  .demand(1, 'must provide a valid command')
  .example('[NODE_ENV=<env>] $0 pull [git-options]', 'git pull and install npm packages')
  .help('h')
  .alias('h', 'help')
  .version(() => 'gtni version ' + require('../package.json').version)
  .alias('v', 'version').argv

shell.config = shellConfig

/**
 * Executes git operation
 * @param done
 * @returns {*}
 */
function executeGitOperation (done) {
  const command = argv._[0]
  console.log()
  switch (command) {
    case 'pull':
      return gitops.pull(argv, done)
    case 'fetch':
      return gitops.fetch(argv, done)
    case 'clone':
      return gitops.clone(argv, done)
    default:
      return yargs.showHelp()
  }
}

/**
 * List all package.json for a project and initiate NPM installation for each package.json
 * @param done
 */
function executeNPMInstall (done) {
  const activeBranchName = currentBranchName()
  const branchToCheckout = argv.b && typeof argv.b === 'string' && activeBranchName !== argv.b ? argv.b : false
  const branchName = branchToCheckout ? checkOutBranch(branchToCheckout) : activeBranchName
  const listSpinner = ora('Listing all package.json files in this project').start()
  const npmInstallSpinner = ora()
  packagePaths(branchName, (error, packagePaths) => {
    if (error) {
      listSpinner.fail('Listing package.json is not successful.')
      return done(error)
    }

    // is there any package.json?
    if (!packagePaths.length) {
      listSpinner.info('No package.json is found in your project. Skipping dependency installation.')
      return done(NO_PACKAGE_FOUND)
    }
    listSpinner.succeed(`Found ${packagePaths.length} package.json files.`)
    npmInstallSpinner.start(`Installing dependencies for branch ${branchName}`)
    each(
      packagePaths,
      (path, cb) => {
        shell.cd(path)
        const yarnLockExists = detectPackageManager(path)
        return npmInstall(
          (exitCode, output) => {
            const currentWarning = output.match(/((warn).+)/gim) || []

            if (currentWarning && currentWarning.length) {
              warningLog.push({
                packagePath: path + 'package.json',
                messages: currentWarning
              })
            }

            if (exitCode || output.toLowerCase().indexOf('err!') !== -1) {
              errorLog.push(path + 'package.json')
            }

            if (argv.d) {
              console.log('')
              log.info('Log for ' + path + 'package.json')
              log.info(output)
            }
            const err = false
            return cb(err)
          },
          argv.d ? '-d' : '',
          yarnLockExists
        )
      },
      err => {
        if (branchToCheckout) {
          checkOutBranch(activeBranchName)
        }

        if (err) {
          return done(err)
        }

        if (warningLog.length) {
          npmInstallSpinner.warn('Warnings given by npm during installing dependencies')
          return done(null, HAS_WARNING)
        }

        if (errorLog.length) {
          npmInstallSpinner.fail(
            'Error given by package manager during installing dependencies. Please check npm-debug.log under given directory'
          )
          return done(null, HAS_ERROR)
        }

        npmInstallSpinner.succeed('Dependencies are installed successfully.')
        return done(null, NO_ERROR)
      }
    )
  })
}

/**
 * Install NPM dependencies for a package.json
 * @param gitOpOutput
 * @param done
 */
function installNPMPackages (gitOpOutput, done) {
  const cmd = argv._[0]
  let cloneDir = ''

  if (argv.d) {
    log.info(gitOpOutput)
  }

  if (cmd === 'clone') {
    cloneDir = argv._[2] || getRepoName(argv._[1])
    shell.cd(cloneDir + '/')
  }

  return executeNPMInstall(done)
}

waterfall([executeGitOperation, installNPMPackages], (err, cmdOutput) => {
  if (err === NO_PACKAGE_FOUND) {
    return log.info(cmdOutput)
  }

  if (err) {
    return log.error(cmdOutput)
  }

  if (cmdOutput === HAS_WARNING) {
    warningLog.forEach(function iterateWarnings (warning) {
      log.warn(warning.packagePath + '\r\n' + warning.messages.join('\r\n'))
      console.log('')
    })
  }

  if (cmdOutput === HAS_ERROR) {
    return log.error(errorLog.join('\r\n'))
  }
  console.log()
})
