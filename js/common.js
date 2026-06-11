// Nav
$(window).scroll(function () {
  var sc = $(window).scrollTop()
  if (sc > 100) {
      $(".header-sroll").addClass("small")
  } else {
      $(".header-sroll").removeClass("small")
  }
});

$(function () {
  const current = window.location.pathname.replace(/\/$/, '');

  $('nav a').each(function () {
    const link = new URL(this.href, location.origin).pathname.replace(/\/$/, '');

    if (current === link) {
      $(this).addClass('active');
    }
    else if (link !== '' && link !== '/' && current.startsWith(link + '/')) {
      $(this).addClass('active');
    }
  });
});

// Scroll Top
(() => {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const wrap = document.querySelector('.progress-wrap');
    const path = document.querySelector('.progress-wrap path');
    if (!wrap || !path) return;

    const pathLength = path.getTotalLength();

    path.style.transition = 'none';
    path.style.strokeDasharray = `${pathLength} ${pathLength}`;
    path.style.strokeDashoffset = String(pathLength);
    path.getBoundingClientRect();
    path.style.transition = 'stroke-dashoffset 10ms linear';

    const offset = 50;    
    const duration = 550; 

    const updateProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const doc = document.documentElement;
      const height = doc.scrollHeight - window.innerHeight;

      if (height > 0) {
        const progress = pathLength - (scrollTop * pathLength / height);
        if (Number.isFinite(progress)) path.style.strokeDashoffset = String(progress);
      }

      if (scrollTop > offset) wrap.classList.add('active-progress');
      else wrap.classList.remove('active-progress');
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    wrap.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
})();

// FadeIn Scroll Animation
window.addEventListener('DOMContentLoaded', () => {
  const els = document.querySelectorAll('.wow');

  els.forEach(el => {
    el.style.setProperty('--dly', el.dataset.wowDelay || '0s');
    el.style.setProperty('--dur', el.dataset.wowDuration || '600ms');
    el.style.setProperty('--ease', el.dataset.wowEasing || 'ease');
    el.style.setProperty('--dist', el.dataset.wowDistance || '18px');
  });

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  }, {
    threshold: 0.01,
    rootMargin: '0px 0px -10% 0px'
  });

  els.forEach(el => {
    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight * 0.9 && rect.bottom > 0;

    if (inView) {
      el.classList.add('in');
    } else {
      io.observe(el);
    }
  });
});