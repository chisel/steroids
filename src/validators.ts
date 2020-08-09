import npmNameValidator from 'validate-npm-package-name';
import path from 'path';
import fs from 'fs-extra';
import app from 'argumental';

export function npmName(value: string) {

  if ( ! npmNameValidator(value).validForNewPackages )
    throw new Error(`Project name must be a valid NPM name!`);

}

export async function projectPathDoesNotExist(value: string) {

  if ( await fs.pathExists(path.resolve(process.cwd(), value)) )
    throw new Error(`Project path already exists!`);

}

export async function templateDataExists() {

  if ( ! await fs.pathExists(app.data<SteroidsConfig>().templatePath) )
    throw new Error('Steroids template missing! Try running "npm run fetch-template" inside Steroids installation directory.');

  if ( ! await fs.pathExists(app.data<SteroidsConfig>().assetsPath) )
    throw new Error('Steroids template assets is missing! Try reinstalling Steroids.');

}

export function kebabCase(name: string) {

  let correct: boolean = true;

  // Empty string
  if ( ! name.length ) correct = false;
  // Invalid characters
  if ( name.match(/[^a-z0-9-]/g) ) correct = false;
  // Starts with number or -
  if ( name.match(/^(-|\d)/) ) correct = false;
  // Ends with -
  if ( name.match(/-$/) ) correct = false;
  // Has consecutive -s
  if ( name.match(/--+/g) ) correct = false;

  if ( ! correct ) return new Error(`Invalid component name "${name}"! Name must be in kebab case.`);

}

export function portNumber(value: any) {

  if ( isNaN(value) ) throw new Error(`Invalid port number ${value}!`);

}
