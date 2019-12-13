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

    // Update package.json and package-lock.json
    const packageJson = require(path.resolve(rootDir, 'package.json'));
    const packageLock = require(path.resolve(rootDir, 'package-lock.json'));

    packageJson.name = name;
    packageJson.version = '1.0.0';
    delete packageJson.description;
    delete packageJson.homepage;
    delete packageJson.bugs;
    delete packageJson.repository;
    delete packageJson.author;
    delete packageJson.keywords;
    packageLock.name = name;
    packageLock.version = '1.0.0';

    fs.writeFileSync(path.resolve(rootDir, 'package.json'), JSON.stringify(packageJson, null, 2));
    fs.writeFileSync(path.resolve(rootDir, 'package-lock.json'), JSON.stringify(packageLock, null, 2));

    // Copy README from template-assets/overwrite
    fs.copySync(path.resolve(assetsDir, 'overwrite', 'README.md'), path.resolve(rootDir, 'README.md'));
    // Copy routers and services directories
    fs.copySync(path.resolve(assetsDir, 'overwrite', 'src', 'routers'), path.resolve(rootDir, 'src', 'routers'));
    fs.copySync(path.resolve(assetsDir, 'overwrite', 'src', 'services'), path.resolve(rootDir, 'src', 'services'));
    // Delete examples if minimal setup
    if ( options.minimal ) {

      fs.unlinkSync(path.resolve(rootDir, 'src', 'routers', 'example.router.ts'));
      fs.unlinkSync(path.resolve(rootDir, 'src', 'services', 'example.service.ts'));

    }

    // Install dependencies
    if ( ! options.skipNpmInstall ) {

      console.log(chalk.yellow.bold(`Installing dependencies"...`));

      await new Promise((resolve, reject) => {

        child.exec('npm install', {
          cwd: rootDir,
          windowsHide: true
        }, (error, stdout, stderr) => {

          if ( error ) {

            console.log(chalk.redBright.bold(stderr));
            reject(error);

          }
          else {

            console.log(stdout);
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
