
import shell from 'shelljs';

const NPMOps = (function NPMOpsWrapper() {

  function executeInstall(done) {
    const env = process.env.NODE_ENV ? '--' + process.env.NODE_ENV : '';

    shell.exec('npm i --no-spin --no-progress ' + env, {
      silent: true,
      async: true
    }, (exitCode, npmOutput) => {
      return done(exitCode, npmOutput);
    });
  }

  return {
    install: executeInstall
  };
})();

module.exports = NPMOps;
