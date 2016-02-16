var shell = require('shelljs');
var chalk = require('chalk');
var lodash = require('lodash');
var gitUrlParser = require('git-url-parse');
var fs = require('fs');
var waterfall = require('async-waterfall');

var Utils = (function UtilsWrapper() {
  'use strict';

  var logger = {
    info: function infoFn(msg) {
      console.log(chalk.cyan(msg));
    },
    error: function errorFn(msg) {
      console.log(chalk.bold.underline.red('Error'), '\n', chalk.red(msg));
    },

    warn: function warn(msg) {
      console.log(chalk.yellow(msg));
    },
    success: function successFn(msg) {
      console.log(chalk.green(msg));
    }
  };

  function checkForGit() {
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

      shell.cd(trimmedOutput, { silent: true });

      return done(null, trimmedOutput);
    });
  }

  function listPackageJsonFiles(branch, base, done) {
    var listArray;
    listArray = shell.exec('git ls-tree -r ' +
      '--name-only ' + branch +
      '  | grep \'package.json\'', { silent: true })
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

  function isUnderGitRepo() {
    return shell.exec('git rev-parse --is-inside-work-tree', {
      silent: true
    }).output;
  }

  function getCurrentBranchName() {
    return shell.exec('git rev-parse --abbrev-ref HEAD', {
      silent: true
    }).output.trim();
  }

  function checkOutToBranch(branch) {
    shell.exec('git checkout ' + branch, { silent: true }).output.trim();
    return branch;
  }

  function isFileExists(fileWithPath, done) {
    return fs.exists(fileWithPath, done);
  }

  function prepareArguments(args) {
    var gitOptions = lodash.omit(args, [
      '$0',
      'h',
      'help',
      '_',
      'b',
      'branch',
      'repo',
      'repository'
    ]);

    return lodash.map(gitOptions, function appendBasePath(value, key) {
      if (typeof value === 'boolean') {
        if(value) {
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

  function getPackageJSONPath(branchName, cb) {
    waterfall([
      gotoRootDirectory,
      function findNListJSON(basePath, callback) {
        return listPackageJsonFiles(branchName, basePath, callback);
      }
    ], function listCompleted(err, paths) {
      if (err) {
        return cb(err);
      }
      return cb(null, paths);
    });
  }

  return {
    isGitInstalled: checkForGit,
    isGitRepo: isUnderGitRepo,
    prepareArguments: prepareArguments,
    getRepoName: getRepoName,
    isFileExists: isFileExists,
    log: logger,
    packagePaths: getPackageJSONPath,
    checkOutBranch: checkOutToBranch,
    currentBranchName: getCurrentBranchName
  };
})();

module.exports = Utils;
