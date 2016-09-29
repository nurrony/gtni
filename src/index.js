#!/usr/bin/env node

import shell from 'shelljs'
import yargs from 'yargs'
import waterfall from 'async-waterfall'
import each from 'async-each'

import shellConfig from './shellconfig'
import utils from './libs/utils'
import gitops from './gitops'
import npmInstall from './npm'
import {
  pullSubCommands,
  fetchSubCommands,
  cloneSubCommands
} from './helpers'

// User defined constants

const errorLog = []
const warningLog = []
const NO_ERROR = 200
const HAS_ERROR = 400
const HAS_WARNING = 422
const NO_PACKAGE_FOUND = 404

const argv = yargs.usage('Usage: $0 <command> [options]')
  .command('pull', 'git pull and install npm dependencies', pullSubCommands)
  .command('fetch', 'git fetch and install npm dependencies', fetchSubCommands)
  .command('clone', 'clone a git repository and install npm dependencies', cloneSubCommands)
  .demand(1, 'must provide a valid command')
  .example('[NODE_ENV=<env>] $0 pull [git-options]', 'git pull and install npm packages')
  .help('h').alias('h', 'help')
  .version(() => 'gtni version ' + require('../package.json').version).alias('v')
  .argv

shell.config = shellConfig

/**
 * Executes git operation
 * @param done
 * @returns {*}
 */
function executeGitOperation (done) {
  const command = argv._[ 0 ]
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
  const currentBranchName = utils.currentBranchName()
  const checkoutBranchName = (argv.b &&
    typeof argv.b === 'string' &&
    currentBranchName !== checkoutBranchName
  ) ? argv.b : false

  const branchName = checkoutBranchName ? utils.checkOutBranch(checkoutBranchName) : currentBranchName

  utils.log.info('listing all package.json files in this project...')

  utils.packagePaths(branchName, (error, packagePaths) => {
    if (error) {
      return done(error)
    }

    // is there any package.json?
    if (!packagePaths.length) {
      return done(
        NO_PACKAGE_FOUND,
        'No package.json not found in your project. ' +
        'Skipping dependency installation.'
      )
    }

    utils.log.info('installing npm modules for branch ' + branchName + ' which may take some time...')

    each(packagePaths, (path, cb) => {
      shell.cd(path)
      return npmInstall((exitCode, output) => {
        const currentWarning = output.match(/((warn).+)/igm) || []

        if (currentWarning && currentWarning.length) {
          warningLog.push({
            packagePath: path + 'package.json',
            messages: currentWarning
          })
        }

        if (exitCode || output.toLowerCase().indexOf('err!') !== -1) {
          errorLog.push(path + 'package.json')
        }

        if (argv.v) {
          utils.log.info('Log for ' + path + 'package.json')
          utils.log.info(output)
        }

        return cb(false)
      })
    }, (err) => {
      if (checkoutBranchName) {
        utils.checkOutBranch(currentBranchName)
      }

      if (err) {
        return done(err)
      }

      if (warningLog.length) {
        return done(null, HAS_WARNING)
      }

      if (errorLog.length) {
        return done(null, HAS_ERROR)
      }

      return done(null, NO_ERROR)
    })
  })
}

/**
 * Install NPM dependencies for a package.json
 * @param gitOpOutput
 * @param done
 */
function installNPMPackages (gitOpOutput, done) {
  const cmd = argv._[ 0 ]
  let cloneDir = ''

  utils.log.success('git ' + cmd + ' ends successfully!!')
  if (argv.v) {
    utils.log.info(gitOpOutput)
  }

  if (cmd === 'clone') {
    cloneDir = argv._[ 2 ] || utils.getRepoName(argv._[ 1 ])
    shell.cd(cloneDir + '/')
  }

  return executeNPMInstall(done)
}

waterfall([
  executeGitOperation,
  installNPMPackages
], (err, cmdOutput) => {
  if (err === NO_PACKAGE_FOUND) {
    return utils.log.info(cmdOutput)
  }

  if (err) {
    return utils.log.error(cmdOutput)
  }

  if (cmdOutput === HAS_WARNING) {
    utils.log.info('warnings given by npm during installing dependencies')
    warningLog.forEach(function iterateWarnings (warning) {
      utils.log.warn(warning.packagePath + '\r\n' + warning.messages.join('\r\n'))
      console.log('')
    })
  }

  if (cmdOutput === HAS_ERROR) {
    utils.log.info('npm modules installation ' +
      'has finished with error(s). ' +
      'Please check npm-debug.log file in ' +
      'reported package.json directory')
    return utils.log.error(errorLog.join('\r\n'))
  }

  return utils.log.success('npm dependencies installed successfully!!!')
})
