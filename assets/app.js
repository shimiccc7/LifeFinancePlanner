
const defaults={income:0,travelGoal:0,travelNow:0,travelMonthly:0,esppPct:8,quests:[false,false,false,false,false],fontScale:1};
const defs={
 mortgage:{name:'房貸／住房',subs:['房貸','管理費','水電／瓦斯']},
 education:{name:'子女教育／課程',subs:['學校／學雜費','英文｜以馬內利美語','小提琴｜星晴','籃球 A2','游泳｜FSIMG 鯊魚團練','游泳｜個別課','數學／家教','鋼琴｜鈞鈞','圍棋','MTB 單車','小鐵人','芭蕾','水球','水舞／美人魚','教材／書籍／學習 App','比賽／報名／活動費']},
 transport:{name:'交通／校車',subs:['校車／大眾運輸','油資／停車','計程車']},
 loans:{name:'其他貸款',subs:['中信信貸','聯邦信貸','LINE Bank 信貸','信用卡分期／其他貸款']},
 living:{name:'生活費',subs:['餐飲','日用品','電信／網路']},
 insurance:{name:'保險／醫療',subs:['保險','醫療／藥品']},
 travel:{name:'年度旅遊基金',subs:['機票／交通','住宿','活動／當地支出']},
 emergency:{name:'緊急預備金',subs:['緊急預備金']},
 invest:{name:'非 AMD 長期投資',subs:['ETF／基金','其他長期投資']},
 other:{name:'彈性／大型支出',subs:['課程／器材','臨時支出']}
};
let raw={};try{raw=JSON.parse(localStorage.getItem('lfp')||'{}')}catch(e){}
let s=Object.assign({},defaults,raw);if(!s.fontScale)s.fontScale=1;
['allocTravel','allocEmergency','allocInvest','allocFree'].forEach(function(k){if(typeof s[k]!=='number')s[k]=0});
if(!s.employerStock)s.employerStock={rsuShares:58,rsuBasis:529.14,soldShares:10,soldPrice:624.80,esppPct:s.esppPct||8,esppMax:15,nextPurchase:'2026-11',esppAmount:60000};
if(!Array.isArray(s.stockEvents))s.stockEvents=[{date:'2026-09-24',kind:'RSU Sell',name:'RSU 已實現',memo:'10 股 @ US$624.80',done:true},{date:'2026-11-15',kind:'ESPP Purchase',name:'ESPP 預計購入',memo:'本期預估投入 NT$60,000',done:false}];document.documentElement.style.setProperty('--font-scale',s.fontScale);
if(!s.subcategories){s.subcategories={};for(const k in defs)s.subcategories[k]=defs[k].subs.map(n=>[n,0]);}
for(const k in defs){
 if(!Array.isArray(s.subcategories[k]))s.subcategories[k]=[];
 const names=s.subcategories[k].map(function(x){return x[0]});
 defs[k].subs.forEach(function(n){if(names.indexOf(n)<0)s.subcategories[k].push([n,0])});
}
const money=n=>'NT</body></html>+Math.round(Number(n)||0).toLocaleString('zh-TW');
function persist(){localStorage.setItem('lfp',JSON.stringify(s))}
function total(k){return (s.subcategories[k]||[]).reduce((a,x)=>a+(Number(x[1])||0),0)}
function updateFutureMe(){
 var set=function(id,v){var e=document.getElementById(id);if(e)e.textContent=money(v)};
 set('fmTravel',(s.allocTravel||0)*12);set('fmEmergency',(s.allocEmergency||0)*12);set('fmInvest',(s.allocInvest||0)*12);set('fmFree',(s.allocFree||0)*12);
 var sum=document.getElementById('fmSummary');if(sum){var total=((s.allocTravel||0)+(s.allocEmergency||0)+(s.allocInvest||0)+(s.allocFree||0))*12;sum.innerHTML=total>0?'照目前節奏，未來 12 個月會有 <b>'+money(total)+'</b> 被有目的地分配。':'先在「計畫」完成 Smart Allocation，這裡就會出現 12 個月後的結果。'}
}
function updateAllocation(){
 var essential=['mortgage','education','transport','loans','living','insurance','other'].reduce(function(a,k){return a+total(k)},0);
 var espp=(Number(s.income)||0)*(Number(s.esppPct)||0)/100;
 var available=Math.max(0,(Number(s.income)||0)-essential-espp);
 var used=(s.allocTravel||0)+(s.allocEmergency||0)+(s.allocInvest||0)+(s.allocFree||0);
 var remain=available-used;
 var txt=function(id,v){var e=document.getElementById(id);if(e)e.textContent=v};
 var val=function(id,v){var e=document.getElementById(id);if(e&&document.activeElement!==e)e.value=v};
 txt('allocAvailable',money(available));txt('allocRemain',money(remain));
 var re=document.getElementById('allocRemain');if(re)re.className='k '+(remain<0?'':'good');
 val('allocTravel',s.allocTravel);val('allocEmergency',s.allocEmergency);val('allocInvest',s.allocInvest);val('allocFree',s.allocFree);
 var note=document.getElementById('allocNote');if(note)note.innerHTML=remain<0?'<b>目前超出可分配金額 '+money(Math.abs(remain))+'</b>，請降低配置。':'一年照此配置：旅行 '+money(s.allocTravel*12)+' · 安全網 '+money(s.allocEmergency*12)+' · 投資本金 '+money(s.allocInvest*12);
 updateFutureMe();return available;
}
function renderStockEvents(){
 var host=document.getElementById('stockEventsList');if(!host)return;
 var arr=s.stockEvents.slice().sort(function(a,b){return String(a.date).localeCompare(String(b.date))});
 host.innerHTML=arr.map(function(ev){var i=s.stockEvents.indexOf(ev);return '<div class="stock-event '+(ev.done?'done':'')+'"><span class="event-dot"></span><div><div class="event-date">'+String(ev.date||'').replace(/-/g,'/')+' · '+(ev.kind||'其他')+'</div><div class="event-name">'+(ev.name||'未命名')+'</div><div class="event-memo">'+(ev.memo||'')+'</div></div><div class="event-menu"><button type="button" data-event-toggle="'+i+'">'+(ev.done?'復原':'完成')+'</button><button type="button" data-event-delete="'+i+'">刪除</button></div></div>'}).join('');
 host.querySelectorAll('[data-event-toggle]').forEach(function(b){b.onclick=function(){var i=Number(b.getAttribute('data-event-toggle'));if(!s.stockEvents[i])return;s.stockEvents[i].done=!s.stockEvents[i].done;persist();renderStockEvents()}});
 host.querySelectorAll('[data-event-delete]').forEach(function(b){b.onclick=function(){var i=Number(b.getAttribute('data-event-delete'));if(!s.stockEvents[i])return;s.stockEvents.splice(i,1);persist();renderStockEvents()}});
}
function bindStockEvents(){
 var add=document.getElementById('eventAdd'),form=document.getElementById('eventForm'),cancel=document.getElementById('eventCancel'),save=document.getElementById('eventSave');
 if(add&&form)add.onclick=function(){form.style.display='block'};
 if(cancel&&form)cancel.onclick=function(){form.style.display='none'};
 if(save&&form)save.onclick=function(){var d=document.getElementById('eventDate').value,n=document.getElementById('eventName').value.trim();if(!d||!n)return;s.stockEvents.push({date:d,kind:document.getElementById('eventKind').value,name:n,memo:document.getElementById('eventMemo').value.trim(),done:false});persist();form.style.display='none';document.getElementById('eventName').value='';document.getElementById('eventMemo').value='';renderStockEvents()};
}
function updateStock(){
 var x=s.employerStock||{};
 var set=function(id,v){var e=document.getElementById(id);if(e)e.textContent=v};
 var val=function(id,v){var e=document.getElementById(id);if(e&&document.activeElement!==e)e.value=v};
 set('rsuViewShares',x.rsuShares||0);set('rsuViewBasis',Number(x.rsuBasis||0).toFixed(2));
 set('rsuViewSold',(x.soldShares||0)+' 股 @ US
 const espp=(Number(s.income)||0)*(Number(s.esppPct)||0)/100;
 const spent=Object.keys(defs).reduce((a,k)=>a+total(k),0)+espp;
 document.getElementById('incomeK').textContent=money(s.income);document.getElementById('spentK').textContent=money(spent);document.getElementById('leftK').textContent=money((Number(s.income)||0)-spent);
 const r=s.income?Math.max(0,Math.min(100,((s.income-spent)/s.income)*100)):0;document.getElementById('safeBar').style.width=r+'%';document.getElementById('safeTxt').textContent='月收入扣除規劃後保留 '+r.toFixed(1)+'% 現金彈性';
 updateAllocation();
}
function bindBudget(){
 document.querySelectorAll('.budget-toggle').forEach(b=>b.onclick=()=>{const g=b.closest('.budget-group');g.classList.toggle('open');b.textContent=g.classList.contains('open')?'−':'＋'});
 document.querySelectorAll('.subamt').forEach(e=>e.oninput=()=>{const k=e.dataset.k,i=+e.dataset.i;s.subcategories[k][i][1]=Math.max(0,Number(e.value)||0);e.closest('.budget-group').querySelector('.budget-total').textContent=money(total(k));persist();calc()});
 document.querySelectorAll('.subname').forEach(e=>e.onchange=()=>{s.subcategories[e.dataset.k][+e.dataset.i][0]=e.value.trim()||'未命名';persist()});
 document.querySelectorAll('.del').forEach(b=>b.onclick=()=>{const k=b.dataset.k;s.subcategories[k].splice(+b.dataset.i,1);persist();renderBudget();(()=>{const g=document.querySelector('[data-group="'+k+'"]');if(g){g.classList.add('open');const bt=g.querySelector('.budget-toggle');if(bt)bt.textContent='−'}})()});
 document.querySelectorAll('.add').forEach(b=>b.onclick=()=>{const k=b.dataset.k;s.subcategories[k].push(['新項目',0]);persist();renderBudget();const g=document.querySelector('[data-group="'+k+'"]');if(g){g.classList.add('open');const bt=g.querySelector('.budget-toggle');if(bt)bt.textContent='−'}});
}
function renderBudget(){
 document.getElementById('budgetRows').innerHTML='<div class="row"><b>可分配月收入</b><input id="incomeInput" type="number" inputmode="numeric" value="'+(s.income||0)+'"></div>'+Object.entries(defs).map(([k,d])=>'<div class="budget-group" data-group="'+k+'"><div class="budget-head"><button type="button" class="budget-toggle">＋</button><div class="budget-title"><b>'+d.name+'</b></div><div class="budget-total">'+money(total(k))+'</div></div><div class="budget-children">'+(s.subcategories[k]||[]).map((x,i)=>'<div class="subrow"><input class="subname" data-k="'+k+'" data-i="'+i+'" value="'+String(x[0]).replace(/"/g,'&quot;')+'"><input class="subamt" data-k="'+k+'" data-i="'+i+'" type="number" inputmode="numeric" min="0" value="'+(Number(x[1])||0)+'"><button type="button" class="del" data-k="'+k+'" data-i="'+i+'">×</button></div>').join('')+'<button type="button" class="add" data-k="'+k+'">＋ 新增子分類</button></div></div>').join('');
 document.getElementById('incomeInput').oninput=()=>{s.income=Number(document.getElementById('incomeInput').value)||0;persist();calc()};bindBudget();
}
function render(){
 renderBudget();calc();updateStock();updateFutureMe();renderStockEvents();
  document.getElementById('travelGoal').value=s.travelGoal;document.getElementById('travelNow').value=s.travelNow;document.getElementById('travelMonthly').value=s.travelMonthly;
 const rem=Math.max(0,s.travelGoal-s.travelNow),m=Math.max(1,Math.ceil(rem/Math.max(1,s.travelMonthly)));document.getElementById('travelNeed').textContent='照目前速度約 '+m+' 個月達標';document.getElementById('travelBar').style.width=(s.travelGoal?Math.min(100,s.travelNow/s.travelGoal*100):0)+'%';
  document.getElementById('questRows').innerHTML=['沒有新增高利消費債','旅遊基金完成投入','緊急預備金完成投入','ESPP 符合現金流','完成月底 Review'].map((q,i)=>'<label class="quest"><input data-q="'+i+'" type="checkbox" '+(s.quests[i]?'checked':'')+'><span>'+q+'</span></label>').join('');
 const xp=s.quests.filter(Boolean).length*20;var xpEl=document.getElementById('xp');if(xpEl)xpEl.textContent=xp;var levelEl=document.getElementById('level');if(levelEl)levelEl.textContent=xp>=80?'Gold':xp>=40?'Silver':'Bronze';
 document.querySelectorAll('[data-q]').forEach(e=>e.onchange=()=>{s.quests[+e.dataset.q]=e.checked;persist();render()});
}
function bindTabs(){document.querySelectorAll('.tabs a').forEach(function(b){b.onclick=function(){document.querySelectorAll('.tabs button').forEach(function(x){x.classList.remove('on')});document.querySelectorAll('.page').forEach(function(x){x.classList.remove('on')});b.classList.add('on');var p=document.getElementById(b.getAttribute('data-p'));if(p)p.classList.add('on')}})}
function boot(){
 var phase='start';
 try{
  phase='render';render();
  phase='tabs';bindTabs();
  ['travelGoal','travelNow','travelMonthly'].forEach(function(id){var el=document.getElementById(id);if(el)el.oninput=function(e){s[id]=Number(e.target.value)||0;persist();if(id==='esppPct')calc()}});
  bindStockEvents();
  var allocFields=['allocTravel','allocEmergency','allocInvest','allocFree'];
  allocFields.forEach(function(id){var e=document.getElementById(id);if(e)e.oninput=function(){s[id]=Math.max(0,Number(e.value)||0);persist();updateAllocation()}});
  var sa=document.getElementById('suggestAlloc');if(sa)sa.onclick=function(){var a=updateAllocation();s.allocTravel=Math.round(a*.25);s.allocEmergency=Math.round(a*.30);s.allocInvest=Math.round(a*.30);s.allocFree=Math.max(0,a-s.allocTravel-s.allocEmergency-s.allocInvest);persist();updateAllocation()};
  var stockFields=['rsuEditShares','rsuEditBasis','rsuEditSoldShares','rsuEditSoldPrice','esppEditPct','esppEditAmount'];
  stockFields.forEach(function(id){var e=document.getElementById(id);if(e)e.oninput=function(){
   if(id==='rsuEditShares')s.employerStock.rsuShares=Math.max(0,Number(e.value)||0);
   if(id==='rsuEditBasis')s.employerStock.rsuBasis=Math.max(0,Number(e.value)||0);
   if(id==='rsuEditSoldShares')s.employerStock.soldShares=Math.max(0,Number(e.value)||0);
   if(id==='rsuEditSoldPrice')s.employerStock.soldPrice=Math.max(0,Number(e.value)||0);
   if(id==='esppEditPct'){s.esppPct=Math.max(0,Math.min(15,Number(e.value)||0));s.employerStock.esppPct=s.esppPct;var ep=document.getElementById('esppPct');if(ep)ep.value=s.esppPct;calc()}
   if(id==='esppEditAmount')s.employerStock.esppAmount=Math.max(0,Number(e.value)||0);
   persist();updateStock();
  }});
  var fd=document.getElementById('fontDown'),fu=document.getElementById('fontUp');
  if(fd)fd.onclick=function(){s.fontScale=Math.max(.9,Math.round((s.fontScale-.05)*100)/100);document.documentElement.style.setProperty('--font-scale',s.fontScale);persist()};
  if(fu)fu.onclick=function(){s.fontScale=Math.min(1.25,Math.round((s.fontScale+.05)*100)/100);document.documentElement.style.setProperty('--font-scale',s.fontScale);persist()};
  phase='done';document.documentElement.setAttribute('data-app-ready','1');
 }catch(err){
  var n=document.createElement('div');n.style.cssText='margin:12px;padding:12px;border-radius:10px;background:#fff1f0;color:#8a1c1c;font:14px system-ui';n.textContent='介面初始化失敗 ['+phase+']：'+(err&&err.message?err.message:String(err));document.body.insertBefore(n,document.body.firstChild);
 }
}
boot()
