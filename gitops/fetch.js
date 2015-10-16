
var shell = require('shelljs');
var utils = require('./../libs/utils');

var GitFetch = (function () {

  'use strict';

  function executeFetch(argv, done) {
    if (utils.isGitRepo()) {
      console.log('Fetching Git Repository...'.blue);
      var args = '';
      if (argv.b){
        args = 'origin ' + argv.b;
      } else if (argv.repo) {
        args = argv.repo;
      } else {
        args = utils.prepareArguments(argv);
      }

      shell.exec('git fetch ' + args, {
        silent: true,
        async: true
      }, function (exitCode, output) {
        if(!exitCode){
          return done(null, output);
        }
        return done(exitCode, output);
      });
    }
  }

  return {
    fetch: executeFetch
  }
})();

module.exports = GitFetch;
