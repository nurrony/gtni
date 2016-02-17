
var shell = require('shelljs');
var utils = require('./../libs/utils');

var GitFetch = (function GitFetchWrapper() {
  'use strict';

  function executeFetch(argv, done) {
    var args = '';
    var cmd = '';
    var branchToFetch = argv.b || false;
    var repoToFetch = argv.repo || false;

    if (utils.isGitRepo()) {
      utils.log.info('Fetching ' + ((!branchToFetch) ? 'current': branchToFetch) + ' branch...');

      if (branchToFetch) {
        args = (argv.v ? '-v ' : '') + 'origin ' + branchToFetch;
      } else if (repoToFetch) {
        args = + (argv.v ? '-v ' : '') + repoToFetch ;
      } else {
        args = utils.prepareArguments(argv);
      }

      cmd = 'git fetch ' + args;

      shell.exec(cmd, {
        silent: true,
        async: true
      }, function fetchCompleted(exitCode, output) {
        if (!exitCode) {
          return done(null, output);
        }

        return done(exitCode, output);
      });
    } else {
      return done(true, 'Current directory is not a git repository');
    }
  }

  return {
    fetch: executeFetch
  };
})();

module.exports = GitFetch;
