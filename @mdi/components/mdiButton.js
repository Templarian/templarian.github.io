var mdiButton = (function () {
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

    var template$1 = "<button part=\"button\" class=\"base\"><slot></slot></button>";

    var style$1 = "[part~=button] {\n  display: inline-flex;\n  align-items: center;\n  font-family: var(--mdi-font-family);\n  font-size: 1rem;\n  line-height: 1.5rem;\n}\n\n[part~=button]:hover {\n  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);\n}\n\n[part~=button].base {\n  border: 1px solid #4281E9;\n  background: #4281E9;\n  color: #FFF;\n  padding: 0.25rem 0.5rem;\n  border-radius: 0.25rem;\n  outline: none;\n  --mdi-icon-color: #FFF;\n}\n\n[part~=button].base:hover {\n  background-color: #4F8FF9;\n}\n\n[part~=button].base-inverse {\n  border: 1px solid #F1F1F1;\n  background: #FFF;\n  color: #4281E9;\n  padding: 0.25rem 0.5rem;\n  border-radius: 0.25rem;\n  outline: none;\n  --mdi-icon-color: #4281E9;\n}";

    const DEFAULT_VARIANT = 'base';
    let MdiButton = class MdiButton extends HTMLElement {
        constructor() {
            super(...arguments);
            this.variant = DEFAULT_VARIANT;
            this.oldVariant = DEFAULT_VARIANT;
        }
        connectedCallback() {
            this.$button.addEventListener('click', (e) => this.dispatchEvent(new CustomEvent('click')));
        }
        render() {
            if (this.variant != this.oldVariant) {
                this.$button.classList.replace(this.oldVariant, this.variant);
                this.oldVariant = this.variant;
            }
        }
    };
    __decorate([
        Prop()
    ], MdiButton.prototype, "variant", void 0);
    __decorate([
        Part()
    ], MdiButton.prototype, "$button", void 0);
    MdiButton = __decorate([
        Component({
            selector: 'mdi-button',
            style: style$1,
            template: template$1
        })
    ], MdiButton);
    var MdiButton$1 = MdiButton;

    return MdiButton$1;

}());
//# sourceMappingURL=mdiButton.js.map
