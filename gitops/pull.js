
var shell = require('shelljs');
var utils = require('./../libs/utils');

var gpull = (function () {

  'use strict';

  function executePull(argv, done) {
    if (utils.isGitRepo()) {
      console.log('Pulling Git Repository...'.blue);
      var args = '';
      if (argv.b){
        args = 'origin ' + argv.b;
      } else if (argv.repo) {
        args = argv.repo;
      } else {
        args = utils.prepareArguments(argv);
      }
      
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

module.exports = gpull;
