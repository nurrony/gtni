#!/usr/bin/env node

var shellConfig = require('./shellconfig');
var shell = require('shelljs');
var waterfall = require('async-waterfall');
var each = require('async-each');
var utils = require('./libs/utils');
var gitops = require('./gitops');
var npmops = require('./npm');

/**
 * User defined variables
 * */
var errorLog = [];
var NO_ERROR = 200;
var HAS_ERROR = 400;
var NO_PACKAGE_FOUND = 404;

var argv = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .version(function printGtniVersion() {
    'use strict';
    return 'gtni version ' + require('./package').version;
  })
  .alias('v', 'version')
  .command('pull', 'git pull and install npm dependencies',
  function pullSubCommands(yargs) {
    'use strict';

    argv = yargs.option({
      branch: {
        alias: 'b',
        type: 'string',
        'default': false,
        description: 'remote branch name to pull'
      },
      repository: {
        alias: 'repo',
        type: 'string',
        'default': false,
        description: 'The "remote" repository that is the source'
      }
    }).help('help').argv;
  })
  .command('fetch', 'git fetch and install npm dependencies',
  function fetchSubCommands(yargs) {
    'use strict';

    argv = yargs.option({
      branch: {
        alias: 'b',
        type: 'string',
        'default': false,
        description: 'remote branch name to fetch'
      },
      repository: {
        alias: 'repo',
        type: 'string',
        'default': false,
        description: 'The "remote" repository that is the source'
      }
    }).help('help').argv;
  })
  .command('clone', 'clone a git repository and install ' +
  'npm dependencies', function cloneSubCommands(yargs) {
    'use strict';

    argv = yargs.option({
      branch: {
        alias: 'b',
        type: 'string',
        'default': false,
        description: 'remote branch name to clone'
      }
    }).help('help').argv;
  })
  .demand(1, 'must provide a valid command')
  .example(
  '[NODE_ENV=<env>] $0 pull [git-options]',
  'git pull and install npm packages')
  .help('h')
  .alias('h', 'help')
  .argv;

shell.config = shellConfig;

function executeGitOperation(done) {
  'use strict';

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
  'use strict';

  var currentBranchName = utils.currentBranchName();
  var checkoutBranchName = (argv.b &&
  typeof argv.b === 'string' &&
  currentBranchName !== checkoutBranchName) ? argv.b : false;

  var branchName = checkoutBranchName ?
    utils.checkOutBranch(checkoutBranchName) : currentBranchName;

  utils.log.info('listing all package.json files in this project...');

  utils.packagePaths(branchName, function packageListCompleted(
    error,
    packagePaths
  ) {
    if (error) {
      return done(error);
    }

    // is there any package.json?
    if (!packagePaths.length) {
      return done(
        NO_PACKAGE_FOUND,
        'No package.json not found in your project. ' +
        'Skipping dependency installation.'
      );
    }

    utils.log.info('Installing npm modules for branch ' +
      branchName + '. It may take some time...');

    each(packagePaths, function packageIterator(path, cb) {
      shell.cd(path);

      return npmops.install(function installPackage(exitCode, output) {
        if (exitCode || output.toLowerCase().indexOf('failed') !== -1) {
          errorLog.push(path + 'package.json');
          if (argv.v) {
            utils.log.info('Log for ' + path + 'package.json');
            utils.log.error(output);
          }
        }

        if (argv.v) {
          utils.log.info('Log for ' + path + 'package.json');
          utils.log.info(output);
        }

        return cb(false);
      });
    }, function installCompleted(err) {
      if (checkoutBranchName) {
        utils.checkOutBranch(currentBranchName);
      }

      if (err) {
        return done(err);
      }

      if (errorLog.length) {
        return done(null, HAS_ERROR);
      }

      return done(null, NO_ERROR);
    });
  });
}

function installNPMPackages(gitOpOutput, done) {
  'use strict';

  var cmd = argv._[0];
  var cloneDir = '';

  utils.log.success('git ' + cmd + ' ends successfully!!');
  if (argv.v) {
    utils.log.info(gitOpOutput);
  }

  if (cmd === 'clone') {
    cloneDir = argv._[2] || utils.getRepoName(argv._[1]);
    shell.cd(cloneDir + '/');
  }

  return executeNPMInstall(done);
}

waterfall([
  executeGitOperation,
  installNPMPackages
], function allDone(err, cmdOutput) {
  'use strict';

  if (err === NO_PACKAGE_FOUND) {
    return utils.log.info(cmdOutput);
  }

  if (err) {
    return utils.log.error(cmdOutput);
  }

  if (cmdOutput === HAS_ERROR) {
    utils.log.info('npm modules installation ' +
      'has finished with error(s). ' +
      'Please check npm-debug.log file in ' +
      'reported package.json directory');
    return utils.log.error(errorLog.join('\r\n'));
  }

  return utils.log.success('npm modules installed successfully!!!');
});

