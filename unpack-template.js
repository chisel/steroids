const tar = require('tar');
const fs = require('fs');
const path = require('path');

fs.createReadStream(path.resolve(__dirname, 'template.tar.gz'))
.pipe(tar.x({ C: path.resolve(__dirname) }));
