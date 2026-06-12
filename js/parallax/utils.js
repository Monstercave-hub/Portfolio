const preloadImages = (selector = '.grid__item-inner') => {
	return new Promise((resolve) => {
		const elements = [...document.querySelectorAll(selector)];

		elements.forEach(el => {
			if (el.dataset.bg) {
				el.style.backgroundImage = `url(${el.dataset.bg})`;
			}
		});

		const toLoad = elements.filter(el => el.dataset.bg);
		if (toLoad.length === 0) { resolve(); return; }

		let loaded = 0;
		const timeout = setTimeout(resolve, 8000);

		toLoad.forEach(el => {
			const img = new Image();
			img.onload = img.onerror = () => {
				if (++loaded >= toLoad.length) {
					clearTimeout(timeout);
					resolve();
				}
			};
			img.src = el.dataset.bg;
		});
	});
};

export { preloadImages };
