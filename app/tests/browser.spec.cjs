const {test}=require('@playwright/test');
const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs');

test('客户上下文、预算审批、执行恢复与复盘完整闭环',async({page},testInfo)=>{
 const OUT=testInfo.outputPath('screenshots');fs.mkdirSync(OUT,{recursive:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const click=async a=>{await page.locator(`[data-action="${a}"]`).first().click();};
 const waitStage=async n=>page.waitForFunction(n=>JSON.parse(localStorage.getItem('kezhi-demo-v1')).records.qinghe.task.stage===n,n);
 const read=async()=>page.evaluate(()=>JSON.parse(localStorage.getItem('kezhi-demo-v1')));
 async function reset(){await page.evaluate(()=>localStorage.clear());await page.goto('/');}
 async function prepare(scenario='success'){
  await reset();if(scenario!=='success'){await click('settings');await page.selectOption('#scenario',scenario);await click('save-settings');}
  await click('start-qinghe');await click('diagnose');await page.waitForSelector('[data-action="generate"]');await click('generate');await waitStage(2);
 }
 await page.goto('/');await reset();
 assert.equal((await read()).schema,2);assert.equal(Object.keys((await read()).records).length,15);
 await page.locator('[data-nav="clients"]').click();assert.ok(await page.locator('.group-card').count()>=8);await page.locator('[data-client-group="美妆个护"]').click();assert.equal(await page.locator('[data-client-detail]').count(),2);await page.locator('[data-client-detail="zhishu"]').click();assert.match(await page.locator('.content').innerText(),/沟通与决策/);assert.match(await page.locator('.content').innerText(),/经营上下文摘录/);
 await page.locator('[data-nav="memories"]').click();assert.ok(await page.locator('.memory-card').count()>=29);assert.equal(await page.locator('.memory-card .record-source').count(),await page.locator('.memory-card').count());
 await page.locator('[data-nav="reviews"]').click();assert.equal(await page.locator('tbody tr').count(),24);
 await page.locator('[data-nav="logs"]').click();assert.ok(await page.locator('.log-row').count()>=24);
 assert.ok(!(await page.locator('body').innerText()).match(/模拟|演示/));await reset();
 await page.screenshot({path:path.join(OUT,'01-workspace.png'),fullPage:true});
 await page.fill('#client-search','不存在');assert.match(await page.locator('#client-table').innerText(),/没有找到/);await click('clear-filter');
 await prepare();
 await page.fill('#budget-1','500');assert.equal(await page.locator('[data-action="preview"]').isDisabled(),true);assert.match(await page.locator('#validation-area').innerText(),/超出上限/);
 await click('restore-budgets');await click('save-draft');await page.reload();assert.equal(await page.inputValue('#budget-0'),'500');
 await page.screenshot({path:path.join(OUT,'02-strategy.png'),fullPage:true});
 await click('preview');assert.equal(await page.locator('[data-action="execute"]').isDisabled(),true);await page.check('#acknowledge');await click('back');await page.fill('#budget-0','550');await page.fill('#budget-1','350');await click('preview');assert.equal(await page.locator('#acknowledge').isChecked(),false);
 await click('back');await click('restore-budgets');await click('preview');await page.check('#acknowledge');await click('execute');await page.waitForFunction(()=>JSON.parse(localStorage.getItem('kezhi-demo-v1')).records.qinghe.task.execution.status==='success');
 await page.screenshot({path:path.join(OUT,'03-execution.png'),fullPage:true});
 assert.equal((await read()).records.qinghe.task.review.loaded,false);await click('nav-reviews');await click('load-review');await click('confirm-review');assert.equal((await read()).records.qinghe.memories.filter(x=>x.type==='历史经验').length,5);
 await page.selectOption('#client-select','shanye');await page.locator('[data-nav="memories"]').click();assert.ok(!(await page.locator('.content').innerText()).includes('预算调整复盘'));assert.match(await page.locator('.content').innerText(),/1,500/);
 await prepare('unknown');await click('preview');await page.check('#acknowledge');await click('execute');await page.waitForFunction(()=>JSON.parse(localStorage.getItem('kezhi-demo-v1')).records.qinghe.task.execution.status==='unknown');await page.reload();assert.match(await page.locator('.content').innerText(),/执行状态暂未确认/);await click('query-execution');await page.waitForFunction(()=>JSON.parse(localStorage.getItem('kezhi-demo-v1')).records.qinghe.task.execution.status==='success');
 await prepare('partial');await click('preview');await page.check('#acknowledge');await click('execute');await page.waitForFunction(()=>JSON.parse(localStorage.getItem('kezhi-demo-v1')).records.qinghe.task.execution.status==='partial');await click('query-execution');await page.waitForSelector('[data-action="retry-confirm"]');await click('retry-confirm');await page.waitForFunction(()=>JSON.parse(localStorage.getItem('kezhi-demo-v1')).records.qinghe.task.execution.status==='success');assert.deepEqual((await read()).records.qinghe.task.execution.items.map(x=>x.status),['unchanged','success','unchanged']);
 await prepare('failed');await click('preview');await page.check('#acknowledge');await click('execute');await page.waitForFunction(()=>JSON.parse(localStorage.getItem('kezhi-demo-v1')).records.qinghe.task.execution.status==='failed');await click('query-execution');await page.waitForSelector('[data-action="retry-confirm"]');await click('retry-confirm');await page.waitForFunction(()=>JSON.parse(localStorage.getItem('kezhi-demo-v1')).records.qinghe.task.execution.status==='success');
 await prepare('conflict');await click('preview');await page.check('#acknowledge');await click('execute');await page.waitForSelector('[data-action="resolve-conflict"]');assert.equal((await read()).records.qinghe.task.execution,null);await click('resolve-conflict');await waitStage(2);
 await click('settings');await page.selectOption('#memory-mode','expired');await click('save-settings');assert.equal(await page.locator('[data-action="preview"]').isDisabled(),true);
 await page.locator('[data-nav="memories"]').click();await page.locator('[data-edit-memory="budget"]').click();await page.selectOption('#memory-status','已确认');await page.locator('[data-save-memory="budget"]').click();assert.equal((await read()).records.qinghe.memories[0].status,'已确认');
 await reset();await click('settings');await page.selectOption('#data-mode','incomplete');await click('save-settings');await click('start-qinghe');await click('diagnose');await page.waitForSelector('[data-action="generate"]');assert.equal(await page.locator('[data-action="generate"]').isDisabled(),true);await click('complete-data');assert.equal(await page.locator('[data-action="generate"]').isDisabled(),false);
 await reset();await page.setViewportSize({width:1280,height:800});await page.screenshot({path:path.join(OUT,'04-desktop-1280.png'),fullPage:true});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 await page.setViewportSize({width:390,height:844});await page.waitForFunction(()=>document.querySelector('.sidebar').getBoundingClientRect().right<=0);await page.screenshot({path:path.join(OUT,'05-mobile.png'),fullPage:true});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await click('mobile');await page.locator('[data-nav="memories"]').click();await page.screenshot({path:path.join(OUT,'06-memory-mobile.png'),fullPage:true});
 assert.deepEqual(errors,[]);console.log('PASS: success, budget validation, approval invalidation, reload, memory learning/isolation, unknown query, partial retry, failure retry, conflict, expired memory, incomplete data, desktop/mobile layout. No browser runtime errors.');
});
