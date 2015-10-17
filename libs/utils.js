'use strict';
var shell = require('shelljs');
var chalk = require('chalk');
var lodash = require('lodash');
var urlParser = require('git-url-parse');

var Utils = (function () {

  var logger = {
    info: function (msg) {
      console.log(chalk.cyan(msg));
    },
    error: function (msg) {
      console.log(chalk.bold.underline.red('Error'), '\n', chalk.red(msg));
    },
    success: function (msg) {
      console.log(chalk.green(msg));
    }
  };

  function checkForGit() {
    return shell.which('git');
  }

  function getRepoName(repoUrl) {
    return urlParser(repoUrl).name;
  }

  function isUnderGitRepo() {
    return shell.exec('git rev-parse --is-inside-work-tree', {silent: true}).output;
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

    return lodash.map(gitOptions, function (value, key) {
      if (typeof value === 'boolean') {
        return key.length > 1 ? '--' + key : '-' + key;
      } else {
        return key.length > 1 ? '--' + key + ' ' + value : '-' + key + ' ' + value;
      }
    }).join(' ');
  }

  return {
    isGitInstalled: checkForGit,
    isGitRepo: isUnderGitRepo,
    prepareArguments: prepareArguments,
    getRepoName: getRepoName,
    log: logger
  };

})();

module.exports = Utils;
