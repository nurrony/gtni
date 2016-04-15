import shell from 'shelljs';
import utils from './../libs/utils';

export default function clone(argv, done) {
  let args = '';
  let cmd = '';
  const currentPath = shell.pwd().trim();
  const cloneDirName = argv._[2] || utils.getRepoName(argv._[1]);
  const clonePath = currentPath + '/' + cloneDirName;
  const repoNPath = argv._[1] + ' ' +
    (typeof argv._[2] === 'undefined' ? '' : argv._[2]);

  if (argv.b) {
    args = '-b ' + argv.b + (argv.v ? ' -v' : '');
  } else {
    args = utils.prepareArguments(argv);
  }

  cmd = 'git clone ' + args + ' ' + repoNPath;
  utils.log.info('Cloning your repository...');
  shell.exec(cmd, {
    silent: true,
    async: true
  }, (exitCode, output, errOutput) => {
    if (!exitCode) {
      return done(null, output);
    }
    return done(exitCode, errOutput);
  });
}
