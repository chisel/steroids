import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

/**
* Manages path aliases.
* @param operation  The operation (list, new, delete).
* @param alias      The path alias.
* @param target     The target path the alias would resolve to (relative to source).
*/
export default async function action(operation: string, alias: string, target: string) {

  const validOperations = ['list', 'new', 'delete'];
  const validAliases = ['l', 'n', 'd'];
  const tsconfig = require(path.resolve(process.cwd(), 'tsconfig.json'));

  try {

    // Validate operation
    const aliasIndex = validAliases.indexOf(operation);

    if ( aliasIndex > -1 ) operation = validOperations[aliasIndex];

    if ( ! validOperations.includes(operation) )
      throw new Error('Invalid path operation! Valid operations are: ' + validOperations.join(', '));

    // List operation
    if ( operation === 'list' ) {

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
    // New operation
    else if ( operation === 'new' ) {

      // If alias is not provided
      if ( ! alias ) throw new Error('Path alias must be provided when using the new operation!');

      // If target is not provided
      if ( ! target ) throw new Error('Source target must be provided when using the new operation!');

      // Update tsconfig and package.json
      tsconfig.compilerOptions.paths = tsconfig.compilerOptions.paths || {};
      tsconfig.compilerOptions.paths[alias] = tsconfig.compilerOptions.paths[alias] ? tsconfig.compilerOptions.paths[alias].push('./' + path.join('src', target)) : ['./' + path.join('src', target)];

      // Save files
      fs.writeFileSync(path.resolve(process.cwd(), 'tsconfig.json'), JSON.stringify(tsconfig, null, 2));

    }
    // Delete operation
    else if ( operation === 'delete' ) {

      // If alias is not provided
      if ( ! alias ) throw new Error('Path alias must be provided when using the delete operation!');

      const paths = tsconfig.compilerOptions.paths;

      // If no paths or not found
      if ( ! paths || ! paths[alias] ) return console.log(chalk.redBright.bold('Path alias not found!'));

      // Delete path alias
      if ( tsconfig.compilerOptions.paths ) delete tsconfig.compilerOptions.paths[alias];

      // Save files
      fs.writeFileSync(path.resolve(process.cwd(), 'tsconfig.json'), JSON.stringify(tsconfig, null, 2));

    }

  }
  catch (error) {

    console.log(chalk.redBright.bold('Could not operate paths!'));
    console.error(error);

  }

}
