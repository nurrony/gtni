
var shell = require('shelljs');
var utils = require('./../libs/utils');

var GitFetch = (function GitFetchWrapper() {
  'use strict';

  function executeFetch(argv, done) {
    var args = '';
    var branchToFetch = argv.b || false;
    var repoToFetch = argv.repo || false;

    if (utils.isGitRepo()) {
      utils.log.info('Fetching Git Repository...');

      if (branchToFetch) {
        args = 'origin ' + branchToFetch;
      } else if (repoToFetch) {
        args = repoToFetch;
      } else {
        args = utils.prepareArguments(argv);
      }

      shell.exec('git fetch ' + args, {
        silent: true,
        async: true
      }, function fetchCompleted(exitCode, output) {
        if (!exitCode) {
          return done(null, output);
        }

        return done(exitCode, output);
      });
    }
  }

  return {
    fetch: executeFetch
  };
})();

module.exports = GitFetch;
