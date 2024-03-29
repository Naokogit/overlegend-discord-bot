const fs = require('fs');
const path = require('path');
let fileNames = [];

function getAllFiles(directory) {

  const files = fs.readdirSync(directory, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(directory, file.name);

      if (file.isDirectory()) {
        getAllFiles(filePath);
      }
      else if (file.isFile()) {
        fileNames.push(filePath);
      }
  }

  return fileNames;
}

module.exports = getAllFiles;