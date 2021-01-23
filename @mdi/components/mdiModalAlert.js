var mdiModalAlert = (function () {
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

    var template$1 = "<div class=\"backdrop\">\n  <div class=\"dialog\"\n    role=\"dialog\"\n    id=\"dialog1\"\n    aria-labelledby=\"dialog1_label\"\n    aria-modal=\"true\">\n    <header part=\"header\">\n      <h2 id=\"dialog1_label\"\n        class=\"dialog_label\"\n        part=\"headerText\">\n        Add Delivery Address\n      </h2>\n    </header>\n    <main>\n      <p part=\"message\"></p>\n    </main>\n    <footer>\n      <mdi-button part=\"no\">No</mdi-button>\n      <mdi-button part=\"yes\">Yes</mdi-button>\n    </footer>\n  </div>\n</div>";

    var style$1 = ".backdrop {\n  display: flex;\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.6);\n  justify-content: center;\n  align-items: center;\n}\n.dialog {\n  background: #fff;\n  border-radius: 0.5rem;\n  box-shadow: 0 1px 1rem rgba(0, 0, 0, 0.5);\n  overflow: hidden;\n  min-width: 15rem;\n}\nheader {\n  border-bottom: 1px solid #ccc;\n  background: #f1f1f1;\n  padding: 0.75rem 1rem;\n}\nheader h2 {\n  font-size: 1.25rem;\n  margin: 0;\n  font-weight: normal;\n}\nmain {\n  padding: 0.5rem 1rem;\n}\nfooter {\n  display: flex;\n  flex-direction: row;\n  padding: 0.75rem 1rem;\n  border-top: 1px solid #ccc;\n  background: #f1f1f1;\n  justify-content: flex-end;\n}\n\n[part=\"no\"] {\n  margin-right: 0.5rem;\n}";

    function camelToDash$1(str) {
        return str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();
    }
    const layers = [];
    const promises = [];
    // Update to support passing no object for a base class
    let MdiOverlay = class MdiOverlay extends HTMLElement {
        static open(props = {}) {
            var ele = document.createElement(camelToDash$1(this.name));
            Object.assign(ele, props);
            document.body.appendChild(ele);
            layers.push(ele);
            return new Promise((resolve) => {
                promises.push(resolve);
            });
        }
        close(result) {
            layers.pop().remove();
            promises.pop()(result);
        }
    };
    MdiOverlay = __decorate([
        Component({
            selector: 'mdi-overlay',
            template: '-'
        })
    ], MdiOverlay);
    var MdiOverlay$1 = MdiOverlay;

    let MdiModalAlert = class MdiModalAlert extends MdiOverlay$1 {
        constructor() {
            super(...arguments);
            this.header = 'Are you sure?';
            this.message = 'Are you sure?';
        }
        connectedCallback() {
            this.$yes.addEventListener('click', this.handleYes.bind(this));
            this.$no.addEventListener('click', this.handleNo.bind(this));
        }
        handleYes() {
            this.close(true);
        }
        handleNo() {
            this.close(false);
        }
        render(changes) {
            if (changes.header) {
                this.$headerText.innerText = this.header;
            }
            if (changes.message) {
                this.$message.innerText = this.message;
            }
        }
    };
    __decorate([
        Prop()
    ], MdiModalAlert.prototype, "header", void 0);
    __decorate([
        Prop()
    ], MdiModalAlert.prototype, "message", void 0);
    __decorate([
        Part()
    ], MdiModalAlert.prototype, "$header", void 0);
    __decorate([
        Part()
    ], MdiModalAlert.prototype, "$headerText", void 0);
    __decorate([
        Part()
    ], MdiModalAlert.prototype, "$message", void 0);
    __decorate([
        Part()
    ], MdiModalAlert.prototype, "$yes", void 0);
    __decorate([
        Part()
    ], MdiModalAlert.prototype, "$no", void 0);
    MdiModalAlert = __decorate([
        Component({
            selector: 'mdi-modal-alert',
            template: template$1,
            style: style$1
        })
    ], MdiModalAlert);
    var MdiModalAlert$1 = MdiModalAlert;

    return MdiModalAlert$1;

}());
//# sourceMappingURL=mdiModalAlert.js.map
