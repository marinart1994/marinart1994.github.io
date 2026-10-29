const address = '서울 강남구 개포로 310, 디에이치퍼스티어아이파크 154동 1405호';
const mapQuery = encodeURIComponent('디에이치퍼스티어아이파크 154동');
const mapUrl = `https://map.naver.com/p/search/${mapQuery}`;
const dialog = document.querySelector('#details-dialog');
const content = document.querySelector('#detail-content');
const toast = document.querySelector('#toast');
let toastTimer;
let triggerButton;

const panels = {
  date: `<p class="detail-kicker">SAVE THE DATE · 2026</p><h2 class="detail-title" id="dialog-title">11월 28일,<br>토요일 오후 4시!</h2><p class="detail-copy">오합지졸 서울예고 친구들아,<br>맛있는 거 먹고 밀린 수다도 실컷 떨자.<br>우리 집에서 편하게 만나 ♡</p><div class="detail-box yellow"><p><strong>2026. 11. 28. SAT · 4 PM</strong><br>디에이치퍼스티어아이파크<br>154동 1405호</p></div><div class="detail-actions"><a href="calendar.ics" download="지밍의-집들이.ics">캘린더에 저장 ＋</a></div>`,
  location: `<p class="detail-kicker">FIND YOUR WAY</p><h2 class="detail-title" id="dialog-title">지도에 154동까지<br>꼭 찍고 와 줘!</h2><p class="detail-copy">단지가 넓어서 동수를 꼭 확인해야 해.<br>출발 전에 지도에서 <strong>‘154동’</strong>을<br>구체적으로 찍고 찾아와 줘.</p><div class="detail-box yellow"><p>서울 강남구 개포로 310<br><strong>디에이치퍼스티어아이파크<br>154동 1405호</strong></p></div><div class="detail-actions"><a href="${mapUrl}" target="_blank" rel="noopener noreferrer">154동 지도 검색 ↗</a><button class="secondary" data-copy="address">주소 복사 ⧉</button></div><p class="detail-help">검색 결과에서 목적지가 154동인지 꼭 확인해 줘.</p>`,
  parking: `<p class="detail-kicker">PARKING IS AVAILABLE</p><h2 class="detail-title" id="dialog-title">차 가져와도 좋아!<br>주차 가능해.</h2><p class="detail-copy">차로 오는 친구들은 도착하기 전에<br><strong>차량번호를 지민에게 꼭 전달해 줘.</strong></p><div class="detail-box"><p>보낼 내용은 이렇게!<br><strong>“지민아, 집들이 때 차 가져갈게!<br>차량번호는 [내 차량번호]야.”</strong></p></div><div class="detail-actions"><button data-copy="parking">차량번호 안내 문구 복사 ⧉</button></div><p class="detail-help">복사한 문구에 내 차량번호를 적어서 지민에게 보내 줘.</p>`,
  checklist: `<p class="detail-kicker">A LITTLE REMINDER</p><h2 class="detail-title" id="dialog-title">오합지졸 친구들,<br>오기 전에 이것만!</h2><ul class="checklist"><li><span>1</span><div><strong>11월 28일 토요일 오후 4시</strong><small>우리 집에서 만나자.</small></div></li><li><span>2</span><div><strong>지도에 154동까지 정확하게</strong><small>디에이치퍼스티어아이파크 154동 1405호</small></div></li><li><span>3</span><div><strong>주차 가능 · 차량번호는 미리 지민에게</strong><small>오기 전에 꼭 전달 부탁해!</small></div></li><li><span>♡</span><div><strong>내 집처럼 편안하게 와!</strong><small>귀여움 한 스푼만 더하면 준비 끝.</small></div></li></ul><div class="detail-actions"><button data-show="location">찾아오는 길 확인 ↗</button></div>`
};

function selectPanel(name) {
  if (!panels[name]) return;
  content.innerHTML = panels[name];
  document.querySelector('#dialog-status').textContent = '';
  document.querySelectorAll('[data-tab]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.tab === name)));
}
function openPanel(name, source) {
  selectPanel(name);
  triggerButton = source;
  dialog.showModal();
}
function notify(message) {
  if (dialog.open) {
    document.querySelector('#dialog-status').textContent = message;
    return;
  }
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('visible');
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 3500);
}
async function copyText(type) {
  const value = type === 'address' ? address : '지민아, 집들이 때 차 가져갈게! 차량번호는 [내 차량번호]야.';
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(value);
    notify(type === 'address' ? '주소를 복사했어! 지도에는 154동까지 꼭 확인해 줘.' : '문구를 복사했어! 차량번호를 채워 지민에게 보내 줘.');
  } catch {
    // Keep the text available on file:// pages and browsers that block clipboard access.
    window.prompt('아래 내용을 길게 누르거나 선택해서 복사해 줘.', value);
  }
}
document.addEventListener('click', event => {
  const open = event.target.closest('[data-open]');
  const tab = event.target.closest('[data-tab]');
  const show = event.target.closest('[data-show]');
  const copy = event.target.closest('[data-copy]');
  if (open) openPanel(open.dataset.open, open);
  if (tab) selectPanel(tab.dataset.tab);
  if (show) { selectPanel(show.dataset.show); document.querySelector(`[data-tab="${show.dataset.show}"]`).focus(); }
  if (copy) copyText(copy.dataset.copy);
});
document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const bounds = dialog.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close(); } });
dialog.addEventListener('close', () => triggerButton?.focus());
document.querySelector('#mode-toggle').addEventListener('click', event => {
  const night = document.body.classList.toggle('night');
  event.currentTarget.setAttribute('aria-pressed', String(night));
  event.currentTarget.setAttribute('aria-label', night ? '낮 분위기로 바꾸기' : '밤 분위기로 바꾸기');
  event.currentTarget.firstElementChild.textContent = night ? '☀' : '☾';
  document.querySelector('#mode-text').textContent = night ? '낮으로' : '밤으로';
});
