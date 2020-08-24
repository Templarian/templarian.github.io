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

    var template$1 = "<div part=\"wrapper\">\n  <button part=\"select\">\n    <img part=\"selectedAvatar\" />\n    <span part=\"selectedName\">First Last</span>\n    <svg part=\"githubIcon\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z\" /></svg>\n    <span part=\"selectedGithub\">GitHub</span>\n    <svg part=\"countIcon\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M11,13.5V21.5H3V13.5H11M12,2L17.5,11H6.5L12,2M17.5,13C20,13 22,15 22,17.5C22,20 20,22 17.5,22C15,22 13,20 13,17.5C13,15 15,13 17.5,13Z\" /></svg>\n    <span part=\"selectedCount\">9999</span>\n    <svg part=\"loading\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z\" /></svg>\n    <span part=\"loadingText\">Loading...</span>\n    <svg part=\"chevron\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z\" /></svg>\n  </button>\n  <div part=\"dropdownContainer\">\n    <div part=\"dropdown\"></div>\n  </div>\n</div>";

    var style$1 = "[part=\"wrapper\"] {\n  display: grid;\n  grid-template-rows: auto 0;\n  grid-template-columns: 100%;\n}\n\n[part=\"select\"] {\n  display: grid;\n  grid-template-columns: 3.5rem 1.75rem auto 2.75rem 1fr 1.5rem;\n  grid-template-rows: 1.5rem 1.5rem;\n  grid-row: 1;\n  grid-column: 1;\n  border: 1px solid var(--mdi-input-select-border-color, #453C4F);\n  border-radius: 0.25rem;\n  padding: 0.5rem 0.5rem 0.5rem 0.75rem;\n  width: 100%;\n  font-size: 1rem;\n  outline: 0;\n  text-align: left;\n  background: var(--mdi-input-select-background, #fff);\n}\n\n[part=\"select\"]:focus {\n  box-shadow: 0 0 0 3px rgba(79, 143, 249, 0.5);\n}\n\n[part=\"select\"]:disabled {\n  border: 1px solid var(--mdi-input-select-disabled-border-color, rgba(69, 60, 79, 0.6));\n  color: var(--mdi-input-select-disabled-color, rgba(69, 60, 79, 0.6));\n}\n\n[part=\"chevron\"] {\n  grid-row: 1 / span 2;\n  grid-column: 6;\n  pointer-events: none;\n  width: 1.5rem;\n  height: 1.5rem;\n  align-self: center;\n}\n\n.githubIcon,\n[part=\"githubIcon\"] {\n  grid-row: 2;\n  grid-column: 2;\n  width: 1.5rem;\n  height: 1.5rem;\n  align-self: center;\n  color: var(--mdi-input-select-border-color, #453C4F);\n}\n\n.avatar,\n[part=\"selectedAvatar\"] {\n  grid-row: 1 / span 2;\n  grid-column: 1;\n  width: 3rem;\n  height: 3rem;\n  border-radius: 50%;\n  border: 1px solid var(--mdi-input-select-border-color, #453C4F);\n}\n\n.name,\n[part=\"selectedName\"] {\n  grid-row: 1;\n  grid-column: 2 / span 4;\n  align-self: center;\n}\n\n.github,\n[part=\"selectedGithub\"] {\n  grid-row: 2;\n  grid-column: 3;\n  align-self: center;\n}\n\n.countIcon,\n[part=\"countIcon\"] {\n  grid-row: 2;\n  grid-column: 4;\n  width: 1.5rem;\n  height: 1.5rem;\n  align-self: center;\n  margin-left: 1rem;\n  color: var(--mdi-input-select-border-color, #453C4F);\n}\n\n.iconCount,\n[part=\"selectedCount\"] {\n  grid-row: 2;\n  grid-column: 5;\n  align-self: center;\n  font-weight: bold;\n}\n\n[part=\"dropdown\"].open {\n  display: flex;\n}\n\n[part=\"dropdown\"] {\n  grid-row: 2;\n  grid-column: 1;\n  display: none;\n  flex-direction: column;\n  border: 1px solid var(--mdi-input-select-border-color, #453C4F);\n  border-radius: 0.25rem;\n  background: #fff;\n  z-index: 1;\n  position: absolute;\n}\n\n[part=\"dropdown\"] button {\n  display: grid;\n  grid-template-columns: 3.5rem 1.75rem auto 2.75rem 1fr;\n  grid-template-rows: auto;\n  border: 0;\n  padding: 0.5rem 0.75rem;\n  text-align: left;\n  background: #fff;\n}\n\n[part=\"dropdown\"] button:hover {\n  color: #fff;\n  background: #1E90FF;\n}\n\n[part=\"dropdown\"] button:hover .githubIcon,\n[part=\"dropdown\"] button:hover .countIcon {\n  color: #fff;\n}\n\n[part=\"dropdown\"] button:first-child {\n  border-radius: 0.25rem 0.25rem 0 0;\n}\n\n[part=\"dropdown\"] button:last-child {\n  border-radius: 0 0 0.25rem 0.25rem;\n}\n\n[part=\"loading\"] {\n  width: 3rem;\n  height: 3rem;\n  animation: spin 2s infinite linear;\n  grid-row: 1 / span 2;;\n  grid-column: 1;\n  pointer-events: none;\n  align-self: center;\n}\n\n@keyframes spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(359deg);\n  }\n}\n\n[part=\"loadingText\"] {\n  grid-row: 1 / span 2;\n  grid-column: 2 / span 3;\n  align-self: center;\n}";

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
    let MdiInputSelect = class MdiInputSelect extends HTMLElement {
        constructor() {
            super(...arguments);
            this.options = null;
            this.isOpen = false;
        }
        connectedCallback() {
            this.$select.addEventListener('click', this.handleClick.bind(this));
        }
        handleClick() {
            this.isOpen = !this.isOpen;
            this.$dropdown.classList.toggle('open', this.isOpen);
        }
        loadingMode() {
            this.$selectedAvatar.style.display = 'none';
            this.$selectedName.style.display = 'none';
            this.$githubIcon.style.display = 'none';
            this.$selectedGithub.style.display = 'none';
            this.$countIcon.style.display = 'none';
            this.$selectedCount.style.display = 'none';
            this.$loading.style.display = 'flex';
            this.$loadingText.style.display = 'initial';
            this.$select.disabled = true;
        }
        selectMode() {
            this.$selectedAvatar.style.display = 'initial';
            this.$selectedName.style.display = 'initial';
            this.$githubIcon.style.display = 'initial';
            this.$selectedGithub.style.display = 'initial';
            this.$countIcon.style.display = 'initial';
            this.$selectedCount.style.display = 'initial';
            this.$loading.style.display = 'none';
            this.$loadingText.style.display = 'none';
            this.$select.disabled = false;
        }
        render(changes) {
            if (changes.options) {
                if (this.options === null) {
                    this.loadingMode();
                }
                else {
                    this.selectMode();
                    this.options.forEach(o => {
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
                        this.$dropdown.appendChild(button);
                    });
                }
                //if (this.$select.value !== this.value) {
                //  this.$select.value = this.value;
                //}
            }
            if (changes.value) {
                if (changes.value && this.value) {
                    this.$selectedAvatar.src = this.value.base64 || '';
                }
            }
        }
    };
    __decorate([
        Prop()
    ], MdiInputSelect.prototype, "options", void 0);
    __decorate([
        Prop()
    ], MdiInputSelect.prototype, "value", void 0);
    __decorate([
        Part()
    ], MdiInputSelect.prototype, "$select", void 0);
    __decorate([
        Part()
    ], MdiInputSelect.prototype, "$selectedAvatar", void 0);
    __decorate([
        Part()
    ], MdiInputSelect.prototype, "$selectedName", void 0);
    __decorate([
        Part()
    ], MdiInputSelect.prototype, "$githubIcon", void 0);
    __decorate([
        Part()
    ], MdiInputSelect.prototype, "$selectedGithub", void 0);
    __decorate([
        Part()
    ], MdiInputSelect.prototype, "$countIcon", void 0);
    __decorate([
        Part()
    ], MdiInputSelect.prototype, "$selectedCount", void 0);
    __decorate([
        Part()
    ], MdiInputSelect.prototype, "$dropdown", void 0);
    __decorate([
        Part()
    ], MdiInputSelect.prototype, "$loading", void 0);
    __decorate([
        Part()
    ], MdiInputSelect.prototype, "$loadingText", void 0);
    MdiInputSelect = __decorate([
        Component({
            selector: 'mdi-input-user-select',
            style: style$1,
            template: template$1
        })
    ], MdiInputSelect);
    var MdiInputSelect$1 = MdiInputSelect;

    return MdiInputSelect$1;

}());
//# sourceMappingURL=mdiInputUserSelect.js.map
