{
    const lerp = (a, b, n) => (1 - n) * a + n * b;
    const body = document.body;
    const getMousePos = (e) => {
        if (!e) e = window.event;
        if (e.pageX || e.pageY) return { x: e.pageX, y: e.pageY };
        return {
            x: e.clientX + body.scrollLeft + document.documentElement.scrollLeft,
            y: e.clientY + body.scrollTop + document.documentElement.scrollTop
        };
    };

    let winsize;
    const calcWinsize = () => winsize = { width: window.innerWidth, height: window.innerHeight };
    calcWinsize();
    window.addEventListener('resize', calcWinsize);

    class CursorFx {
        constructor(el) {
            this.DOM = { el };
            this.DOM.dot = el.querySelector('.cursor__inner--dot');
            this.DOM.circle = el.querySelector('.cursor__inner--circle');
            this.bounds = {
                dot: this.DOM.dot.getBoundingClientRect(),
                circle: this.DOM.circle.getBoundingClientRect()
            };
            this.scale = 1;
            this.opacity = 1;
            this.mousePos = { x: 0, y: 0 };
            this.lastMousePos = { dot: { x: 0, y: 0 }, circle: { x: 0, y: 0 } };
            this.lastScale = 1;
            this.lastOpacity = 1;
            this._rafRunning = false;

            this.initEvents();
        }

        _startRaf() {
            if (!this._rafRunning) {
                this._rafRunning = true;
                requestAnimationFrame(() => this.render());
            }
        }

        initEvents() {
            window.addEventListener('mousemove', ev => {
                this.mousePos = getMousePos(ev);
                this._startRaf();
            });
        }

        render() {
            const prevCx = this.lastMousePos.circle.x;
            const prevCy = this.lastMousePos.circle.y;
            const prevScale = this.lastScale;
            const prevOpacity = this.lastOpacity;

            this.lastMousePos.dot.x = lerp(this.lastMousePos.dot.x, this.mousePos.x - this.bounds.dot.width / 2, 1);
            this.lastMousePos.dot.y = lerp(this.lastMousePos.dot.y, this.mousePos.y - this.bounds.dot.height / 2, 1);
            this.lastMousePos.circle.x = lerp(prevCx, this.mousePos.x - this.bounds.circle.width / 2, 0.15);
            this.lastMousePos.circle.y = lerp(prevCy, this.mousePos.y - this.bounds.circle.height / 2, 0.15);
            this.lastScale = lerp(this.lastScale, this.scale, 0.15);
            this.lastOpacity = lerp(this.lastOpacity, this.opacity, 0.1);

            this.DOM.dot.style.transform = `translateX(${this.lastMousePos.dot.x}px) translateY(${this.lastMousePos.dot.y}px)`;
            this.DOM.circle.style.transform = `translateX(${this.lastMousePos.circle.x}px) translateY(${this.lastMousePos.circle.y}px) scale(${this.lastScale})`;
            this.DOM.circle.style.opacity = this.lastOpacity;

            const stillMoving =
                Math.abs(this.lastMousePos.circle.x - prevCx) > 0.05 ||
                Math.abs(this.lastMousePos.circle.y - prevCy) > 0.05 ||
                Math.abs(this.lastScale - prevScale) > 0.001 ||
                Math.abs(this.lastOpacity - prevOpacity) > 0.001;

            if (stillMoving) {
                requestAnimationFrame(() => this.render());
            } else {
                this._rafRunning = false;
            }
        }

        enter() {
            cursor.scale = 2.7;
            cursor._startRaf();
        }
        leave() {
            cursor.scale = 1;
            cursor._startRaf();
        }
        click() {
            this.lastScale = 1;
            this.lastOpacity = 0;
            this._startRaf();
        }
    }

    const cursor = new CursorFx(document.querySelector('.cursor'));

    [...document.querySelectorAll('[data-hover]')].forEach((link) => {
        link.addEventListener('mouseenter', () => cursor.enter());
        link.addEventListener('mouseleave', () => cursor.leave());
        link.addEventListener('click', () => cursor.click());
    });
}
