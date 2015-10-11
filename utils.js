'use strict';
var shell = require('shelljs');
var lodash = require('lodash');

var Utils = (function () {

  function checkForGit() {
    return shell.which('git');
  }

  function isUnderGitRepo() {
    return shell.exec('git rev-parse --is-inside-work-tree', {silent: true}).output;
  }

  function prepareArguments(args) {
    return Object.keys(lodash.omit(args, ['$0', 'h', 'help', '_']))
      .map(function (value) {
        return value.length > 1 ? '--' + value : '-' + value;
      }).slice('').join(' ');
  }

  return {
    isGitInstalled: checkForGit,
    isGitRepo: isUnderGitRepo,
    prepareArguments: prepareArguments
  };

})();

module.exports = Utils;
