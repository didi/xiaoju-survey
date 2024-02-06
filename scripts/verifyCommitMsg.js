const fs = require('fs');
const chalk = require('chalk');

const commitMessage = fs.readFileSync('.git/COMMIT_EDITMSG', 'utf-8').trim();

const commitRE =
  /^(revert: )?(wip|release|feat|fix|polish|docs|style|refactor|perf|test|workflow|ci|chore|types|build)(\(.+\))?: .{1,50}/

if (!commitRE.test(commitMessage)) {
  console.log()
  console.error(chalk.red('invalid commit message format.'))
  console.log()
  process.exit(1)
}