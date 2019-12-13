import fs from 'fs-extra';
import path from 'path';
import child from 'child_process';
import chalk from 'chalk';
import chokidar from 'chokidar';

/**
* Builds the backend source code and runs the server.
* @param options The command options.
*/
export default async function action(options: any) {

  try {

    // Sanitize port number
    options.port = ! isNaN(+options.port) ? +options.port : 5000;

    // Update server config
    const configPath = path.resolve(process.cwd(), 'src', 'config.json');
    const serverConfig = require(configPath);

    serverConfig.port = options.port;

    fs.writeFileSync(configPath, JSON.stringify(serverConfig, null, 2), { encoding: 'utf-8' });

    // Build the source code
    console.log(chalk.yellow.bold(`Building the source code...`));

    await buildSource();

    console.log(chalk.yellow.bold(`Running the server...`));

    // Run the server
    let serverProcess = runServer();

    // Watch for changes and restart the server if needed
    if ( options.watch ) {

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
        buildSource()
        .then(() => {

          // Start a new process
          serverProcess = runServer();
          console.log(chalk.greenBright.bold(`Server running at http://localhost:${require(configPath).port || 5000}`));

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

    console.log(chalk.greenBright.bold(`Server running at http://localhost:${options.port}`));

  }
  catch (error) {

    console.log(chalk.redBright.bold('Could not run server!'));
    console.error(error);

  }

}

function buildSource() {

  return new Promise((resolve, reject) => {

    child.exec('npm run build', {
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

}

function runServer() {

  return child.spawn('npm', ['run', 'launch'], {
    cwd: process.cwd(),
    windowsHide: true,
    stdio: 'inherit'
  });

}
