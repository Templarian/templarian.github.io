var mdiInputSelect = (function () {
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
                            ? cls.observedAttributes.reduce(function (a, c) { a[c] = true; return a; }, {})
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
            constructor.observedAttributes = observedAttributes.concat([propertyKey]);
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

    var template$1 = "<div part=\"wrapper\">\n  <select part=\"select\"></select>\n  <svg part=\"chevron\" viewBox=\"0 0 24 24\"><path d=\"M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z\" /></svg>\n</div>";

    var style$1 = ":host {\n  display: block;\n  font-family: var(--mdi-font-family);\n}\n\n[part=\"wrapper\"] {\n  display: grid;\n  grid-template-rows: auto;\n  grid-template-columns: 100% 0;\n}\n\n[part=\"select\"] {\n  grid-row: 1;\n  grid-column: 1;\n  border: 1px solid var(--mdi-input-select-border-color, #453C4F);\n  border-radius: 0.25rem;\n  padding: 0.5rem 0.75rem;\n  width: 100%;\n  font-size: 1rem;\n  outline: 0;\n  -webkit-appearance: none;\n}\n\n[part=\"select\"]:focus {\n  box-shadow: 0 0 0 3px rgba(79, 143, 249, 0.5);\n}\n\n[part=\"chevron\"] {\n  grid-row: 1;\n  grid-column: 2;\n  pointer-events: none;\n  width: 1.5rem;\n  height: 1.5rem;\n  align-self: center;\n  transform: translate(-2rem, 0);\n}";

    let MdiInputSelect = class MdiInputSelect extends HTMLElement {
        constructor() {
            super(...arguments);
            this.options = [];
        }
        render(changes) {
            if (changes.options) {
                this.options.forEach(o => {
                    const option = document.createElement('option');
                    option.innerText = o.label;
                    option.value = o.value;
                    this.$select.appendChild(option);
                });
                if (this.$select.value !== this.value) {
                    this.$select.value = this.value;
                }
            }
            if (changes.value) {
                if (this.$select.value !== this.value) {
                    this.$select.value = this.value;
                }
            }
        }
    };
    __decorate([
        Prop()
    ], MdiInputSelect.prototype, "options", void 0);
    __decorate([
        Prop()
    ], MdiInputSelect.prototype, "value", void 0);
    __decorate([
        Part()
    ], MdiInputSelect.prototype, "$select", void 0);
    MdiInputSelect = __decorate([
        Component({
            selector: 'mdi-input-select',
            style: style$1,
            template: template$1
        })
    ], MdiInputSelect);
    var MdiInputSelect$1 = MdiInputSelect;

    return MdiInputSelect$1;

}());
//# sourceMappingURL=mdiInputSelect.js.map
