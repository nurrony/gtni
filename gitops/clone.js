var shell = require('shelljs');
var utils = require('./../libs/utils');

var GitClone = (function () {

  'use strict';

  function executeClone(argv, done) {

    var args = '';
    argv._.shift();
    var repoNpath = argv._.join(' ');
    console.log('Cloning your repository...');

    if (argv.b) {
      args = '-b ' + argv.b + ' ' + repoNpath;
    } else {
      args = utils.prepareArguments(argv);
    }

    /*shell.exec('git clone ' + args + ' ' + repoNpath, {
      silent: true,
      async: true
    }, function (exitCode, output) {
      if (!exitCode) {
        return done(null, output);
      }
      return done(exitCode, output);
    });*/
  }

  return {
    clone: executeClone
  }
})();

module.exports = GitClone;
