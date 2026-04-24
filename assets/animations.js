(function () {
	'use strict';

	var animationClasses = [
		'bsm-fade-in',
		'bsm-slide-up',
		'bsm-slide-down',
		'bsm-slide-left',
		'bsm-slide-right',
		'bsm-scale-in',
	];

	function init() {
		var selector = animationClasses.map(function (c) { return '.' + c; }).join(', ');
		var elements = document.querySelectorAll(selector);

		if (!elements.length) return;

		// Fallback for browsers without IntersectionObserver support
		if (!('IntersectionObserver' in window)) {
			elements.forEach(function (el) { el.classList.add('bsm-in-view'); });
			return;
		}

		var observer = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					if (entry.isIntersecting) {
						entry.target.classList.add('bsm-in-view');
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
		);

		elements.forEach(function (el) { observer.observe(el); });
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
