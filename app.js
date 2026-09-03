const questions = [
  {q:'「我覺得呢個 KV 好似差少少嘢。」', a:[
    ['具體係邊一部分呢？',8,'good'],['其實我哋已經跟足之前 approved direction。',18,'bad'],['明白，你覺得係 visual impact、message 定 overall feeling？',-8,'best'],['我哋 designer 都覺得已經幾完整。',16,'bad']],
   note:'You turned “差少少嘢” into three things that can actually be discussed.'},
  {q:'“Can you make the logo bigger?”', a:[
    ['可以。',5,'ok'],['唔建議，會破壞 design balance。',15,'bad'],['可以。我哋可以試兩個 size，比較邊個 brand presence 最好。',-10,'best'],['其實 logo 已經大過 brand guideline 建議尺寸。',20,'bad']],note:'You turned a taste argument into a comparison decision.'},
  {q:'「我太太睇完覺得個藍色唔靚。」', a:[
    ['你太太係 target audience 嗎？',100,'mine'],['明白，我哋可以睇下藍色喺整體 brand system 入面嘅角色。',-6,'best'],['咁你太太鍾意咩色？',10,'bad'],['其實呢隻藍係經過 strategy 推導出嚟。',14,'bad']],note:'You did not challenge the spouse. Correct survival instinct.'},
  {q:'「老闆聽日想睇多三個方向。」而家係 6:43 PM。', a:[
    ['聽日唔可能。',25,'bad'],['可以，但會比較 rough。',6,'ok'],['如果目的係俾老闆揀方向，我哋可以集中做 3 個 clear territories，先唔做 full execution。',-12,'best'],['呢個唔喺 scope 入面。',22,'bad']],note:'You solved the decision problem, not the artwork count.'},
  {q:'「我覺得上一版其實好似好啲。」', a:[
    ['但上一版係你叫我哋改㗎喎。',100,'mine'],['冇問題，我哋可以 revert。',4,'ok'],['我哋睇返上一版邊一部分更好，再決定 full revert 定保留今版優點。',-10,'best'],['我哋都有 keep version。',3,'ok']],note:'You avoided the infinite revision loop.'},
  {q:'「可唔可以整到 premium 啲？」', a:[
    ['Premium 即係點？',10,'bad'],['可以，加多啲 gold。',18,'bad'],['你想要嘅 premium，比較接近 quiet luxury、high-fashion，定 luxury hotel？',-9,'best'],['而家已經 premium。',16,'bad']],note:'You translated one vague adjective into visual territories.'},
  {q:'「可唔可以 viral 啲？」', a:[
    ['Viral 冇人可以 guarantee。',12,'bad'],['可以。',9,'bad'],['如果你講 viral，我想先確認你最想要係 shareability、conversation，定 reach？',-8,'best'],['要加 budget。',18,'bad']],note:'You survived the word “viral” without promising the internet.'},
  {q:'「我哋 CEO 覺得個 idea 太簡單。」', a:[
    ['Simple 唔代表唔好。',11,'bad'],['Apple 都係簡單。',15,'bad'],['CEO 覺得簡單，係因為 execution 太少，定 idea 本身唔夠有份量？',-7,'best'],['其實越簡單越難做。',12,'bad']],note:'You diagnosed before defending the creative.'},
  {q:'「Competitor 最近嗰條片幾好喎。」', a:[
    ['我覺得一般。',16,'bad'],['係，佢哋 production budget 應該高好多。',12,'bad'],['佢哋頭 3 秒個 hook 做得幾好。我哋可以借個 principle，但唔需要 copy execution。',-10,'best'],['我哋之前都有 propose 過類似。',18,'bad']],note:'Acknowledge → extract principle → redirect.'},
  {q:'「咁你自己覺得邊個方向最好？」', a:[
    ['三個都各有優點。',15,'bad'],['睇你哋鍾意。',19,'bad'],['如果目標係建立 brand distinctiveness，我會揀 Direction B。原因有三個。',-15,'best'],['其實我哋 internal 都未有 consensus。',24,'bad']],note:'Clients do not hire an agency to receive more indecision.'}
];

let idx=0,risk=50,time=12,timer=null,usedRecall=false,lastDelta=0,answered=false;
const $=s=>document.querySelector(s);
function show(id){document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));$('#'+id).classList.add('active')}
function setRisk(v){risk=Math.max(0,Math.min(100,v));$('#riskValue').textContent=risk;$('#riskBar').style.width=risk+'%'}
function start(){idx=0;usedRecall=false;setRisk(50);show('game');loadQuestion()}
function loadQuestion(){clearInterval(timer);answered=false;time=12;$('#timer').textContent='12s';$('#feedback').classList.add('hidden');$('#answers').innerHTML='';$('#progress').textContent=String(idx+1).padStart(2,'0')+' / '+String(questions.length).padStart(2,'0');$('#questionText').textContent=questions[idx].q;$('#recallBtn').disabled=usedRecall;$('#recallBtn').classList.toggle('used',usedRecall);$('#recallBtn span').textContent=usedRecall?'USED':'1 LEFT';questions[idx].a.forEach((a,i)=>{const b=document.createElement('button');b.className='answer';b.innerHTML=`<span>${String.fromCharCode(65+i)}.</span><span>${a[0]}</span>`;b.onclick=()=>answer(i,b);$('#answers').appendChild(b)});timer=setInterval(()=>{time--;$('#timer').textContent=time+'s';if(time<=0){clearInterval(timer);timeout()}},1000)}
function timeout(){if(answered)return;answered=true;lastDelta=22;setRisk(risk+22);lock();reveal('SEEN 12 SECONDS AGO','You said nothing.','Silence has been interpreted as a strategic position. Account Risk +22.');if(risk>=100) setTimeout(result,850)}
function answer(i,button){if(answered)return;answered=true;clearInterval(timer);const a=questions[idx].a[i];lastDelta=a[1];lock();button.classList.add('selected',a[2]==='best'?'correct':'bad');if(a[2]==='mine'){setRisk(100);document.body.classList.add('shake');setTimeout(()=>document.body.classList.remove('shake'),350);reveal('CRITICAL HIT','Technically correct. Socially suicidal.','You found the sentence that ends with “thanks for all your support.”');setTimeout(result,1200);return}setRisk(risk+a[1]);if(a[1]<0) reveal('GOOD READ','You read the room.',questions[idx].note+` Account Risk ${a[1]}.`);else if(a[1]<=6) reveal('SURVIVED','Not elegant. Still employed.',`No major damage. Account Risk +${a[1]}.`);else reveal('CLIENT IS TYPING…','Defensive energy detected.',`That answer created another meeting. Account Risk +${a[1]}.`);if(risk>=100)setTimeout(result,900)}
function lock(){document.querySelectorAll('.answer').forEach(b=>b.disabled=true)}
function reveal(tag,title,text){$('#feedbackTag').textContent=tag;$('#feedbackTitle').textContent=title;$('#feedbackText').textContent=text;$('#feedback').classList.remove('hidden')}
function next(){if(idx>=questions.length-1)return result();idx++;loadQuestion()}
function recall(){if(!answered||usedRecall||risk>=100)return;usedRecall=true;setRisk(risk-lastDelta+12);$('#feedbackTag').textContent='MESSAGE RECALLED';$('#feedbackTitle').textContent='Too late. They saw the preview.';$('#feedbackText').textContent='Your previous damage was reversed, but recalling a message costs +12 Account Risk.';$('#recallBtn').disabled=true;$('#recallBtn').classList.add('used');$('#recallBtn span').textContent='USED'}
function result(){clearInterval(timer);show('result');$('#resultRisk').textContent=risk;let t,txt,q;if(risk<=25){t='TRUSTED PARTNER';txt='You somehow left the meeting with more trust than you entered with.';q='「你哋決定啦，我信你哋。」'}else if(risk<=50){t='SAFE FOR\nANOTHER CAMPAIGN';txt='Not flawless, but the relationship survives another budget cycle.';q='「今次 overall 都幾順。」'}else if(risk<=75){t='JUST A VENDOR';txt='You still have the account. Emotionally, procurement already owns you.';q='「Send 返 editable file 畀我哋。」'}else if(risk<100){t='PROCUREMENT HAS\nENTERED THE CHAT';txt='The relationship is now described internally as “under review.”';q='「我哋下年可能會重新 pitch。」'}else{t='ACCOUNT LOST';txt='One sentence turned an agency-client relationship into a credentials deck.';q='「多謝你哋一直以來嘅支持。」'}$('#resultTitle').innerHTML=t.replace('\n','<br>');$('#resultText').textContent=txt;$('#quote').textContent=q}
function copyResult(){const txt=`I got ${risk}/100 Account Risk in “Are You Still On The Account?” — ${$('#resultTitle').textContent.trim()}`;navigator.clipboard?.writeText(txt);$('#copyBtn').textContent='COPIED ✓';setTimeout(()=>$('#copyBtn').textContent='COPY RESULT',1400)}
$('#startBtn').onclick=start;$('#nextBtn').onclick=next;$('#recallBtn').onclick=recall;$('#restartBtn').onclick=start;$('#copyBtn').onclick=copyResult;
