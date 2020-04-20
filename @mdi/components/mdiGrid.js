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

    const debounce = (func, waitFor) => {
        let timeout;
        return (...args) => new Promise(resolve => {
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(() => resolve(func(...args)), waitFor);
        });
    };

    var template$1 = "<div part=\"grid\"></div>\n<div part=\"tooltip\">\n  <span part=\"tooltipText\"></span>\n  <div part=\"arrow\"></div>\n</div>\n<div part=\"contextMenu\">\n  <div class=\"section\">Download PNG</div>\n  <div class=\"group\">\n    <button class=\"active\">Black</button>\n    <button>White</button>\n    <button>\n      <svg viewBox=\"0 0 24 24\">\n        <path fill=\"currentColor\" d=\"M19.35,11.72L17.22,13.85L15.81,12.43L8.1,20.14L3.5,22L2,20.5L3.86,15.9L11.57,8.19L10.15,6.78L12.28,4.65L19.35,11.72M16.76,3C17.93,1.83 19.83,1.83 21,3C22.17,4.17 22.17,6.07 21,7.24L19.08,9.16L14.84,4.92L16.76,3M5.56,17.03L4.5,19.5L6.97,18.44L14.4,11L13,9.6L5.56,17.03Z\"/>\n      </svg>\n    </button>\n  </div>\n  <div class=\"group\" style=\"margin-top: 0.25rem;\">\n    <button>24</button>\n    <button>36</button>\n    <button>48</button>\n    <button>96</button>\n  </div>\n  <div class=\"section\">SVG</div>\n  <div class=\"row\" style=\"margin-bottom: 0.25rem;\">\n    <div class=\"group\">\n      <button class=\"active\"><span class=\"black\"></span></button>\n      <button><span class=\"white\"></span></button>\n      <button>\n        <svg viewBox=\"0 0 24 24\">\n          <path fill=\"currentColor\" d=\"M19.35,11.72L17.22,13.85L15.81,12.43L8.1,20.14L3.5,22L2,20.5L3.86,15.9L11.57,8.19L10.15,6.78L12.28,4.65L19.35,11.72M16.76,3C17.93,1.83 19.83,1.83 21,3C22.17,4.17 22.17,6.07 21,7.24L19.08,9.16L14.84,4.92L16.76,3M5.56,17.03L4.5,19.5L6.97,18.44L14.4,11L13,9.6L5.56,17.03Z\"/>\n        </svg>\n      </button>\n    </div>\n    <div class=\"group\">\n      <button>\n        SVG\n        <svg viewBox=\"0 0 24 24\">\n          <path fill=\"currentColor\" d=\"M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z\"/>\n        </svg>\n      </button>\n    </div>\n  </div>\n  <button>Copy HTML SVG Inline</button>\n  <button>Copy SVG File Contents</button>\n  <button>Copy SVG Path Data</button>\n  <div class=\"section\">Desktop Font</div>\n  <button>Copy Unicode Character</button>\n  <button>Copy Codepoint</button>\n  <div class=\"divider\"></div>\n  <button>Copy Link to Icon</button>\n  <button>Copy GitHub Preview</button>\n</div>";

    var style$1 = "* {\n  font-family: var(--mdi-font-family);\n}\n\n[part~=grid] {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, 2.75rem);\n  grid-template-rows: repeat(1, 2.75rem);\n  min-height: 2.75rem;\n  overflow: hidden;\n}\n\n:host {\n  display: block;\n  position: relative;\n}\n\n[part~=grid] > button {\n  border: 0;\n  background: transparent;\n  padding: 0.625rem;\n  outline: none;\n}\n\n[part~=grid] > button:focus {\n   background: url(\"data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 44 44'><path fill='rgb(246, 237, 228)' d='M6 4H38C39.11 4 40 4.89 40 6V38C40 39.11 39.11 40 38 40H6C4.89 40 4 39.11 4 38V6C4 4.89 4.89 4 6 4Z' /><path fill='rgb(69, 60, 79)' d='M16.39 39.93C13.91 39.84 11.19 39.81 8.71 39.93C6.23 40.05 5 39.81 4.36 39.27C3.74 38.72 3.93 35.81 4.09 34.74C4.19 32.75 4.16 30.76 4 28.77C3.92 26.87 3.95 24.97 4.09 23.08C4.17 21.38 4.14 19.68 4 18C3.89 16.6 3.89 15.21 4 13.83C4.13 13.45 4.88 13.5 4.94 13.96C5 14.39 4.71 15.93 4.82 18C5.04 19.71 5.11 21.46 5 23.2C4.8 25.05 4.73 26.91 4.82 28.77C5.07 30.75 5.14 32.75 5 34.74C4.76 36.04 4.76 37.36 5 38.66C5.3 39.46 7.15 39.2 8.56 39.09C11.16 38.92 13.78 38.92 16.39 39.09C19.07 39.28 21.77 39.26 24.45 39C27.13 38.84 29.81 38.84 32.5 39C33.95 39.13 34.76 39.09 36.79 39.15C38.82 39.2 38.96 38.2 38.96 37.82V35.29C38.97 34.69 39.89 35.07 39.93 35.29V37.82C39.89 38.93 39.66 39.44 39.13 39.7C38.6 39.96 38.28 40.11 33.97 39.93C29.67 39.76 27.09 39.82 24.58 39.93L20.64 40L16.39 39.93M38.95 33.21C39 32.24 39.03 29.54 38.95 28.88C38.78 27.59 38.78 26.29 38.95 25C39.19 24.47 40.15 24.16 40 25C39.85 26.29 39.85 27.59 40 28.88C40.17 30.2 40 32.9 40 33.21C40 33.41 39.62 33.72 39.3 33.72C39.09 33.72 38.93 33.59 38.94 33.21H38.95M39.15 22.56C38.79 20.59 38.72 18.58 38.96 16.6C39.19 14.63 39.19 12.63 38.96 10.66C38.84 9.47 38.91 8.26 39.15 7.09C39.43 6.23 39 5.29 38.19 4.93C36.96 4.78 35.72 4.76 34.5 4.87L32.55 4.93C31.75 4.88 31.89 4.21 32.85 4.09C32.85 4.09 37.34 3.91 38.3 4.04C39.26 4.18 39.88 4.62 40.08 5.96C40.29 7.31 39.77 8.55 39.9 10.66C40.16 12.63 40.16 14.63 39.9 16.6C39.7 18.64 39.7 20.68 39.9 22.72C39.8 22.84 39.65 22.92 39.5 22.95C39.35 22.95 39.22 22.86 39.15 22.56M4 11.53C4.16 10.75 4.16 9.94 4 9.15C3.8 7.29 3.84 5.88 4.29 5.17C4.72 4.22 5.79 3.75 6.78 4.05C8.42 4.3 10.09 4.3 11.73 4.05C13.12 3.94 14.5 3.94 15.9 4.05C18.04 4.22 20.19 4.22 22.33 4.05C24.5 3.94 26.63 4 28.77 4.28C29.45 4.32 29.19 4.9 28.67 4.88C26.53 4.76 24.38 4.81 22.25 5C20.08 5.21 17.91 5.21 15.76 5C12.4 4.92 13.03 4.86 11.56 5C9.85 5.24 8.12 5.24 6.41 5C5.78 4.76 5.05 5.06 4.79 5.69C4.58 6.89 4.61 8.12 4.86 9.31C5 10.15 5.04 11 4.93 11.86C4.9 11.96 4.72 12.04 4.53 12.04C4.26 12.04 3.96 11.9 4 11.53Z' /></svg>\");\n}\n\n[part~=grid] > button:hover {\n  background: url(\"data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 44 44'><path fill='rgb(246, 237, 228)' d='M6 4H38C39.11 4 40 4.89 40 6V38C40 39.11 39.11 40 38 40H6C4.89 40 4 39.11 4 38V6C4 4.89 4.89 4 6 4Z' /><path fill='rgb(69, 60, 79)' d='M 16.3853,39.932L 15.7864,39.9226L 16.26,40.5207C 16.5467,41.078 18.416,42.2807 18.9587,42.8233C 19.5,43.3647 18.6613,44.162 18.2027,43.458C 17.74,42.7553 17.7293,42.9113 17.0467,42.2233C 16.3693,41.5367 16.412,41.8327 15.6667,40.938C 15.328,40.5619 14.9533,40.2145 14.5489,39.9033L 11.4853,39.8554C 11.8124,40.1401 12.1067,40.4612 12.364,40.812C 12.6507,41.3693 13.0213,41.328 13.5627,41.8693C 14.104,42.412 13.104,42.7347 12.8027,42.344C 12.5053,41.9587 12.516,42.1253 11.7707,41.2347C 11.0267,40.3387 10.5733,40.2813 10.38,40.0267L 10.3289,39.8743L 8.708,39.932C 7.84505,39.9738 7.1316,39.9719 6.54197,39.9287L 7.01,40.5207C 7.29667,41.078 9.166,42.2807 9.70867,42.8233C 10.25,43.3647 9.41133,44.162 8.95267,43.458C 8.49,42.7553 8.47933,42.9113 7.79667,42.2233C 7.11933,41.5367 7.162,41.8327 6.41667,40.938C 6.03133,40.51 5.59933,40.1193 5.13,39.7767L 5.08431,39.6652C 4.78048,39.5591 4.54546,39.4253 4.364,39.2653L 4.14908,38.9149C 3.75384,38.5945 3.40767,38.2168 3.12467,37.7967C 2.838,37.2447 0.968667,36.042 0.427333,35.5007C -0.114,34.9527 0.723333,34.1567 1.182,34.8647C 1.646,35.5673 1.65667,35.4113 2.33267,36.094C 3.01533,36.7807 2.96867,36.49 3.714,37.3807L 3.94445,37.6254C 3.89431,36.591 3.99715,35.3609 4.09333,34.7453C 4.10842,34.4442 4.1205,34.143 4.12959,33.842C 3.60679,33.4763 3.14837,33.0203 2.77067,32.5053C 2.484,31.948 2.11467,31.9893 1.57333,31.448C 1.03067,30.9067 2.03067,30.588 2.328,30.9733C 2.63067,31.364 2.61467,31.1933 3.364,32.088C 3.67619,32.4611 3.93715,32.6879 4.14875,32.8448C 4.15998,31.4834 4.11011,30.1231 4,28.7653L 3.99907,28.744C 3.56208,28.4072 3.18129,28.0019 2.87467,27.5467C 2.588,26.9947 0.718667,25.792 0.177333,25.2507C -0.364,24.7027 0.473333,23.9067 0.932,24.6147C 1.396,25.3173 1.40667,25.1613 2.08267,25.844C 2.76533,26.5307 2.71867,26.24 3.464,27.1307L 3.96424,27.6389C 3.93864,26.3523 3.9653,25.065 4.04462,23.7813C 3.55702,23.4264 3.12777,22.9922 2.77067,22.5053C 2.484,21.948 2.11467,21.9893 1.57333,21.448C 1.03067,20.9067 2.03067,20.588 2.328,20.9733C 2.63067,21.364 2.61467,21.1933 3.364,22.088C 3.65455,22.4352 3.90072,22.6558 4.10402,22.8111C 4.16316,21.2018 4.12886,19.5935 4,17.984L 3.96677,17.51C 3.6468,17.225 3.36328,16.9009 3.12467,16.5467C 2.838,15.9947 0.968667,14.792 0.427333,14.2507C -0.114,13.7027 0.723333,12.9067 1.182,13.6147C 1.646,14.3173 1.65667,14.1613 2.33267,14.844C 3.01533,15.5307 2.96867,15.24 3.714,16.1307L 3.92176,16.3532L 4,13.828C 4.13067,13.4533 4.87467,13.5213 4.94267,13.9587C 5.016,14.3907 4.71333,15.9267 4.82267,17.984C 5.04133,19.7133 5.10933,21.4587 5.02133,23.1973C 4.79733,25.0467 4.72933,26.9067 4.82267,28.7653C 5.07333,30.7493 5.14,32.7493 5.02133,34.7453C 4.77238,36.0005 4.76553,37.2909 5.00078,38.5493L 5.05489,38.7343C 5.4226,39.4414 7.19338,39.1989 8.55733,39.0933C 11.1613,38.9173 13.776,38.9173 16.3853,39.0933C 18.4329,39.2365 20.4859,39.2552 22.5337,39.1481C 22.6239,39.0809 22.7383,39.0603 22.8653,39.1296L 24.4533,39.0107C 27.1307,38.844 29.812,38.844 32.484,39.0107C 33.948,39.1307 34.76,39.0933 36.792,39.1453C 38.8227,39.1973 38.9587,38.1973 38.9587,37.8173L 38.9587,35.2867C 38.9693,34.688 39.8907,35.068 39.932,35.2867L 39.932,37.6131C 40.3487,37.9391 40.7109,38.3317 41.01,38.7707C 41.2967,39.328 43.166,40.5307 43.7087,41.0733C 44.25,41.6147 43.4113,42.412 42.9527,41.708C 42.49,41.0053 42.4793,41.1613 41.7967,40.4733C 41.1193,39.7867 41.162,40.0827 40.4167,39.188L 39.851,38.6173C 39.7391,39.1976 39.5132,39.5152 39.1307,39.7027C 38.7448,39.8902 38.4684,40.0212 36.654,40.0082L 37.364,40.812C 37.6507,41.3693 38.0213,41.328 38.5627,41.8693C 39.104,42.412 38.104,42.7347 37.8027,42.344C 37.5053,41.9587 37.516,42.1253 36.7707,41.2347C 36.0267,40.3387 35.5733,40.2813 35.38,40.0267L 35.3545,39.9819L 33.9733,39.932L 31.7269,39.8589L 32.26,40.5207C 32.5467,41.078 34.416,42.2807 34.9587,42.8233C 35.5,43.3647 34.6613,44.162 34.2027,43.458C 33.74,42.7553 33.7293,42.9113 33.0467,42.2233C 32.3693,41.5367 32.412,41.8327 31.6667,40.938C 31.3029,40.534 30.8975,40.1632 30.4584,39.8346L 27.467,39.8395C 27.8014,40.1281 28.1019,40.4546 28.364,40.812C 28.6507,41.3693 29.0213,41.328 29.5627,41.8693C 30.104,42.412 29.104,42.7347 28.8027,42.344C 28.5053,41.9587 28.516,42.1253 27.7707,41.2347C 27.0267,40.3387 26.5733,40.2813 26.38,40.0267L 26.3283,39.8667L 24.584,39.932L 23.8091,39.9475L 24.26,40.5207C 24.5467,41.078 26.416,42.2807 26.9587,42.8233C 27.5,43.3647 26.6613,44.162 26.2027,43.458C 25.74,42.7553 25.7293,42.9113 25.0467,42.2233C 24.3693,41.5367 24.412,41.8327 23.6667,40.938L 22.6355,39.9709L 20.64,40.0107L 19.6369,39.9921L 20.364,40.812C 20.6507,41.3693 21.0213,41.328 21.5627,41.8693C 22.104,42.412 21.104,42.7347 20.8027,42.344C 20.5053,41.9587 20.516,42.1253 19.7707,41.2347C 19.0267,40.3387 18.5733,40.2813 18.38,40.0267L 18.349,39.9683L 16.3853,39.932 Z M 38.9479,33.2134C 38.9786,32.2454 39.0266,29.5414 38.9479,28.88C 38.7813,27.5934 38.7813,26.2867 38.9479,25C 39.1933,24.4734 40.1453,24.156 40.0053,25L 39.9031,26.3407C 40.332,26.6711 40.7039,27.0717 41.0099,27.5207C 41.2966,28.078 43.1659,29.2807 43.7086,29.8234C 44.2499,30.3647 43.4112,31.162 42.9526,30.458C 42.4899,29.7554 42.4793,29.9114 41.7966,29.2234C 41.1193,28.5367 41.1619,28.8327 40.4166,27.938L 39.8989,27.4116L 40.0053,28.88C 40.0887,29.5643 40.0787,30.6155 40.0532,31.5147C 40.5571,31.874 40.9979,32.3129 41.3639,32.812C 41.6506,33.3693 42.0213,33.328 42.5626,33.8693C 43.1039,34.412 42.1039,34.7347 41.8026,34.344C 41.5053,33.9587 41.5159,34.1253 40.7706,33.2347C 40.4752,32.8789 40.2256,32.6554 40.0199,32.4992L 40.0053,33.2134C 40.0213,33.412 39.6146,33.724 39.2973,33.724C 39.0933,33.724 38.9319,33.5934 38.9426,33.2134L 38.9479,33.2134 Z M 39.1453,22.5627C 38.7866,20.5934 38.7239,18.5841 38.9639,16.5987C 39.1879,14.6254 39.1879,12.6307 38.9639,10.6614C 38.8439,9.46941 38.9066,8.26007 39.1453,7.08808C 39.4319,6.22941 39.0159,5.29208 38.1879,4.92674C 36.9586,4.78141 35.7186,4.76541 34.4839,4.86941L 32.5519,4.92674C 31.839,4.88529 31.8666,4.35466 32.561,4.15249L 31.7706,3.2707C 31.484,2.71337 31.1146,2.7547 30.5733,2.21337C 30.0306,1.67204 31.0306,1.34937 31.328,1.74004C 31.6306,2.12537 31.6146,1.9587 32.364,2.8547C 33.1069,3.74248 33.5597,3.80232 33.7475,4.06018L 37.4524,3.99637L 37.1246,3.56204C 36.838,3.01004 34.9686,1.80737 34.4273,1.26074C 33.886,0.71941 34.7233,-0.0779228 35.182,0.624741C 35.646,1.33274 35.6566,1.17141 36.3326,1.85937C 37.0153,2.54737 36.9686,2.25004 37.714,3.14604L 38.7914,4.15126C 39.0757,4.24283 39.3189,4.38168 39.5178,4.59283L 39.7233,4.70871C 40.2286,5.06205 40.662,5.51004 41.01,6.02071C 41.2966,6.57804 43.1659,7.78071 43.7086,8.32338C 44.2499,8.86471 43.4112,9.66204 42.9526,8.95804C 42.49,8.25537 42.4793,8.41138 41.7966,7.72338C 41.1193,7.03671 41.162,7.33271 40.4166,6.43804L 40.1022,6.1074C 40.2485,7.34326 39.8123,8.51693 39.8872,10.3925L 39.9733,10.4587C 40.5106,10.828 40.9786,11.2867 41.364,11.812C 41.6506,12.3694 42.0213,12.328 42.5626,12.8694C 43.1039,13.412 42.104,13.7347 41.8026,13.344C 41.5053,12.9587 41.516,13.1254 40.7706,12.2347C 40.4618,11.8628 40.203,11.6353 39.9922,11.4783C 40.1222,12.8713 40.1255,14.2738 40.0023,15.6692C 40.3895,15.9838 40.7278,16.3567 41.01,16.7707C 41.2966,17.328 43.1659,18.5307 43.7086,19.0734C 44.2499,19.6147 43.4112,20.412 42.9526,19.708C 42.49,19.0054 42.4793,19.1614 41.7966,18.4734C 41.1193,17.7867 41.162,18.0827 40.4166,17.188L 39.8955,16.6585C 39.7783,17.8842 39.733,19.1133 39.7596,20.3412L 39.9733,20.4587C 40.5106,20.828 40.9786,21.2867 41.364,21.812C 41.6506,22.3694 42.0213,22.328 42.5626,22.8694C 43.1039,23.412 42.104,23.7347 41.8026,23.344C 41.5053,22.9587 41.5159,23.1254 40.7706,22.2347C 40.3589,21.7389 40.0362,21.4999 39.7973,21.3421L 39.9013,22.7187C 39.7973,22.8387 39.6506,22.9214 39.4893,22.948C 39.3546,22.948 39.2239,22.8547 39.1453,22.5627 Z M 3.99999,9.15074C 3.8886,8.09858 3.85326,7.19043 3.92417,6.47162C 3.6216,6.19601 3.35264,5.88511 3.12466,5.54668C 2.838,4.99469 0.968666,3.79202 0.427333,3.25068C -0.114,2.70269 0.723333,1.90668 1.182,2.61469C 1.646,3.31735 1.65667,3.16135 2.33267,3.84402C 3.01533,4.53069 2.96866,4.24002 3.714,5.13068L 4.11984,5.52494L 4.29199,5.16674C 4.72399,4.22408 5.78665,3.74941 6.78131,4.05207L 7.55804,4.14974L 6.77066,3.27069C 6.48399,2.71335 6.11466,2.75469 5.57333,2.21335C 5.03066,1.67202 6.03066,1.34935 6.32799,1.74002C 6.63066,2.12535 6.61466,1.95869 7.36399,2.85469C 8.10933,3.74535 8.56266,3.80268 8.74933,4.06269L 8.80432,4.23001C 9.78101,4.25633 10.7596,4.19703 11.7293,4.05207L 12.2207,4.01791L 11.8747,3.56202C 11.588,3.01002 9.71866,1.80735 9.17733,1.26071C 8.63599,0.719379 9.47333,-0.0779533 9.93199,0.62471C 10.396,1.33271 10.4067,1.17138 11.0827,1.85936C 11.7653,2.54736 11.7187,2.25002 12.464,3.14602L 13.3264,3.97453L 15.896,4.05207L 16.4985,4.09458L 15.7707,3.27069C 15.484,2.71336 15.1147,2.75469 14.5733,2.21336C 14.0307,1.67202 15.0307,1.34936 15.328,1.74002C 15.6307,2.12536 15.6147,1.95869 16.364,2.85469C 17.1093,3.74536 17.5627,3.80269 17.7493,4.06269L 17.7934,4.15609L 20.3452,4.15878L 19.8747,3.56203C 19.588,3.01003 17.7187,1.80736 17.1773,1.26072C 16.636,0.719391 17.4733,-0.0779419 17.932,0.624722C 18.396,1.33272 18.4067,1.17139 19.0827,1.85936C 19.7653,2.54736 19.7187,2.25003 20.464,3.14603L 21.4889,4.10905L 22.3333,4.05207L 24.4,3.9999L 23.7706,3.27069C 23.484,2.71336 23.1146,2.7547 22.5733,2.21336C 22.0306,1.67203 23.0306,1.34936 23.328,1.74003C 23.6306,2.12536 23.6146,1.9587 24.364,2.8547C 25.0748,3.70414 25.5201,3.7956 25.7217,4.0278L 27.687,4.15849L 27.0733,3.41203C 26.7866,2.86003 24.9173,1.65603 24.3746,1.11473C 23.8333,0.568066 24.672,-0.229267 25.136,0.478733C 25.5933,1.18274 25.604,1.02673 26.2866,1.70803C 26.964,2.39603 26.9213,2.10403 27.6666,2.9947C 28.0573,3.4267 28.484,3.81736 28.9533,4.16137L 29.0051,4.3242C 29.3717,4.47285 29.1137,4.89757 28.6719,4.87474C 26.5306,4.75474 24.3799,4.80674 22.2453,5.02141C 20.0826,5.20808 17.912,5.20808 15.7546,5.02141L 13.5927,4.94369C 13.494,5.01292 13.3676,5.0264 13.228,4.92944C 12.5618,4.90575 12.4297,4.92246 11.5573,5.02141C 9.84931,5.23475 8.11998,5.23475 6.41198,5.02141C 5.77598,4.76007 5.05199,5.05741 4.78666,5.68808C 4.58399,6.89074 4.60932,8.12008 4.86399,9.31208C 5.02132,10.1507 5.04132,11.0107 4.93199,11.8547C 4.90132,11.9641 4.71866,12.0361 4.53066,12.0361C 4.3252,12.04 4.11162,11.9635 4.03071,11.7712C 3.54885,11.4181 3.12437,10.9876 2.77066,10.5053C 2.484,9.94802 2.11467,9.98935 1.57333,9.44802C 1.03067,8.90668 2.03067,8.58802 2.328,8.97335C 2.63067,9.36401 2.61467,9.19335 3.364,10.088C 3.65224,10.4325 3.8968,10.6523 4.09917,10.8074C 4.14149,10.2548 4.10843,9.6976 3.99999,9.15074 Z' /></svg>\");\n}\n\n[part~=grid] > button > svg {\n  fill: #453C4F;\n}\n\n[part~=tooltip] {\n  order: 1;\n  opacity: 0;\n  transition: opacity 0.2s ease-in;\n  pointer-events: none;\n  visibility: hidden;\n  position: absolute;\n}\n\n[part~=tooltip].visible {\n  visibility: visible;\n  opacity: 1;\n}\n\n[part~=tooltipText] {\n  background: #737E9E;\n  border-radius: 0.25rem;\n  color: #FFF;\n  padding: 0.15rem 0.5rem 0.3rem 0.5rem;\n  white-space: nowrap;\n  position: relative;\n  top: 44px;\n}\n\n[part~=arrow] {\n  left: 18px;\n  bottom: -26px;\n}\n\n[part~=arrow],\n[part~=arrow]::before {\n  position: absolute;\n  width: 10px;\n  height: 10px;\n}\n\n[part~=arrow]::before {\n  content: '';\n  transform: rotate(45deg);\n  background: #737E9E;\n}\n\n[part~=contextMenu] {\n  background: #737E9E;\n  border-radius: 0.25rem;\n  width: 12rem;\n  display: flex;\n  flex-direction: column;\n  padding-bottom: 0.25rem;\n}\n\n[part~=contextMenu] > div.section {\n  color: #FFF;\n  font-size: 0.875rem;\n  padding: 0.25rem 0.5rem;\n  cursor: default;\n  font-weight: bold;\n}\n\n[part~=contextMenu] > div.section:not(:first-child) {\n  border-top: 1px solid rgba(255, 255, 255, 0.3);\n  margin-top: 0.5rem;\n}\n\n[part~=contextMenu] > div.group {\n  margin: 0 0.5rem;\n  border: 1px solid rgba(255, 255, 255, 0.2);\n  border-radius: 0.25rem;\n  display: flex;\n  flex-direction: row;\n}\n[part~=contextMenu] > div.row > div.group {\n  border: 1px solid rgba(255, 255, 255, 0.2);\n  border-radius: 0.25rem;\n  display: flex;\n  flex-direction: row;\n  flex: 1;\n}\n\n[part~=contextMenu] > div.row > div.group:first-child {\n  margin-left: 0.5rem;\n  margin-right: 0.25rem;\n}\n\n[part~=contextMenu] > div.row > div.group:last-child {\n  margin-right: 0.5rem;\n}\n\n[part~=contextMenu] > div.group > button,\n[part~=contextMenu] > div.row > div.group > button {\n  display: flex;\n  flex: 1;\n  padding: 0.25rem;\n  justify-content: center;\n  border: 0;\n  margin: 0;\n  background: transparent;\n  color: #FFF;\n  font-size: 1rem;\n  line-height: 1.25rem;\n  align-items: center;\n}\n\n[part~=contextMenu] > div.group > button:first-child,\n[part~=contextMenu] > div.row > div.group > button:first-child {\n  border-radius: 0.125rem 0 0 0.125rem;\n}\n\n[part~=contextMenu] > button {\n  display: flex;\n  border: 0;\n  margin: 0;\n  padding: 0.125rem 0.5rem;\n  background: transparent;\n  text-align: left;\n  color: #FFF;\n  font-size: 1rem;\n}\n\n[part~=contextMenu] div.group > button.active {\n  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3) inset;\n  background: rgba(0, 0, 0, 0.1);\n}\n\n[part~=contextMenu] div.group > button.active:hover {\n  background: rgba(0, 0, 0, 0.2);\n}\n\n[part~=contextMenu] > div.group > button:not(:first-child),\n[part~=contextMenu] > div.row > div.group > button:not(:first-child) {\n  border-left: 1px solid rgba(255, 255, 255, 0.1);\n}\n\n[part~=contextMenu] > div.row > div.group > button > svg,\n[part~=contextMenu] > div.group > button > svg,\n[part~=contextMenu] > div.row > button > svg,\n[part~=contextMenu] > button > svg {\n  width: 1.5rem;\n  height: 1.5rem;\n  align-self: center;\n}\n\n[part~=contextMenu] > div.row > div.group > button:hover,\n[part~=contextMenu] > div.group > button:hover,\n[part~=contextMenu] > button:hover {\n  background: rgba(255, 255, 255, 0.2);\n}\n\n.row {\n  display: flex;\n}\n\n.divider {\n  border-top: 1px solid rgba(255, 255, 255, 0.3);\n  margin-top: 0.5rem;\n  height: 0.5rem;\n}\n\n.black {\n  display: inline-flex;\n  border-radius: 50%;\n  width: 1rem;\n  height: 1rem;\n  background: #000;\n}\n\n.white {\n  display: inline-flex;\n  border-radius: 50%;\n  width: 1rem;\n  height: 1rem;\n  background: #FFF;\n}";

    let MdiGrid = class MdiGrid extends HTMLElement {
        constructor() {
            super(...arguments);
            this.icons = [];
            this.size = 24;
            this.currentCount = 0;
            this.items = [];
            this.svg = 'http://www.w3.org/2000/svg';
            this.debounceRender = debounce(() => this.render(), 300);
            this.resizeObserver = new ResizeObserver(entries => {
                const { width } = entries[0].contentRect;
                const columns = Math.floor(width / (this.size + 20));
                if (this.columns !== columns) {
                    this.columns = columns;
                    this.debounceRender();
                }
            });
            this.index = 0;
        }
        connectedCallback() {
            this.resizeObserver.observe(this.$grid);
            this.addEventListener('mousemove', this.handleTooltip.bind(this));
            this.addEventListener('mouseleave', this.hideTooltip.bind(this));
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
        render() {
            console.log('render');
            const count = this.icons.length;
            // Render more grid items
            for (let i = this.currentCount; i < count; i++) {
                this.currentCount = i + 1;
                const btn = document.createElement('button');
                btn.dataset.index = `${i}`;
                btn.addEventListener('click', () => {
                    this.handleClick(this.icons[i]);
                });
                btn.addEventListener('keydown', (e) => {
                    this.moveFocus(e, i);
                });
                btn.addEventListener('contextmenu', (e) => {
                    this.contextMenu(i);
                });
                const svg = document.createElementNS(this.svg, 'svg');
                svg.setAttribute('viewBox', '0 0 24 24');
                const path = document.createElementNS(this.svg, 'path');
                svg.appendChild(path);
                btn.appendChild(svg);
                this.$grid.appendChild(btn);
                this.items.push([btn, path]);
            }
            const rows = Math.ceil(count / this.columns);
            this.$grid.style.gridTemplateRows = `repeat(${rows}, 2.75rem)`;
            this.items.forEach(([btn, path], i) => {
                if (this.icons[i]) {
                    btn.style.gridColumn = `${(i % this.columns + 1)}`;
                    btn.style.gridRow = `${Math.ceil((i + 1) / this.columns)}`;
                    path.setAttribute('d', this.icons[i].data);
                    this.icons[i].id = i;
                }
                else {
                    path.setAttribute('d', '');
                }
            });
            this.$grid.style.height = `${2.75 * rows}rem`;
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
        contextMenu(index) {
            console.log('contextMenu', index);
        }
        handleClick(icon) {
            this.dispatchEvent(new CustomEvent('select', {
                detail: icon
            }));
        }
        showTooltip(icon, index) {
            this.$tooltipText.innerText = icon.name;
            const { x, y } = this.getPositionFromIndex(index);
            //this.$tooltip.style.gridColumn = `${x + 1}`;
            //this.$tooltip.style.gridRow = `${y + 1}`;
            this.$tooltip.style.left = `${x * 44}px`;
            this.$tooltip.style.top = `${(y * 44 + 5)}px`;
            this.$tooltip.classList.add('visible');
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
        Part()
    ], MdiGrid.prototype, "$grid", void 0);
    __decorate([
        Part()
    ], MdiGrid.prototype, "$tooltip", void 0);
    __decorate([
        Part()
    ], MdiGrid.prototype, "$tooltipText", void 0);
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
