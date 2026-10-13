# 后端与 AI 接入约定（草案）

当前 `services.js` 是模拟适配器。`mode: 'mock'` 是模式标识，尚未实现真实 API 模式；后续增加 HTTP 适配器，并在页面中逐步替换对静态客户数据的访问。`contracts.d.ts` 提供建议数据类型，不表示后端已存在。

## 建议接口

| 方法及路径 | 用途 |
|---|---|
| GET /api/clients | 授权客户列表 |
| GET /api/clients/:clientId/accounts | 当前客户账户 |
| GET /api/clients/:clientId/memories | 客户记忆与确认状态 |
| POST /api/clients/:clientId/memories | 创建待确认记忆 |
| PATCH /api/clients/:clientId/memories/:id | 带版本的记忆更新 |
| GET /api/clients/:clientId/metrics | 同口径指标、时间窗口及回传状态 |
| GET /api/clients/:clientId/anomalies | 异常及处理状态 |
| POST /api/tasks/:id/diagnoses | 创建诊断任务 |
| GET /api/diagnoses/:id | 轮询异步诊断结果 |
| GET /api/clients/:clientId/evidence/:id | 证据详情 |
| POST /api/tasks/:id/strategies | 生成候选方案 |
| PUT /api/strategies/:id/versions/:version | 保存方案草稿 |
| POST /api/strategies/:id/validate | 确定性参数与约束校验 |
| POST /api/execution-previews | 读取当前配置，生成带有效期的执行预览 |
| POST /api/executions | 确认具体预览并创建执行批次 |
| GET /api/executions/:id | 状态未知时查询同一批次，不重复写入 |
| POST /api/executions/:id/retry-preview | 重新读取配置，仅为未完成动作生成预览 |
| GET /api/clients/:clientId/reviews | 复盘待办 |
| POST /api/reviews/:id/confirm-memory | 经人工确认写入当前客户经验 |
| GET /api/clients/:clientId/activity | 服务端操作记录 |

## 数据与状态

- 正式接口金额以整数分传递，页面以元展示。当前 Demo 模拟数据以元保存，接入时在服务适配层转换。
- 指标返回计算窗口、时区、归因口径、最新同步时间与回传完整性。
- 客户标识不能替代权限校验：后端从身份与授权关系验证账户归属。
- 方案引用具体记忆版本；关键约束修改后已生成的执行预览应失效。
- 执行确认绑定方案版本、当前平台配置版本和幂等请求标识。
- 超时进入 unknown，前端查询既有批次，不自动重发写入。
- 部分成功保留每项实际状态；读取最新配置后再生成重试预览。
- ROI 异常状态与执行状态分开。配置成功只创建观察待办，不直接关闭效果异常。

## AI 服务边界

模型负责整理上下文、提出原因假设、解释依据与生成候选建议。预算计算、校验、授权、执行和状态判定由确定性代码与平台返回值承担。模型输出不得直接成为执行请求。

记忆、证据与诊断响应必须带客户范围。证据不足时返回 gaps，允许 UI 建立补查待办。未来接入自由追问时应支持异步加载、取消、失败重试与引用来源，不应复用演示中的固定回答作为真实结果。
