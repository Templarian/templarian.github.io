var mdiToast = (function () {
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

    function uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    const REMOVE = 'mditoastremove';
    function removeToast(key) {
        const event = new CustomEvent(REMOVE, {
            detail: { key }
        });
        document.body.dispatchEvent(event);
    }

    var template$1 = "<button part=\"button\">\n  <span part=\"loading\">\n    <svg part=\"loadingIcon\" viewBox=\"0 0 24 24\">\n      <path fill=\"currentColor\" d=\"M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z\" />\n    </svg>\n  </span>\n  <span part=\"message\"></span>\n  <span part=\"close\">\n    <svg part=\"closeIcon\" viewBox=\"0 0 24 24\">\n      <path fill=\"currentColor\" d=\"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z\" />\n    </svg>\n  </span>\n</button>";

    var style$1 = "[part~=button] {\n  display: flex;\n  background: #737E9E;\n  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.4);\n  border-radius: 0.25rem;\n  border: 1px solid #737E9E;\n  padding: 0.5rem 0.5rem 0.5rem 0.75rem;\n  color: #FFF;\n  align-items: center;\n  outline: 0;\n  transition: border-color 0.1s ease-in;\n  margin-bottom: 0.5rem;\n  max-width: 18rem;\n  font-size: 1rem;\n  align-items: center;\n}\n\n[part~=loading] {\n  height: 1.5rem;\n  margin: -0.25rem 0.5rem -0.25rem -0.25rem;\n}\n\n[part~=button]:hover {\n  border: 1px solid rgba(255, 255, 255, 0.75);\n}\n\n[part~=close] {\n  height: 1rem;\n}\n\n[part~=closeIcon] {\n  width: 1rem;\n  height: 1rem;\n}\n\n[part~=loadingIcon] {\n  animation: spin 2s infinite linear;\n  width: 1.5rem;\n  height: 1.5rem;\n}\n\n@keyframes progress {\n  from {\n    width: 0;\n  }\n  to {\n    width: 20rem;\n  }\n}\n\n@keyframes spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(359deg);\n  }\n}\n\n[part~=closeIcon] {\n  margin-left: 0.5rem;\n  color: rgba(255, 255, 255, 0.5);\n  transition: color 0.1s ease-in;\n}\n\n[part~=button]:hover [part~=closeIcon] {\n  color: #fff;\n}\n\n.hide {\n  display: none;\n}\n\n/* Error */\n\n[part~=button].error {\n  color: #721c24;\n  background-color: #f8d7da;\n  border-color: #f5c6cb;\n}\n\n[part~=button].error [part~=closeIcon] {\n  color: rgba(114, 28, 36, 0.6);\n}\n\n[part~=button].error:hover {\n  border-color: #721c24;\n}\n\n[part~=button].error:hover [part~=closeIcon] {\n  color: #721c24;\n}\n\n/* Warning */\n\n[part~=button].warning {\n  color: #856404;\n  background-color: #fff3cd;\n  border-color: #ffeeba;\n}\n\n[part~=button].warning [part~=closeIcon] {\n  color: rgba(133, 101, 4, 0.6);\n}\n\n[part~=button].warning:hover {\n  border-color: #856404;\n}\n\n[part~=button].warning:hover [part~=closeIcon] {\n  color: #856404;\n}";

    let MdiToast = class MdiToast extends HTMLElement {
        constructor() {
            super(...arguments);
            this.loading = false;
            this.message = '';
            this.type = 'default';
            this.key = uuid();
            this.toasts = [];
        }
        connectedCallback() {
            this.$button.addEventListener('click', () => {
                removeToast(this.key);
            });
        }
        render() {
            this.$message.innerText = this.message;
            this.$loading.classList.toggle('hide', !this.loading);
            this.$button.classList.toggle('error', this.type === 'error');
            this.$button.classList.toggle('warning', this.type === 'warning');
        }
    };
    __decorate([
        Prop()
    ], MdiToast.prototype, "loading", void 0);
    __decorate([
        Prop()
    ], MdiToast.prototype, "message", void 0);
    __decorate([
        Prop()
    ], MdiToast.prototype, "type", void 0);
    __decorate([
        Prop()
    ], MdiToast.prototype, "key", void 0);
    __decorate([
        Part()
    ], MdiToast.prototype, "$button", void 0);
    __decorate([
        Part()
    ], MdiToast.prototype, "$loadingIcon", void 0);
    __decorate([
        Part()
    ], MdiToast.prototype, "$closeIcon", void 0);
    __decorate([
        Part()
    ], MdiToast.prototype, "$message", void 0);
    __decorate([
        Part()
    ], MdiToast.prototype, "$loading", void 0);
    MdiToast = __decorate([
        Component({
            selector: 'mdi-toast',
            style: style$1,
            template: template$1
        })
    ], MdiToast);
    var MdiToast$1 = MdiToast;

    return MdiToast$1;

}());
//# sourceMappingURL=mdiToast.js.map
