var mdiInputCheckList = (function () {
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

    var template$1 = "<ul part=\"list\"></ul>";

    var style$1 = ":host {\n  display: flex;\n  flex-direction: column;\n}\n\n.blank {\n  color: var(--mdi-input-check-blank-color, #453C4F);\n}\n.blank [part=\"check\"] {\n  visibility: hidden;\n}\n\n.checked {\n  color: var(--mdi-input-check-checked-color, #453C4F);\n}\n\n[part=\"list\"] {\n  display: flex;\n  flex-direction: column;\n  list-style: none;\n  margin: 0;\n  padding: 0.25rem 0;\n}\n\n[part=\"list\"] li {\n  display: flex;\n  flex-direction: column;\n}\n\n[part=\"list\"] li:not(:last-child) {\n  margin-bottom: 0.25rem;\n}\n\n[part=\"list\"] button {\n  display: flex;\n  padding: 0;\n  border: 0;\n  outline: 0;\n  border-radius: 0.25rem;\n  align-items: center;\n  background: transparent;\n}\n\n[part=\"svg\"] {\n  width: var(--mdi-icon-check-size, 1.5rem);\n  height: var(--mdi-icon-check-size, 1.5rem);\n}\n\n[part=\"list\"] button span {\n  margin-left: 0.25rem;\n}\n\n[part=\"list\"] button:not(:hover):active {\n  box-shadow: 0 0 0 3px var(--mdi-input-check-active-glow, rgb(79, 143, 249, 0.6));\n}\n[part=\"list\"] button:not(:hover):focus {\n  box-shadow: 0 0 0 3px var(--mdi-input-check-focus-glow, rgb(79, 143, 249, 0.5));\n}\n[part=\"list\"] button:not(:disabled):hover [part=\"path\"] {\n  fill: #4f8ff9;\n}\n[part=\"list\"] button:not(:disabled):hover span {\n  color: #4f8ff9;\n}\n[part=\"list\"] button:disabled {\n  color: #AAA;\n}";

    function list($list, options, key, add, update) {
        const elements = Array.from($list.children);
        const current = elements.map((e) => e.dataset.key);
        options.forEach(option => {
            if (current.length === 0) {
                const newItem = add(option);
                newItem.dataset.key = option[key];
                $list.appendChild(newItem);
                return;
            }
            const element = elements.find((e) => e.dataset.key === current[key]);
            if (option[key] === current[key]) {
                update(option, element);
                return;
            }
            element === null || element === void 0 ? void 0 : element.remove();
        });
    }
    function item($list, option, key) {
        const elements = Array.from($list.children);
        const item = elements.find((e) => e.dataset.key === option[key]);
        return item;
    }

    const NS_SVG = 'http://www.w3.org/2000/svg';
    const PATH_BLANK = 'M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z';
    const PATH_CHECKED = 'M19 19L5 19V5H15V3H5C3.89 3 3 3.89 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V11H19';
    const PATH_CHECK = 'M7.91 10.08L6.5 11.5L11 16L21 6L19.59 4.58L11 13.17L7.91 10.08Z';
    let MdiInputCheckList = class MdiInputCheckList extends HTMLElement {
        constructor() {
            super(...arguments);
            this.value = [];
            this.options = [];
        }
        connectedCallback() {
        }
        handleClick(option) {
            var _a;
            const checked = this.value.includes(option.value);
            const li = item(this.$list, option, 'value');
            const button = li.querySelector('button');
            button === null || button === void 0 ? void 0 : button.classList.toggle('blank', checked);
            button === null || button === void 0 ? void 0 : button.classList.toggle('checked', !checked);
            (_a = li.querySelector('[part="path"]')) === null || _a === void 0 ? void 0 : _a.setAttribute('d', checked ? PATH_BLANK : PATH_CHECKED);
            if (checked) {
                this.value.splice(this.value.findIndex(v => v === option.value), 1);
            }
            else {
                this.value.push(option.value);
            }
            this.dispatchEvent(new CustomEvent('change'));
        }
        render(changes) {
            if (changes.options) {
                list(this.$list, this.options, 'value', (option) => {
                    const li = document.createElement('li');
                    const button = document.createElement('button');
                    if (option.disabled === true) {
                        button.disabled = true;
                    }
                    console.log('check...', this.value, option.value);
                    const checked = this.value.includes(option.value);
                    button.classList.toggle('checked', checked);
                    button.classList.toggle('blank', !checked);
                    const svg = document.createElementNS(NS_SVG, 'svg');
                    svg.setAttribute('viewBox', '0 0 24 24');
                    svg.setAttribute('part', 'svg');
                    const path = document.createElementNS(NS_SVG, 'path');
                    path.setAttribute('d', checked ? PATH_CHECKED : PATH_BLANK);
                    path.setAttribute('fill', 'currentColor');
                    path.setAttribute('part', 'path');
                    svg.appendChild(path);
                    const check = document.createElementNS(NS_SVG, 'path');
                    check.setAttribute('d', PATH_CHECK);
                    check.setAttribute('fill', 'currentColor');
                    check.setAttribute('part', 'check');
                    svg.appendChild(check);
                    button.appendChild(svg);
                    const span = document.createElement('span');
                    span.innerText = option.label;
                    button.appendChild(span);
                    button.addEventListener('click', (e) => {
                        this.handleClick(option);
                    });
                    li.appendChild(button);
                    return li;
                }, (option, $item) => {
                    $item.querySelector('button').innerText = option.label;
                });
            }
            if (changes.value) ;
        }
    };
    __decorate([
        Prop()
    ], MdiInputCheckList.prototype, "value", void 0);
    __decorate([
        Prop()
    ], MdiInputCheckList.prototype, "options", void 0);
    __decorate([
        Part()
    ], MdiInputCheckList.prototype, "$list", void 0);
    MdiInputCheckList = __decorate([
        Component({
            selector: 'mdi-input-check-list',
            style: style$1,
            template: template$1
        })
    ], MdiInputCheckList);
    var MdiInputCheckList$1 = MdiInputCheckList;

    return MdiInputCheckList$1;

}());
//# sourceMappingURL=mdiInputCheckList.js.map
