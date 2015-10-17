#!/usr/bin/env node

'use strict';

var shellConfig = require('./shellconfig');
var colors = require('colors');
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
  'npm dependencies (coming soon)', function (yargs) {
    argv = yargs.option({
      'branch': {
        alias: 'b',
        type: 'string',
        default: false,
        description: 'remote branch name or SHA1 to clone'
      }
    }).help('help').argv;
  })
  .demand(1, 'must provide a valid command')
  .example('$0 pull [git-options]', 'git pull and install npm packages')
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
  console.log('Git '+ cmd +' ends successfully!!'.green);
  if (argv.v) {
    utils.printLog('git', gitOpOutput);
  }

  if (cmd === 'clone') {
    var cloneDir = argv._[2] || utils.getRepoName(argv._[1]);
    shell.cd(cloneDir + '/');
    return npmops.install(done);
  } else {
    return npmops.install(done);
  }
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

