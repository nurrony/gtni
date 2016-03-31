  import shell from 'shelljs';

export default function npmInstall(done) {
  const env = process.env.NODE_ENV ? '--' + process.env.NODE_ENV : '';

  shell.exec('npm i --no-spin --no-progress ' + env, {
    silent: true,
    async: true
  }, (exitCode, npmOutput) => {
    return done(exitCode, npmOutput);
  });
}
