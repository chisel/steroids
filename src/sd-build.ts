import path from 'path';
import child from 'child_process';
import chalk from 'chalk';

/**
* Builds the backend source code.
*/
export default async function action() {

  try {

    console.log(chalk.yellow.bold(`Building the source code...`));

    // Generate the documentation using local scripts and typescript module
    await new Promise((resolve, reject) => {

      child.exec('node pre-build.js', {
        cwd: process.cwd(),
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

    await new Promise((resolve, reject) => {

      child.exec('./node_modules/typescript/bin/tsc --build', {
        cwd: process.cwd(),
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

    await new Promise((resolve, reject) => {

      child.exec('node post-build.js', {
        cwd: process.cwd(),
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

    console.log(chalk.greenBright.bold(`Source is built at ${path.resolve(process.cwd(), 'dist')}`));

  }
  catch (error) {

    console.log(chalk.redBright.bold('Could not build source code!'));
    console.error(error);

  }

}
