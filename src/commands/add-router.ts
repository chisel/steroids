import app from 'argumental';
import appendDefinition from '../common/add.partial';

app

.command('add router')
.alias('a r')
.description('generates a new router')

// Append command definition
appendDefinition('router');
