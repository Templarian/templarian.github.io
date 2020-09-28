var mdiInputUserSelect = (function () {
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

    var template$1 = "<div part=\"wrapper\">\n  <button part=\"select\">\n    <img part=\"selectedAvatar\" />\n    <span part=\"selectedName\">First Last</span>\n    <svg part=\"githubIcon\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z\" /></svg>\n    <span part=\"selectedGithub\">GitHub</span>\n    <svg part=\"countIcon\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M11,13.5V21.5H3V13.5H11M12,2L17.5,11H6.5L12,2M17.5,13C20,13 22,15 22,17.5C22,20 20,22 17.5,22C15,22 13,20 13,17.5C13,15 15,13 17.5,13Z\" /></svg>\n    <span part=\"selectedCount\">9999</span>\n    <svg part=\"loading\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z\" /></svg>\n    <span part=\"loadingText\">Loading...</span>\n    <svg part=\"chevron\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z\" /></svg>\n    <span part=\"noData\">Empty Users List</span>\n    <span part=\"noSelection\">Select a User</span>\n  </button>\n  <div part=\"dropdownContainer\">\n    <div part=\"dropdown\"></div>\n  </div>\n</div>";

    var style$1 = ":host {\n  display: block;\n}\n\n[part=\"wrapper\"] {\n  display: grid;\n  grid-template-rows: auto 0;\n  grid-template-columns: 100%;\n}\n\n[part=\"select\"] {\n  display: grid;\n  grid-template-columns: 3.5rem 1.75rem auto 2.75rem 1fr 1.5rem;\n  grid-template-rows: 1.5rem 1.5rem;\n  grid-row: 1;\n  grid-column: 1;\n  border: 1px solid var(--mdi-input-select-border-color, #453C4F);\n  border-radius: 0.25rem;\n  padding: 0.5rem 0.5rem 0.5rem 0.75rem;\n  width: 100%;\n  font-size: 1rem;\n  outline: 0;\n  text-align: left;\n  background: var(--mdi-input-select-background, #fff);\n}\n\n[part=\"select\"]:focus {\n  box-shadow: 0 0 0 3px rgba(79, 143, 249, 0.5);\n}\n\n[part=\"select\"]:disabled {\n  border: 1px solid var(--mdi-input-select-disabled-border-color, rgba(69, 60, 79, 0.6));\n  color: var(--mdi-input-select-disabled-color, rgba(69, 60, 79, 0.6));\n}\n\n[part=\"chevron\"] {\n  grid-row: 1 / span 2;\n  grid-column: 6;\n  pointer-events: none;\n  width: 1.5rem;\n  height: 1.5rem;\n  align-self: center;\n}\n\n.githubIcon,\n[part=\"githubIcon\"] {\n  grid-row: 2;\n  grid-column: 2;\n  width: 1.5rem;\n  height: 1.5rem;\n  align-self: center;\n  color: var(--mdi-input-select-border-color, #453C4F);\n}\n\n.avatar,\n[part=\"selectedAvatar\"] {\n  grid-row: 1 / span 2;\n  grid-column: 1;\n  width: 3rem;\n  height: 3rem;\n  border-radius: 50%;\n  border: 1px solid var(--mdi-input-select-border-color, #453C4F);\n}\n\n.name,\n[part=\"selectedName\"] {\n  grid-row: 1;\n  grid-column: 2 / span 4;\n  align-self: center;\n}\n\n.github,\n[part=\"selectedGithub\"] {\n  grid-row: 2;\n  grid-column: 3;\n  align-self: center;\n}\n\n.countIcon,\n[part=\"countIcon\"] {\n  grid-row: 2;\n  grid-column: 4;\n  width: 1.5rem;\n  height: 1.5rem;\n  align-self: center;\n  margin-left: 1rem;\n  color: var(--mdi-input-select-border-color, #453C4F);\n}\n\n.iconCount,\n[part=\"selectedCount\"] {\n  grid-row: 2;\n  grid-column: 5;\n  align-self: center;\n  font-weight: bold;\n}\n\n[part=\"dropdown\"].open {\n  display: flex;\n}\n\n[part=\"dropdown\"] {\n  grid-row: 2;\n  grid-column: 1;\n  display: none;\n  flex-direction: column;\n  border: 1px solid var(--mdi-input-select-border-color, #453C4F);\n  border-radius: 0.25rem;\n  background: #fff;\n  z-index: 1;\n  position: absolute;\n  max-height: 16.5rem;\n  overflow: auto;\n}\n\n[part=\"dropdown\"] button {\n  display: grid;\n  grid-template-columns: 3.5rem 1.75rem auto 2.75rem 1fr;\n  grid-template-rows: auto;\n  border: 0;\n  padding: 0.5rem 0.75rem;\n  text-align: left;\n  background: #fff;\n}\n\n[part=\"dropdown\"] button:hover,\n[part=\"dropdown\"] button:focus {\n  color: #fff;\n  background: #1E90FF;\n}\n\n[part=\"dropdown\"] button:hover .githubIcon,\n[part=\"dropdown\"] button:hover .countIcon,\n[part=\"dropdown\"] button:focus .githubIcon,\n[part=\"dropdown\"] button:focus .countIcon {\n  color: #fff;\n}\n\n[part=\"loading\"] {\n  width: 3rem;\n  height: 3rem;\n  animation: spin 2s infinite linear;\n  grid-row: 1 / span 2;;\n  grid-column: 1;\n  pointer-events: none;\n  align-self: center;\n}\n\n@keyframes spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(359deg);\n  }\n}\n\n[part=\"loadingText\"] {\n  grid-row: 1 / span 2;\n  grid-column: 2 / span 3;\n  align-self: center;\n}\n\n[part=\"noData\"] {\n  grid-row: 1 / span 2;\n  grid-column: 1 / span 4;\n  align-self: center;\n}\n\n[part=\"noSelection\"] {\n  grid-row: 1 / span 2;\n  grid-column: 1 / span 4;\n  align-self: center;\n}";

    function createIcon(d, className) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', d);
        path.setAttribute('fill', 'currentColor');
        svg.appendChild(path);
        svg.classList.add(className);
        return svg;
    }
    const mdiGithub = 'M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z';
    const mdiShape = 'M11,13.5V21.5H3V13.5H11M12,2L17.5,11H6.5L12,2M17.5,13C20,13 22,15 22,17.5C22,20 20,22 17.5,22C15,22 13,20 13,17.5C13,15 15,13 17.5,13Z';
    let MdiInputUserSelect = class MdiInputUserSelect extends HTMLElement {
        constructor() {
            super(...arguments);
            this.options = null;
            this.value = null;
            this.clear = false;
            this.noDataText = 'Empty Users List';
            this.noSelectionText = 'Select a User';
            this.isOpen = false;
            this.optionsElements = [];
            this.index = -1;
        }
        connectedCallback() {
            this.$select.addEventListener('click', this.handleClick.bind(this));
            this.addEventListener('keydown', this.handleKeys.bind(this));
        }
        close() {
            this.isOpen = false;
            this.$dropdown.classList.remove('open');
            document.removeEventListener('mousedown', this.handleCloseBind);
        }
        handleClose(e) {
            const target = e.target;
            if (target.nodeName === this.nodeName && target.isOpen) ;
            else {
                this.close();
            }
        }
        handleClick() {
            this.isOpen = !this.isOpen;
            this.$dropdown.classList.toggle('open', this.isOpen);
            this.handleCloseBind = this.handleClose.bind(this);
            document.addEventListener('mousedown', this.handleCloseBind);
            this.focusSelected();
        }
        focusSelected() {
            var _a;
            const find = (_a = this.options) === null || _a === void 0 ? void 0 : _a.findIndex((value) => value === this.value);
            if (find && find !== -1) {
                this.optionsElements[find].focus();
                this.index = find;
            }
            else if (this.optionsElements.length) {
                this.optionsElements[0].focus();
            }
        }
        handleSelect(e) {
            var _a;
            const { id } = e.currentTarget.dataset;
            const selected = (_a = this.options) === null || _a === void 0 ? void 0 : _a.find(d => d.id === id);
            this.value = selected || null;
            this.dispatchEvent(new CustomEvent('change'));
            this.close();
        }
        loadingMode() {
            this.$selectedAvatar.style.display = 'none';
            this.$selectedName.style.display = 'none';
            this.$githubIcon.style.display = 'none';
            this.$selectedGithub.style.display = 'none';
            this.$countIcon.style.display = 'none';
            this.$selectedCount.style.display = 'none';
            this.$noData.style.display = 'none';
            this.$noSelection.style.display = 'none';
            this.$loading.style.display = 'flex';
            this.$loadingText.style.display = 'initial';
            this.$select.disabled = true;
        }
        noDataMode() {
            this.$selectedAvatar.style.display = 'none';
            this.$selectedName.style.display = 'none';
            this.$githubIcon.style.display = 'none';
            this.$selectedGithub.style.display = 'none';
            this.$countIcon.style.display = 'none';
            this.$selectedCount.style.display = 'none';
            this.$noData.style.display = 'initial';
            this.$noSelection.style.display = 'none';
            this.$loading.style.display = 'none';
            this.$loadingText.style.display = 'none';
            this.$select.disabled = true;
        }
        noSelectionMode() {
            this.$selectedAvatar.style.display = 'none';
            this.$selectedName.style.display = 'none';
            this.$githubIcon.style.display = 'none';
            this.$selectedGithub.style.display = 'none';
            this.$countIcon.style.display = 'none';
            this.$selectedCount.style.display = 'none';
            this.$noData.style.display = 'none';
            this.$noSelection.style.display = 'initial';
            this.$loading.style.display = 'none';
            this.$loadingText.style.display = 'none';
            this.$select.disabled = false;
        }
        selectMode() {
            this.$selectedAvatar.style.display = 'initial';
            this.$selectedName.style.display = 'initial';
            this.$githubIcon.style.display = 'initial';
            this.$selectedGithub.style.display = 'initial';
            this.$countIcon.style.display = 'initial';
            this.$selectedCount.style.display = 'initial';
            this.$noData.style.display = 'none';
            this.$noSelection.style.display = 'none';
            this.$loading.style.display = 'none';
            this.$loadingText.style.display = 'none';
            this.$select.disabled = false;
        }
        render(changes) {
            if (changes.options) {
                if (this.options === null) {
                    this.loadingMode();
                }
                else if (this.options.length === 0) {
                    this.noDataMode();
                }
                else {
                    this.selectMode();
                    this.calculateMinWidth();
                    this.optionsElements = this.options.map(o => {
                        const button = document.createElement('button');
                        const img = document.createElement('img');
                        img.src = `${o.base64}`;
                        img.classList.add('avatar');
                        button.appendChild(img);
                        const spanName = document.createElement('span');
                        spanName.innerText = `${o.name}`;
                        spanName.classList.add('name');
                        button.appendChild(spanName);
                        const spanGitHub = document.createElement('span');
                        spanGitHub.innerText = `${o.github}`;
                        spanGitHub.classList.add('github');
                        button.appendChild(spanGitHub);
                        const spanIconCount = document.createElement('span');
                        spanIconCount.innerText = `${o.iconCount}`;
                        spanIconCount.classList.add('iconCount');
                        button.appendChild(spanIconCount);
                        button.dataset.id = `${o.id}`;
                        button.appendChild(createIcon(mdiGithub, 'githubIcon'));
                        button.appendChild(createIcon(mdiShape, 'countIcon'));
                        button.addEventListener('click', this.handleSelect.bind(this));
                        this.$dropdown.appendChild(button);
                        return button;
                    });
                    if (this.value === null) {
                        this.noSelectionMode();
                    }
                }
                //if (this.$select.value !== this.value) {
                //  this.$select.value = this.value;
                //}
            }
            if (changes.value) {
                if (changes.value && this.value) {
                    this.$selectedAvatar.src = this.value.base64 || '';
                    this.$selectedCount.innerText = `${this.value.iconCount}`;
                    this.$selectedName.innerText = `${this.value.name}`;
                    this.$selectedGithub.innerText = `${this.value.github}`;
                    this.selectMode();
                }
            }
            if (changes.noDataText) {
                this.$noData.innerText = this.noDataText;
            }
            if (changes.noSelectionText) {
                this.$noSelection.innerText = this.noSelectionText;
            }
        }
        calculateMinWidth() {
            const { width } = this.$select.getBoundingClientRect();
            this.$dropdown.style.minWidth = `${width - 2}px`;
        }
        handleKeys(e) {
            const items = this.optionsElements;
            let newIndex = this.index;
            switch (e.which) {
                case 38: // up
                    if (newIndex === 0) {
                        newIndex = items.length - 1;
                    }
                    else if (newIndex >= 0) {
                        newIndex -= 1;
                    }
                    break;
                case 40: // down
                    if (newIndex < items.length - 1) {
                        newIndex += 1;
                    }
                    else if (newIndex === items.length - 1) {
                        newIndex = 0;
                    }
                    break;
                case 9: // tab
                case 27: // close
                    this.close();
                    break;
            }
            if (newIndex != this.index) {
                this.index = newIndex;
                items[newIndex].focus();
                e.preventDefault();
            }
        }
    };
    __decorate([
        Prop()
    ], MdiInputUserSelect.prototype, "options", void 0);
    __decorate([
        Prop()
    ], MdiInputUserSelect.prototype, "value", void 0);
    __decorate([
        Prop()
    ], MdiInputUserSelect.prototype, "clear", void 0);
    __decorate([
        Prop()
    ], MdiInputUserSelect.prototype, "noDataText", void 0);
    __decorate([
        Prop()
    ], MdiInputUserSelect.prototype, "noSelectionText", void 0);
    __decorate([
        Part()
    ], MdiInputUserSelect.prototype, "$select", void 0);
    __decorate([
        Part()
    ], MdiInputUserSelect.prototype, "$selectedAvatar", void 0);
    __decorate([
        Part()
    ], MdiInputUserSelect.prototype, "$selectedName", void 0);
    __decorate([
        Part()
    ], MdiInputUserSelect.prototype, "$githubIcon", void 0);
    __decorate([
        Part()
    ], MdiInputUserSelect.prototype, "$selectedGithub", void 0);
    __decorate([
        Part()
    ], MdiInputUserSelect.prototype, "$countIcon", void 0);
    __decorate([
        Part()
    ], MdiInputUserSelect.prototype, "$selectedCount", void 0);
    __decorate([
        Part()
    ], MdiInputUserSelect.prototype, "$dropdown", void 0);
    __decorate([
        Part()
    ], MdiInputUserSelect.prototype, "$loading", void 0);
    __decorate([
        Part()
    ], MdiInputUserSelect.prototype, "$loadingText", void 0);
    __decorate([
        Part()
    ], MdiInputUserSelect.prototype, "$noData", void 0);
    __decorate([
        Part()
    ], MdiInputUserSelect.prototype, "$noSelection", void 0);
    MdiInputUserSelect = __decorate([
        Component({
            selector: 'mdi-input-user-select',
            style: style$1,
            template: template$1
        })
    ], MdiInputUserSelect);
    var MdiInputUserSelect$1 = MdiInputUserSelect;

    return MdiInputUserSelect$1;

}());
//# sourceMappingURL=mdiInputUserSelect.js.map
