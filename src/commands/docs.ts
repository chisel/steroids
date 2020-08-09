import child from 'child_process';
import chalk from 'chalk';
import serve from 'serve-static';
import http from 'http';
import finalhandler from 'finalhandler';
import path from 'path';
import app from 'argumental';
import { portNumber } from '../validators';

app

.command('docs')
.alias('d')
.description('generates developer documentation with TypeDocs')

.option('-s --serve', 'serves the generated documentation on port 7000')

.option('-p --port <port_number>', 'overrides the port number the documentation is being served on')
.default(7000)
.validate(portNumber)
.sanitize(port => +port)

.option('-d --directory <path>', 'directory path to generate the documentation at (relative to project root)')
.option('-v --verbose', 'displays all logs')

.actionDestruct(async({ opts }) => {

  try {

    console.log(chalk.yellow.bold(`Generating the documentation...`));

    // Generate the documentation using local typedoc module
    await new Promise((resolve, reject) => {

      child.exec(`./node_modules/typedoc/bin/typedoc --out ${opts.directory || 'docs'} src`, {
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

    console.log(chalk.greenBright.bold(`Documentation generated at /${path.join(opts.directory || 'docs')}`));

    // Serve the documentation if asked
    if ( opts.serve ) {

      const serveStatic = serve(path.resolve(process.cwd(), opts.directory || 'docs'));

      http.createServer((req, res) => {

        serveStatic(<any>req, <any>res, finalhandler(req, res));

      })
      .listen(opts.port, () => {

        console.log(chalk.greenBright.bold(`Documentation is being served at http://localhost:${opts.port}`));

      });

    }

  }
  catch (error) {

    app.emit('error', {
      msg: 'Could not generate the documentation!',
      origin: error
    });

  }

});
