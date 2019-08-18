const path = require('path');
const fs = require('fs');

function getPaths() {
  const rootPath = path.join(__dirname, '..', '..');
  const publicPath = path.join(rootPath, 'public');

  return { rootPath, publicPath };
}

module.exports = {
  getPaths,
};
