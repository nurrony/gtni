#!/usr/bin/env node

import shellConfig from './shellconfig';
/*import shell from 'shelljs');
import waterfall from 'async-waterfall';
import each from 'async-each';
import utils from './libs/utils';
import gitops from './gitops';
import npmops from './npm';*/
import { pullSubCommands, fetchSubCommands, cloneSubCommands } from './helpers';
/**
 * User defined variables
 * */
const errorLog = [];
const warningLog = [];
const NO_ERROR = 200;
const HAS_ERROR = 400;
const HAS_WARNING = 422;
const NO_PACKAGE_FOUND = 404;

const argv = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .command('pull', 'git pull and install npm dependencies', pullSubCommands)
  .command('fetch', 'git fetch and install npm dependencies', fetchSubCommands)
  .command('clone', 'clone a git repository and install npm dependencies', cloneSubCommands)
  .demand(1, 'must provide a valid command')
  .example(
  '[NODE_ENV=<env>] $0 pull [git-options]',
  'git pull and install npm packages')
  .help('h')
  .alias('h', 'help')
  .version(() => 'gtni version ' + require('../package.json').version)
  .argv;

shell.config = shellConfig;
