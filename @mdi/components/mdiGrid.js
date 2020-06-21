var mdiGrid = (function () {
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

    function uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    const ADD = 'mditoastadd';
    const REMOVE = 'mditoastremove';
    function addToast(config) {
        config.key = config.key || uuid();
        const event = new CustomEvent(ADD, {
            detail: config
        });
        document.body.dispatchEvent(event);
        setTimeout(() => {
            removeToast(config.key);
        }, config.seconds * 1000);
        return config.key;
    }
    function removeToast(key) {
        const event = new CustomEvent(REMOVE, {
            detail: { key }
        });
        document.body.dispatchEvent(event);
    }
    function addInfoToast(message, seconds = 3) {
        const type = 'info';
        return addToast({ type, message, seconds });
    }

    const debounce = (func, waitFor) => {
        let timeout;
        return (...args) => new Promise(resolve => {
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(() => resolve(func(...args)), waitFor);
        });
    };
    const copyText = (text) => {
        var copyFrom = document.createElement('textarea');
        copyFrom.setAttribute("style", "position:fixed;opacity:0;top:100px;left:100px;");
        copyFrom.value = text;
        document.body.appendChild(copyFrom);
        copyFrom.select();
        document.execCommand('copy');
        setTimeout(function () {
            document.body.removeChild(copyFrom);
        }, 1500);
    };

    function getCopySvgInline(icon) {
        return `<svg viewBox="0 0 24 24"><path fill="currentColor" d="${icon.data}"/></svg>`;
    }

    var template$1 = "<mdi-scroll part=\"scroll\">\n  <div part=\"grid\"></div>\n</mdi-scroll>\n<div part=\"tooltip\">\n  <span part=\"tooltipText\"></span>\n  <div part=\"tooltipArrow\"></div>\n</div>\n<div part=\"contextMenu\">\n  <a part=\"newTab\" href=\"\">Open icon in New Tab</a>\n  <button part=\"copyIconName\">Copy Icon Name</button>\n  <div class=\"section\">Download PNG</div>\n  <div class=\"group\">\n    <button part=\"png24\">24</button>\n    <button part=\"png36\">36</button>\n    <button part=\"png48\">48</button>\n    <button part=\"png96\">96</button>\n  </div>\n  <div class=\"row\" style=\"margin-top: 0.25rem;\">\n    <div class=\"group\">\n      <button part=\"pngBlack\"><span class=\"black\"></span></button>\n      <button part=\"pngWhite\"><span class=\"white\"></span></button>\n      <button part=\"pngColor\">\n        <svg viewBox=\"0 0 24 24\">\n          <path fill=\"#fff\" d=\"M19.35,11.72L17.22,13.85L15.81,12.43L8.1,20.14L3.5,22L2,20.5L3.86,15.9L11.57,8.19L10.15,6.78L12.28,4.65L19.35,11.72M16.76,3C17.93,1.83 19.83,1.83 21,3C22.17,4.17 22.17,6.07 21,7.24L19.08,9.16L14.84,4.92L16.76,3M5.56,17.03L4.5,19.5L6.97,18.44L14.4,11L13,9.6L5.56,17.03Z\"/>\n          <path fill=\"currentColor\" d=\"M12.97 8L15.8 10.85L7.67 19L3.71 20.68L3.15 20.11L4.84 16.15L12.97 8Z\"/>\n        </svg>\n      </button>\n    </div>\n    <div class=\"group\">\n      <button part=\"pngDownload\" class=\"download\">\n        PNG\n        <svg viewBox=\"0 0 24 24\">\n          <path fill=\"currentColor\" d=\"M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z\"/>\n        </svg>\n      </button>\n    </div>\n  </div>\n  <div class=\"section\">SVG</div>\n  <div class=\"row\" style=\"margin-bottom: 0.25rem;\">\n    <div class=\"group\">\n      <button part=\"svgBlack\" class=\"active\"><span class=\"black\"></span></button>\n      <button part=\"svgWhite\"><span class=\"white\"></span></button>\n      <button part=\"svgColor\">\n        <svg viewBox=\"0 0 24 24\">\n          <path fill=\"#fff\" d=\"M19.35,11.72L17.22,13.85L15.81,12.43L8.1,20.14L3.5,22L2,20.5L3.86,15.9L11.57,8.19L10.15,6.78L12.28,4.65L19.35,11.72M16.76,3C17.93,1.83 19.83,1.83 21,3C22.17,4.17 22.17,6.07 21,7.24L19.08,9.16L14.84,4.92L16.76,3M5.56,17.03L4.5,19.5L6.97,18.44L14.4,11L13,9.6L5.56,17.03Z\"/>\n          <path fill=\"currentColor\" d=\"M12.97 8L15.8 10.85L7.67 19L3.71 20.68L3.15 20.11L4.84 16.15L12.97 8Z\"/>\n        </svg>\n      </button>\n    </div>\n    <div class=\"group\">\n      <button part=\"svgDownload\" class=\"download\">\n        SVG\n        <svg viewBox=\"0 0 24 24\">\n          <path fill=\"currentColor\" d=\"M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z\"/>\n        </svg>\n      </button>\n    </div>\n  </div>\n  <button part=\"copySvgInline\">Copy HTML SVG Inline</button>\n  <button part=\"copySvgFile\">Copy SVG File Contents</button>\n  <button part=\"copySvgPath\">Copy SVG Path Data</button>\n  <div class=\"section\">Desktop Font</div>\n  <button part=\"copyUnicode\">Copy Unicode Character</button>\n  <button part=\"copyCodepoint\">Copy Codepoint</button>\n  <div class=\"divider\"></div>\n  <button part=\"copyPreview\">Copy GitHub Preview</button>\n  <div part=\"color\">\n    <mdi-input-hex-rgb part=\"colorHexRgb\"></mdi-input-hex-rgb>\n    <mdi-color part=\"colorPicker\"></mdi-color>\n  </div>\n</div>";

    var style$1 = "* {\n  font-family: var(--mdi-font-family);\n}\n\n:host {\n  display: block;\n}\n\n[part~=grid] {\n  position: relative;\n}\n\n[part~=grid] > button {\n  border: 0;\n  background: transparent;\n  padding: 0.625rem;\n  outline: none;\n  width: 2.75rem;\n  height: 2.75rem;\n  position: absolute;\n  left: 0;\n  top: 0;\n  border: 0;\n  border-radius: 0.25rem;\n}\n\n[part~=grid] > button:hover {\n  background: rgba(0, 0, 0, 0.1);\n}\n\n[part~=grid] > button:active {\n  background: rgba(0, 0, 0, 0.15);\n  box-shadow: 0 0.0125rem 0.25rem rgba(0, 0, 0, 0.2) inset;\n}\n\n[part~=grid] > button > svg {\n  fill: #453C4F;\n  width: 1.5rem;\n  height: 1.5rem;\n}\n\n[part~=grid] > button > svg {\n  fill: #453C4F;\n}\n\n[part~=tooltip] {\n  will-change: transform;\n  opacity: 0;\n  transition: opacity 0.2s ease-in;\n  pointer-events: none;\n  visibility: hidden;\n}\n\n[part~=tooltip].visible {\n  visibility: visible;\n  opacity: 1;\n}\n\n[part~=tooltipText] {\n  background: #737E9E;\n  border-radius: 0.25rem;\n  color: #FFF;\n  padding: 0.15rem 0.5rem 0.3rem 0.5rem;\n  white-space: nowrap;\n}\n\n[part~=tooltipArrow] {\n  left: 18px;\n  bottom: -26px;\n}\n\n[part~=tooltipArrow],\n[part~=tooltipArrow]::before {\n  position: absolute;\n  width: 10px;\n  height: 10px;\n}\n\n[part~=tooltipArrow]::before {\n  content: '';\n  transform: rotate(45deg);\n  background: #737E9E;\n}\n\n[part~=grid]::-webkit-scrollbar {\n  width: 1em;\n}\n\n[part~=grid]::-webkit-scrollbar-track {\n  box-shadow: inset 0 0 6px rgba(0,0,0,0.2);\n  border-radius: 0.25rem;\n}\n\n[part~=grid]::-webkit-scrollbar-thumb {\n  background-color: #453C4F;\n  outline: 1px solid slategrey;\n  border-radius: 0.25rem;\n}\n\n[part~=contextMenu] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  background: #737E9E;\n  border-radius: 0.25rem;\n  width: 12rem;\n  display: flex;\n  flex-direction: column;\n  padding: 0.25rem 0;\n  visibility: hidden;\n  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.3);\n}\n\n[part~=contextMenu] > div.section {\n  color: #FFF;\n  font-size: 0.875rem;\n  padding: 0.25rem 0.5rem;\n  cursor: default;\n  font-weight: bold;\n}\n\n[part~=contextMenu] > div.section:not(:first-child) {\n  border-top: 1px solid rgba(255, 255, 255, 0.3);\n  margin-top: 0.5rem;\n}\n\n[part~=contextMenu] > div.group {\n  margin: 0 0.5rem;\n  border: 1px solid rgba(255, 255, 255, 0.2);\n  border-radius: 0.25rem;\n  display: flex;\n  flex-direction: row;\n  overflow: hidden;\n}\n[part~=contextMenu] > div.row > div.group {\n  border: 1px solid rgba(255, 255, 255, 0.2);\n  border-radius: 0.25rem;\n  display: flex;\n  flex-direction: row;\n  flex: 1;\n  overflow: hidden;\n}\n\n[part~=contextMenu] > div.row > div.group:first-child {\n  margin-left: 0.5rem;\n  margin-right: 0.25rem;\n}\n\n[part~=contextMenu] > div.row > div.group:last-child {\n  margin-right: 0.5rem;\n}\n\n[part~=contextMenu] > div.group > button,\n[part~=contextMenu] > div.row > div.group > button {\n  display: flex;\n  flex: 1;\n  padding: 0.25rem;\n  justify-content: center;\n  border: 0;\n  margin: 0;\n  background: transparent;\n  color: #FFF;\n  font-size: 1rem;\n  line-height: 1.25rem;\n  align-items: center;\n  outline: none;\n}\n\n[part~=contextMenu] > button,\n[part~=contextMenu] > a {\n  display: flex;\n  border: 0;\n  margin: 0;\n  padding: 0.125rem 0.5rem;\n  background: transparent;\n  text-align: left;\n  color: #FFF;\n  font-size: 1rem;\n  text-decoration: none;\n  cursor: default;\n  outline: none;\n}\n\n[part~=contextMenu] > div.group > button.active,\n[part~=contextMenu] > div.row > div.group > button.active {\n  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3) inset;\n  background: rgba(0, 0, 0, 0.1);\n}\n\n[part~=contextMenu] > div.group > button.active:hover,\n[part~=contextMenu] > div.row > div.group > button.active:hover {\n  background: rgba(0, 0, 0, 0.2);\n}\n\n[part~=contextMenu] > div.group > button:not(:first-child),\n[part~=contextMenu] > div.row > div.group > button:not(:first-child) {\n  border-left: 1px solid rgba(255, 255, 255, 0.1);\n}\n\n[part~=contextMenu] > div.row > div.group > button > svg,\n[part~=contextMenu] > div.group > button > svg,\n[part~=contextMenu] > div.row > button > svg,\n[part~=contextMenu] > button > svg {\n  width: 1.5rem;\n  height: 1.5rem;\n  align-self: center;\n}\n\n[part~=contextMenu] > div.row > div.group > button:hover,\n[part~=contextMenu] > div.group > button:hover,\n[part~=contextMenu] > button:hover,\n[part~=contextMenu] > a:hover {\n  background: rgba(255, 255, 255, 0.2);\n}\n\n[part~=contextMenu] > div.row > div.group > button:active,\n[part~=contextMenu] > div.group > button:active {\n  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.3) inset;\n  background: rgba(0, 0, 0, 0.2);\n}\n[part~=contextMenu] > button:active,\n[part~=contextMenu] > a:active {\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) inset;\n  background: rgba(0, 0, 0, 0.2);\n}\n\n.row {\n  display: flex;\n}\n\n.divider {\n  border-top: 1px solid rgba(255, 255, 255, 0.3);\n  margin-top: 0.5rem;\n  height: 0.4375rem;\n}\n\n.black {\n  display: inline-flex;\n  border-radius: 50%;\n  width: 1rem;\n  height: 1rem;\n  background: #000;\n}\n\n.white {\n  display: inline-flex;\n  border-radius: 50%;\n  width: 1rem;\n  height: 1rem;\n  background: #FFF;\n}\n\n.download svg {\n  margin-bottom: -0.125rem;\n  margin-left: 0.25rem;\n}\n\n[part~=color] {\n  position: absolute;\n  padding: 0.25rem;\n  background: #737E9E;\n  border-radius: 0.25rem;\n  box-shadow: 0 1px 16px rgba(0, 0, 0, 0.6);\n}\n\n[part~=colorHexRgb] {\n  margin-bottom: 0.25rem;\n}";

    let MdiGrid = class MdiGrid extends HTMLElement {
        constructor() {
            super(...arguments);
            this.icons = [];
            this.size = 24;
            this.padding = 8;
            this.gap = 4;
            this.width = 'auto';
            this.height = 'auto';
            this.currentCount = 0;
            this.currentSize = 0;
            this.currentPadding = 0;
            this.currentGap = 0;
            this.rowHeight = 0;
            this.items = [];
            this.svg = 'http://www.w3.org/2000/svg';
            this.debounceRender = debounce(() => this.render(), 300);
            this.color = 'svg';
            this.resizeObserver = new ResizeObserver(() => {
                this.debounceRender();
            });
            this.index = 0;
            this.currentRow = 0;
            this.timeouts = [];
            this.cacheHeight = 0;
            this.cacheViewWidth = 0;
            this.canOpenTooltip = true;
            this.preventClose = false;
            this.currentIndex = 0;
        }
        connectedCallback() {
            this.resizeObserver.observe(this.$grid);
            this.addEventListener('mousemove', this.handleTooltip.bind(this));
            this.addEventListener('mouseleave', this.hideTooltip.bind(this));
            // Wire Up Context Menu
            this.$copyIconName.addEventListener('click', this.handleCopyIconName.bind(this));
            this.$svgBlack.addEventListener('click', () => {
                this.cacheSvgColor = '#000000';
                this.render();
            });
            this.$svgWhite.addEventListener('click', () => {
                this.cacheSvgColor = '#FFFFFF';
                this.render();
            });
            let preventSvgColor = false;
            this.$svgColor.addEventListener('click', () => {
                if (preventSvgColor) {
                    preventSvgColor = false;
                    return;
                }
                this.color = 'svg';
                this.$colorPicker.value = this.cacheSvgColor;
                this.$colorHexRgb.value = this.cacheSvgColor;
                const self = this;
                /*createPopper(this.$svgColor, this.$color, {
                  placement: 'bottom-start'
                });*/
                this.$color.style.visibility = 'visible';
                let outside = true;
                function handleMouseDown(e) {
                    if (outside) {
                        self.$color.style.visibility = 'hidden';
                        document.removeEventListener('mousedown', handleMouseDown);
                        preventSvgColor = true;
                        self.render();
                        setTimeout(() => preventSvgColor = false, 500);
                    }
                }
                this.$color.addEventListener('mouseenter', () => outside = false);
                this.$color.addEventListener('mouseleave', () => outside = true);
                document.addEventListener('mousedown', handleMouseDown);
            });
            this.$pngBlack.addEventListener('click', () => {
                this.cachePngColor = '#000000';
                this.render();
            });
            this.$pngWhite.addEventListener('click', () => {
                this.cachePngColor = '#FFFFFF';
                this.render();
            });
            let preventPngColor = false;
            this.$pngColor.addEventListener('click', () => {
                if (preventPngColor) {
                    preventPngColor = false;
                    return;
                }
                this.color = 'png';
                this.$colorPicker.value = this.cachePngColor;
                this.$colorHexRgb.value = this.cachePngColor;
                const self = this;
                /*createPopper(this.$pngColor, this.$color, {
                  placement: 'bottom-start'
                });*/
                this.$color.style.visibility = 'visible';
                let outside = true;
                function handleMouseDown(e) {
                    if (outside) {
                        self.$color.style.visibility = 'hidden';
                        document.removeEventListener('mousedown', handleMouseDown);
                        preventPngColor = true;
                        self.render();
                        setTimeout(() => preventPngColor = false, 500);
                    }
                }
                this.$color.addEventListener('mouseenter', () => outside = false);
                this.$color.addEventListener('mouseleave', () => outside = true);
                document.addEventListener('mousedown', handleMouseDown);
            });
            this.$png24.addEventListener('click', () => {
                this.cachePngSize = '24';
                this.render();
            });
            this.$png36.addEventListener('click', () => {
                this.cachePngSize = '36';
                this.render();
            });
            this.$png48.addEventListener('click', () => {
                this.cachePngSize = '48';
                this.render();
            });
            this.$png96.addEventListener('click', () => {
                this.cachePngSize = '96';
                this.render();
            });
            this.$svgDownload.addEventListener('click', () => {
                alert(`SVG ${this.cacheSvgColor}`);
            });
            this.$pngDownload.addEventListener('click', () => {
                alert(`SVG ${this.cachePngSize} ${this.cachePngColor}`);
            });
            this.$copySvgInline.addEventListener('click', () => {
                const icon = this.icons[this.currentIndex];
                copyText(getCopySvgInline(icon));
                this.hideContextMenu();
                addInfoToast(`Copied inline SVG "${icon.name}" to clipboard.`);
            });
            this.$copySvgFile.addEventListener('click', () => {
            });
            this.$copySvgPath.addEventListener('click', () => {
            });
            this.$copyUnicode.addEventListener('click', () => {
            });
            this.$copyCodepoint.addEventListener('click', () => {
            });
            this.$copyPreview.addEventListener('click', () => {
            });
            this.$scroll.addEventListener('calculate', (e) => {
                const { offsetY, height, viewWidth, viewHeight } = e.detail;
                this.calculate(offsetY, height, viewWidth, viewHeight);
            });
        }
        handleTooltip(e) {
            var rect = e.target.getBoundingClientRect();
            const x = Math.floor(e.clientX - rect.left);
            const y = Math.floor(e.clientY - rect.top);
            const tileX = Math.floor(x / 44);
            const tileY = Math.floor(y / 44);
            const index = tileX + (tileY * this.columns);
            if (this.index !== index) {
                if (this.icons[index]) {
                    if (tileX > this.columns - 1) {
                        this.hideTooltip();
                    }
                    else {
                        this.showTooltip(this.icons[index], index);
                    }
                    this.index = index;
                }
                else {
                    this.hideTooltip();
                }
            }
        }
        syncVirtual(count) {
            console.log('syncVirtual');
            for (let i = this.currentCount; i < count; i++) {
                this.currentCount = i + 1;
                const btn = document.createElement('button');
                btn.dataset.index = `${i}`;
                btn.addEventListener('click', () => {
                    const index = i + (this.columns * this.currentRow);
                    this.handleClick(this.icons[index]);
                });
                btn.addEventListener('keydown', (e) => {
                    const index = i + (this.columns * this.currentRow);
                    this.moveFocus(e, index);
                });
                btn.addEventListener('contextmenu', (e) => {
                    var rect = this.$grid.getBoundingClientRect();
                    const x = Math.floor(e.clientX - rect.left);
                    const y = Math.floor(e.clientY - rect.top);
                    this.showContextMenu(i, x, y);
                    e.preventDefault();
                });
                const svg = document.createElementNS(this.svg, 'svg');
                svg.setAttribute('viewBox', '0 0 24 24');
                const path = document.createElementNS(this.svg, 'path');
                svg.appendChild(path);
                btn.appendChild(svg);
                this.$grid.appendChild(btn);
                this.items.push([btn, svg, path]);
            }
            for (let i = this.currentCount; i > count; i--) {
                const ele = this.items.pop();
                this.$grid.removeChild(ele[0]);
                this.currentCount--;
            }
            const { size, padding, gap, width, height, rowHeight, scrollWidth } = this.getIconMetrics();
            const extra = (scrollWidth - gap - (rowHeight * this.columns)) / (this.columns - 1);
            let x = gap;
            let y = gap;
            this.items.forEach(([btn, svg], i) => {
                btn.style.padding = `${padding}px`;
                btn.style.width = `${width}px`;
                btn.style.height = `${height}px`;
                btn.style.transform = `translate(${x}px, ${y}px)`;
                svg.style.width = `${size}px`;
                svg.style.height = `${size}px`;
                x += width + gap + extra;
                if (i % this.columns === this.columns - 1) {
                    y += height + gap;
                    x = gap;
                }
            });
        }
        calculate(offsetY, height, viewWidth, viewHeight) {
            const rowHeight = this.rowHeight;
            const count = this.icons.length;
            const rows = Math.ceil(viewHeight / rowHeight) + 1;
            const row = Math.floor(offsetY / rowHeight);
            this.$grid.style.transform = `translateY(${-1 * offsetY % rowHeight}px)`;
            if (this.cacheHeight !== height || this.cacheViewWidth !== viewWidth) {
                this.syncVirtual(rows * this.columns);
                this.cacheHeight = height;
                this.cacheViewWidth = viewWidth;
            }
            if (this.currentRow !== row) {
                this.items.forEach(([btn, svg, path], i) => {
                    const index = i + (row * this.columns);
                    if (index < count) {
                        path.setAttribute('d', this.icons[index].data);
                        btn.style.display = 'block';
                    }
                    else {
                        btn.style.display = 'none';
                    }
                });
                this.currentRow = row;
            }
        }
        getIconMetrics() {
            const size = parseInt(this.size, 10);
            const padding = parseInt(this.padding, 10);
            const gap = parseInt(this.gap, 10);
            const { width: scrollWidth } = this.$scroll.getBoundingClientRect();
            return {
                size,
                padding,
                gap,
                width: size + (padding * 2),
                height: size + (padding * 2),
                rowHeight: size + (padding * 2) + gap,
                scrollWidth
            };
        }
        calculateColumns(width, rowHeight) {
            let w = width - this.currentGap;
            return Math.floor(w / rowHeight);
        }
        render() {
            // Calculate Icon Size
            const { size, padding, gap, rowHeight, scrollWidth } = this.getIconMetrics();
            if (this.currentSize !== size || this.currentPadding !== padding || this.currentGap !== gap) {
                this.currentSize = size;
                this.currentPadding = padding;
                this.currentGap = gap;
                this.rowHeight = rowHeight;
            }
            // Calculate Columns
            const columns = this.calculateColumns(scrollWidth, rowHeight);
            if (this.columns !== columns) {
                this.columns = columns;
            }
            // Virtual Grid
            const count = this.icons.length;
            const rows = Math.ceil(count / this.columns);
            this.currentRow = -1;
            this.$scroll.height = gap + (rows * rowHeight);
            // Context Menu
            this.$svgBlack.classList.toggle('active', this.cacheSvgColor === '#000000');
            this.$svgWhite.classList.toggle('active', this.cacheSvgColor === '#FFFFFF');
            this.$svgColor.classList.toggle('active', this.cacheSvgColor !== '#000000' && this.cacheSvgColor !== '#FFFFFF');
            this.$pngBlack.classList.toggle('active', this.cachePngColor === '#000000');
            this.$pngWhite.classList.toggle('active', this.cachePngColor === '#FFFFFF');
            this.$pngColor.classList.toggle('active', this.cachePngColor !== '#000000' && this.cachePngColor !== '#FFFFFF');
            this.$png24.classList.toggle('active', this.cachePngSize === '24');
            this.$png36.classList.toggle('active', this.cachePngSize === '36');
            this.$png48.classList.toggle('active', this.cachePngSize === '48');
            this.$png96.classList.toggle('active', this.cachePngSize === '96');
            this.$colorPicker.addEventListener('select', this.handleColorSelect.bind(this));
            this.$colorHexRgb.addEventListener('change', this.handleHexRgbChange.bind(this));
            this.syncEyedropper();
        }
        handleColorSelect(e) {
            switch (this.color) {
                case 'svg':
                    this.cacheSvgColor = e.detail.hex;
                    break;
                case 'png':
                    this.cachePngColor = e.detail.hex;
                    break;
            }
            this.$colorHexRgb.value = e.detail.hex;
            this.syncEyedropper();
        }
        handleHexRgbChange(e) {
            switch (this.color) {
                case 'svg':
                    this.cacheSvgColor = e.detail.hex;
                    break;
                case 'png':
                    this.cachePngColor = e.detail.hex;
                    break;
            }
            this.$colorPicker.value = e.detail.hex;
            this.syncEyedropper();
        }
        syncEyedropper() {
            if (this.cachePngColor !== '#000000' && this.cachePngColor !== '#FFFFFF') {
                this.$pngColor.style.color = this.cachePngColor;
            }
            else {
                this.$pngColor.style.color = 'transparent';
            }
            if (this.cacheSvgColor !== '#000000' && this.cacheSvgColor !== '#FFFFFF') {
                this.$svgColor.style.color = this.cacheSvgColor;
            }
            else {
                this.$svgColor.style.color = 'transparent';
            }
        }
        moveFocus(e, index) {
            console.log(e.which, index);
            let newIndex;
            switch (e.which) {
                case 37:
                    newIndex = index - 1;
                    if (newIndex >= 0) {
                        this.items[newIndex][0].focus();
                        e.preventDefault();
                    }
                    break;
                case 38:
                    newIndex = index - this.columns;
                    if (newIndex >= 0) {
                        this.items[newIndex][0].focus();
                        e.preventDefault();
                    }
                    break;
                case 39:
                    newIndex = index + 1;
                    if (newIndex < this.icons.length) {
                        this.items[newIndex][0].focus();
                        e.preventDefault();
                    }
                    break;
                case 40:
                    newIndex = index + this.columns;
                    if (newIndex < this.icons.length) {
                        this.items[newIndex][0].focus();
                        e.preventDefault();
                    }
                    else if (newIndex !== this.icons.length - 1) {
                        this.items[this.icons.length - 1][0].focus();
                        e.preventDefault();
                    }
                    break;
            }
        }
        handleClick(icon) {
            this.dispatchEvent(new CustomEvent('select', {
                detail: icon
            }));
        }
        showContextMenu(index, x, y) {
            const gridRect = this.$grid.getBoundingClientRect();
            const cmRect = this.$contextMenu.getBoundingClientRect();
            if (y + gridRect.top + cmRect.height + 4 > window.innerHeight
                && x + gridRect.left + cmRect.width + 24 > window.innerWidth) {
                y = y - cmRect.height;
                x -= x + gridRect.left + cmRect.width + 24 - window.innerWidth;
            }
            else if (y + gridRect.top + cmRect.height + 4 > window.innerHeight) {
                y -= y + gridRect.top + cmRect.height + 4 - window.innerHeight;
            }
            else if (x + gridRect.left + cmRect.width + 24 > window.innerWidth) {
                x -= x + gridRect.left + cmRect.width + 24 - window.innerWidth;
            }
            this.currentIndex = index;
            var icon = this.icons[index];
            this.$newTab.href = `icons/${icon.name}`;
            this.$contextMenu.style.left = `${x}px`;
            this.$contextMenu.style.top = `${y}px`;
            this.$contextMenu.style.visibility = 'visible';
            this.hideTooltip();
            this.canOpenTooltip = false;
            const self = this;
            this.$contextMenu.addEventListener('mouseenter', () => {
                this.preventClose = true;
            });
            this.$contextMenu.addEventListener('mouseleave', () => {
                this.preventClose = false;
            });
            function handleMouseDown(e) {
                if (!self.preventClose) {
                    self.hideContextMenu();
                    document.removeEventListener('mousedown', handleMouseDown);
                }
            }
            this.preventClose = false;
            document.addEventListener('mousedown', handleMouseDown);
            this.$color.style.visibility = 'hidden';
        }
        hideContextMenu() {
            this.$contextMenu.style.visibility = 'hidden';
            this.$color.style.visibility = 'hidden';
            this.canOpenTooltip = true;
        }
        handleCopyIconName() {
            const icon = this.icons[this.currentIndex];
            copyText(icon.name);
            addInfoToast(`Copied "${icon.name}" to clipboard.`);
            this.hideContextMenu();
        }
        showTooltip(icon, index) {
            if (!this.canOpenTooltip) {
                return;
            }
            this.$tooltipText.innerText = icon.name;
            const { x, y } = this.getPositionFromIndex(index);
            const half = Math.ceil(this.columns / 2);
            if (x >= half) {
                const { width } = this.$tooltip.getBoundingClientRect();
            }
            //this.$tooltip.style.transform = `translate(${x * 44 + offsetX}px, ${(y * 44 + 5)}px`;
            //this.$tooltipArrow.style.transform = `translate(${16 + (-1 * offsetX)}px, 0)`;
            //this.$tooltip.classList.add('visible');
        }
        hideTooltip() {
            this.$tooltip.classList.remove('visible');
            this.index = -1;
        }
        getPositionFromIndex(index) {
            return {
                x: index % this.columns,
                y: Math.floor(index / this.columns)
            };
        }
    };
    __decorate([
        Prop()
    ], MdiGrid.prototype, "icons", void 0);
    __decorate([
        Prop()
    ], MdiGrid.prototype, "size", void 0);
    __decorate([
        Prop()
    ], MdiGrid.prototype, "padding", void 0);
    __decorate([
        Prop()
    ], MdiGrid.prototype, "gap", void 0);
    __decorate([
        Prop()
    ], MdiGrid.prototype, "width", void 0);
    __decorate([
        Prop()
    ], MdiGrid.prototype, "height", void 0);
    __decorate([
        Part()
    ], MdiGrid.prototype, "$scroll", void 0);
    __decorate([
        Part()
    ], MdiGrid.prototype, "$grid", void 0);
    __decorate([
        Part()
    ], MdiGrid.prototype, "$contextMenu", void 0);
    __decorate([
        Part()
    ], MdiGrid.prototype, "$newTab", void 0);
    __decorate([
        Part()
    ], MdiGrid.prototype, "$copyIconName", void 0);
    __decorate([
        Part()
    ], MdiGrid.prototype, "$pngBlack", void 0);
    __decorate([
        Part()
    ], MdiGrid.prototype, "$pngWhite", void 0);
    __decorate([
        Part()
    ], MdiGrid.prototype, "$pngColor", void 0);
    __decorate([
        Part()
    ], MdiGrid.prototype, "$png24", void 0);
    __decorate([
        Part()
    ], MdiGrid.prototype, "$png36", void 0);
    __decorate([
        Part()
    ], MdiGrid.prototype, "$png48", void 0);
    __decorate([
        Part()
    ], MdiGrid.prototype, "$png96", void 0);
    __decorate([
        Part()
    ], MdiGrid.prototype, "$pngDownload", void 0);
    __decorate([
        Part()
    ], MdiGrid.prototype, "$svgBlack", void 0);
    __decorate([
        Part()
    ], MdiGrid.prototype, "$svgWhite", void 0);
    __decorate([
        Part()
    ], MdiGrid.prototype, "$svgColor", void 0);
    __decorate([
        Part()
    ], MdiGrid.prototype, "$svgDownload", void 0);
    __decorate([
        Part()
    ], MdiGrid.prototype, "$copySvgInline", void 0);
    __decorate([
        Part()
    ], MdiGrid.prototype, "$copySvgFile", void 0);
    __decorate([
        Part()
    ], MdiGrid.prototype, "$copySvgPath", void 0);
    __decorate([
        Part()
    ], MdiGrid.prototype, "$copyUnicode", void 0);
    __decorate([
        Part()
    ], MdiGrid.prototype, "$copyCodepoint", void 0);
    __decorate([
        Part()
    ], MdiGrid.prototype, "$copyPreview", void 0);
    __decorate([
        Part()
    ], MdiGrid.prototype, "$tooltip", void 0);
    __decorate([
        Part()
    ], MdiGrid.prototype, "$tooltipText", void 0);
    __decorate([
        Part()
    ], MdiGrid.prototype, "$tooltipArrow", void 0);
    __decorate([
        Part()
    ], MdiGrid.prototype, "$color", void 0);
    __decorate([
        Part()
    ], MdiGrid.prototype, "$colorPicker", void 0);
    __decorate([
        Part()
    ], MdiGrid.prototype, "$colorHexRgb", void 0);
    __decorate([
        Local('#000000')
    ], MdiGrid.prototype, "cachePngColor", void 0);
    __decorate([
        Local('24')
    ], MdiGrid.prototype, "cachePngSize", void 0);
    __decorate([
        Local('#000000')
    ], MdiGrid.prototype, "cacheSvgColor", void 0);
    MdiGrid = __decorate([
        Component({
            selector: 'mdi-grid',
            style: style$1,
            template: template$1
        })
    ], MdiGrid);
    var MdiGrid$1 = MdiGrid;

    return MdiGrid$1;

}());
//# sourceMappingURL=mdiGrid.js.map
