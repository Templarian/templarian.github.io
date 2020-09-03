var mdiGrid = (function () {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    var init = Symbol('init');
    var template = Symbol('template');
    var style = Symbol('style');
    var parent = Symbol('parent');
    function extendTemplate(base, append) {
        if (append && append.match(/<parent\/>/)) {
            return append.replace(/<parent\/>/, base);
        }
        else {
            return "" + base + (append || '');
        }
    }
    function camelToDash(str) {
        return str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();
    }
    function dashToCamel(str) {
        return str.replace(/-([a-z])/g, function (m) { return m[1].toUpperCase(); });
    }
    function Component(config) {
        return function (cls) {
            if (cls.prototype[parent]) {
                cls.prototype[parent].push(cls.prototype);
                cls.prototype[style] = "" + cls.prototype[style] + config.style;
                cls.prototype[template] = extendTemplate(cls.prototype[template], config.template || null);
            }
            else {
                cls.prototype[parent] = [cls.prototype];
                cls.prototype[style] = config.style || '';
                cls.prototype[template] = config.template || '';
            }
            if (!cls.symbols) {
                cls.symbols = {};
            }
            var connectedCallback = cls.prototype.connectedCallback || (function () { });
            var disconnectedCallback = cls.prototype.disconnectedCallback || (function () { });
            cls.prototype.connectedCallback = function () {
                var _this = this;
                if (!this[init] && config.template) {
                    var $template = document.createElement('template');
                    $template.innerHTML = cls.prototype[template] + "<style>" + cls.prototype[style] + "</style>";
                    var $node = document.importNode($template.content, true);
                    if (config.useShadow === false) {
                        this.appendChild($node);
                    }
                    else {
                        this.attachShadow({ mode: 'open' }).appendChild($node);
                    }
                }
                else if (this[init] && config.style) ;
                else if (this[init] && !config.template) {
                    throw new Error('You need to pass a template for the element');
                }
                if (this.componentWillMount) {
                    this.componentWillMount();
                }
                this[parent].map(function (p) {
                    if (p.render) {
                        p.render.call(_this, cls.observedAttributes
                            ? cls.observedAttributes.reduce(function (a, c) {
                                var n = dashToCamel(c);
                                a[n] = true;
                                return a;
                            }, {})
                            : {});
                    }
                });
                this[init] = true;
                connectedCallback.call(this);
                if (this.componentDidMount) {
                    this.componentDidMount();
                }
            };
            cls.prototype.disconnectedCallback = function () {
                if (this.componentWillUnmount) {
                    this.componentWillUnmount();
                }
                disconnectedCallback.call(this);
                if (this.componentDidUnmount) {
                    this.componentDidUnmount();
                }
            };
            cls.prototype.attributeChangedCallback = function (name, oldValue, newValue) {
                var normalizedName = dashToCamel(name);
                this[normalizedName] = newValue;
            };
            if (!window.customElements.get(config.selector)) {
                window.customElements.define(config.selector, cls);
            }
        };
    }
    function Prop() {
        return function (target, propertyKey, descriptor) {
            var constructor = target.constructor;
            if (!constructor.observedAttributes) {
                constructor.observedAttributes = [];
            }
            var observedAttributes = constructor.observedAttributes;
            if (!constructor.symbols) {
                constructor.symbols = {};
            }
            var symbols = constructor.symbols;
            var normalizedPropertyKey = camelToDash(propertyKey);
            constructor.observedAttributes = observedAttributes.concat([normalizedPropertyKey]);
            var symbol = Symbol(propertyKey);
            symbols[propertyKey] = symbol;
            Object.defineProperty(target, propertyKey, {
                get: function () {
                    return this[symbol];
                },
                set: function (value) {
                    var _this = this;
                    this[symbol] = value;
                    if (this[init]) {
                        this[parent].map(function (p) {
                            var _a;
                            if (p.render) {
                                p.render.call(_this, (_a = {}, _a[propertyKey] = true, _a));
                            }
                        });
                    }
                }
            });
        };
    }
    function Part() {
        return function (target, propertyKey, descriptor) {
            Object.defineProperty(target, propertyKey, {
                get: function () {
                    var _a;
                    var key = propertyKey.replace(/^\$/, '');
                    return (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("[part~=" + key + "]");
                }
            });
        };
    }

    const debounce = (func, waitFor) => {
        let timeout;
        return (...args) => new Promise(resolve => {
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(() => resolve(func(...args)), waitFor);
        });
    };

    var template$1 = "<mdi-scroll part=\"scroll\">\n  <div part=\"grid\"></div>\n</mdi-scroll>";

    var style$1 = "* {\n  font-family: var(--mdi-font-family);\n}\n\n:host {\n  display: block;\n}\n\n[part~=grid] {\n  position: relative;\n}\n\n[part~=grid] > button {\n  border: 0;\n  background: transparent;\n  padding: 0.625rem;\n  outline: none;\n  width: 2.75rem;\n  height: 2.75rem;\n  position: absolute;\n  left: 0;\n  top: 0;\n  border: 0;\n  border-radius: 0.25rem;\n}\n\n[part~=grid] > button.hover {\n  background: rgba(0, 0, 0, 0.1);\n}\n\n[part~=grid] > button:focus,\n[part~=grid] > button:active {\n  background: rgba(0, 0, 0, 0.15);\n  box-shadow: 0 0.0125rem 0.25rem rgba(0, 0, 0, 0.2) inset;\n}\n\n[part~=grid] > button > svg {\n  fill: #453C4F;\n  width: 1.5rem;\n  height: 1.5rem;\n}\n\n[part~=grid] > button > svg {\n  fill: #453C4F;\n}\n\n[part~=grid]::-webkit-scrollbar {\n  width: 1em;\n}\n\n[part~=grid]::-webkit-scrollbar-track {\n  box-shadow: inset 0 0 6px rgba(0,0,0,0.2);\n  border-radius: 0.25rem;\n}\n\n[part~=grid]::-webkit-scrollbar-thumb {\n  background-color: #453C4F;\n  outline: 1px solid slategrey;\n  border-radius: 0.25rem;\n}";

    let MdiGrid = class MdiGrid extends HTMLElement {
        constructor() {
            super(...arguments);
            this.icons = [];
            this.size = 24;
            this.padding = 8;
            this.gap = 4;
            this.width = 'auto';
            this.height = 'auto';
            this.currentCount = 0;
            this.currentSize = 0;
            this.currentPadding = 0;
            this.currentGap = 0;
            this.rowHeight = 0;
            this.items = [];
            this.svg = 'http://www.w3.org/2000/svg';
            this.debounceRender = debounce(() => this.render({}), 300);
            this.color = 'svg';
            this.resizeObserver = new ResizeObserver(() => {
                this.debounceRender();
            });
            this.index = 0;
            this.hoverLast = 0;
            this.currentRow = 0;
            this.timeouts = [];
            this.cacheHeight = 0;
            this.cacheViewWidth = 0;
            this.canOpenTooltip = true;
            this.preventClose = false;
            this.currentIndex = 0;
        }
        connectedCallback() {
            this.resizeObserver.observe(this.$grid);
            this.addEventListener('mousemove', this.handleTooltip.bind(this));
            this.addEventListener('mouseleave', (e) => {
                this.index = -2;
                this.handleTooltip(e);
            });
            this.$scroll.addEventListener('calculate', (e) => {
                const { offsetY, height, viewWidth, viewHeight } = e.detail;
                this.calculate(offsetY, height, viewWidth, viewHeight);
            });
        }
        /**
         * Simplify all the mouse to usable data.
         *
         * @param e MouseEvent
         */
        getMetaFromMouse(e) {
            const { width, height, gap, extra } = this.getIconMetrics();
            var rect = e.target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const column = this.getColumnFromX(x, width, gap, extra);
            const row = this.getRowFromY(y, height, gap, extra);
            const index = column !== -1 && row !== -1 ? column + (row * this.columns) : -1;
            // First Column + [Other Columns + Extra Space] x column
            const gridX = (width + gap) + ((column - 1) * width) + (column * (gap + extra));
            const gridY = (row * height) + ((row + 1) * gap);
            return {
                gridX,
                gridY,
                x: gridX + rect.left,
                y: gridY + rect.top,
                width,
                height,
                column,
                row,
                gap,
                extra,
                index,
                icon: this.icons[index]
            };
        }
        getColumnFromX(x, width, gap, extra) {
            x = Math.round(x);
            if (x < gap) {
                return -1;
            }
            if (x <= width + gap) {
                return 0;
            }
            const column = Math.floor((x - width - gap) / (width + gap + extra)) + 1;
            const space = x - (column * (width + gap + extra));
            if (space < (gap + extra)) {
                return -1;
            }
            return column;
        }
        getRowFromY(y, height, gap, extra) {
            if (y < gap) {
                return -1;
            }
            if (y <= height + gap) {
                return 0;
            }
            const row = Math.floor((y - height - gap) / (height + gap)) + 1;
            const space = y - (row * (height + gap));
            if (space < gap) {
                return -1;
            }
            return row;
        }
        /**
         * Handle Tooltip
         *
         * this.index
         * -1 = closed
         * -2 = force close
         */
        handleTooltip(e) {
            const mouseMeta = this.getMetaFromMouse(e);
            const { column, index } = mouseMeta;
            if (this.hoverLast >= 0) {
                this.items[this.hoverLast][0].classList.toggle('hover', false);
            }
            var gridIndex = index - (this.currentRow * this.columns);
            if (gridIndex >= 0) {
                this.items[gridIndex][0].classList.toggle('hover', true);
                this.hoverLast = gridIndex;
            }
            if (this.index !== index) {
                if (index === -1 || this.index === -2) {
                    mouseMeta.index = this.index;
                    this.hideTooltip(this.icons[this.index], mouseMeta);
                    this.index = -1;
                }
                else {
                    if (this.icons[index]) {
                        if (column > this.columns - 1) {
                            mouseMeta.index = this.index;
                            this.hideTooltip(this.icons[this.index], mouseMeta);
                            this.index = -1;
                        }
                        else {
                            this.showTooltip(this.icons[index], mouseMeta);
                            this.index = index;
                        }
                    }
                }
            }
        }
        updateHover() {
            this.items[this.index][0].classList.toggle('hover', false);
        }
        syncVirtual(count) {
            for (let i = this.currentCount; i < count; i++) {
                this.currentCount = i + 1;
                const btn = document.createElement('button');
                btn.dataset.index = `${i}`;
                btn.addEventListener('click', () => {
                    const index = i + (this.columns * this.currentRow);
                    this.handleClick(this.icons[index]);
                });
                btn.addEventListener('keydown', (e) => {
                    const index = i + (this.columns * this.currentRow);
                    this.moveFocus(e, index);
                });
                btn.addEventListener('contextmenu', (e) => {
                    var rect = this.$grid.getBoundingClientRect();
                    const x = Math.floor(e.clientX - rect.left);
                    const y = Math.floor(e.clientY - rect.top);
                    this.showContextMenu(i, x, y);
                    e.preventDefault();
                });
                const svg = document.createElementNS(this.svg, 'svg');
                svg.setAttribute('viewBox', '0 0 24 24');
                const path = document.createElementNS(this.svg, 'path');
                svg.appendChild(path);
                btn.appendChild(svg);
                this.$grid.appendChild(btn);
                this.items.push([btn, svg, path]);
            }
            for (let i = this.currentCount; i > count; i--) {
                const ele = this.items.pop();
                this.$grid.removeChild(ele[0]);
                this.currentCount--;
            }
            const { size, padding, gap, width, height, rowHeight, scrollWidth, extra } = this.getIconMetrics();
            let x = gap;
            let y = gap;
            this.items.forEach(([btn, svg], i) => {
                btn.style.padding = `${padding}px`;
                btn.style.width = `${width}px`;
                btn.style.height = `${height}px`;
                btn.style.transform = `translate(${x}px, ${y}px)`;
                svg.style.width = `${size}px`;
                svg.style.height = `${size}px`;
                x += width + gap + extra;
                if (i % this.columns === this.columns - 1) {
                    y += height + gap;
                    x = gap;
                }
            });
        }
        calculate(offsetY, height, viewWidth, viewHeight) {
            const rowHeight = this.rowHeight;
            const count = this.icons.length;
            const rows = Math.ceil(viewHeight / rowHeight) + 1;
            const row = Math.floor(offsetY / rowHeight);
            this.$grid.style.transform = `translateY(${-1 * offsetY % rowHeight}px)`;
            if (this.cacheHeight !== height || this.cacheViewWidth !== viewWidth) {
                this.syncVirtual(rows * this.columns);
                this.cacheHeight = height;
                this.cacheViewWidth = viewWidth;
            }
            if (this.currentRow !== row) {
                this.items.forEach(([btn, svg, path], i) => {
                    const index = i + (row * this.columns);
                    if (index < count) {
                        path.setAttribute('d', this.icons[index].data);
                        btn.style.display = 'block';
                    }
                    else {
                        btn.style.display = 'none';
                    }
                });
                this.currentRow = row;
            }
        }
        getIconMetrics() {
            const size = parseInt(this.size, 10);
            const padding = parseInt(this.padding, 10);
            const gap = parseInt(this.gap, 10);
            const { width: scrollWidth } = this.$scroll.getBoundingClientRect();
            const sizePadding = size + (padding * 2);
            const rowHeight = sizePadding + gap;
            const extra = (scrollWidth - gap - (rowHeight * this.columns)) / (this.columns - 1);
            return {
                size,
                padding,
                gap,
                width: sizePadding,
                height: sizePadding,
                rowHeight,
                extra,
                scrollWidth
            };
        }
        calculateColumns(width, rowHeight) {
            let w = width - this.currentGap;
            return Math.floor(w / rowHeight);
        }
        render(changes) {
            // Calculate Icon Size
            const { size, padding, gap, rowHeight, scrollWidth } = this.getIconMetrics();
            if (this.currentSize !== size || this.currentPadding !== padding || this.currentGap !== gap) {
                this.currentSize = size;
                this.currentPadding = padding;
                this.currentGap = gap;
                this.rowHeight = rowHeight;
            }
            // Calculate Columns
            const columns = this.calculateColumns(scrollWidth, rowHeight);
            if (this.columns !== columns) {
                this.columns = columns;
            }
            // Virtual Grid
            const count = this.icons.length;
            const rows = Math.ceil(count / this.columns);
            this.currentRow = -1;
            this.$scroll.height = gap + (rows * rowHeight);
        }
        moveFocus(e, index) {
            console.log(e.which, index);
            let newIndex;
            switch (e.which) {
                case 37:
                    newIndex = index - 1;
                    if (newIndex >= 0) {
                        this.items[newIndex][0].focus();
                        e.preventDefault();
                    }
                    break;
                case 38:
                    newIndex = index - this.columns;
                    if (newIndex >= 0) {
                        this.items[newIndex][0].focus();
                        e.preventDefault();
                    }
                    break;
                case 39:
                    newIndex = index + 1;
                    if (newIndex < this.icons.length) {
                        this.items[newIndex][0].focus();
                        e.preventDefault();
                    }
                    break;
                case 40:
                    newIndex = index + this.columns;
                    if (newIndex < this.icons.length) {
                        this.items[newIndex][0].focus();
                        e.preventDefault();
                    }
                    else if (newIndex !== this.icons.length - 1) {
                        this.items[this.icons.length - 1][0].focus();
                        e.preventDefault();
                    }
                    break;
            }
        }
        handleClick(icon) {
            this.dispatchEvent(new CustomEvent('select', {
                detail: icon
            }));
        }
        showContextMenu(index, x, y) {
            this.dispatchEvent(new CustomEvent('openmenu'));
        }
        hideContextMenu() {
            this.dispatchEvent(new CustomEvent('closemenu'));
            this.canOpenTooltip = true;
        }
        showTooltip(icon, mouseMeta) {
            if (!this.canOpenTooltip) {
                return;
            }
            this.dispatchEvent(new CustomEvent('entericon', {
                detail: mouseMeta
            }));
        }
        hideTooltip(icon, mouseMeta) {
            this.dispatchEvent(new CustomEvent('leaveicon', {
                detail: mouseMeta
            }));
        }
        getPositionFromIndex(index) {
            return {
                x: index % this.columns,
                y: Math.floor(index / this.columns)
            };
        }
    };
    __decorate([
        Prop()
    ], MdiGrid.prototype, "icons", void 0);
    __decorate([
        Prop()
    ], MdiGrid.prototype, "size", void 0);
    __decorate([
        Prop()
    ], MdiGrid.prototype, "padding", void 0);
    __decorate([
        Prop()
    ], MdiGrid.prototype, "gap", void 0);
    __decorate([
        Prop()
    ], MdiGrid.prototype, "width", void 0);
    __decorate([
        Prop()
    ], MdiGrid.prototype, "height", void 0);
    __decorate([
        Part()
    ], MdiGrid.prototype, "$scroll", void 0);
    __decorate([
        Part()
    ], MdiGrid.prototype, "$grid", void 0);
    MdiGrid = __decorate([
        Component({
            selector: 'mdi-grid',
            style: style$1,
            template: template$1
        })
    ], MdiGrid);
    var MdiGrid$1 = MdiGrid;

    return MdiGrid$1;

}());
//# sourceMappingURL=mdiGrid.js.map
