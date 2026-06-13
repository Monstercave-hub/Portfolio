
(function() {

    // ==== BEGINS PLUGIN ====
    function multislider(element, data, callback) {

        // ==== CACHE DOM ====
        var slider = element;
        var msContent = slider.querySelector('.MS-content');
        var msRight = slider.querySelector('button.MS-right');
        var msLeft = slider.querySelector('button.MS-left');
        var imgFirst = msContent.querySelector('.item:first-child');

        // === DETERMINE ACTION ====
        if (typeof data === 'string') {
            getStringArgs(data);
            return slider;
        } else if (typeof data === 'object' || typeof data === 'undefined') {
            init();
        }

        // ==== PLUGIN VARIABLES ====
        var imgLast,
            totalWidth,
            numberVisibleSlides,
            animateDistance,
            animateSlideRight,
            animateSlideLeft,
            defaults,
            settings,
            animateDuration,
            autoSlideInterval,
            currentAnimation = null;

        var sliderData = {};

        // = INITIALIZE =
        function init() {
            minifyContent();
            createSettings();
            saveData();
            selectAnimations();
        }


        // ==== EVENT HANDLERS ====
        if (msRight) msRight.addEventListener('click', function() { if (animateSlideLeft) animateSlideLeft(); });
        if (msLeft) msLeft.addEventListener('click', function() { if (animateSlideRight) animateSlideRight(); });
        slider.addEventListener('click', function(e) {
            if (e.target.closest('.MS-right, .MS-left')) resetInterval();
        });
        window.addEventListener('resize', findItemWidth);


        // ==== FUNCTIONS ====

        function pauseAbove() {
            if (window.innerWidth > settings.pauseAbove) { slider.classList.add('ms-PAUSE'); }
            window.addEventListener('resize', function() {
                if (window.innerWidth > settings.pauseAbove) {
                    slider.classList.add('ms-PAUSE');
                } else {
                    slider.classList.remove('ms-PAUSE');
                }
            });
        }

        function pauseBelow() {
            if (window.innerWidth < settings.pauseBelow) { slider.classList.add('ms-PAUSE'); }
            window.addEventListener('resize', function() {
                if (window.innerWidth < settings.pauseBelow) {
                    slider.classList.add('ms-PAUSE');
                } else {
                    slider.classList.remove('ms-PAUSE');
                }
            });
        }

        function getStringArgs(str) {
            if (typeof sliderData[str] !== 'undefined') {
                sliderData[str]();
            } else {
                console.error("Multislider currently only accepts the following methods: next, prev, pause, play");
            }
        }

        function saveData() {
            sliderData = {
                "pause":    function() { slider.classList.add('ms-PAUSE'); },
                "unPause":  function() { slider.classList.remove('ms-PAUSE'); },
                "continuous": function() { slider.classList.remove('ms-PAUSE'); continuousLeft(); },
                "next":     function() { overRidePause(singleLeft); },
                "nextAll":  function() { overRidePause(allLeft); },
                "prev":     function() { overRidePause(singleRight); },
                "prevAll":  function() { overRidePause(allRight); },
                "settings": settings
            };
        }

        function overRidePause(animation) {
            if (slider.classList.contains('ms-PAUSE')) {
                slider.classList.remove('ms-PAUSE');
                animation();
                slider.classList.add('ms-PAUSE');
            } else {
                animation();
            }
            resetInterval();
        }

        function minifyContent() {
            Array.from(msContent.childNodes).forEach(function(node) {
                if (node.nodeType === 3 && !/\S/.test(node.nodeValue)) {
                    msContent.removeChild(node);
                }
            });
        }

        function createSettings() {
            defaults = settings || {
                continuous: false,
                slideAll: false,
                interval: 2000,
                duration: 500,
                hoverPause: true,
                pauseAbove: null,
                pauseBelow: null
            };

            settings = Object.assign({}, defaults, data);

            findItemWidth();
            animateDuration = settings.duration;

            if (settings.hoverPause) { pauseHover(); }
            if (settings.continuous !== true && settings.interval !== 0 && settings.interval !== false && settings.autoSlide !== false) { autoSlide(); }
            if (settings.pauseAbove !== null && typeof settings.pauseAbove === 'number') { pauseAbove(); }
            if (settings.pauseBelow !== null && typeof settings.pauseBelow === 'number') { pauseBelow(); }
        }

        function selectAnimations() {
            if (settings.continuous) {
                settings.autoSlide = false;
                continuousLeft();
            } else if (settings.slideAll) {
                animateSlideRight = sliderData['prevAll'];
                animateSlideLeft = sliderData['nextAll'];
            } else {
                animateSlideRight = sliderData['prev'];
                animateSlideLeft = sliderData['next'];
            }
        }

        function findItemWidth() {
            reTargetSlides();
            var firstItem = msContent.querySelector('.item:first-child');
            if (!firstItem) return;
            animateDistance = firstItem.offsetWidth;
            var style = getComputedStyle(firstItem);
            var left = parseInt(style.paddingLeft) || 0;
            var right = parseInt(style.paddingRight) || 0;
            if (left !== 0) { animateDistance += left; }
            if (right !== 0) { animateDistance += right; }
        }

        function autoSlide() {
            autoSlideInterval = setInterval(function() {
                if (!slider.classList.contains('ms-PAUSE')) {
                    animateSlideLeft();
                }
            }, settings.interval);
        }

        function resetInterval() {
            if (settings.interval !== 0 && settings.interval !== false && settings.continuous !== true) {
                clearInterval(autoSlideInterval);
                autoSlide();
            }
        }

        function reTargetSlides() {
            imgFirst = msContent.querySelector('.item:first-child');
            imgLast = msContent.querySelector('.item:last-child');
        }

        function isItAnimating(cb) {
            if (!slider.classList.contains('ms-animating') &&
                !slider.classList.contains('ms-HOVER') &&
                !slider.classList.contains('ms-PAUSE')) {
                slider.dispatchEvent(new CustomEvent('ms.before.animate'));
                slider.classList.add('ms-animating');
                cb();
            }
        }

        function doneAnimating() {
            if (slider.classList.contains('ms-animating')) {
                slider.classList.remove('ms-animating');
                slider.dispatchEvent(new CustomEvent('ms.after.animate'));
            }
        }

        function freezeAnimation(el) {
            if (currentAnimation) {
                var frozenMargin = parseFloat(getComputedStyle(el).marginLeft) || 0;
                currentAnimation.cancel();
                el.style.marginLeft = frozenMargin + 'px';
                currentAnimation = null;
            }
        }

        function pauseHover() {
            if (settings.continuous) {
                msContent.addEventListener('mouseover', function() {
                    reTargetSlides();
                    freezeAnimation(imgFirst);
                    doneAnimating();
                });
                msContent.addEventListener('mouseout', function() {
                    continuousLeft();
                });
            } else {
                msContent.addEventListener('mouseover', function() {
                    slider.classList.add('ms-HOVER');
                });
                msContent.addEventListener('mouseout', function() {
                    slider.classList.remove('ms-HOVER');
                });
            }
        }

        function midAnimateResume() {
            animateDuration = settings.duration;
            var currentMargin = parseFloat(getComputedStyle(msContent.querySelector('.item:first-child')).marginLeft) || 0;
            if (currentMargin < 0) {
                var percentageRemaining = 1 - (currentMargin / -(animateDistance - 1));
                animateDuration = Math.max(0, percentageRemaining * animateDuration);
            }
        }

        function calcNumSlidesToMove() {
            totalWidth = msContent.offsetWidth;
            numberVisibleSlides = Math.floor(totalWidth / animateDistance);
        }

        function animateEl(el, toMargin, duration, easing, complete) {
            var fromMargin = parseFloat(getComputedStyle(el).marginLeft) || 0;
            var anim = el.animate(
                [
                    { marginLeft: fromMargin + 'px' },
                    { marginLeft: toMargin + 'px' }
                ],
                { duration: duration, easing: easing, fill: 'none' }
            );
            currentAnimation = anim;
            anim.onfinish = function() {
                if (currentAnimation === anim) currentAnimation = null;
                el.style.marginLeft = toMargin + 'px';
                complete();
            };
            return anim;
        }


        // ==== ANIMATION FUNCTIONS ====

        function continuousLeft() {
            isItAnimating(function() {
                reTargetSlides();
                midAnimateResume();
                currentAnimation = animateEl(
                    imgFirst,
                    -(animateDistance + 1),
                    animateDuration,
                    'linear',
                    function() {
                        imgFirst.removeAttribute('style');
                        imgLast.after(imgFirst);
                        doneAnimating();
                        continuousLeft();
                    }
                );
            });
        }

        function allLeft() {
            isItAnimating(function() {
                reTargetSlides();
                calcNumSlidesToMove();

                var items = Array.from(msContent.querySelectorAll('.item'));
                var clones = items.slice(0, numberVisibleSlides).map(function(el) {
                    return el.cloneNode(true);
                });
                clones.forEach(function(c) { msContent.appendChild(c); });

                currentAnimation = animateEl(imgFirst, -totalWidth, animateDuration, 'ease-in-out', function() {
                    Array.from(msContent.querySelectorAll('.item')).slice(0, numberVisibleSlides).forEach(function(el) { el.remove(); });
                    doneAnimating();
                });
            });
        }

        function allRight() {
            isItAnimating(function() {
                reTargetSlides();
                calcNumSlidesToMove();

                var items = Array.from(msContent.querySelectorAll('.item'));
                var numberTotalSlides = items.length;
                var clones = items.slice(numberTotalSlides - numberVisibleSlides).map(function(el) {
                    return el.cloneNode(true);
                });

                clones[0].style.marginLeft = -totalWidth + 'px';
                clones.reverse().forEach(function(c) { msContent.prepend(c); });

                reTargetSlides();

                currentAnimation = animateEl(imgFirst, 0, animateDuration, 'ease-in-out', function() {
                    var allItems = Array.from(msContent.querySelectorAll('.item'));
                    numberTotalSlides = allItems.length;
                    allItems.slice(numberTotalSlides - numberVisibleSlides).forEach(function(el) { el.remove(); });
                    imgFirst.removeAttribute('style');
                    doneAnimating();
                });
            });
        }

        function singleLeft() {
            isItAnimating(function() {
                reTargetSlides();
                currentAnimation = animateEl(imgFirst, -animateDistance, animateDuration, 'ease-in-out', function() {
                    imgFirst.removeAttribute('style');
                    msContent.appendChild(imgFirst);
                    doneAnimating();
                });
            });
        }

        function singleRight() {
            isItAnimating(function() {
                reTargetSlides();
                imgLast.style.marginLeft = -animateDistance + 'px';
                msContent.prepend(imgLast);
                reTargetSlides();
                currentAnimation = animateEl(imgFirst, 0, animateDuration, 'ease-in-out', function() {
                    imgFirst.removeAttribute('style');
                    doneAnimating();
                });
            });
        }

        return slider;
    }

    window.multislider = multislider;

})();
