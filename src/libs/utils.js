import waterfall from 'async-waterfall'
import chalk from 'chalk'
import gitUrlParser from 'git-url-parse'
import map from 'lodash.map'
import omit from 'lodash.omit'
import pathExists from 'path-exists'
import shell from 'shelljs'
export const log = {
  info (msg) {
    console.log(chalk.cyan(msg))
  },
  error (msg) {
    console.log(chalk.bold.underline.red('Error'), '\r\n', chalk.red(msg))
  },
  warn (msg) {
    console.log(chalk.yellow(msg))
  },
  success (msg) {
    console.log(chalk.green(msg))
  }
}

export function isGitInstalled () {
  return shell.which('git')
}

export function detectPackageManager (path) {
  const lockFilePath = `${path}yarn.lock`
  return pathExists.sync(lockFilePath)
}

export function gotoRootDirectory (done) {
  shell.exec(
    'git rev-parse --show-toplevel',
    {
      silent: true,
      async: true
    },
    function cwdToRootCompleted (exitCode, output) {
      var trimmedOutput = output.trim()

      if (exitCode) {
        return done(output)
      }

      shell.cd(trimmedOutput, {
        silent: true
      })

      return done(null, trimmedOutput)
    }
  )
}

export function listPackageJsonFiles (branch, base, done) {
  var listArray
  listArray = shell
    .exec('git ls-tree -r ' + '--name-only ' + branch + "  | grep 'package.json'", { silent: true })
    .stdout.trim()
    .replace(/(\r\n|\n|\r)/gm, ',')
    .split(',')
    .map(function addBasePath (path) {
      return base + '/' + path.replace('package.json', ' ').trim()
    })

  return done(null, listArray)
}

export function getRepoName (repoUrl) {
  return gitUrlParser(repoUrl).name
}

export function isGitRepo () {
  return shell
    .exec('git rev-parse --is-inside-work-tree', {
      silent: true
    })
    .stdout.trim()
}

export function currentBranchName () {
  return shell
    .exec('git rev-parse --abbrev-ref HEAD', {
      silent: true
    })
    .stdout.trim()
}

export function checkOutBranch (branch) {
  shell
    .exec('git checkout ' + branch, {
      silent: true
    })
    .stdout.trim()
  return branch
}

export function prepareArguments (args) {
  var gitOptions = omit(args, ['$0', 'h', 'help', '_', 'b', 'debug', 'version', 'v', 'branch', 'repo', 'repository'])

  return map(gitOptions, function appendBasePath (value, key) {
    if (typeof value === 'boolean' && !value) {
      return
    }

    if (typeof value === 'boolean' && value) {
      if (key === 'd') {
        key = 'v'
      }
      return key.length > 1 ? '--' + key : '-' + key
    } else {
      return key.length > 1 ? '--' + key + ' ' + value : '-' + key + ' ' + value
    }
  }).join(' ')
}

export function packagePaths (branchName, cb) {
  waterfall(
    [
      gotoRootDirectory,
      (basePath, callback) => {
        return listPackageJsonFiles(branchName, basePath, callback)
      }
    ],
    (err, paths) => {
      if (err) {
        return cb(err)
      }
      return cb(null, paths)
    }
  )
}
