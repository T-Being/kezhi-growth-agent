const test=require('node:test');
const assert=require('node:assert/strict');
const D=require('../domain.js');
function fixture(){const s=D.fresh(),c=D.clients[0],r=s.records[c.id];r.task.budgets=D.recommend(c);return {s,c,r};}
test('客户规模与经营资料达到工作台要求',()=>{
  const s=D.fresh();assert.equal(D.clients.length,15);assert.equal(Object.keys(s.records).length,15);
  for(const c of D.clients){const r=s.records[c.id];assert.ok(r.memories.length>=25,`${c.name} 记忆不足`);assert.ok(r.reviews.length>=20,`${c.name} 复盘不足`);assert.ok(r.logs.length>=20,`${c.name} 操作记录不足`);assert.ok(r.memories.every(m=>m.source&&m.expires),`${c.name} 来源或有效期缺失`);}
});
test('所有客户的金额、ROI、日序列与预算汇总一致',()=>{
  for(const c of D.clients){assert.equal(c.rows.reduce((s,x)=>s+x[0],0),c.spend);assert.equal(c.rows.reduce((s,x)=>s+x[1],0),c.revenue);assert.equal(c.revenue/c.spend,c.roi);assert.equal(c.budgets.reduce((s,v)=>s+v,0),c.cap);assert.ok(Math.abs(c.series.slice(3).reduce((a,b)=>a+b)/3-c.roi)<1e-9);assert.ok(Math.abs(c.series.slice(0,3).reduce((a,b)=>a+b)/3-c.previous)<1e-9);}
});
test('推荐方案通过预算约束，非法输入、超限与数据缺口被阻止',()=>{
  const {c,r}=fixture();assert.deepEqual(D.validate(c,r.task,r.memories),[]);
  for(const values of [[600,400,100],[400,300,100],['',400,100],[-1,901,100],[500.5,399.5,100]]){r.task.budgets=values;assert.ok(D.validate(c,r.task,r.memories).length);}
  r.task.budgets=D.recommend(c);r.task.infoComplete=false;assert.ok(D.validate(c,r.task,r.memories).some(x=>x.includes('回传')));
});
test('过期预算授权阻止执行；客户数据独立',()=>{
  const {s,c,r}=fixture();r.memories[0].status='已过期';assert.ok(D.validate(c,r.task,r.memories).some(x=>x.includes('关键')));assert.equal(s.records.shanye.memories[0].status,'已确认');assert.equal(s.records.shanye.task.execution,null);
});
test('部分成功重试只包含未完成动作，不重复降低预算',()=>{
  const {c,r}=fixture();const ex=D.createExecution(c,r.task);const partial=D.settleExecution(ex,'partial');assert.deepEqual(partial.items.map(x=>x.status),['success','failed','unchanged']);const retry=D.createExecution(c,r.task,partial);assert.deepEqual(retry.items.map(x=>x.status),['unchanged','pending','unchanged']);assert.deepEqual(retry.items.map(x=>x.from),[500,300,100]);assert.equal(D.settleExecution(retry,'success').status,'success');
});
test('未知执行结果不会先显示成功；结算不修改原始请求',()=>{const {c,r}=fixture();const ex=D.createExecution(c,r.task);const result=D.settleExecution(ex,'unknown');assert.equal(result.status,'unknown');assert.equal(ex.status,'running');assert.deepEqual(result.items.map(x=>x.status),['unknown','unknown','unchanged']);});
test('执行使用更新后的平台配置作为基线',()=>{const {c,r}=fixture();r.task.currentBudgets=[550,350,100];const ex=D.createExecution(c,r.task);assert.deepEqual(ex.items.map(x=>x.from),[550,350,100]);});
