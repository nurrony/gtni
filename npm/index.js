
var shell = require('shelljs');
var utils = require('./../libs/utils');

var NPMOps = (function () {
  'use strict';

  function executeInstall(done) {

    var env = process.env.NODE_ENV ? '--' + process.env.NODE_ENV : '';

    shell.exec('npm i ' + env, {
      silent: true,
      async: true
    }, function (exitCode, npmOutput) {
      return done(exitCode, npmOutput);
    });
  }

  return {
    install: executeInstall
  }
})();

module.exports = NPMOps;
