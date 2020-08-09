import fs from 'fs-extra';
import path from 'path';
import child from 'child_process';
import chalk from 'chalk';
import chokidar from 'chokidar';
import app from 'argumental';
import { portNumber } from '../validators';

app

.command('run')
.alias('r')
.description('builds the source code and runs the server')

.option('-p --port <port_number>', 'a port number to run the server on (defaults to 5000)')
.validate(portNumber)
.sanitize(port => +port)
.default(5000)

.option('--skip-build', 'skips building the source code before running the server')
.option('-w --watch', 'watches for changes to the source code and rebuilds and reruns the server')
.option('-v --verbose', 'displays all logs')

.actionDestruct(async ({ opts }) => {

  try {

    // Update server config
    const configPath = path.resolve(process.cwd(), 'src', 'config.json');
    const serverConfig = require(configPath);

    serverConfig.port = opts.port;

    await fs.writeFile(configPath, JSON.stringify(serverConfig, null, 2), { encoding: 'utf-8' });

    if ( ! opts.skipBuild ) {

      // Build the source code
      console.log(chalk.yellow.bold(`Building the source code...`));

      await buildSource(opts.verbose);

    }

    // If no server build is available
    if ( ! await fs.pathExists(path.resolve(process.cwd(), 'dist')) )
      throw new Error('No server build to run! Try running the server without the --skip-build flag.');

    console.log(chalk.yellow.bold(`Running the server...`));

    // Run the server
    let serverProcess = runServer();

    // Watch for changes and restart the server if needed
    if ( opts.watch ) {

      let resetting: boolean = false;
      let needsNewReset: boolean = false;

      const handler = () => {

        // Suppress multiple simultaneous resets
        if ( resetting ) {

          needsNewReset = true;
          return;

        }

        resetting = true;

        console.log(chalk.yellow.bold(`Rebuilding the server...`));

        // Kill the previous process
        serverProcess.kill();

        // Rebuild the source
        buildSource(opts.verbose)
        .then(() => {

          // Start a new process
          serverProcess = runServer();
          console.log(chalk.greenBright.bold(`Server running at http://localhost:${require(configPath).port || opts.port}`));

        })
        .catch(error => {

          console.log(chalk.redBright.bold('Could not run server!'));
          console.error(error);

        })
        .finally(() => {

          resetting = false;

          // Reset again if an event occurred in the middle of last reset
          if ( needsNewReset ) {

            needsNewReset = false;
            handler();

          }

        });

      };

      chokidar.watch(path.resolve(process.cwd(), 'src'), { ignoreInitial: true })
      .on('change', handler)
      .on('add', handler)
      .on('unlink', handler)
      .on('addDir', handler)
      .on('unlinkDir', handler);

    }

    console.log(chalk.greenBright.bold(`Server running at http://localhost:${opts.port}${opts.watch ? ' with live reloading' : ''}`));


  }
  catch (error) {

    app.emit('error', {
      msg: 'Could not run the server!',
      origin: error
    });

  }

});

async function buildSource(verbose: boolean) {

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

        if ( verbose && stdout.trim() ) console.log(stdout.trim());
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

        if ( verbose && stdout.trim() ) console.log(stdout.trim());
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

        if ( verbose && stdout.trim() ) console.log(stdout.trim());
        resolve();

      }

    });

  });

}

function runServer() {

  return child.spawn('node', ['dist/@steroids/main.js'], {
    cwd: process.cwd(),
    windowsHide: true,
    stdio: 'inherit'
  });

}
