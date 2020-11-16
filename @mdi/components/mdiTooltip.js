var mdiTooltip = (function () {
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

    var template$1 = "<div part=\"tooltip\">\n  <span part=\"tooltipText\"></span>\n  <div part=\"tooltipArrow\"></div>\n</div>";

    var style$1 = ":host {\n  pointer-events: none;\n}\n\n[part~=tooltip] {\n  position: relative;\n}\n\n[part~=tooltipText] {\n  position: absolute;\n  background: #737E9E;\n  border-radius: 0.25rem;\n  color: #FFF;\n  padding: 0.15rem 0.5rem 0.3rem 0.5rem;\n  white-space: nowrap;\n  left: 0;\n  top: 0;\n}\n\n[part~=tooltipArrow] {\n  left: 16px;\n  top: -7px;\n}\n\n[part~=tooltipArrow],\n[part~=tooltipArrow]::before {\n  position: absolute;\n  width: 10px;\n  height: 10px;\n}\n\n[part~=tooltipArrow]::before {\n  content: '';\n  transform: rotate(45deg);\n  background: #737E9E;\n}";

    const TOP = 'top';
    const TOP_START = 'top-start';
    const TOP_END = 'top-end';
    const RIGHT = 'right';
    const RIGHT_START = 'right-start';
    const RIGHT_END = 'right-end';
    const BOTTOM = 'bottom';
    const BOTTOM_START = 'bottom-start';
    const BOTTOM_END = 'bottom-end';
    const LEFT = 'left';
    const LEFT_START = 'left-start';
    const LEFT_END = 'left-end';

    const map = {
        [TOP_START]: (width, height, rect) => {
            return {
                arrowTop: height - 5,
                arrowLeft: rect.width > width
                    ? Math.floor(width / 2) - 5
                    : Math.floor(rect.width / 2) - 5,
                left: rect.left,
                top: rect.top - height - 10
            };
        },
        [TOP]: (width, height, rect) => {
            return {
                arrowTop: height - 5,
                arrowLeft: Math.floor(width / 2) - 5,
                left: rect.left - Math.floor((width - rect.width) / 2),
                top: rect.top - height - 10
            };
        },
        [TOP_END]: (width, height, rect) => {
            return {
                arrowTop: height - 5,
                arrowLeft: rect.width > width
                    ? width - Math.floor(width / 2) - 5
                    : width - Math.floor(rect.width / 2) - 5,
                left: rect.left - width + rect.width,
                top: rect.top - height - 10
            };
        },
        [RIGHT_START]: (width, height, rect) => {
            return {
                arrowTop: Math.floor(height / 2) - 5,
                arrowLeft: -5,
                left: rect.left + rect.width + 10,
                top: rect.top
            };
        },
        [RIGHT]: (width, height, rect) => {
            return {
                arrowTop: Math.floor(height / 2) - 5,
                arrowLeft: -5,
                left: rect.left + rect.width + 10,
                top: rect.top + Math.floor(rect.height / 2) - Math.floor(height / 2)
            };
        },
        [RIGHT_END]: (width, height, rect) => {
            return {
                arrowTop: Math.floor(height / 2) - 5,
                arrowLeft: -5,
                left: rect.left + rect.width + 10,
                top: rect.top + rect.height - height
            };
        },
        [BOTTOM_START]: (width, height, rect) => {
            return {
                arrowTop: -5,
                arrowLeft: rect.width > width
                    ? Math.floor(width / 2) - 5
                    : Math.floor(rect.width / 2) - 5,
                left: rect.left,
                top: rect.top + rect.height + height - 20
            };
        },
        [BOTTOM]: (width, height, rect) => {
            return {
                arrowTop: -5,
                arrowLeft: Math.floor(width / 2) - 5,
                left: rect.left - Math.floor((width - rect.width) / 2),
                top: rect.top + rect.height + height - 20
            };
        },
        [BOTTOM_END]: (width, height, rect) => {
            return {
                arrowTop: -5,
                arrowLeft: rect.width > width
                    ? width - Math.floor(width / 2) - 5
                    : width - Math.floor(rect.width / 2) - 5,
                left: rect.left - width + rect.width,
                top: rect.top + rect.height + height - 20
            };
        },
        [LEFT_START]: (width, height, rect) => {
            return {
                arrowTop: Math.floor(height / 2) - 5,
                arrowLeft: width - 5,
                left: rect.left - width - 10,
                top: rect.top
            };
        },
        [LEFT]: (width, height, rect) => {
            return {
                arrowTop: Math.floor(height / 2) - 5,
                arrowLeft: width - 5,
                left: rect.left - width - 10,
                top: rect.top + Math.floor(rect.height / 2) - Math.floor(height / 2)
            };
        },
        [LEFT_END]: (width, height, rect) => {
            return {
                arrowTop: Math.floor(height / 2) - 5,
                arrowLeft: width - 5,
                left: rect.left - width - 10,
                top: rect.top + rect.height - height
            };
        }
    };
    let MdiTooltip = class MdiTooltip extends HTMLElement {
        constructor() {
            super(...arguments);
            this.visible = false;
            this.rect = null;
            this.text = '';
            this.position = BOTTOM;
        }
        render(changes) {
            this.$tooltipText.innerText = this.text;
            this.style.position = 'absolute';
            if (changes.visible) {
                this.style.display = this.visible ? 'block' : 'none';
            }
            const { width: tooltipWidth, height: tooltipHeight } = this.$tooltipText.getBoundingClientRect();
            let position = this.position;
            if (!(position in map)) {
                position = BOTTOM;
            }
            if (this.rect) {
                const { arrowLeft, arrowTop, left, top } = map[position](tooltipWidth, tooltipHeight, this.rect);
                this.style.left = `${left + window.scrollX}px`;
                this.style.top = `${top + window.scrollY}px`;
                this.$tooltipArrow.style.left = `${arrowLeft}px`;
                this.$tooltipArrow.style.top = `${arrowTop}px`;
            }
        }
    };
    __decorate([
        Prop()
    ], MdiTooltip.prototype, "visible", void 0);
    __decorate([
        Prop()
    ], MdiTooltip.prototype, "rect", void 0);
    __decorate([
        Prop()
    ], MdiTooltip.prototype, "text", void 0);
    __decorate([
        Prop()
    ], MdiTooltip.prototype, "position", void 0);
    __decorate([
        Part()
    ], MdiTooltip.prototype, "$tooltip", void 0);
    __decorate([
        Part()
    ], MdiTooltip.prototype, "$tooltipText", void 0);
    __decorate([
        Part()
    ], MdiTooltip.prototype, "$tooltipArrow", void 0);
    MdiTooltip = __decorate([
        Component({
            selector: 'mdi-tooltip',
            style: style$1,
            template: template$1
        })
    ], MdiTooltip);
    var MdiTooltip$1 = MdiTooltip;

    return MdiTooltip$1;

}());
//# sourceMappingURL=mdiTooltip.js.map
