const path = require('path');
const execa = require('execa');

const testRegistry = 'http://localhost:4873';

module.exports = ({ verbose }) => {
  const stdio = verbose ? 'inherit' : 'pipe';

  // Start in root directory even if run from another directory
  process.chdir(path.join(__dirname, '..'));

  const verdaccio = execa.shell('npx verdaccio --config verdaccio.yaml', {
    stdio,
  });

  execa.shellSync('npx wait-port 4873 -o silent', {
    stdio,
  });

  execa.shellSync(
    `npx lerna exec 'npx npm-auth-to-token -u user -p password -e user@example.com -r "${testRegistry}"'`,
    {
      stdio,
    },
  );

  execa.shellSync(
    `npx lerna publish --yes --force-publish=* --skip-git --cd-version=minor --exact --npm-tag=latest --registry="${testRegistry}"`,
    {
      stdio: 'inherit',
    },
  );

  // Return a cleanup function
  return () => {
    execa.shellSync(`kill -9 ${verdaccio.pid}`);
  };
};
