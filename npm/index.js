
var shell = require('shelljs');
var utils = require('./../libs/utils');

var NPMOps = (function () {
  'use strict';

  function executeInstall(done) {
    utils.log.info('Installing NPM Modules. It may take some time...');

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
