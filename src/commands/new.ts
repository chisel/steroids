import path from 'path';
import chalk from 'chalk';
import fs from 'fs-extra';
import tar from 'tar';
import child from 'child_process';
import app from 'argumental';
import { npmName, projectPathDoesNotExist, templateDataExists } from '../validators';

app

.command('new')
.alias('n')
.description('creates a new Steroids project')

.argument('<name>')
.description('project name')
// Name must be a valid NPM name
.validate(npmName)
// Project path must be available
.validate(projectPathDoesNotExist)
// Check if template data exists
.validate(templateDataExists)

.option('-m --minimal', 'examples and tests won\'t be setup in the project')
.option('--skip-tests', 'tests won\'t be setup in the project')
.option('--skip-examples', 'examples won\'t be included in the project')
.option('--skip-npm-install', 'skips installing dependencies with npm')
.option('--skip-git', 'skips initializing git repository')
.option('-v --verbose', 'displays all logs')

.action(async (args, opts) => {

  try {

    const rootDir = path.resolve(process.cwd(), args.name);

    console.log(chalk.yellow.bold(`Creating project "${args.name}"...`));

    // Create empty root directory
    await fs.mkdir(rootDir);

    // Copy template to project root from template.tar.gz
    await (new Promise((resolve, reject) => {

      fs.createReadStream(app.data<SteroidsConfig>().templatePath)
      .pipe(tar.x({ C: rootDir, strip: 2 }))
      .on('end', resolve)
      .on('error', reject);

    }));

    // Update package.json
    const packageJson = require(path.resolve(rootDir, 'package.json'));

    packageJson.name = args.name;
    packageJson.version = '1.0.0';
    delete packageJson.description;
    delete packageJson.homepage;
    delete packageJson.bugs;
    delete packageJson.repository;
    delete packageJson.author;
    delete packageJson.keywords;

    // Copy README from template-assets/overwrite
    await fs.copy(path.resolve(app.data<SteroidsConfig>().assetsPath, 'overwrite', 'README.md'), path.resolve(rootDir, 'README.md'));
    // Copy routers and services directories
    await fs.copy(path.resolve(app.data<SteroidsConfig>().assetsPath, 'overwrite', 'src', 'routers'), path.resolve(rootDir, 'src', 'routers'));
    await fs.copy(path.resolve(app.data<SteroidsConfig>().assetsPath, 'overwrite', 'src', 'services'), path.resolve(rootDir, 'src', 'services'));

    // Delete examples if minimal setup or explicitly asked
    if ( opts.minimal || opts.skipExamples ) {

      await fs.unlink(path.resolve(rootDir, 'src', 'routers', 'example.router.ts'));
      await fs.unlink(path.resolve(rootDir, 'src', 'services', 'example.service.ts'));

    }

    // Delete tests if minimal setup or explicitly asked
    if ( opts.minimal || opts.skipTests ) {

      // Remove the test directory
      await fs.remove(path.resolve(rootDir, 'test'));
      await fs.remove(path.resolve(rootDir, 'pre-test.js'));

      // Update package.json
      delete packageJson.dependencies.mocha;
      delete packageJson.dependencies.chai;
      delete packageJson.devDependencies['@types/mocha'];
      delete packageJson.devDependencies['@types/chai'];
      packageJson.scripts.test = "echo \"Error: no test specified\" && exit 1";

      // Update tsconfig.json
      const tsconfig = require(path.resolve(rootDir, 'tsconfig.json'));

      tsconfig.exclude.splice(tsconfig.exclude.indexOf('test'), 1);

      await fs.writeFile(path.resolve(rootDir, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2));

    }

    // Write the final package.json and package-lock.json
    await fs.writeFile(path.resolve(rootDir, 'package.json'), JSON.stringify(packageJson, null, 2));

    // Delete package-lock.json
    await fs.remove(path.resolve(rootDir, 'package-lock.json'));

    // Initialize git
    if ( ! opts.skipGit ) {

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

            if ( opts.verbose && stdout.trim() ) console.log(stdout.trim());
            resolve();

          }

        });

      });

    }

    // Install dependencies
    if ( ! opts.skipNpmInstall ) {

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

            if ( opts.verbose && stdout.trim() ) console.log(stdout.trim());
            resolve();

          }

        });

      });

    }

    console.log(chalk.greenBright.bold(`Project "${args.name}" created`));

  }
  catch (error) {

    app.emit('error', {
      msg: 'Could not create project!',
      origin: error
    });

  }

});
