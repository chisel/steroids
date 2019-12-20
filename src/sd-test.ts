import child from 'child_process';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs-extra';

/**
* Runs the tests.
*/
export default async function action() {

  try {

    // Show error if tests are not setup
    if ( ! fs.existsSync(path.resolve(process.cwd(), 'test', 'src', 'main.spec.ts')) )
      return console.log(chalk.redBright.bold('Tests are not setup in this project!'));

    // If pre-test.js is missing
    if ( ! fs.existsSync(path.resolve(process.cwd(), 'pre-test.js')) )
      return console.log(chalk.redBright.bold('Test preparation script is missing!'));

    // If source is not built
    if ( ! fs.existsSync(path.resolve(process.cwd(), 'dist')) )
      return console.log(chalk.redBright.bold('Server is not built! Please run "sd build" before running the tests.'));

    await new Promise((resolve, reject) => {

      child.exec('node pre-test.js', {
        cwd: process.cwd(),
        windowsHide: true
      }, (error, stdout, stderr) => {

        if ( error ) {

          console.log(chalk.redBright.bold(stderr.trim()));
          reject(error);

        }
        else {

          if ( stdout.trim() ) console.log(stdout.trim());
          resolve();

        }

      });

    });

    await new Promise((resolve, reject) => {

      child.exec('./node_modules/typescript/bin/tsc -p test/tsconfig.json', {
        cwd: process.cwd(),
        windowsHide: true
      }, (error, stdout, stderr) => {

        if ( error ) {

          console.log(chalk.redBright.bold(stderr.trim()));
          reject(error);

        }
        else {

          if ( stdout.trim() ) console.log(stdout.trim());
          resolve();

        }

      });

    });

    await new Promise((resolve, reject) => {

      let promiseConsumed = false;

      child.spawn('./node_modules/mocha/bin/mocha', ['./test/dist/main.spec.js'], {
        cwd: process.cwd(),
        windowsHide: true,
        stdio: 'inherit'
      })
      .on('error', error => {

        if ( promiseConsumed ) return;

        promiseConsumed = true;
        reject(error);

      })
      .on('exit', () => {

        if ( promiseConsumed ) return;

        promiseConsumed = true;
        resolve();

      });

    });

  }
  catch (error) {

    console.log(chalk.redBright.bold('Could not run tests!'));
    console.error(error);

  }

}
