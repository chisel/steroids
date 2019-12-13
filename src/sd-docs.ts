import child from 'child_process';
import chalk from 'chalk';
import server from 'http-server';
import path from 'path';

/**
* Generates the developer documentation using TypeDocs.
* @param options Command options.
*/
export default async function action(options: any) {

  try {

    // Validate port number (default to 7000)
    if ( options.serve ) {

      if ( options.serve === true ) options.serve = 7000;
      if ( isNaN(options.serve) ) throw new Error('Invalid port number!');

      options.serve = +options.serve;

    }

    console.log(chalk.yellow.bold(`Generating the documentation...`));

    // Generate the documentation using local npm script
    await new Promise((resolve, reject) => {

      child.exec('npm run docs', {
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

    console.log(chalk.greenBright.bold(`Documentation generated at /docs`));

    // Serve the documentation if asked
    if ( options.serve ) {

      server.createServer({ root: path.resolve(process.cwd(), 'docs') })
      .listen(options.serve, () => {

        console.log(chalk.greenBright.bold(`Documentation is being served at http://localhost:${options.serve}`));

      });

    }

  }
  catch (error) {

    console.log(chalk.redBright.bold('Could not generate the documentation!'));
    console.error(error);

  }

}
