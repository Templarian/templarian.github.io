var mdiScroll = (function () {
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

    var template$1 = "<div part=\"scroll\">\n  <slot></slot>\n</div>";

    var style$1 = ":host {\n  display: block;\n}\n\ndiv {\n  transition: translateY(0);\n}";

    let MdiScroll = class MdiScroll extends HTMLElement {
        constructor() {
            super(...arguments);
            this.height = 16;
            this.columns = 10;
            this.size = 44;
            this.visible = false;
            this.y = -1;
            this.resizeObserver = new ResizeObserver(entries => {
                const { width } = entries[0].contentRect;
                this.columns = Math.floor(width / (this.size + 20));
            });
        }
        getView() {
            const { innerHeight } = window;
            const { y, height } = this.getBoundingClientRect();
            const top = y < 0 ? -1 * y : 0;
            const calcY = height - top - innerHeight < 0
                ? height - innerHeight < 0 ? 0 : height - innerHeight
                : top;
            const calcHeight = height < innerHeight
                ? height
                : y + height - innerHeight > 0
                    ? innerHeight
                    : y + height - innerHeight;
            return {
                visible: y < innerHeight && height + y > 0,
                y: calcY,
                height: calcHeight < 0 ? innerHeight : calcHeight,
                atEnd: calcHeight < 0
            };
        }
        calculateScroll() {
            const { visible, y, height, atEnd } = this.getView();
            if (visible) {
                this.$scroll.style.transform = `translateY(${y}px)`;
                this.$scroll.style.height = `${height}px`;
            }
            if (this.visible !== visible) {
                this.visible = visible;
                if (this.visible) {
                    this.enterView();
                }
                else {
                    this.leaveView();
                }
            }
            if (this.visible && this.y !== y) {
                this.dispatchEvent(new CustomEvent('calculate', {
                    detail: {
                        offsetY: y,
                        viewHeight: height,
                        height: this.height,
                        atEnd
                    }
                }));
                this.y = y;
            }
        }
        enterView() {
            this.dispatchEvent(new CustomEvent('enter'));
        }
        leaveView() {
            this.dispatchEvent(new CustomEvent('leave'));
        }
        connectedCallback() {
            this.addEventListener('height', (e) => {
                e.preventDefault();
                const { height } = e.detail;
                this.style.height = `${height}px`;
                this.height = parseInt(height, 10);
                this.calculateScroll();
            });
            this.style.height = `${this.height}px`;
            window.addEventListener('scroll', () => {
                this.calculateScroll();
            });
            window.addEventListener('resize', () => {
                this.y = -1;
                this.calculateScroll();
            });
            this.calculateScroll();
        }
    };
    __decorate([
        Part()
    ], MdiScroll.prototype, "$scroll", void 0);
    __decorate([
        Part()
    ], MdiScroll.prototype, "$text", void 0);
    MdiScroll = __decorate([
        Component({
            selector: 'mdi-scroll',
            style: style$1,
            template: template$1
        })
    ], MdiScroll);
    var MdiScroll$1 = MdiScroll;

    return MdiScroll$1;

}());
//# sourceMappingURL=mdiScroll.js.map
