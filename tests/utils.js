import tape from 'tape';
import utils from '../libs/utils'

tape('should get corrent repo name', (nested) => {
  nested.test('from ssh url', (t1) => {
    const input = 'git@github.com:nmrony/gtni.git'
    const result = utils.getRepoName(input)
    const expection = 'gtni'
    t1.plan(1)
    t1.equal(result, expection);
  })

  nested.test('from HTTPS url', (t1) => {
    const input = 'https://github.com/nmrony/gtni.git'
    const result = utils.getRepoName(input)
    const expection = 'gtni'
    t1.plan(1)
    t1.equal(result, expection);
  })

  nested.end();
})

tape('prepareArguments return git options', (test) => {
  const input = {
    h: true,
    help: 'true',
    all: true,
    b: 'test-branch',
    branch: 'test-branch',
    u: true,
    $0: ['test']
  }
  const result = utils.prepareArguments(input);
  const expection = '--all -u'

  test.equal(result, expection);
  test.end();
})
