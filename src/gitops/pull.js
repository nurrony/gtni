import shell from 'shelljs';
import utils from './../libs/utils';

export default function pull(argv, done) {
  let args = '';
  const branchToPull = argv.b || false;
  const repoToPull = argv.repo || false;

  if (utils.isGitRepo()) {
    utils.log.info('Pulling ' + ((!branchToPull) ? 'current' : branchToPull) + ' branch...');

    if (branchToPull) {
      args = (argv.v ? '-v ' : '') + 'origin ' + branchToPull;
    } else if (repoToPull) {
      args = (argv.v ? '-v ' : '') + repoToPull;
    } else {
      args = utils.prepareArguments(argv);
    }

    shell.exec('git pull ' + args, {
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
