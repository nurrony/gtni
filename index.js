#!/usr/bin/env node

'use strict';

var shellConfig = require('./shellconfig');
var shell = require('shelljs');
var async = require('async');
var utils = require('./libs/utils');
var gitops = require('./gitops');
var npmops = require('./npm');

var argv = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .version(function () {
    return 'gtni version ' + require('./package').version;
  })
  .alias('v', 'version')
  .command('pull', 'git pull and install npm dependencies', function (yargs) {
    argv = yargs.option({
      'branch': {
        alias: 'b',
        type: 'string',
        default: false,
        description: 'remote branch name to pull'
      },
      'repository': {
        alias: 'repo',
        type: 'string',
        default: false,
        description: 'The "remote" repository that is the source'
      }
    }).help('help').argv;
  })
  .command('fetch', 'git fetch and install npm dependencies', function (yargs) {
    argv = yargs.option({
      'branch': {
        alias: 'b',
        type: 'string',
        default: false,
        description: 'remote branch name to fetch'
      },
      'repository': {
        alias: 'repo',
        type: 'string',
        default: false,
        description: 'The "remote" repository that is the source'
      }
    }).help('help').argv;
  })
  .command('clone', 'clone a git repository and install ' +
  'npm dependencies', function (yargs) {
    argv = yargs.option({
      'branch': {
        alias: 'b',
        type: 'string',
        default: false,
        description: 'remote branch name to clone'
      }
    }).help('help').argv;
  })
  .demand(1, 'must provide a valid command')
  .example('[NODE_ENV=<env>] $0 pull [git-options]', 'git pull and install npm packages')
  .help('h')
  .alias('h', 'help')
  .argv;

shell.config = shellConfig;

var errorLog = [];
var NO_ERROR = 200;
var HAS_ERROR = 400;
var NO_PACKAGE_FOUND = 404;

function executeGitOperation(done) {
  var command = argv._[0];
  switch (command) {
    case 'pull':
      return gitops.pull(argv, done);
    case 'fetch':
      return gitops.fetch(argv, done);
    case 'clone':
      return gitops.clone(argv, done);
    default:
      return require('yargs').showHelp();
  }
}

function executeNPMInstall(done) {
  utils.packagePaths(function (error, packagePaths) {

    if (error) {
      return done(error);
    }
    //is there any package.json?
    if (!packagePaths.length) {
      return done(NO_PACKAGE_FOUND, 'No package.json not found in your project. Skipping dependency installation.');
    }

    async.each(packagePaths, function (path, cb) {
      shell.cd(path);
      return npmops.install(function (exitCode, output) {
        if (exitCode) {
          errorLog.push(path + '/package.json');
        }
        return cb(false);
      });
    }, function (err) {
      if (errorLog.length) {
        return done(null, HAS_ERROR);
      }
      return done(null, NO_ERROR);

    });
  });
}

function installNPMPackages(gitOpOutput, done) {
  var cmd = argv._[0];
  utils.log.success('git ' + cmd + ' ends successfully!!');
  if (argv.v) {
    utils.log.info(gitOpOutput);
  }

  utils.log.info('Looking for package.json file in current directory');

  if (cmd === 'clone') {
    var cloneDir = argv._[2] || utils.getRepoName(argv._[1]);
    shell.cd(cloneDir + '/');
    return executeNPMInstall(done)
  } else {
    return executeNPMInstall(done);
  }
}

async.waterfall([
  executeGitOperation,
  installNPMPackages
], function (err, cmdOutput) {

  if (err === NO_PACKAGE_FOUND) {
    return utils.log.info(cmdOutput);
  }

  if (err) {
    return utils.log.error(cmdOutput);
  }

  return utils.log.success('npm modules installed successfully!!!');
});

