const chalk = require('chalk');
const { execSync } = require('child_process');

try {
  // 执行 server 目录的 lint
  execSync('cd server && npm run lint');
  console.log(chalk.green('Server lint passed successfully.'));

  // 执行 web 目录的 lint
  execSync('cd web && npm run lint');
  console.log(chalk.green('Web lint passed successfully.'));
} catch (error) {
  console.error('Lint failed:', error.message);
  process.exit(1);
}
