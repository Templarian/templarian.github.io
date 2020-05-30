var mdiSearch = (function () {
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

    function* filter(array, condition, maxSize) {
        if (!maxSize || maxSize > array.length) {
            maxSize = array.length;
        }
        let count = 0;
        let i = 0;
        while (count < maxSize && i < array.length) {
            if (condition(array[i])) {
                yield array[i];
                count++;
            }
            i++;
        }
    }
    function iconFilter(icons, term, limit = 5) {
        const termRegex = new RegExp(term, 'i');
        const iconsByName = filter(icons, (icon) => {
            return icon.name.match(termRegex) !== null;
        }, limit);
        const list = Array.from(iconsByName);
        const skip = list.map(icon => icon.id);
        if (list.length < limit) {
            var iconsByAliases = filter(icons, (icon) => {
                if (skip.includes(icon.id)) {
                    return false;
                }
                for (var i = 0, c = icon.aliases.length; i < c; i++) {
                    if (icon.aliases[i].name == null) {
                        console.log(icon.name, icon.aliases);
                        return false;
                    }
                    if (icon.aliases[i].name.match(termRegex) !== null) {
                        icon.aliases[i].match = true;
                        return true;
                    }
                }
                return false;
            }, limit - list.length);
            const list2 = Array.from(iconsByAliases);
            list2.forEach(icon => list.push(icon));
        }
        return list;
    }

    var template$1 = "<div>\n  <input part=\"input\" type=\"text\" />\n  <svg viewBox=\"0 0 24 24\"><path d=\"M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z\" /></svg>\n  <div part=\"menu\">\n    <ul part=\"list\"></ul>\n  </div>\n</div>";

    var style$1 = ":host {\n  align-self: center;\n  width: 10rem;\n}\n\ndiv {\n  display: grid;\n  grid-template-columns: 1fr 0;\n  grid-template-rows: 1fr 0;\n}\ninput {\n  grid-row: 1;\n  grid-column: 1;\n  border-radius: 0.25rem;\n  border: 0;\n  padding: 0.25rem 0.5rem;\n  font-size: 1rem;\n  outline: none;\n  width: calc(100% - 1rem);\n}\ninput:focus + svg path {\n  fill: #ccc;\n}\nsvg {\n  grid-row: 1;\n  grid-column: 2;\n  width: 1.5rem;\n  height: 1.5rem;\n  justify-self: right;\n  margin-right: 0.25rem;\n  pointer-events: none;\n  align-self: center;\n}\nsvg > path {\n  fill: #555;\n  transition: fill 0.3s ease-in-out;\n}\n[part=menu] {\n  display: none;\n  background: #FFF;\n  grid-row: 2;\n  grid-column: 1 / span 2;\n  z-index: 1;\n}\nul {\n  list-style: none;\n  display: flex;\n  flex-direction: column;\n  padding: 0;\n  margin: 0;\n  border-radius: 0.25rem;\n  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.3);\n}\nul > li {\n  color: #222;\n}\nul > li > a {\n  display: flex;\n  padding: 0.25rem 0.5rem;\n  background: #FFF;\n  border-left: 1px solid #DDD;\n  border-right: 1px solid #DDD;\n}\nul > li > a:hover {\n  background: #DAF4FB;\n}\nul > li:first-child > a {\n  border-top: 1px solid #DDD;\n  border-bottom: 1px solid #DDD;\n  border-radius: 0.25rem 0.25rem 0 0;\n}\nul > li:not(:first-child) > a {\n  border-bottom: 1px solid #DDD;\n}\nul > li:last-child > a {\n  border-radius: 0 0 0.25rem 0.25rem;\n}\nul > li > a {\n  text-decoration: none;\n  color: #222;\n}\nul > li > a strong {\n  color: #453C4F;\n}\n.section {\n  color: #FFF;\n  padding: 0.25rem 0.5rem;\n  font-weight: bold;\n  background: #453C4F;\n  border-radius: 0.25rem 0.25rem 0 0;\n  cursor: default;\n}\n.section + li a {\n  border-radius: 0;\n}\n\nli + .section {\n  border-radius: 0;\n}";

    const noIcon = 'M0 0h24v24H0V0zm2 2v20h20V2H2z';
    let MdiSearch = class MdiSearch extends HTMLElement {
        constructor() {
            super(...arguments);
            this.path = noIcon;
            this.items = [];
            this.icons = [];
            this.isOpen = false;
            this.isOver = false;
            this.term = '';
        }
        connectedCallback() {
            this.$input.addEventListener('input', this.handleInput.bind(this));
            this.$input.addEventListener('focus', this.handleFocus.bind(this));
            this.$input.addEventListener('blur', this.handleBlur.bind(this));
            this.$list.addEventListener('mouseenter', this.handleListEnter.bind(this));
            this.$list.addEventListener('mouseleave', this.handleListLeave.bind(this));
        }
        handleInput(e) {
            const target = e.target;
            const { value } = target;
            this.term = value;
            this.updateList();
        }
        handleFocus() {
            this.isOpen = true;
            this.$menu.style.display = 'block';
        }
        handleBlur() {
            if (!this.isOver) {
                this.isOpen = false;
                this.$menu.style.display = 'none';
            }
        }
        handleListEnter() {
            this.isOver = true;
        }
        handleListLeave() {
            this.isOver = false;
        }
        highlight(text) {
            var normalized = text;
            var span = document.createElement('span');
            if (this.term === '') {
                span.innerText = text;
                return span;
            }
            while (normalized) {
                var index = normalized.toLowerCase().indexOf(this.term);
                if (index === -1) {
                    const end = document.createElement('span');
                    end.innerText = normalized.substr(0, normalized.length);
                    span.appendChild(end);
                    normalized = '';
                }
                else {
                    if (index > 0) {
                        const start = document.createElement('span');
                        start.innerText = normalized.substr(0, index);
                        span.appendChild(start);
                    }
                    const strong = document.createElement('strong');
                    strong.innerText = normalized.substr(index, this.term.length);
                    span.appendChild(strong);
                    normalized = normalized.substr(index + this.term.length, normalized.length);
                }
            }
            return span;
        }
        clearList() {
            while (this.$list.firstChild) {
                this.$list.removeChild(this.$list.firstChild);
            }
        }
        updateList() {
            this.clearList();
            const termRegex = new RegExp(this.term, 'i');
            this.items
                .filter((item) => item.name.match(termRegex))
                .forEach((item) => {
                var li = document.createElement('li');
                var a = document.createElement('a');
                a.href = item.url;
                var text = this.highlight(item.name);
                a.appendChild(text);
                li.appendChild(a);
                this.$list.appendChild(li);
            });
            if (this.term !== '') {
                const icons = iconFilter(this.icons, this.term, 5);
                if (icons.length) {
                    var li = document.createElement('li');
                    li.innerText = 'Icons';
                    li.classList.add('section');
                    this.$list.appendChild(li);
                }
                icons.forEach((icon) => {
                    var li = document.createElement('li');
                    var a = document.createElement('a');
                    a.href = `/icon/${icon.name}`;
                    var additional = icon.aliases.reduce((arr, icon) => {
                        if (icon.match) {
                            arr.push(icon.name || '');
                        }
                        return arr;
                    }, []);
                    var aliasText = '';
                    if (additional.length) {
                        aliasText = ` (${additional.join(', ')})`;
                    }
                    const text = this.highlight(`${icon.name}${aliasText}`);
                    a.appendChild(text);
                    li.appendChild(a);
                    this.$list.appendChild(li);
                });
                if (icons.length === 5) {
                    var li = document.createElement('li');
                    var a = document.createElement('a');
                    a.href = `/icons?search=${this.term}`;
                    a.innerText = `Show results for "${this.term}"`;
                    li.appendChild(a);
                    this.$list.appendChild(li);
                }
            }
        }
        render() {
        }
    };
    __decorate([
        Prop()
    ], MdiSearch.prototype, "path", void 0);
    __decorate([
        Prop()
    ], MdiSearch.prototype, "items", void 0);
    __decorate([
        Prop()
    ], MdiSearch.prototype, "icons", void 0);
    __decorate([
        Part()
    ], MdiSearch.prototype, "$menu", void 0);
    __decorate([
        Part()
    ], MdiSearch.prototype, "$input", void 0);
    __decorate([
        Part()
    ], MdiSearch.prototype, "$list", void 0);
    MdiSearch = __decorate([
        Component({
            selector: 'mdi-search',
            style: style$1,
            template: template$1
        })
    ], MdiSearch);
    var MdiSearch$1 = MdiSearch;

    return MdiSearch$1;

}());
//# sourceMappingURL=mdiSearch.js.map
