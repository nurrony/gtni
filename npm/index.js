
var shell = require('shelljs');

var NPMOps = (function () {
  'use strict';

  function executeInstall(done) {
    console.log('Installing NPM Modules...'.blue);

    shell.exec('npm i ', {
      silent: true,
      async: true
    }, function (exitCode, npmOutput) {
      if (!exitCode) {
        return done(null, npmOutput);
      }
      return done(exitCode, npmOutput);
    });
  }

  return {
    install: executeInstall
  }
})();

module.exports = NPMOps;
