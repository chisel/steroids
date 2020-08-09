import app from 'argumental';
import appendDefinition from '../common/add.partial';

app

.command('add service')
.alias('a s')
.description('generates a new service')

// Append command definition
appendDefinition('service');
