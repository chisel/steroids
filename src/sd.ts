#!/usr/bin/env node
import path from 'path';
import app from 'argumental';
import './global';
import './commands/new';
import './commands/build';
import './commands/run';
import './commands/add-router';
import './commands/add-service';
import './commands/path-list';
import './commands/path-new';
import './commands/path-delete';
import './commands/test';
import './commands/docs';

app
.version(require(path.resolve(__dirname, '..', 'package.json')).version)
.parse(process.argv);
