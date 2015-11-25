
var shell = require('shelljs');
var utils = require('./../libs/utils');

var GitPull = (function () {

  'use strict';

  function executePull(argv, done) {
    if (utils.isGitRepo()) {
      utils.log.info('Pulling Git Repository...');
      var args = '';
      if (argv.b){
        args = 'origin ' + argv.b;
      } else if (argv.repo) {
        args = argv.repo;
      } else {
        args = utils.prepareArguments(argv);
      }

      return done(null, "hello world");

      shell.exec('git pull ' + args, {
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
    pull: executePull
  }
})();

module.exports = GitPull;
