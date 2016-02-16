var shell = require('shelljs');
var utils = require('./../libs/utils');

var GitClone = (function GitCloneWrapper() {
  'use strict';

  function executeClone(argv, done) {
    var args = '';
    var cmd = '';
    var repoNPath = argv._[1] + ' ' +
      (typeof argv._[2] === 'undefined' ? '' : argv._[2]);

    utils.log.info('Cloning your repository...');

    if (argv.b) {
      args = '-b ' + argv.b + (argv.v ? ' -v' : '');
    } else {
      args = utils.prepareArguments(argv);
    }

    cmd = 'git clone ' + args + ' ' + repoNPath;

    shell.exec(cmd, {
      silent: true,
      async: true
    }, function cloneFinished(exitCode, output) {
      if (!exitCode) {
        return done(null, output);
      }

      return done(exitCode, output);
    });
  }

  return {
    clone: executeClone
  };
})();

module.exports = GitClone;
