var shell = require('shelljs');
var utils = require('./../libs/utils');

var GitClone = (function () {

  'use strict';

  function executeClone(argv, done) {

    var args = '';
    var repoNPath = argv._[1] + ' ' + (typeof argv._[2] === 'undefined' ? '' : argv._[2]);
    console.log('Cloning your repository...'.blue);

    if (argv.b) {
      args = '-b ' + argv.b;
    } else {
      args = utils.prepareArguments(argv);
    }

    shell.exec('git clone ' + args + ' ' + repoNPath, {
      silent: true,
      async: true
    }, function (exitCode, output) {
      if (!exitCode) {
        return done(null, output);
      }
      return done(exitCode, output);
    });
  }

  return {
    clone: executeClone
  }
})();

module.exports = GitClone;
