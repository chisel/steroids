#!/usr/bin/env node
import path from 'path';
import program from 'commander';
import newAction from './sd-new';
import addRouterAction from './sd-add';
import docsAction from './sd-docs';
import buildAction from './sd-build';
import runAction from './sd-run';
import pathAction from './sd-path';
import testAction from './sd-test';

// Command: new
program
  .command('new <name>')
  .alias('n')
  .description('creates a new Steroids project')
  .option('-m, --minimal', 'examples and tests won\'t be setup in the project')
  .option('--skip-tests', 'tests won\'t be setup in the project')
  .option('--skip-examples', 'examples won\'t be included in the project')
  .option('--skip-npm-install', 'skips installing dependencies with npm')
  .option('--skip-git', 'skips initializing git repository')
  .option('-v, --verbose', 'displays all logs')
  .action(newAction);

// Command: add
program
  .command('add <component> <name>')
  .alias('a')
  .description('adds a new component')
  .option('-d, --directory <path>', 'directory path to add the component in (relative to src)')
  .option('--skip-tests', 'skips generating test suit for the component')
  .action(addRouterAction);

// Command: docs
program
  .command('docs')
  .alias('d')
  .description('generates developer documentation with TypeDocs')
  .option('-s, --serve [port_number]', 'serves the generated documentation on the given port (defaults to 7000)')
  .action(docsAction);

// Command: build
program
  .command('build')
  .alias('b')
  .description('builds the backend source code')
  .action(buildAction);

// Command: run
program
  .command('run')
  .alias('r')
  .description('builds the backend source code and runs the server')
  .option('-p, --port <port_number>', 'a port number to run the server on (defaults to 5000)')
  .option('-w, --watch', 'watches for changes to the source code and rebuilds and reruns the server')
  .action(runAction);

// Command: path
program
  .command('path <operation> [alias] [target]')
  .alias('p')
  .description('manages path aliases for easier imports (operations: list, new, delete) (all paths must be relative to src)')
  .action(pathAction);

// Command: test
program
  .command('test')
  .alias('t')
  .description('runs the tests')
  .action(testAction);

// Set version
program.version(require(path.resolve(__dirname, '..', 'package.json')).version);

// Parse arguments
program.parse(process.argv);
