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

    utils.packagePaths(function (error, packagePaths) {
      if (error) {
        return done(error);
      }
      if (!packagePaths.length) {
        return done(true, 'package.json not found. Please run gtni from your root ' +
          'directory where package.json resides.');
      }
      async.each(packagePaths, function (path, cb) {
        console.log(path);
        return cb(false);
      }, function (err) {
        if (err) {
          return done(err);
        }
        return done(null, 'done');

      });
      //return npmops.install(done);
    });
  } else {

    utils.packagePaths(function (error, packagePaths) {
      if (error) {
        return done(error);
      }
      if (!packagePaths.length) {
        return done(true, 'package.json not found. Please run gtni from your root ' +
          'directory where package.json resides.');
      }
      async.each(packagePaths, function (path, cb) {
        console.log(path);
        return cb(false);
      }, function (err) {
        if (err) {
          return done(err);
        }
        return done(null, 'done');

      });
    });
  }
}

async.waterfall([
  executeGitOperation,
  installNPMPackages
], function (err, cmdOutput) {
  if (err) {
    return utils.log.error(cmdOutput);
  }

  return utils.log.success('npm modules installed successfully!!!');
});

