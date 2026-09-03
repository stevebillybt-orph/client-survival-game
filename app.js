const questions = [
  {q:'「我覺得呢個 KV 好似差少少嘢。」', a:[
    ['具體係邊一part呢？',8,'good'],
    ['其實我哋已經跟足之前 approved direction。',18,'bad'],
    ['明白，你覺得係 visual impact、message，定 overall feeling？',-8,'best'],
    ['我哋 designer 都覺得已經幾完整。',16,'bad']],
   note:'你成功將「差少少嘢」拆成三個真係可以討論嘅方向。'},

  {q:'「Can you make the logo bigger?」', a:[
    ['可以。',5,'ok'],
    ['唔建議，會破壞 design balance。',15,'bad'],
    ['可以。我哋可以試兩個 size，比較下邊個 brand presence 最好。',-10,'best'],
    ['其實個 logo 已經大過 brand guideline 建議尺寸。',20,'bad']],
   note:'你將一場 taste 爭拗，變成一個可以比較嘅決定。'},

  {q:'「我太太睇完覺得個藍色唔靚。」', a:[
    ['你太太係 target audience 嗎？',100,'mine'],
    ['明白，我哋可以睇下呢隻藍喺成個 brand system 入面扮演咩角色。',-6,'best'],
    ['咁你太太鍾意咩色？',10,'bad'],
    ['其實呢隻藍係經過 strategy 推導出嚟。',14,'bad']],
   note:'你冇挑戰對方太太。求生本能正確。'},

  {q:'「老闆聽日想睇多三個方向。」而家係夜晚 6:43。', a:[
    ['聽日冇可能。',25,'bad'],
    ['可以，但會比較 rough。',6,'ok'],
    ['如果目的係俾老闆揀方向，我哋可以集中整 3 個 clear territories，先唔做 full execution。',-12,'best'],
    ['呢個唔喺 scope 入面。',22,'bad']],
   note:'你解決咗決策問題，而唔係盲目加 artwork 數量。'},

  {q:'「我覺得上一版其實好似好啲。」', a:[
    ['但上一版係你叫我哋改㗎喎。',100,'mine'],
    ['冇問題，我哋可以 revert。',4,'ok'],
    ['我哋可以睇返上一版邊一部分好啲，再決定係 full revert，定保留今版優點。',-10,'best'],
    ['我哋有 keep version。',3,'ok']],
   note:'你成功避開無限改稿輪迴。'},

  {q:'「可唔可以整到 premium 啲？」', a:[
    ['Premium 即係點？',10,'bad'],
    ['可以，加多啲 gold。',18,'bad'],
    ['你想要嘅 premium，比較似 quiet luxury、high-fashion，定 luxury hotel 嗰種感覺？',-9,'best'],
    ['而家已經好 premium。',16,'bad']],
   note:'你將一個好虛嘅形容詞，翻譯成具體視覺方向。'},

  {q:'「可唔可以 viral 啲？」', a:[
    ['Viral 冇人可以 guarantee。',12,'bad'],
    ['可以。',9,'bad'],
    ['如果你講 viral，我想先確認你最想要係 shareability、conversation，定 reach？',-8,'best'],
    ['要加 budget。',18,'bad']],
   note:'你成功頂住「viral」呢個字，而且冇亂咁應承。'},

  {q:'「我哋 CEO 覺得個 idea 太簡單。」', a:[
    ['Simple 唔代表唔好。',11,'bad'],
    ['Apple 都係簡單。',15,'bad'],
    ['CEO 覺得簡單，係因為 execution 太少，定係 idea 本身唔夠有份量？',-7,'best'],
    ['其實越簡單越難做。',12,'bad']],
   note:'你先診斷問題，再保衛 creative。'},

  {q:'「Competitor 最近嗰條片幾好喎。」', a:[
    ['我覺得一般。',16,'bad'],
    ['係，佢哋 production budget 應該高好多。',12,'bad'],
    ['佢哋頭 3 秒個 hook 做得幾好。我哋可以借個 principle，但唔需要直接 copy execution。',-10,'best'],
    ['我哋之前都有 propose 過類似。',18,'bad']],
   note:'先認同，再抽原理，跟住重新引導。'},

  {q:'「咁你自己覺得邊個方向最好？」', a:[
    ['三個都各有優點。',15,'bad'],
    ['睇你哋鍾意。',19,'bad'],
    ['如果目標係建立 brand distinctiveness，我會揀 Direction B，原因有三個。',-15,'best'],
    ['其實我哋 internal 都未有 consensus。',24,'bad']],
   note:'客戶請 agency，唔係想買更多猶豫。'}
];

let idx = 0, risk = 50, time = 12, timer = null, usedRecall = false, lastDelta = 0, answered = false;
const $ = s => document.querySelector(s);

function show(id){
  document.querySelectorAll('.screen').forEach(x => x.classList.remove('active'));
  $('#' + id).classList.add('active');
}

function setRisk(v){
  risk = Math.max(0, Math.min(100, v));
  $('#riskValue').textContent = risk;
  $('#riskBar').style.width = risk + '%';
}

function start(){
  idx = 0;
  usedRecall = false;
  setRisk(50);
  show('game');
  loadQuestion();
}

function loadQuestion(){
  clearInterval(timer);
  answered = false;
  time = 12;
  $('#timer').textContent = '12秒';
  $('#feedback').classList.add('hidden');
  $('#answers').innerHTML = '';
  $('#progress').textContent = String(idx + 1).padStart(2, '0') + ' / ' + String(questions.length).padStart(2, '0');
  $('#questionText').textContent = questions[idx].q;

  $('#recallBtn').disabled = usedRecall;
  $('#recallBtn').classList.toggle('used', usedRecall);
  $('#recallBtn span').textContent = usedRecall ? '已用咗' : '仲有 1 次';

  questions[idx].a.forEach((a, i) => {
    const b = document.createElement('button');
    b.className = 'answer';
    b.innerHTML = `<span>${String.fromCharCode(65 + i)}.</span><span>${a[0]}</span>`;
    b.onclick = () => answer(i, b);
    $('#answers').appendChild(b);
  });

  timer = setInterval(() => {
    time--;
    $('#timer').textContent = time + '秒';
    if(time <= 0){
      clearInterval(timer);
      timeout();
    }
  }, 1000);
}

function timeout(){
  if(answered) return;
  answered = true;
  lastDelta = 22;
  setRisk(risk + 22);
  lock();
  reveal('已讀你 12 秒', '你冇覆到。', '你嘅沉默已經被理解成一種態度。個客流失指數 +22。');
  if(risk >= 100) setTimeout(result, 850);
}

function answer(i, button){
  if(answered) return;
  answered = true;
  clearInterval(timer);

  const a = questions[idx].a[i];
  lastDelta = a[1];
  lock();

  button.classList.add('selected', a[2] === 'best' ? 'correct' : 'bad');

  if(a[2] === 'mine'){
    setRisk(100);
    document.body.classList.add('shake');
    setTimeout(() => document.body.classList.remove('shake'), 350);
    reveal('踩中地雷', '你 technically 係啱，但 socially 已經死咗。', '你揀咗一句通常會以「多謝你哋一直以來嘅支持」收尾嘅說話。');
    setTimeout(result, 1200);
    return;
  }

  setRisk(risk + a[1]);

  if(a[1] < 0){
    reveal('識讀空氣', '你 get 到個場。', questions[idx].note + ` 個客流失指數 ${a[1]}.`);
  } else if(a[1] <= 6){
    reveal('暫時未死', '唔算靚，但仲未出事。', `今次傷害唔算大。個客流失指數 +${a[1]}.`);
  } else {
    reveal('客戶輸入中…', '防守味太重。', `呢個答案只會幫你製造下一場會。個客流失指數 +${a[1]}.`);
  }

  if(risk >= 100) setTimeout(result, 900);
}

function lock(){
  document.querySelectorAll('.answer').forEach(b => b.disabled = true);
}

function reveal(tag, title, text){
  $('#feedbackTag').textContent = tag;
  $('#feedbackTitle').textContent = title;
  $('#feedbackText').textContent = text;
  $('#feedback').classList.remove('hidden');
}

function next(){
  if(idx >= questions.length - 1) return result();
  idx++;
  loadQuestion();
}

function recall(){
  if(!answered || usedRecall || risk >= 100) return;
  usedRecall = true;
  setRisk(risk - lastDelta + 12);
  $('#feedbackTag').textContent = '訊息已撤回';
  $('#feedbackTitle').textContent = '太遲啦，對方已經睇到通知預覽。';
  $('#feedbackText').textContent = '你上一句造成嘅傷害已經撤銷，但撤回訊息一樣會令個客流失指數 +12。';
  $('#recallBtn').disabled = true;
  $('#recallBtn').classList.add('used');
  $('#recallBtn span').textContent = '已用咗';
}

function result(){
  clearInterval(timer);
  show('result');
  $('#resultRisk').textContent = risk;

  let t, txt, q;

  if(risk <= 25){
    t = '信任拍檔';
    txt = '你竟然開完個會之後，比開會前更得到信任。';
    q = '「你哋決定啦，我信你哋。」';
  } else if(risk <= 50){
    t = '安全過骨';
    txt = '唔算完美，但呢段合作關係仲可以捱到下一個 budget cycle。';
    q = '「今次 overall 都幾順。」';
  } else if(risk <= 75){
    t = '純供應商模式';
    txt = '你仲有個 account，但情感上，採購部已經接管咗你。';
    q = '「Send 返 editable file 畀我哋。」';
  } else if(risk < 100){
    t = '採購部已加入聊天室';
    txt = '呢段合作而家喺對方公司內部，已經被形容為「要再觀察下先」。';
    q = '「我哋下年可能會重新 pitch。」';
  } else {
    t = '個 account 冇咗';
    txt = '只係一句說話，就足以將 agency-client relationship 變成一份 credentials deck。';
    q = '「多謝你哋一直以來嘅支持。」';
  }

  $('#resultTitle').innerHTML = t.replace('\n', '<br>');
  $('#resultText').textContent = txt;
  $('#quote').textContent = '客戶：' + q;
}

function copyResult(){
  const txt = `我喺《個客仲喺度？》拎到 ${risk}/100 個客流失指數 —— ${$('#resultTitle').textContent.trim()}`;
  navigator.clipboard?.writeText(txt);
  $('#copyBtn').textContent = '已複製 ✓';
  setTimeout(() => $('#copyBtn').textContent = '複製結果', 1400);
}

$('#startBtn').onclick = start;
$('#nextBtn').onclick = next;
$('#recallBtn').onclick = recall;
$('#restartBtn').onclick = start;
$('#copyBtn').onclick = copyResult;
