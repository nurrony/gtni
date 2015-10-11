#!/usr/bin/env node

'use strict';
var shellConfig = require('./shellconfig');
var colors = require('colors');
var shell = require('shelljs');
var async = require('async');
var utils = require('./utils');
var argv = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .command('pull', 'pull a git repository')
  .command('fetch', 'fetch a git repository')
  .command('clone', 'clone a git repository', function (yargs) {
      argv = yargs.option('url', {
        alias: 'u',
        demand: true,
        description: 'git repository url to clone'
      }).help('help').argv;
    })
  .demand(1, 'must provide a valid command')
  .example('$0 pull [git-options]', 'pull the repository')
  .help('h')
  .alias('h', 'help')
  .epilog('Copyright ⓒ 2015')
  .argv;

shell.config = shellConfig;

function executePull(done) {
  if (utils.isGitRepo()) {
    var args = utils.prepareArguments(argv);
    shell.exec('git pull ' + args, {
      async: true,
      silent: true
    }, function (exitCode, output) {
      if(!exitCode){
        return done(null, output);
      }
      return done(exitCode, output);
    });
  }
}

function executeGitOperation(done) {
  var command = argv._[0];
  switch (command) {
    case 'pull':
      return executePull(done)
  }
}

function installNPMPackages(gitOpOutput, done) {
  console.log(gitOpOutput.cyan);
  console.log('Installing NPM Modules...'.yellow);

  shell.exec('npm i ', {
    async: true,
    silent: true
  }, function (exitCode, npmOutput) {
    if (!exitCode) {
      return done(null, npmOutput);
    }
    return done(exitCode, npmOutput);
  });
  return done(null, gitOpOutput);
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

