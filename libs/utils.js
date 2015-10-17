'use strict';
var shell = require('shelljs');
var colors = require('colors');
var lodash = require('lodash');
var url = require('url');

var Utils = (function () {

  function checkForGit() {
    return shell.which('git');
  }

  function cloneDirectory(gitargs) {
    var cmd = (gitargs || []).shift();
    var url = parseUrl(gitargs[0])
  }

  function isUnderGitRepo() {
    return shell.exec('git rev-parse --is-inside-work-tree', {silent: true}).output;
  }

  function printLog(type, output) {
    console.log(type.bold.underline.blue + ' Log'.bold.underline.blue);
    console.log(output.magenta);
  }

  function prepareArguments(args) {
    return Object.keys(lodash.omit(args, [
      '$0',
      'h',
      'help',
      '_',
      'b',
      'branch',
      'repo',
      'repository'
    ])).map(function (value) {
      return value.length > 1 ? '--' + value : '-' + value;
    }).slice('').join(' ');
  }

  return {
    isGitInstalled: checkForGit,
    isGitRepo: isUnderGitRepo,
    prepareArguments: prepareArguments,
    printLog: printLog,
    cloneDir: cloneDirectory
  };

})();

module.exports = Utils;
