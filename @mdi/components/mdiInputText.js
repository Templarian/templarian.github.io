var mdiInputText = (function () {
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

    var template$1 = "<input part=\"input\" type=\"text\" />";

    var style$1 = ":host {\n  display: block;\n  font-family: var(--mdi-font-family);\n}\n\n[part=\"input\"] {\n  border: 1px solid var(--mdi-input-text-border-color, #453C4F);\n  border-radius: 0.125rem;\n  padding: calc(0.5rem - 1px) 0.75rem;\n  font-size: 1rem;\n  outline: none;\n  width: calc(100% - 1.5rem - 2px);\n}\n\n[part=\"input\"]:active {\n  box-shadow: 0 0 0 3px var(--mdi-input-text-active-glow, rgb(79, 143, 249, 0.6));\n}\n[part=\"input\"]:focus {\n  box-shadow: 0 0 0 3px var(--mdi-input-text-focus-glow, rgb(79, 143, 249, 0.5));\n}";

    let MdiInputText = class MdiInputText extends HTMLElement {
        constructor() {
            super(...arguments);
            this.name = '';
            this.value = '';
            this.placeholder = '';
            this.skipValue = false;
        }
        connectedCallback() {
            this.$input.addEventListener('input', this.handleInput.bind(this));
            this.$input.addEventListener('change', this.handleChange.bind(this));
        }
        render(changes) {
            if (changes.value && !this.skipValue) {
                this.$input.value = this.value;
            }
            if (changes.placeholder) {
                this.$input.placeholder = this.placeholder;
            }
            this.skipValue = false;
        }
        handleInput(e) {
            e.stopPropagation();
            this.skipValue = true;
            this.value = e.target.value;
            this.dispatchEvent(new CustomEvent('input', {
                detail: {
                    value: e.target.value,
                    name: e.name
                }
            }));
        }
        handleChange(e) {
            this.dispatchEvent(new CustomEvent('change', {
                detail: {
                    value: e.target.value,
                    name: e.name
                }
            }));
        }
    };
    __decorate([
        Prop()
    ], MdiInputText.prototype, "name", void 0);
    __decorate([
        Prop()
    ], MdiInputText.prototype, "value", void 0);
    __decorate([
        Prop()
    ], MdiInputText.prototype, "placeholder", void 0);
    __decorate([
        Part()
    ], MdiInputText.prototype, "$input", void 0);
    MdiInputText = __decorate([
        Component({
            selector: 'mdi-input-text',
            style: style$1,
            template: template$1
        })
    ], MdiInputText);
    var MdiInputText$1 = MdiInputText;

    return MdiInputText$1;

}());
//# sourceMappingURL=mdiInputText.js.map
