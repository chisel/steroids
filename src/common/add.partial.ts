import app from 'argumental';
import path from 'path';
import fs from 'fs-extra';
import mustache from 'mustache';
import chalk from 'chalk';
import { componentName } from '../sanitizers';
import { kebabCase } from '../validators';

export default function appendDefinition(componentType: 'router'|'service') {

  app

  .argument('<name>')
  .description('component name')
  // Validate kebab case
  .validate(kebabCase)
  // Sanitize component name based on component type
  .sanitize(componentName(componentType))
  // Convert name argument to an object containing both the kebab case and pascal case
  .sanitize(value => ({ kebab: value, pascal: app.data<SteroidsConfig>().util.kebabToPascal(value) }))

  .option('-d --directory <path>', 'directory path to add the component in (relative to src)')
  // Default to plural component name directory
  .default({
    dirname: componentType + 's',
    path: path.resolve(process.cwd(), 'src', componentType + 's')
  })
  // Resolve relative path
  .sanitize(dir => ({
    dirname: dir.dirname || dir,
    path: path.resolve(process.cwd(), 'src', dir.path || dir)
  }))

  .option('--skip-tests', 'skips generating test suit for the component')

  // app.data().componentType must be set before this action handler
  .action(async (args, opts) => {

    try {

      // Load the template
      const templatePath = path.resolve(app.data<SteroidsConfig>().assetsPath, 'generate', componentType + '.mustache');

      const componentTemplate = await fs.readFile(templatePath, { encoding: 'utf-8' });
      // Generate the component
      const generated = mustache.render(componentTemplate, { kebabName: args.name.kebab, pascalName: args.name.pascal });
      // Write the component to destination
      await fs.ensureDir(path.resolve(opts.directory.path));
      await fs.writeFile(path.resolve(opts.directory.path, `${args.name.kebab}.${componentType}.ts`), generated, { encoding: 'utf-8' });

      // If tests are enabled inside the project and not skipping
      if ( ! opts.skipTests && await fs.pathExists(path.resolve(process.cwd(), 'test')) ) {

        // Create the test suite
        const testTemplatePath = path.resolve(app.data<SteroidsConfig>().assetsPath, 'generate', 'test.mustache');

        // Load the test template
        const testTemplate = await fs.readFile(testTemplatePath, { encoding: 'utf-8' });
        // Generate the test suite
        const testSuite = mustache.render(testTemplate, { kebabName: args.name.kebab, pascalName: args.name.pascal });
        // Write the test suite to tests directory
        const testPath = path.resolve(process.cwd(), 'test', 'src', opts.directory.dirname);

        await fs.ensureDir(testPath);
        await fs.writeFile(path.resolve(testPath, `${args.name.kebab}.${componentType}.spec.ts`), testSuite, { encoding: 'utf-8' });

      }

      const finalPath = path.resolve(opts.directory.path, `${args.name.kebab}.${componentType}.ts`);
      const finalPathSrcIndex = finalPath.indexOf('/src');

      console.log(chalk.greenBright.bold(`${app.data<SteroidsConfig>().util.capitalize(componentType)} component "${args.name.kebab}" created at ${finalPath.substr(finalPathSrcIndex !== -1 ? finalPathSrcIndex : 0)}`));

    }
    catch (error) {

      app.emit('error', {
        msg: 'Could not create component!',
        origin: error
      });

    }

  });

}
