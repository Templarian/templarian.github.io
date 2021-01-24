var mdiButtonLink = (function () {
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
        if (config === void 0) { config = {}; }
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
                if (!this[init] && !config.template) {
                    if (config.useShadow === false) ;
                    else {
                        this.attachShadow({ mode: 'open' });
                    }
                }
                else if (!this[init] && config.template) {
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
                    throw new Error('You need to pass a template for an extended element.');
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
            if (config.selector && !window.customElements.get(config.selector)) {
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

    var template$1 = "<a part=\"button\">\n  <slot></slot>\n</a>";

    var style$1 = ":host {\n  display: flex;\n}\n\n[part=\"button\"] {\n  display: inline-flex;\n  align-items: center;\n  align-content: center;\n  font-family: var(--mdi-font-family);\n  font-size: 1rem;\n  line-height: 1.5rem;\n  text-decoration: none;\n}\n\n[part=\"button\"] {\n  border: 1px solid var(--mdi-button-border-color, #453C4F);\n  background-color: var(--mdi-button-background-color, #fff);\n  color: var(--mdi-button-color, #453C4F);\n  padding: var(--mdi-button-padding, 0.25rem 0.5rem);\n  border-radius: 0.25rem;\n  outline: none;\n  --mdi-icon-color: var(--mdi-button-color, #453C4F);\n}\n\n[part=\"button\"]:hover {\n  border: 1px solid var(--mdi-button-hover-border-color, #453C4F);\n  background-color: var(--mdi-button-hover-background-color, #453C4F);\n  color: var(--mdi-hover-button-color, #fff);\n  --mdi-icon-color: var(--mdi-button-hover-color, #fff);\n}\n\n[part=\"button\"]:active {\n  box-shadow: 0 1px 0.25rem rgba(0, 0, 0, 0.5) inset;\n  position: relative;\n}\n\n[part=\"button\"]:focus {\n  position: relative;\n}\n\n[part=\"button\"]:active::before {\n  content: '';\n  position: absolute;\n  top: -1px;\n  right: -1px;\n  bottom: -1px;\n  left: -1px;\n  border-radius: 0.25rem;\n  box-shadow: 0 0 0 3px var(--mdi-search-focus-glow, rgb(79, 143, 249, 0.6));\n}\n[part=\"button\"]:focus::before {\n  content: '';\n  position: absolute;\n  top: -1px;\n  right: -1px;\n  bottom: -1px;\n  left: -1px;\n  border-radius: 0.25rem;\n  box-shadow: 0 0 0 3px var(--mdi-search-focus-glow, rgb(79, 143, 249, 0.5));\n}\n\n[part=\"button\"].start {\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n  margin-right: -1px;\n}\n\n[part=\"button\"].center {\n  border-radius: 0;\n  margin-right: -1px;\n}\n\n[part=\"button\"].end {\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n}\n\n[part=\"button\"].active,\n[part=\"button\"].active:hover {\n  box-shadow: 0 1px 0.25rem rgba(0, 0, 0, 0.5) inset;\n  background-color: rgba(69, 60, 79, 0.1);\n  color: var(--mdi-button-color, #453C4F);\n}\n\n[part=\"button\"].block {\n  flex: 1;\n}\n\n::slotted(*) {\n  align-self: center;\n}\n";

    let MdiButtonLink = class MdiButtonLink extends HTMLElement {
        constructor() {
            super(...arguments);
            this.href = '';
            this.active = false;
            this.block = false;
            this.start = false;
            this.center = false;
            this.end = false;
        }
        connectedCallback() {
            this.$button.addEventListener('click', (e) => this.dispatchEvent(new CustomEvent('click')));
        }
        render(changes) {
            if (changes.href) {
                this.$button.href = this.href;
            }
            const t = [true, 'true', ''];
            if (changes.active) {
                this.$button.classList.toggle('active', t.includes(this.active));
            }
            if (changes.start) {
                this.$button.classList.toggle('start', t.includes(this.start));
            }
            if (changes.end) {
                this.$button.classList.toggle('end', t.includes(this.end));
            }
            if (changes.center) {
                this.$button.classList.toggle('center', t.includes(this.center));
            }
            if (changes.block) {
                this.$button.classList.toggle('block', t.includes(this.block));
            }
        }
    };
    __decorate([
        Prop()
    ], MdiButtonLink.prototype, "href", void 0);
    __decorate([
        Prop()
    ], MdiButtonLink.prototype, "active", void 0);
    __decorate([
        Prop()
    ], MdiButtonLink.prototype, "block", void 0);
    __decorate([
        Prop()
    ], MdiButtonLink.prototype, "start", void 0);
    __decorate([
        Prop()
    ], MdiButtonLink.prototype, "center", void 0);
    __decorate([
        Prop()
    ], MdiButtonLink.prototype, "end", void 0);
    __decorate([
        Part()
    ], MdiButtonLink.prototype, "$button", void 0);
    MdiButtonLink = __decorate([
        Component({
            selector: 'mdi-button-link',
            style: style$1,
            template: template$1
        })
    ], MdiButtonLink);
    var MdiButtonLink$1 = MdiButtonLink;

    return MdiButtonLink$1;

}());
//# sourceMappingURL=mdiButtonLink.js.map
