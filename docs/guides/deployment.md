# 发布与运行

发布分为工程仓库和静态演示站点。公开仓库包含源码、文档与正式原件；静态站点只发布 `app/dist` 中的应用资源。

## 构建产物

```sh
npm ci
npx playwright install chromium
npm run verify
npm run preview
```

构建目录包含页面、样式、领域与服务脚本、交互脚本、角色图片和静态响应头配置。相对资源路径支持部署在站点子路径下。依赖、测试、源码预览服务及交付文档不进入站点包。

## GitHub

公开工程仓库：[T-Being/kezhi-growth-agent](https://github.com/T-Being/kezhi-growth-agent)。正式资料、文档与源码已推送；首次 CI 验证结果见[版本验证记录](../evaluation/verification.md)。

仓库推送到 `main` 或发起拉取请求后，`Verify project` 执行自动检查。绿色结果只覆盖原型工程行为，不代表商业准入。

可选的 `Publish demo to GitHub Pages` 仅手动触发。需要仓库设置中把 Pages 构建来源设为 GitHub Actions，再从主分支运行工作流。工作流会先完整验收，再上传静态构建并部署；站点地址以运行结果为准。

本次整理没有自动迁移已有演示站点。配置文件存在也不表示 Pages 已启用或远端部署已成功。

## 既有 Cloudflare 演示

正式交付资料记录的地址为 [kezhi-growth-agent.pages.dev](https://kezhi-growth-agent.pages.dev/)。2026-10-13 检查返回 HTTP 200。它对应此前交付版本，与本仓库后续提交不保证同步。

若在 Cloudflare 中另行连接本仓库，可使用仓库根目录、构建命令 `npm run build`、输出目录 `app/dist`。当前仓库未保存部署账号缓存、令牌或项目私有配置，也没有把供应商 CLI 作为应用开发依赖。

## 运行与回退

当前无业务后端、数据库迁移或模型配置。预览服务只绑定本机回环地址，不用于提供公网生产服务。公开演示只能使用预置虚构数据。

回退时选择已验收的 Git 提交重新构建部署；浏览器本地进度可能仍存在，可从运行设置重置。真实后端接入后需另行设计存储迁移和平台动作回读，不能把静态站点回退视为业务状态回滚。

参考：[GitHub Pages 自定义工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。
