import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import mustache from 'mustache';

/**
* Generates a Steroids component.
* @param component Component type (either router or service).
*                  Aliases are also accepted (first letter of the component name).
* @param name      Component name (kebab case).
* @param options   Command options.
*/
export default async function action(component: string, name: string, options: any) {

  const validComponents = ['router', 'service'];
  const validAliases = ['r', 's'];
  const assetsDir = path.resolve(__dirname, '..', 'template-assets');

  try {

    // Validate component
    const aliasIndex = validAliases.indexOf(component);

    if ( aliasIndex > -1 ) component = validComponents[aliasIndex];

    if ( ! validComponents.includes(component) )
      throw new Error('Invalid component type! Valid components are: ' + validComponents.join(', '));

    // Sanitize component name
    name = sanitizeComponentName(name, component);

    // Validate component name
    if ( ! isKebabCaseCorrect(name) )
      throw new Error('Invalid component name! Component names should be in kebab case (e.g. user-auth-service).');

    // Get pascal case for component name
    const pascalName = kebabToPascal(name) + capitalize(component);

    // Sanitize directory
    options.directory = options.directory || path.resolve(process.cwd(), 'src', component + 's');
    options.directory = path.resolve(process.cwd(), 'src', options.directory);

    // Ensure dir
    fs.ensureDirSync(options.directory);

    // Create the component
    const templatePath = path.resolve(assetsDir, 'generate', component + '.mustache');

    // If component template doesn't exist
    if ( ! fs.existsSync(templatePath) )
      throw new Error(`Component template missing! Please reinstall steroids and try again.`);

    // Load the template
    const componentTemplate = fs.readFileSync(templatePath, { encoding: 'utf-8' });
    // Generate the component
    const generated = mustache.render(componentTemplate, { kebabName: name, pascalName });
    // Write the component to destination
    fs.writeFileSync(path.resolve(options.directory, `${name}.${component}.ts`), generated, { encoding: 'utf-8' });

    // If tests are enabled inside the project and not skipping
    if ( fs.existsSync(path.resolve(process.cwd(), 'test')) && ! options.skipTests ) {

      // Create the test suite
      const testTemplatePath = path.resolve(assetsDir, 'generate', 'test.mustache');

      // If test template doesn't exist
      if ( ! fs.existsSync(testTemplatePath) )
        throw new Error(`Test template missing! Please reinstall steroids and try again.`);

      // Load the test template
      const testTemplate = fs.readFileSync(testTemplatePath, { encoding: 'utf-8' });
      // Generate the test suite
      const testSuite = mustache.render(testTemplate, { kebabName: name, pascalName });
      // Write the test suite to tests directory
      fs.ensureDirSync(path.resolve(process.cwd(), 'test', 'src', component + 's'));
      fs.writeFileSync(path.resolve(process.cwd(), 'test', 'src', component + 's', `${name}.${component}.spec.ts`), testSuite, { encoding: 'utf-8' });

    }

    const finalPath = path.resolve(options.directory, `${name}.${component}.ts`);
    const finalPathSrcIndex = finalPath.indexOf('/src');

    console.log(chalk.greenBright.bold(`${capitalize(component)} component "${name}" created at ${finalPath.substr(finalPathSrcIndex !== -1 ? finalPathSrcIndex : 0)}`));

  }
  catch (error) {

    console.log(chalk.redBright.bold('Could not create component!'));
    console.error(error);

  }

}

function capitalize(string: string): string {

  return string.substr(0, 1).toUpperCase() + string.substr(1);

}

function sanitizeComponentName(componentName: string, type: string): string {

  let name = componentName.toLowerCase().trim();

  if ( name.substr(-type.length) === type ) name = name.substr(0, name.length - type.length - 1);
  if ( name.substr(-1) === '-' ) name = name.substr(0, name.length - 1);

  return name;

}

function isKebabCaseCorrect(name: string): boolean {

  // Empty string
  if ( ! name.length ) return false;
  // Invalid characters
  if ( name.match(/[^a-z0-9-]/g) ) return false;
  // Starts with number or -
  if ( name.match(/^(-|\d)/) ) return false;
  // Ends with -
  if ( name.match(/-$/) ) return false;
  // Has consecutive -s
  if ( name.match(/--+/g) ) return false;

  return true;

}

function kebabToPascal(kebabName: string): string {

  let pascalName = kebabName[0].toUpperCase() + kebabName.substr(1);

  for ( let i = 0; i < pascalName.length; i++ ) {

    if ( pascalName[i] !== '-' ) continue;

    pascalName = pascalName.substr(0, i) + pascalName.substr(i + 1, 1).toUpperCase() + pascalName.substr(i + 2);
    i--;

  }

  return pascalName;

}
