var mdiInputFileLocal = (function () {
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
        if (config === void 0) { config = {}; }
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
                if (!this[init] && !config.template) {
                    if (config.useShadow === false) ;
                    else {
                        this.attachShadow({ mode: 'open' });
                    }
                }
                else if (!this[init] && config.template) {
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
                    throw new Error('You need to pass a template for an extended element.');
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
            if (config.selector && !window.customElements.get(config.selector)) {
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

    var template$1 = "<label part=\"label\">\n  <input type=\"file\" part=\"file\" />\n  <svg part=\"icon\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z\" /></svg>\n  <span part=\"text\">Upload a File...</span>\n</label>";

    var style$1 = ":host {\n  display: block;\n}\n\n[part=\"label\"] {\n  display: grid;\n  grid-template-columns: 1.5rem auto;\n  grid-template-rows: auto;\n  font-family: var(--mdi-font-family);\n  font-size: 1rem;\n  line-height: 1.5rem;\n  border: 1px solid var(--mdi-button-border-color, #453C4F);\n  background-color: var(--mdi-button-background-color, #fff);\n  color: var(--mdi-button-color, #453C4F);\n  padding: var(--mdi-button-padding, 0.25rem 0.5rem);\n  border-radius: 0.25rem;\n  outline: none;\n  --mdi-icon-color: var(--mdi-button-color, #453C4F);\n}\n\n[part=\"label\"]:hover {\n  border: 1px solid var(--mdi-button-hover-border-color, #453C4F);\n  background-color: var(--mdi-button-hover-background-color, #453C4F);\n  color: var(--mdi-button-hover-color, #fff);\n  --mdi-icon-color: var(--mdi-button-hover-color, #fff);\n}\n\n[part=\"label\"]:active {\n  box-shadow: 0 1px 0.25rem rgba(0, 0, 0, 0.5) inset;\n  position: relative;\n}\n\n[part=\"label\"]:focus {\n  position: relative;\n}\n\n[part=\"label\"]:active::before {\n  content: '';\n  position: absolute;\n  top: -1px;\n  right: -1px;\n  bottom: -1px;\n  left: -1px;\n  border-radius: 0.25rem;\n  box-shadow: 0 0 0 3px var(--mdi-search-focus-glow, rgb(79, 143, 249, 0.6));\n}\n\n[part=\"label\"]:focus::before {\n  content: '';\n  position: absolute;\n  top: -1px;\n  right: -1px;\n  bottom: -1px;\n  left: -1px;\n  border-radius: 0.25rem;\n  box-shadow: 0 0 0 3px var(--mdi-search-focus-glow, rgb(79, 143, 249, 0.5));\n}\n\n[part=\"file\"] {\n  width: 100%;\n  border: 0;\n  outline: 0;\n  height: 1.5rem;\n  grid-row: 1;\n  grid-column: 1 / span 2;\n  visibility: hidden;\n}\n\n[part=\"icon\"] {\n  grid-row: 1;\n  grid-column: 1;\n  transform: translate(-0.25rem, 0.075rem);\n  pointer-events: none;\n}\n\n[part=\"text\"] {\n  grid-row: 1;\n  grid-column: 2;\n  pointer-events: none;\n}";

    let MdiInputFileLocal = class MdiInputFileLocal extends HTMLElement {
        constructor() {
            super(...arguments);
            this.acceptsFileType = '';
        }
        connectedCallback() {
            this.$file.addEventListener('change', () => {
                if (this.$file.files === null || this.$file.files.length === 0) {
                    alert('Error : No file selected');
                    return;
                }
                // first file selected by user
                var file = this.$file.files[0];
                // perform validation on file type & size if required
                if (this.acceptsFileType) {
                    var types = this.acceptsFileType.split(',').join('|');
                    var regex = new RegExp(`(${types})$`, 'i');
                    if (file.name.match(regex) === null) {
                        alert(`${this.acceptsFileType} file only`);
                        return;
                    }
                }
                // read the file
                var reader = new FileReader();
                // file reading started
                reader.addEventListener('loadstart', function () {
                    console.log('File reading started');
                });
                // file reading finished successfully
                reader.addEventListener('load', (e) => {
                    // contents of file in variable
                    var text = e.target.result;
                    console.log(text);
                    this.dispatchEvent(new CustomEvent('change', {
                        detail: {
                            value: text,
                            name: file.name
                        }
                    }));
                });
                // file reading failed
                reader.addEventListener('error', function () {
                    alert('Error : Failed to read file');
                });
                // file read progress
                reader.addEventListener('progress', function (e) {
                    if (e.lengthComputable == true) {
                        var percent_read = Math.floor((e.loaded / e.total) * 100);
                        console.log(percent_read + '% read');
                    }
                });
                // read as text file
                reader.readAsText(file);
            });
        }
        render(changes) {
        }
    };
    __decorate([
        Prop()
    ], MdiInputFileLocal.prototype, "acceptsFileType", void 0);
    __decorate([
        Part()
    ], MdiInputFileLocal.prototype, "$file", void 0);
    MdiInputFileLocal = __decorate([
        Component({
            selector: 'mdi-input-file-local',
            style: style$1,
            template: template$1
        })
    ], MdiInputFileLocal);
    var MdiInputFileLocal$1 = MdiInputFileLocal;

    return MdiInputFileLocal$1;

}());
//# sourceMappingURL=mdiInputFileLocal.js.map
