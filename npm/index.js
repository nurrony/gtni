
var shell = require('shelljs');
var utils = require('./../libs/utils');

var NPMOps = (function () {
  'use strict';

  function executeInstall(done) {

    var env = process.env.NODE_ENV ? '--' + process.env.NODE_ENV : '';

    utils.log.info('Installing npm modules. It may take some time...');

    shell.exec('npm i ' + env, {
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
