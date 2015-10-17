'use strict';
var shell = require('shelljs');
var colors = require('colors');
var lodash = require('lodash');
var urlParser = require('git-url-parse');

var Utils = (function () {

  function checkForGit() {
    return shell.which('git');
  }

  function getRepoName(repoUrl) {
    return urlParser(repoUrl).name;
  }

  function isUnderGitRepo() {
    return shell.exec('git rev-parse --is-inside-work-tree', {silent: true}).output;
  }

  function printLog(type, output) {
    console.log(type.bold.underline.blue + ' Log'.bold.underline.blue);
    console.log(output.magenta);
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
    printLog: printLog,
    getRepoName: getRepoName
  };

})();

module.exports = Utils;
