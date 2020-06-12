var mdiToasts = (function () {
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

    const ADD = 'mditoastadd';
    const REMOVE = 'mditoastremove';
    function observeToasts({ add, remove }) {
        document.body.addEventListener(ADD, (e) => {
            add(e.detail);
        });
        document.body.addEventListener(REMOVE, (e) => {
            remove(e.detail.key);
        });
    }

    var template$1 = "<div part=\"container\"></div>";

    var style$1 = "[part~=container] {\n  display: inline-flex;\n  flex-direction: column;\n  align-items: flex-end;\n  position: fixed;\n  top: 1rem;\n  right: 1rem;\n}";

    let MdiToasts = class MdiToasts extends HTMLElement {
        constructor() {
            super(...arguments);
            this.toasts = [];
        }
        connectedCallback() {
            observeToasts({
                add: (toast) => {
                    this.toasts.push(toast);
                    this.render();
                },
                remove: (key) => {
                    var _a;
                    const index = this.toasts.findIndex(t => t.key === key);
                    if (index !== -1) {
                        var [toast] = this.toasts.splice(index, 1);
                        (_a = this.$container.querySelector(`[key="${toast.key}"]`)) === null || _a === void 0 ? void 0 : _a.remove();
                    }
                }
            });
        }
        render() {
            this.toasts.forEach((toast) => {
                const existing = this.$container.querySelector(`[key="${toast.key}"]`);
                if (existing) {
                    existing.message = toast.message;
                    existing.loading = toast.loading;
                    existing.type = toast.type;
                }
                else {
                    const ele = document.createElement('mdi-toast');
                    ele.setAttribute('key', toast.key);
                    ele.message = toast.message;
                    ele.loading = toast.loading;
                    ele.type = toast.type;
                    this.$container.appendChild(ele);
                }
            });
        }
    };
    __decorate([
        Part()
    ], MdiToasts.prototype, "$container", void 0);
    MdiToasts = __decorate([
        Component({
            selector: 'mdi-toasts',
            style: style$1,
            template: template$1
        })
    ], MdiToasts);
    var MdiToasts$1 = MdiToasts;

    return MdiToasts$1;

}());
//# sourceMappingURL=mdiToasts.js.map
