# 开发与测试

## 环境和命令

Node.js ≥22，推荐 Node.js 24。所有命令在仓库根目录执行。应用无运行时第三方依赖；开发依赖仅用于浏览器测试，由锁文件固定版本。

```sh
npm ci
npx playwright install chromium
npm start
```

| 命令 | 用途 |
| --- | --- |
| `npm start` | 在 127.0.0.1:4173 预览源码 |
| `npm test` | 领域规则和静态服务边界测试 |
| `npm run build` | 生成并核对 `app/dist` |
| `npm run preview` | 预览已有构建产物 |
| `npm run test:e2e` | 自动启动 4175 端口服务，验收构建产物 |
| `npm run check` | 检查文档链接、源码语法和交付物哈希 |
| `npm run verify` | 顺序执行全部检查 |

`test:e2e` 前须先构建；4175 端口需空闲，测试不会复用不明来源的本地服务。浏览器在独立临时上下文中运行，不使用个人登录状态。

Linux 自动化环境使用 `npx playwright install --with-deps chromium`。已安装 Chrome 时可以通过 `CHROME_PATH` 指定可执行文件，不把个人路径写入仓库。例如 PowerShell：

```powershell
$env:CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
npm run verify
```

## 开发约定

领域预算和状态规则放在 `domain.js`，异步和持久化适配放在 `services.js`，页面交互放在 `app.js`。新增真实接口前先更新 [API](../architecture/api.md) 和 [类型](../../app/contracts.d.ts)，不可把密钥写入静态前端。

业务初始日期固定为 2026-09-09，以保持演示可重复。更新日期或客户快照时同步检查约束、复盘和用例；不要混用当前日历日期来解释预置经营结果。浏览器本地存储是演示状态，可从「运行设置」重置；不要导入真实客户私有资料。

## 测试证据

浏览器验收保留失败截图和 trace；执行产生的截图位于 `test-results`，HTML 报告位于 `playwright-report`，均不纳入版本库。README 截图为验收后精选的静态资源，界面变更时刷新。

CI 使用 Linux 环境，运行相同 `verify` 命令。修改规则时增加能捕获业务回归的用例；只修改文字或整理文件时使用链接、内容及构建检查即可。

参考：[GitHub Node.js 工作流](https://docs.github.com/en/actions/tutorials/build-and-test-code/nodejs)、[Playwright CI](https://playwright.dev/docs/ci)。
