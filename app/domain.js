(function (root) {
  'use strict';
  const clone = value => JSON.parse(JSON.stringify(value));
  const clients = [
    { id: 'qinghe', name: '青禾家居', short: '青禾', category: '家居生活 · 电商成交', account: '青禾家居旗舰店', initials: '青', color: 'sage', target: 2.5, roi: 2, previous: 3, spend: 3000, revenue: 6000, cap: 1000, budgets: [600,300,100], plans: ['旧素材拓客','真人实拍测试','再营销'], rows: [[1800,2700],[900,2700],[300,600]], series: [3.2,3.05,2.75,2.3,1.95,1.75], owner: '陈宁', status: 'ROI 异常', preference: '优先使用现有真人实拍素材', note: '预算不增加，先通过小幅测试改善投放回报。' },
    { id: 'shanye', name: '山野户外', short: '山野', category: '户外装备 · 电商成交', account: '山野户外官方店', initials: '山', color: 'sand', target: 2.8, roi: 3.4, previous: 3.2, spend: 4500, revenue: 15300, cap: 1500, budgets: [800,500,200], plans: ['秋季徒步系列','装备细节展示','老客再营销'], rows: [[2400,8400],[1500,4800],[600,2100]], series: [3.1,3.2,3.3,3.2,3.4,3.6], owner: '陈宁', status: '表现稳定', preference: '使用真实户外场景，避免夸张性能承诺', note: '秋季新品期，保持预算，优先沉淀素材反馈。' },
    { id: 'muguang', name: '暮光生活', short: '暮光', category: '生活日用 · 电商成交', account: '暮光生活品牌店', initials: '暮', color: 'lilac', target: 2.2, roi: 2.6, previous: 2.5, spend: 2400, revenue: 6240, cap: 800, budgets: [400,300,100], plans: ['日用主推','场景搭配','再营销'], rows: [[1200,3000],[900,2340],[300,900]], series: [2.4,2.5,2.6,2.5,2.6,2.7], owner: '陈宁', status: '表现稳定', preference: '素材保持简洁自然，突出日常使用场景', note: '本周以稳定转化为主，不扩大测试规模。' }
  ];
  const moreClients = [
    ['linxi','林溪茶事','林','茶饮食品','清雅质感','茶叶礼盒','25—40 岁品质生活人群',2.6,2.9,2.7,3600,10440,1200,'节庆礼赠期先确认库存，再调整放量节奏'],
    ['jianshan','见山服饰','见','服饰鞋包','真实穿搭','通勤女装','一二线城市通勤女性',2.4,2.1,2.6,3300,6930,1100,'上新期优先测试穿搭场景，避免过度促销表达'],
    ['senmian','森眠家纺','森','家居生活','自然生活','床品套件','新婚及家庭改善型人群',2.7,3.0,2.8,4200,12600,1400,'重视材质说明和真实卧室场景，活动前两日不大幅改动'],
    ['zhishu','植述个护','植','美妆个护','成分专业','头皮护理','25—35 岁精细护理人群',2.3,2.5,2.4,2700,6750,900,'所有功效表达须经合规确认，优先解释核心成分'],
    ['yanshu','研述美妆','研','美妆个护','成分专业','精华护肤','敏感肌与成分关注人群',2.8,2.6,3.0,4800,12480,1600,'大促期间保留品牌词计划，先优化低效拓新人群'],
    ['mulin','木邻家具','木','家居生活','空间质感','小户型家具','城市小户型新居人群',2.2,2.5,2.3,5100,12750,1700,'重点解释尺寸和空间适配，避免仅展示空镜'],
    ['heyue','禾悦食品','禾','食品生鲜','家庭温度','早餐食品','有孩家庭与上班族',2.5,2.8,2.6,3900,10920,1300,'晨间时段重点投放，库存少于七天时暂停扩量'],
    ['xingye','行野装备','行','户外运动','真实体验','露营装备','轻户外与新手露营人群',3.0,3.2,3.1,6000,19200,2000,'避免极限性能承诺，优先真实搭建和收纳展示'],
    ['chuyi','初一童装','初','母婴童装','亲子真实','儿童基础款','3—10 岁儿童家庭',2.4,2.7,2.5,3000,8100,1000,'尺码库存决定素材投放，亲子场景需自然不过度摆拍'],
    ['shiguang','拾光文创','拾','文创礼品','审美叙事','节日礼品','18—30 岁送礼与收藏人群',2.1,2.3,2.2,2100,4830,700,'保留设计故事，节点前十天开始测试，临期转向转化素材'],
    ['yunqi','云栖宠物','云','宠物用品','真实陪伴','猫咪用品','城市养猫人群',2.6,2.4,2.8,4500,10800,1500,'区分新客拉新和老客复购，不使用引发宠物焦虑的表达'],
    ['ruyi','如一健康','如','健康生活','专业可信','办公护腰','久坐办公与中年家庭',2.5,2.9,2.6,3600,10440,1200,'避免医疗化表述，重点展示结构、尺寸与使用方法']
  ];
  moreClients.forEach(([id,name,initials,business,style,product,audience,target,roi,previous,spend,revenue,cap,note],idx)=>clients.push({
    id,name,short:name.slice(0,2),category:`${business} · 电商成交`,account:`${name}品牌旗舰店`,initials,color:['sage','sand','lilac'][idx%3],target,roi,previous,spend,revenue,cap,
    budgets:[Math.round(cap*.6),Math.round(cap*.3),cap-Math.round(cap*.6)-Math.round(cap*.3)],plans:[`${product}拓新`,`${style}素材测试`,'老客再营销'],
    rows:[[Math.round(spend*.6),Math.round(revenue*(roi<target?.42:.48))],[Math.round(spend*.3),Math.round(revenue*(roi<target?.43:.36))],[spend-Math.round(spend*.6)-Math.round(spend*.3),revenue-Math.round(revenue*(roi<target?.42:.48))-Math.round(revenue*(roi<target?.43:.36))]],
    series:[previous-.15,previous,previous+.15,roi-.15,roi,roi+.15],owner:idx%3===0?'陈宁':idx%3===1?'赵岚':'周衡',status:roi<target?'ROI 异常':'表现稳定',preference:`偏好${style}表达，突出${product}的真实使用价值`,note,business,style,product,audience
  }));
  const originalProfiles = {
    qinghe:['家居生活','真实体验','收纳家具','城市租住与新居家庭'],shanye:['户外运动','真实体验','徒步装备','20—40 岁轻户外人群'],muguang:['生活日用','自然生活','日用清洁','注重居家品质人群']
  };
  clients.forEach((c,i)=>{
    const p=originalProfiles[c.id]||[c.business,c.style,c.product,c.audience];
    Object.assign(c,{business:p[0],style:p[1],product:p[2],audience:p[3],region:['全国','华东重点','一二线城市'][i%3],established:`20${12+i%10} 年`,contact:['林经理','顾女士','许先生','周经理'][i%4],decisionStyle:['数据充分后集中决策','小步验证后逐步放量','先看素材方向再确认预算'][i%3],cadence:['每周一、四同步','每周三复盘','每日简报、周五复盘'][i%3],serviceSince:`202${3+i%3}-0${1+i%8}-15`,handoff:`${c.note} 关键预算与素材变更需由 ${['林经理','顾女士','许先生','周经理'][i%4]} 确认。`});
  });
  const sourceCatalog=['客户微信沟通','投放平台日报','素材评审记录','客户经营简报','周度复盘会议','广告账户配置','商品库存系统','活动排期表','客服反馈汇总','客户授权单'];
  const memoryTemplates = [
    ['经营事实',c=>`主营${c.product}，核心受众为${c.audience}`],['经营事实',c=>`当前重点经营区域为${c.region}`],['经营目标',c=>`阶段目标投放 ROI 为 ${c.target.toFixed(2)}`],['预算约束',c=>`账户日预算上限 ${c.cap.toLocaleString()} 元`],
    ['素材偏好',c=>c.preference],['素材偏好',c=>`首屏优先呈现${c.product}的使用结果`],['素材偏好',c=>`画面保持${c.style}，减少无关装饰`],['素材禁忌',c=>`避免无法由商品信息支持的绝对化承诺`],
    ['沟通要点',c=>`固定${c.cadence}`],['沟通要点',c=>`对外方案先给结论，再附数据和证据来源`],['决策习惯',c=>c.decisionStyle],['决策习惯',c=>`预算变化超过 10% 时由联系人${c.contact}确认`],
    ['历史经验',c=>`${c.style}素材在近两轮测试中点击表现较稳定`],['历史经验',c=>`再营销计划适合保持稳定预算，避免频繁启停`],['历史经验',c=>`大促前采用小预算预热更便于判断素材质量`],['历史经验',c=>`素材上新后至少观察两个完整自然日再判断`],
    ['临时安排',c=>`本周围绕${c.product}主推款集中投放`],['临时安排',c=>`库存不足七天时停止扩大拓新预算`],['授权要求',c=>`预算调整需当前负责优化师逐次确认`],['授权要求',c=>`新建计划前需核对账户、商品与人群范围`],
    ['待验证假设',c=>`${c.style}素材可能更适合当前拓新人群`],['待验证假设',c=>`低回报可能与素材频次上升有关，仍需补查`],['交接事项',c=>`接班时优先查看未完成实验与有效预算约束`],['交接事项',c=>`客户主要联系人为${c.contact}，沟通节奏为${c.cadence}`]
  ];
  function buildMemories(c){return memoryTemplates.map(([type,make],i)=>({id:`m-${i+1}`,type,text:make(c),status:i===20||i===21?'待确认':'已确认',source:`${sourceCatalog[i%sourceCatalog.length]} · 2026-${String(7+Math.floor(i/10)).padStart(2,'0')}-${String(3+i%24).padStart(2,'0')}`,sourceTag:sourceCatalog[i%sourceCatalog.length],original:`${make(c)}。记录范围仅限 ${c.name}，由${i%3===0?'客户联系人':'负责优化师'}提供并留存。`,expires:i>=16&&i<=17?'2026-09-30':'2026-12-31',version:1}));}
  function buildLogs(c){const actions=['同步账户数据','更新客户目标','确认预算边界','导入沟通记录','整理素材偏好','核对商品库存','完成周度诊断','生成候选策略','保存方案草稿','补充业务背景','确认素材排期','更新活动日期','核对计划状态','完成预算预检','提交客户确认','记录执行结果','建立观察任务','补充转化数据','生成阶段复盘','确认经验适用条件','更新客户记忆','完成账户交接','归档过期约束','输出客户周报'];return actions.map((title,i)=>({id:`log-${c.id}-${i}`,time:`2026-09-${String(9-Math.floor(i/3)).padStart(2,'0')}T${String(18-i%9).padStart(2,'0')}:${String((i*7)%60).padStart(2,'0')}:00+08:00`,title,detail:`${sourceCatalog[i%sourceCatalog.length]}：${c.name}${i%2?'相关信息已核对并记录。':'当前状态已同步到客户工作区。'}`,version:1+Math.floor(i/8),source:sourceCatalog[i%sourceCatalog.length]}));}
  function buildReviews(c){return Array.from({length:24},(_,i)=>({id:`review-${c.id}-${i}`,date:`2026-${String(8-Math.floor(i/12)).padStart(2,'0')}-${String(28-i%12).padStart(2,'0')}`,title:['预算结构调整','素材上新观察','人群拓展测试','再营销稳定性检查'][i%4],result:['达到预期','部分达到','继续观察','未达到'][i%4],before:+(c.target-.35+(i%3)*.08).toFixed(2),after:+(c.target-.12+(i%4)*.09).toFixed(2),source:`${sourceCatalog[(i+4)%sourceCatalog.length]} · 第 ${i+1} 期复盘`,summary:`围绕${c.product}完成${['预算结构调整','素材上新观察','人群拓展测试','再营销稳定性检查'][i%4]}，已记录结果、干扰因素和下一步建议。`}));}
  function fresh() {
    const records = {};
    clients.forEach(c => {
      records[c.id] = {
        memories: [
          { id:'budget', type:'硬约束', text:`日预算上限 ${c.cap.toLocaleString()} 元`, status:'已确认', source:'客户预算确认单 · 2026-09-06', original:`本阶段账户日预算不得超过 ${c.cap} 元，预算调整须由负责优化师确认。`, expires:'2026-09-30', version:1 },
          { id:'total', type:'任务约束', text:'本次调整不增加日总预算', status:'已确认', source:'客户沟通纪要 · 2026-09-08', original:c.note, expires:'2026-09-15', version:1 },
          { id:'style', type:'客户偏好', text:c.preference, status:'已确认', source:'素材沟通纪要 · 2026-09-07', original:`素材制作偏好：${c.preference}。偏好不代表已验证的效果。`, expires:'2026-10-01', version:1 },
          { id:'approve', type:'授权要求', text:'预算调整需优化师逐次确认', status:'已确认', source:'客户服务约定 · 2026-09-01', original:'每次预算变更先展示具体账户和参数，由优化师确认后执行。', expires:'2026-12-31', version:1 },
          { id:'candidate', type:'待验证假设', text:c.id==='qinghe'?'真人实拍素材可能值得扩大测试':'现有素材组合可能支持后续小规模测试', status:'待确认', source:'投放观察 · 2026-09-09', sourceTag:'投放平台日报', original:'基于当前观察提出，尚不能作为长期效果结论。', expires:'2026-09-15', version:1 }
        ].concat(buildMemories(c)), task: { stage:0, maxStage:0, diagnosed:false, diagnosisLoading:false, version:1, budgets:[...c.budgets], selection:'adjust', note:'', days:3, threshold:1.5, scenario:'success', acknowledged:false, execution:null, review:null, infoComplete:true, supplement:'', feedback:'' }, logs:buildLogs(c), reviews:buildReviews(c)
      };
    });
    return { schema:2, client:'qinghe', page:'dashboard', records, filter:'all', search:'', clientGroup:'全部行业' };
  }
  function validate(client, task, memories) {
    const errors = [];
    if (task.budgets.some(x => x === '' || x === null || !Number.isInteger(Number(x)) || Number(x)<0)) errors.push('各计划预算必须是非负整数。');
    const sum = task.budgets.reduce((s,v)=>s+Number(v||0),0);
    if(sum>client.cap) errors.push(`日预算超出上限 ${sum-client.cap} 元，请减少预算。`);
    if(sum<client.cap) errors.push(`本次需保持日总预算 ${client.cap} 元，当前还差 ${client.cap-sum} 元。`);
    if(!task.infoComplete) errors.push('转化数据尚未回传完整，请补齐数据后重新诊断。');
    if(memories.some(m=>['budget','total','approve'].includes(m.id) && m.status!=='已确认')) errors.push('关键客户约束尚未确认或已过期，请先复核。');
    if(!Number.isInteger(Number(task.days)) || Number(task.days)<1 || Number(task.days)>30) errors.push('观察周期须为 1–30 个完整自然日。');
    if(!Number.isFinite(Number(task.threshold)) || Number(task.threshold)<=0) errors.push('人工复核阈值须大于 0。');
    if(task.selection==='adjust' && task.budgets.every((v,i)=>Number(v)===(task.currentBudgets||client.budgets)[i])) errors.push('预算尚未发生变化，请调整参数或选择补充验证。');
    return [...new Set(errors)];
  }
  function recommend(client) { const b=[...client.budgets]; const change=client.id==='qinghe'?100:50; b[0]-=change;b[1]+=change;return b; }
  function createExecution(client, task, existing) {
    const current=existing?.items?.map(i=>i.status==='success'?i.to:i.from)||task.currentBudgets||client.budgets;
    return { id:`SIM-${Date.now().toString(36).toUpperCase()}`, version:task.version, status:'running', started:new Date().toISOString(), scenario:task.scenario, items: task.budgets.map((v,i)=>({index:i,name:client.plans[i],from:current[i],to:Number(v),status:current[i]===Number(v)?'unchanged':'pending'})) };
  }
  function settleExecution(ex, scenario) {
    const next=clone(ex);next.finished=new Date().toISOString();
    next.items.forEach(i=>{if(i.status!=='unchanged')i.status=scenario==='success'?'success':scenario==='unknown'?'unknown':scenario==='partial'?(i.to<i.from?'success':'failed'):'failed';});
    next.status=scenario==='success'?'success':scenario==='partial'?'partial':scenario==='unknown'?'unknown':'failed';return next;
  }
  const api={clients,fresh,clone,validate,recommend,createExecution,settleExecution};
  root.KezhiDomain=api;
  if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
