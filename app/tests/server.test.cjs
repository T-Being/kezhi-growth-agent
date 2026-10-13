const test = require('node:test');
const assert = require('node:assert/strict');
const { createServer } = require('../server.cjs');

test('静态预览只暴露应用资源，不公开工程配置与内部文件', async () => {
  const server = createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  try {
    const home = await fetch(origin);
    assert.equal(home.status, 200);
    assert.match(await home.text(), /客知/);
    for (const file of ['/server.cjs', '/contracts.d.ts', '/tests/domain.test.cjs', '/.env', '/../package.json', '/assets/../server.cjs']) {
      assert.equal((await fetch(origin + file)).status, 404, file);
    }
    assert.equal((await fetch(origin + '/%00')).status, 400);
    assert.equal((await fetch(origin + '/%ZZ')).status, 400);
    assert.equal((await fetch(origin, { method: 'POST' })).status, 405);
    const asset = await fetch(origin + '/assets/zhihui-kezhi.png', { method: 'HEAD' });
    assert.equal(asset.status, 200);
    assert.equal(asset.headers.get('content-type'), 'image/png');
    assert.equal(await asset.text(), '');
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});
