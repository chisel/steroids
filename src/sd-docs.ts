import child from 'child_process';
import chalk from 'chalk';
import serve from 'serve-static';
import finalhandler from 'finalhandler';
import http from 'http';
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

    // Generate the documentation using local typedoc module
    await new Promise((resolve, reject) => {

      child.exec(`./node_modules/typedoc/bin/typedoc --out ${options.directory || 'docs'} src`, {
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

    console.log(chalk.greenBright.bold(`Documentation generated at /${path.join(options.directory || 'docs')}`));

    // Serve the documentation if asked
    if ( options.serve ) {

      const serveStatic = serve(path.resolve(process.cwd(), options.directory || 'docs'));

      http.createServer((req, res) => {

        serveStatic(<any>req, <any>res, finalhandler(req, res));

      })
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
