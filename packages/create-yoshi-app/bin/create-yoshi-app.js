#! /usr/bin/env node

process.on('unhandledRejection', error => {
  throw error;
});

const fs = require('fs-extra');
const path = require('path');
const program = require('commander');
const chalk = require('chalk');
const validateProjectName = require('validate-npm-package-name');
const { createApp } = require('../src/index');
const pkg = require('../package.json');

program
  .version(pkg.version)
  .arguments('[project-directory]')
  .usage(chalk.cyan('[project-directory]'))
  .parse(process.argv);

const customProjectDir = program.args[0];
const workingDir = process.cwd();

verifyDirectoryName(customProjectDir || workingDir);

if (customProjectDir) {
  fs.ensureDirSync(customProjectDir);
  process.chdir(path.resolve(customProjectDir));
}

createApp(workingDir, customProjectDir);

function printValidationResults(results) {
  if (typeof results !== 'undefined') {
    results.forEach(error => {
      console.error(chalk.red(`  *  ${error}`));
    });
  }
}

function verifyDirectoryName(workingDir) {
  const lastSegmentPath = workingDir.split(path.sep).slice(-1)[0];
  console.log(lastSegmentPath);

  const validationResult = validateProjectName(lastSegmentPath);

  if (!validationResult.validForNewPackages) {
    console.error(
      `Could not create a project called ${chalk.red(
        `"${lastSegmentPath}"`,
      )} because of restrictions:`,
    );

    printValidationResults(validationResult.errors);
    printValidationResults(validationResult.warnings);
    process.exit(1);
  }
}
