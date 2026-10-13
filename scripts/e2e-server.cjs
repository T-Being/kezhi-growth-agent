const path = require('node:path');
const fs = require('node:fs');
const { createServer } = require('../app/server.cjs');

// An in-process fixture avoids platform-specific shell process-tree cleanup.
module.exports = async function () {
  const root = path.resolve(__dirname, '../app/dist');
  if (!fs.existsSync(path.join(root, 'index.html'))) throw new Error('Run npm run build before browser tests');
  const server = createServer(root);
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(4175, '127.0.0.1', resolve);
  });
  return async () => {
    server.closeAllConnections();
    await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  };
};
