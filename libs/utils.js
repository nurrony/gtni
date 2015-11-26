'use strict';
var shell = require('shelljs');
var chalk = require('chalk');
var lodash = require('lodash');
var gitUrlParser = require('git-url-parse');
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

  function listPackageJsonFiles(branch, base, done) {
    var listArray;
    listArray = shell.exec('git ls-tree -r --name-only ' + branch +
      '  | grep \'package.json\'', {
      silent: true
    }).output.trim().replace(/(\r\n|\n|\r)/gm, ',').split(',');

    console.log('before map', listArray);
    listArray = listArray.map(function addBasePath(path) {
        return base + '/' + path.replace('package.json', ' ').trim();
      });
    return done(null, listArray);
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
    return gitUrlParser(repoUrl).name;
  }

  function isUnderGitRepo() {
    return shell.exec('git rev-parse --is-inside-work-tree', {silent: true}).output;
  }

  function getCurrentBranchName() {
    return shell.exec('git rev-parse --abbrev-ref HEAD', {silent: true}).output.trim();
  }

  function checkOutToBranch(branch) {
    console.log('checking out');
    shell.exec('git checkout ' + branch, {silent: true}).output.trim();
    return branch;
  }

  function isFileExists(fileWithPath, done) {
    return fs.exists(fileWithPath, done);
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

  function getPackageJSONPath(branchName, cb) {
    async.waterfall([
      gotoRootDirectory,
      function listingJSONFiles(basePath, cb) {
        return listPackageJsonFiles(branchName, basePath, cb);
      }
      //directoryWithPackageJSON
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
    packagePaths: getPackageJSONPath,
    checkOutBranch: checkOutToBranch,
    currentBranchName: getCurrentBranchName
  };

})();

module.exports = Utils;
