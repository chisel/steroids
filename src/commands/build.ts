import child from 'child_process';
import chalk from 'chalk';
import app from 'argumental';

app

.command('build')
.alias('b')
.description('builds the source code')

.option('-v --verbose', 'displays all logs')

.actionDestruct(async ({ opts }) => {

  try {

    console.log(chalk.yellow.bold(`Building the source code...`));

    // Generate the documentation using local scripts and typescript module
    await new Promise((resolve, reject) => {

      child.exec('node pre-build.js', {
        cwd: process.cwd(),
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

    await new Promise((resolve, reject) => {

      child.exec('./node_modules/typescript/bin/tsc --build', {
        cwd: process.cwd(),
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

    await new Promise((resolve, reject) => {

      child.exec('node post-build.js', {
        cwd: process.cwd(),
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

    console.log(chalk.greenBright.bold(`Source is built at /dist`));

  }
  catch (error) {

    app.emit('error', {
      msg: 'Could not build the source code!',
      origin: error
    });

  }

});
