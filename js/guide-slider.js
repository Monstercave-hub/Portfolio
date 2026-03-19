document.addEventListener('DOMContentLoaded', () => {
  let slidePosition = 0;

  const holder = document.querySelector('#slide-holder');
  const slides = document.querySelectorAll('#slide-holder > div'); // .slide여도 OK
  const nav = document.querySelector('#slide-nav');

  if (!holder || !slides.length || !nav) return;

  const numOfSlide = slides.length;

  // width 세팅
  holder.style.width = (numOfSlide * 100) + '%';
  slides.forEach(slide => {
    slide.style.width = (100 / numOfSlide) + '%';
  });

  // 도트 생성
  for (let i = 0; i < numOfSlide; i++) {
    const a = document.createElement('a');
    a.href = 'javascript:void(0)';
    a.className = 'slide-nav-bt' + (i === 0 ? ' active' : '');
    a.dataset.index = String(i);
    nav.appendChild(a);
  }

  const navButtons = Array.from(nav.querySelectorAll('.slide-nav-bt'));

  function setActive(index) {
    navButtons.forEach(btn => btn.classList.remove('active'));
    if (navButtons[index]) navButtons[index].classList.add('active');
  }

  function moveSlideTo(index) {
    slidePosition = index;
    holder.style.marginLeft = '-' + index + '00%';
    setActive(index);
  }

  // 클릭 이동 + 자동재생 정지
  nav.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;

    const btn = target.closest('.slide-nav-bt');
    if (!btn) return;

    e.preventDefault();

    const idx = Number(btn.dataset.index);
    if (Number.isNaN(idx)) return;

    moveSlideTo(idx);
    clearInterval(autoPlaySlideInter);
  });

  function autoPlaySlide() {
    let next = slidePosition + 1;
    if (next === numOfSlide) next = 0;
    moveSlideTo(next);
  }

  const autoPlaySlideInter = setInterval(autoPlaySlide, 5000);
});
