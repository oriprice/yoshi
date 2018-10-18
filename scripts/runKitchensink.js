const path = require('path');
const fs = require('fs-extra');
const globby = require('globby');
const tempy = require('tempy');
const execa = require('execa');
// const publishMonorepo = require('./publishMonorepo');

const tempDir =
  '/private/var/folders/37/9gk7z1357k740z7_6ftkk_hmcx5y8z/T/8dccc298634655590ad837bbbe4adb6e';

const projectDir = '/Users/ronena/Projects/yoshi/test/kitchensink';

fs.copySync(projectDir, tempDir);

// const cleanup = publishMonorepo({ verbose: true });

// const testRegistry = 'http://localhost:4873';

// const projects = globby.sync('*', {
//   cwd: path.join(__dirname, '../test'),
//   onlyFiles: false,
//   absolute: true,
// });

// projects.forEach(projectDir => {
// create temp dir
// const tempDir = tempy.directory();

// copy project
// fs.copySync(projectDir, tempDir);

// execa.shellSync(
//   `npx npm-auth-to-token -u user -p password -e user@example.com -r "${testRegistry}"`,
//   { cwd: tempDir },
// );

// execa.shellSync('npm install', { cwd: tempDir, stdio: 'inherit' });

// test `npx yoshi start`
const start = execa.shell(`npx yoshi start`, {
  cwd: tempDir,
  stdio: 'inherit',
});

execa.shellSync('npx wait-port 3000 -o silent');
execa.shellSync('npx wait-port 3200 -o silent');

execa.shellSync(
  `npx jest --no-cache --runInBand --config='jest.integration.config.js'`,
  { cwd: tempDir, stdio: 'inherit' },
);

start.kill();

// test `npx yoshi build`
execa.shellSync('npm run build --if-present', {
  cwd: tempDir,
  stdio: 'inherit',
});

execa.shellSync('npm run pretest', { cwd: tempDir, stdio: 'inherit' });

const serve = execa.shell(`npx serve --listen=3200`, {
  cwd: path.join(tempDir, 'dist/statics'),
  stdio: 'inherit',
});

const index = execa.shell(`node index.js`, {
  cwd: tempDir,
  stdio: 'inherit',
});

execa.shellSync('npx wait-port 3000 -o silent');
execa.shellSync('npx wait-port 3200 -o silent');

execa.shellSync(
  `npx jest --no-cache --runInBand --config='jest.integration.config.js'`,
  { cwd: tempDir, stdio: 'inherit' },
);

index.kill();
serve.kill();
// });

// cleanup();
