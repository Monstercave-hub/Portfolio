import { preloadImages } from '/js/parallax/utils.js';

const random = (min, max) => Math.random() * (max - min) + min;

const getScrollProgress = (el) => {
	const rect = el.getBoundingClientRect();
	const viewH = window.innerHeight;
	const traveled = viewH * 1.05 - rect.top;
	const total = viewH * 1.1 + el.offsetHeight;
	return Math.max(0, Math.min(1, traveled / total));
};

const initParallax = () => {
	const grids = document.querySelectorAll('.grid');

	grids.forEach(grid => {
		const gridWrap = grid.querySelector('.grid-wrap');
		const gridItems = [...grid.querySelectorAll('.grid__item')];
		const gridItemsInner = gridItems.map(item => item.querySelector('.grid__item-inner'));

		grid.style.setProperty('--perspective', '1000px');
		grid.style.setProperty('--grid-inner-scale', '0.5');
		gridWrap.style.transform = 'rotateY(25deg)';

		gridItems.forEach(item => {
			item._z = random(-1600, 200);
			item._xStart = random(-1000, -500);
			item._xEnd = random(500, 1000);
			item.style.transform = `translateZ(${item._z}px) translateX(${item._xStart}%)`;
		});

		gridItemsInner.forEach(inner => {
			inner.style.transform = 'scale(2)';
		});

		const update = () => {
			const progress = getScrollProgress(gridWrap);

			gridItems.forEach(item => {
				const x = item._xStart + (item._xEnd - item._xStart) * progress;
				item.style.transform = `translateZ(${item._z}px) translateX(${x}%)`;
			});

			const scale = 2 - 1.5 * progress;
			gridItemsInner.forEach(inner => {
				inner.style.transform = `scale(${scale})`;
			});
		};

		window.addEventListener('scroll', update, { passive: true });
		update();
	});

	document.body.classList.remove('loading');
};

const parallaxSection = document.querySelector('#parallax-area');
if (parallaxSection) {
	const observer = new IntersectionObserver((entries, obs) => {
		if (!entries[0].isIntersecting) return;
		obs.disconnect();
		preloadImages('.grid__item-inner').then(initParallax);
	}, { rootMargin: '500px' });
	observer.observe(parallaxSection);
} else {
	document.body.classList.remove('loading');
}
