    const eventList = [
      { name: "体育祭",     color: "green",  start: "2025-09-10" },
      { name: "敬老の日",   color: "blue",   start: "2025-09-15" },
      { name: "なんか",     color: "orange", start: "2025-10-15", end: "2025-10-17" },
      { name: "期末テスト", color: "red",    start: "2025-11-20", end: "2025-11-22" },
    ];
    const eventColors = {
      purple:{bg:"#6f42c1",text:"#fff"}, red:{bg:"#dc3545",text:"#fff"},
      green:{bg:"#28a745",text:"#fff"},  blue:{bg:"#1971c2",text:"#fff"},
      orange:{bg:"#fd7e14",text:"#fff"},
    };
    function keyToDate(k){const[y,m,d]=k.split('-').map(Number);return new Date(y,m-1,d);}
    function dateToKey(dt){return`${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;}
    function buildEventMap(){const map={};eventList.forEach(ev=>{const s=keyToDate(ev.start),e=ev.end?keyToDate(ev.end):s,n=Math.round((e-s)/86400000)+1;for(let i=0;i<n;i++){const d=new Date(s);d.setDate(s.getDate()+i);const k=dateToKey(d);if(!map[k])map[k]=[];map[k].push({...ev,isStart:i===0,isEnd:i===n-1,isSpan:n>1});}});return map;}
    let cy,cm;
    function initCalendar(){const t=new Date();cy=t.getFullYear();cm=t.getMonth();renderMonthlyCalendar();}
    function changeMonth(d){cm+=d;if(cm>11){cm=0;cy++;}if(cm<0){cm=11;cy--;}renderMonthlyCalendar();document.getElementById('monthlyEventDetail').style.display='none';}
    function renderMonthlyCalendar(){
      const mn=['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
      document.getElementById('monthlyTitle').textContent=`${cy}年 ${mn[cm]}`;
      const map=buildEventMap(),cells=document.getElementById('monthlyCells'),today=new Date();
      cells.innerHTML='';
      const fd=new Date(cy,cm,1).getDay(),dim=new Date(cy,cm+1,0).getDate();
      for(let i=0;i<fd;i++){const b=document.createElement('div');b.className='monthly-cell empty';cells.appendChild(b);}
      for(let d=1;d<=dim;d++){
        const dow=new Date(cy,cm,d).getDay(),dk=`${cy}-${String(cm+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`,evs=map[dk]||[];
        const cell=document.createElement('div');
        let cls='monthly-cell';if(dow===0)cls+=' sunday';if(dow===6)cls+=' saturday';
        if(today.getFullYear()===cy&&today.getMonth()===cm&&today.getDate()===d)cls+=' today';
        if(evs.length>0)cls+=' has-event';cell.className=cls;
        const n=document.createElement('div');n.className='monthly-day-num';n.textContent=d;cell.appendChild(n);
        evs.slice(0,2).forEach(ev=>{const c=eventColors[ev.color]||eventColors.purple;const dot=document.createElement('div');dot.className='monthly-event-dot'+(ev.isSpan?' span-event':'');if(ev.isSpan)dot.classList.add(ev.isStart?'span-start':ev.isEnd?'span-end':'span-mid');dot.style.background=c.bg;dot.style.color=c.text;dot.textContent=ev.isStart?ev.name:'\u00a0';cell.appendChild(dot);});
        if(evs.length>2){const m=document.createElement('div');m.className='monthly-event-more';m.textContent=`+${evs.length-2}`;cell.appendChild(m);}
        if(evs.length>0)cell.onclick=()=>showDayEvents(d,evs);cells.appendChild(cell);
      }
      renderLegend();
    }
    function showDayEvents(d,evs){const det=document.getElementById('monthlyEventDetail');document.getElementById('monthlyEventDetailTitle').textContent=`${cy}年${cm+1}月${d}日の行事`;const list=document.getElementById('monthlyEventDetailList');list.innerHTML=evs.map(ev=>{const c=eventColors[ev.color]||eventColors.purple;const r=ev.end&&ev.end!==ev.start?`<span class="detail-range">（${ev.start}〜${ev.end}）</span>`:'';return`<li><span class="detail-badge" style="background:${c.bg}">${ev.name}</span>${r}</li>`;}).join('');det.style.display='block';}
    function renderLegend(){const ex=document.getElementById('calendarLegend');if(ex)ex.remove();const map=buildEventMap(),used=new Set();Object.values(map).forEach(evs=>evs.forEach(ev=>{if(ev.isStart)used.add(ev.color||'purple');}));if(used.size===0)return;const labels={purple:'通常行事',red:'試験',green:'学校行事',blue:'祝日',orange:'課外'};const leg=document.createElement('div');leg.id='calendarLegend';leg.className='calendar-legend';used.forEach(col=>{const c=eventColors[col]||eventColors.purple;const item=document.createElement('span');item.className='legend-item';item.innerHTML=`<span class="legend-dot" style="background:${c.bg}"></span>${labels[col]||col}`;leg.appendChild(item);});document.getElementById('monthlyCells').after(leg);}
    function switchCalendarView(id,btn){document.querySelectorAll('.calendar-view').forEach(v=>v.classList.remove('active'));document.querySelectorAll('.calendar-tab').forEach(t=>t.classList.remove('active'));document.getElementById('calendar-'+id).classList.add('active');btn.classList.add('active');if(id==='monthly')renderMonthlyCalendar();}
    let currentCategory='all';
    function searchRules(){applyRulesFilter(document.getElementById('rulesSearchInput').value.trim().toLowerCase(),currentCategory);}
    function filterCategory(cat,btn){currentCategory=cat;document.querySelectorAll('.rules-cat-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');applyRulesFilter(document.getElementById('rulesSearchInput').value.trim().toLowerCase(),cat);}
    function applyRulesFilter(q,cat){const items=document.querySelectorAll('.rule-item');let n=0;items.forEach(item=>{const mc=cat==='all'||item.dataset.category===cat,mq=q===''||item.textContent.toLowerCase().includes(q);if(mc&&mq){item.style.display='';highlightText(item,q);n++;}else{item.style.display='none';}});document.getElementById('rulesNoResult').style.display=n===0?'block':'none';}
    function highlightText(item,q){item.querySelectorAll('.rule-title,.rule-body').forEach(el=>{const orig=el.getAttribute('data-original')||el.textContent;el.setAttribute('data-original',orig);if(q===''){el.innerHTML=orig;}else{const esc=q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');el.innerHTML=orig.replace(new RegExp(esc,'gi'),m=>`<mark class="rule-highlight">${m}</mark>`);}});}
    function toggleAccordion(el){const acc=el.parentElement,cont=acc.querySelector('.accordion-content'),isOpen=acc.classList.contains('active');if(isOpen){cont.style.maxHeight=cont.scrollHeight+'px';requestAnimationFrame(()=>requestAnimationFrame(()=>{cont.style.maxHeight='0';}));acc.classList.remove('active');}else{cont.style.maxHeight='0';acc.classList.add('active');requestAnimationFrame(()=>requestAnimationFrame(()=>{cont.style.maxHeight=cont.scrollHeight+'px';}));cont.addEventListener('transitionend',()=>{if(acc.classList.contains('active'))cont.style.maxHeight='none';},{once:true});}}
    document.querySelectorAll('a[href^="#"]').forEach(a=>{a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'});}});});
    document.addEventListener('DOMContentLoaded',()=>{initCalendar();});
