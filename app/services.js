(function () {
  'use strict';
  const KEY='kezhi-demo-v1';
  window.KezhiService={
    mode:'mock',
    load(){try{const s=JSON.parse(localStorage.getItem(KEY));return s?.schema===2?s:null;}catch{return null;}},
    save(state){try{localStorage.setItem(KEY,JSON.stringify(state));return true;}catch{return false;}},
    async diagnose(clientId){await new Promise(r=>setTimeout(r,800));return {clientId,complete:true};},
    async generate(clientId){await new Promise(r=>setTimeout(r,700));return KezhiDomain.recommend(KezhiDomain.clients.find(c=>c.id===clientId));},
    async execute(execution){await new Promise(r=>setTimeout(r,1500));return KezhiDomain.settleExecution(execution,execution.scenario);},
    async query(execution){await new Promise(r=>setTimeout(r,650));return execution.status==='unknown'?KezhiDomain.settleExecution(execution,'success'):execution;},
    reset(){try{localStorage.removeItem(KEY);}catch{}},
    export(state){const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='客知-操作记录.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
  };
})();
