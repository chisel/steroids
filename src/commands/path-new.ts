import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import app from 'argumental';

app

.command('path new')
.alias('p n')
.description('creates a new path alias')

.argument('<alias>', 'the path alias to add')
.argument('<target>', 'the target of the alias (relative to src)')

.action(async (args) => {

  try {

    const tsconfig = require(path.resolve(process.cwd(), 'tsconfig.json'));

    // Update tsconfig and package.json
    tsconfig.compilerOptions.paths = tsconfig.compilerOptions.paths || {};
    tsconfig.compilerOptions.paths[args.alias] = tsconfig.compilerOptions.paths[args.alias] ?
      tsconfig.compilerOptions.paths[args.alias].push('./' + path.join('src', args.target)) :
      ['./' + path.join('src', args.target)];

    // Save files
    await fs.writeFile(path.resolve(process.cwd(), 'tsconfig.json'), JSON.stringify(tsconfig, null, 2));

    console.log(chalk.greenBright.bold(`Created path alias`));

  }
  catch (error) {

    app.emit('error', {
      msg: 'Could not add new path alias!',
      origin: error
    });

  }

});
