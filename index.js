#!/usr/bin/env node

'use strict';

var shellConfig = require('./shellconfig');
var colors = require('colors');
var shell = require('shelljs');
var async = require('async');
var utils = require('./libs/utils');
var gitops = require('./gitops');

var argv = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .command('pull', 'pull a git repository and install npm dependencies', function (yargs) {
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
        description: 'The "remote" repository that is the source of a fetch or pull operation'
      }
    }).help('help').argv;
  })
  .command('fetch', 'fetch a git repository and install npm dependencies (coming soon)')
  .command('clone', 'clone a git repository and install ' +
  'npm dependencies (coming soon)', function (yargs) {
    argv = yargs.option('url', {
      alias: 'u',
      demand: true,
      description: 'git repository url to clone'
    }).help('help').argv;
  })
  .demand(1, 'must provide a valid command')
  .example('$0 pull [git-options]', 'pull current git repository and install npm dependencies')
  .help('h')
  .alias('h', 'help')
  .argv;

shell.config = shellConfig;


function executeGitOperation(done) {
  var command = argv._[0];
  switch (command) {
    case 'pull':
      return gitops.pull(argv, done);
  }
}

function installNPMPackages(gitOpOutput, done) {
  console.log('Git pull ends successfully!!'.green);
  if (argv.v) {
    utils.printLog('git', gitOpOutput);
  }
  console.log('Installing NPM Modules...'.blue);

  shell.exec('npm i ', {
    silent: true,
    async: true
  }, function (exitCode, npmOutput) {
    if (!exitCode) {
      if (argv.v) {
        utils.printLog('npm', npmOutput);
      }
      return done(null, npmOutput);
    }
    return done(exitCode, npmOutput);
  });
}

async.waterfall([
  executeGitOperation,
  installNPMPackages
], function (err, cmdOutput) {
  if (err) {
    console.log('Error Happened'.underline.red);
    console.log(cmdOutput.red);
    console.log('☹ ☹ ☹ ☹ ☹ ☹ ☹ ☹ ☹'.blue);
    return;
  }
  console.log('♫♫♫ Laa laa laa!! npm modules also installed!!!☺ ☺ ☺ ☺'.green);
});

