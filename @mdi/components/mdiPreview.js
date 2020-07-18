var mdiPreview = (function () {
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

    var template$1 = "<div part=\"grid\">\n  <svg part=\"svg\" viewBox=\"0 0 24 24\">\n    <path part=\"path\" fill=\"currentColor\" d=\"M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z\"/>\n  </svg>\n</div>";

    var style$1 = ":host {\n  display: inline-flex;\n  color: var(--mdi-icon-color, #222);\n}\n\n[part=svg] {\n  position: relative;\n  width: 1.5rem;\n  height: 1.5rem;\n  z-index: 1;\n}\n\n[part=\"grid\"] {\n  position: relative;\n  background-image:\n    repeating-linear-gradient(rgba(83, 137, 164, 0.5) 0 2px, transparent 2px 100%),\n    repeating-linear-gradient(90deg, rgba(83, 137, 164, 0.5) 0 2px, transparent 2px 100%);\n  background-size: var(--mdi-preview-size, 4px) var(--mdi-preview-size, 4px);\n  background-position: calc(var(--mdi-preview-size, 4px) - 1px) calc(var(--mdi-preview-size, 4px) - 1px);\n}\n\n[part=\"grid\"]::after {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  content: ' ';\n  background-image:\n    repeating-linear-gradient(#5389a4 0 2px, transparent 2px 100%),\n    repeating-linear-gradient(90deg, #5389a4 0 2px, transparent 2px 100%);\n  background-size: calc(var(--mdi-preview-size, 4px) * 4) calc(var(--mdi-preview-size, 4px) * 4);\n  background-position: calc(var(--mdi-preview-size, 4px) * 4 - 1px) calc(var(--mdi-preview-size, 4px) * 4 - 1px);\n}\n";

    const noIcon = 'M0 0h24v24H0V0zm2 2v20h20V2H2z';
    let MdiIcon = class MdiIcon extends HTMLElement {
        constructor() {
            super(...arguments);
            this.path = noIcon;
            this.width = 24;
            this.height = 24;
            this.size = 4;
        }
        render(changes) {
            if (changes.path) {
                this.$path.setAttribute('d', this.path);
            }
            if (changes.size) {
                const width = parseInt(`${this.width}`, 10);
                const height = parseInt(`${this.height}`, 10);
                const size = parseInt(`${this.size}`, 10);
                this.$svg.style.width = `${width * size}px`;
                this.$svg.style.height = `${height * size}px`;
                this.$grid.style.width = `${width * size}px`;
                this.$grid.style.height = `${height * size}px`;
                this.$grid.style.setProperty('--mdi-preview-size', `${size}px`);
            }
        }
    };
    __decorate([
        Prop()
    ], MdiIcon.prototype, "path", void 0);
    __decorate([
        Prop()
    ], MdiIcon.prototype, "width", void 0);
    __decorate([
        Prop()
    ], MdiIcon.prototype, "height", void 0);
    __decorate([
        Prop()
    ], MdiIcon.prototype, "size", void 0);
    __decorate([
        Part()
    ], MdiIcon.prototype, "$svg", void 0);
    __decorate([
        Part()
    ], MdiIcon.prototype, "$path", void 0);
    __decorate([
        Part()
    ], MdiIcon.prototype, "$grid", void 0);
    MdiIcon = __decorate([
        Component({
            selector: 'mdi-preview',
            style: style$1,
            template: template$1
        })
    ], MdiIcon);
    var MdiIcon$1 = MdiIcon;

    return MdiIcon$1;

}());
//# sourceMappingURL=mdiPreview.js.map
