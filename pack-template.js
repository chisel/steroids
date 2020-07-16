const tar = require('tar');
const fs = require('fs');
const path = require('path');

tar.c({ gzip: true }, fs.readdirSync(path.resolve(__dirname, 'template')).map(p => `./template/${p}`))
.pipe(fs.createWriteStream(path.resolve(__dirname, 'template.tar.gz')));
