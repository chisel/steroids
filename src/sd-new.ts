import fs from 'fs-extra';
import path from 'path';
import child from 'child_process';
import chalk from 'chalk';
import isNpmNameValid from 'validate-npm-package-name';

/**
* Creates a new Steroids project.
* @param name    The project name (kebab case).
* @param options Command options.
*/
export default async function action(name: string, options: any) {

  const rootDir = path.resolve(process.cwd(), name);
  const templateDir = path.resolve(__dirname, '..', 'template');
  const assetsDir = path.resolve(__dirname, '..', 'template-assets');

  try {

    // If project name is invalid
    if ( ! isNpmNameValid(name).validForNewPackages )
      throw new Error(`"${name}" is not a valid NPM name!`);

    console.log(chalk.yellow.bold(`Creating project "${name}"...`));

    // If project directory exists
    if ( fs.existsSync(rootDir) ) throw new Error(`Directory "${name}" already exists!`);

    // If template doesn't exist
    if ( ! fs.existsSync(templateDir) ) throw new Error('Steroids template missing! Try running "npm run fetch-template" inside Steroids installation directory.');

    // Copy template to project root
    fs.copySync(templateDir, rootDir);

    // Update package.json
    const packageJson = require(path.resolve(rootDir, 'package.json'));

    packageJson.name = name;
    packageJson.version = '1.0.0';
    delete packageJson.description;
    delete packageJson.homepage;
    delete packageJson.bugs;
    delete packageJson.repository;
    delete packageJson.author;
    delete packageJson.keywords;

    // Copy README from template-assets/overwrite
    fs.copySync(path.resolve(assetsDir, 'overwrite', 'README.md'), path.resolve(rootDir, 'README.md'));
    // Copy routers and services directories
    fs.copySync(path.resolve(assetsDir, 'overwrite', 'src', 'routers'), path.resolve(rootDir, 'src', 'routers'));
    fs.copySync(path.resolve(assetsDir, 'overwrite', 'src', 'services'), path.resolve(rootDir, 'src', 'services'));

    // Delete examples if minimal setup or explicitly asked
    if ( options.minimal || options.skipExamples ) {

      fs.unlinkSync(path.resolve(rootDir, 'src', 'routers', 'example.router.ts'));
      fs.unlinkSync(path.resolve(rootDir, 'src', 'services', 'example.service.ts'));

    }

    // Delete tests if minimal setup or explicitly asked
    if ( options.minimal || options.skipTests ) {

      // Remove the test directory
      fs.removeSync(path.resolve(rootDir, 'test'));
      fs.removeSync(path.resolve(rootDir, 'pre-test.js'));

      // Update package.json
      delete packageJson.dependencies.mocha;
      delete packageJson.dependencies.chai;
      delete packageJson.devDependencies['@types/mocha'];
      delete packageJson.devDependencies['@types/chai'];
      packageJson.scripts.test = "echo \"Error: no test specified\" && exit 1";

      // Update tsconfig.json
      const tsconfig = require(path.resolve(rootDir, 'tsconfig.json'));

      tsconfig.exclude.splice(tsconfig.exclude.indexOf('test'), 1);

      fs.writeFileSync(path.resolve(rootDir, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2));

    }

    // Write the final package.json and package-lock.json
    fs.writeFileSync(path.resolve(rootDir, 'package.json'), JSON.stringify(packageJson, null, 2));

    // Delete package-lock.json
    fs.removeSync(path.resolve(rootDir, 'package-lock.json'));

    // Initialize git
    if ( ! options.skipGit ) {

      console.log(chalk.yellow.bold(`Initializing git repository...`));

      await new Promise((resolve, reject) => {

        child.exec('git init', {
          cwd: rootDir,
          windowsHide: true
        }, (error, stdout, stderr) => {

          if ( error ) {

            console.log(chalk.redBright.bold(stderr.trim()));
            reject(error);

          }
          else {

            if ( options.verbose && stdout.trim() ) console.log(stdout.trim());
            resolve();

          }

        });

      });

    }

    // Install dependencies
    if ( ! options.skipNpmInstall ) {

      console.log(chalk.yellow.bold(`Installing dependencies...`));

      await new Promise((resolve, reject) => {

        child.exec('npm install', {
          cwd: rootDir,
          windowsHide: true
        }, (error, stdout, stderr) => {

          if ( error ) {

            console.log(chalk.redBright.bold(stderr.trim()));
            reject(error);

          }
          else {

            if ( options.verbose && stdout.trim() ) console.log(stdout.trim());
            resolve();

          }

        });

      });

    }

    console.log(chalk.greenBright.bold(`Project "${name}" created`));

  }
  catch (error) {

    console.log(chalk.redBright.bold('Could not create project!'));
    console.error(error);

  }

}
