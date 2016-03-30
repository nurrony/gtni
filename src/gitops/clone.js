var shell = require('shelljs');
var utils = require('./../libs/utils');

var GitClone = (function GitCloneWrapper() {
  function executeClone(argv, done) {
    var args = '';
    var cmd = '';
    var currentPath = shell.pwd().trim();
    var cloneDirName = argv._[2] || utils.getRepoName(argv._[1]);
    var clonePath = currentPath + '/' + cloneDirName;
    var repoNPath = argv._[1] + ' ' +
      (typeof argv._[2] === 'undefined' ? '' : argv._[2]);

    if (argv.b) {
      args = '-b ' + argv.b + (argv.v ? ' -v' : '');
    } else {
      args = utils.prepareArguments(argv);
    }

    cmd = 'git clone ' + args + ' ' + repoNPath;

    utils.isExists(clonePath, function(err, stat) {
      if (err && err.code === 'ENOENT') {
        utils.log.info('Cloning your repository...');
        shell.exec(cmd, {
          silent: true,
          async: true
        }, function cloneFinished(exitCode, output) {
          if (!exitCode) {
            return done(null, output);
          }
          return done(exitCode, output);
        });
      } else if (stat.isDirectory()) {
        return done(true, cloneDirName + ' directory is already exists');
      }
    });
  }

  return {
    clone: executeClone
  };
})();

module.exports = GitClone;
