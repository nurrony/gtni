import tape from 'tape'
import utils from '../src/libs/utils'

tape('should get corrent repo name', (nested) => {
  nested.test('from ssh url', (t1) => {
    const input = 'git@github.com:nmrony/gtni.git'
    const result = utils.getRepoName(input)
    const expectation = 'gtni'
    t1.plan(1)
    t1.equal(result, expectation)
  })

  nested.test('from HTTPS url', (t1) => {
    const input = 'https://github.com/nmrony/gtni.git'
    const result = utils.getRepoName(input)
    const expectation = 'gtni'
    t1.plan(1)
    t1.equal(result, expectation)
  })
  nested.end()
})

tape('prepareArguments return git options', (test) => {
  const input = {
    h: true,
    help: 'true',
    all: true,
    b: 'test-branch',
    branch: 'test-branch',
    debug: true,
    d: true,
    u: true,
    $0: ['test']
  }
  const result = utils.prepareArguments(input)
  const expectation = '--all -v -u'
  test.equal(result, expectation)
  test.end()
})
