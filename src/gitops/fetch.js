import shell from 'shelljs';
import utils from './../libs/utils';

export default function fetch(argv, done) {
  let args = '';
  let cmd = '';
  const branchToFetch = argv.b || false;
  const repoToFetch = argv.repo || false;

  if (utils.isGitRepo()) {
    utils.log.info('fetching ' + ((!branchToFetch) ? 'current' : branchToFetch) + ' branch...');

    if (branchToFetch) {
      args = (argv.v ? '-v ' : '') + 'origin ' + branchToFetch;
    } else if (repoToFetch) {
      args = +(argv.v ? '-v ' : '') + repoToFetch;
    } else {
      args = utils.prepareArguments(argv);
    }

    cmd = 'git fetch ' + args;

    shell.exec(cmd, {
      silent: true,
      async: true
    }, (exitCode, output, errOutput) => {
      if (!exitCode) {
        return done(null, output);
      }

      return done(exitCode, errOutput);
    });
  } else {
    return done(true, 'Current directory is not a git repository');
  }
}
