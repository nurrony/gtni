import tape from 'tape';
import utils from '../libs/utils'

tape('should get corrent repo name', (nested) => {
  nested.test('from ssh url', (t1) => {
    const repoURLSSH = 'git@github.com:nmrony/gtni.git'
    const output = utils.getRepoName(repoURLSSH)
    const result = 'gtni'
    t1.plan(1)
    t1.equal(output, result);
  })

  nested.test('from HTTPS url', (t1) => {
    const repoURLHTTPS = 'https://github.com/nmrony/gtni.git'
    const output = utils.getRepoName(repoURLHTTPS)
    const result = 'gtni'
    t1.plan(1)
    t1.equal(output, result);
  })

  nested.end();
})





