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

// Scroll to Next Section
(() => {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-scroll-next]').forEach(section => {
      const btn = document.createElement('div');
      btn.className = 'scroll-next-wrap active-scroll-next';
      btn.innerHTML = '<svg class="scroll-next-circle" xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 102 102"><path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" /></svg>';
      section.appendChild(btn);

      const update = () => {
        const bottom = section.offsetTop + section.offsetHeight;
        if (window.scrollY < bottom) {
          btn.classList.add('active-scroll-next');
        } else {
          btn.classList.remove('active-scroll-next');
        }
      };

      update();
      window.addEventListener('scroll', update, { passive: true });

      btn.addEventListener('click', () => {
        const next = section.nextElementSibling;
        if (next) next.scrollIntoView({ behavior: 'smooth' });
      });
    });
  });
})();

// Video - play only when in viewport
window.addEventListener('DOMContentLoaded', () => {
  const videos = document.querySelectorAll('video[data-autoplay-on-view]');
  if (!videos.length) return;

  const videoIO = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const v = e.target;
      if (e.isIntersecting) {
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    }
  }, { threshold: 0.1 });

  videos.forEach(v => videoIO.observe(v));
});

// Animation areas - pause CSS animations when off-screen
window.addEventListener('DOMContentLoaded', () => {
  const els = document.querySelectorAll('.animation-card, .content-animation-area');
  if (!els.length) return;

  const animIO = new IntersectionObserver((entries) => {
    for (const e of entries) {
      e.target.classList.toggle('in-view', e.isIntersecting);
    }
  }, { threshold: 0.1 });

  els.forEach(el => animIO.observe(el));
});

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