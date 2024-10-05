const fs = require('fs');
const path = require('path');

const readJsonFile = (filePath) => {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

const readMdFile = (filePath) => {
    return fs.readFileSync(filePath, 'utf-8');
};

module.exports = { readJsonFile, readMdFile };
