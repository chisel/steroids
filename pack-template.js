const tar = require('tar');
const fs = require('fs');
const path = require('path');

tar.c({ gzip: true }, [ './template' ])
.pipe(fs.createWriteStream(path.resolve(__dirname, 'template.tar.gz')));
