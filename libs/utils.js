'use strict';
var shell = require('shelljs');
var chalk = require('chalk');
var lodash = require('lodash');
var urlParser = require('git-url-parse');
var fs = require('fs');
var async = require('async');
var globule = require('globule');

var Utils = (function () {

  var logger = {
    info: function (msg) {
      console.log(chalk.cyan(msg));
    },
    error: function (msg) {
      console.log(chalk.bold.underline.red('Error'), '\n', chalk.red(msg));
    },
    success: function (msg) {
      console.log(chalk.green(msg));
    }
  };

  function checkForGit() {
    return shell.which('git');
  }

  function gotoRootDirectory(done) {
    shell.exec('git rev-parse --show-toplevel', {silent: true, async: true}, function(exitCode, output) {
      if(exitCode){
        return done(output);
      }
      output = output.trim();
      shell.cd(output, {silent:true});
      return done(null, output);
    });
  }

  function directoryWithPackageJSON(output, done) {
    var files = globule.find({
      src: ['**/package.json', '!**/node_modules/**/package.json'],
      prefixBase: true,
      srcBase: output
    }).map(function (file) {
      return file.replace('package.json', ' ').trim();
    });
    return done(null, files);
  }

  function getRepoName(repoUrl) {
    return urlParser(repoUrl).name;
  }

  function isUnderGitRepo() {
    return shell.exec('git rev-parse --is-inside-work-tree', {silent: true}).output;
  }

  function isFileExists(filewithPath, done) {
    return fs.exists(filewithPath, done);
  }

  function prepareArguments(args) {

    var gitOptions = lodash.omit(args, [
      '$0',
      'h',
      'help',
      '_',
      'b',
      'branch',
      'repo',
      'repository'
    ]);

    return lodash.map(gitOptions, function (value, key) {
      if (typeof value === 'boolean') {
        return key.length > 1 ? '--' + key : '-' + key;
      } else {
        return key.length > 1 ? '--' + key + ' ' + value : '-' + key + ' ' + value;
      }
    }).join(' ');
  }

  function getPackageJSONPath(cb) {
    async.waterfall([
      gotoRootDirectory,
      directoryWithPackageJSON
    ], function (err, paths) {
      if (err) {
        return cb(err);
      }
      return cb(null, paths);
    })
  }

  return {
    isGitInstalled: checkForGit,
    isGitRepo: isUnderGitRepo,
    prepareArguments: prepareArguments,
    getRepoName: getRepoName,
    isFileExists: isFileExists,
    log: logger,
    packagePaths: getPackageJSONPath
  };

})();

module.exports = Utils;
