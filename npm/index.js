
var shell = require('shelljs');

var NPMOps = (function NPMOpsWrapper() {
  function executeInstall(done) {
    var env = process.env.NODE_ENV ? '--' + process.env.NODE_ENV : '';

    shell.exec('npm i ' + env, {
      silent: true,
      async: true
    }, function NPMInstallCompleted(exitCode, npmOutput) {
      return done(exitCode, npmOutput);
    });
  }

  return {
    install: executeInstall
  };
})();

module.exports = NPMOps;
