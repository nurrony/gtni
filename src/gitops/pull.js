
var shell = require('shelljs');
var utils = require('./../libs/utils');

var GitPull = (function GitPullWrapper() {

  function executePull(argv, done) {
    var args = '';
    var branchToPull = argv.b || false;
    var repoToPull = argv.repo || false;

    if (utils.isGitRepo()) {
      utils.log.info('Pulling ' + ((!branchToPull) ? 'current': branchToPull) + ' branch...');

      if (branchToPull) {
        args = (argv.v ? '-v ' : '') + 'origin ' + branchToPull;
      } else if (repoToPull) {
        args = (argv.v ? '-v ' : '') + repoToPull;
      } else {
        args = utils.prepareArguments(argv);
      }

      shell.exec('git pull ' + args, {
        silent: true,
        async: true
      }, function pullCompleted(exitCode, output) {
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
    pull: executePull
  };
})();

module.exports = GitPull;
