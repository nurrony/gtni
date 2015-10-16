var shell = require('shelljs');
var utils = require('./../libs/utils');

var GitClone = (function () {

  'use strict';

  function executeClone(argv, done) {

    var args = '';
    console.log('Under develop');
    //var dir = utils.cloneDir();
    if (argv.b) {
      args = '-b ' + argv.b;
    } else if (argv.repo) {
      args = argv.repo;
    } else {
      args = utils.prepareArguments(argv);
    }
    console.log('args', args);
    /*shell.exec('git clone ' + args, {
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
