var mdiInputHexRgb = (function () {
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

    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    function normalizeHex(hex) {
        const h = hex.toUpperCase();
        if (h.length === 7) {
            return h;
        }
        else if (h.length === 4) {
            return `#${h[1]}${h[1]}${h[2]}${h[2]}${h[3]}${h[3]}`;
        }
        return '#000000';
    }
    function cToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    function rgbToHex(r, g, b) {
        return "#" + cToHex(r) + cToHex(g) + cToHex(b);
    }

    var template$1 = "<div>\n  <input part=\"hex\" type=\"text\" />\n  <label part=\"labelRed\">R</label>\n  <input part=\"red\" type=\"number\" step=\"1\" min=\"0\" max=\"255\" />\n  <label part=\"labelGreen\">G</label>\n  <input part=\"green\" type=\"number\" step=\"1\" min=\"0\" max=\"255\" />\n  <label part=\"labelBlue\">B</label>\n  <input part=\"blue\" type=\"number\" step=\"1\" min=\"0\" max=\"255\" />\n</div>";

    var style$1 = ":host {\n  display: block;\n}\n\n:host > div {\n  display: grid;\n  grid-template-rows: auto 1rem 2rem 1rem 2rem 1rem 2rem;\n  grid-template-rows: 1fr;\n}\n\n[part~=\"hex\"] {\n  grid-row: 1;\n  grid-column: 1;\n}\n\n[part~=\"labelRed\"] {\n  grid-row: 1;\n  grid-column: 2;\n  background: red;\n}\n\n[part~=\"red\"] {\n  grid-row: 1;\n  grid-column: 3;\n}\n\n[part~=\"labelGreen\"] {\n  grid-row: 1;\n  grid-column: 4;\n  background: green;\n  color: white;\n}\n\n[part~=\"green\"] {\n  grid-row: 1;\n  grid-column: 5;\n}\n\n[part~=\"labelBlue\"] {\n  grid-row: 1;\n  grid-column: 6;\n  background: blue;\n  color: white;\n}\n\n[part~=\"blue\"] {\n  grid-row: 1;\n  grid-column: 7;\n}\n\n[part~=\"labelRed\"],\n[part~=\"labelGreen\"],\n[part~=\"labelBlue\"] {\n  display: flex;\n  margin-left: 0.25rem;\n  align-items: center;\n  justify-content: center;\n  border-radius: 0.25rem 0 0 0.25rem;\n  color: white;\n  min-width: 1rem;\n}\n\n[part~=\"hex\"] {\n  border-radius: 0.25rem;\n  min-width: 4rem;\n}\n\n[part~=\"hex\"],\n[part~=\"red\"],\n[part~=\"green\"],\n[part~=\"blue\"] {\n  outline: none;\n  font-size: 1rem;\n  padding: 0.25rem 0.5rem;\n  border: 0;\n  width: calc(100% - 1rem);\n}\n\n[part~=\"red\"],\n[part~=\"green\"],\n[part~=\"blue\"] {\n  border-radius: 0 0.25rem 0.25rem 0;\n  -moz-appearance: textfield;\n  width: calc(100% - 1rem);\n  min-width: 2rem;\n}\n\n[part~=\"red\"]::-webkit-inner-spin-button,\n[part~=\"red\"]::-webkit-outer-spin-button,\n[part~=\"green\"]::-webkit-inner-spin-button,\n[part~=\"green\"]::-webkit-outer-spin-button,\n[part~=\"blue\"]::-webkit-inner-spin-button,\n[part~=\"blue\"]::-webkit-outer-spin-button {\n  -webkit-appearance: none;\n  margin: 0;\n}";

    let MdiInputHexRgb = class MdiInputHexRgb extends HTMLElement {
        constructor() {
            super(...arguments);
            this.value = '#000000';
        }
        connectedCallback() {
            this.$hex.value = this.value;
            this.updateRgb();
            this.$hex.addEventListener('input', this.updateRgbDispatch.bind(this));
            this.$red.addEventListener('input', this.updateHexDispatch.bind(this));
            this.$green.addEventListener('input', this.updateHexDispatch.bind(this));
            this.$blue.addEventListener('input', this.updateHexDispatch.bind(this));
        }
        updateRgb() {
            const hex = normalizeHex(this.$hex.value);
            const rgb = hexToRgb(hex);
            if (rgb !== null) {
                this.$red.value = rgb.r.toString();
                this.$green.value = rgb.g.toString();
                this.$blue.value = rgb.b.toString();
            }
        }
        updateRgbDispatch() {
            this.updateRgb();
            this.dispatchSelect();
        }
        updateHexDispatch() {
            this.$hex.value = rgbToHex(parseInt(this.$red.value || '0', 10), parseInt(this.$green.value || '0', 10), parseInt(this.$blue.value || '0', 10));
            this.dispatchSelect();
        }
        dispatchSelect() {
            const hex = normalizeHex(this.$hex.value);
            const rgb = rgbToHex(parseInt(this.$red.value || '0', 10), parseInt(this.$green.value || '0'), parseInt(this.$blue.value || '0'));
            this.value = hex;
            this.dispatchEvent(new CustomEvent('change', {
                detail: {
                    hex,
                    rgb
                }
            }));
        }
        render() {
            const hex = normalizeHex(this.value);
            const rgb = hexToRgb(hex);
            this.$hex.value = hex;
            this.$red.value = `${rgb ? rgb.r : 0}`;
            this.$green.value = `${rgb ? rgb.g : 0}`;
            this.$blue.value = `${rgb ? rgb.b : 0}`;
        }
    };
    __decorate([
        Prop()
    ], MdiInputHexRgb.prototype, "value", void 0);
    __decorate([
        Part()
    ], MdiInputHexRgb.prototype, "$hex", void 0);
    __decorate([
        Part()
    ], MdiInputHexRgb.prototype, "$red", void 0);
    __decorate([
        Part()
    ], MdiInputHexRgb.prototype, "$green", void 0);
    __decorate([
        Part()
    ], MdiInputHexRgb.prototype, "$blue", void 0);
    MdiInputHexRgb = __decorate([
        Component({
            selector: 'mdi-input-hex-rgb',
            style: style$1,
            template: template$1
        })
    ], MdiInputHexRgb);
    var MdiInputHexRgb$1 = MdiInputHexRgb;

    return MdiInputHexRgb$1;

}());
//# sourceMappingURL=mdiInputHexRgb.js.map
