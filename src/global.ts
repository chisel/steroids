import app from 'argumental';
import path from 'path';
import chalk from 'chalk';
import Util from './common/util';

// Set config
app.data<SteroidsConfig>().templatePath = path.resolve(__dirname, '..', 'template.tar.gz');
app.data<SteroidsConfig>().assetsPath = path.resolve(__dirname, '..', 'template-assets');

// Provide util class
app.data<SteroidsConfig>().util = new Util();

// Attach global error handler
app.global.on('error', (error: { msg: string; origin: Error }) => {

  console.error('\n  ' + chalk.redBright.bold(error.msg) + '\n  ' + error.origin + '\n');

});
