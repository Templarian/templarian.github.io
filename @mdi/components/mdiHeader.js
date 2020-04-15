var mdiHeader = (function () {
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

    var template$1 = "<header>\n  <a href=\"/\">\n    <svg viewBox=\"0 0 24 24\">\n      <path part=\"path\" fill=\"currentColor\" d=\"\"></path>\n    </svg>\n    <span part=\"name\"></span>\n  </a>\n  <div>\n    <slot name=\"search\"></slot>\n    <slot name=\"nav\"></slot>\n  </div>\n</header>";

    var style$1 = "header {\n  display: grid;\n  grid-template-columns: auto 1fr;\n  grid-template-rows: 1fr;\n  grid-row: 1;\n  grid-column: 1 / span 2;\n  background: #414F56;\n  color: #FFF;\n  height: 3rem;\n}\nheader > a {\n  grid-column: 1;\n  display: inline-flex;\n  color: #FFF;\n  text-decoration: none;\n  align-items: center;\n}\nheader > a > svg {\n  display: inline-flex;\n  width: 1.75rem;\n  height: 1.75rem;\n  margin: 0 0.75rem 0 1rem;\n}\nheader > a > span {\n  display: inline-flex;\n  color: #FFF;\n  font-size: 1.5rem;\n  margin: 0;\n  font-weight: normal;\n  padding-bottom: 1px;\n}\nheader > div {\n  display: flex;\n  grid-column: 2;\n  justify-self: right;\n}";

    const noIcon = 'M0 0h24v24H0V0zm2 2v20h20V2H2z';
    let MdiHeader = class MdiHeader extends HTMLElement {
        constructor() {
            super(...arguments);
            this.logo = noIcon;
            this.name = 'Default';
        }
        render() {
            this.$path.setAttribute('d', this.logo);
            this.$name.innerText = this.name;
        }
    };
    __decorate([
        Prop()
    ], MdiHeader.prototype, "logo", void 0);
    __decorate([
        Prop()
    ], MdiHeader.prototype, "name", void 0);
    __decorate([
        Part()
    ], MdiHeader.prototype, "$path", void 0);
    __decorate([
        Part()
    ], MdiHeader.prototype, "$name", void 0);
    MdiHeader = __decorate([
        Component({
            selector: 'mdi-header',
            style: style$1,
            template: template$1
        })
    ], MdiHeader);
    var MdiHeader$1 = MdiHeader;

    return MdiHeader$1;

}());
//# sourceMappingURL=mdiHeader.js.map