/**
 * Task 2
 * https://github.com/Astarta0/tinkoffTasks/tree/master/task2
 *
 * Демо на codepen:
 *   https://codepen.io/astarta0/pen/RyBjXP?editors=0010
 *
 * Задача:
 *   На некоторых сайтах в комментариях программного кода страницы бывает тестовое
 *   задание или реклама, но можно пойти глубже. Попробуйте реализовать в консоли
 *   браузера рекламный баннер картинкой или гифкой, трансляцию мемов,
 *   динамический ascii-art или что захотите.
 *
 * Комментарии к решению:
 *   1) В качестве примера с интересным для меня техническим решением я решила взять
 *      статью с медиума где эксперементировали со SMIL SVG анимацией
 *      https://hackernoon.com/i-made-a-discovery-svg-and-svg-animations-in-the-js-console-are-doable-6c367c95726a
 *   2) Тестировалось в последнем стабильном хроме. В firefox'е скорей всего не заработает.
 *   3) Для простоты решения в консоль выводится gif файл скачанный по ссылке, но можно выводить
 *      и любую другую произвольную графику.
 *
 */
(async function() {

    class Canvas {

        constructor({ size, offset, cellSize }) {

            // вспомогательный массив равный количеству точек,
            // будем использовать для перебора
            this.range = _.range(0, size);

            // сохраняем опции
            this.size = size;
            this.offset = offset;
            this.cellSize = cellSize;
        }

        /**
         * Итератор, `.map()`, от 0 до `size`
         * @param {function} fn
         * @param {string} join
         * @returns {array|string}
         */
        map(fn, join) {
            const result = this.range.map(fn);
            if (join) {
                return result.join(join);
            }
            return result;
        }

        iterateByPoints(fn) {
            return _.flatten(this.map(y => this.map(x => fn({ x, y }))));
        }

        toString(fn, { lineSeparator = '\n', cellSeparator = '' } = {}) {
            return this.map(
                y => this.map(
                    x => fn({ x, y }),
                    cellSeparator
                ),
                lineSeparator
            );
        }

        static getPointTag(x, y) {
            return x + ':' + y;
        }

    }

    class GifAnimation {

        constructor({ canvas, gif, delay = 50 }) {
            // вспомогательный массив равный количеству кадров
            const frames = gif.shape[0];
            this.framesRange = _.range(0, frames);
            this.gif = gif;
            this.canvas = canvas;
            this.duration = (delay * frames) / 1000;
        }

        /**
         * @param {function} callback
         * @returns {array}
         */
        iterateByFrames(callback) {
            return this.framesRange.map(frameNumber => {
                const frame = this.gif.pick(frameNumber, null, null, null);
                return callback(frame, frameNumber);
            });
        }

        renderAsSVG() {
            const { size, offset, cellSize } = this.canvas;
            const pointValues = this.getPointValues();
            const baseKeyTimes = this.getKeyTimes();
            const width = offset.x + size * cellSize + 1;
            const height = offset.y + size * cellSize + 1;
            return `
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}">
                <rect x="${offset.x}" y="${offset.y}" width="${size * cellSize}" height="${size * cellSize}" stroke="black"></rect>
                    ${_.map(pointValues, point => {
                        const { x, y } = point;
                        const { values, keyTimes } = sharp(point.values, baseKeyTimes);
                        return `
                            <rect id="x${x}y${y}" x="${x * cellSize + offset.x}" y="${y * cellSize + offset.y}" width="${cellSize}" height="${cellSize}">
                                <animate 
                                    attributeName="fill"
                                    dur="${this.duration}s"
                                    values="${values.join(';')}"
                                    keyTimes="${keyTimes.join(';')}"
                                    repeatCount="indefinite"
                                />
                            </rect>
                        `;
                    }).join('')}
                </svg>
            `;
        }

        getPointValues() {

            const [
                framesCount,
                width,
                height,
                channels
            ] = this.gif.shape;

            const frames = this.iterateByFrames(frame => {

                const cells = this.canvas.iterateByPoints(({ x, y }) => {

                    const bgCell = this.createCell(x, y, '#ffffff');

                    if (x > width || y > height) {
                        return bgCell;
                    }

                    let r = frame.get(x, y, 0);
                    let g = frame.get(x, y, 1);
                    let b = frame.get(x, y, 2);
                    let a = frame.get(x, y, 3);

                    if (_.isNaN(r + g + b)) {
                        return bgCell;
                    }

                    const color = rgbaToHex(r, g, b, a);
                    return this.createCell(x, y, color);
                });
                return _.fromPairs(cells);
            });
            return _.mergeWith(...frames, mergeArraysCustomizer);
        }

        getKeyTimes() {
            const times = this.iterateByFrames((frame, frameNumber) => {
                if (frameNumber === 0) return 0;
                return +(1 / this.gif.shape[0] * (frameNumber + 1)).toFixed(2);
            });
            return times;
        }

        /**
         *
         * Cell looks like
         *   ['0:0', { x: 0, y: 0, color: '#ff00aa' }]
         *
         * @param {number} x
         * @param {number} y
         * @param {string} color
         * @returns {[string, object]}
         */
        createCell(x, y, color) {
            const tag = Canvas.getPointTag(x, y);
            return [
                tag,
                {
                    x,
                    y,
                    // в виде массива, чтобы в дальнейшем смержить значения из каждого фрейма
                    // в единый массив
                    values: [color]
                }
            ];
        }
    }

    const canvas = new Canvas({
        size: 50, // abstract size in cells
        cellSize: 1, // one cell equal N pixels
        offset: { x: 1, y: 1 }
    });

    const gifAnimation = new GifAnimation({
        canvas,
        // Note: it doesn't support gif with coalesce
        gif: await parseGif('https://cdn.rawgit.com/Astarta0/tinkoffTasks/95cd32b9/task2/QqPoLL6.gif')
    });

    render();

    function render() {
        const svgcode = gifAnimation.renderAsSVG();
        // renderToPage(svgcode);
        renderToConsole(svgcode);
    }

    function renderToPage(code) {
        document.querySelector('.svg').innerHTML = code;
    }

    function renderToConsole(code) {
        const inline = code.split('\n').join(' ');
        const css = 'background: url(\'data:image/svg+xml;utf8,' + inline + '\') left top no-repeat; font-size: 260px; color: transparent;';
        console.clear();
        console.log('%cТуц, туц, туц...', 'font-style: italic');
        console.log('%c()', css);
    }

}());
