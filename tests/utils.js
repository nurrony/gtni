import tape from 'tape';
import utils from '../libs/utils'

tape('should get corrent repo name', (test) => {
  const repoURL = 'git@github.com:nmrony/gtni.git'
  const input = utils.getRepoName(repoURL)
  const output = 'gtni'
  
  test.equal(input, output)
  test.end();
})



