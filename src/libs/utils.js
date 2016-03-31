import shell from 'shelljs'
import chalk from 'chalk'
import omit from 'lodash/omit'
import map from 'lodash/map'
import gitUrlParser from 'git-url-parse'
import fs from 'fs'
import waterfall from 'async-waterfall'

const log = {
  info(msg) {
    console.log(chalk.cyan(msg));
  },
  error(msg) {
    console.log(chalk.bold.underline.red('Error'), '\r\n', chalk.red(msg));
  },
  warn(msg) {
    console.log(chalk.yellow(msg));
  },
  success(msg) {
    console.log(chalk.green(msg));
  }
};

function isGitInstalled() {
  return shell.which('git');
}

function gotoRootDirectory(done) {
  shell.exec('git rev-parse --show-toplevel', {
    silent: true,
    async: true
  }, function cwdToRootCompleted(exitCode, output) {
    var trimmedOutput = output.trim();

    if (exitCode) {
      return done(output);
    }

    shell.cd(trimmedOutput, {
      silent: true
    });

    return done(null, trimmedOutput);
  });
}

function listPackageJsonFiles(branch, base, done) {
  var listArray;
  listArray = shell.exec('git ls-tree -r ' +
      '--name-only ' + branch +
      '  | grep \'package.json\'', {
        silent: true
      })
    .output
    .trim()
    .replace(/(\r\n|\n|\r)/gm, ',')
    .split(',')
    .map(function addBasePath(path) {
      return base + '/' + path.replace('package.json', ' ').trim();
    });

  return done(null, listArray);
}

function getRepoName(repoUrl) {
  return gitUrlParser(repoUrl).name;
}

function isGitRepo() {
  return shell.exec('git rev-parse --is-inside-work-tree', {
    silent: true
  }).output.trim();
}

function currentBranchName() {
  return shell.exec('git rev-parse --abbrev-ref HEAD', {
    silent: true
  }).output.trim();
}

function checkOutBranch(branch) {
  shell.exec('git checkout ' + branch, {
    silent: true
  }).output.trim();
  return branch;
}

function prepareArguments(args) {
  var gitOptions = omit(args, [
    '$0',
    'h',
    'help',
    '_',
    'b',
    'branch',
    'repo',
    'repository'
  ]);

  return map(gitOptions, function appendBasePath(value, key) {
    if (typeof value === 'boolean') {
      if (value) {
        return key.length > 1 ? '--' + key : '-' + key;
      } else {
        return;
      }
    }

    if (key.length > 1) {
      return '--' + key + ' ' + value;
    }

    return '-' + key + ' ' + value;
  }).join(' ');
}

function packagePaths(branchName, cb) {
  waterfall([
    gotoRootDirectory, (basePath, callback) => {
      return listPackageJsonFiles(branchName, basePath, callback);
    }
  ], (err, paths) => {
    if (err) {
      return cb(err);
    }
    return cb(null, paths);
  });
}

const Utils = {
  isGitInstalled,
  isGitRepo,
  prepareArguments,
  getRepoName,
  log,
  packagePaths,
  checkOutBranch,
  currentBranchName,
  isExists: fs.stat
};

export default Utils;
