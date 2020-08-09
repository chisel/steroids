import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import app from 'argumental';

app

.command('path delete')
.alias('p d')
.description('deletes an existing path alias')

.argument('<alias>', 'the path alias to delete')

.action(async (args) => {

  try {

    const tsconfig = require(path.resolve(process.cwd(), 'tsconfig.json'));
    const paths = tsconfig.compilerOptions.paths;

    // If no paths or not found
    if ( ! paths || ! paths[args.alias] ) throw new Error('Path alias not found!');

    // Delete path alias
    if ( tsconfig.compilerOptions.paths ) delete tsconfig.compilerOptions.paths[args.alias];

    // Save files
    await fs.writeFile(path.resolve(process.cwd(), 'tsconfig.json'), JSON.stringify(tsconfig, null, 2));

    console.log(chalk.greenBright.bold(`Path alias was deleted`));

  }
  catch (error) {

    app.emit('error', {
      msg: 'Could not delete path alias!',
      origin: error
    });

  }

});
