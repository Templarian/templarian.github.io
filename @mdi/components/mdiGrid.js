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
                else if (this[init] && config.template) {
                    throw new Error('template from base class cannot be overriden. Fix: remove template from @Component');
                }
                else if (config.template) {
                    throw new Error('You need to pass a template for the element');
                }
                if (this.componentWillMount) {
                    this.componentWillMount();
                }
                this[parent].map(function (p) {
                    if (p.render) {
                        p.render.call(_this);
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
                this[name] = newValue;
                // if (this.attributeChangedCallback) {
                // this.attributeChangedCallback(name, oldValue, newValue);
                // }
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
            observedAttributes.push(propertyKey);
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
                            if (p.render) {
                                p.render.call(_this);
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

    var template$1 = "<div part=\"grid\"></div>";

    var style$1 = "[part~=grid] {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, 1.5rem);\n  grid-template-rows: repeat(1, 1.5rem);\n  min-height: 1.5rem;\n  overflow: hidden;\n}\n\nbutton {\n  border: 0;\n  background: transparent;\n  padding: 0;\n}";

    let MdiSearch = class MdiSearch extends HTMLElement {
        constructor() {
            super(...arguments);
            this.icons = [];
            this.size = 24;
            this.currentCount = 0;
            this.items = [];
            this.svg = 'http://www.w3.org/2000/svg';
            this.debounceRender = debounce(() => this.render(), 300);
            this.resizeObserver = new ResizeObserver(entries => {
                const { width } = entries[0].contentRect;
                const columns = Math.floor(width / this.size);
                if (this.columns !== columns) {
                    this.columns = columns;
                    this.debounceRender();
                }
            });
        }
        connectedCallback() {
            this.resizeObserver.observe(this.$grid);
        }
        render() {
            console.log('render');
            const count = this.icons.length;
            // Render more grid items
            for (let i = this.currentCount; i < count; i++) {
                this.currentCount = i + 1;
                const btn = document.createElement('button');
                btn.addEventListener('click', () => {
                    console.log(this.icons[i]);
                });
                const svg = document.createElementNS(this.svg, 'svg');
                svg.setAttribute('viewBox', '0 0 24 24');
                const path = document.createElementNS(this.svg, 'path');
                svg.appendChild(path);
                btn.appendChild(svg);
                this.$grid.appendChild(btn);
                this.items.push([btn, path]);
            }
            const rows = Math.ceil(count / this.columns);
            this.$grid.style.gridTemplateRows = `repeat(${rows}, 1.5rem)`;
            this.items.forEach(([btn, path], i) => {
                if (this.icons[i]) {
                    btn.style.gridColumn = `${(i % this.columns + 1)}`;
                    btn.style.gridRow = `${Math.ceil((i + 1) / this.columns)}`;
                    path.setAttribute('d', this.icons[i].data);
                    this.icons[i].id = i;
                }
                else {
                    path.setAttribute('d', '');
                }
            });
            this.$grid.style.height = `${1.5 * rows}rem`;
        }
    };
    __decorate([
        Prop()
    ], MdiSearch.prototype, "icons", void 0);
    __decorate([
        Prop()
    ], MdiSearch.prototype, "size", void 0);
    __decorate([
        Part()
    ], MdiSearch.prototype, "$grid", void 0);
    MdiSearch = __decorate([
        Component({
            selector: 'mdi-grid',
            style: style$1,
            template: template$1
        })
    ], MdiSearch);
    var MdiSearch$1 = MdiSearch;

    return MdiSearch$1;

}());
//# sourceMappingURL=mdiGrid.js.map
