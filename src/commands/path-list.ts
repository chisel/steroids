import chalk from 'chalk';
import path from 'path';
import app from 'argumental';

app

.command('path list')
.alias('p l')
.description('lists all existing path aliases')

.action(async () => {

  try {

    const tsconfig = require(path.resolve(process.cwd(), 'tsconfig.json'));
    const paths = tsconfig.compilerOptions.paths;

    // If no paths
    if ( ! paths || ! Object.keys(paths).length ) return console.log(chalk.gray('There are no paths defined'));

    // Calculate longest path length
    let longest = Math.max(...Object.keys(paths).map(alias => alias.length));

    for ( const alias in paths ) {

      for ( const target of paths[alias] ) {

        console.log(chalk.magenta(alias.padEnd(longest, ' ')) + '  >  ' + chalk.gray(target));

      }

    }

  }
  catch (error) {

    app.emit('error', {
      msg: 'Could not list path aliases!',
      origin: error
    });

  }

});
