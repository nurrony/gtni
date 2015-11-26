
var shell = require('shelljs');
var utils = require('./../libs/utils');

var GitPull = (function GitPullWrapper() {
  function executePull(argv, done) {
    var args = '';
    var branchToPull = argv.b || false;
    var repoToPull = argv.repo || false;

    if (utils.isGitRepo()) {
      utils.log.info('Pulling Git Repository...');

      if (branchToPull) {
        args = 'origin ' + branchToPull;
      } else if (repoToPull) {
        args = repoToPull;
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
    }
  }

  return {
    pull: executePull
  };
})();

module.exports = GitPull;
