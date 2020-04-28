var mdiAnnoy = (function () {
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
    function Local(initialValue, key) {
        if (initialValue === void 0) { initialValue = null; }
        return function (target, propertyKey, descriptor) {
            var getKey = function (self) {
                return (key ? key : self.constructor.name + ":" + propertyKey);
            };
            Object.defineProperty(target, propertyKey, {
                get: function () {
                    var k = getKey(this);
                    return window.localStorage.getItem(k) || initialValue;
                },
                set: function (value) {
                    var k = getKey(this);
                    if (value === null) {
                        window.localStorage.removeItem(k);
                    }
                    else {
                        window.localStorage.setItem(k, value);
                    }
                }
            });
        };
    }

    var template$1 = "<div part=\"list\">\n  <button part=\"close\">\n    <svg viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z\" /></svg>\n  </button>\n  <div part=\"contextMenu\">\n    Right Click Icons\n  </div>\n  <div part=\"extension\">\n    <a class=\"chrome\" title=\"Download Chrome Extension\" href=\"https://chrome.google.com/webstore/detail/materialdesignicons-picke/edjaedpifkihpjkcgknfokmibkoafhme\" target=\"_blank\">\n      <svg viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M12,20L15.46,14H15.45C15.79,13.4 16,12.73 16,12C16,10.8 15.46,9.73 14.62,9H19.41C19.79,9.93 20,10.94 20,12A8,8 0 0,1 12,20M4,12C4,10.54 4.39,9.18 5.07,8L8.54,14H8.55C9.24,15.19 10.5,16 12,16C12.45,16 12.88,15.91 13.29,15.77L10.89,19.91C7,19.37 4,16.04 4,12M15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9A3,3 0 0,1 15,12M12,4C14.96,4 17.54,5.61 18.92,8H12C10.06,8 8.45,9.38 8.08,11.21L5.7,7.08C7.16,5.21 9.44,4 12,4M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z\" /></svg>\n    </a>\n    <a class=\"firefox\" title=\"Download Chrome Addon\" href=\"https://addons.mozilla.org/en-US/firefox/addon/materialdesignicons-picker/\" target=\"_blank\">\n      <svg viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M9.27 7.94C9.27 7.94 9.27 7.94 9.27 7.94M6.85 6.74C6.86 6.74 6.86 6.74 6.85 6.74M21.28 8.6C20.85 7.55 19.96 6.42 19.27 6.06C19.83 7.17 20.16 8.28 20.29 9.1L20.29 9.12C19.16 6.3 17.24 5.16 15.67 2.68C15.59 2.56 15.5 2.43 15.43 2.3C15.39 2.23 15.36 2.16 15.32 2.09C15.26 1.96 15.2 1.83 15.17 1.69C15.17 1.68 15.16 1.67 15.15 1.67H15.13L15.12 1.67L15.12 1.67L15.12 1.67C12.9 2.97 11.97 5.26 11.74 6.71C11.05 6.75 10.37 6.92 9.75 7.22C9.63 7.27 9.58 7.41 9.62 7.53C9.67 7.67 9.83 7.74 9.96 7.68C10.5 7.42 11.1 7.27 11.7 7.23L11.75 7.23C11.83 7.22 11.92 7.22 12 7.22C12.5 7.21 12.97 7.28 13.44 7.42L13.5 7.44C13.6 7.46 13.67 7.5 13.75 7.5C13.8 7.54 13.86 7.56 13.91 7.58L14.05 7.64C14.12 7.67 14.19 7.7 14.25 7.73C14.28 7.75 14.31 7.76 14.34 7.78C14.41 7.82 14.5 7.85 14.54 7.89C14.58 7.91 14.62 7.94 14.66 7.96C15.39 8.41 16 9.03 16.41 9.77C15.88 9.4 14.92 9.03 14 9.19C17.6 11 16.63 17.19 11.64 16.95C11.2 16.94 10.76 16.85 10.34 16.7C10.24 16.67 10.14 16.63 10.05 16.58C10 16.56 9.93 16.53 9.88 16.5C8.65 15.87 7.64 14.68 7.5 13.23C7.5 13.23 8 11.5 10.83 11.5C11.14 11.5 12 10.64 12.03 10.4C12.03 10.31 10.29 9.62 9.61 8.95C9.24 8.59 9.07 8.42 8.92 8.29C8.84 8.22 8.75 8.16 8.66 8.1C8.43 7.3 8.42 6.45 8.63 5.65C7.6 6.12 6.8 6.86 6.22 7.5H6.22C5.82 7 5.85 5.35 5.87 5C5.86 5 5.57 5.16 5.54 5.18C5.19 5.43 4.86 5.71 4.56 6C4.21 6.37 3.9 6.74 3.62 7.14C3 8.05 2.5 9.09 2.28 10.18C2.28 10.19 2.18 10.59 2.11 11.1L2.08 11.33C2.06 11.5 2.04 11.65 2 11.91L2 11.94L2 12.27L2 12.32C2 17.85 6.5 22.33 12 22.33C16.97 22.33 21.08 18.74 21.88 14C21.9 13.89 21.91 13.76 21.93 13.63C22.13 11.91 21.91 10.11 21.28 8.6Z\" /></svg>\n    </a>\n    <div class=\"text\">Browser Extension</div>\n  </div>\n  <div part=\"react\">\n    <code>@mdi/react</code>\n  </div>\n</div>";

    var style$1 = ":host {\n  display: block;\n  font-family: var(--mdi-font-family);\n}\n\n[part~=list] {\n  width: 12rem;\n  font-size: 1rem;\n}\n\n[part~=list] > div {\n  display: none;\n}\n\n[part~=list] > div.show {\n  display: grid;\n  padding: 0.5rem;\n  border: 1px solid #fff;\n  border-radius: 0.25rem;\n  background: #fff;\n  box-shadow: 0 1px 0.5rem rgba(0, 0, 0, 0.3);\n}\n\n[part~=close] {\n  position: relative;\n  left: 11.25rem;\n  width: 1.5rem;\n  height: 1.5rem;\n  border: 1px solid #fff;\n  border-radius: 50%;\n  background: #fff;\n  display: flex;\n  align-content: center;\n  justify-content: center;\n  top: 0.75rem;\n  box-shadow: 0 1px 0.25rem rgba(0, 0, 0, 0.4);\n  padding: 0;\n  color: rgba(69, 60, 79, 0.8);\n}\n\n[part~=close]:hover {\n  box-shadow: 0 1px 0.25rem rgba(0, 0, 0, 0.6);\n  color: #453C4F;\n  border-color: #453C4F;\n}\n\n[part~=close] svg {\n  width: 1rem;\n  height: 1rem;\n}\n\n[part=extension] {\n  display: grid;\n  grid-template-rows: auto auto;\n  grid-template-columns: 1fr 1fr;\n}\n\n[part=extension] {\n  color: #453C4F;\n}\n\n[part=extension] a.chrome {\n  display: flex;\n  grid-row: 1;\n  grid-column: 1;\n  color: #453C4F;\n  border: 1px solid #453C4F;\n  border-radius: 0.25rem;\n  padding: 0.4rem 0.9rem;\n  justify-self: center;\n  text-align: center;\n  margin: 0.25rem;\n}\n\n[part=extension] a.firefox {\n  display: flex;\n  grid-row: 1;\n  grid-column: 2;\n  color: #453C4F;\n  border: 1px solid #453C4F;\n  border-radius: 0.25rem;\n  padding: 0.4rem 0.9rem;\n  justify-self: center;\n  text-align: center;\n  margin: 0.25rem;\n}\n\n[part=extension] a.chrome:hover,\n[part=extension] a.firefox:hover {\n  color: #fff;\n  background: #453C4F;\n}\n\n[part=extension] a svg {\n  width: 2rem;\n  height: 2rem;\n}\n\n[part=extension] div.text {\n  grid-row: 2;\n  grid-column: 1 / span 2;\n  text-align: center;\n  margin-top: 0.25rem;\n  font-weight: bold;\n}";

    let MdiAnnoy = class MdiAnnoy extends HTMLElement {
        constructor() {
            super(...arguments);
            this.list = [
                'contextMenu',
                'extension',
                'react'
            ];
        }
        connectedCallback() {
            let next = this.list.findIndex(name => name === this.current) + 1;
            if (next >= this.list.length) {
                next = 0;
            }
            this.current = this.list[next];
            this[`$${this.current}`].classList.add('show');
        }
    };
    __decorate([
        Local('contextMenu')
    ], MdiAnnoy.prototype, "current", void 0);
    __decorate([
        Part()
    ], MdiAnnoy.prototype, "$contextMenu", void 0);
    __decorate([
        Part()
    ], MdiAnnoy.prototype, "$extension", void 0);
    __decorate([
        Part()
    ], MdiAnnoy.prototype, "$react", void 0);
    MdiAnnoy = __decorate([
        Component({
            selector: 'mdi-annoy',
            style: style$1,
            template: template$1
        })
    ], MdiAnnoy);
    var MdiAnnoy$1 = MdiAnnoy;

    return MdiAnnoy$1;

}());
//# sourceMappingURL=mdiAnnoy.js.map
