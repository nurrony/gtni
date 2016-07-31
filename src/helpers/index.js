export function pullSubCommands (yargs) {
  return yargs.option({
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
  }).help('h').alias('h', 'help').argv
}

export function fetchSubCommands (yargs) {
  return yargs.option({
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
  }).help('h').alias('h', 'help').argv
}

export function cloneSubCommands (yargs) {
  return yargs.option({
    branch: {
      alias: 'b',
      type: 'string',
      'default': false,
      description: 'remote branch name to clone'
    },
    verbose: {
      alias: 'v',
      type: 'boolean',
      'default': false,
      description: 'verbose '
    }
  }).help('h').alias('h', 'help').argv
}
