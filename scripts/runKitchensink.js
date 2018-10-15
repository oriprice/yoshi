const path = require('path');
const fs = require('fs-extra');
const globby = require('globby');
const tempy = require('tempy');
const execa = require('execa');
const publishMonorepo = require('./publishMonorepo');

const cleanup = publishMonorepo({ verbose: true });

const testRegistry = 'http://localhost:4873';

const projects = globby.sync('*', {
  cwd: path.join(__dirname, '../test'),
  onlyFiles: false,
  absolute: true,
});

projects.forEach(projectDir => {
  const tempDir = tempy.directory();

  fs.copySync(projectDir, tempDir);

  execa.shellSync(
    `npx npm-auth-to-token -u user -p password -e user@example.com -r "${testRegistry}"`,
    { cwd: tempDir },
  );

  execa.shellSync('npm install', { cwd: tempDir, stdio: 'inherit' });

  execa.shellSync('npm run build --if-present', {
    cwd: tempDir,
    stdio: 'inherit',
  });

  execa.shellSync('npm run test', { cwd: tempDir, stdio: 'inherit' });

  const serve = execa.shell(`npx serve --listen=3200`, {
    cwd: tempDir,
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

  execa.shellSync(`kill -9 ${index.pid}`);

  execa.shellSync(`kill -9 ${serve.pid}`);
});

cleanup();
