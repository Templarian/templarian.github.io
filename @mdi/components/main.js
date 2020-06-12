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

var template$1 = "<div part=\"list\">\n  <button part=\"close\">\n    <svg viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z\" /></svg>\n  </button>\n  <div part=\"contextMenu\">\n    <svg width=\"174\" height=\"140\" viewBox=\"0 0 174 140\">\n      <path fill=\"#FFFFFF\" fill-opacity=\"1\" stroke-width=\"2\" stroke-linejoin=\"round\" stroke=\"#453C4F\" stroke-opacity=\"1\" d=\"M 14,8L 62,8C 65.3137,8 68,10.6863 68,14L 68,62C 68,65.3137 65.3137,68 62,68L 14,68C 10.6863,68 8,65.3137 8,62L 8,14C 8,10.6863 10.6863,8 14,8 Z \"/>\n      <path fill=\"#453C4F\" fill-opacity=\"1\" stroke-width=\"0.2\" stroke-linejoin=\"round\" d=\"M 38,22C 42.4183,22 46,25.5817 46,30C 46,34.4183 42.4183,38 38,38C 33.5817,38 30,34.4183 30,30C 30,25.5817 33.5817,22 38,22 Z M 38,42C 46.8365,42 54,45.5817 54,50L 54,54L 22,54L 22,50C 22,45.5817 29.1634,42 38,42 Z \"/>\n      <rect x=\"51\" y=\"41\" fill=\"#FFFFFF\" fill-opacity=\"1\" stroke-width=\"2\" stroke-linejoin=\"round\" stroke=\"#453C4F\" stroke-opacity=\"1\" width=\"115\" height=\"90\"/>\n      <g>\n        <path fill=\"#453C4F\" fill-opacity=\"1\" stroke-linejoin=\"round\" d=\"M 72.37,57.9167C 72.37,59.3811 72.1372,60.6422 71.6717,61.7C 71.2061,62.7578 70.5533,63.5856 69.7133,64.1834L 72.4233,66.31L 71.0567,67.57L 67.86,65.0267C 67.36,65.1511 66.8322,65.2134 66.2767,65.2134C 65.0833,65.2134 64.0245,64.92 63.1,64.3334C 62.1756,63.7467 61.4583,62.9106 60.9483,61.825C 60.4383,60.7395 60.1767,59.4811 60.1633,58.05L 60.1633,56.9567C 60.1633,55.5011 60.4167,54.2145 60.9233,53.0967C 61.43,51.9789 62.1467,51.1234 63.0733,50.53C 64,49.9367 65.0611,49.64 66.2567,49.64C 67.4789,49.64 68.5533,49.935 69.48,50.525C 70.4067,51.115 71.12,51.9634 71.62,53.07C 72.12,54.1767 72.37,55.4689 72.37,56.9467L 72.37,57.9167 Z M 70.37,56.9267C 70.37,55.1422 70.0145,53.7661 69.3033,52.7984C 68.5922,51.8306 67.5767,51.3467 66.2567,51.3467C 64.9989,51.3467 64.0072,51.8272 63.2817,52.7884C 62.5561,53.7495 62.1833,55.0834 62.1633,56.79L 62.1633,57.9067C 62.1633,59.64 62.5261,61.0067 63.2517,62.0067C 63.9772,63.0067 64.9856,63.5067 66.2767,63.5067C 67.5678,63.5067 68.5678,63.0367 69.2767,62.0967C 69.9856,61.1567 70.35,59.8078 70.37,58.05L 70.37,56.9267 Z \"/>\n        <path fill=\"#453C4F\" fill-opacity=\"1\" stroke-linejoin=\"round\" d=\"M 82.1233,63.8867C 81.3745,64.7711 80.2733,65.2134 78.82,65.2134C 77.62,65.2134 76.7056,64.8633 76.0767,64.1634C 75.4478,63.4634 75.13,62.4267 75.1233,61.0534L 75.1233,53.6934L 77.05,53.6934L 77.05,60.9534C 77.05,62.6556 77.7445,63.5067 79.1333,63.5067C 80.6067,63.5067 81.5856,62.96 82.07,61.8667L 82.07,53.6934L 84,53.6934L 84,65L 82.1667,65L 82.1233,63.8867 Z \"/>\n        <path fill=\"#453C4F\" fill-opacity=\"1\" stroke-linejoin=\"round\" d=\"M 88.9833,65L 87.0567,65L 87.0567,53.6934L 88.9833,53.6934L 88.9833,65 Z M 86.9,50.7167C 86.9,50.4145 86.9956,50.1595 87.1867,49.9517C 87.3778,49.7439 87.6606,49.64 88.035,49.64C 88.4095,49.64 88.6939,49.7439 88.8883,49.9517C 89.0828,50.1595 89.18,50.4145 89.18,50.7167C 89.18,51.0189 89.0828,51.2706 88.8883,51.4717C 88.6939,51.6728 88.4095,51.7734 88.035,51.7734C 87.6606,51.7734 87.3778,51.6728 87.1867,51.4717C 86.9956,51.2706 86.9,51.0189 86.9,50.7167 Z \"/>\n        <path fill=\"#453C4F\" fill-opacity=\"1\" stroke-linejoin=\"round\" d=\"M 96.5133,63.5067C 97.2,63.5067 97.8006,63.3111 98.315,62.92C 98.8294,62.5289 99.1144,62.04 99.17,61.4534L 100.993,61.4534C 100.958,62.1 100.735,62.715 100.325,63.2984C 99.915,63.8817 99.3683,64.3467 98.685,64.6934C 98.0017,65.04 97.2778,65.2134 96.5133,65.2134C 94.9778,65.2134 93.7572,64.6995 92.8517,63.6717C 91.9461,62.6439 91.4933,61.2367 91.4933,59.45L 91.4933,59.1267C 91.4933,58.0245 91.6945,57.045 92.0967,56.1884C 92.4989,55.3317 93.0767,54.6661 93.83,54.1917C 94.5833,53.7172 95.4745,53.48 96.5033,53.48C 97.7656,53.48 98.8156,53.8584 99.6533,54.615C 100.491,55.3717 100.938,56.3545 100.993,57.5634L 99.17,57.5634C 99.1144,56.87 98.8383,56.3006 98.3417,55.855C 97.845,55.4095 97.2322,55.1867 96.5033,55.1867C 95.5233,55.1867 94.7645,55.5306 94.2267,56.2184C 93.6889,56.9061 93.42,57.9 93.42,59.2L 93.42,59.5534C 93.42,60.82 93.6872,61.7956 94.2217,62.48C 94.7561,63.1645 95.52,63.5067 96.5133,63.5067 Z \"/>\n        <path fill=\"#453C4F\" fill-opacity=\"1\" stroke-linejoin=\"round\" d=\"M 106.27,59.7634L 105.063,61.0267L 105.063,65L 103.137,65L 103.137,49L 105.063,49L 105.063,58.6567L 106.093,57.4134L 109.603,53.6934L 111.947,53.6934L 107.563,58.4167L 112.46,65L 110.197,65L 106.27,59.7634 Z \"/>\n        <path fill=\"#453C4F\" fill-opacity=\"1\" stroke-linejoin=\"round\" d=\"M 72.4267,83.5167C 72.4267,85.0011 72.1767,86.2967 71.6767,87.4034C 71.1767,88.51 70.4683,89.355 69.5517,89.9384C 68.635,90.5217 67.5656,90.8134 66.3433,90.8134C 65.15,90.8134 64.0911,90.52 63.1667,89.9333C 62.2422,89.3467 61.525,88.5106 61.015,87.425C 60.505,86.3395 60.2433,85.0811 60.23,83.65L 60.23,82.5567C 60.23,81.1011 60.4833,79.8145 60.99,78.6967C 61.4967,77.5789 62.2133,76.7234 63.14,76.13C 64.0667,75.5367 65.1278,75.24 66.3233,75.24C 67.5389,75.24 68.61,75.5333 69.5367,76.12C 70.4633,76.7067 71.1767,77.5567 71.6767,78.67C 72.1767,79.7834 72.4267,81.0789 72.4267,82.5567L 72.4267,83.5167 Z M 70.4367,82.5267C 70.4367,80.7289 70.0756,79.3495 69.3533,78.3884C 68.6311,77.4272 67.6211,76.9467 66.3233,76.9467C 65.0589,76.9467 64.0639,77.4272 63.3383,78.3884C 62.6128,79.3495 62.24,80.6833 62.22,82.39L 62.22,83.5067C 62.22,85.2489 62.5861,86.6178 63.3183,87.6134C 64.0506,88.6089 65.0589,89.1067 66.3433,89.1067C 67.6345,89.1067 68.6345,88.6367 69.3433,87.6967C 70.0522,86.7567 70.4167,85.4078 70.4367,83.65L 70.4367,82.5267 Z \"/>\n        <path fill=\"#453C4F\" fill-opacity=\"1\" stroke-linejoin=\"round\" d=\"M 84.69,85.0733C 84.69,86.7956 84.2978,88.1828 83.5133,89.235C 82.7289,90.2872 81.6656,90.8134 80.3233,90.8134C 78.9567,90.8134 77.8811,90.3778 77.0967,89.5067L 77.0967,94.8667L 75.17,94.8667L 75.17,79.2934L 76.93,79.2934L 77.0233,80.5434C 77.8078,79.5678 78.8978,79.08 80.2933,79.08C 81.6467,79.08 82.7178,79.5922 83.5067,80.6167C 84.2956,81.6411 84.69,83.0667 84.69,84.8934L 84.69,85.0733 Z M 82.7633,84.8233C 82.7633,83.5767 82.4922,82.5922 81.95,81.87C 81.4078,81.1478 80.6645,80.7867 79.72,80.7867C 78.5533,80.7867 77.6789,81.2945 77.0967,82.31L 77.0967,87.5934C 77.6722,88.6022 78.5533,89.1067 79.74,89.1067C 80.6645,89.1067 81.3995,88.7472 81.945,88.0284C 82.4906,87.3095 82.7633,86.2411 82.7633,84.8233 Z \"/>\n        <path fill=\"#453C4F\" fill-opacity=\"1\" stroke-linejoin=\"round\" d=\"M 89.7733,76.52L 89.7733,79.2934L 91.8767,79.2934L 91.8767,81L 89.7733,81L 89.7733,87.79C 89.7733,88.23 89.8672,88.5595 90.055,88.7784C 90.2428,88.9972 90.5622,89.1067 91.0133,89.1067C 91.2356,89.1067 91.5411,89.0645 91.93,88.98L 91.93,90.5967C 91.4233,90.7411 90.93,90.8134 90.45,90.8134C 89.59,90.8134 88.9411,90.5578 88.5033,90.0467C 88.0656,89.5356 87.8467,88.8089 87.8467,87.8667L 87.8467,81L 85.7933,81L 85.7933,79.2934L 87.8467,79.2934L 87.8467,76.52L 89.7733,76.52 Z \"/>\n        <path fill=\"#453C4F\" fill-opacity=\"1\" stroke-linejoin=\"round\" d=\"M 96.2367,90.6L 94.31,90.6L 94.31,79.2934L 96.2367,79.2934L 96.2367,90.6 Z M 94.1533,76.3167C 94.1533,76.0145 94.2489,75.7595 94.44,75.5517C 94.6311,75.3439 94.9139,75.24 95.2883,75.24C 95.6628,75.24 95.9472,75.3439 96.1417,75.5517C 96.3361,75.7595 96.4333,76.0145 96.4333,76.3167C 96.4333,76.6189 96.3361,76.8706 96.1417,77.0717C 95.9472,77.2728 95.6628,77.3734 95.2883,77.3734C 94.9139,77.3734 94.6311,77.2728 94.44,77.0717C 94.2489,76.8706 94.1533,76.6189 94.1533,76.3167 Z \"/>\n        <path fill=\"#453C4F\" fill-opacity=\"1\" stroke-linejoin=\"round\" d=\"M 98.77,84.8434C 98.77,83.7345 98.9872,82.7372 99.4217,81.8517C 99.8561,80.9661 100.461,80.2828 101.235,79.8017C 102.009,79.3206 102.893,79.08 103.887,79.08C 105.42,79.08 106.661,79.6134 107.61,80.68C 108.559,81.7467 109.033,83.1656 109.033,84.9367L 109.033,85.0733C 109.033,86.1734 108.823,87.1611 108.402,88.0367C 107.981,88.9122 107.379,89.5939 106.598,90.0817C 105.817,90.5695 104.92,90.8134 103.907,90.8134C 102.38,90.8134 101.142,90.28 100.193,89.2133C 99.2444,88.1467 98.77,86.7345 98.77,84.9767L 98.77,84.8434 Z M 100.71,85.0634C 100.71,86.2834 101,87.2622 101.58,88C 102.16,88.7378 102.936,89.1067 103.907,89.1067C 104.887,89.1067 105.664,88.7322 106.24,87.9834C 106.816,87.2345 107.103,86.1867 107.103,84.84C 107.103,83.6356 106.81,82.6589 106.223,81.91C 105.637,81.1611 104.858,80.7867 103.887,80.7867C 102.936,80.7867 102.168,81.1556 101.585,81.8934C 101.002,82.6311 100.71,83.6878 100.71,85.0634 Z \"/>\n        <path fill=\"#453C4F\" fill-opacity=\"1\" stroke-linejoin=\"round\" d=\"M 113.247,79.2934L 113.31,80.71C 114.172,79.6234 115.298,79.08 116.687,79.08C 119.069,79.08 120.27,80.4289 120.29,83.1267L 120.29,90.6L 118.363,90.6L 118.363,83.1633C 118.357,82.3545 118.171,81.7561 117.807,81.3683C 117.442,80.9806 116.874,80.7867 116.103,80.7867C 115.477,80.7867 114.927,80.9528 114.455,81.285C 113.983,81.6172 113.616,82.0533 113.353,82.5934L 113.353,90.6L 111.427,90.6L 111.427,79.2934L 113.247,79.2934 Z \"/>\n        <path fill=\"#453C4F\" fill-opacity=\"1\" stroke-linejoin=\"round\" d=\"M 129.787,87.53C 129.787,87.0233 129.591,86.63 129.198,86.35C 128.806,86.07 128.122,85.8289 127.147,85.6267C 126.171,85.4245 125.397,85.1767 124.823,84.8833C 124.25,84.59 123.827,84.2417 123.553,83.8383C 123.28,83.435 123.143,82.9545 123.143,82.3967C 123.143,81.4678 123.534,80.6828 124.315,80.0417C 125.096,79.4006 126.094,79.08 127.31,79.08C 128.588,79.08 129.624,79.41 130.418,80.07C 131.213,80.73 131.61,81.5733 131.61,82.6L 129.673,82.6C 129.673,82.1067 129.449,81.6811 129.002,81.3233C 128.554,80.9656 127.99,80.7867 127.31,80.7867C 126.608,80.7867 126.059,80.9278 125.663,81.21C 125.268,81.4922 125.07,81.8611 125.07,82.3167C 125.07,82.7478 125.254,83.0722 125.622,83.29C 125.989,83.5078 126.654,83.7267 127.617,83.9467C 128.579,84.1667 129.358,84.4295 129.955,84.735C 130.552,85.0406 130.994,85.4078 131.282,85.8367C 131.569,86.2656 131.713,86.7889 131.713,87.4067C 131.713,88.4356 131.311,89.2606 130.505,89.8817C 129.699,90.5028 128.654,90.8134 127.37,90.8134C 126.468,90.8134 125.669,90.6539 124.975,90.335C 124.281,90.0161 123.737,89.57 123.345,88.9967C 122.953,88.4234 122.757,87.8033 122.757,87.1367L 124.683,87.1367C 124.719,87.7411 124.978,88.2206 125.46,88.575C 125.942,88.9295 126.579,89.1067 127.37,89.1067C 128.099,89.1067 128.684,88.9633 129.125,88.6767C 129.566,88.39 129.787,88.0078 129.787,87.53 Z \"/>\n      </g>\n      <line fill=\"none\" stroke-linejoin=\"round\" stroke=\"#453C4F\" stroke-opacity=\"1\" x1=\"51\" y1=\"101\" x2=\"167\" y2=\"101\"/>\n      <g>\n        <path fill=\"#453C4F\" fill-opacity=\"1\" stroke-linejoin=\"round\" d=\"M 64.3433,107.853L 69.3033,120.213L 74.26,107.853L 76.8533,107.853L 76.8533,123L 74.8533,123L 74.8533,117.1L 75.0433,110.733L 70.0633,123L 68.53,123L 63.5633,110.767L 63.76,117.103L 63.76,123L 61.76,123L 61.76,107.853L 64.3433,107.853 Z \"/>\n        <path fill=\"#453C4F\" fill-opacity=\"1\" stroke-linejoin=\"round\" d=\"M 84.6967,123.213C 83.1678,123.213 81.9245,122.709 80.9667,121.702C 80.0089,120.694 79.53,119.347 79.53,117.66L 79.53,117.303C 79.53,116.181 79.7433,115.179 80.17,114.298C 80.5967,113.417 81.1939,112.727 81.9617,112.228C 82.7295,111.729 83.5611,111.48 84.4567,111.48C 85.9211,111.48 87.0594,111.979 87.8717,112.977C 88.6839,113.974 89.09,115.403 89.09,117.263L 89.09,118.093L 81.4567,118.093C 81.4833,119.113 81.8078,119.937 82.43,120.565C 83.0522,121.193 83.8422,121.507 84.8,121.507C 85.48,121.507 86.0561,121.379 86.5283,121.123C 87.0006,120.868 87.4145,120.529 87.77,120.107L 88.9467,121.027C 88.0022,122.484 86.5856,123.213 84.6967,123.213 Z M 84.4567,113.187C 83.6789,113.187 83.0261,113.467 82.4983,114.028C 81.9706,114.589 81.6444,115.376 81.52,116.387L 87.1633,116.387L 87.1633,116.243C 87.1078,115.272 86.8439,114.52 86.3717,113.987C 85.8995,113.453 85.2611,113.187 84.4567,113.187 Z \"/>\n        <path fill=\"#453C4F\" fill-opacity=\"1\" stroke-linejoin=\"round\" d=\"M 93.1267,111.693L 93.19,113.11C 94.0522,112.023 95.1778,111.48 96.5667,111.48C 98.9489,111.48 100.15,112.829 100.17,115.527L 100.17,123L 98.2433,123L 98.2433,115.563C 98.2367,114.754 98.0511,114.156 97.6867,113.768C 97.3222,113.381 96.7544,113.187 95.9833,113.187C 95.3567,113.187 94.8072,113.353 94.335,113.685C 93.8628,114.017 93.4956,114.453 93.2333,114.993L 93.2333,123L 91.3067,123L 91.3067,111.693L 93.1267,111.693 Z \"/>\n        <path fill=\"#453C4F\" fill-opacity=\"1\" stroke-linejoin=\"round\" d=\"M 110.003,121.887C 109.254,122.771 108.153,123.213 106.7,123.213C 105.5,123.213 104.586,122.863 103.957,122.163C 103.328,121.463 103.01,120.427 103.003,119.053L 103.003,111.693L 104.93,111.693L 104.93,118.953C 104.93,120.656 105.624,121.507 107.013,121.507C 108.487,121.507 109.466,120.96 109.95,119.867L 109.95,111.693L 111.88,111.693L 111.88,123L 110.047,123L 110.003,121.887 Z \"/>\n      </g>\n    </svg>\n    <div class=\"text\">Right Click the Grid</div>\n  </div>\n  <div part=\"extension\">\n    <a class=\"chrome\" title=\"Download Chrome Extension\" href=\"https://chrome.google.com/webstore/detail/materialdesignicons-picke/edjaedpifkihpjkcgknfokmibkoafhme\" target=\"_blank\">\n      <svg viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M12,20L15.46,14H15.45C15.79,13.4 16,12.73 16,12C16,10.8 15.46,9.73 14.62,9H19.41C19.79,9.93 20,10.94 20,12A8,8 0 0,1 12,20M4,12C4,10.54 4.39,9.18 5.07,8L8.54,14H8.55C9.24,15.19 10.5,16 12,16C12.45,16 12.88,15.91 13.29,15.77L10.89,19.91C7,19.37 4,16.04 4,12M15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9A3,3 0 0,1 15,12M12,4C14.96,4 17.54,5.61 18.92,8H12C10.06,8 8.45,9.38 8.08,11.21L5.7,7.08C7.16,5.21 9.44,4 12,4M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z\" /></svg>\n    </a>\n    <a class=\"firefox\" title=\"Download Firefox Addon\" href=\"https://addons.mozilla.org/en-US/firefox/addon/materialdesignicons-picker/\" target=\"_blank\">\n      <svg viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M9.27 7.94C9.27 7.94 9.27 7.94 9.27 7.94M6.85 6.74C6.86 6.74 6.86 6.74 6.85 6.74M21.28 8.6C20.85 7.55 19.96 6.42 19.27 6.06C19.83 7.17 20.16 8.28 20.29 9.1L20.29 9.12C19.16 6.3 17.24 5.16 15.67 2.68C15.59 2.56 15.5 2.43 15.43 2.3C15.39 2.23 15.36 2.16 15.32 2.09C15.26 1.96 15.2 1.83 15.17 1.69C15.17 1.68 15.16 1.67 15.15 1.67H15.13L15.12 1.67L15.12 1.67L15.12 1.67C12.9 2.97 11.97 5.26 11.74 6.71C11.05 6.75 10.37 6.92 9.75 7.22C9.63 7.27 9.58 7.41 9.62 7.53C9.67 7.67 9.83 7.74 9.96 7.68C10.5 7.42 11.1 7.27 11.7 7.23L11.75 7.23C11.83 7.22 11.92 7.22 12 7.22C12.5 7.21 12.97 7.28 13.44 7.42L13.5 7.44C13.6 7.46 13.67 7.5 13.75 7.5C13.8 7.54 13.86 7.56 13.91 7.58L14.05 7.64C14.12 7.67 14.19 7.7 14.25 7.73C14.28 7.75 14.31 7.76 14.34 7.78C14.41 7.82 14.5 7.85 14.54 7.89C14.58 7.91 14.62 7.94 14.66 7.96C15.39 8.41 16 9.03 16.41 9.77C15.88 9.4 14.92 9.03 14 9.19C17.6 11 16.63 17.19 11.64 16.95C11.2 16.94 10.76 16.85 10.34 16.7C10.24 16.67 10.14 16.63 10.05 16.58C10 16.56 9.93 16.53 9.88 16.5C8.65 15.87 7.64 14.68 7.5 13.23C7.5 13.23 8 11.5 10.83 11.5C11.14 11.5 12 10.64 12.03 10.4C12.03 10.31 10.29 9.62 9.61 8.95C9.24 8.59 9.07 8.42 8.92 8.29C8.84 8.22 8.75 8.16 8.66 8.1C8.43 7.3 8.42 6.45 8.63 5.65C7.6 6.12 6.8 6.86 6.22 7.5H6.22C5.82 7 5.85 5.35 5.87 5C5.86 5 5.57 5.16 5.54 5.18C5.19 5.43 4.86 5.71 4.56 6C4.21 6.37 3.9 6.74 3.62 7.14C3 8.05 2.5 9.09 2.28 10.18C2.28 10.19 2.18 10.59 2.11 11.1L2.08 11.33C2.06 11.5 2.04 11.65 2 11.91L2 11.94L2 12.27L2 12.32C2 17.85 6.5 22.33 12 22.33C16.97 22.33 21.08 18.74 21.88 14C21.9 13.89 21.91 13.76 21.93 13.63C22.13 11.91 21.91 10.11 21.28 8.6Z\" /></svg>\n    </a>\n    <div class=\"text\">Browser Extension</div>\n  </div>\n  <div part=\"react\">\n    <a href=\"/react\">\n      <svg class=\"file\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M12,10.11C13.03,10.11 13.87,10.95 13.87,12C13.87,13 13.03,13.85 12,13.85C10.97,13.85 10.13,13 10.13,12C10.13,10.95 10.97,10.11 12,10.11M7.37,20C8,20.38 9.38,19.8 10.97,18.3C10.45,17.71 9.94,17.07 9.46,16.4C8.64,16.32 7.83,16.2 7.06,16.04C6.55,18.18 6.74,19.65 7.37,20M8.08,14.26L7.79,13.75C7.68,14.04 7.57,14.33 7.5,14.61C7.77,14.67 8.07,14.72 8.38,14.77C8.28,14.6 8.18,14.43 8.08,14.26M14.62,13.5L15.43,12L14.62,10.5C14.32,9.97 14,9.5 13.71,9.03C13.17,9 12.6,9 12,9C11.4,9 10.83,9 10.29,9.03C10,9.5 9.68,9.97 9.38,10.5L8.57,12L9.38,13.5C9.68,14.03 10,14.5 10.29,14.97C10.83,15 11.4,15 12,15C12.6,15 13.17,15 13.71,14.97C14,14.5 14.32,14.03 14.62,13.5M12,6.78C11.81,7 11.61,7.23 11.41,7.5C11.61,7.5 11.8,7.5 12,7.5C12.2,7.5 12.39,7.5 12.59,7.5C12.39,7.23 12.19,7 12,6.78M12,17.22C12.19,17 12.39,16.77 12.59,16.5C12.39,16.5 12.2,16.5 12,16.5C11.8,16.5 11.61,16.5 11.41,16.5C11.61,16.77 11.81,17 12,17.22M16.62,4C16,3.62 14.62,4.2 13.03,5.7C13.55,6.29 14.06,6.93 14.54,7.6C15.36,7.68 16.17,7.8 16.94,7.96C17.45,5.82 17.26,4.35 16.62,4M15.92,9.74L16.21,10.25C16.32,9.96 16.43,9.67 16.5,9.39C16.23,9.33 15.93,9.28 15.62,9.23C15.72,9.4 15.82,9.57 15.92,9.74M17.37,2.69C18.84,3.53 19,5.74 18.38,8.32C20.92,9.07 22.75,10.31 22.75,12C22.75,13.69 20.92,14.93 18.38,15.68C19,18.26 18.84,20.47 17.37,21.31C15.91,22.15 13.92,21.19 12,19.36C10.08,21.19 8.09,22.15 6.62,21.31C5.16,20.47 5,18.26 5.62,15.68C3.08,14.93 1.25,13.69 1.25,12C1.25,10.31 3.08,9.07 5.62,8.32C5,5.74 5.16,3.53 6.62,2.69C8.09,1.85 10.08,2.81 12,4.64C13.92,2.81 15.91,1.85 17.37,2.69M17.08,12C17.42,12.75 17.72,13.5 17.97,14.26C20.07,13.63 21.25,12.73 21.25,12C21.25,11.27 20.07,10.37 17.97,9.74C17.72,10.5 17.42,11.25 17.08,12M6.92,12C6.58,11.25 6.28,10.5 6.03,9.74C3.93,10.37 2.75,11.27 2.75,12C2.75,12.73 3.93,13.63 6.03,14.26C6.28,13.5 6.58,12.75 6.92,12M15.92,14.26C15.82,14.43 15.72,14.6 15.62,14.77C15.93,14.72 16.23,14.67 16.5,14.61C16.43,14.33 16.32,14.04 16.21,13.75L15.92,14.26M13.03,18.3C14.62,19.8 16,20.38 16.62,20C17.26,19.65 17.45,18.18 16.94,16.04C16.17,16.2 15.36,16.32 14.54,16.4C14.06,17.07 13.55,17.71 13.03,18.3M8.08,9.74C8.18,9.57 8.28,9.4 8.38,9.23C8.07,9.28 7.77,9.33 7.5,9.39C7.57,9.67 7.68,9.96 7.79,10.25L8.08,9.74M10.97,5.7C9.38,4.2 8,3.62 7.37,4C6.74,4.35 6.55,5.82 7.06,7.96C7.83,7.8 8.64,7.68 9.46,7.6C9.94,6.93 10.45,6.29 10.97,5.7Z\" /></svg>\n      <span class=\"link-text\">Guide</span>\n      <svg class=\"link\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M10.59,13.41C11,13.8 11,14.44 10.59,14.83C10.2,15.22 9.56,15.22 9.17,14.83C7.22,12.88 7.22,9.71 9.17,7.76V7.76L12.71,4.22C14.66,2.27 17.83,2.27 19.78,4.22C21.73,6.17 21.73,9.34 19.78,11.29L18.29,12.78C18.3,11.96 18.17,11.14 17.89,10.36L18.36,9.88C19.54,8.71 19.54,6.81 18.36,5.64C17.19,4.46 15.29,4.46 14.12,5.64L10.59,9.17C9.41,10.34 9.41,12.24 10.59,13.41M13.41,9.17C13.8,8.78 14.44,8.78 14.83,9.17C16.78,11.12 16.78,14.29 14.83,16.24V16.24L11.29,19.78C9.34,21.73 6.17,21.73 4.22,19.78C2.27,17.83 2.27,14.66 4.22,12.71L5.71,11.22C5.7,12.04 5.83,12.86 6.11,13.65L5.64,14.12C4.46,15.29 4.46,17.19 5.64,18.36C6.81,19.54 8.71,19.54 9.88,18.36L13.41,14.83C14.59,13.66 14.59,11.76 13.41,10.59C13,10.2 13,9.56 13.41,9.17Z\" /></svg>\n    </a>\n    <code>npm install @mdi/react</code>\n  </div>\n  <div part=\"upgrade\">\n    <a href=\"/upgrade\">\n      <svg class=\"file\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M15,18V16H6V18H15M18,14V12H6V14H18Z\" /></svg>\n      <span class=\"link-text\">Guide</span>\n      <svg class=\"link\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M10.59,13.41C11,13.8 11,14.44 10.59,14.83C10.2,15.22 9.56,15.22 9.17,14.83C7.22,12.88 7.22,9.71 9.17,7.76V7.76L12.71,4.22C14.66,2.27 17.83,2.27 19.78,4.22C21.73,6.17 21.73,9.34 19.78,11.29L18.29,12.78C18.3,11.96 18.17,11.14 17.89,10.36L18.36,9.88C19.54,8.71 19.54,6.81 18.36,5.64C17.19,4.46 15.29,4.46 14.12,5.64L10.59,9.17C9.41,10.34 9.41,12.24 10.59,13.41M13.41,9.17C13.8,8.78 14.44,8.78 14.83,9.17C16.78,11.12 16.78,14.29 14.83,16.24V16.24L11.29,19.78C9.34,21.73 6.17,21.73 4.22,19.78C2.27,17.83 2.27,14.66 4.22,12.71L5.71,11.22C5.7,12.04 5.83,12.86 6.11,13.65L5.64,14.12C4.46,15.29 4.46,17.19 5.64,18.36C6.81,19.54 8.71,19.54 9.88,18.36L13.41,14.83C14.59,13.66 14.59,11.76 13.41,10.59C13,10.2 13,9.56 13.41,9.17Z\" /></svg>\n    </a>\n    <div class=\"text\">Update to Latest</div>\n  </div>\n</div>";

var style$1 = ":host {\n  display: block;\n  font-family: var(--mdi-font-family);\n}\n\n[part~=list] {\n  width: 12rem;\n  font-size: 1rem;\n}\n\n[part~=list] > div {\n  display: none;\n}\n\n[part~=list] > div.show {\n  display: grid;\n  padding: 0.5rem;\n  border: 1px solid #fff;\n  border-radius: 0.25rem;\n  background: #fff;\n  box-shadow: 0 1px 0.5rem rgba(0, 0, 0, 0.3);\n}\n\n[part~=close] {\n  position: relative;\n  left: 11.25rem;\n  width: 1.5rem;\n  height: 1.5rem;\n  border: 1px solid #fff;\n  border-radius: 50%;\n  background: #fff;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  top: 0.75rem;\n  box-shadow: 0 1px 0.25rem rgba(0, 0, 0, 0.4);\n  padding: 0;\n  color: rgba(69, 60, 79, 0.8);\n  outline: none;\n}\n\n[part~=close]:hover {\n  color: #453C4F;\n  border-color: rgba(69, 60, 79, 0.6);\n}\n\n[part~=close]:active {\n  box-shadow: 0 1px 0.25rem rgba(0, 0, 0, 0.2);\n  border-color: rgba(69, 60, 79, 0.9);\n}\n\n[part~=close] svg {\n  width: 1rem;\n  height: 1rem;\n}\n\n[part=extension] {\n  display: grid;\n  grid-template-rows: auto auto;\n  grid-template-columns: 1fr 1fr;\n  color: #453C4F;\n}\n\n[part=extension] a.chrome {\n  display: flex;\n  grid-row: 1;\n  grid-column: 1;\n  color: #453C4F;\n  border: 1px solid #453C4F;\n  border-radius: 0.25rem;\n  padding: 0.4rem 0.9rem;\n  justify-self: center;\n  text-align: center;\n  margin: 0.25rem;\n}\n\n[part=extension] a.firefox {\n  display: flex;\n  grid-row: 1;\n  grid-column: 2;\n  color: #453C4F;\n  border: 1px solid #453C4F;\n  border-radius: 0.25rem;\n  padding: 0.4rem 0.9rem;\n  justify-self: center;\n  text-align: center;\n  margin: 0.25rem;\n}\n\n[part=extension] a.chrome:hover,\n[part=extension] a.firefox:hover {\n  color: #fff;\n  background: #453C4F;\n}\n\n[part=extension] a svg {\n  width: 2rem;\n  height: 2rem;\n}\n\n[part=extension] div.text {\n  grid-row: 2;\n  grid-column: 1 / span 2;\n  text-align: center;\n  margin-top: 0.25rem;\n  font-weight: bold;\n  cursor: default;\n}\n\n[part=contextMenu] {\n  color: #453C4F;\n}\n\n[part=contextMenu] div.text {\n  text-align: center;\n  margin-top: 0.25rem;\n  font-weight: bold;\n  cursor: default;\n}\n\n[part=react] code {\n  padding: 0.5rem;\n  background: #222;\n  border-radius: 0.25rem;\n  color: #FFF;\n  font-size: 12px;\n  text-align: center;\n  margin: 0.25rem;\n}\n\n[part=react] a {\n  display: grid;\n  position: relative;\n  grid-row: 1;\n  grid-column: 1;\n  grid-template-rows: auto 2rem;\n  grid-template-columns: auto;\n  color: #453C4F;\n  border: 1px solid #453C4F;\n  border-radius: 0.25rem;\n  padding: 0.5rem 0 0 0;\n  margin: 0.25rem;\n  text-decoration: none;\n}\n\n[part=react] a:hover,\n[part=react] a:hover {\n  color: #fff;\n  background: #453C4F;\n}\n\n[part=react] a svg.link {\n  width: 1.5rem;\n  height: 1.5rem;\n  position: absolute;\n  bottom: 0.5rem;\n  right: 0.5rem;\n}\n\n[part=react] a svg.file {\n  width: 4rem;\n  height: 4rem;\n  grid-row: 1;\n  grid-column: 1;\n  justify-self: center;\n}\n\n[part=react] a .link-text {\n  grid-row: 2;\n  grid-column: 1;\n  text-align: center;\n  font-weight: bold;\n}\n\n/* Upgrade */\n\n[part=upgrade] {\n  grid-template-rows: auto auto;\n  color: #453C4F;\n}\n\n[part=upgrade] div.text {\n  grid-row: 2;\n  grid-column: 1;\n  text-align: center;\n  margin-top: 0.25rem;\n  font-weight: bold;\n  cursor: default;\n}\n\n[part=upgrade] a {\n  display: grid;\n  position: relative;\n  grid-row: 1;\n  grid-column: 1;\n  grid-template-rows: auto 2rem;\n  grid-template-columns: auto;\n  color: #453C4F;\n  border: 1px solid #453C4F;\n  border-radius: 0.25rem;\n  padding: 0.5rem 0 0 0;\n  margin: 0.25rem;\n  text-decoration: none;\n}\n\n[part=upgrade] a:hover,\n[part=upgrade] a:hover {\n  color: #fff;\n  background: #453C4F;\n}\n\n[part=upgrade] a svg.link {\n  width: 1.5rem;\n  height: 1.5rem;\n  position: absolute;\n  bottom: 0.5rem;\n  right: 0.5rem;\n}\n\n[part=upgrade] a svg.file {\n  width: 4rem;\n  height: 4rem;\n  grid-row: 1;\n  grid-column: 1;\n  justify-self: center;\n}\n\n[part=upgrade] a .link-text {\n  grid-row: 2;\n  grid-column: 1;\n  text-align: center;\n  font-weight: bold;\n}";

let MdiAnnoy = class MdiAnnoy extends HTMLElement {
    constructor() {
        super(...arguments);
        this.list = [
            'contextMenu',
            'extension',
            'react',
            'upgrade'
        ];
    }
    connectedCallback() {
        let next = this.list.findIndex(name => name === this.current) + 1;
        if (next >= this.list.length) {
            next = 0;
        }
        this.current = this.list[next];
        this[`$${this.current}`].classList.add('show');
        this.$close.addEventListener('click', () => {
            this.$list.style.display = 'none';
        });
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
__decorate([
    Part()
], MdiAnnoy.prototype, "$upgrade", void 0);
__decorate([
    Part()
], MdiAnnoy.prototype, "$close", void 0);
__decorate([
    Part()
], MdiAnnoy.prototype, "$list", void 0);
MdiAnnoy = __decorate([
    Component({
        selector: 'mdi-annoy',
        style: style$1,
        template: template$1
    })
], MdiAnnoy);

var template$2 = "<svg class=\"top\" viewBox=\"0 0 1000 20\">\n  <path fill=\"#F9D9A0\" fill-opacity=\"1\" stroke-linejoin=\"round\" d=\"M 1000,10L -4.35511e-005,20L -4.35511e-005,1.90735e-006L 1000,1.90735e-006L 1000,10 Z \"/>\n</svg>\n<slot></slot>\n<svg class=\"bottom\" viewBox=\"0 0 1000 20\">\n\t<path fill=\"#F9D9A0\" fill-opacity=\"1\" stroke-linejoin=\"round\" d=\"M 0,10L 1000,0L 1000,20L 0,20L 0,10 Z \"/>\n\t<linearGradient id=\"SVGID_Fill1_\" gradientUnits=\"objectBoundingBox\" x1=\"0.00104167\" y1=\"0.499994\" x2=\"0.500527\" y2=\"0.499994\" gradientTransform=\"rotate(63.411339 0.001042 0.499994)\">\n\t\t<stop offset=\"0\" stop-color=\"#000000\" stop-opacity=\"0.34902\"/>\n\t\t<stop offset=\"0.10559\" stop-color=\"#000000\" stop-opacity=\"0.301961\"/>\n\t\t<stop offset=\"0.195652\" stop-color=\"#000000\" stop-opacity=\"0.2\"/>\n\t\t<stop offset=\"0.304348\" stop-color=\"#000000\" stop-opacity=\"0.129412\"/>\n\t\t<stop offset=\"0.403727\" stop-color=\"#000000\" stop-opacity=\"0.101961\"/>\n\t\t<stop offset=\"0.503106\" stop-color=\"#000000\" stop-opacity=\"0.0509804\"/>\n\t\t<stop offset=\"0.596273\" stop-color=\"#000000\" stop-opacity=\"0.0509804\"/>\n\t\t<stop offset=\"0.704969\" stop-color=\"#000000\" stop-opacity=\"0.0156863\"/>\n\t\t<stop offset=\"1\" stop-color=\"#000000\" stop-opacity=\"0\"/>\n\t</linearGradient>\n\t<path fill=\"url(#SVGID_Fill1_)\" stroke-linejoin=\"round\" d=\"M -1.33594e-021,10L 1000,-0.0206203L 1000,9.97938L 1.33595e-021,20L -1.33594e-021,10 Z \"/>\n</svg>";

var style$2 = ":host {\n  display: block;\n  background: linear-gradient(135deg, #ffffff 0%,#f6ede4 100%);\n}\n.top {\n  width: 100%;\n  vertical-align: top;\n}\n.bottom {\n  width: 100%;\n  vertical-align: bottom;\n}";

let MdiBody = class MdiBody extends HTMLElement {
};
MdiBody = __decorate([
    Component({
        selector: 'mdi-body',
        style: style$2,
        template: template$2
    })
], MdiBody);

var template$3 = "<button part=\"button\" class=\"base\"><slot></slot></button>";

var style$3 = "[part~=button] {\n  display: inline-flex;\n  align-items: center;\n  font-family: var(--mdi-font-family);\n  font-size: 1rem;\n  line-height: 1.5rem;\n}\n\n[part~=button]:hover {\n  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);\n}\n\n[part~=button].base {\n  border: 1px solid #4281E9;\n  background: #4281E9;\n  color: #FFF;\n  padding: 0.25rem 0.5rem;\n  border-radius: 0.25rem;\n  outline: none;\n  --mdi-icon-color: #FFF;\n}\n\n[part~=button].base:hover {\n  background-color: #4F8FF9;\n}\n\n[part~=button].base-inverse {\n  border: 1px solid #F1F1F1;\n  background: #FFF;\n  color: #4281E9;\n  padding: 0.25rem 0.5rem;\n  border-radius: 0.25rem;\n  outline: none;\n  --mdi-icon-color: #4281E9;\n}";

const DEFAULT_VARIANT = 'base';
let MdiButton = class MdiButton extends HTMLElement {
    constructor() {
        super(...arguments);
        this.variant = DEFAULT_VARIANT;
        this.oldVariant = DEFAULT_VARIANT;
    }
    connectedCallback() {
        this.$button.addEventListener('click', (e) => this.dispatchEvent(new CustomEvent('click')));
    }
    render() {
        if (this.variant != this.oldVariant) {
            this.$button.classList.replace(this.oldVariant, this.variant);
            this.oldVariant = this.variant;
        }
    }
};
__decorate([
    Prop()
], MdiButton.prototype, "variant", void 0);
__decorate([
    Part()
], MdiButton.prototype, "$button", void 0);
MdiButton = __decorate([
    Component({
        selector: 'mdi-button',
        style: style$3,
        template: template$3
    })
], MdiButton);
var MdiButton$1 = MdiButton;

const SWATCHES = [{
        name: 'Red',
        camel: 'red',
        colors: [
            { name: '50', hex: 'FFEBEE' },
            { name: '100', hex: 'FFCDD2' },
            { name: '200', hex: 'EF9A9A' },
            { name: '300', hex: 'E57373' },
            { name: '400', hex: 'EF5350' },
            { name: '500', hex: 'F44336' },
            { name: '600', hex: 'E53935' },
            { name: '700', hex: 'D32F2F' },
            { name: '800', hex: 'C62828' },
            { name: '900', hex: 'B71C1C' },
            { name: 'A100', hex: 'FF8A80' },
            { name: 'A200', hex: 'FF5252' },
            { name: 'A400', hex: 'FF1744' },
            { name: 'A700', hex: 'D50000' }
        ]
    }, {
        name: 'Pink',
        camel: 'pink',
        colors: [
            { name: '50', hex: 'FCE4EC' },
            { name: '100', hex: 'F8BBD0' },
            { name: '200', hex: 'F48FB1' },
            { name: '300', hex: 'F06292' },
            { name: '400', hex: 'EC407A' },
            { name: '500', hex: 'E91E63' },
            { name: '600', hex: 'D81B60' },
            { name: '700', hex: 'C2185B' },
            { name: '800', hex: 'AD1457' },
            { name: '900', hex: '880E4F' },
            { name: 'A100', hex: 'FF80AB' },
            { name: 'A200', hex: 'FF4081' },
            { name: 'A400', hex: 'F50057' },
            { name: 'A700', hex: 'C51162' }
        ]
    }, {
        name: 'Purple',
        camel: 'purple',
        colors: [
            { name: '50', hex: 'F3E5F5' },
            { name: '100', hex: 'E1BEE7' },
            { name: '200', hex: 'CE93D8' },
            { name: '300', hex: 'BA68C8' },
            { name: '400', hex: 'AB47BC' },
            { name: '500', hex: '9C27B0' },
            { name: '600', hex: '8E24AA' },
            { name: '700', hex: '7B1FA2' },
            { name: '800', hex: '6A1B9A' },
            { name: '900', hex: '4A148C' },
            { name: 'A100', hex: 'EA80FC' },
            { name: 'A200', hex: 'E040FB' },
            { name: 'A400', hex: 'D500F9' },
            { name: 'A700', hex: 'AA00FF' }
        ]
    }, {
        name: 'Deep Purple',
        camel: 'deepPurple',
        colors: [
            { name: '50', hex: 'EDE7F6' },
            { name: '100', hex: 'D1C4E9' },
            { name: '200', hex: 'B39DDB' },
            { name: '300', hex: '9575CD' },
            { name: '400', hex: '7E57C2' },
            { name: '500', hex: '673AB7' },
            { name: '600', hex: '5E35B1' },
            { name: '700', hex: '512DA8' },
            { name: '800', hex: '4527A0' },
            { name: '900', hex: '311B92' },
            { name: 'A100', hex: 'B388FF' },
            { name: 'A200', hex: '7C4DFF' },
            { name: 'A400', hex: '651FFF' },
            { name: 'A700', hex: '6200EA' }
        ]
    }, {
        name: 'Indigo',
        camel: 'indigo',
        colors: [
            { name: '50', hex: 'E8EAF6' },
            { name: '100', hex: 'C5CAE9' },
            { name: '200', hex: '9FA8DA' },
            { name: '300', hex: '7986CB' },
            { name: '400', hex: '5C6BC0' },
            { name: '500', hex: '3F51B5' },
            { name: '600', hex: '3949AB' },
            { name: '700', hex: '303F9F' },
            { name: '800', hex: '283593' },
            { name: '900', hex: '1A237E' },
            { name: 'A100', hex: '8C9EFF' },
            { name: 'A200', hex: '536DFE' },
            { name: 'A400', hex: '3D5AFE' },
            { name: 'A700', hex: '304FFE' }
        ]
    }, {
        name: 'Blue',
        camel: 'blue',
        colors: [
            { name: '50', hex: 'E3F2FD' },
            { name: '100', hex: 'BBDEFB' },
            { name: '200', hex: '90CAF9' },
            { name: '300', hex: '64B5F6' },
            { name: '400', hex: '42A5F5' },
            { name: '500', hex: '2196F3' },
            { name: '600', hex: '1E88E5' },
            { name: '700', hex: '1976D2' },
            { name: '800', hex: '1565C0' },
            { name: '900', hex: '0D47A1' },
            { name: 'A100', hex: '82B1FF' },
            { name: 'A200', hex: '448AFF' },
            { name: 'A400', hex: '2979FF' },
            { name: 'A700', hex: '2962FF' }
        ]
    }, {
        name: 'Light Blue',
        camel: 'lightBlue',
        colors: [
            { name: '50', hex: 'E1F5FE' },
            { name: '100', hex: 'B3E5FC' },
            { name: '200', hex: '81D4FA' },
            { name: '300', hex: '4FC3F7' },
            { name: '400', hex: '29B6F6' },
            { name: '500', hex: '03A9F4' },
            { name: '600', hex: '039BE5' },
            { name: '700', hex: '0288D1' },
            { name: '800', hex: '0277BD' },
            { name: '900', hex: '01579B' },
            { name: 'A100', hex: '80D8FF' },
            { name: 'A200', hex: '40C4FF' },
            { name: 'A400', hex: '00B0FF' },
            { name: 'A700', hex: '0091EA' }
        ]
    }, {
        name: 'Cyan',
        camel: 'cyan',
        colors: [
            { name: '50', hex: 'E0F7FA' },
            { name: '100', hex: 'B2EBF2' },
            { name: '200', hex: '80DEEA' },
            { name: '300', hex: '4DD0E1' },
            { name: '400', hex: '26C6DA' },
            { name: '500', hex: '00BCD4' },
            { name: '600', hex: '00ACC1' },
            { name: '700', hex: '0097A7' },
            { name: '800', hex: '00838F' },
            { name: '900', hex: '006064' },
            { name: 'A100', hex: '84FFFF' },
            { name: 'A200', hex: '18FFFF' },
            { name: 'A400', hex: '00E5FF' },
            { name: 'A700', hex: '00B8D4' }
        ]
    }, {
        name: 'Teal',
        camel: 'teal',
        colors: [
            { name: '50', hex: 'E0F2F1' },
            { name: '100', hex: 'B2DFDB' },
            { name: '200', hex: '80CBC4' },
            { name: '300', hex: '4DB6AC' },
            { name: '400', hex: '26A69A' },
            { name: '500', hex: '009688' },
            { name: '600', hex: '00897B' },
            { name: '700', hex: '00796B' },
            { name: '800', hex: '00695C' },
            { name: '900', hex: '004D40' },
            { name: 'A100', hex: 'A7FFEB' },
            { name: 'A200', hex: '64FFDA' },
            { name: 'A400', hex: '1DE9B6' },
            { name: 'A700', hex: '00BFA5' }
        ]
    }, {
        name: 'Green',
        camel: 'green',
        colors: [
            { name: '50', hex: 'E8F5E9' },
            { name: '100', hex: 'C8E6C9' },
            { name: '200', hex: 'A5D6A7' },
            { name: '300', hex: '81C784' },
            { name: '400', hex: '66BB6A' },
            { name: '500', hex: '4CAF50' },
            { name: '600', hex: '43A047' },
            { name: '700', hex: '388E3C' },
            { name: '800', hex: '2E7D32' },
            { name: '900', hex: '1B5E20' },
            { name: 'A100', hex: 'B9F6CA' },
            { name: 'A200', hex: '69F0AE' },
            { name: 'A400', hex: '00E676' },
            { name: 'A700', hex: '00C853' }
        ]
    }, {
        name: 'Light Green',
        camel: 'lightGreen',
        colors: [
            { name: '50', hex: 'F1F8E9' },
            { name: '100', hex: 'DCEDC8' },
            { name: '200', hex: 'C5E1A5' },
            { name: '300', hex: 'AED581' },
            { name: '400', hex: '9CCC65' },
            { name: '500', hex: '8BC34A' },
            { name: '600', hex: '7CB342' },
            { name: '700', hex: '689F38' },
            { name: '800', hex: '558B2F' },
            { name: '900', hex: '33691E' },
            { name: 'A100', hex: 'CCFF90' },
            { name: 'A200', hex: 'B2FF59' },
            { name: 'A400', hex: '76FF03' },
            { name: 'A700', hex: '64DD17' }
        ]
    }, {
        name: 'Lime',
        camel: 'lime',
        colors: [
            { name: '50', hex: 'F9FBE7' },
            { name: '100', hex: 'F0F4C3' },
            { name: '200', hex: 'E6EE9C' },
            { name: '300', hex: 'DCE775' },
            { name: '400', hex: 'D4E157' },
            { name: '500', hex: 'CDDC39' },
            { name: '600', hex: 'C0CA33' },
            { name: '700', hex: 'AFB42B' },
            { name: '800', hex: '9E9D24' },
            { name: '900', hex: '827717' },
            { name: 'A100', hex: 'F4FF81' },
            { name: 'A200', hex: 'EEFF41' },
            { name: 'A400', hex: 'C6FF00' },
            { name: 'A700', hex: 'AEEA00' }
        ]
    }, {
        name: 'Yellow',
        camel: 'yellow',
        colors: [
            { name: '50', hex: 'FFFDE7' },
            { name: '100', hex: 'FFF9C4' },
            { name: '200', hex: 'FFF59D' },
            { name: '300', hex: 'FFF176' },
            { name: '400', hex: 'FFEE58' },
            { name: '500', hex: 'FFEB3B' },
            { name: '600', hex: 'FDD835' },
            { name: '700', hex: 'FBC02D' },
            { name: '800', hex: 'F9A825' },
            { name: '900', hex: 'F57F17' },
            { name: 'A100', hex: 'FFFF8D' },
            { name: 'A200', hex: 'FFFF00' },
            { name: 'A400', hex: 'FFEA00' },
            { name: 'A700', hex: 'FFD600' }
        ]
    }, {
        name: 'Amber',
        camel: 'amber',
        colors: [
            { name: '50', hex: 'FFF8E1' },
            { name: '100', hex: 'FFECB3' },
            { name: '200', hex: 'FFE082' },
            { name: '300', hex: 'FFD54F' },
            { name: '400', hex: 'FFCA28' },
            { name: '500', hex: 'FFC107' },
            { name: '600', hex: 'FFB300' },
            { name: '700', hex: 'FFA000' },
            { name: '800', hex: 'FF8F00' },
            { name: '900', hex: 'FF6F00' },
            { name: 'A100', hex: 'FFE57F' },
            { name: 'A200', hex: 'FFD740' },
            { name: 'A400', hex: 'FFC400' },
            { name: 'A700', hex: 'FFAB00' }
        ]
    }, {
        name: 'Orange',
        camel: 'orange',
        colors: [
            { name: '50', hex: 'FFF3E0' },
            { name: '100', hex: 'FFE0B2' },
            { name: '200', hex: 'FFCC80' },
            { name: '300', hex: 'FFB74D' },
            { name: '400', hex: 'FFA726' },
            { name: '500', hex: 'FF9800' },
            { name: '600', hex: 'FB8C00' },
            { name: '700', hex: 'F57C00' },
            { name: '800', hex: 'EF6C00' },
            { name: '900', hex: 'E65100' },
            { name: 'A100', hex: 'FFD180' },
            { name: 'A200', hex: 'FFAB40' },
            { name: 'A400', hex: 'FF9100' },
            { name: 'A700', hex: 'FF6D00' }
        ]
    }, {
        name: 'Deep Orange',
        camel: 'deepOrange',
        colors: [
            { name: '50', hex: 'FBE9E7' },
            { name: '100', hex: 'FFCCBC' },
            { name: '200', hex: 'FFAB91' },
            { name: '300', hex: 'FF8A65' },
            { name: '400', hex: 'FF7043' },
            { name: '500', hex: 'FF5722' },
            { name: '600', hex: 'F4511E' },
            { name: '700', hex: 'E64A19' },
            { name: '800', hex: 'D84315' },
            { name: '900', hex: 'BF360C' },
            { name: 'A100', hex: 'FF9E80' },
            { name: 'A200', hex: 'FF6E40' },
            { name: 'A400', hex: 'FF3D00' },
            { name: 'A700', hex: 'DD2C00' }
        ]
    }, {
        name: 'Brown',
        camel: 'brown',
        colors: [
            { name: '50', hex: 'EFEBE9' },
            { name: '100', hex: 'D7CCC8' },
            { name: '200', hex: 'BCAAA4' },
            { name: '300', hex: 'A1887F' },
            { name: '400', hex: '8D6E63' },
            { name: '500', hex: '795548' },
            { name: '600', hex: '6D4C41' },
            { name: '700', hex: '5D4037' },
            { name: '800', hex: '4E342E' },
            { name: '900', hex: '3E2723' }
        ]
    }, {
        name: 'Grey',
        camel: 'grey',
        colors: [
            { name: '50', hex: 'FAFAFA' },
            { name: '100', hex: 'F5F5F5' },
            { name: '200', hex: 'EEEEEE' },
            { name: '300', hex: 'E0E0E0' },
            { name: '400', hex: 'BDBDBD' },
            { name: '500', hex: '9E9E9E' },
            { name: '600', hex: '757575' },
            { name: '700', hex: '616161' },
            { name: '800', hex: '424242' },
            { name: '900', hex: '212121' }
        ]
    }, {
        name: 'Blue Grey',
        camel: 'blueGrey',
        colors: [
            { name: '50', hex: 'ECEFF1' },
            { name: '100', hex: 'CFD8DC' },
            { name: '200', hex: 'B0BEC5' },
            { name: '300', hex: '90A4AE' },
            { name: '400', hex: '78909C' },
            { name: '500', hex: '607D8B' },
            { name: '600', hex: '546E7A' },
            { name: '700', hex: '455A64' },
            { name: '800', hex: '37474F' },
            { name: '900', hex: '263238' }
        ]
    }, {
        name: 'Misc',
        camel: '',
        colors: [
            { name: 'white', hex: 'FFFFFF', x: 19, y: 0 },
            { name: 'black', hex: '000000', x: 19, y: 1 }
        ]
    }];

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

var template$4 = "<div part=\"grid\"></div>";

var style$4 = "button {\n  border: 0;\n  padding: 0;\n  outline: 0;\n}\n\nbutton.active {\n  border: 2px solid #fff;\n  box-shadow: 0 0 0.25rem rgba(0, 0, 0, 0.5);\n  order: 1;\n}\n\nbutton.white.active {\n  box-shadow: 0 0 0.25rem rgba(0, 0, 0, 0.5) inset;\n}\n\n[part~=grid] {\n  display: grid;\n  grid-template-columns: repeat(19, 1rem);\n  grid-template-rows: repeat(14, 1rem);\n}";

let MdiColor = class MdiColor extends HTMLElement {
    constructor() {
        super(...arguments);
        this.value = '#000000';
        this.buttons = [];
        this.isMouseDown = false;
        this.index = -1;
    }
    connectedCallback() {
        SWATCHES.forEach((group, groupIndex) => {
            group.colors.forEach((color, colorIndex) => {
                const button = document.createElement('button');
                button.style.background = `#${color.hex}`;
                if (color.name === 'black') {
                    button.style.gridArea = `13 / 17 / 15 / 20`;
                }
                else if (color.name === 'white') {
                    button.style.gridArea = `11 / 17 / 13 / 20`;
                    button.classList.add('white');
                }
                else {
                    button.style.gridRow = `${colorIndex + 1}`;
                    button.style.gridColumn = `${groupIndex + 1}`;
                }
                const index = this.buttons.push([
                    button,
                    `#${color.hex}`,
                    group
                ]);
                button.addEventListener('click', () => {
                    this.handleSelect(index - 1);
                });
                button.addEventListener('mouseenter', () => {
                    if (this.isMouseDown) {
                        this.handleSelect(index - 1);
                    }
                });
                this.$grid.appendChild(button);
            });
        });
        const setToFalse = () => {
            this.isMouseDown = false;
            document.removeEventListener('mouseup', setToFalse);
        };
        this.$grid.addEventListener('mousedown', (e) => {
            this.isMouseDown = true;
            const index = this.buttons.findIndex(([b]) => b === e.target);
            if (index !== -1) {
                this.handleSelect(index);
            }
            document.addEventListener('mouseup', setToFalse);
        });
    }
    handleSelect(index) {
        const [button, hex, group] = this.buttons[index];
        const rgb = hexToRgb(hex);
        this.dispatchEvent(new CustomEvent('select', {
            detail: {
                group,
                hex,
                rgb
            }
        }));
        if (this.index !== -1) {
            const [lastButton] = this.buttons[this.index];
            lastButton.classList.toggle('active', false);
        }
        button.classList.toggle('active', true);
        this.index = index;
    }
    render() {
        if (this.index !== -1) {
            const [lastButton] = this.buttons[this.index];
            lastButton.classList.toggle('active', false);
        }
        const index = this.buttons.findIndex((a) => a[1] === this.value);
        this.index = index;
        if (this.buttons[index]) {
            const [button] = this.buttons[index];
            button.classList.toggle('active', true);
        }
    }
};
__decorate([
    Prop()
], MdiColor.prototype, "value", void 0);
__decorate([
    Part()
], MdiColor.prototype, "$grid", void 0);
MdiColor = __decorate([
    Component({
        selector: 'mdi-color',
        style: style$4,
        template: template$4
    })
], MdiColor);

var template$5 = "";

var style$5 = "";

/*
 * Dexie.js - a minimalistic wrapper for IndexedDB
 * ===============================================
 *
 * By David Fahlander, david.fahlander@gmail.com
 *
 * Version 3.0.0-rc.7, Wed Apr 08 2020
 *
 * http://dexie.org
 *
 * Apache License Version 2.0, January 2004, http://www.apache.org/licenses/
 */
 
var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};










function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

var keys = Object.keys;
var isArray = Array.isArray;
var _global = typeof self !== 'undefined' ? self :
    typeof window !== 'undefined' ? window :
        global;
if (typeof Promise !== 'undefined' && !_global.Promise) {
    _global.Promise = Promise;
}
function extend(obj, extension) {
    if (typeof extension !== 'object')
        return obj;
    keys(extension).forEach(function (key) {
        obj[key] = extension[key];
    });
    return obj;
}
var getProto = Object.getPrototypeOf;
var _hasOwn = {}.hasOwnProperty;
function hasOwn(obj, prop) {
    return _hasOwn.call(obj, prop);
}
function props(proto, extension) {
    if (typeof extension === 'function')
        extension = extension(getProto(proto));
    keys(extension).forEach(function (key) {
        setProp(proto, key, extension[key]);
    });
}
var defineProperty = Object.defineProperty;
function setProp(obj, prop, functionOrGetSet, options) {
    defineProperty(obj, prop, extend(functionOrGetSet && hasOwn(functionOrGetSet, "get") && typeof functionOrGetSet.get === 'function' ?
        { get: functionOrGetSet.get, set: functionOrGetSet.set, configurable: true } :
        { value: functionOrGetSet, configurable: true, writable: true }, options));
}
function derive(Child) {
    return {
        from: function (Parent) {
            Child.prototype = Object.create(Parent.prototype);
            setProp(Child.prototype, "constructor", Child);
            return {
                extend: props.bind(null, Child.prototype)
            };
        }
    };
}
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
function getPropertyDescriptor(obj, prop) {
    var pd = getOwnPropertyDescriptor(obj, prop);
    var proto;
    return pd || (proto = getProto(obj)) && getPropertyDescriptor(proto, prop);
}
var _slice = [].slice;
function slice(args, start, end) {
    return _slice.call(args, start, end);
}
function override(origFunc, overridedFactory) {
    return overridedFactory(origFunc);
}
function assert(b) {
    if (!b)
        throw new Error("Assertion Failed");
}
function asap(fn) {
    if (_global.setImmediate)
        setImmediate(fn);
    else
        setTimeout(fn, 0);
}

function arrayToObject(array, extractor) {
    return array.reduce(function (result, item, i) {
        var nameAndValue = extractor(item, i);
        if (nameAndValue)
            result[nameAndValue[0]] = nameAndValue[1];
        return result;
    }, {});
}

function tryCatch(fn, onerror, args) {
    try {
        fn.apply(null, args);
    }
    catch (ex) {
        onerror && onerror(ex);
    }
}
function getByKeyPath(obj, keyPath) {
    if (hasOwn(obj, keyPath))
        return obj[keyPath];
    if (!keyPath)
        return obj;
    if (typeof keyPath !== 'string') {
        var rv = [];
        for (var i = 0, l = keyPath.length; i < l; ++i) {
            var val = getByKeyPath(obj, keyPath[i]);
            rv.push(val);
        }
        return rv;
    }
    var period = keyPath.indexOf('.');
    if (period !== -1) {
        var innerObj = obj[keyPath.substr(0, period)];
        return innerObj === undefined ? undefined : getByKeyPath(innerObj, keyPath.substr(period + 1));
    }
    return undefined;
}
function setByKeyPath(obj, keyPath, value) {
    if (!obj || keyPath === undefined)
        return;
    if ('isFrozen' in Object && Object.isFrozen(obj))
        return;
    if (typeof keyPath !== 'string' && 'length' in keyPath) {
        assert(typeof value !== 'string' && 'length' in value);
        for (var i = 0, l = keyPath.length; i < l; ++i) {
            setByKeyPath(obj, keyPath[i], value[i]);
        }
    }
    else {
        var period = keyPath.indexOf('.');
        if (period !== -1) {
            var currentKeyPath = keyPath.substr(0, period);
            var remainingKeyPath = keyPath.substr(period + 1);
            if (remainingKeyPath === "")
                if (value === undefined) {
                    if (isArray(obj) && !isNaN(parseInt(currentKeyPath)))
                        obj.splice(currentKeyPath, 1);
                    else
                        delete obj[currentKeyPath];
                }
                else
                    obj[currentKeyPath] = value;
            else {
                var innerObj = obj[currentKeyPath];
                if (!innerObj)
                    innerObj = (obj[currentKeyPath] = {});
                setByKeyPath(innerObj, remainingKeyPath, value);
            }
        }
        else {
            if (value === undefined) {
                if (isArray(obj) && !isNaN(parseInt(keyPath)))
                    obj.splice(keyPath, 1);
                else
                    delete obj[keyPath];
            }
            else
                obj[keyPath] = value;
        }
    }
}
function delByKeyPath(obj, keyPath) {
    if (typeof keyPath === 'string')
        setByKeyPath(obj, keyPath, undefined);
    else if ('length' in keyPath)
        [].map.call(keyPath, function (kp) {
            setByKeyPath(obj, kp, undefined);
        });
}
function shallowClone(obj) {
    var rv = {};
    for (var m in obj) {
        if (hasOwn(obj, m))
            rv[m] = obj[m];
    }
    return rv;
}
var concat = [].concat;
function flatten(a) {
    return concat.apply([], a);
}
var intrinsicTypeNames = "Boolean,String,Date,RegExp,Blob,File,FileList,ArrayBuffer,DataView,Uint8ClampedArray,ImageData,Map,Set"
    .split(',').concat(flatten([8, 16, 32, 64].map(function (num) { return ["Int", "Uint", "Float"].map(function (t) { return t + num + "Array"; }); }))).filter(function (t) { return _global[t]; });
var intrinsicTypes = intrinsicTypeNames.map(function (t) { return _global[t]; });
var intrinsicTypeNameSet = arrayToObject(intrinsicTypeNames, function (x) { return [x, true]; });
function deepClone(any) {
    if (!any || typeof any !== 'object')
        return any;
    var rv;
    if (isArray(any)) {
        rv = [];
        for (var i = 0, l = any.length; i < l; ++i) {
            rv.push(deepClone(any[i]));
        }
    }
    else if (intrinsicTypes.indexOf(any.constructor) >= 0) {
        rv = any;
    }
    else {
        rv = any.constructor ? Object.create(any.constructor.prototype) : {};
        for (var prop in any) {
            if (hasOwn(any, prop)) {
                rv[prop] = deepClone(any[prop]);
            }
        }
    }
    return rv;
}
var toString = {}.toString;
function toStringTag(o) {
    return toString.call(o).slice(8, -1);
}
var getValueOf = function (val, type) {
    return type === "Array" ? '' + val.map(function (v) { return getValueOf(v, toStringTag(v)); }) :
        type === "ArrayBuffer" ? '' + new Uint8Array(val) :
            type === "Date" ? val.getTime() :
                ArrayBuffer.isView(val) ? '' + new Uint8Array(val.buffer) :
                    val;
};
function getObjectDiff(a, b, rv, prfx) {
    rv = rv || {};
    prfx = prfx || '';
    keys(a).forEach(function (prop) {
        if (!hasOwn(b, prop))
            rv[prfx + prop] = undefined;
        else {
            var ap = a[prop], bp = b[prop];
            if (typeof ap === 'object' && typeof bp === 'object' && ap && bp) {
                var apTypeName = toStringTag(ap);
                var bpTypeName = toStringTag(bp);
                if (apTypeName === bpTypeName) {
                    if (intrinsicTypeNameSet[apTypeName]) {
                        if (getValueOf(ap, apTypeName) !== getValueOf(bp, bpTypeName)) {
                            rv[prfx + prop] = b[prop];
                        }
                    }
                    else {
                        getObjectDiff(ap, bp, rv, prfx + prop + ".");
                    }
                }
                else {
                    rv[prfx + prop] = b[prop];
                }
            }
            else if (ap !== bp)
                rv[prfx + prop] = b[prop];
        }
    });
    keys(b).forEach(function (prop) {
        if (!hasOwn(a, prop)) {
            rv[prfx + prop] = b[prop];
        }
    });
    return rv;
}
var iteratorSymbol = typeof Symbol !== 'undefined' && Symbol.iterator;
var getIteratorOf = iteratorSymbol ? function (x) {
    var i;
    return x != null && (i = x[iteratorSymbol]) && i.apply(x);
} : function () { return null; };
var NO_CHAR_ARRAY = {};
function getArrayOf(arrayLike) {
    var i, a, x, it;
    if (arguments.length === 1) {
        if (isArray(arrayLike))
            return arrayLike.slice();
        if (this === NO_CHAR_ARRAY && typeof arrayLike === 'string')
            return [arrayLike];
        if ((it = getIteratorOf(arrayLike))) {
            a = [];
            while (x = it.next(), !x.done)
                a.push(x.value);
            return a;
        }
        if (arrayLike == null)
            return [arrayLike];
        i = arrayLike.length;
        if (typeof i === 'number') {
            a = new Array(i);
            while (i--)
                a[i] = arrayLike[i];
            return a;
        }
        return [arrayLike];
    }
    i = arguments.length;
    a = new Array(i);
    while (i--)
        a[i] = arguments[i];
    return a;
}
var isAsyncFunction = typeof Symbol !== 'undefined'
    ? function (fn) { return fn[Symbol.toStringTag] === 'AsyncFunction'; }
    : function () { return false; };

var debug = typeof location !== 'undefined' &&
    /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
function setDebug(value, filter) {
    debug = value;
    libraryFilter = filter;
}
var libraryFilter = function () { return true; };
var NEEDS_THROW_FOR_STACK = !new Error("").stack;
function getErrorWithStack() {
    if (NEEDS_THROW_FOR_STACK)
        try {
            throw new Error();
        }
        catch (e) {
            return e;
        }
    return new Error();
}
function prettyStack(exception, numIgnoredFrames) {
    var stack = exception.stack;
    if (!stack)
        return "";
    numIgnoredFrames = (numIgnoredFrames || 0);
    if (stack.indexOf(exception.name) === 0)
        numIgnoredFrames += (exception.name + exception.message).split('\n').length;
    return stack.split('\n')
        .slice(numIgnoredFrames)
        .filter(libraryFilter)
        .map(function (frame) { return "\n" + frame; })
        .join('');
}

var dexieErrorNames = [
    'Modify',
    'Bulk',
    'OpenFailed',
    'VersionChange',
    'Schema',
    'Upgrade',
    'InvalidTable',
    'MissingAPI',
    'NoSuchDatabase',
    'InvalidArgument',
    'SubTransaction',
    'Unsupported',
    'Internal',
    'DatabaseClosed',
    'PrematureCommit',
    'ForeignAwait'
];
var idbDomErrorNames = [
    'Unknown',
    'Constraint',
    'Data',
    'TransactionInactive',
    'ReadOnly',
    'Version',
    'NotFound',
    'InvalidState',
    'InvalidAccess',
    'Abort',
    'Timeout',
    'QuotaExceeded',
    'Syntax',
    'DataClone'
];
var errorList = dexieErrorNames.concat(idbDomErrorNames);
var defaultTexts = {
    VersionChanged: "Database version changed by other database connection",
    DatabaseClosed: "Database has been closed",
    Abort: "Transaction aborted",
    TransactionInactive: "Transaction has already completed or failed"
};
function DexieError(name, msg) {
    this._e = getErrorWithStack();
    this.name = name;
    this.message = msg;
}
derive(DexieError).from(Error).extend({
    stack: {
        get: function () {
            return this._stack ||
                (this._stack = this.name + ": " + this.message + prettyStack(this._e, 2));
        }
    },
    toString: function () { return this.name + ": " + this.message; }
});
function getMultiErrorMessage(msg, failures) {
    return msg + ". Errors: " + Object.keys(failures)
        .map(function (key) { return failures[key].toString(); })
        .filter(function (v, i, s) { return s.indexOf(v) === i; })
        .join('\n');
}
function ModifyError(msg, failures, successCount, failedKeys) {
    this._e = getErrorWithStack();
    this.failures = failures;
    this.failedKeys = failedKeys;
    this.successCount = successCount;
    this.message = getMultiErrorMessage(msg, failures);
}
derive(ModifyError).from(DexieError);
function BulkError(msg, failures) {
    this._e = getErrorWithStack();
    this.name = "BulkError";
    this.failures = failures;
    this.message = getMultiErrorMessage(msg, failures);
}
derive(BulkError).from(DexieError);
var errnames = errorList.reduce(function (obj, name) { return (obj[name] = name + "Error", obj); }, {});
var BaseException = DexieError;
var exceptions = errorList.reduce(function (obj, name) {
    var fullName = name + "Error";
    function DexieError(msgOrInner, inner) {
        this._e = getErrorWithStack();
        this.name = fullName;
        if (!msgOrInner) {
            this.message = defaultTexts[name] || fullName;
            this.inner = null;
        }
        else if (typeof msgOrInner === 'string') {
            this.message = "" + msgOrInner + (!inner ? '' : '\n ' + inner);
            this.inner = inner || null;
        }
        else if (typeof msgOrInner === 'object') {
            this.message = msgOrInner.name + " " + msgOrInner.message;
            this.inner = msgOrInner;
        }
    }
    derive(DexieError).from(BaseException);
    obj[name] = DexieError;
    return obj;
}, {});
exceptions.Syntax = SyntaxError;
exceptions.Type = TypeError;
exceptions.Range = RangeError;
var exceptionMap = idbDomErrorNames.reduce(function (obj, name) {
    obj[name + "Error"] = exceptions[name];
    return obj;
}, {});
function mapError(domError, message) {
    if (!domError || domError instanceof DexieError || domError instanceof TypeError || domError instanceof SyntaxError || !domError.name || !exceptionMap[domError.name])
        return domError;
    var rv = new exceptionMap[domError.name](message || domError.message, domError);
    if ("stack" in domError) {
        setProp(rv, "stack", { get: function () {
                return this.inner.stack;
            } });
    }
    return rv;
}
var fullNameExceptions = errorList.reduce(function (obj, name) {
    if (["Syntax", "Type", "Range"].indexOf(name) === -1)
        obj[name + "Error"] = exceptions[name];
    return obj;
}, {});
fullNameExceptions.ModifyError = ModifyError;
fullNameExceptions.DexieError = DexieError;
fullNameExceptions.BulkError = BulkError;

function nop() { }
function mirror(val) { return val; }
function pureFunctionChain(f1, f2) {
    if (f1 == null || f1 === mirror)
        return f2;
    return function (val) {
        return f2(f1(val));
    };
}
function callBoth(on1, on2) {
    return function () {
        on1.apply(this, arguments);
        on2.apply(this, arguments);
    };
}
function hookCreatingChain(f1, f2) {
    if (f1 === nop)
        return f2;
    return function () {
        var res = f1.apply(this, arguments);
        if (res !== undefined)
            arguments[0] = res;
        var onsuccess = this.onsuccess,
        onerror = this.onerror;
        this.onsuccess = null;
        this.onerror = null;
        var res2 = f2.apply(this, arguments);
        if (onsuccess)
            this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
        if (onerror)
            this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
        return res2 !== undefined ? res2 : res;
    };
}
function hookDeletingChain(f1, f2) {
    if (f1 === nop)
        return f2;
    return function () {
        f1.apply(this, arguments);
        var onsuccess = this.onsuccess,
        onerror = this.onerror;
        this.onsuccess = this.onerror = null;
        f2.apply(this, arguments);
        if (onsuccess)
            this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
        if (onerror)
            this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
    };
}
function hookUpdatingChain(f1, f2) {
    if (f1 === nop)
        return f2;
    return function (modifications) {
        var res = f1.apply(this, arguments);
        extend(modifications, res);
        var onsuccess = this.onsuccess,
        onerror = this.onerror;
        this.onsuccess = null;
        this.onerror = null;
        var res2 = f2.apply(this, arguments);
        if (onsuccess)
            this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
        if (onerror)
            this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
        return res === undefined ?
            (res2 === undefined ? undefined : res2) :
            (extend(res, res2));
    };
}
function reverseStoppableEventChain(f1, f2) {
    if (f1 === nop)
        return f2;
    return function () {
        if (f2.apply(this, arguments) === false)
            return false;
        return f1.apply(this, arguments);
    };
}

function promisableChain(f1, f2) {
    if (f1 === nop)
        return f2;
    return function () {
        var res = f1.apply(this, arguments);
        if (res && typeof res.then === 'function') {
            var thiz = this, i = arguments.length, args = new Array(i);
            while (i--)
                args[i] = arguments[i];
            return res.then(function () {
                return f2.apply(thiz, args);
            });
        }
        return f2.apply(this, arguments);
    };
}

var INTERNAL = {};
var LONG_STACKS_CLIP_LIMIT = 100;
var MAX_LONG_STACKS = 20;
var ZONE_ECHO_LIMIT = 100;
var _a = typeof Promise === 'undefined' ?
    [] :
    (function () {
        var globalP = Promise.resolve();
        if (typeof crypto === 'undefined' || !crypto.subtle)
            return [globalP, globalP.__proto__, globalP];
        var nativeP = crypto.subtle.digest("SHA-512", new Uint8Array([0]));
        return [
            nativeP,
            nativeP.__proto__,
            globalP
        ];
    })();
var resolvedNativePromise = _a[0];
var nativePromiseProto = _a[1];
var resolvedGlobalPromise = _a[2];
var nativePromiseThen = nativePromiseProto && nativePromiseProto.then;
var NativePromise = resolvedNativePromise && resolvedNativePromise.constructor;
var patchGlobalPromise = !!resolvedGlobalPromise;
var stack_being_generated = false;
var schedulePhysicalTick = resolvedGlobalPromise ?
    function () { resolvedGlobalPromise.then(physicalTick); }
    :
        _global.setImmediate ?
            setImmediate.bind(null, physicalTick) :
            _global.MutationObserver ?
                function () {
                    var hiddenDiv = document.createElement("div");
                    (new MutationObserver(function () {
                        physicalTick();
                        hiddenDiv = null;
                    })).observe(hiddenDiv, { attributes: true });
                    hiddenDiv.setAttribute('i', '1');
                } :
                function () { setTimeout(physicalTick, 0); };
var asap$1 = function (callback, args) {
    microtickQueue.push([callback, args]);
    if (needsNewPhysicalTick) {
        schedulePhysicalTick();
        needsNewPhysicalTick = false;
    }
};
var isOutsideMicroTick = true;
var needsNewPhysicalTick = true;
var unhandledErrors = [];
var rejectingErrors = [];
var currentFulfiller = null;
var rejectionMapper = mirror;
var globalPSD = {
    id: 'global',
    global: true,
    ref: 0,
    unhandleds: [],
    onunhandled: globalError,
    pgp: false,
    env: {},
    finalize: function () {
        this.unhandleds.forEach(function (uh) {
            try {
                globalError(uh[0], uh[1]);
            }
            catch (e) { }
        });
    }
};
var PSD = globalPSD;
var microtickQueue = [];
var numScheduledCalls = 0;
var tickFinalizers = [];
function DexiePromise(fn) {
    if (typeof this !== 'object')
        throw new TypeError('Promises must be constructed via new');
    this._listeners = [];
    this.onuncatched = nop;
    this._lib = false;
    var psd = (this._PSD = PSD);
    if (debug) {
        this._stackHolder = getErrorWithStack();
        this._prev = null;
        this._numPrev = 0;
    }
    if (typeof fn !== 'function') {
        if (fn !== INTERNAL)
            throw new TypeError('Not a function');
        this._state = arguments[1];
        this._value = arguments[2];
        if (this._state === false)
            handleRejection(this, this._value);
        return;
    }
    this._state = null;
    this._value = null;
    ++psd.ref;
    executePromiseTask(this, fn);
}
var thenProp = {
    get: function () {
        var psd = PSD, microTaskId = totalEchoes;
        function then(onFulfilled, onRejected) {
            var _this = this;
            var possibleAwait = !psd.global && (psd !== PSD || microTaskId !== totalEchoes);
            if (possibleAwait)
                decrementExpectedAwaits();
            var rv = new DexiePromise(function (resolve, reject) {
                propagateToListener(_this, new Listener(nativeAwaitCompatibleWrap(onFulfilled, psd, possibleAwait), nativeAwaitCompatibleWrap(onRejected, psd, possibleAwait), resolve, reject, psd));
            });
            debug && linkToPreviousPromise(rv, this);
            return rv;
        }
        then.prototype = INTERNAL;
        return then;
    },
    set: function (value) {
        setProp(this, 'then', value && value.prototype === INTERNAL ?
            thenProp :
            {
                get: function () {
                    return value;
                },
                set: thenProp.set
            });
    }
};
props(DexiePromise.prototype, {
    then: thenProp,
    _then: function (onFulfilled, onRejected) {
        propagateToListener(this, new Listener(null, null, onFulfilled, onRejected, PSD));
    },
    catch: function (onRejected) {
        if (arguments.length === 1)
            return this.then(null, onRejected);
        var type = arguments[0], handler = arguments[1];
        return typeof type === 'function' ? this.then(null, function (err) {
            return err instanceof type ? handler(err) : PromiseReject(err);
        })
            : this.then(null, function (err) {
                return err && err.name === type ? handler(err) : PromiseReject(err);
            });
    },
    finally: function (onFinally) {
        return this.then(function (value) {
            onFinally();
            return value;
        }, function (err) {
            onFinally();
            return PromiseReject(err);
        });
    },
    stack: {
        get: function () {
            if (this._stack)
                return this._stack;
            try {
                stack_being_generated = true;
                var stacks = getStack(this, [], MAX_LONG_STACKS);
                var stack = stacks.join("\nFrom previous: ");
                if (this._state !== null)
                    this._stack = stack;
                return stack;
            }
            finally {
                stack_being_generated = false;
            }
        }
    },
    timeout: function (ms, msg) {
        var _this = this;
        return ms < Infinity ?
            new DexiePromise(function (resolve, reject) {
                var handle = setTimeout(function () { return reject(new exceptions.Timeout(msg)); }, ms);
                _this.then(resolve, reject).finally(clearTimeout.bind(null, handle));
            }) : this;
    }
});
if (typeof Symbol !== 'undefined' && Symbol.toStringTag)
    setProp(DexiePromise.prototype, Symbol.toStringTag, 'Dexie.Promise');
globalPSD.env = snapShot();
function Listener(onFulfilled, onRejected, resolve, reject, zone) {
    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
    this.resolve = resolve;
    this.reject = reject;
    this.psd = zone;
}
props(DexiePromise, {
    all: function () {
        var values = getArrayOf.apply(null, arguments)
            .map(onPossibleParallellAsync);
        return new DexiePromise(function (resolve, reject) {
            if (values.length === 0)
                resolve([]);
            var remaining = values.length;
            values.forEach(function (a, i) { return DexiePromise.resolve(a).then(function (x) {
                values[i] = x;
                if (!--remaining)
                    resolve(values);
            }, reject); });
        });
    },
    resolve: function (value) {
        if (value instanceof DexiePromise)
            return value;
        if (value && typeof value.then === 'function')
            return new DexiePromise(function (resolve, reject) {
                value.then(resolve, reject);
            });
        var rv = new DexiePromise(INTERNAL, true, value);
        linkToPreviousPromise(rv, currentFulfiller);
        return rv;
    },
    reject: PromiseReject,
    race: function () {
        var values = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
        return new DexiePromise(function (resolve, reject) {
            values.map(function (value) { return DexiePromise.resolve(value).then(resolve, reject); });
        });
    },
    allSettled: function () {
        var possiblePromises = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
        return new DexiePromise(function (resolve) {
            if (possiblePromises.length === 0)
                resolve([]);
            var remaining = possiblePromises.length;
            var results = new Array(remaining);
            possiblePromises.forEach(function (p, i) { return DexiePromise.resolve(p).then(function (value) { return results[i] = { status: "fulfilled", value: value }; }, function (reason) { return results[i] = { status: "rejected", reason: reason }; })
                .then(function () { return --remaining || resolve(results); }); });
        });
    },
    any: function () {
        var possiblePromises = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
        return new DexiePromise(function (resolve, reject) {
            if (possiblePromises.length === 0)
                reject(new AggregateError([]));
            var remaining = possiblePromises.length;
            var failures = new Array(remaining);
            possiblePromises.forEach(function (p, i) { return DexiePromise.resolve(p).then(function (value) { return resolve(value); }, function (failure) {
                failures[i] = failure;
                if (!--remaining)
                    reject(new AggregateError(failures));
            }); });
        });
    },
    PSD: {
        get: function () { return PSD; },
        set: function (value) { return PSD = value; }
    },
    newPSD: newScope,
    usePSD: usePSD,
    scheduler: {
        get: function () { return asap$1; },
        set: function (value) { asap$1 = value; }
    },
    rejectionMapper: {
        get: function () { return rejectionMapper; },
        set: function (value) { rejectionMapper = value; }
    },
    follow: function (fn, zoneProps) {
        return new DexiePromise(function (resolve, reject) {
            return newScope(function (resolve, reject) {
                var psd = PSD;
                psd.unhandleds = [];
                psd.onunhandled = reject;
                psd.finalize = callBoth(function () {
                    var _this = this;
                    run_at_end_of_this_or_next_physical_tick(function () {
                        _this.unhandleds.length === 0 ? resolve() : reject(_this.unhandleds[0]);
                    });
                }, psd.finalize);
                fn();
            }, zoneProps, resolve, reject);
        });
    }
});
function executePromiseTask(promise, fn) {
    try {
        fn(function (value) {
            if (promise._state !== null)
                return;
            if (value === promise)
                throw new TypeError('A promise cannot be resolved with itself.');
            var shouldExecuteTick = promise._lib && beginMicroTickScope();
            if (value && typeof value.then === 'function') {
                executePromiseTask(promise, function (resolve, reject) {
                    value instanceof DexiePromise ?
                        value._then(resolve, reject) :
                        value.then(resolve, reject);
                });
            }
            else {
                promise._state = true;
                promise._value = value;
                propagateAllListeners(promise);
            }
            if (shouldExecuteTick)
                endMicroTickScope();
        }, handleRejection.bind(null, promise));
    }
    catch (ex) {
        handleRejection(promise, ex);
    }
}
function handleRejection(promise, reason) {
    rejectingErrors.push(reason);
    if (promise._state !== null)
        return;
    var shouldExecuteTick = promise._lib && beginMicroTickScope();
    reason = rejectionMapper(reason);
    promise._state = false;
    promise._value = reason;
    debug && reason !== null && typeof reason === 'object' && !reason._promise && tryCatch(function () {
        var origProp = getPropertyDescriptor(reason, "stack");
        reason._promise = promise;
        setProp(reason, "stack", {
            get: function () {
                return stack_being_generated ?
                    origProp && (origProp.get ?
                        origProp.get.apply(reason) :
                        origProp.value) :
                    promise.stack;
            }
        });
    });
    addPossiblyUnhandledError(promise);
    propagateAllListeners(promise);
    if (shouldExecuteTick)
        endMicroTickScope();
}
function propagateAllListeners(promise) {
    var listeners = promise._listeners;
    promise._listeners = [];
    for (var i = 0, len = listeners.length; i < len; ++i) {
        propagateToListener(promise, listeners[i]);
    }
    var psd = promise._PSD;
    --psd.ref || psd.finalize();
    if (numScheduledCalls === 0) {
        ++numScheduledCalls;
        asap$1(function () {
            if (--numScheduledCalls === 0)
                finalizePhysicalTick();
        }, []);
    }
}
function propagateToListener(promise, listener) {
    if (promise._state === null) {
        promise._listeners.push(listener);
        return;
    }
    var cb = promise._state ? listener.onFulfilled : listener.onRejected;
    if (cb === null) {
        return (promise._state ? listener.resolve : listener.reject)(promise._value);
    }
    ++listener.psd.ref;
    ++numScheduledCalls;
    asap$1(callListener, [cb, promise, listener]);
}
function callListener(cb, promise, listener) {
    try {
        currentFulfiller = promise;
        var ret, value = promise._value;
        if (promise._state) {
            ret = cb(value);
        }
        else {
            if (rejectingErrors.length)
                rejectingErrors = [];
            ret = cb(value);
            if (rejectingErrors.indexOf(value) === -1)
                markErrorAsHandled(promise);
        }
        listener.resolve(ret);
    }
    catch (e) {
        listener.reject(e);
    }
    finally {
        currentFulfiller = null;
        if (--numScheduledCalls === 0)
            finalizePhysicalTick();
        --listener.psd.ref || listener.psd.finalize();
    }
}
function getStack(promise, stacks, limit) {
    if (stacks.length === limit)
        return stacks;
    var stack = "";
    if (promise._state === false) {
        var failure = promise._value, errorName, message;
        if (failure != null) {
            errorName = failure.name || "Error";
            message = failure.message || failure;
            stack = prettyStack(failure, 0);
        }
        else {
            errorName = failure;
            message = "";
        }
        stacks.push(errorName + (message ? ": " + message : "") + stack);
    }
    if (debug) {
        stack = prettyStack(promise._stackHolder, 2);
        if (stack && stacks.indexOf(stack) === -1)
            stacks.push(stack);
        if (promise._prev)
            getStack(promise._prev, stacks, limit);
    }
    return stacks;
}
function linkToPreviousPromise(promise, prev) {
    var numPrev = prev ? prev._numPrev + 1 : 0;
    if (numPrev < LONG_STACKS_CLIP_LIMIT) {
        promise._prev = prev;
        promise._numPrev = numPrev;
    }
}
function physicalTick() {
    beginMicroTickScope() && endMicroTickScope();
}
function beginMicroTickScope() {
    var wasRootExec = isOutsideMicroTick;
    isOutsideMicroTick = false;
    needsNewPhysicalTick = false;
    return wasRootExec;
}
function endMicroTickScope() {
    var callbacks, i, l;
    do {
        while (microtickQueue.length > 0) {
            callbacks = microtickQueue;
            microtickQueue = [];
            l = callbacks.length;
            for (i = 0; i < l; ++i) {
                var item = callbacks[i];
                item[0].apply(null, item[1]);
            }
        }
    } while (microtickQueue.length > 0);
    isOutsideMicroTick = true;
    needsNewPhysicalTick = true;
}
function finalizePhysicalTick() {
    var unhandledErrs = unhandledErrors;
    unhandledErrors = [];
    unhandledErrs.forEach(function (p) {
        p._PSD.onunhandled.call(null, p._value, p);
    });
    var finalizers = tickFinalizers.slice(0);
    var i = finalizers.length;
    while (i)
        finalizers[--i]();
}
function run_at_end_of_this_or_next_physical_tick(fn) {
    function finalizer() {
        fn();
        tickFinalizers.splice(tickFinalizers.indexOf(finalizer), 1);
    }
    tickFinalizers.push(finalizer);
    ++numScheduledCalls;
    asap$1(function () {
        if (--numScheduledCalls === 0)
            finalizePhysicalTick();
    }, []);
}
function addPossiblyUnhandledError(promise) {
    if (!unhandledErrors.some(function (p) { return p._value === promise._value; }))
        unhandledErrors.push(promise);
}
function markErrorAsHandled(promise) {
    var i = unhandledErrors.length;
    while (i)
        if (unhandledErrors[--i]._value === promise._value) {
            unhandledErrors.splice(i, 1);
            return;
        }
}
function PromiseReject(reason) {
    return new DexiePromise(INTERNAL, false, reason);
}
function wrap(fn, errorCatcher) {
    var psd = PSD;
    return function () {
        var wasRootExec = beginMicroTickScope(), outerScope = PSD;
        try {
            switchToZone(psd, true);
            return fn.apply(this, arguments);
        }
        catch (e) {
            errorCatcher && errorCatcher(e);
        }
        finally {
            switchToZone(outerScope, false);
            if (wasRootExec)
                endMicroTickScope();
        }
    };
}
var task = { awaits: 0, echoes: 0, id: 0 };
var taskCounter = 0;
var zoneStack = [];
var zoneEchoes = 0;
var totalEchoes = 0;
var zone_id_counter = 0;
function newScope(fn, props$$1, a1, a2) {
    var parent = PSD, psd = Object.create(parent);
    psd.parent = parent;
    psd.ref = 0;
    psd.global = false;
    psd.id = ++zone_id_counter;
    var globalEnv = globalPSD.env;
    psd.env = patchGlobalPromise ? {
        Promise: DexiePromise,
        PromiseProp: { value: DexiePromise, configurable: true, writable: true },
        all: DexiePromise.all,
        race: DexiePromise.race,
        allSettled: DexiePromise.allSettled,
        any: DexiePromise.any,
        resolve: DexiePromise.resolve,
        reject: DexiePromise.reject,
        nthen: getPatchedPromiseThen(globalEnv.nthen, psd),
        gthen: getPatchedPromiseThen(globalEnv.gthen, psd)
    } : {};
    if (props$$1)
        extend(psd, props$$1);
    ++parent.ref;
    psd.finalize = function () {
        --this.parent.ref || this.parent.finalize();
    };
    var rv = usePSD(psd, fn, a1, a2);
    if (psd.ref === 0)
        psd.finalize();
    return rv;
}
function incrementExpectedAwaits() {
    if (!task.id)
        task.id = ++taskCounter;
    ++task.awaits;
    task.echoes += ZONE_ECHO_LIMIT;
    return task.id;
}
function decrementExpectedAwaits(sourceTaskId) {
    if (!task.awaits || (sourceTaskId && sourceTaskId !== task.id))
        return;
    if (--task.awaits === 0)
        task.id = 0;
    task.echoes = task.awaits * ZONE_ECHO_LIMIT;
}
if (('' + nativePromiseThen).indexOf('[native code]') === -1) {
    incrementExpectedAwaits = decrementExpectedAwaits = nop;
}
function onPossibleParallellAsync(possiblePromise) {
    if (task.echoes && possiblePromise && possiblePromise.constructor === NativePromise) {
        incrementExpectedAwaits();
        return possiblePromise.then(function (x) {
            decrementExpectedAwaits();
            return x;
        }, function (e) {
            decrementExpectedAwaits();
            return rejection(e);
        });
    }
    return possiblePromise;
}
function zoneEnterEcho(targetZone) {
    ++totalEchoes;
    if (!task.echoes || --task.echoes === 0) {
        task.echoes = task.id = 0;
    }
    zoneStack.push(PSD);
    switchToZone(targetZone, true);
}
function zoneLeaveEcho() {
    var zone = zoneStack[zoneStack.length - 1];
    zoneStack.pop();
    switchToZone(zone, false);
}
function switchToZone(targetZone, bEnteringZone) {
    var currentZone = PSD;
    if (bEnteringZone ? task.echoes && (!zoneEchoes++ || targetZone !== PSD) : zoneEchoes && (!--zoneEchoes || targetZone !== PSD)) {
        enqueueNativeMicroTask(bEnteringZone ? zoneEnterEcho.bind(null, targetZone) : zoneLeaveEcho);
    }
    if (targetZone === PSD)
        return;
    PSD = targetZone;
    if (currentZone === globalPSD)
        globalPSD.env = snapShot();
    if (patchGlobalPromise) {
        var GlobalPromise_1 = globalPSD.env.Promise;
        var targetEnv = targetZone.env;
        nativePromiseProto.then = targetEnv.nthen;
        GlobalPromise_1.prototype.then = targetEnv.gthen;
        if (currentZone.global || targetZone.global) {
            Object.defineProperty(_global, 'Promise', targetEnv.PromiseProp);
            GlobalPromise_1.all = targetEnv.all;
            GlobalPromise_1.race = targetEnv.race;
            GlobalPromise_1.resolve = targetEnv.resolve;
            GlobalPromise_1.reject = targetEnv.reject;
            GlobalPromise_1.allSettled = targetEnv.allSettled;
            GlobalPromise_1.any = targetEnv.any;
        }
    }
}
function snapShot() {
    var GlobalPromise = _global.Promise;
    return patchGlobalPromise ? {
        Promise: GlobalPromise,
        PromiseProp: Object.getOwnPropertyDescriptor(_global, "Promise"),
        all: GlobalPromise.all,
        race: GlobalPromise.race,
        allSettled: GlobalPromise.allSettled,
        any: GlobalPromise.any,
        resolve: GlobalPromise.resolve,
        reject: GlobalPromise.reject,
        nthen: nativePromiseProto.then,
        gthen: GlobalPromise.prototype.then
    } : {};
}
function usePSD(psd, fn, a1, a2, a3) {
    var outerScope = PSD;
    try {
        switchToZone(psd, true);
        return fn(a1, a2, a3);
    }
    finally {
        switchToZone(outerScope, false);
    }
}
function enqueueNativeMicroTask(job) {
    nativePromiseThen.call(resolvedNativePromise, job);
}
function nativeAwaitCompatibleWrap(fn, zone, possibleAwait) {
    return typeof fn !== 'function' ? fn : function () {
        var outerZone = PSD;
        if (possibleAwait)
            incrementExpectedAwaits();
        switchToZone(zone, true);
        try {
            return fn.apply(this, arguments);
        }
        finally {
            switchToZone(outerZone, false);
        }
    };
}
function getPatchedPromiseThen(origThen, zone) {
    return function (onResolved, onRejected) {
        return origThen.call(this, nativeAwaitCompatibleWrap(onResolved, zone, false), nativeAwaitCompatibleWrap(onRejected, zone, false));
    };
}
var UNHANDLEDREJECTION = "unhandledrejection";
function globalError(err, promise) {
    var rv;
    try {
        rv = promise.onuncatched(err);
    }
    catch (e) { }
    if (rv !== false)
        try {
            var event, eventData = { promise: promise, reason: err };
            if (_global.document && document.createEvent) {
                event = document.createEvent('Event');
                event.initEvent(UNHANDLEDREJECTION, true, true);
                extend(event, eventData);
            }
            else if (_global.CustomEvent) {
                event = new CustomEvent(UNHANDLEDREJECTION, { detail: eventData });
                extend(event, eventData);
            }
            if (event && _global.dispatchEvent) {
                dispatchEvent(event);
                if (!_global.PromiseRejectionEvent && _global.onunhandledrejection)
                    try {
                        _global.onunhandledrejection(event);
                    }
                    catch (_) { }
            }
            if (debug && event && !event.defaultPrevented) {
                console.warn("Unhandled rejection: " + (err.stack || err));
            }
        }
        catch (e) { }
}
var rejection = DexiePromise.reject;

function tempTransaction(db, mode, storeNames, fn) {
    if (!db._state.openComplete && (!PSD.letThrough)) {
        if (!db._state.isBeingOpened) {
            if (!db._options.autoOpen)
                return rejection(new exceptions.DatabaseClosed());
            db.open().catch(nop);
        }
        return db._state.dbReadyPromise.then(function () { return tempTransaction(db, mode, storeNames, fn); });
    }
    else {
        var trans = db._createTransaction(mode, storeNames, db._dbSchema);
        try {
            trans.create();
        }
        catch (ex) {
            return rejection(ex);
        }
        return trans._promise(mode, function (resolve, reject) {
            return newScope(function () {
                PSD.trans = trans;
                return fn(resolve, reject, trans);
            });
        }).then(function (result) {
            return trans._completion.then(function () { return result; });
        });
    }
}

var DEXIE_VERSION = '3.0.0-rc.7';
var maxString = String.fromCharCode(65535);
var minKey = -Infinity;
var INVALID_KEY_ARGUMENT = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.";
var STRING_EXPECTED = "String expected.";
var connections = [];
var isIEOrEdge = typeof navigator !== 'undefined' && /(MSIE|Trident|Edge)/.test(navigator.userAgent);
var hasIEDeleteObjectStoreBug = isIEOrEdge;
var hangsOnDeleteLargeKeyRange = isIEOrEdge;
var dexieStackFrameFilter = function (frame) { return !/(dexie\.js|dexie\.min\.js)/.test(frame); };
var DBNAMES_DB = '__dbnames';
var READONLY = 'readonly';
var READWRITE = 'readwrite';

function combine(filter1, filter2) {
    return filter1 ?
        filter2 ?
            function () { return filter1.apply(this, arguments) && filter2.apply(this, arguments); } :
            filter1 :
        filter2;
}

var AnyRange = {
    type: 3          ,
    lower: -Infinity,
    lowerOpen: false,
    upper: [[]],
    upperOpen: false
};

var Table =               (function () {
    function Table() {
    }
    Table.prototype._trans = function (mode, fn, writeLocked) {
        var trans = this._tx || PSD.trans;
        var tableName = this.name;
        function checkTableInTransaction(resolve, reject, trans) {
            if (!trans.schema[tableName])
                throw new exceptions.NotFound("Table " + tableName + " not part of transaction");
            return fn(trans.idbtrans, trans);
        }
        var wasRootExec = beginMicroTickScope();
        try {
            return trans && trans.db === this.db ?
                trans === PSD.trans ?
                    trans._promise(mode, checkTableInTransaction, writeLocked) :
                    newScope(function () { return trans._promise(mode, checkTableInTransaction, writeLocked); }, { trans: trans, transless: PSD.transless || PSD }) :
                tempTransaction(this.db, mode, [this.name], checkTableInTransaction);
        }
        finally {
            if (wasRootExec)
                endMicroTickScope();
        }
    };
    Table.prototype.get = function (keyOrCrit, cb) {
        var _this = this;
        if (keyOrCrit && keyOrCrit.constructor === Object)
            return this.where(keyOrCrit).first(cb);
        return this._trans('readonly', function (trans) {
            return _this.core.get({ trans: trans, key: keyOrCrit })
                .then(function (res) { return _this.hook.reading.fire(res); });
        }).then(cb);
    };
    Table.prototype.where = function (indexOrCrit) {
        if (typeof indexOrCrit === 'string')
            return new this.db.WhereClause(this, indexOrCrit);
        if (isArray(indexOrCrit))
            return new this.db.WhereClause(this, "[" + indexOrCrit.join('+') + "]");
        var keyPaths = keys(indexOrCrit);
        if (keyPaths.length === 1)
            return this
                .where(keyPaths[0])
                .equals(indexOrCrit[keyPaths[0]]);
        var compoundIndex = this.schema.indexes.concat(this.schema.primKey).filter(function (ix) {
            return ix.compound &&
                keyPaths.every(function (keyPath) { return ix.keyPath.indexOf(keyPath) >= 0; }) &&
                ix.keyPath.every(function (keyPath) { return keyPaths.indexOf(keyPath) >= 0; });
        })[0];
        if (compoundIndex && this.db._maxKey !== maxString)
            return this
                .where(compoundIndex.name)
                .equals(compoundIndex.keyPath.map(function (kp) { return indexOrCrit[kp]; }));
        if (!compoundIndex && debug)
            console.warn("The query " + JSON.stringify(indexOrCrit) + " on " + this.name + " would benefit of a " +
                ("compound index [" + keyPaths.join('+') + "]"));
        var idxByName = this.schema.idxByName;
        var idb = this.db._deps.indexedDB;
        function equals(a, b) {
            try {
                return idb.cmp(a, b) === 0;
            }
            catch (e) {
                return false;
            }
        }
        var _a = keyPaths.reduce(function (_a, keyPath) {
            var prevIndex = _a[0], prevFilterFn = _a[1];
            var index = idxByName[keyPath];
            var value = indexOrCrit[keyPath];
            return [
                prevIndex || index,
                prevIndex || !index ?
                    combine(prevFilterFn, index && index.multi ?
                        function (x) {
                            var prop = getByKeyPath(x, keyPath);
                            return isArray(prop) && prop.some(function (item) { return equals(value, item); });
                        } : function (x) { return equals(value, getByKeyPath(x, keyPath)); })
                    : prevFilterFn
            ];
        }, [null, null]), idx = _a[0], filterFunction = _a[1];
        return idx ?
            this.where(idx.name).equals(indexOrCrit[idx.keyPath])
                .filter(filterFunction) :
            compoundIndex ?
                this.filter(filterFunction) :
                this.where(keyPaths).equals('');
    };
    Table.prototype.filter = function (filterFunction) {
        return this.toCollection().and(filterFunction);
    };
    Table.prototype.count = function (thenShortcut) {
        return this.toCollection().count(thenShortcut);
    };
    Table.prototype.offset = function (offset) {
        return this.toCollection().offset(offset);
    };
    Table.prototype.limit = function (numRows) {
        return this.toCollection().limit(numRows);
    };
    Table.prototype.each = function (callback) {
        return this.toCollection().each(callback);
    };
    Table.prototype.toArray = function (thenShortcut) {
        return this.toCollection().toArray(thenShortcut);
    };
    Table.prototype.toCollection = function () {
        return new this.db.Collection(new this.db.WhereClause(this));
    };
    Table.prototype.orderBy = function (index) {
        return new this.db.Collection(new this.db.WhereClause(this, isArray(index) ?
            "[" + index.join('+') + "]" :
            index));
    };
    Table.prototype.reverse = function () {
        return this.toCollection().reverse();
    };
    Table.prototype.mapToClass = function (constructor) {
        this.schema.mappedClass = constructor;
        var readHook = function (obj) {
            if (!obj)
                return obj;
            var res = Object.create(constructor.prototype);
            for (var m in obj)
                if (hasOwn(obj, m))
                    try {
                        res[m] = obj[m];
                    }
                    catch (_) { }
            return res;
        };
        if (this.schema.readHook) {
            this.hook.reading.unsubscribe(this.schema.readHook);
        }
        this.schema.readHook = readHook;
        this.hook("reading", readHook);
        return constructor;
    };
    Table.prototype.defineClass = function () {
        function Class(content) {
            extend(this, content);
        }
        
        return this.mapToClass(Class);
    };
    Table.prototype.add = function (obj, key) {
        var _this = this;
        return this._trans('readwrite', function (trans) {
            return _this.core.mutate({ trans: trans, type: 'add', keys: key != null ? [key] : null, values: [obj] });
        }).then(function (res) { return res.numFailures ? DexiePromise.reject(res.failures[0]) : res.lastResult; })
            .then(function (lastResult) {
            if (!_this.core.schema.primaryKey.outbound) {
                try {
                    setByKeyPath(obj, _this.core.schema.primaryKey.keyPath, lastResult);
                }
                catch (_) { }
                
            }
            return lastResult;
        });
    };
    Table.prototype.update = function (keyOrObject, modifications) {
        if (typeof modifications !== 'object' || isArray(modifications))
            throw new exceptions.InvalidArgument("Modifications must be an object.");
        if (typeof keyOrObject === 'object' && !isArray(keyOrObject)) {
            keys(modifications).forEach(function (keyPath) {
                setByKeyPath(keyOrObject, keyPath, modifications[keyPath]);
            });
            var key = getByKeyPath(keyOrObject, this.schema.primKey.keyPath);
            if (key === undefined)
                return rejection(new exceptions.InvalidArgument("Given object does not contain its primary key"));
            return this.where(":id").equals(key).modify(modifications);
        }
        else {
            return this.where(":id").equals(keyOrObject).modify(modifications);
        }
    };
    Table.prototype.put = function (obj, key) {
        var _this = this;
        return this._trans('readwrite', function (trans) { return _this.core.mutate({ trans: trans, type: 'put', values: [obj], keys: key != null ? [key] : null }); })
            .then(function (res) { return res.numFailures ? DexiePromise.reject(res.failures[0]) : res.lastResult; })
            .then(function (lastResult) {
            if (!_this.core.schema.primaryKey.outbound) {
                try {
                    setByKeyPath(obj, _this.core.schema.primaryKey.keyPath, lastResult);
                }
                catch (_) { }
                
            }
            return lastResult;
        });
    };
    Table.prototype.delete = function (key) {
        var _this = this;
        return this._trans('readwrite', function (trans) { return _this.core.mutate({ trans: trans, type: 'delete', keys: [key] }); })
            .then(function (res) { return res.numFailures ? DexiePromise.reject(res.failures[0]) : undefined; });
    };
    Table.prototype.clear = function () {
        var _this = this;
        return this._trans('readwrite', function (trans) { return _this.core.mutate({ trans: trans, type: 'deleteRange', range: AnyRange }); })
            .then(function (res) { return res.numFailures ? DexiePromise.reject(res.failures[0]) : undefined; });
    };
    Table.prototype.bulkGet = function (keys$$1) {
        var _this = this;
        return this._trans('readonly', function (trans) {
            return _this.core.getMany({
                keys: keys$$1,
                trans: trans
            });
        });
    };
    Table.prototype.bulkAdd = function (objects, keysOrOptions, options) {
        var _this = this;
        var keys$$1 = Array.isArray(keysOrOptions) ? keysOrOptions : undefined;
        options = options || (keys$$1 ? undefined : keysOrOptions);
        var wantResults = options ? options.allKeys : undefined;
        return this._trans('readwrite', function (trans) {
            var outbound = _this.core.schema.primaryKey.outbound;
            if (!outbound && keys$$1)
                throw new exceptions.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
            if (keys$$1 && keys$$1.length !== objects.length)
                throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
            var numObjects = objects.length;
            return _this.core.mutate({ trans: trans, type: 'add', keys: keys$$1, values: objects, wantResults: wantResults })
                .then(function (_a) {
                var numFailures = _a.numFailures, results = _a.results, lastResult = _a.lastResult, failures = _a.failures;
                var result = wantResults ? results : lastResult;
                if (numFailures === 0)
                    return result;
                throw new BulkError(_this.name + ".bulkAdd(): " + numFailures + " of " + numObjects + " operations failed", Object.keys(failures).map(function (pos) { return failures[pos]; }));
            });
        });
    };
    Table.prototype.bulkPut = function (objects, keysOrOptions, options) {
        var _this = this;
        var keys$$1 = Array.isArray(keysOrOptions) ? keysOrOptions : undefined;
        options = options || (keys$$1 ? undefined : keysOrOptions);
        var wantResults = options ? options.allKeys : undefined;
        return this._trans('readwrite', function (trans) {
            var outbound = _this.core.schema.primaryKey.outbound;
            if (!outbound && keys$$1)
                throw new exceptions.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
            if (keys$$1 && keys$$1.length !== objects.length)
                throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
            var numObjects = objects.length;
            return _this.core.mutate({ trans: trans, type: 'put', keys: keys$$1, values: objects, wantResults: wantResults })
                .then(function (_a) {
                var numFailures = _a.numFailures, results = _a.results, lastResult = _a.lastResult, failures = _a.failures;
                var result = wantResults ? results : lastResult;
                if (numFailures === 0)
                    return result;
                throw new BulkError(_this.name + ".bulkPut(): " + numFailures + " of " + numObjects + " operations failed", Object.keys(failures).map(function (pos) { return failures[pos]; }));
            });
        });
    };
    Table.prototype.bulkDelete = function (keys$$1) {
        var _this = this;
        var numKeys = keys$$1.length;
        return this._trans('readwrite', function (trans) {
            return _this.core.mutate({ trans: trans, type: 'delete', keys: keys$$1 });
        }).then(function (_a) {
            var numFailures = _a.numFailures, lastResult = _a.lastResult, failures = _a.failures;
            if (numFailures === 0)
                return lastResult;
            throw new BulkError(_this.name + ".bulkDelete(): " + numFailures + " of " + numKeys + " operations failed", failures);
        });
    };
    return Table;
}());

function Events(ctx) {
    var evs = {};
    var rv = function (eventName, subscriber) {
        if (subscriber) {
            var i = arguments.length, args = new Array(i - 1);
            while (--i)
                args[i - 1] = arguments[i];
            evs[eventName].subscribe.apply(null, args);
            return ctx;
        }
        else if (typeof (eventName) === 'string') {
            return evs[eventName];
        }
    };
    rv.addEventType = add;
    for (var i = 1, l = arguments.length; i < l; ++i) {
        add(arguments[i]);
    }
    return rv;
    function add(eventName, chainFunction, defaultFunction) {
        if (typeof eventName === 'object')
            return addConfiguredEvents(eventName);
        if (!chainFunction)
            chainFunction = reverseStoppableEventChain;
        if (!defaultFunction)
            defaultFunction = nop;
        var context = {
            subscribers: [],
            fire: defaultFunction,
            subscribe: function (cb) {
                if (context.subscribers.indexOf(cb) === -1) {
                    context.subscribers.push(cb);
                    context.fire = chainFunction(context.fire, cb);
                }
            },
            unsubscribe: function (cb) {
                context.subscribers = context.subscribers.filter(function (fn) { return fn !== cb; });
                context.fire = context.subscribers.reduce(chainFunction, defaultFunction);
            }
        };
        evs[eventName] = rv[eventName] = context;
        return context;
    }
    function addConfiguredEvents(cfg) {
        keys(cfg).forEach(function (eventName) {
            var args = cfg[eventName];
            if (isArray(args)) {
                add(eventName, cfg[eventName][0], cfg[eventName][1]);
            }
            else if (args === 'asap') {
                var context = add(eventName, mirror, function fire() {
                    var i = arguments.length, args = new Array(i);
                    while (i--)
                        args[i] = arguments[i];
                    context.subscribers.forEach(function (fn) {
                        asap(function fireEvent() {
                            fn.apply(null, args);
                        });
                    });
                });
            }
            else
                throw new exceptions.InvalidArgument("Invalid event config");
        });
    }
}

function makeClassConstructor(prototype, constructor) {
    derive(constructor).from({ prototype: prototype });
    return constructor;
}

function createTableConstructor(db) {
    return makeClassConstructor(Table.prototype, function Table$$1(name, tableSchema, trans) {
        this.db = db;
        this._tx = trans;
        this.name = name;
        this.schema = tableSchema;
        this.hook = db._allTables[name] ? db._allTables[name].hook : Events(null, {
            "creating": [hookCreatingChain, nop],
            "reading": [pureFunctionChain, mirror],
            "updating": [hookUpdatingChain, nop],
            "deleting": [hookDeletingChain, nop]
        });
    });
}

function isPlainKeyRange(ctx, ignoreLimitFilter) {
    return !(ctx.filter || ctx.algorithm || ctx.or) &&
        (ignoreLimitFilter ? ctx.justLimit : !ctx.replayFilter);
}
function addFilter(ctx, fn) {
    ctx.filter = combine(ctx.filter, fn);
}
function addReplayFilter(ctx, factory, isLimitFilter) {
    var curr = ctx.replayFilter;
    ctx.replayFilter = curr ? function () { return combine(curr(), factory()); } : factory;
    ctx.justLimit = isLimitFilter && !curr;
}
function addMatchFilter(ctx, fn) {
    ctx.isMatch = combine(ctx.isMatch, fn);
}
function getIndexOrStore(ctx, coreSchema) {
    if (ctx.isPrimKey)
        return coreSchema.primaryKey;
    var index = coreSchema.getIndexByKeyPath(ctx.index);
    if (!index)
        throw new exceptions.Schema("KeyPath " + ctx.index + " on object store " + coreSchema.name + " is not indexed");
    return index;
}
function openCursor(ctx, coreTable, trans) {
    var index = getIndexOrStore(ctx, coreTable.schema);
    return coreTable.openCursor({
        trans: trans,
        values: !ctx.keysOnly,
        reverse: ctx.dir === 'prev',
        unique: !!ctx.unique,
        query: {
            index: index,
            range: ctx.range
        }
    });
}
function iter(ctx, fn, coreTrans, coreTable) {
    var filter = ctx.replayFilter ? combine(ctx.filter, ctx.replayFilter()) : ctx.filter;
    if (!ctx.or) {
        return iterate(openCursor(ctx, coreTable, coreTrans), combine(ctx.algorithm, filter), fn, !ctx.keysOnly && ctx.valueMapper);
    }
    else {
        var set_1 = {};
        var union = function (item, cursor, advance) {
            if (!filter || filter(cursor, advance, function (result) { return cursor.stop(result); }, function (err) { return cursor.fail(err); })) {
                var primaryKey = cursor.primaryKey;
                var key = '' + primaryKey;
                if (key === '[object ArrayBuffer]')
                    key = '' + new Uint8Array(primaryKey);
                if (!hasOwn(set_1, key)) {
                    set_1[key] = true;
                    fn(item, cursor, advance);
                }
            }
        };
        return Promise.all([
            ctx.or._iterate(union, coreTrans),
            iterate(openCursor(ctx, coreTable, coreTrans), ctx.algorithm, union, !ctx.keysOnly && ctx.valueMapper)
        ]);
    }
}
function iterate(cursorPromise, filter, fn, valueMapper) {
    var mappedFn = valueMapper ? function (x, c, a) { return fn(valueMapper(x), c, a); } : fn;
    var wrappedFn = wrap(mappedFn);
    return cursorPromise.then(function (cursor) {
        if (cursor) {
            return cursor.start(function () {
                var c = function () { return cursor.continue(); };
                if (!filter || filter(cursor, function (advancer) { return c = advancer; }, function (val) { cursor.stop(val); c = nop; }, function (e) { cursor.fail(e); c = nop; }))
                    wrappedFn(cursor.value, cursor, function (advancer) { return c = advancer; });
                c();
            });
        }
    });
}

var Collection =               (function () {
    function Collection() {
    }
    Collection.prototype._read = function (fn, cb) {
        var ctx = this._ctx;
        return ctx.error ?
            ctx.table._trans(null, rejection.bind(null, ctx.error)) :
            ctx.table._trans('readonly', fn).then(cb);
    };
    Collection.prototype._write = function (fn) {
        var ctx = this._ctx;
        return ctx.error ?
            ctx.table._trans(null, rejection.bind(null, ctx.error)) :
            ctx.table._trans('readwrite', fn, "locked");
    };
    Collection.prototype._addAlgorithm = function (fn) {
        var ctx = this._ctx;
        ctx.algorithm = combine(ctx.algorithm, fn);
    };
    Collection.prototype._iterate = function (fn, coreTrans) {
        return iter(this._ctx, fn, coreTrans, this._ctx.table.core);
    };
    Collection.prototype.clone = function (props$$1) {
        var rv = Object.create(this.constructor.prototype), ctx = Object.create(this._ctx);
        if (props$$1)
            extend(ctx, props$$1);
        rv._ctx = ctx;
        return rv;
    };
    Collection.prototype.raw = function () {
        this._ctx.valueMapper = null;
        return this;
    };
    Collection.prototype.each = function (fn) {
        var ctx = this._ctx;
        return this._read(function (trans) { return iter(ctx, fn, trans, ctx.table.core); });
    };
    Collection.prototype.count = function (cb) {
        var _this = this;
        return this._read(function (trans) {
            var ctx = _this._ctx;
            var coreTable = ctx.table.core;
            if (isPlainKeyRange(ctx, true)) {
                return coreTable.count({
                    trans: trans,
                    query: {
                        index: getIndexOrStore(ctx, coreTable.schema),
                        range: ctx.range
                    }
                }).then(function (count) { return Math.min(count, ctx.limit); });
            }
            else {
                var count = 0;
                return iter(ctx, function () { ++count; return false; }, trans, coreTable)
                    .then(function () { return count; });
            }
        }).then(cb);
    };
    Collection.prototype.sortBy = function (keyPath, cb) {
        var parts = keyPath.split('.').reverse(), lastPart = parts[0], lastIndex = parts.length - 1;
        function getval(obj, i) {
            if (i)
                return getval(obj[parts[i]], i - 1);
            return obj[lastPart];
        }
        var order = this._ctx.dir === "next" ? 1 : -1;
        function sorter(a, b) {
            var aVal = getval(a, lastIndex), bVal = getval(b, lastIndex);
            return aVal < bVal ? -order : aVal > bVal ? order : 0;
        }
        return this.toArray(function (a) {
            return a.sort(sorter);
        }).then(cb);
    };
    Collection.prototype.toArray = function (cb) {
        var _this = this;
        return this._read(function (trans) {
            var ctx = _this._ctx;
            if (ctx.dir === 'next' && isPlainKeyRange(ctx, true) && ctx.limit > 0) {
                var valueMapper_1 = ctx.valueMapper;
                var index = getIndexOrStore(ctx, ctx.table.core.schema);
                return ctx.table.core.query({
                    trans: trans,
                    limit: ctx.limit,
                    values: true,
                    query: {
                        index: index,
                        range: ctx.range
                    }
                }).then(function (_a) {
                    var result = _a.result;
                    return valueMapper_1 ? result.map(valueMapper_1) : result;
                });
            }
            else {
                var a_1 = [];
                return iter(ctx, function (item) { return a_1.push(item); }, trans, ctx.table.core).then(function () { return a_1; });
            }
        }, cb);
    };
    Collection.prototype.offset = function (offset) {
        var ctx = this._ctx;
        if (offset <= 0)
            return this;
        ctx.offset += offset;
        if (isPlainKeyRange(ctx)) {
            addReplayFilter(ctx, function () {
                var offsetLeft = offset;
                return function (cursor, advance) {
                    if (offsetLeft === 0)
                        return true;
                    if (offsetLeft === 1) {
                        --offsetLeft;
                        return false;
                    }
                    advance(function () {
                        cursor.advance(offsetLeft);
                        offsetLeft = 0;
                    });
                    return false;
                };
            });
        }
        else {
            addReplayFilter(ctx, function () {
                var offsetLeft = offset;
                return function () { return (--offsetLeft < 0); };
            });
        }
        return this;
    };
    Collection.prototype.limit = function (numRows) {
        this._ctx.limit = Math.min(this._ctx.limit, numRows);
        addReplayFilter(this._ctx, function () {
            var rowsLeft = numRows;
            return function (cursor, advance, resolve) {
                if (--rowsLeft <= 0)
                    advance(resolve);
                return rowsLeft >= 0;
            };
        }, true);
        return this;
    };
    Collection.prototype.until = function (filterFunction, bIncludeStopEntry) {
        addFilter(this._ctx, function (cursor, advance, resolve) {
            if (filterFunction(cursor.value)) {
                advance(resolve);
                return bIncludeStopEntry;
            }
            else {
                return true;
            }
        });
        return this;
    };
    Collection.prototype.first = function (cb) {
        return this.limit(1).toArray(function (a) { return a[0]; }).then(cb);
    };
    Collection.prototype.last = function (cb) {
        return this.reverse().first(cb);
    };
    Collection.prototype.filter = function (filterFunction) {
        addFilter(this._ctx, function (cursor) {
            return filterFunction(cursor.value);
        });
        addMatchFilter(this._ctx, filterFunction);
        return this;
    };
    Collection.prototype.and = function (filter) {
        return this.filter(filter);
    };
    Collection.prototype.or = function (indexName) {
        return new this.db.WhereClause(this._ctx.table, indexName, this);
    };
    Collection.prototype.reverse = function () {
        this._ctx.dir = (this._ctx.dir === "prev" ? "next" : "prev");
        if (this._ondirectionchange)
            this._ondirectionchange(this._ctx.dir);
        return this;
    };
    Collection.prototype.desc = function () {
        return this.reverse();
    };
    Collection.prototype.eachKey = function (cb) {
        var ctx = this._ctx;
        ctx.keysOnly = !ctx.isMatch;
        return this.each(function (val, cursor) { cb(cursor.key, cursor); });
    };
    Collection.prototype.eachUniqueKey = function (cb) {
        this._ctx.unique = "unique";
        return this.eachKey(cb);
    };
    Collection.prototype.eachPrimaryKey = function (cb) {
        var ctx = this._ctx;
        ctx.keysOnly = !ctx.isMatch;
        return this.each(function (val, cursor) { cb(cursor.primaryKey, cursor); });
    };
    Collection.prototype.keys = function (cb) {
        var ctx = this._ctx;
        ctx.keysOnly = !ctx.isMatch;
        var a = [];
        return this.each(function (item, cursor) {
            a.push(cursor.key);
        }).then(function () {
            return a;
        }).then(cb);
    };
    Collection.prototype.primaryKeys = function (cb) {
        var ctx = this._ctx;
        if (ctx.dir === 'next' && isPlainKeyRange(ctx, true) && ctx.limit > 0) {
            return this._read(function (trans) {
                var index = getIndexOrStore(ctx, ctx.table.core.schema);
                return ctx.table.core.query({
                    trans: trans,
                    values: false,
                    limit: ctx.limit,
                    query: {
                        index: index,
                        range: ctx.range
                    }
                });
            }).then(function (_a) {
                var result = _a.result;
                return result;
            }).then(cb);
        }
        ctx.keysOnly = !ctx.isMatch;
        var a = [];
        return this.each(function (item, cursor) {
            a.push(cursor.primaryKey);
        }).then(function () {
            return a;
        }).then(cb);
    };
    Collection.prototype.uniqueKeys = function (cb) {
        this._ctx.unique = "unique";
        return this.keys(cb);
    };
    Collection.prototype.firstKey = function (cb) {
        return this.limit(1).keys(function (a) { return a[0]; }).then(cb);
    };
    Collection.prototype.lastKey = function (cb) {
        return this.reverse().firstKey(cb);
    };
    Collection.prototype.distinct = function () {
        var ctx = this._ctx, idx = ctx.index && ctx.table.schema.idxByName[ctx.index];
        if (!idx || !idx.multi)
            return this;
        var set = {};
        addFilter(this._ctx, function (cursor) {
            var strKey = cursor.primaryKey.toString();
            var found = hasOwn(set, strKey);
            set[strKey] = true;
            return !found;
        });
        return this;
    };
    Collection.prototype.modify = function (changes) {
        var _this = this;
        var ctx = this._ctx;
        return this._write(function (trans) {
            var modifyer;
            if (typeof changes === 'function') {
                modifyer = changes;
            }
            else {
                var keyPaths = keys(changes);
                var numKeys = keyPaths.length;
                modifyer = function (item) {
                    var anythingModified = false;
                    for (var i = 0; i < numKeys; ++i) {
                        var keyPath = keyPaths[i], val = changes[keyPath];
                        if (getByKeyPath(item, keyPath) !== val) {
                            setByKeyPath(item, keyPath, val);
                            anythingModified = true;
                        }
                    }
                    return anythingModified;
                };
            }
            var coreTable = ctx.table.core;
            var _a = coreTable.schema.primaryKey, outbound = _a.outbound, extractKey = _a.extractKey;
            var limit = 'testmode' in Dexie ? 1 : 2000;
            var cmp = _this.db.core.cmp;
            var totalFailures = [];
            var successCount = 0;
            var failedKeys = [];
            var applyMutateResult = function (expectedCount, res) {
                var failures = res.failures, numFailures = res.numFailures;
                successCount += expectedCount - numFailures;
                for (var _i = 0, _a = keys(failures); _i < _a.length; _i++) {
                    var pos = _a[_i];
                    totalFailures.push(failures[pos]);
                }
            };
            return _this.clone().primaryKeys().then(function (keys$$1) {
                var nextChunk = function (offset) {
                    var count = Math.min(limit, keys$$1.length - offset);
                    return coreTable.getMany({ trans: trans, keys: keys$$1.slice(offset, offset + count) }).then(function (values) {
                        var addValues = [];
                        var putValues = [];
                        var putKeys = outbound ? [] : null;
                        var deleteKeys = [];
                        for (var i = 0; i < count; ++i) {
                            var origValue = values[i];
                            var ctx_1 = {
                                value: deepClone(origValue),
                                primKey: keys$$1[offset + i]
                            };
                            if (modifyer.call(ctx_1, ctx_1.value, ctx_1) !== false) {
                                if (ctx_1.value == null) {
                                    deleteKeys.push(keys$$1[offset + i]);
                                }
                                else if (!outbound && cmp(extractKey(origValue), extractKey(ctx_1.value)) !== 0) {
                                    deleteKeys.push(keys$$1[offset + i]);
                                    addValues.push(ctx_1.value);
                                }
                                else {
                                    putValues.push(ctx_1.value);
                                    if (outbound)
                                        putKeys.push(keys$$1[offset + i]);
                                }
                            }
                        }
                        return Promise.resolve(addValues.length > 0 &&
                            coreTable.mutate({ trans: trans, type: 'add', values: addValues })
                                .then(function (res) {
                                for (var pos in res.failures) {
                                    deleteKeys.splice(parseInt(pos), 1);
                                }
                                applyMutateResult(addValues.length, res);
                            })).then(function (res) { return putValues.length > 0 &&
                            coreTable.mutate({ trans: trans, type: 'put', keys: putKeys, values: putValues })
                                .then(function (res) { return applyMutateResult(putValues.length, res); }); }).then(function () { return deleteKeys.length > 0 &&
                            coreTable.mutate({ trans: trans, type: 'delete', keys: deleteKeys })
                                .then(function (res) { return applyMutateResult(deleteKeys.length, res); }); }).then(function () {
                            return keys$$1.length > offset + count && nextChunk(offset + limit);
                        });
                    });
                };
                return nextChunk(0).then(function () {
                    if (totalFailures.length > 0)
                        throw new ModifyError("Error modifying one or more objects", totalFailures, successCount, failedKeys);
                    return keys$$1.length;
                });
            });
        });
    };
    Collection.prototype.delete = function () {
        var ctx = this._ctx, range = ctx.range;
        if (isPlainKeyRange(ctx) &&
            ((ctx.isPrimKey && !hangsOnDeleteLargeKeyRange) || range.type === 3          ))
         {
            return this._write(function (trans) {
                var primaryKey = ctx.table.core.schema.primaryKey;
                var coreRange = range;
                return ctx.table.core.count({ trans: trans, query: { index: primaryKey, range: coreRange } }).then(function (count) {
                    return ctx.table.core.mutate({ trans: trans, type: 'deleteRange', range: coreRange })
                        .then(function (_a) {
                        var failures = _a.failures, lastResult = _a.lastResult, results = _a.results, numFailures = _a.numFailures;
                        if (numFailures)
                            throw new ModifyError("Could not delete some values", Object.keys(failures).map(function (pos) { return failures[pos]; }), count - numFailures);
                        return count - numFailures;
                    });
                });
            });
        }
        return this.modify(function (value, ctx) { return ctx.value = null; });
    };
    return Collection;
}());

function createCollectionConstructor(db) {
    return makeClassConstructor(Collection.prototype, function Collection$$1(whereClause, keyRangeGenerator) {
        this.db = db;
        var keyRange = AnyRange, error = null;
        if (keyRangeGenerator)
            try {
                keyRange = keyRangeGenerator();
            }
            catch (ex) {
                error = ex;
            }
        var whereCtx = whereClause._ctx;
        var table = whereCtx.table;
        var readingHook = table.hook.reading.fire;
        this._ctx = {
            table: table,
            index: whereCtx.index,
            isPrimKey: (!whereCtx.index || (table.schema.primKey.keyPath && whereCtx.index === table.schema.primKey.name)),
            range: keyRange,
            keysOnly: false,
            dir: "next",
            unique: "",
            algorithm: null,
            filter: null,
            replayFilter: null,
            justLimit: true,
            isMatch: null,
            offset: 0,
            limit: Infinity,
            error: error,
            or: whereCtx.or,
            valueMapper: readingHook !== mirror ? readingHook : null
        };
    });
}

function simpleCompare(a, b) {
    return a < b ? -1 : a === b ? 0 : 1;
}
function simpleCompareReverse(a, b) {
    return a > b ? -1 : a === b ? 0 : 1;
}

function fail(collectionOrWhereClause, err, T) {
    var collection = collectionOrWhereClause instanceof WhereClause ?
        new collectionOrWhereClause.Collection(collectionOrWhereClause) :
        collectionOrWhereClause;
    collection._ctx.error = T ? new T(err) : new TypeError(err);
    return collection;
}
function emptyCollection(whereClause) {
    return new whereClause.Collection(whereClause, function () { return rangeEqual(""); }).limit(0);
}
function upperFactory(dir) {
    return dir === "next" ?
        function (s) { return s.toUpperCase(); } :
        function (s) { return s.toLowerCase(); };
}
function lowerFactory(dir) {
    return dir === "next" ?
        function (s) { return s.toLowerCase(); } :
        function (s) { return s.toUpperCase(); };
}
function nextCasing(key, lowerKey, upperNeedle, lowerNeedle, cmp, dir) {
    var length = Math.min(key.length, lowerNeedle.length);
    var llp = -1;
    for (var i = 0; i < length; ++i) {
        var lwrKeyChar = lowerKey[i];
        if (lwrKeyChar !== lowerNeedle[i]) {
            if (cmp(key[i], upperNeedle[i]) < 0)
                return key.substr(0, i) + upperNeedle[i] + upperNeedle.substr(i + 1);
            if (cmp(key[i], lowerNeedle[i]) < 0)
                return key.substr(0, i) + lowerNeedle[i] + upperNeedle.substr(i + 1);
            if (llp >= 0)
                return key.substr(0, llp) + lowerKey[llp] + upperNeedle.substr(llp + 1);
            return null;
        }
        if (cmp(key[i], lwrKeyChar) < 0)
            llp = i;
    }
    if (length < lowerNeedle.length && dir === "next")
        return key + upperNeedle.substr(key.length);
    if (length < key.length && dir === "prev")
        return key.substr(0, upperNeedle.length);
    return (llp < 0 ? null : key.substr(0, llp) + lowerNeedle[llp] + upperNeedle.substr(llp + 1));
}
function addIgnoreCaseAlgorithm(whereClause, match, needles, suffix) {
    var upper, lower, compare, upperNeedles, lowerNeedles, direction, nextKeySuffix, needlesLen = needles.length;
    if (!needles.every(function (s) { return typeof s === 'string'; })) {
        return fail(whereClause, STRING_EXPECTED);
    }
    function initDirection(dir) {
        upper = upperFactory(dir);
        lower = lowerFactory(dir);
        compare = (dir === "next" ? simpleCompare : simpleCompareReverse);
        var needleBounds = needles.map(function (needle) {
            return { lower: lower(needle), upper: upper(needle) };
        }).sort(function (a, b) {
            return compare(a.lower, b.lower);
        });
        upperNeedles = needleBounds.map(function (nb) { return nb.upper; });
        lowerNeedles = needleBounds.map(function (nb) { return nb.lower; });
        direction = dir;
        nextKeySuffix = (dir === "next" ? "" : suffix);
    }
    initDirection("next");
    var c = new whereClause.Collection(whereClause, function () { return createRange(upperNeedles[0], lowerNeedles[needlesLen - 1] + suffix); });
    c._ondirectionchange = function (direction) {
        initDirection(direction);
    };
    var firstPossibleNeedle = 0;
    c._addAlgorithm(function (cursor, advance, resolve) {
        var key = cursor.key;
        if (typeof key !== 'string')
            return false;
        var lowerKey = lower(key);
        if (match(lowerKey, lowerNeedles, firstPossibleNeedle)) {
            return true;
        }
        else {
            var lowestPossibleCasing = null;
            for (var i = firstPossibleNeedle; i < needlesLen; ++i) {
                var casing = nextCasing(key, lowerKey, upperNeedles[i], lowerNeedles[i], compare, direction);
                if (casing === null && lowestPossibleCasing === null)
                    firstPossibleNeedle = i + 1;
                else if (lowestPossibleCasing === null || compare(lowestPossibleCasing, casing) > 0) {
                    lowestPossibleCasing = casing;
                }
            }
            if (lowestPossibleCasing !== null) {
                advance(function () { cursor.continue(lowestPossibleCasing + nextKeySuffix); });
            }
            else {
                advance(resolve);
            }
            return false;
        }
    });
    return c;
}
function createRange(lower, upper, lowerOpen, upperOpen) {
    return {
        type: 2            ,
        lower: lower,
        upper: upper,
        lowerOpen: lowerOpen,
        upperOpen: upperOpen
    };
}
function rangeEqual(value) {
    return {
        type: 1            ,
        lower: value,
        upper: value
    };
}

var WhereClause =               (function () {
    function WhereClause() {
    }
    Object.defineProperty(WhereClause.prototype, "Collection", {
        get: function () {
            return this._ctx.table.db.Collection;
        },
        enumerable: true,
        configurable: true
    });
    WhereClause.prototype.between = function (lower, upper, includeLower, includeUpper) {
        includeLower = includeLower !== false;
        includeUpper = includeUpper === true;
        try {
            if ((this._cmp(lower, upper) > 0) ||
                (this._cmp(lower, upper) === 0 && (includeLower || includeUpper) && !(includeLower && includeUpper)))
                return emptyCollection(this);
            return new this.Collection(this, function () { return createRange(lower, upper, !includeLower, !includeUpper); });
        }
        catch (e) {
            return fail(this, INVALID_KEY_ARGUMENT);
        }
    };
    WhereClause.prototype.equals = function (value) {
        return new this.Collection(this, function () { return rangeEqual(value); });
    };
    WhereClause.prototype.above = function (value) {
        if (value == null)
            return fail(this, INVALID_KEY_ARGUMENT);
        return new this.Collection(this, function () { return createRange(value, undefined, true); });
    };
    WhereClause.prototype.aboveOrEqual = function (value) {
        if (value == null)
            return fail(this, INVALID_KEY_ARGUMENT);
        return new this.Collection(this, function () { return createRange(value, undefined, false); });
    };
    WhereClause.prototype.below = function (value) {
        if (value == null)
            return fail(this, INVALID_KEY_ARGUMENT);
        return new this.Collection(this, function () { return createRange(undefined, value, false, true); });
    };
    WhereClause.prototype.belowOrEqual = function (value) {
        if (value == null)
            return fail(this, INVALID_KEY_ARGUMENT);
        return new this.Collection(this, function () { return createRange(undefined, value); });
    };
    WhereClause.prototype.startsWith = function (str) {
        if (typeof str !== 'string')
            return fail(this, STRING_EXPECTED);
        return this.between(str, str + maxString, true, true);
    };
    WhereClause.prototype.startsWithIgnoreCase = function (str) {
        if (str === "")
            return this.startsWith(str);
        return addIgnoreCaseAlgorithm(this, function (x, a) { return x.indexOf(a[0]) === 0; }, [str], maxString);
    };
    WhereClause.prototype.equalsIgnoreCase = function (str) {
        return addIgnoreCaseAlgorithm(this, function (x, a) { return x === a[0]; }, [str], "");
    };
    WhereClause.prototype.anyOfIgnoreCase = function () {
        var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
        if (set.length === 0)
            return emptyCollection(this);
        return addIgnoreCaseAlgorithm(this, function (x, a) { return a.indexOf(x) !== -1; }, set, "");
    };
    WhereClause.prototype.startsWithAnyOfIgnoreCase = function () {
        var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
        if (set.length === 0)
            return emptyCollection(this);
        return addIgnoreCaseAlgorithm(this, function (x, a) { return a.some(function (n) { return x.indexOf(n) === 0; }); }, set, maxString);
    };
    WhereClause.prototype.anyOf = function () {
        var _this = this;
        var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
        var compare = this._cmp;
        try {
            set.sort(compare);
        }
        catch (e) {
            return fail(this, INVALID_KEY_ARGUMENT);
        }
        if (set.length === 0)
            return emptyCollection(this);
        var c = new this.Collection(this, function () { return createRange(set[0], set[set.length - 1]); });
        c._ondirectionchange = function (direction) {
            compare = (direction === "next" ?
                _this._ascending :
                _this._descending);
            set.sort(compare);
        };
        var i = 0;
        c._addAlgorithm(function (cursor, advance, resolve) {
            var key = cursor.key;
            while (compare(key, set[i]) > 0) {
                ++i;
                if (i === set.length) {
                    advance(resolve);
                    return false;
                }
            }
            if (compare(key, set[i]) === 0) {
                return true;
            }
            else {
                advance(function () { cursor.continue(set[i]); });
                return false;
            }
        });
        return c;
    };
    WhereClause.prototype.notEqual = function (value) {
        return this.inAnyRange([[minKey, value], [value, this.db._maxKey]], { includeLowers: false, includeUppers: false });
    };
    WhereClause.prototype.noneOf = function () {
        var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
        if (set.length === 0)
            return new this.Collection(this);
        try {
            set.sort(this._ascending);
        }
        catch (e) {
            return fail(this, INVALID_KEY_ARGUMENT);
        }
        var ranges = set.reduce(function (res, val) { return res ?
            res.concat([[res[res.length - 1][1], val]]) :
            [[minKey, val]]; }, null);
        ranges.push([set[set.length - 1], this.db._maxKey]);
        return this.inAnyRange(ranges, { includeLowers: false, includeUppers: false });
    };
    WhereClause.prototype.inAnyRange = function (ranges, options) {
        var _this = this;
        var cmp = this._cmp, ascending = this._ascending, descending = this._descending, min = this._min, max = this._max;
        if (ranges.length === 0)
            return emptyCollection(this);
        if (!ranges.every(function (range) {
            return range[0] !== undefined &&
                range[1] !== undefined &&
                ascending(range[0], range[1]) <= 0;
        })) {
            return fail(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", exceptions.InvalidArgument);
        }
        var includeLowers = !options || options.includeLowers !== false;
        var includeUppers = options && options.includeUppers === true;
        function addRange(ranges, newRange) {
            var i = 0, l = ranges.length;
            for (; i < l; ++i) {
                var range = ranges[i];
                if (cmp(newRange[0], range[1]) < 0 && cmp(newRange[1], range[0]) > 0) {
                    range[0] = min(range[0], newRange[0]);
                    range[1] = max(range[1], newRange[1]);
                    break;
                }
            }
            if (i === l)
                ranges.push(newRange);
            return ranges;
        }
        var sortDirection = ascending;
        function rangeSorter(a, b) { return sortDirection(a[0], b[0]); }
        var set;
        try {
            set = ranges.reduce(addRange, []);
            set.sort(rangeSorter);
        }
        catch (ex) {
            return fail(this, INVALID_KEY_ARGUMENT);
        }
        var rangePos = 0;
        var keyIsBeyondCurrentEntry = includeUppers ?
            function (key) { return ascending(key, set[rangePos][1]) > 0; } :
            function (key) { return ascending(key, set[rangePos][1]) >= 0; };
        var keyIsBeforeCurrentEntry = includeLowers ?
            function (key) { return descending(key, set[rangePos][0]) > 0; } :
            function (key) { return descending(key, set[rangePos][0]) >= 0; };
        function keyWithinCurrentRange(key) {
            return !keyIsBeyondCurrentEntry(key) && !keyIsBeforeCurrentEntry(key);
        }
        var checkKey = keyIsBeyondCurrentEntry;
        var c = new this.Collection(this, function () { return createRange(set[0][0], set[set.length - 1][1], !includeLowers, !includeUppers); });
        c._ondirectionchange = function (direction) {
            if (direction === "next") {
                checkKey = keyIsBeyondCurrentEntry;
                sortDirection = ascending;
            }
            else {
                checkKey = keyIsBeforeCurrentEntry;
                sortDirection = descending;
            }
            set.sort(rangeSorter);
        };
        c._addAlgorithm(function (cursor, advance, resolve) {
            var key = cursor.key;
            while (checkKey(key)) {
                ++rangePos;
                if (rangePos === set.length) {
                    advance(resolve);
                    return false;
                }
            }
            if (keyWithinCurrentRange(key)) {
                return true;
            }
            else if (_this._cmp(key, set[rangePos][1]) === 0 || _this._cmp(key, set[rangePos][0]) === 0) {
                return false;
            }
            else {
                advance(function () {
                    if (sortDirection === ascending)
                        cursor.continue(set[rangePos][0]);
                    else
                        cursor.continue(set[rangePos][1]);
                });
                return false;
            }
        });
        return c;
    };
    WhereClause.prototype.startsWithAnyOf = function () {
        var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
        if (!set.every(function (s) { return typeof s === 'string'; })) {
            return fail(this, "startsWithAnyOf() only works with strings");
        }
        if (set.length === 0)
            return emptyCollection(this);
        return this.inAnyRange(set.map(function (str) { return [str, str + maxString]; }));
    };
    return WhereClause;
}());

function createWhereClauseConstructor(db) {
    return makeClassConstructor(WhereClause.prototype, function WhereClause$$1(table, index, orCollection) {
        this.db = db;
        this._ctx = {
            table: table,
            index: index === ":id" ? null : index,
            or: orCollection
        };
        var indexedDB = db._deps.indexedDB;
        if (!indexedDB)
            throw new exceptions.MissingAPI("indexedDB API missing");
        this._cmp = this._ascending = indexedDB.cmp.bind(indexedDB);
        this._descending = function (a, b) { return indexedDB.cmp(b, a); };
        this._max = function (a, b) { return indexedDB.cmp(a, b) > 0 ? a : b; };
        this._min = function (a, b) { return indexedDB.cmp(a, b) < 0 ? a : b; };
        this._IDBKeyRange = db._deps.IDBKeyRange;
    });
}

function safariMultiStoreFix(storeNames) {
    return storeNames.length === 1 ? storeNames[0] : storeNames;
}

function getMaxKey(IdbKeyRange) {
    try {
        IdbKeyRange.only([[]]);
        return [[]];
    }
    catch (e) {
        return maxString;
    }
}

function eventRejectHandler(reject) {
    return wrap(function (event) {
        preventDefault(event);
        reject(event.target.error);
        return false;
    });
}



function preventDefault(event) {
    if (event.stopPropagation)
        event.stopPropagation();
    if (event.preventDefault)
        event.preventDefault();
}

var Transaction =               (function () {
    function Transaction() {
    }
    Transaction.prototype._lock = function () {
        assert(!PSD.global);
        ++this._reculock;
        if (this._reculock === 1 && !PSD.global)
            PSD.lockOwnerFor = this;
        return this;
    };
    Transaction.prototype._unlock = function () {
        assert(!PSD.global);
        if (--this._reculock === 0) {
            if (!PSD.global)
                PSD.lockOwnerFor = null;
            while (this._blockedFuncs.length > 0 && !this._locked()) {
                var fnAndPSD = this._blockedFuncs.shift();
                try {
                    usePSD(fnAndPSD[1], fnAndPSD[0]);
                }
                catch (e) { }
            }
        }
        return this;
    };
    Transaction.prototype._locked = function () {
        return this._reculock && PSD.lockOwnerFor !== this;
    };
    Transaction.prototype.create = function (idbtrans) {
        var _this = this;
        if (!this.mode)
            return this;
        var idbdb = this.db.idbdb;
        var dbOpenError = this.db._state.dbOpenError;
        assert(!this.idbtrans);
        if (!idbtrans && !idbdb) {
            switch (dbOpenError && dbOpenError.name) {
                case "DatabaseClosedError":
                    throw new exceptions.DatabaseClosed(dbOpenError);
                case "MissingAPIError":
                    throw new exceptions.MissingAPI(dbOpenError.message, dbOpenError);
                default:
                    throw new exceptions.OpenFailed(dbOpenError);
            }
        }
        if (!this.active)
            throw new exceptions.TransactionInactive();
        assert(this._completion._state === null);
        idbtrans = this.idbtrans = idbtrans || idbdb.transaction(safariMultiStoreFix(this.storeNames), this.mode);
        idbtrans.onerror = wrap(function (ev) {
            preventDefault(ev);
            _this._reject(idbtrans.error);
        });
        idbtrans.onabort = wrap(function (ev) {
            preventDefault(ev);
            _this.active && _this._reject(new exceptions.Abort(idbtrans.error));
            _this.active = false;
            _this.on("abort").fire(ev);
        });
        idbtrans.oncomplete = wrap(function () {
            _this.active = false;
            _this._resolve();
        });
        return this;
    };
    Transaction.prototype._promise = function (mode, fn, bWriteLock) {
        var _this = this;
        if (mode === 'readwrite' && this.mode !== 'readwrite')
            return rejection(new exceptions.ReadOnly("Transaction is readonly"));
        if (!this.active)
            return rejection(new exceptions.TransactionInactive());
        if (this._locked()) {
            return new DexiePromise(function (resolve, reject) {
                _this._blockedFuncs.push([function () {
                        _this._promise(mode, fn, bWriteLock).then(resolve, reject);
                    }, PSD]);
            });
        }
        else if (bWriteLock) {
            return newScope(function () {
                var p = new DexiePromise(function (resolve, reject) {
                    _this._lock();
                    var rv = fn(resolve, reject, _this);
                    if (rv && rv.then)
                        rv.then(resolve, reject);
                });
                p.finally(function () { return _this._unlock(); });
                p._lib = true;
                return p;
            });
        }
        else {
            var p = new DexiePromise(function (resolve, reject) {
                var rv = fn(resolve, reject, _this);
                if (rv && rv.then)
                    rv.then(resolve, reject);
            });
            p._lib = true;
            return p;
        }
    };
    Transaction.prototype._root = function () {
        return this.parent ? this.parent._root() : this;
    };
    Transaction.prototype.waitFor = function (promiseLike) {
        var root = this._root();
        var promise = DexiePromise.resolve(promiseLike);
        if (root._waitingFor) {
            root._waitingFor = root._waitingFor.then(function () { return promise; });
        }
        else {
            root._waitingFor = promise;
            root._waitingQueue = [];
            var store = root.idbtrans.objectStore(root.storeNames[0]);
            (function spin() {
                ++root._spinCount;
                while (root._waitingQueue.length)
                    (root._waitingQueue.shift())();
                if (root._waitingFor)
                    store.get(-Infinity).onsuccess = spin;
            }());
        }
        var currentWaitPromise = root._waitingFor;
        return new DexiePromise(function (resolve, reject) {
            promise.then(function (res) { return root._waitingQueue.push(wrap(resolve.bind(null, res))); }, function (err) { return root._waitingQueue.push(wrap(reject.bind(null, err))); }).finally(function () {
                if (root._waitingFor === currentWaitPromise) {
                    root._waitingFor = null;
                }
            });
        });
    };
    Transaction.prototype.abort = function () {
        this.active && this._reject(new exceptions.Abort());
        this.active = false;
    };
    Transaction.prototype.table = function (tableName) {
        var memoizedTables = (this._memoizedTables || (this._memoizedTables = {}));
        if (hasOwn(memoizedTables, tableName))
            return memoizedTables[tableName];
        var tableSchema = this.schema[tableName];
        if (!tableSchema) {
            throw new exceptions.NotFound("Table " + tableName + " not part of transaction");
        }
        var transactionBoundTable = new this.db.Table(tableName, tableSchema, this);
        transactionBoundTable.core = this.db.core.table(tableName);
        memoizedTables[tableName] = transactionBoundTable;
        return transactionBoundTable;
    };
    return Transaction;
}());

function createTransactionConstructor(db) {
    return makeClassConstructor(Transaction.prototype, function Transaction$$1(mode, storeNames, dbschema, parent) {
        var _this = this;
        this.db = db;
        this.mode = mode;
        this.storeNames = storeNames;
        this.schema = dbschema;
        this.idbtrans = null;
        this.on = Events(this, "complete", "error", "abort");
        this.parent = parent || null;
        this.active = true;
        this._reculock = 0;
        this._blockedFuncs = [];
        this._resolve = null;
        this._reject = null;
        this._waitingFor = null;
        this._waitingQueue = null;
        this._spinCount = 0;
        this._completion = new DexiePromise(function (resolve, reject) {
            _this._resolve = resolve;
            _this._reject = reject;
        });
        this._completion.then(function () {
            _this.active = false;
            _this.on.complete.fire();
        }, function (e) {
            var wasActive = _this.active;
            _this.active = false;
            _this.on.error.fire(e);
            _this.parent ?
                _this.parent._reject(e) :
                wasActive && _this.idbtrans && _this.idbtrans.abort();
            return rejection(e);
        });
    });
}

function createIndexSpec(name, keyPath, unique, multi, auto, compound, isPrimKey) {
    return {
        name: name,
        keyPath: keyPath,
        unique: unique,
        multi: multi,
        auto: auto,
        compound: compound,
        src: (unique && !isPrimKey ? '&' : '') + (multi ? '*' : '') + (auto ? "++" : "") + nameFromKeyPath(keyPath)
    };
}
function nameFromKeyPath(keyPath) {
    return typeof keyPath === 'string' ?
        keyPath :
        keyPath ? ('[' + [].join.call(keyPath, '+') + ']') : "";
}

function createTableSchema(name, primKey, indexes) {
    return {
        name: name,
        primKey: primKey,
        indexes: indexes,
        mappedClass: null,
        idxByName: arrayToObject(indexes, function (index) { return [index.name, index]; })
    };
}

function getKeyExtractor(keyPath) {
    if (keyPath == null) {
        return function () { return undefined; };
    }
    else if (typeof keyPath === 'string') {
        return getSinglePathKeyExtractor(keyPath);
    }
    else {
        return function (obj) { return getByKeyPath(obj, keyPath); };
    }
}
function getSinglePathKeyExtractor(keyPath) {
    var split = keyPath.split('.');
    if (split.length === 1) {
        return function (obj) { return obj[keyPath]; };
    }
    else {
        return function (obj) { return getByKeyPath(obj, keyPath); };
    }
}

function getEffectiveKeys(primaryKey, req) {
    if (req.type === 'delete')
        return req.keys;
    return req.keys || req.values.map(primaryKey.extractKey);
}
function getExistingValues(table, req, effectiveKeys) {
    return req.type === 'add' ? Promise.resolve(new Array(req.values.length)) :
        table.getMany({ trans: req.trans, keys: effectiveKeys });
}

function arrayify(arrayLike) {
    return [].slice.call(arrayLike);
}

var _id_counter = 0;
function getKeyPathAlias(keyPath) {
    return keyPath == null ?
        ":id" :
        typeof keyPath === 'string' ?
            keyPath :
            "[" + keyPath.join('+') + "]";
}
function createDBCore(db, indexedDB, IdbKeyRange, tmpTrans) {
    var cmp = indexedDB.cmp.bind(indexedDB);
    function extractSchema(db, trans) {
        var tables = arrayify(db.objectStoreNames);
        return {
            schema: {
                name: db.name,
                tables: tables.map(function (table) { return trans.objectStore(table); }).map(function (store) {
                    var keyPath = store.keyPath, autoIncrement = store.autoIncrement;
                    var compound = isArray(keyPath);
                    var outbound = keyPath == null;
                    var indexByKeyPath = {};
                    var result = {
                        name: store.name,
                        primaryKey: {
                            name: null,
                            isPrimaryKey: true,
                            outbound: outbound,
                            compound: compound,
                            keyPath: keyPath,
                            autoIncrement: autoIncrement,
                            unique: true,
                            extractKey: getKeyExtractor(keyPath)
                        },
                        indexes: arrayify(store.indexNames).map(function (indexName) { return store.index(indexName); })
                            .map(function (index) {
                            var name = index.name, unique = index.unique, multiEntry = index.multiEntry, keyPath = index.keyPath;
                            var compound = isArray(keyPath);
                            var result = {
                                name: name,
                                compound: compound,
                                keyPath: keyPath,
                                unique: unique,
                                multiEntry: multiEntry,
                                extractKey: getKeyExtractor(keyPath)
                            };
                            indexByKeyPath[getKeyPathAlias(keyPath)] = result;
                            return result;
                        }),
                        getIndexByKeyPath: function (keyPath) { return indexByKeyPath[getKeyPathAlias(keyPath)]; }
                    };
                    indexByKeyPath[":id"] = result.primaryKey;
                    if (keyPath != null) {
                        indexByKeyPath[getKeyPathAlias(keyPath)] = result.primaryKey;
                    }
                    return result;
                })
            },
            hasGetAll: tables.length > 0 && ('getAll' in trans.objectStore(tables[0])) &&
                !(typeof navigator !== 'undefined' && /Safari/.test(navigator.userAgent) &&
                    !/(Chrome\/|Edge\/)/.test(navigator.userAgent) &&
                    [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604)
        };
    }
    function makeIDBKeyRange(range) {
        if (range.type === 3          )
            return null;
        if (range.type === 4            )
            throw new Error("Cannot convert never type to IDBKeyRange");
        var lower = range.lower, upper = range.upper, lowerOpen = range.lowerOpen, upperOpen = range.upperOpen;
        var idbRange = lower === undefined ?
            upper === undefined ?
                null :
                IdbKeyRange.upperBound(upper, !!upperOpen) :
            upper === undefined ?
                IdbKeyRange.lowerBound(lower, !!lowerOpen) :
                IdbKeyRange.bound(lower, upper, !!lowerOpen, !!upperOpen);
        return idbRange;
    }
    function createDbCoreTable(tableSchema) {
        var tableName = tableSchema.name;
        function mutate(_a) {
            var trans = _a.trans, type = _a.type, keys$$1 = _a.keys, values = _a.values, range = _a.range, wantResults = _a.wantResults;
            return new Promise(function (resolve, reject) {
                resolve = wrap(resolve);
                var store = trans.objectStore(tableName);
                var outbound = store.keyPath == null;
                var isAddOrPut = type === "put" || type === "add";
                if (!isAddOrPut && type !== 'delete' && type !== 'deleteRange')
                    throw new Error("Invalid operation type: " + type);
                var length = (keys$$1 || values || { length: 1 }).length;
                if (keys$$1 && values && keys$$1.length !== values.length) {
                    throw new Error("Given keys array must have same length as given values array.");
                }
                if (length === 0)
                    return resolve({ numFailures: 0, failures: {}, results: [], lastResult: undefined });
                var results = wantResults && __spreadArrays((keys$$1 ?
                    keys$$1 :
                    getEffectiveKeys(tableSchema.primaryKey, { type: type, keys: keys$$1, values: values })));
                var req;
                var failures = [];
                var numFailures = 0;
                var errorHandler = function (event) {
                    ++numFailures;
                    preventDefault(event);
                    if (results)
                        results[event.target._reqno] = undefined;
                    failures[event.target._reqno] = event.target.error;
                };
                var setResult = function (_a) {
                    var target = _a.target;
                    results[target._reqno] = target.result;
                };
                if (type === 'deleteRange') {
                    if (range.type === 4            )
                        return resolve({ numFailures: numFailures, failures: failures, results: results, lastResult: undefined });
                    if (range.type === 3          )
                        req = store.clear();
                    else
                        req = store.delete(makeIDBKeyRange(range));
                }
                else {
                    var _a = isAddOrPut ?
                        outbound ?
                            [values, keys$$1] :
                            [values, null] :
                        [keys$$1, null], args1 = _a[0], args2 = _a[1];
                    if (isAddOrPut) {
                        for (var i = 0; i < length; ++i) {
                            req = (args2 && args2[i] !== undefined ?
                                store[type](args1[i], args2[i]) :
                                store[type](args1[i]));
                            req._reqno = i;
                            if (results && results[i] === undefined) {
                                req.onsuccess = setResult;
                            }
                            req.onerror = errorHandler;
                        }
                    }
                    else {
                        for (var i = 0; i < length; ++i) {
                            req = store[type](args1[i]);
                            req._reqno = i;
                            req.onerror = errorHandler;
                        }
                    }
                }
                var done = function (event) {
                    var lastResult = event.target.result;
                    if (results)
                        results[length - 1] = lastResult;
                    resolve({
                        numFailures: numFailures,
                        failures: failures,
                        results: results,
                        lastResult: lastResult
                    });
                };
                req.onerror = function (event) {
                    errorHandler(event);
                    done(event);
                };
                req.onsuccess = done;
            });
        }
        function openCursor(_a) {
            var trans = _a.trans, values = _a.values, query = _a.query, reverse = _a.reverse, unique = _a.unique;
            return new Promise(function (resolve, reject) {
                resolve = wrap(resolve);
                var index = query.index, range = query.range;
                var store = trans.objectStore(tableName);
                var source = index.isPrimaryKey ?
                    store :
                    store.index(index.name);
                var direction = reverse ?
                    unique ?
                        "prevunique" :
                        "prev" :
                    unique ?
                        "nextunique" :
                        "next";
                var req = values || !('openKeyCursor' in source) ?
                    source.openCursor(makeIDBKeyRange(range), direction) :
                    source.openKeyCursor(makeIDBKeyRange(range), direction);
                req.onerror = eventRejectHandler(reject);
                req.onsuccess = wrap(function (ev) {
                    var cursor = req.result;
                    if (!cursor) {
                        resolve(null);
                        return;
                    }
                    cursor.___id = ++_id_counter;
                    cursor.done = false;
                    var _cursorContinue = cursor.continue.bind(cursor);
                    var _cursorContinuePrimaryKey = cursor.continuePrimaryKey;
                    if (_cursorContinuePrimaryKey)
                        _cursorContinuePrimaryKey = _cursorContinuePrimaryKey.bind(cursor);
                    var _cursorAdvance = cursor.advance.bind(cursor);
                    var doThrowCursorIsNotStarted = function () { throw new Error("Cursor not started"); };
                    var doThrowCursorIsStopped = function () { throw new Error("Cursor not stopped"); };
                    cursor.trans = trans;
                    cursor.stop = cursor.continue = cursor.continuePrimaryKey = cursor.advance = doThrowCursorIsNotStarted;
                    cursor.fail = wrap(reject);
                    cursor.next = function () {
                        var _this = this;
                        var gotOne = 1;
                        return this.start(function () { return gotOne-- ? _this.continue() : _this.stop(); }).then(function () { return _this; });
                    };
                    cursor.start = function (callback) {
                        var iterationPromise = new Promise(function (resolveIteration, rejectIteration) {
                            resolveIteration = wrap(resolveIteration);
                            req.onerror = eventRejectHandler(rejectIteration);
                            cursor.fail = rejectIteration;
                            cursor.stop = function (value) {
                                cursor.stop = cursor.continue = cursor.continuePrimaryKey = cursor.advance = doThrowCursorIsStopped;
                                resolveIteration(value);
                            };
                        });
                        var guardedCallback = function () {
                            if (req.result) {
                                try {
                                    callback();
                                }
                                catch (err) {
                                    cursor.fail(err);
                                }
                            }
                            else {
                                cursor.done = true;
                                cursor.start = function () { throw new Error("Cursor behind last entry"); };
                                cursor.stop();
                            }
                        };
                        req.onsuccess = wrap(function (ev) {
                            req.onsuccess = guardedCallback;
                            guardedCallback();
                        });
                        cursor.continue = _cursorContinue;
                        cursor.continuePrimaryKey = _cursorContinuePrimaryKey;
                        cursor.advance = _cursorAdvance;
                        guardedCallback();
                        return iterationPromise;
                    };
                    resolve(cursor);
                }, reject);
            });
        }
        function query(hasGetAll) {
            return function (request) {
                return new Promise(function (resolve, reject) {
                    resolve = wrap(resolve);
                    var trans = request.trans, values = request.values, limit = request.limit, query = request.query;
                    var nonInfinitLimit = limit === Infinity ? undefined : limit;
                    var index = query.index, range = query.range;
                    var store = trans.objectStore(tableName);
                    var source = index.isPrimaryKey ? store : store.index(index.name);
                    var idbKeyRange = makeIDBKeyRange(range);
                    if (limit === 0)
                        return resolve({ result: [] });
                    if (hasGetAll) {
                        var req = values ?
                            source.getAll(idbKeyRange, nonInfinitLimit) :
                            source.getAllKeys(idbKeyRange, nonInfinitLimit);
                        req.onsuccess = function (event) { return resolve({ result: event.target.result }); };
                        req.onerror = eventRejectHandler(reject);
                    }
                    else {
                        var count_1 = 0;
                        var req_1 = values || !('openKeyCursor' in source) ?
                            source.openCursor(idbKeyRange) :
                            source.openKeyCursor(idbKeyRange);
                        var result_1 = [];
                        req_1.onsuccess = function (event) {
                            var cursor = req_1.result;
                            if (!cursor)
                                return resolve({ result: result_1 });
                            result_1.push(values ? cursor.value : cursor.primaryKey);
                            if (++count_1 === limit)
                                return resolve({ result: result_1 });
                            cursor.continue();
                        };
                        req_1.onerror = eventRejectHandler(reject);
                    }
                });
            };
        }
        return {
            name: tableName,
            schema: tableSchema,
            mutate: mutate,
            getMany: function (_a) {
                var trans = _a.trans, keys$$1 = _a.keys;
                return new Promise(function (resolve, reject) {
                    resolve = wrap(resolve);
                    var store = trans.objectStore(tableName);
                    var length = keys$$1.length;
                    var result = new Array(length);
                    var keyCount = 0;
                    var callbackCount = 0;
                    var req;
                    var successHandler = function (event) {
                        var req = event.target;
                        if ((result[req._pos] = req.result) != null)
                            ;
                        if (++callbackCount === keyCount)
                            resolve(result);
                    };
                    var errorHandler = eventRejectHandler(reject);
                    for (var i = 0; i < length; ++i) {
                        var key = keys$$1[i];
                        if (key != null) {
                            req = store.get(keys$$1[i]);
                            req._pos = i;
                            req.onsuccess = successHandler;
                            req.onerror = errorHandler;
                            ++keyCount;
                        }
                    }
                    if (keyCount === 0)
                        resolve(result);
                });
            },
            get: function (_a) {
                var trans = _a.trans, key = _a.key;
                return new Promise(function (resolve, reject) {
                    resolve = wrap(resolve);
                    var store = trans.objectStore(tableName);
                    var req = store.get(key);
                    req.onsuccess = function (event) { return resolve(event.target.result); };
                    req.onerror = eventRejectHandler(reject);
                });
            },
            query: query(hasGetAll),
            openCursor: openCursor,
            count: function (_a) {
                var query = _a.query, trans = _a.trans;
                var index = query.index, range = query.range;
                return new Promise(function (resolve, reject) {
                    var store = trans.objectStore(tableName);
                    var source = index.isPrimaryKey ? store : store.index(index.name);
                    var idbKeyRange = makeIDBKeyRange(range);
                    var req = idbKeyRange ? source.count(idbKeyRange) : source.count();
                    req.onsuccess = wrap(function (ev) { return resolve(ev.target.result); });
                    req.onerror = eventRejectHandler(reject);
                });
            }
        };
    }
    var _a = extractSchema(db, tmpTrans), schema = _a.schema, hasGetAll = _a.hasGetAll;
    var tables = schema.tables.map(function (tableSchema) { return createDbCoreTable(tableSchema); });
    var tableMap = {};
    tables.forEach(function (table) { return tableMap[table.name] = table; });
    return {
        stack: "dbcore",
        transaction: db.transaction.bind(db),
        table: function (name) {
            var result = tableMap[name];
            if (!result)
                throw new Error("Table '" + name + "' not found");
            return tableMap[name];
        },
        cmp: cmp,
        MIN_KEY: -Infinity,
        MAX_KEY: getMaxKey(IdbKeyRange),
        schema: schema
    };
}

function createMiddlewareStack(stackImpl, middlewares) {
    return middlewares.reduce(function (down, _a) {
        var create = _a.create;
        return (__assign(__assign({}, down), create(down)));
    }, stackImpl);
}
function createMiddlewareStacks(middlewares, idbdb, _a, tmpTrans) {
    var IDBKeyRange = _a.IDBKeyRange, indexedDB = _a.indexedDB;
    var dbcore = createMiddlewareStack(createDBCore(idbdb, indexedDB, IDBKeyRange, tmpTrans), middlewares.dbcore);
    return {
        dbcore: dbcore
    };
}
function generateMiddlewareStacks(db, tmpTrans) {
    var idbdb = tmpTrans.db;
    var stacks = createMiddlewareStacks(db._middlewares, idbdb, db._deps, tmpTrans);
    db.core = stacks.dbcore;
    db.tables.forEach(function (table) {
        var tableName = table.name;
        if (db.core.schema.tables.some(function (tbl) { return tbl.name === tableName; })) {
            table.core = db.core.table(tableName);
            if (db[tableName] instanceof db.Table) {
                db[tableName].core = table.core;
            }
        }
    });
}

function setApiOnPlace(db, objs, tableNames, dbschema) {
    tableNames.forEach(function (tableName) {
        var schema = dbschema[tableName];
        objs.forEach(function (obj) {
            if (!(tableName in obj)) {
                if (obj === db.Transaction.prototype || obj instanceof db.Transaction) {
                    setProp(obj, tableName, { get: function () { return this.table(tableName); } });
                }
                else {
                    obj[tableName] = new db.Table(tableName, schema);
                }
            }
        });
    });
}
function removeTablesApi(db, objs) {
    objs.forEach(function (obj) {
        for (var key in obj) {
            if (obj[key] instanceof db.Table)
                delete obj[key];
        }
    });
}
function lowerVersionFirst(a, b) {
    return a._cfg.version - b._cfg.version;
}
function runUpgraders(db, oldVersion, idbUpgradeTrans, reject) {
    var globalSchema = db._dbSchema;
    var trans = db._createTransaction('readwrite', db._storeNames, globalSchema);
    trans.create(idbUpgradeTrans);
    trans._completion.catch(reject);
    var rejectTransaction = trans._reject.bind(trans);
    var transless = PSD.transless || PSD;
    newScope(function () {
        PSD.trans = trans;
        PSD.transless = transless;
        if (oldVersion === 0) {
            keys(globalSchema).forEach(function (tableName) {
                createTable(idbUpgradeTrans, tableName, globalSchema[tableName].primKey, globalSchema[tableName].indexes);
            });
            generateMiddlewareStacks(db, idbUpgradeTrans);
            DexiePromise.follow(function () { return db.on.populate.fire(trans); }).catch(rejectTransaction);
        }
        else
            updateTablesAndIndexes(db, oldVersion, trans, idbUpgradeTrans).catch(rejectTransaction);
    });
}
function updateTablesAndIndexes(db, oldVersion, trans, idbUpgradeTrans) {
    var queue = [];
    var versions = db._versions;
    var globalSchema = db._dbSchema = buildGlobalSchema(db, db.idbdb, idbUpgradeTrans);
    var anyContentUpgraderHasRun = false;
    var versToRun = versions.filter(function (v) { return v._cfg.version >= oldVersion; });
    versToRun.forEach(function (version) {
        queue.push(function () {
            var oldSchema = globalSchema;
            var newSchema = version._cfg.dbschema;
            adjustToExistingIndexNames(db, oldSchema, idbUpgradeTrans);
            adjustToExistingIndexNames(db, newSchema, idbUpgradeTrans);
            globalSchema = db._dbSchema = newSchema;
            var diff = getSchemaDiff(oldSchema, newSchema);
            diff.add.forEach(function (tuple) {
                createTable(idbUpgradeTrans, tuple[0], tuple[1].primKey, tuple[1].indexes);
            });
            diff.change.forEach(function (change) {
                if (change.recreate) {
                    throw new exceptions.Upgrade("Not yet support for changing primary key");
                }
                else {
                    var store_1 = idbUpgradeTrans.objectStore(change.name);
                    change.add.forEach(function (idx) { return addIndex(store_1, idx); });
                    change.change.forEach(function (idx) {
                        store_1.deleteIndex(idx.name);
                        addIndex(store_1, idx);
                    });
                    change.del.forEach(function (idxName) { return store_1.deleteIndex(idxName); });
                }
            });
            var contentUpgrade = version._cfg.contentUpgrade;
            if (contentUpgrade && version._cfg.version > oldVersion) {
                generateMiddlewareStacks(db, idbUpgradeTrans);
                anyContentUpgraderHasRun = true;
                var upgradeSchema_1 = shallowClone(newSchema);
                diff.del.forEach(function (table) {
                    upgradeSchema_1[table] = oldSchema[table];
                });
                removeTablesApi(db, [db.Transaction.prototype]);
                setApiOnPlace(db, [db.Transaction.prototype], keys(upgradeSchema_1), upgradeSchema_1);
                trans.schema = upgradeSchema_1;
                var contentUpgradeIsAsync_1 = isAsyncFunction(contentUpgrade);
                if (contentUpgradeIsAsync_1) {
                    incrementExpectedAwaits();
                }
                var returnValue_1;
                var promiseFollowed = DexiePromise.follow(function () {
                    returnValue_1 = contentUpgrade(trans);
                    if (returnValue_1) {
                        if (contentUpgradeIsAsync_1) {
                            var decrementor = decrementExpectedAwaits.bind(null, null);
                            returnValue_1.then(decrementor, decrementor);
                        }
                    }
                });
                return (returnValue_1 && typeof returnValue_1.then === 'function' ?
                    DexiePromise.resolve(returnValue_1) : promiseFollowed.then(function () { return returnValue_1; }));
            }
        });
        queue.push(function (idbtrans) {
            if (!anyContentUpgraderHasRun || !hasIEDeleteObjectStoreBug) {
                var newSchema = version._cfg.dbschema;
                deleteRemovedTables(newSchema, idbtrans);
            }
            removeTablesApi(db, [db.Transaction.prototype]);
            setApiOnPlace(db, [db.Transaction.prototype], db._storeNames, db._dbSchema);
            trans.schema = db._dbSchema;
        });
    });
    function runQueue() {
        return queue.length ? DexiePromise.resolve(queue.shift()(trans.idbtrans)).then(runQueue) :
            DexiePromise.resolve();
    }
    return runQueue().then(function () {
        createMissingTables(globalSchema, idbUpgradeTrans);
    });
}
function getSchemaDiff(oldSchema, newSchema) {
    var diff = {
        del: [],
        add: [],
        change: []
    };
    var table;
    for (table in oldSchema) {
        if (!newSchema[table])
            diff.del.push(table);
    }
    for (table in newSchema) {
        var oldDef = oldSchema[table], newDef = newSchema[table];
        if (!oldDef) {
            diff.add.push([table, newDef]);
        }
        else {
            var change = {
                name: table,
                def: newDef,
                recreate: false,
                del: [],
                add: [],
                change: []
            };
            if (oldDef.primKey.src !== newDef.primKey.src &&
                !isIEOrEdge
            ) {
                change.recreate = true;
                diff.change.push(change);
            }
            else {
                var oldIndexes = oldDef.idxByName;
                var newIndexes = newDef.idxByName;
                var idxName = void 0;
                for (idxName in oldIndexes) {
                    if (!newIndexes[idxName])
                        change.del.push(idxName);
                }
                for (idxName in newIndexes) {
                    var oldIdx = oldIndexes[idxName], newIdx = newIndexes[idxName];
                    if (!oldIdx)
                        change.add.push(newIdx);
                    else if (oldIdx.src !== newIdx.src)
                        change.change.push(newIdx);
                }
                if (change.del.length > 0 || change.add.length > 0 || change.change.length > 0) {
                    diff.change.push(change);
                }
            }
        }
    }
    return diff;
}
function createTable(idbtrans, tableName, primKey, indexes) {
    var store = idbtrans.db.createObjectStore(tableName, primKey.keyPath ?
        { keyPath: primKey.keyPath, autoIncrement: primKey.auto } :
        { autoIncrement: primKey.auto });
    indexes.forEach(function (idx) { return addIndex(store, idx); });
    return store;
}
function createMissingTables(newSchema, idbtrans) {
    keys(newSchema).forEach(function (tableName) {
        if (!idbtrans.db.objectStoreNames.contains(tableName)) {
            createTable(idbtrans, tableName, newSchema[tableName].primKey, newSchema[tableName].indexes);
        }
    });
}
function deleteRemovedTables(newSchema, idbtrans) {
    for (var i = 0; i < idbtrans.db.objectStoreNames.length; ++i) {
        var storeName = idbtrans.db.objectStoreNames[i];
        if (newSchema[storeName] == null) {
            idbtrans.db.deleteObjectStore(storeName);
        }
    }
}
function addIndex(store, idx) {
    store.createIndex(idx.name, idx.keyPath, { unique: idx.unique, multiEntry: idx.multi });
}
function buildGlobalSchema(db, idbdb, tmpTrans) {
    var globalSchema = {};
    var dbStoreNames = slice(idbdb.objectStoreNames, 0);
    dbStoreNames.forEach(function (storeName) {
        var store = tmpTrans.objectStore(storeName);
        var keyPath = store.keyPath;
        var primKey = createIndexSpec(nameFromKeyPath(keyPath), keyPath || "", false, false, !!store.autoIncrement, keyPath && typeof keyPath !== "string", true);
        var indexes = [];
        for (var j = 0; j < store.indexNames.length; ++j) {
            var idbindex = store.index(store.indexNames[j]);
            keyPath = idbindex.keyPath;
            var index = createIndexSpec(idbindex.name, keyPath, !!idbindex.unique, !!idbindex.multiEntry, false, keyPath && typeof keyPath !== "string", false);
            indexes.push(index);
        }
        globalSchema[storeName] = createTableSchema(storeName, primKey, indexes);
    });
    return globalSchema;
}
function readGlobalSchema(db, idbdb, tmpTrans) {
    db.verno = idbdb.version / 10;
    var globalSchema = db._dbSchema = buildGlobalSchema(db, idbdb, tmpTrans);
    db._storeNames = slice(idbdb.objectStoreNames, 0);
    setApiOnPlace(db, [db._allTables], keys(globalSchema), globalSchema);
}
function adjustToExistingIndexNames(db, schema, idbtrans) {
    var storeNames = idbtrans.db.objectStoreNames;
    for (var i = 0; i < storeNames.length; ++i) {
        var storeName = storeNames[i];
        var store = idbtrans.objectStore(storeName);
        db._hasGetAll = 'getAll' in store;
        for (var j = 0; j < store.indexNames.length; ++j) {
            var indexName = store.indexNames[j];
            var keyPath = store.index(indexName).keyPath;
            var dexieName = typeof keyPath === 'string' ? keyPath : "[" + slice(keyPath).join('+') + "]";
            if (schema[storeName]) {
                var indexSpec = schema[storeName].idxByName[dexieName];
                if (indexSpec) {
                    indexSpec.name = indexName;
                    delete schema[storeName].idxByName[dexieName];
                    schema[storeName].idxByName[indexName] = indexSpec;
                }
            }
        }
    }
    if (typeof navigator !== 'undefined' && /Safari/.test(navigator.userAgent) &&
        !/(Chrome\/|Edge\/)/.test(navigator.userAgent) &&
        _global.WorkerGlobalScope && _global instanceof _global.WorkerGlobalScope &&
        [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604) {
        db._hasGetAll = false;
    }
}
function parseIndexSyntax(primKeyAndIndexes) {
    return primKeyAndIndexes.split(',').map(function (index, indexNum) {
        index = index.trim();
        var name = index.replace(/([&*]|\+\+)/g, "");
        var keyPath = /^\[/.test(name) ? name.match(/^\[(.*)\]$/)[1].split('+') : name;
        return createIndexSpec(name, keyPath || null, /\&/.test(index), /\*/.test(index), /\+\+/.test(index), isArray(keyPath), indexNum === 0);
    });
}

var Version =               (function () {
    function Version() {
    }
    Version.prototype._parseStoresSpec = function (stores, outSchema) {
        keys(stores).forEach(function (tableName) {
            if (stores[tableName] !== null) {
                var indexes = parseIndexSyntax(stores[tableName]);
                var primKey = indexes.shift();
                if (primKey.multi)
                    throw new exceptions.Schema("Primary key cannot be multi-valued");
                indexes.forEach(function (idx) {
                    if (idx.auto)
                        throw new exceptions.Schema("Only primary key can be marked as autoIncrement (++)");
                    if (!idx.keyPath)
                        throw new exceptions.Schema("Index must have a name and cannot be an empty string");
                });
                outSchema[tableName] = createTableSchema(tableName, primKey, indexes);
            }
        });
    };
    Version.prototype.stores = function (stores) {
        var db = this.db;
        this._cfg.storesSource = this._cfg.storesSource ?
            extend(this._cfg.storesSource, stores) :
            stores;
        var versions = db._versions;
        var storesSpec = {};
        var dbschema = {};
        versions.forEach(function (version) {
            extend(storesSpec, version._cfg.storesSource);
            dbschema = (version._cfg.dbschema = {});
            version._parseStoresSpec(storesSpec, dbschema);
        });
        db._dbSchema = dbschema;
        removeTablesApi(db, [db._allTables, db, db.Transaction.prototype]);
        setApiOnPlace(db, [db._allTables, db, db.Transaction.prototype, this._cfg.tables], keys(dbschema), dbschema);
        db._storeNames = keys(dbschema);
        return this;
    };
    Version.prototype.upgrade = function (upgradeFunction) {
        this._cfg.contentUpgrade = upgradeFunction;
        return this;
    };
    return Version;
}());

function createVersionConstructor(db) {
    return makeClassConstructor(Version.prototype, function Version$$1(versionNumber) {
        this.db = db;
        this._cfg = {
            version: versionNumber,
            storesSource: null,
            dbschema: {},
            tables: {},
            contentUpgrade: null
        };
    });
}

var databaseEnumerator;
function DatabaseEnumerator(indexedDB) {
    var getDatabaseNamesNative = indexedDB && (indexedDB.getDatabaseNames || indexedDB.webkitGetDatabaseNames);
    var dbNamesTable;
    if (!getDatabaseNamesNative) {
        var db = new Dexie(DBNAMES_DB, { addons: [] });
        db.version(1).stores({ dbnames: 'name' });
        dbNamesTable = db.table('dbnames');
    }
    return {
        getDatabaseNames: function () {
            return getDatabaseNamesNative ? new DexiePromise(function (resolve, reject) {
                var req = getDatabaseNamesNative.call(indexedDB);
                req.onsuccess = function (event) { return resolve(slice(event.target.result, 0)); };
                req.onerror = eventRejectHandler(reject);
            }) : dbNamesTable.toCollection().primaryKeys();
        },
        add: function (name) {
            return !getDatabaseNamesNative && name !== DBNAMES_DB && dbNamesTable.put({ name: name }).catch(nop);
        },
        remove: function (name) {
            return !getDatabaseNamesNative && name !== DBNAMES_DB && dbNamesTable.delete(name).catch(nop);
        }
    };
}
function initDatabaseEnumerator(indexedDB) {
    try {
        databaseEnumerator = DatabaseEnumerator(indexedDB);
    }
    catch (e) { }
}

function vip(fn) {
    return newScope(function () {
        PSD.letThrough = true;
        return fn();
    });
}

function dexieOpen(db) {
    var state = db._state;
    var indexedDB = db._deps.indexedDB;
    if (state.isBeingOpened || db.idbdb)
        return state.dbReadyPromise.then(function () { return state.dbOpenError ?
            rejection(state.dbOpenError) :
            db; });
    debug && (state.openCanceller._stackHolder = getErrorWithStack());
    state.isBeingOpened = true;
    state.dbOpenError = null;
    state.openComplete = false;
    var resolveDbReady = state.dbReadyResolve,
    upgradeTransaction = null;
    return DexiePromise.race([state.openCanceller, new DexiePromise(function (resolve, reject) {
            if (!indexedDB)
                throw new exceptions.MissingAPI("indexedDB API not found. If using IE10+, make sure to run your code on a server URL " +
                    "(not locally). If using old Safari versions, make sure to include indexedDB polyfill.");
            var dbName = db.name;
            var req = state.autoSchema ?
                indexedDB.open(dbName) :
                indexedDB.open(dbName, Math.round(db.verno * 10));
            if (!req)
                throw new exceptions.MissingAPI("IndexedDB API not available");
            req.onerror = eventRejectHandler(reject);
            req.onblocked = wrap(db._fireOnBlocked);
            req.onupgradeneeded = wrap(function (e) {
                upgradeTransaction = req.transaction;
                if (state.autoSchema && !db._options.allowEmptyDB) {
                    req.onerror = preventDefault;
                    upgradeTransaction.abort();
                    req.result.close();
                    var delreq = indexedDB.deleteDatabase(dbName);
                    delreq.onsuccess = delreq.onerror = wrap(function () {
                        reject(new exceptions.NoSuchDatabase("Database " + dbName + " doesnt exist"));
                    });
                }
                else {
                    upgradeTransaction.onerror = eventRejectHandler(reject);
                    var oldVer = e.oldVersion > Math.pow(2, 62) ? 0 : e.oldVersion;
                    db.idbdb = req.result;
                    runUpgraders(db, oldVer / 10, upgradeTransaction, reject);
                }
            }, reject);
            req.onsuccess = wrap(function () {
                upgradeTransaction = null;
                var idbdb = db.idbdb = req.result;
                var objectStoreNames = slice(idbdb.objectStoreNames);
                if (objectStoreNames.length > 0)
                    try {
                        var tmpTrans = idbdb.transaction(safariMultiStoreFix(objectStoreNames), 'readonly');
                        if (state.autoSchema)
                            readGlobalSchema(db, idbdb, tmpTrans);
                        else
                            adjustToExistingIndexNames(db, db._dbSchema, tmpTrans);
                        generateMiddlewareStacks(db, tmpTrans);
                    }
                    catch (e) {
                    }
                connections.push(db);
                idbdb.onversionchange = wrap(function (ev) {
                    state.vcFired = true;
                    db.on("versionchange").fire(ev);
                });
                databaseEnumerator.add(dbName);
                resolve();
            }, reject);
        })]).then(function () {
        state.onReadyBeingFired = [];
        return DexiePromise.resolve(vip(db.on.ready.fire)).then(function fireRemainders() {
            if (state.onReadyBeingFired.length > 0) {
                var remainders = state.onReadyBeingFired.reduce(promisableChain, nop);
                state.onReadyBeingFired = [];
                return DexiePromise.resolve(vip(remainders)).then(fireRemainders);
            }
        });
    }).finally(function () {
        state.onReadyBeingFired = null;
    }).then(function () {
        state.isBeingOpened = false;
        return db;
    }).catch(function (err) {
        try {
            upgradeTransaction && upgradeTransaction.abort();
        }
        catch (e) { }
        state.isBeingOpened = false;
        db.close();
        state.dbOpenError = err;
        return rejection(state.dbOpenError);
    }).finally(function () {
        state.openComplete = true;
        resolveDbReady();
    });
}

function awaitIterator(iterator) {
    var callNext = function (result) { return iterator.next(result); }, doThrow = function (error) { return iterator.throw(error); }, onSuccess = step(callNext), onError = step(doThrow);
    function step(getNext) {
        return function (val) {
            var next = getNext(val), value = next.value;
            return next.done ? value :
                (!value || typeof value.then !== 'function' ?
                    isArray(value) ? Promise.all(value).then(onSuccess, onError) : onSuccess(value) :
                    value.then(onSuccess, onError));
        };
    }
    return step(callNext)();
}

function extractTransactionArgs(mode, _tableArgs_, scopeFunc) {
    var i = arguments.length;
    if (i < 2)
        throw new exceptions.InvalidArgument("Too few arguments");
    var args = new Array(i - 1);
    while (--i)
        args[i - 1] = arguments[i];
    scopeFunc = args.pop();
    var tables = flatten(args);
    return [mode, tables, scopeFunc];
}
function enterTransactionScope(db, mode, storeNames, parentTransaction, scopeFunc) {
    return DexiePromise.resolve().then(function () {
        var transless = PSD.transless || PSD;
        var trans = db._createTransaction(mode, storeNames, db._dbSchema, parentTransaction);
        var zoneProps = {
            trans: trans,
            transless: transless
        };
        if (parentTransaction) {
            trans.idbtrans = parentTransaction.idbtrans;
        }
        else {
            trans.create();
        }
        var scopeFuncIsAsync = isAsyncFunction(scopeFunc);
        if (scopeFuncIsAsync) {
            incrementExpectedAwaits();
        }
        var returnValue;
        var promiseFollowed = DexiePromise.follow(function () {
            returnValue = scopeFunc.call(trans, trans);
            if (returnValue) {
                if (scopeFuncIsAsync) {
                    var decrementor = decrementExpectedAwaits.bind(null, null);
                    returnValue.then(decrementor, decrementor);
                }
                else if (typeof returnValue.next === 'function' && typeof returnValue.throw === 'function') {
                    returnValue = awaitIterator(returnValue);
                }
            }
        }, zoneProps);
        return (returnValue && typeof returnValue.then === 'function' ?
            DexiePromise.resolve(returnValue).then(function (x) { return trans.active ?
                x
                : rejection(new exceptions.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn")); })
            : promiseFollowed.then(function () { return returnValue; })).then(function (x) {
            if (parentTransaction)
                trans._resolve();
            return trans._completion.then(function () { return x; });
        }).catch(function (e) {
            trans._reject(e);
            return rejection(e);
        });
    });
}

function pad(a, value, count) {
    var result = isArray(a) ? a.slice() : [a];
    for (var i = 0; i < count; ++i)
        result.push(value);
    return result;
}
function createVirtualIndexMiddleware(down) {
    return __assign(__assign({}, down), { table: function (tableName) {
            var table = down.table(tableName);
            var schema = table.schema;
            var indexLookup = {};
            var allVirtualIndexes = [];
            function addVirtualIndexes(keyPath, keyTail, lowLevelIndex) {
                var keyPathAlias = getKeyPathAlias(keyPath);
                var indexList = (indexLookup[keyPathAlias] = indexLookup[keyPathAlias] || []);
                var keyLength = keyPath == null ? 0 : typeof keyPath === 'string' ? 1 : keyPath.length;
                var isVirtual = keyTail > 0;
                var virtualIndex = __assign(__assign({}, lowLevelIndex), { isVirtual: isVirtual, isPrimaryKey: !isVirtual && lowLevelIndex.isPrimaryKey, keyTail: keyTail,
                    keyLength: keyLength, extractKey: getKeyExtractor(keyPath), unique: !isVirtual && lowLevelIndex.unique });
                indexList.push(virtualIndex);
                if (!virtualIndex.isPrimaryKey) {
                    allVirtualIndexes.push(virtualIndex);
                }
                if (keyLength > 1) {
                    var virtualKeyPath = keyLength === 2 ?
                        keyPath[0] :
                        keyPath.slice(0, keyLength - 1);
                    addVirtualIndexes(virtualKeyPath, keyTail + 1, lowLevelIndex);
                }
                indexList.sort(function (a, b) { return a.keyTail - b.keyTail; });
                return virtualIndex;
            }
            var primaryKey = addVirtualIndexes(schema.primaryKey.keyPath, 0, schema.primaryKey);
            indexLookup[":id"] = [primaryKey];
            for (var _i = 0, _a = schema.indexes; _i < _a.length; _i++) {
                var index = _a[_i];
                addVirtualIndexes(index.keyPath, 0, index);
            }
            function findBestIndex(keyPath) {
                var result = indexLookup[getKeyPathAlias(keyPath)];
                return result && result[0];
            }
            function translateRange(range, keyTail) {
                return {
                    type: range.type === 1             ?
                        2             :
                        range.type,
                    lower: pad(range.lower, range.lowerOpen ? down.MAX_KEY : down.MIN_KEY, keyTail),
                    lowerOpen: true,
                    upper: pad(range.upper, range.upperOpen ? down.MIN_KEY : down.MAX_KEY, keyTail),
                    upperOpen: true
                };
            }
            function translateRequest(req) {
                var index = req.query.index;
                return index.isVirtual ? __assign(__assign({}, req), { query: {
                        index: index,
                        range: translateRange(req.query.range, index.keyTail)
                    } }) : req;
            }
            var result = __assign(__assign({}, table), { schema: __assign(__assign({}, schema), { primaryKey: primaryKey, indexes: allVirtualIndexes, getIndexByKeyPath: findBestIndex }), count: function (req) {
                    return table.count(translateRequest(req));
                },
                query: function (req) {
                    return table.query(translateRequest(req));
                },
                openCursor: function (req) {
                    var _a = req.query.index, keyTail = _a.keyTail, isVirtual = _a.isVirtual, keyLength = _a.keyLength;
                    if (!isVirtual)
                        return table.openCursor(req);
                    function createVirtualCursor(cursor) {
                        function _continue(key) {
                            key != null ?
                                cursor.continue(pad(key, req.reverse ? down.MAX_KEY : down.MIN_KEY, keyTail)) :
                                req.unique ?
                                    cursor.continue(pad(cursor.key, req.reverse ? down.MIN_KEY : down.MAX_KEY, keyTail)) :
                                    cursor.continue();
                        }
                        var virtualCursor = Object.create(cursor, {
                            continue: { value: _continue },
                            continuePrimaryKey: {
                                value: function (key, primaryKey) {
                                    cursor.continuePrimaryKey(pad(key, down.MAX_KEY, keyTail), primaryKey);
                                }
                            },
                            key: {
                                get: function () {
                                    var key = cursor.key;
                                    return keyLength === 1 ?
                                        key[0] :
                                        key.slice(0, keyLength);
                                }
                            },
                            value: {
                                get: function () {
                                    return cursor.value;
                                }
                            }
                        });
                        return virtualCursor;
                    }
                    return table.openCursor(translateRequest(req))
                        .then(function (cursor) { return cursor && createVirtualCursor(cursor); });
                } });
            return result;
        } });
}
var virtualIndexMiddleware = {
    stack: "dbcore",
    name: "VirtualIndexMiddleware",
    level: 1,
    create: createVirtualIndexMiddleware
};

var hooksMiddleware = {
    stack: "dbcore",
    name: "HooksMiddleware",
    level: 2,
    create: function (downCore) { return (__assign(__assign({}, downCore), { table: function (tableName) {
            var downTable = downCore.table(tableName);
            var primaryKey = downTable.schema.primaryKey;
            var tableMiddleware = __assign(__assign({}, downTable), { mutate: function (req) {
                    var dxTrans = PSD.trans;
                    var _a = dxTrans.table(tableName).hook, deleting = _a.deleting, creating = _a.creating, updating = _a.updating;
                    switch (req.type) {
                        case 'add':
                            if (creating.fire === nop)
                                break;
                            return dxTrans._promise('readwrite', function () { return addPutOrDelete(req); }, true);
                        case 'put':
                            if (creating.fire === nop && updating.fire === nop)
                                break;
                            return dxTrans._promise('readwrite', function () { return addPutOrDelete(req); }, true);
                        case 'delete':
                            if (deleting.fire === nop)
                                break;
                            return dxTrans._promise('readwrite', function () { return addPutOrDelete(req); }, true);
                        case 'deleteRange':
                            if (deleting.fire === nop)
                                break;
                            return dxTrans._promise('readwrite', function () { return deleteRange(req); }, true);
                    }
                    return downTable.mutate(req);
                    function addPutOrDelete(req) {
                        var dxTrans = PSD.trans;
                        var keys$$1 = req.keys || getEffectiveKeys(primaryKey, req);
                        if (!keys$$1)
                            throw new Error("Keys missing");
                        req = req.type === 'add' || req.type === 'put' ? __assign(__assign({}, req), { keys: keys$$1, wantResults: true }) :
                         __assign({}, req);
                        if (req.type !== 'delete')
                            req.values = __spreadArrays(req.values);
                        if (req.keys)
                            req.keys = __spreadArrays(req.keys);
                        return getExistingValues(downTable, req, keys$$1).then(function (existingValues) {
                            var contexts = keys$$1.map(function (key, i) {
                                var existingValue = existingValues[i];
                                var ctx = { onerror: null, onsuccess: null };
                                if (req.type === 'delete') {
                                    deleting.fire.call(ctx, key, existingValue, dxTrans);
                                }
                                else if (req.type === 'add' || existingValue === undefined) {
                                    var generatedPrimaryKey = creating.fire.call(ctx, key, req.values[i], dxTrans);
                                    if (key == null && generatedPrimaryKey != null) {
                                        key = generatedPrimaryKey;
                                        req.keys[i] = key;
                                        if (!primaryKey.outbound) {
                                            setByKeyPath(req.values[i], primaryKey.keyPath, key);
                                        }
                                    }
                                }
                                else {
                                    var objectDiff = getObjectDiff(existingValue, req.values[i]);
                                    var additionalChanges_1 = updating.fire.call(ctx, objectDiff, key, existingValue, dxTrans);
                                    if (additionalChanges_1) {
                                        var requestedValue_1 = req.values[i];
                                        Object.keys(additionalChanges_1).forEach(function (keyPath) {
                                            setByKeyPath(requestedValue_1, keyPath, additionalChanges_1[keyPath]);
                                        });
                                    }
                                }
                                return ctx;
                            });
                            return downTable.mutate(req).then(function (_a) {
                                var failures = _a.failures, results = _a.results, numFailures = _a.numFailures, lastResult = _a.lastResult;
                                for (var i = 0; i < keys$$1.length; ++i) {
                                    var primKey = results ? results[i] : keys$$1[i];
                                    var ctx = contexts[i];
                                    if (primKey == null) {
                                        ctx.onerror && ctx.onerror(failures[i]);
                                    }
                                    else {
                                        ctx.onsuccess && ctx.onsuccess(req.type === 'put' && existingValues[i] ?
                                            req.values[i] :
                                            primKey
                                        );
                                    }
                                }
                                return { failures: failures, results: results, numFailures: numFailures, lastResult: lastResult };
                            }).catch(function (error) {
                                contexts.forEach(function (ctx) { return ctx.onerror && ctx.onerror(error); });
                                return Promise.reject(error);
                            });
                        });
                    }
                    function deleteRange(req) {
                        return deleteNextChunk(req.trans, req.range, 10000);
                    }
                    function deleteNextChunk(trans, range, limit) {
                        return downTable.query({ trans: trans, values: false, query: { index: primaryKey, range: range }, limit: limit })
                            .then(function (_a) {
                            var result = _a.result;
                            return addPutOrDelete({ type: 'delete', keys: result, trans: trans }).then(function (res) {
                                if (res.numFailures > 0)
                                    return Promise.reject(res.failures[0]);
                                if (result.length < limit) {
                                    return { failures: [], numFailures: 0, lastResult: undefined };
                                }
                                else {
                                    return deleteNextChunk(trans, __assign(__assign({}, range), { lower: result[result.length - 1], lowerOpen: true }), limit);
                                }
                            });
                        });
                    }
                } });
            return tableMiddleware;
        } })); }
};

var Dexie =               (function () {
    function Dexie(name, options) {
        var _this = this;
        this._middlewares = {};
        this.verno = 0;
        var deps = Dexie.dependencies;
        this._options = options = __assign({
            addons: Dexie.addons, autoOpen: true,
            indexedDB: deps.indexedDB, IDBKeyRange: deps.IDBKeyRange }, options);
        this._deps = {
            indexedDB: options.indexedDB,
            IDBKeyRange: options.IDBKeyRange
        };
        var addons = options.addons;
        this._dbSchema = {};
        this._versions = [];
        this._storeNames = [];
        this._allTables = {};
        this.idbdb = null;
        var state = {
            dbOpenError: null,
            isBeingOpened: false,
            onReadyBeingFired: null,
            openComplete: false,
            dbReadyResolve: nop,
            dbReadyPromise: null,
            cancelOpen: nop,
            openCanceller: null,
            autoSchema: true
        };
        state.dbReadyPromise = new DexiePromise(function (resolve) {
            state.dbReadyResolve = resolve;
        });
        state.openCanceller = new DexiePromise(function (_, reject) {
            state.cancelOpen = reject;
        });
        this._state = state;
        this.name = name;
        this.on = Events(this, "populate", "blocked", "versionchange", { ready: [promisableChain, nop] });
        this.on.ready.subscribe = override(this.on.ready.subscribe, function (subscribe) {
            return function (subscriber, bSticky) {
                Dexie.vip(function () {
                    var state = _this._state;
                    if (state.openComplete) {
                        if (!state.dbOpenError)
                            DexiePromise.resolve().then(subscriber);
                        if (bSticky)
                            subscribe(subscriber);
                    }
                    else if (state.onReadyBeingFired) {
                        state.onReadyBeingFired.push(subscriber);
                        if (bSticky)
                            subscribe(subscriber);
                    }
                    else {
                        subscribe(subscriber);
                        var db_1 = _this;
                        if (!bSticky)
                            subscribe(function unsubscribe() {
                                db_1.on.ready.unsubscribe(subscriber);
                                db_1.on.ready.unsubscribe(unsubscribe);
                            });
                    }
                });
            };
        });
        this.Collection = createCollectionConstructor(this);
        this.Table = createTableConstructor(this);
        this.Transaction = createTransactionConstructor(this);
        this.Version = createVersionConstructor(this);
        this.WhereClause = createWhereClauseConstructor(this);
        this.on("versionchange", function (ev) {
            if (ev.newVersion > 0)
                console.warn("Another connection wants to upgrade database '" + _this.name + "'. Closing db now to resume the upgrade.");
            else
                console.warn("Another connection wants to delete database '" + _this.name + "'. Closing db now to resume the delete request.");
            _this.close();
        });
        this.on("blocked", function (ev) {
            if (!ev.newVersion || ev.newVersion < ev.oldVersion)
                console.warn("Dexie.delete('" + _this.name + "') was blocked");
            else
                console.warn("Upgrade '" + _this.name + "' blocked by other connection holding version " + ev.oldVersion / 10);
        });
        this._maxKey = getMaxKey(options.IDBKeyRange);
        this._createTransaction = function (mode, storeNames, dbschema, parentTransaction) { return new _this.Transaction(mode, storeNames, dbschema, parentTransaction); };
        this._fireOnBlocked = function (ev) {
            _this.on("blocked").fire(ev);
            connections
                .filter(function (c) { return c.name === _this.name && c !== _this && !c._state.vcFired; })
                .map(function (c) { return c.on("versionchange").fire(ev); });
        };
        this.use(virtualIndexMiddleware);
        this.use(hooksMiddleware);
        addons.forEach(function (addon) { return addon(_this); });
    }
    Dexie.prototype.version = function (versionNumber) {
        if (isNaN(versionNumber) || versionNumber < 0.1)
            throw new exceptions.Type("Given version is not a positive number");
        versionNumber = Math.round(versionNumber * 10) / 10;
        if (this.idbdb || this._state.isBeingOpened)
            throw new exceptions.Schema("Cannot add version when database is open");
        this.verno = Math.max(this.verno, versionNumber);
        var versions = this._versions;
        var versionInstance = versions.filter(function (v) { return v._cfg.version === versionNumber; })[0];
        if (versionInstance)
            return versionInstance;
        versionInstance = new this.Version(versionNumber);
        versions.push(versionInstance);
        versions.sort(lowerVersionFirst);
        versionInstance.stores({});
        this._state.autoSchema = false;
        return versionInstance;
    };
    Dexie.prototype._whenReady = function (fn) {
        var _this = this;
        return this._state.openComplete || PSD.letThrough ? fn() : new DexiePromise(function (resolve, reject) {
            if (!_this._state.isBeingOpened) {
                if (!_this._options.autoOpen) {
                    reject(new exceptions.DatabaseClosed());
                    return;
                }
                _this.open().catch(nop);
            }
            _this._state.dbReadyPromise.then(resolve, reject);
        }).then(fn);
    };
    Dexie.prototype.use = function (_a) {
        var stack = _a.stack, create = _a.create, level = _a.level, name = _a.name;
        if (name)
            this.unuse({ stack: stack, name: name });
        var middlewares = this._middlewares[stack] || (this._middlewares[stack] = []);
        middlewares.push({ stack: stack, create: create, level: level == null ? 10 : level, name: name });
        middlewares.sort(function (a, b) { return a.level - b.level; });
        return this;
    };
    Dexie.prototype.unuse = function (_a) {
        var stack = _a.stack, name = _a.name, create = _a.create;
        if (stack && this._middlewares[stack]) {
            this._middlewares[stack] = this._middlewares[stack].filter(function (mw) {
                return create ? mw.create !== create :
                    name ? mw.name !== name :
                        false;
            });
        }
        return this;
    };
    Dexie.prototype.open = function () {
        return dexieOpen(this);
    };
    Dexie.prototype.close = function () {
        var idx = connections.indexOf(this), state = this._state;
        if (idx >= 0)
            connections.splice(idx, 1);
        if (this.idbdb) {
            try {
                this.idbdb.close();
            }
            catch (e) { }
            this.idbdb = null;
        }
        this._options.autoOpen = false;
        state.dbOpenError = new exceptions.DatabaseClosed();
        if (state.isBeingOpened)
            state.cancelOpen(state.dbOpenError);
        state.dbReadyPromise = new DexiePromise(function (resolve) {
            state.dbReadyResolve = resolve;
        });
        state.openCanceller = new DexiePromise(function (_, reject) {
            state.cancelOpen = reject;
        });
    };
    Dexie.prototype.delete = function () {
        var _this = this;
        var hasArguments = arguments.length > 0;
        var state = this._state;
        return new DexiePromise(function (resolve, reject) {
            var doDelete = function () {
                _this.close();
                var req = _this._deps.indexedDB.deleteDatabase(_this.name);
                req.onsuccess = wrap(function () {
                    databaseEnumerator.remove(_this.name);
                    resolve();
                });
                req.onerror = eventRejectHandler(reject);
                req.onblocked = _this._fireOnBlocked;
            };
            if (hasArguments)
                throw new exceptions.InvalidArgument("Arguments not allowed in db.delete()");
            if (state.isBeingOpened) {
                state.dbReadyPromise.then(doDelete);
            }
            else {
                doDelete();
            }
        });
    };
    Dexie.prototype.backendDB = function () {
        return this.idbdb;
    };
    Dexie.prototype.isOpen = function () {
        return this.idbdb !== null;
    };
    Dexie.prototype.hasBeenClosed = function () {
        var dbOpenError = this._state.dbOpenError;
        return dbOpenError && (dbOpenError.name === 'DatabaseClosed');
    };
    Dexie.prototype.hasFailed = function () {
        return this._state.dbOpenError !== null;
    };
    Dexie.prototype.dynamicallyOpened = function () {
        return this._state.autoSchema;
    };
    Object.defineProperty(Dexie.prototype, "tables", {
        get: function () {
            var _this = this;
            return keys(this._allTables).map(function (name) { return _this._allTables[name]; });
        },
        enumerable: true,
        configurable: true
    });
    Dexie.prototype.transaction = function () {
        var args = extractTransactionArgs.apply(this, arguments);
        return this._transaction.apply(this, args);
    };
    Dexie.prototype._transaction = function (mode, tables, scopeFunc) {
        var _this = this;
        var parentTransaction = PSD.trans;
        if (!parentTransaction || parentTransaction.db !== this || mode.indexOf('!') !== -1)
            parentTransaction = null;
        var onlyIfCompatible = mode.indexOf('?') !== -1;
        mode = mode.replace('!', '').replace('?', '');
        var idbMode, storeNames;
        try {
            storeNames = tables.map(function (table) {
                var storeName = table instanceof _this.Table ? table.name : table;
                if (typeof storeName !== 'string')
                    throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
                return storeName;
            });
            if (mode == "r" || mode === READONLY)
                idbMode = READONLY;
            else if (mode == "rw" || mode == READWRITE)
                idbMode = READWRITE;
            else
                throw new exceptions.InvalidArgument("Invalid transaction mode: " + mode);
            if (parentTransaction) {
                if (parentTransaction.mode === READONLY && idbMode === READWRITE) {
                    if (onlyIfCompatible) {
                        parentTransaction = null;
                    }
                    else
                        throw new exceptions.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");
                }
                if (parentTransaction) {
                    storeNames.forEach(function (storeName) {
                        if (parentTransaction && parentTransaction.storeNames.indexOf(storeName) === -1) {
                            if (onlyIfCompatible) {
                                parentTransaction = null;
                            }
                            else
                                throw new exceptions.SubTransaction("Table " + storeName +
                                    " not included in parent transaction.");
                        }
                    });
                }
                if (onlyIfCompatible && parentTransaction && !parentTransaction.active) {
                    parentTransaction = null;
                }
            }
        }
        catch (e) {
            return parentTransaction ?
                parentTransaction._promise(null, function (_, reject) { reject(e); }) :
                rejection(e);
        }
        var enterTransaction = enterTransactionScope.bind(null, this, idbMode, storeNames, parentTransaction, scopeFunc);
        return (parentTransaction ?
            parentTransaction._promise(idbMode, enterTransaction, "lock") :
            PSD.trans ?
                usePSD(PSD.transless, function () { return _this._whenReady(enterTransaction); }) :
                this._whenReady(enterTransaction));
    };
    Dexie.prototype.table = function (tableName) {
        if (!hasOwn(this._allTables, tableName)) {
            throw new exceptions.InvalidTable("Table " + tableName + " does not exist");
        }
        return this._allTables[tableName];
    };
    return Dexie;
}());

var Dexie$1 = Dexie;
props(Dexie$1, __assign(__assign({}, fullNameExceptions), {
    delete: function (databaseName) {
        var db = new Dexie$1(databaseName);
        return db.delete();
    },
    exists: function (name) {
        return new Dexie$1(name, { addons: [] }).open().then(function (db) {
            db.close();
            return true;
        }).catch('NoSuchDatabaseError', function () { return false; });
    },
    getDatabaseNames: function (cb) {
        return databaseEnumerator ?
            databaseEnumerator.getDatabaseNames().then(cb) :
            DexiePromise.resolve([]);
    },
    defineClass: function () {
        function Class(content) {
            extend(this, content);
        }
        return Class;
    },
    ignoreTransaction: function (scopeFunc) {
        return PSD.trans ?
            usePSD(PSD.transless, scopeFunc) :
            scopeFunc();
    },
    vip: vip, async: function (generatorFn) {
        return function () {
            try {
                var rv = awaitIterator(generatorFn.apply(this, arguments));
                if (!rv || typeof rv.then !== 'function')
                    return DexiePromise.resolve(rv);
                return rv;
            }
            catch (e) {
                return rejection(e);
            }
        };
    }, spawn: function (generatorFn, args, thiz) {
        try {
            var rv = awaitIterator(generatorFn.apply(thiz, args || []));
            if (!rv || typeof rv.then !== 'function')
                return DexiePromise.resolve(rv);
            return rv;
        }
        catch (e) {
            return rejection(e);
        }
    },
    currentTransaction: {
        get: function () { return PSD.trans || null; }
    }, waitFor: function (promiseOrFunction, optionalTimeout) {
        var promise = DexiePromise.resolve(typeof promiseOrFunction === 'function' ?
            Dexie$1.ignoreTransaction(promiseOrFunction) :
            promiseOrFunction)
            .timeout(optionalTimeout || 60000);
        return PSD.trans ?
            PSD.trans.waitFor(promise) :
            promise;
    },
    Promise: DexiePromise,
    debug: {
        get: function () { return debug; },
        set: function (value) {
            setDebug(value, value === 'dexie' ? function () { return true; } : dexieStackFrameFilter);
        }
    },
    derive: derive, extend: extend, props: props, override: override,
    Events: Events,
    getByKeyPath: getByKeyPath, setByKeyPath: setByKeyPath, delByKeyPath: delByKeyPath, shallowClone: shallowClone, deepClone: deepClone, getObjectDiff: getObjectDiff, asap: asap,
    minKey: minKey,
    addons: [],
    connections: connections,
    errnames: errnames,
    dependencies: (function () {
        try {
            return {
                indexedDB: _global.indexedDB || _global.mozIndexedDB || _global.webkitIndexedDB || _global.msIndexedDB,
                IDBKeyRange: _global.IDBKeyRange || _global.webkitIDBKeyRange
            };
        }
        catch (e) {
            return { indexedDB: null, IDBKeyRange: null };
        }
    })(),
    semVer: DEXIE_VERSION, version: DEXIE_VERSION.split('.')
        .map(function (n) { return parseInt(n); })
        .reduce(function (p, c, i) { return p + (c / Math.pow(10, i * 2)); }),
    default: Dexie$1,
    Dexie: Dexie$1 }));
Dexie$1.maxKey = getMaxKey(Dexie$1.dependencies.IDBKeyRange);

initDatabaseEnumerator(Dexie.dependencies.indexedDB);
DexiePromise.rejectionMapper = mapError;
setDebug(debug, dexieStackFrameFilter);

class Database extends Dexie {
    constructor() {
        super("IconCache");
        this.version(1).stores({
            hashes: '&id, hash',
            icons: '&id, idFull, fontId, name, data, aliases, tags, codepoint'
        });
        this.hashes = this.table("hashes");
        this.icons = this.table("icons");
    }
}

const isLocal = window.location.href.match(/localhost/);
const isGitHub = window.location.href.match(/templarian\.github\.io/);
async function get(request, options = {}) {
    const { params = {} } = options;
    const keys = Object.keys(params);
    const p = `?${keys.map(k => `${k}=${params[k]}`).join('&')}`;
    if (isLocal || isGitHub) {
        const mock = keys.map(k => `${k}/${params[k]}`).join('/');
        if (mock) {
            request += `/_/${mock}`;
        }
        if (isGitHub) {
            request = request.replace(/^\//, '');
        }
    }
    const response = await fetch((isLocal || isGitHub) ? `${request}/mock.get.json` : `${request}${p === '?' ? '' : p}`);
    try {
        return response.json();
    }
    catch (ex) { }
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return Promise.reject();
}
const http = {
    get
};

class Alias {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.match = false;
    }
    from(alias) {
        this.id = alias.id;
        this.name = alias.name;
        return this;
    }
    to() {
        return {
            name: this.name
        };
    }
}

class User {
    constructor() {
        this.id = null;
        this.github = null;
        this.twitter = null;
        this.name = null;
        this.base64 = null;
        this.iconCount = null;
        this.description = null;
        this.website = null;
        this.sponsored = false;
        this.sponsorship = '';
    }
    from(user) {
        this.id = user.id;
        this.github = user.github;
        this.twitter = user.twitter;
        this.name = user.name;
        if (typeof user.base64 === 'string') {
            if (user.base64.match(/^data/)) {
                this.base64 = user.base64;
            }
            else {
                this.base64 = `data:image/png;base64,${user.base64}`;
            }
        }
        this.iconCount = user.iconCount;
        this.description = user.description;
        this.website = user.website;
        this.sponsored = user.sponsored;
        this.sponsorship = `https://github.com/users/${user.github}/sponsorship`;
        return this;
    }
}

class Tag {
    from(tag) {
        this.id = tag.id;
        this.name = tag.name;
        this.url = tag.url;
        this.count = tag.count;
        return this;
    }
    to() {
        return {
            name: this.name,
            url: this.url,
            count: this.count
        };
    }
}

class Style {
    constructor() {
        this.count = null;
    }
    from(style) {
        this.id = style.id;
        this.name = style.name;
        this.count = style.count;
        return this;
    }
}

class Icon {
    constructor(name, data) {
        this.id = null;
        this.packageId = null;
        this.baseIconId = null;
        this.name = null;
        this.description = null;
        this.data = null;
        this.user = null;
        this.version = null;
        this.aliases = [];
        this.tags = [];
        this.styles = [];
        this.published = true;
        this.deprecated = false;
        this.codepoint = null;
        this.fontIcon = null;
        this.name = name || null;
        this.data = data || null;
    }
    from(icon) {
        this.id = icon.id;
        this.packageId = icon.packageId;
        this.baseIconId = icon.baseIconId;
        this.name = icon.name;
        this.description = icon.description;
        this.data = icon.data;
        if (icon.version) {
            this.version = icon.version;
        }
        if (icon.fontIcon) {
            this.fontIcon = icon.fontIcon;
        }
        if (icon.user) {
            this.user = new User().from(icon.user);
        }
        if (icon.aliases) {
            this.aliases = icon.aliases.map(a => new Alias().from(a));
        }
        if (icon.tags) {
            this.tags = icon.tags.map(t => new Tag().from(t));
        }
        if (icon.styles) {
            this.styles = icon.styles.map(s => new Style().from(s));
        }
        if (typeof icon.published === 'boolean') {
            this.published = icon.published;
        }
        if (typeof icon.deprecated === 'boolean') {
            this.deprecated = icon.deprecated;
        }
        if (icon.codepoint) {
            this.codepoint = icon.codepoint;
        }
        return this;
    }
    to() {
        const { id, name, description, data, version, fontIcon, packageId, baseIconId, aliases, tags } = this;
        return {
            id,
            name,
            description,
            data,
            version,
            fontIcon,
            packageId,
            baseIconId,
            aliases: aliases.map(alias => alias.to()),
            tags: tags.map(tag => tag.to())
        };
    }
}

class FontVersion {
    from(font) {
        this.id = font.id;
        this.major = font.major;
        this.minor = font.minor;
        this.patch = font.patch;
        this.iconCount = font.iconCount;
        this.description = font.description;
        this.date = new Date(font.date);
        this.released = font.released;
        return this;
    }
}

class Font {
    constructor() {
        this.versions = [];
    }
    from(font) {
        this.id = font.id;
        this.name = font.name;
        this.description = font.description;
        this.prefix = font.prefix;
        this.fontName = font.fontName;
        this.fontFamily = font.fontFamily;
        this.fontWeight = font.fontWeight;
        this.price = font.price;
        this.iconCount = font.iconCount;
        if (font.versions) {
            this.versions = font.versions.map(f => new FontVersion().from(f));
        }
        return this;
    }
}

class DatabaseService {
    constructor() {
        this.db = new Database();
        this.synced = false;
    }
    /**
     * Get list of hashes for icons in font
     *
     * @param font Font id to lookup hashes for
     */
    async getHashesFromServer(font) {
        const res = await http.get(`/api/font/${font.id}/hash`);
        return res;
    }
    async getIconsFromServer(font, ids) {
        if (ids.length === 0) {
            return [];
        }
        const res = await http.get(`/api/font/${font.id}`, {
            params: {
                ids: ids.join(',')
            }
        });
        return res.map(icon => new Icon().from(icon));
    }
    async getIconsByPage(font, page, size) {
        const res = await http.get(`/api/font/${font.id}`, {
            params: {
                page: page.toString(),
                size: size.toString()
            }
        });
        return res.map(icon => new Icon().from(icon));
    }
    async asyncThrottledMap(maxCount, array, f) {
        let inFlight = new Set();
        const result = [];
        // Sequentially add a Promise for each operation.
        for (let elem of array) {
            // Wait for any one of the promises to complete if there are too many running.
            if (inFlight.size >= maxCount) {
                await Promise.race(inFlight);
            }
            // This is the Promise that the user originally passed us back.
            const origPromise = f(elem);
            // This is a Promise that adds/removes from the set of in-flight promises.
            const handledPromise = wrap(origPromise);
            result.push(handledPromise);
        }
        return Promise.all(result);
        async function wrap(p) {
            inFlight.add(p);
            const result = await p;
            inFlight.delete(p);
            return result;
        }
    }
    async exists(fontId) {
        const count = await this.getCount(fontId);
        return count > 0;
    }
    async resync(fontId) {
        let modified = false;
        const font = new Font().from({
            id: fontId
        });
        const hashes = await this.getHashesFromServer(font);
        const hashIds = Object.keys(hashes);
        const localHashObj = await this.db.hashes.toArray();
        const localHashes = {};
        localHashObj.forEach((item) => {
            localHashes[item.id] = item.hash;
        });
        const localHashIds = Object.keys(localHashes);
        const modifiedIds = [];
        hashIds.forEach((id) => {
            if (!(id in localHashes) || localHashes[id] !== hashes[id]) {
                modifiedIds.push(id);
            }
        });
        const removeIds = [];
        localHashIds.forEach((id) => {
            if (!(id in hashes)) {
                removeIds.push(id);
            }
        });
        await this.db.icons.bulkDelete(removeIds);
        if (modifiedIds.length > 0 || removeIds.length > 0) {
            modified = true;
        }
        if (modifiedIds.length < 500) {
            // Do a partial update patch of data
            let i, j, chunkIds = [], chunk = 100;
            for (i = 0, j = modifiedIds.length; i < j; i += chunk) {
                chunkIds.push(modifiedIds.slice(i, i + chunk));
            }
            const chunkPromises = chunkIds.map((ids) => {
                return this.getIconsFromServer(font, ids);
            });
            const results = await Promise.all(chunkPromises);
            results.forEach(icons => {
                this.db.icons.bulkPut(icons.map(icon => ({
                    id: icon.fontIcon.id,
                    idFull: icon.id,
                    fontId: font.id,
                    name: icon.name,
                    data: icon.data,
                    version: icon.version,
                    codepoint: icon.codepoint,
                    aliases: icon.aliases,
                    tags: icon.tags
                })));
            });
        }
        else if (modifiedIds.length !== 0) {
            // Sync every icon into the database
            let size = 500, pages = Math.ceil(hashIds.length / size), chunkPromises = [];
            for (let page = 1; page <= pages; page++) {
                chunkPromises.push(this.getIconsByPage(font, page, size));
            }
            await this.asyncThrottledMap(2, chunkPromises, (p) => p.then(icons => {
                this.db.icons.bulkPut(icons.map(icon => ({
                    id: icon.fontIcon.id,
                    idFull: icon.id,
                    fontId: font.id,
                    name: icon.name,
                    data: icon.data,
                    version: icon.version,
                    codepoint: icon.codepoint,
                    aliases: JSON.stringify(icon.aliases.map(alias => ({ name: alias.name }))),
                    tags: JSON.stringify(icon.tags.map(tag => ({ name: tag.name, url: tag.url })))
                })));
            }));
        }
        if (modified) {
            await this.db.hashes.bulkPut(hashIds.map(id => ({ id, hash: hashes[id] })));
            await this.db.hashes.bulkDelete(removeIds);
        }
        return modified;
    }
    async sync(fontId) {
        if (!this.synced) {
            const modified = await this.resync(fontId);
            this.synced = true;
            return modified;
        }
        return false;
    }
    convert(local) {
        const icon = new Icon();
        icon.id = local.idFull;
        icon.name = local.name;
        icon.data = local.data;
        icon.version = local.version;
        icon.codepoint = local.codepoint;
        const aliases = local.aliases instanceof Array ? local.aliases : JSON.parse(local.aliases);
        icon.aliases = aliases.map(alias => new Alias().from(alias));
        const tags = local.tags instanceof Array ? local.tags : JSON.parse(local.tags);
        icon.tags = tags.map(tag => new Tag().from(tag));
        return icon;
    }
    async getIconByName(name) {
        const local = await this.db.icons.where('name').equals(name).first();
        if (!local) {
            return null;
        }
        return this.convert(local);
    }
    // ToDo, cache into a format that can be parsed quicker for search
    async getIcons(fontId, term) {
        let icons;
        if (term) {
            const safeTerm = term.toLowerCase().replace(/[^a-z0-9-]/g, '');
            const reg = new RegExp(`${safeTerm}`);
            icons = await this.db.icons.where('fontId').equals(fontId)
                .filter((icon) => {
                return icon.name.match(reg) !== null;
            }).sortBy('name');
        }
        else {
            icons = await this.db.icons.where('fontId').equals(fontId).sortBy('name');
        }
        return icons.map(icon => this.convert(icon));
    }
    async getCount(fontId) {
        return await this.db.icons.where('fontId').equals(fontId).count();
    }
    async delete() {
        await this.db.delete();
    }
}

const db = new DatabaseService();
let MdiNav = class MdiNav extends HTMLElement {
    constructor() {
        super(...arguments);
        this.font = '';
    }
    async render() {
        if (this.font !== '') {
            const exists = await db.exists(this.font);
            let delay = true;
            if (exists) {
                this.dispatchEvent(new CustomEvent('sync', {
                    detail: {
                        db,
                        delay
                    }
                }));
            }
            const modified = await db.sync(this.font);
            if (modified) {
                delay = false;
                this.dispatchEvent(new CustomEvent('sync', {
                    detail: {
                        db,
                        delay
                    }
                }));
            }
        }
    }
};
__decorate([
    Prop()
], MdiNav.prototype, "font", void 0);
MdiNav = __decorate([
    Component({
        selector: 'mdi-database',
        style: style$5,
        template: template$5
    })
], MdiNav);

function getBoundingClientRect(element) {
  var rect = element.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height,
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    left: rect.left,
    x: rect.left,
    y: rect.top
  };
}

/*:: import type { Window } from '../types'; */

/*:: declare function getWindow(node: Node | Window): Window; */
function getWindow(node) {
  if (node.toString() !== '[object Window]') {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView : window;
  }

  return node;
}

function getWindowScroll(node) {
  var win = getWindow(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft: scrollLeft,
    scrollTop: scrollTop
  };
}

/*:: declare function isElement(node: mixed): boolean %checks(node instanceof
  Element); */

function isElement(node) {
  var OwnElement = getWindow(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}
/*:: declare function isHTMLElement(node: mixed): boolean %checks(node instanceof
  HTMLElement); */


function isHTMLElement(node) {
  var OwnElement = getWindow(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}

function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}

function getNodeScroll(node) {
  if (node === getWindow(node) || !isHTMLElement(node)) {
    return getWindowScroll(node);
  } else {
    return getHTMLElementScroll(node);
  }
}

function getNodeName(element) {
  return element ? (element.nodeName || '').toLowerCase() : null;
}

function getDocumentElement(element) {
  // $FlowFixMe: assume body is always available
  return (isElement(element) ? element.ownerDocument : element.document).documentElement;
}

function getWindowScrollBarX(element) {
  // If <html> has a CSS width greater than the viewport, then this will be
  // incorrect for RTL.
  // Popper 1 is broken in this case and never had a bug report so let's assume
  // it's not an issue. I don't think anyone ever specifies width on <html>
  // anyway.
  // Browsers where the left scrollbar doesn't cause an issue report `0` for
  // this (e.g. Edge 2019, IE11, Safari)
  return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
}

// Composite means it takes into account transforms as well as layout.

function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }

  var documentElement;
  var rect = getBoundingClientRect(elementOrVirtualElement);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };

  if (!isFixed) {
    if (getNodeName(offsetParent) !== 'body') {
      scroll = getNodeScroll(offsetParent);
    }

    if (isHTMLElement(offsetParent)) {
      offsets = getBoundingClientRect(offsetParent);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement = getDocumentElement(offsetParent)) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }

  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}

// Returns the layout rect of an element relative to its offsetParent. Layout
// means it doesn't take into account transforms.
function getLayoutRect(element) {
  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width: element.offsetWidth,
    height: element.offsetHeight
  };
}

function getParentNode(element) {
  if (getNodeName(element) === 'html') {
    return element;
  }

  return (// $FlowFixMe: this is a quicker (but less type safe) way to save quite some bytes from the bundle
    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    element.parentNode || // DOM Element detected
    // $FlowFixMe: need a better way to handle this...
    element.host || // ShadowRoot detected
    // $FlowFixMe: HTMLElement is a Node
    getDocumentElement(element) // fallback

  );
}

function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}

function getScrollParent(node) {
  if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
    // $FlowFixMe: assume body is always available
    return node.ownerDocument.body;
  }

  if (isHTMLElement(node)) {
    // Firefox wants us to check `-x` and `-y` variations as well
    var _getComputedStyle = getComputedStyle(node),
        overflow = _getComputedStyle.overflow,
        overflowX = _getComputedStyle.overflowX,
        overflowY = _getComputedStyle.overflowY;

    if (/auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX)) {
      return node;
    }
  }

  return getScrollParent(getParentNode(node));
}

function listScrollParents(element, list) {
  if (list === void 0) {
    list = [];
  }

  var scrollParent = getScrollParent(element);
  var isBody = getNodeName(scrollParent) === 'body';
  var win = getWindow(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : // $FlowFixMe: isBody tells us target will be an HTMLElement here
  updatedList.concat(listScrollParents(getParentNode(target)));
}

function isTableElement(element) {
  return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
}

function getTrueOffsetParent(element) {
  if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
  getComputedStyle(element).position === 'fixed') {
    return null;
  }

  return element.offsetParent;
}

function getOffsetParent(element) {
  var window = getWindow(element);
  var offsetParent = getTrueOffsetParent(element); // Find the nearest non-table offsetParent

  while (offsetParent && isTableElement(offsetParent)) {
    offsetParent = getTrueOffsetParent(offsetParent);
  }

  if (offsetParent && getNodeName(offsetParent) === 'body' && getComputedStyle(offsetParent).position === 'static') {
    return window;
  }

  return offsetParent || window;
}

var top = 'top';
var bottom = 'bottom';
var right = 'right';
var left = 'left';
var auto = 'auto';
var basePlacements = [top, bottom, right, left];
var start = 'start';
var end = 'end';
var clippingParents = 'clippingParents';
var viewport = 'viewport';
var popper = 'popper';
var reference = 'reference';
var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []); // modifiers that need to read the DOM

var beforeRead = 'beforeRead';
var read = 'read';
var afterRead = 'afterRead'; // pure-logic modifiers

var beforeMain = 'beforeMain';
var main = 'main';
var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

var beforeWrite = 'beforeWrite';
var write = 'write';
var afterWrite = 'afterWrite';
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

function order(modifiers) {
  var map = new Map();
  var visited = new Set();
  var result = [];
  modifiers.forEach(function (modifier) {
    map.set(modifier.name, modifier);
  }); // On visiting object, check for its dependencies and visit them recursively

  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function (dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);

        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }

  modifiers.forEach(function (modifier) {
    if (!visited.has(modifier.name)) {
      // check for visited object
      sort(modifier);
    }
  });
  return result;
}

function orderModifiers(modifiers) {
  // order based on dependencies
  var orderedModifiers = order(modifiers); // order based on phase

  return modifierPhases.reduce(function (acc, phase) {
    return acc.concat(orderedModifiers.filter(function (modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}

function debounce(fn) {
  var pending;
  return function () {
    if (!pending) {
      pending = new Promise(function (resolve) {
        Promise.resolve().then(function () {
          pending = undefined;
          resolve(fn());
        });
      });
    }

    return pending;
  };
}

function format(str) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return [].concat(args).reduce(function (p, c) {
    return p.replace(/%s/, c);
  }, str);
}

var INVALID_MODIFIER_ERROR = 'Popper: modifier "%s" provided an invalid %s property, expected %s but got %s';
var MISSING_DEPENDENCY_ERROR = 'Popper: modifier "%s" requires "%s", but "%s" modifier is not available';
var VALID_PROPERTIES = ['name', 'enabled', 'phase', 'fn', 'effect', 'requires', 'options'];
function validateModifiers(modifiers) {
  modifiers.forEach(function (modifier) {
    Object.keys(modifier).forEach(function (key) {
      switch (key) {
        case 'name':
          if (typeof modifier.name !== 'string') {
            console.error(format(INVALID_MODIFIER_ERROR, String(modifier.name), '"name"', '"string"', "\"" + String(modifier.name) + "\""));
          }

          break;

        case 'enabled':
          if (typeof modifier.enabled !== 'boolean') {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"enabled"', '"boolean"', "\"" + String(modifier.enabled) + "\""));
          }

        case 'phase':
          if (modifierPhases.indexOf(modifier.phase) < 0) {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"phase"', "either " + modifierPhases.join(', '), "\"" + String(modifier.phase) + "\""));
          }

          break;

        case 'fn':
          if (typeof modifier.fn !== 'function') {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"fn"', '"function"', "\"" + String(modifier.fn) + "\""));
          }

          break;

        case 'effect':
          if (typeof modifier.effect !== 'function') {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"effect"', '"function"', "\"" + String(modifier.fn) + "\""));
          }

          break;

        case 'requires':
          if (!Array.isArray(modifier.requires)) {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"requires"', '"array"', "\"" + String(modifier.requires) + "\""));
          }

          break;

        case 'requiresIfExists':
          if (!Array.isArray(modifier.requiresIfExists)) {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"requiresIfExists"', '"array"', "\"" + String(modifier.requiresIfExists) + "\""));
          }

          break;

        case 'options':
        case 'data':
          break;

        default:
          console.error("PopperJS: an invalid property has been provided to the \"" + modifier.name + "\" modifier, valid properties are " + VALID_PROPERTIES.map(function (s) {
            return "\"" + s + "\"";
          }).join(', ') + "; but \"" + key + "\" was provided.");
      }

      modifier.requires && modifier.requires.forEach(function (requirement) {
        if (modifiers.find(function (mod) {
          return mod.name === requirement;
        }) == null) {
          console.error(format(MISSING_DEPENDENCY_ERROR, String(modifier.name), requirement, requirement));
        }
      });
    });
  });
}

function uniqueBy(arr, fn) {
  var identifiers = new Set();
  return arr.filter(function (item) {
    var identifier = fn(item);

    if (!identifiers.has(identifier)) {
      identifiers.add(identifier);
      return true;
    }
  });
}

function getBasePlacement(placement) {
  return placement.split('-')[0];
}

function mergeByName(modifiers) {
  var merged = modifiers.reduce(function (merged, current) {
    var existing = merged[current.name];
    merged[current.name] = existing ? Object.assign({}, existing, {}, current, {
      options: Object.assign({}, existing.options, {}, current.options),
      data: Object.assign({}, existing.data, {}, current.data)
    }) : current;
    return merged;
  }, {}); // IE11 does not support Object.values

  return Object.keys(merged).map(function (key) {
    return merged[key];
  });
}

var INVALID_ELEMENT_ERROR = 'Popper: Invalid reference or popper argument provided. They must be either a DOM element or virtual element.';
var INFINITE_LOOP_ERROR = 'Popper: An infinite loop in the modifiers cycle has been detected! The cycle has been interrupted to prevent a browser crash.';
var DEFAULT_OPTIONS = {
  placement: 'bottom',
  modifiers: [],
  strategy: 'absolute'
};

function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return !args.some(function (element) {
    return !(element && typeof element.getBoundingClientRect === 'function');
  });
}

function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }

  var _generatorOptions = generatorOptions,
      _generatorOptions$def = _generatorOptions.defaultModifiers,
      defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
      _generatorOptions$def2 = _generatorOptions.defaultOptions,
      defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper(reference, popper, options) {
    if (options === void 0) {
      options = defaultOptions;
    }

    var state = {
      placement: 'bottom',
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, {}, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference,
        popper: popper
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state: state,
      setOptions: function setOptions(options) {
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions, {}, state.options, {}, options);
        state.scrollParents = {
          reference: isElement(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
          popper: listScrollParents(popper)
        }; // Orders the modifiers based on their dependencies and `phase`
        // properties

        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

        state.orderedModifiers = orderedModifiers.filter(function (m) {
          return m.enabled;
        }); // Validate the provided modifiers so that the consumer will get warned
        // if one of the modifiers is invalid for any reason

        if (process.env.NODE_ENV !== "production") {
          var modifiers = uniqueBy([].concat(orderedModifiers, state.options.modifiers), function (_ref) {
            var name = _ref.name;
            return name;
          });
          validateModifiers(modifiers);

          if (getBasePlacement(state.options.placement) === auto) {
            var flipModifier = state.orderedModifiers.find(function (_ref2) {
              var name = _ref2.name;
              return name === 'flip';
            });

            if (!flipModifier) {
              console.error(['Popper: "auto" placements require the "flip" modifier be', 'present and enabled to work.'].join(' '));
            }
          }

          var _getComputedStyle = getComputedStyle(popper),
              marginTop = _getComputedStyle.marginTop,
              marginRight = _getComputedStyle.marginRight,
              marginBottom = _getComputedStyle.marginBottom,
              marginLeft = _getComputedStyle.marginLeft; // We no longer take into account `margins` on the popper, and it can
          // cause bugs with positioning, so we'll warn the consumer


          if ([marginTop, marginRight, marginBottom, marginLeft].some(function (margin) {
            return parseFloat(margin);
          })) {
            console.warn(['Popper: CSS "margin" styles cannot be used to apply padding', 'between the popper and its reference element or boundary.', 'To replicate margin, use the `offset` modifier, as well as', 'the `padding` option in the `preventOverflow` and `flip`', 'modifiers.'].join(' '));
          }
        }

        runModifierEffects();
        return instance.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }

        var _state$elements = state.elements,
            reference = _state$elements.reference,
            popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
        // anymore

        if (!areValidElements(reference, popper)) {
          if (process.env.NODE_ENV !== "production") {
            console.error(INVALID_ELEMENT_ERROR);
          }

          return;
        } // Store the reference and popper rects to be read by modifiers


        state.rects = {
          reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === 'fixed'),
          popper: getLayoutRect(popper)
        }; // Modifiers have the ability to reset the current update cycle. The
        // most common use case for this is the `flip` modifier changing the
        // placement, which then needs to re-run all the modifiers, because the
        // logic was previously ran for the previous placement and is therefore
        // stale/incorrect

        state.reset = false;
        state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
        // is filled with the initial data specified by the modifier. This means
        // it doesn't persist and is fresh on each update.
        // To ensure persistent data, use `${name}#persistent`

        state.orderedModifiers.forEach(function (modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });
        var __debug_loops__ = 0;

        for (var index = 0; index < state.orderedModifiers.length; index++) {
          if (process.env.NODE_ENV !== "production") {
            __debug_loops__ += 1;

            if (__debug_loops__ > 100) {
              console.error(INFINITE_LOOP_ERROR);
              break;
            }
          }

          if (state.reset === true) {
            state.reset = false;
            index = -1;
            continue;
          }

          var _state$orderedModifie = state.orderedModifiers[index],
              fn = _state$orderedModifie.fn,
              _state$orderedModifie2 = _state$orderedModifie.options,
              _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
              name = _state$orderedModifie.name;

          if (typeof fn === 'function') {
            state = fn({
              state: state,
              options: _options,
              name: name,
              instance: instance
            }) || state;
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: debounce(function () {
        return new Promise(function (resolve) {
          instance.forceUpdate();
          resolve(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };

    if (!areValidElements(reference, popper)) {
      if (process.env.NODE_ENV !== "production") {
        console.error(INVALID_ELEMENT_ERROR);
      }

      return instance;
    }

    instance.setOptions(options).then(function (state) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state);
      }
    }); // Modifiers have the ability to execute arbitrary code before the first
    // update cycle runs. They will be executed in the same order as the update
    // cycle. This is useful when a modifier adds some persistent data that
    // other modifiers need to use, but the modifier is run after the dependent
    // one.

    function runModifierEffects() {
      state.orderedModifiers.forEach(function (_ref3) {
        var name = _ref3.name,
            _ref3$options = _ref3.options,
            options = _ref3$options === void 0 ? {} : _ref3$options,
            effect = _ref3.effect;

        if (typeof effect === 'function') {
          var cleanupFn = effect({
            state: state,
            name: name,
            instance: instance,
            options: options
          });

          var noopFn = function noopFn() {};

          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }

    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function (fn) {
        return fn();
      });
      effectCleanupFns = [];
    }

    return instance;
  };
}

var passive = {
  passive: true
};

function effect(_ref) {
  var state = _ref.state,
      instance = _ref.instance,
      options = _ref.options;
  var _options$scroll = options.scroll,
      scroll = _options$scroll === void 0 ? true : _options$scroll,
      _options$resize = options.resize,
      resize = _options$resize === void 0 ? true : _options$resize;
  var window = getWindow(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

  if (scroll) {
    scrollParents.forEach(function (scrollParent) {
      scrollParent.addEventListener('scroll', instance.update, passive);
    });
  }

  if (resize) {
    window.addEventListener('resize', instance.update, passive);
  }

  return function () {
    if (scroll) {
      scrollParents.forEach(function (scrollParent) {
        scrollParent.removeEventListener('scroll', instance.update, passive);
      });
    }

    if (resize) {
      window.removeEventListener('resize', instance.update, passive);
    }
  };
} // eslint-disable-next-line import/no-unused-modules


var eventListeners = {
  name: 'eventListeners',
  enabled: true,
  phase: 'write',
  fn: function fn() {},
  effect: effect,
  data: {}
};

function getVariation(placement) {
  return placement.split('-')[1];
}

function getMainAxisFromPlacement(placement) {
  return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
}

function computeOffsets(_ref) {
  var reference = _ref.reference,
      element = _ref.element,
      placement = _ref.placement;
  var basePlacement = placement ? getBasePlacement(placement) : null;
  var variation = placement ? getVariation(placement) : null;
  var commonX = reference.x + reference.width / 2 - element.width / 2;
  var commonY = reference.y + reference.height / 2 - element.height / 2;
  var offsets;

  switch (basePlacement) {
    case top:
      offsets = {
        x: commonX,
        y: reference.y - element.height
      };
      break;

    case bottom:
      offsets = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;

    case right:
      offsets = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;

    case left:
      offsets = {
        x: reference.x - element.width,
        y: commonY
      };
      break;

    default:
      offsets = {
        x: reference.x,
        y: reference.y
      };
  }

  var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;

  if (mainAxis != null) {
    var len = mainAxis === 'y' ? 'height' : 'width';

    switch (variation) {
      case start:
        offsets[mainAxis] = Math.floor(offsets[mainAxis]) - Math.floor(reference[len] / 2 - element[len] / 2);
        break;

      case end:
        offsets[mainAxis] = Math.floor(offsets[mainAxis]) + Math.ceil(reference[len] / 2 - element[len] / 2);
        break;
    }
  }

  return offsets;
}

function popperOffsets(_ref) {
  var state = _ref.state,
      name = _ref.name;
  // Offsets are the actual position the popper needs to have to be
  // properly positioned near its reference element
  // This is the most basic placement, and will be adjusted by
  // the modifiers in the next step
  state.modifiersData[name] = computeOffsets({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: 'absolute',
    placement: state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


var popperOffsets$1 = {
  name: 'popperOffsets',
  enabled: true,
  phase: 'read',
  fn: popperOffsets,
  data: {}
};

var unsetSides = {
  top: 'auto',
  right: 'auto',
  bottom: 'auto',
  left: 'auto'
}; // Round the offsets to the nearest suitable subpixel based on the DPR.
// Zooming can change the DPR, but it seems to report a value that will
// cleanly divide the values into the appropriate subpixels.

function roundOffsets(_ref) {
  var x = _ref.x,
      y = _ref.y;
  var win = window;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: Math.round(x * dpr) / dpr || 0,
    y: Math.round(y * dpr) / dpr || 0
  };
}

function mapToStyles(_ref2) {
  var _Object$assign2;

  var popper = _ref2.popper,
      popperRect = _ref2.popperRect,
      placement = _ref2.placement,
      offsets = _ref2.offsets,
      position = _ref2.position,
      gpuAcceleration = _ref2.gpuAcceleration,
      adaptive = _ref2.adaptive;

  var _roundOffsets = roundOffsets(offsets),
      x = _roundOffsets.x,
      y = _roundOffsets.y;

  var hasX = offsets.hasOwnProperty('x');
  var hasY = offsets.hasOwnProperty('y');
  var sideX = left;
  var sideY = top;
  var win = window;

  if (adaptive) {
    var offsetParent = getOffsetParent(popper);

    if (offsetParent === getWindow(popper)) {
      offsetParent = getDocumentElement(popper);
    } // $FlowFixMe: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it

    /*:: offsetParent = (offsetParent: Element); */


    if (placement === top) {
      sideY = bottom;
      y -= offsetParent.clientHeight - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }

    if (placement === left) {
      sideX = right;
      x -= offsetParent.clientWidth - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }

  var commonStyles = Object.assign({
    position: position
  }, adaptive && unsetSides);

  if (gpuAcceleration) {
    var _Object$assign;

    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) < 2 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }

  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
}

function computeStyles(_ref3) {
  var state = _ref3.state,
      options = _ref3.options;
  var _options$gpuAccelerat = options.gpuAcceleration,
      gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
      _options$adaptive = options.adaptive,
      adaptive = _options$adaptive === void 0 ? true : _options$adaptive;

  if (process.env.NODE_ENV !== "production") {
    var transitionProperty = getComputedStyle(state.elements.popper).transitionProperty || '';

    if (adaptive && ['transform', 'top', 'right', 'bottom', 'left'].some(function (property) {
      return transitionProperty.indexOf(property) >= 0;
    })) {
      console.warn(['Popper: Detected CSS transitions on at least one of the following', 'CSS properties: "transform", "top", "right", "bottom", "left".', '\n\n', 'Disable the "computeStyles" modifier\'s `adaptive` option to allow', 'for smooth transitions, or remove these properties from the CSS', 'transition declaration on the popper element if only transitioning', 'opacity or background-color for example.', '\n\n', 'We recommend using the popper element as a wrapper around an inner', 'element that can have any CSS property transitioned for animations.'].join(' '));
    }
  }

  var commonStyles = {
    placement: getBasePlacement(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration: gpuAcceleration
  };

  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, {}, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive: adaptive
    })));
  }

  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, {}, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: 'absolute',
      adaptive: false
    })));
  }

  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-placement': state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


var computeStyles$1 = {
  name: 'computeStyles',
  enabled: true,
  phase: 'beforeWrite',
  fn: computeStyles,
  data: {}
};

// and applies them to the HTMLElements such as popper and arrow

function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function (name) {
    var style = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element = state.elements[name]; // arrow is optional + virtual elements

    if (!isHTMLElement(element) || !getNodeName(element)) {
      return;
    } // Flow doesn't support to extend this property, but it's the most
    // effective way to apply styles to an HTMLElement
    // $FlowFixMe


    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function (name) {
      var value = attributes[name];

      if (value === false) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, value === true ? '' : value);
      }
    });
  });
}

function effect$1(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: '0',
      top: '0',
      margin: '0'
    },
    arrow: {
      position: 'absolute'
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);

  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }

  return function () {
    Object.keys(state.elements).forEach(function (name) {
      var element = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

      var style = styleProperties.reduce(function (style, property) {
        style[property] = '';
        return style;
      }, {}); // arrow is optional + virtual elements

      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      } // Flow doesn't support to extend this property, but it's the most
      // effective way to apply styles to an HTMLElement
      // $FlowFixMe


      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function (attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
} // eslint-disable-next-line import/no-unused-modules


var applyStyles$1 = {
  name: 'applyStyles',
  enabled: true,
  phase: 'write',
  fn: applyStyles,
  effect: effect$1,
  requires: ['computeStyles']
};

function distanceAndSkiddingToXY(placement, rects, offset) {
  var basePlacement = getBasePlacement(placement);
  var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;

  var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
    placement: placement
  })) : offset,
      skidding = _ref[0],
      distance = _ref[1];

  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [left, right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}

function offset(_ref2) {
  var state = _ref2.state,
      options = _ref2.options,
      name = _ref2.name;
  var _options$offset = options.offset,
      offset = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = placements.reduce(function (acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement],
      x = _data$state$placement.x,
      y = _data$state$placement.y;

  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x;
    state.modifiersData.popperOffsets.y += y;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


var offset$1 = {
  name: 'offset',
  enabled: true,
  phase: 'main',
  requires: ['popperOffsets'],
  fn: offset
};

var hash = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash[matched];
  });
}

var hash$1 = {
  start: 'end',
  end: 'start'
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function (matched) {
    return hash$1[matched];
  });
}

function getViewportRect(element) {
  var win = getWindow(element);
  var visualViewport = win.visualViewport;
  var width = win.innerWidth;
  var height = win.innerHeight; // We don't know which browsers have buggy or odd implementations of this, so
  // for now we're only applying it to iOS to fix the keyboard issue.
  // Investigation required

  if (visualViewport && /iPhone|iPod|iPad/.test(navigator.platform)) {
    width = visualViewport.width;
    height = visualViewport.height;
  }

  return {
    width: width,
    height: height,
    x: 0,
    y: 0
  };
}

function getDocumentRect(element) {
  var win = getWindow(element);
  var winScroll = getWindowScroll(element);
  var documentRect = getCompositeRect(getDocumentElement(element), win);
  documentRect.height = Math.max(documentRect.height, win.innerHeight);
  documentRect.width = Math.max(documentRect.width, win.innerWidth);
  documentRect.x = -winScroll.scrollLeft;
  documentRect.y = -winScroll.scrollTop;
  return documentRect;
}

function toNumber(cssValue) {
  return parseFloat(cssValue) || 0;
}

function getBorders(element) {
  var computedStyle = isHTMLElement(element) ? getComputedStyle(element) : {};
  return {
    top: toNumber(computedStyle.borderTopWidth),
    right: toNumber(computedStyle.borderRightWidth),
    bottom: toNumber(computedStyle.borderBottomWidth),
    left: toNumber(computedStyle.borderLeftWidth)
  };
}

function getDecorations(element) {
  var win = getWindow(element);
  var borders = getBorders(element);
  var isHTML = getNodeName(element) === 'html';
  var winScrollBarX = getWindowScrollBarX(element);
  var x = element.clientWidth + borders.right;
  var y = element.clientHeight + borders.bottom; // HACK:
  // document.documentElement.clientHeight on iOS reports the height of the
  // viewport including the bottom bar, even if the bottom bar isn't visible.
  // If the difference between window innerHeight and html clientHeight is more
  // than 50, we assume it's a mobile bottom bar and ignore scrollbars.
  // * A 50px thick scrollbar is likely non-existent (macOS is 15px and Windows
  //   is about 17px)
  // * The mobile bar is 114px tall

  if (isHTML && win.innerHeight - element.clientHeight > 50) {
    y = win.innerHeight - borders.bottom;
  }

  return {
    top: isHTML ? 0 : element.clientTop,
    right: // RTL scrollbar (scrolling containers only)
    element.clientLeft > borders.left ? borders.right : // LTR scrollbar
    isHTML ? win.innerWidth - x - winScrollBarX : element.offsetWidth - x,
    bottom: isHTML ? win.innerHeight - y : element.offsetHeight - y,
    left: isHTML ? winScrollBarX : element.clientLeft
  };
}

function contains(parent, child) {
  // $FlowFixMe: hasOwnProperty doesn't seem to work in tests
  var isShadow = Boolean(child.getRootNode && child.getRootNode().host); // First, attempt with faster native method

  if (parent.contains(child)) {
    return true;
  } // then fallback to custom implementation with Shadow DOM support
  else if (isShadow) {
      var next = child;

      do {
        if (next && parent.isSameNode(next)) {
          return true;
        } // $FlowFixMe: need a better way to handle this...


        next = next.parentNode || next.host;
      } while (next);
    } // Give up, the result is false


  return false;
}

function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}

function getClientRectFromMixedType(element, clippingParent) {
  return clippingParent === viewport ? rectToClientRect(getViewportRect(element)) : isHTMLElement(clippingParent) ? getBoundingClientRect(clippingParent) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
} // A "clipping parent" is an overflowable container with the characteristic of
// clipping (or hiding) overflowing elements with a position different from
// `initial`


function getClippingParents(element) {
  var clippingParents = listScrollParents(element);
  var canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle(element).position) >= 0;
  var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;

  if (!isElement(clipperElement)) {
    return [];
  } // $FlowFixMe: https://github.com/facebook/flow/issues/1414


  return clippingParents.filter(function (clippingParent) {
    return isElement(clippingParent) && contains(clippingParent, clipperElement);
  });
} // Gets the maximum area that the element is visible in due to any number of
// clipping parents


function getClippingRect(element, boundary, rootBoundary) {
  var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
  var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents[0];
  var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent);
    var decorations = getDecorations(isHTMLElement(clippingParent) ? clippingParent : getDocumentElement(element));
    accRect.top = Math.max(rect.top + decorations.top, accRect.top);
    accRect.right = Math.min(rect.right - decorations.right, accRect.right);
    accRect.bottom = Math.min(rect.bottom - decorations.bottom, accRect.bottom);
    accRect.left = Math.max(rect.left + decorations.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}

function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}

function mergePaddingObject(paddingObject) {
  return Object.assign({}, getFreshSideObject(), {}, paddingObject);
}

function expandToHashMap(value, keys) {
  return keys.reduce(function (hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}

function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      _options$placement = _options.placement,
      placement = _options$placement === void 0 ? state.placement : _options$placement,
      _options$boundary = _options.boundary,
      boundary = _options$boundary === void 0 ? clippingParents : _options$boundary,
      _options$rootBoundary = _options.rootBoundary,
      rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary,
      _options$elementConte = _options.elementContext,
      elementContext = _options$elementConte === void 0 ? popper : _options$elementConte,
      _options$altBoundary = _options.altBoundary,
      altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
      _options$padding = _options.padding,
      padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
  var altContext = elementContext === popper ? reference : popper;
  var referenceElement = state.elements.reference;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary);
  var referenceClientRect = getBoundingClientRect(referenceElement);
  var popperOffsets = computeOffsets({
    reference: referenceClientRect,
    element: popperRect,
    strategy: 'absolute',
    placement: placement
  });
  var popperClientRect = rectToClientRect(Object.assign({}, popperRect, {}, popperOffsets));
  var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
  // 0 or negative = within the clipping rect

  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

  if (elementContext === popper && offsetData) {
    var offset = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function (key) {
      var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [top, bottom].indexOf(key) >= 0 ? 'y' : 'x';
      overflowOffsets[key] += offset[axis] * multiply;
    });
  }

  return overflowOffsets;
}

/*:: type OverflowsMap = { [ComputedPlacement]: number }; */

/*;; type OverflowsMap = { [key in ComputedPlacement]: number }; */
function computeAutoPlacement(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      placement = _options.placement,
      boundary = _options.boundary,
      rootBoundary = _options.rootBoundary,
      padding = _options.padding,
      flipVariations = _options.flipVariations,
      _options$allowedAutoP = _options.allowedAutoPlacements,
      allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
  var variation = getVariation(placement);
  var placements$1 = (variation ? flipVariations ? variationPlacements : variationPlacements.filter(function (placement) {
    return getVariation(placement) === variation;
  }) : basePlacements).filter(function (placement) {
    return allowedAutoPlacements.indexOf(placement) >= 0;
  }); // $FlowFixMe: Flow seems to have problems with two array unions...

  var overflows = placements$1.reduce(function (acc, placement) {
    acc[placement] = detectOverflow(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding
    })[getBasePlacement(placement)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function (a, b) {
    return overflows[a] - overflows[b];
  });
}

function getExpandedFallbackPlacements(placement) {
  if (getBasePlacement(placement) === auto) {
    return [];
  }

  var oppositePlacement = getOppositePlacement(placement);
  return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
}

function flip(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;

  if (state.modifiersData[name]._skip) {
    return;
  }

  var specifiedFallbackPlacements = options.fallbackPlacements,
      padding = options.padding,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      _options$flipVariatio = options.flipVariations,
      flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
      allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = getBasePlacement(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
    return acc.concat(getBasePlacement(placement) === auto ? computeAutoPlacement(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding,
      flipVariations: flipVariations,
      allowedAutoPlacements: allowedAutoPlacements
    }) : placement);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements[0];

  for (var i = 0; i < placements.length; i++) {
    var placement = placements[i];

    var _basePlacement = getBasePlacement(placement);

    var isStartVariation = getVariation(placement) === start;
    var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? 'width' : 'height';
    var overflow = detectOverflow(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      altBoundary: altBoundary,
      padding: padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;

    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = getOppositePlacement(mainVariationSide);
    }

    var altVariationSide = getOppositePlacement(mainVariationSide);
    var checks = [overflow[_basePlacement] <= 0, overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0];

    if (checks.every(function (check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }

    checksMap.set(placement, checks);
  }

  if (makeFallbackChecks) {
    // `2` may be desired in some cases – research later
    var numberOfChecks = flipVariations ? 3 : 1;

    var _loop = function _loop(_i) {
      var fittingPlacement = placements.find(function (placement) {
        var checks = checksMap.get(placement);

        if (checks) {
          return checks.slice(0, _i).every(function (check) {
            return check;
          });
        }
      });

      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };

    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);

      if (_ret === "break") break;
    }
  }

  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
} // eslint-disable-next-line import/no-unused-modules


var flip$1 = {
  name: 'flip',
  enabled: true,
  phase: 'main',
  fn: flip,
  requiresIfExists: ['offset'],
  data: {
    _skip: false
  }
};

function getAltAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}

function within(min, value, max) {
  return Math.max(min, Math.min(value, max));
}

function preventOverflow(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;
  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      padding = options.padding,
      _options$tether = options.tether,
      tether = _options$tether === void 0 ? true : _options$tether,
      _options$tetherOffset = options.tetherOffset,
      tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = detectOverflow(state, {
    boundary: boundary,
    rootBoundary: rootBoundary,
    padding: padding,
    altBoundary: altBoundary
  });
  var basePlacement = getBasePlacement(state.placement);
  var variation = getVariation(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = getMainAxisFromPlacement(basePlacement);
  var altAxis = getAltAxis(mainAxis);
  var popperOffsets = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var data = {
    x: 0,
    y: 0
  };

  if (!popperOffsets) {
    return;
  }

  if (checkMainAxis) {
    var mainSide = mainAxis === 'y' ? top : left;
    var altSide = mainAxis === 'y' ? bottom : right;
    var len = mainAxis === 'y' ? 'height' : 'width';
    var offset = popperOffsets[mainAxis];
    var min = popperOffsets[mainAxis] + overflow[mainSide];
    var max = popperOffsets[mainAxis] - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
    // outside the reference bounds

    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : getFreshSideObject();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
    // to include its full size in the calculation. If the reference is small
    // and near the edge of a boundary, the popper can overflow even if the
    // reference is not overflowing as well (e.g. virtual elements with no
    // width or height)

    var arrowLen = within(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - tetherOffsetValue : minLen - arrowLen - arrowPaddingMin - tetherOffsetValue;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + tetherOffsetValue : maxLen + arrowLen + arrowPaddingMax + tetherOffsetValue;
    var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = state.modifiersData.offset ? state.modifiersData.offset[state.placement][mainAxis] : 0;
    var tetherMin = popperOffsets[mainAxis] + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = popperOffsets[mainAxis] + maxOffset - offsetModifierValue;
    var preventedOffset = within(tether ? Math.min(min, tetherMin) : min, offset, tether ? Math.max(max, tetherMax) : max);
    popperOffsets[mainAxis] = preventedOffset;
    data[mainAxis] = preventedOffset - offset;
  }

  if (checkAltAxis) {
    var _mainSide = mainAxis === 'x' ? top : left;

    var _altSide = mainAxis === 'x' ? bottom : right;

    var _offset = popperOffsets[altAxis];

    var _min = _offset + overflow[_mainSide];

    var _max = _offset - overflow[_altSide];

    var _preventedOffset = within(_min, _offset, _max);

    popperOffsets[altAxis] = _preventedOffset;
    data[altAxis] = _preventedOffset - _offset;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


var preventOverflow$1 = {
  name: 'preventOverflow',
  enabled: true,
  phase: 'main',
  fn: preventOverflow,
  requiresIfExists: ['offset']
};

function arrow(_ref) {
  var _state$modifiersData$;

  var state = _ref.state,
      name = _ref.name;
  var arrowElement = state.elements.arrow;
  var popperOffsets = state.modifiersData.popperOffsets;
  var basePlacement = getBasePlacement(state.placement);
  var axis = getMainAxisFromPlacement(basePlacement);
  var isVertical = [left, right].indexOf(basePlacement) >= 0;
  var len = isVertical ? 'height' : 'width';

  if (!arrowElement || !popperOffsets) {
    return;
  }

  var paddingObject = state.modifiersData[name + "#persistent"].padding;
  var arrowRect = getLayoutRect(arrowElement);
  var minProp = axis === 'y' ? top : left;
  var maxProp = axis === 'y' ? bottom : right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
  var startDiff = popperOffsets[axis] - state.rects.reference[axis];
  var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
  var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
  // outside of the popper bounds

  var min = paddingObject[minProp];
  var max = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset = within(min, center, max); // Prevents breaking syntax highlighting...

  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
}

function effect$2(_ref2) {
  var state = _ref2.state,
      options = _ref2.options,
      name = _ref2.name;
  var _options$element = options.element,
      arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element,
      _options$padding = options.padding,
      padding = _options$padding === void 0 ? 0 : _options$padding;

  if (arrowElement == null) {
    return;
  } // CSS selector


  if (typeof arrowElement === 'string') {
    arrowElement = state.elements.popper.querySelector(arrowElement);

    if (!arrowElement) {
      return;
    }
  }

  if (!contains(state.elements.popper, arrowElement)) {
    if (process.env.NODE_ENV !== "production") {
      console.error(['Popper: "arrow" modifier\'s `element` must be a child of the popper', 'element.'].join(' '));
    }

    return;
  }

  state.elements.arrow = arrowElement;
  state.modifiersData[name + "#persistent"] = {
    padding: mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements))
  };
} // eslint-disable-next-line import/no-unused-modules


var arrow$1 = {
  name: 'arrow',
  enabled: true,
  phase: 'main',
  fn: arrow,
  effect: effect$2,
  requires: ['popperOffsets'],
  requiresIfExists: ['preventOverflow']
};

function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }

  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}

function isAnySideFullyClipped(overflow) {
  return [top, right, bottom, left].some(function (side) {
    return overflow[side] >= 0;
  });
}

function hide(_ref) {
  var state = _ref.state,
      name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = detectOverflow(state, {
    elementContext: 'reference'
  });
  var popperAltOverflow = detectOverflow(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets: referenceClippingOffsets,
    popperEscapeOffsets: popperEscapeOffsets,
    isReferenceHidden: isReferenceHidden,
    hasPopperEscaped: hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-reference-hidden': isReferenceHidden,
    'data-popper-escaped': hasPopperEscaped
  });
} // eslint-disable-next-line import/no-unused-modules


var hide$1 = {
  name: 'hide',
  enabled: true,
  phase: 'main',
  requiresIfExists: ['preventOverflow'],
  fn: hide
};

var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
var createPopper = /*#__PURE__*/popperGenerator({
  defaultModifiers: defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
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

const debounce$1 = (func, waitFor) => {
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

var template$6 = "<mdi-scroll part=\"scroll\">\n  <div part=\"grid\"></div>\n</mdi-scroll>\n<div part=\"tooltip\">\n  <span part=\"tooltipText\"></span>\n  <div part=\"tooltipArrow\"></div>\n</div>\n<div part=\"contextMenu\">\n  <a part=\"newTab\" href=\"\">Open icon in New Tab</a>\n  <button part=\"copyIconName\">Copy Icon Name</button>\n  <div class=\"section\">Download PNG</div>\n  <div class=\"group\">\n    <button part=\"png24\">24</button>\n    <button part=\"png36\">36</button>\n    <button part=\"png48\">48</button>\n    <button part=\"png96\">96</button>\n  </div>\n  <div class=\"row\" style=\"margin-top: 0.25rem;\">\n    <div class=\"group\">\n      <button part=\"pngBlack\"><span class=\"black\"></span></button>\n      <button part=\"pngWhite\"><span class=\"white\"></span></button>\n      <button part=\"pngColor\">\n        <svg viewBox=\"0 0 24 24\">\n          <path fill=\"#fff\" d=\"M19.35,11.72L17.22,13.85L15.81,12.43L8.1,20.14L3.5,22L2,20.5L3.86,15.9L11.57,8.19L10.15,6.78L12.28,4.65L19.35,11.72M16.76,3C17.93,1.83 19.83,1.83 21,3C22.17,4.17 22.17,6.07 21,7.24L19.08,9.16L14.84,4.92L16.76,3M5.56,17.03L4.5,19.5L6.97,18.44L14.4,11L13,9.6L5.56,17.03Z\"/>\n          <path fill=\"currentColor\" d=\"M12.97 8L15.8 10.85L7.67 19L3.71 20.68L3.15 20.11L4.84 16.15L12.97 8Z\"/>\n        </svg>\n      </button>\n    </div>\n    <div class=\"group\">\n      <button part=\"pngDownload\" class=\"download\">\n        PNG\n        <svg viewBox=\"0 0 24 24\">\n          <path fill=\"currentColor\" d=\"M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z\"/>\n        </svg>\n      </button>\n    </div>\n  </div>\n  <div class=\"section\">SVG</div>\n  <div class=\"row\" style=\"margin-bottom: 0.25rem;\">\n    <div class=\"group\">\n      <button part=\"svgBlack\" class=\"active\"><span class=\"black\"></span></button>\n      <button part=\"svgWhite\"><span class=\"white\"></span></button>\n      <button part=\"svgColor\">\n        <svg viewBox=\"0 0 24 24\">\n          <path fill=\"#fff\" d=\"M19.35,11.72L17.22,13.85L15.81,12.43L8.1,20.14L3.5,22L2,20.5L3.86,15.9L11.57,8.19L10.15,6.78L12.28,4.65L19.35,11.72M16.76,3C17.93,1.83 19.83,1.83 21,3C22.17,4.17 22.17,6.07 21,7.24L19.08,9.16L14.84,4.92L16.76,3M5.56,17.03L4.5,19.5L6.97,18.44L14.4,11L13,9.6L5.56,17.03Z\"/>\n          <path fill=\"currentColor\" d=\"M12.97 8L15.8 10.85L7.67 19L3.71 20.68L3.15 20.11L4.84 16.15L12.97 8Z\"/>\n        </svg>\n      </button>\n    </div>\n    <div class=\"group\">\n      <button part=\"svgDownload\" class=\"download\">\n        SVG\n        <svg viewBox=\"0 0 24 24\">\n          <path fill=\"currentColor\" d=\"M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z\"/>\n        </svg>\n      </button>\n    </div>\n  </div>\n  <button part=\"copySvgInline\">Copy HTML SVG Inline</button>\n  <button part=\"copySvgFile\">Copy SVG File Contents</button>\n  <button part=\"copySvgPath\">Copy SVG Path Data</button>\n  <div class=\"section\">Desktop Font</div>\n  <button part=\"copyUnicode\">Copy Unicode Character</button>\n  <button part=\"copyCodepoint\">Copy Codepoint</button>\n  <div class=\"divider\"></div>\n  <button part=\"copyPreview\">Copy GitHub Preview</button>\n  <div part=\"color\">\n    <mdi-input-hex-rgb part=\"colorHexRgb\"></mdi-input-hex-rgb>\n    <mdi-color part=\"colorPicker\"></mdi-color>\n  </div>\n</div>";

var style$6 = "* {\n  font-family: var(--mdi-font-family);\n}\n\n:host {\n  display: block;\n}\n\n[part~=grid] {\n  position: relative;\n}\n\n[part~=grid] > button {\n  border: 0;\n  background: transparent;\n  padding: 0.625rem;\n  outline: none;\n  width: 2.75rem;\n  height: 2.75rem;\n  position: absolute;\n  left: 0;\n  top: 0;\n  border: 0;\n  border-radius: 0.25rem;\n}\n\n[part~=grid] > button:hover {\n  background: rgba(0, 0, 0, 0.1);\n}\n\n[part~=grid] > button:active {\n  background: rgba(0, 0, 0, 0.15);\n  box-shadow: 0 0.0125rem 0.25rem rgba(0, 0, 0, 0.2) inset;\n}\n\n[part~=grid] > button > svg {\n  fill: #453C4F;\n  width: 1.5rem;\n  height: 1.5rem;\n}\n\n[part~=grid] > button > svg {\n  fill: #453C4F;\n}\n\n[part~=tooltip] {\n  will-change: transform;\n  opacity: 0;\n  transition: opacity 0.2s ease-in;\n  pointer-events: none;\n  visibility: hidden;\n}\n\n[part~=tooltip].visible {\n  visibility: visible;\n  opacity: 1;\n}\n\n[part~=tooltipText] {\n  background: #737E9E;\n  border-radius: 0.25rem;\n  color: #FFF;\n  padding: 0.15rem 0.5rem 0.3rem 0.5rem;\n  white-space: nowrap;\n}\n\n[part~=tooltipArrow] {\n  left: 18px;\n  bottom: -26px;\n}\n\n[part~=tooltipArrow],\n[part~=tooltipArrow]::before {\n  position: absolute;\n  width: 10px;\n  height: 10px;\n}\n\n[part~=tooltipArrow]::before {\n  content: '';\n  transform: rotate(45deg);\n  background: #737E9E;\n}\n\n[part~=grid]::-webkit-scrollbar {\n  width: 1em;\n}\n\n[part~=grid]::-webkit-scrollbar-track {\n  box-shadow: inset 0 0 6px rgba(0,0,0,0.2);\n  border-radius: 0.25rem;\n}\n\n[part~=grid]::-webkit-scrollbar-thumb {\n  background-color: #453C4F;\n  outline: 1px solid slategrey;\n  border-radius: 0.25rem;\n}\n\n[part~=contextMenu] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  background: #737E9E;\n  border-radius: 0.25rem;\n  width: 12rem;\n  display: flex;\n  flex-direction: column;\n  padding: 0.25rem 0;\n  visibility: hidden;\n  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.3);\n}\n\n[part~=contextMenu] > div.section {\n  color: #FFF;\n  font-size: 0.875rem;\n  padding: 0.25rem 0.5rem;\n  cursor: default;\n  font-weight: bold;\n}\n\n[part~=contextMenu] > div.section:not(:first-child) {\n  border-top: 1px solid rgba(255, 255, 255, 0.3);\n  margin-top: 0.5rem;\n}\n\n[part~=contextMenu] > div.group {\n  margin: 0 0.5rem;\n  border: 1px solid rgba(255, 255, 255, 0.2);\n  border-radius: 0.25rem;\n  display: flex;\n  flex-direction: row;\n  overflow: hidden;\n}\n[part~=contextMenu] > div.row > div.group {\n  border: 1px solid rgba(255, 255, 255, 0.2);\n  border-radius: 0.25rem;\n  display: flex;\n  flex-direction: row;\n  flex: 1;\n  overflow: hidden;\n}\n\n[part~=contextMenu] > div.row > div.group:first-child {\n  margin-left: 0.5rem;\n  margin-right: 0.25rem;\n}\n\n[part~=contextMenu] > div.row > div.group:last-child {\n  margin-right: 0.5rem;\n}\n\n[part~=contextMenu] > div.group > button,\n[part~=contextMenu] > div.row > div.group > button {\n  display: flex;\n  flex: 1;\n  padding: 0.25rem;\n  justify-content: center;\n  border: 0;\n  margin: 0;\n  background: transparent;\n  color: #FFF;\n  font-size: 1rem;\n  line-height: 1.25rem;\n  align-items: center;\n  outline: none;\n}\n\n[part~=contextMenu] > button,\n[part~=contextMenu] > a {\n  display: flex;\n  border: 0;\n  margin: 0;\n  padding: 0.125rem 0.5rem;\n  background: transparent;\n  text-align: left;\n  color: #FFF;\n  font-size: 1rem;\n  text-decoration: none;\n  cursor: default;\n  outline: none;\n}\n\n[part~=contextMenu] > div.group > button.active,\n[part~=contextMenu] > div.row > div.group > button.active {\n  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3) inset;\n  background: rgba(0, 0, 0, 0.1);\n}\n\n[part~=contextMenu] > div.group > button.active:hover,\n[part~=contextMenu] > div.row > div.group > button.active:hover {\n  background: rgba(0, 0, 0, 0.2);\n}\n\n[part~=contextMenu] > div.group > button:not(:first-child),\n[part~=contextMenu] > div.row > div.group > button:not(:first-child) {\n  border-left: 1px solid rgba(255, 255, 255, 0.1);\n}\n\n[part~=contextMenu] > div.row > div.group > button > svg,\n[part~=contextMenu] > div.group > button > svg,\n[part~=contextMenu] > div.row > button > svg,\n[part~=contextMenu] > button > svg {\n  width: 1.5rem;\n  height: 1.5rem;\n  align-self: center;\n}\n\n[part~=contextMenu] > div.row > div.group > button:hover,\n[part~=contextMenu] > div.group > button:hover,\n[part~=contextMenu] > button:hover,\n[part~=contextMenu] > a:hover {\n  background: rgba(255, 255, 255, 0.2);\n}\n\n[part~=contextMenu] > div.row > div.group > button:active,\n[part~=contextMenu] > div.group > button:active {\n  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.3) inset;\n  background: rgba(0, 0, 0, 0.2);\n}\n[part~=contextMenu] > button:active,\n[part~=contextMenu] > a:active {\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) inset;\n  background: rgba(0, 0, 0, 0.2);\n}\n\n.row {\n  display: flex;\n}\n\n.divider {\n  border-top: 1px solid rgba(255, 255, 255, 0.3);\n  margin-top: 0.5rem;\n  height: 0.4375rem;\n}\n\n.black {\n  display: inline-flex;\n  border-radius: 50%;\n  width: 1rem;\n  height: 1rem;\n  background: #000;\n}\n\n.white {\n  display: inline-flex;\n  border-radius: 50%;\n  width: 1rem;\n  height: 1rem;\n  background: #FFF;\n}\n\n.download svg {\n  margin-bottom: -0.125rem;\n  margin-left: 0.25rem;\n}\n\n[part~=color] {\n  position: absolute;\n  padding: 0.25rem;\n  background: #737E9E;\n  border-radius: 0.25rem;\n  box-shadow: 0 1px 16px rgba(0, 0, 0, 0.6);\n}\n\n[part~=colorHexRgb] {\n  margin-bottom: 0.25rem;\n}";

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
        this.debounceRender = debounce$1(() => this.render(), 300);
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
            createPopper(this.$svgColor, this.$color, {
                placement: 'bottom-start'
            });
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
            createPopper(this.$pngColor, this.$color, {
                placement: 'bottom-start'
            });
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
        style: style$6,
        template: template$6
    })
], MdiGrid);

var template$7 = "<header>\n  <a href=\"/\">\n    <svg viewBox=\"0 0 24 24\">\n      <path part=\"path\" fill=\"currentColor\" d=\"\"></path>\n    </svg>\n    <span part=\"name\"></span>\n  </a>\n  <div>\n    <slot name=\"search\"></slot>\n    <slot name=\"nav\"></slot>\n  </div>\n</header>";

var style$7 = "header {\n  display: grid;\n  grid-template-columns: auto 1fr;\n  grid-template-rows: 1fr;\n  grid-row: 1;\n  grid-column: 1 / span 2;\n  background: #414F56;\n  color: #FFF;\n  height: 3rem;\n}\nheader > a {\n  grid-column: 1;\n  display: inline-flex;\n  color: #FFF;\n  text-decoration: none;\n  align-items: center;\n}\nheader > a > svg {\n  display: inline-flex;\n  width: 1.75rem;\n  height: 1.75rem;\n  margin: 0 0.75rem 0 1rem;\n}\nheader > a > span {\n  display: inline-flex;\n  color: #FFF;\n  font-size: 1.5rem;\n  margin: 0;\n  font-weight: normal;\n  padding-bottom: 1px;\n}\nheader > div {\n  display: flex;\n  grid-column: 2;\n  justify-self: right;\n}";

const noIcon = 'M0 0h24v24H0V0zm2 2v20h20V2H2z';
let MdiHeader = class MdiHeader extends HTMLElement {
    constructor() {
        super(...arguments);
        this.logo = noIcon;
        this.name = 'Default';
    }
    render() {
        this.$path.setAttribute('d', this.logo);
        this.$name.innerText = this.name;
    }
};
__decorate([
    Prop()
], MdiHeader.prototype, "logo", void 0);
__decorate([
    Prop()
], MdiHeader.prototype, "name", void 0);
__decorate([
    Part()
], MdiHeader.prototype, "$path", void 0);
__decorate([
    Part()
], MdiHeader.prototype, "$name", void 0);
MdiHeader = __decorate([
    Component({
        selector: 'mdi-header',
        style: style$7,
        template: template$7
    })
], MdiHeader);

var template$8 = "<svg part=\"svg\" viewBox=\"0 0 24 24\">\n  <path part=\"path\" fill=\"currentColor\" d=\"M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z\"/>\n</svg>";

var style$8 = ":host {\n  display: inline-flex;\n  color: var(--mdi-icon-color, #222);\n}\n\n:host [part~=svg] {\n  width: 1.5rem;\n  height: 1.5rem;\n}";

const noIcon$1 = 'M0 0h24v24H0V0zm2 2v20h20V2H2z';
let MdiIcon = class MdiIcon extends HTMLElement {
    constructor() {
        super(...arguments);
        this.path = noIcon$1;
    }
    render() {
        this.$path.setAttribute('d', this.path);
    }
};
__decorate([
    Prop()
], MdiIcon.prototype, "path", void 0);
__decorate([
    Part()
], MdiIcon.prototype, "$path", void 0);
MdiIcon = __decorate([
    Component({
        selector: 'mdi-icon',
        style: style$8,
        template: template$8
    })
], MdiIcon);

function hexToRgb$1(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
function normalizeHex(hex) {
    const h = hex.toUpperCase();
    if (h.length === 7) {
        return h;
    }
    else if (h.length === 4) {
        return `#${h[1]}${h[1]}${h[2]}${h[2]}${h[3]}${h[3]}`;
    }
    return '#000000';
}
function cToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
    return "#" + cToHex(r) + cToHex(g) + cToHex(b);
}

var template$9 = "<div>\n  <input part=\"hex\" type=\"text\" />\n  <label part=\"labelRed\">R</label>\n  <input part=\"red\" type=\"number\" step=\"1\" min=\"0\" max=\"255\" />\n  <label part=\"labelGreen\">G</label>\n  <input part=\"green\" type=\"number\" step=\"1\" min=\"0\" max=\"255\" />\n  <label part=\"labelBlue\">B</label>\n  <input part=\"blue\" type=\"number\" step=\"1\" min=\"0\" max=\"255\" />\n</div>";

var style$9 = ":host {\n  display: block;\n}\n\n:host > div {\n  display: grid;\n  grid-template-rows: auto 1rem 2rem 1rem 2rem 1rem 2rem;\n  grid-template-rows: 1fr;\n}\n\n[part~=\"hex\"] {\n  grid-row: 1;\n  grid-column: 1;\n}\n\n[part~=\"labelRed\"] {\n  grid-row: 1;\n  grid-column: 2;\n  background: red;\n}\n\n[part~=\"red\"] {\n  grid-row: 1;\n  grid-column: 3;\n}\n\n[part~=\"labelGreen\"] {\n  grid-row: 1;\n  grid-column: 4;\n  background: green;\n  color: white;\n}\n\n[part~=\"green\"] {\n  grid-row: 1;\n  grid-column: 5;\n}\n\n[part~=\"labelBlue\"] {\n  grid-row: 1;\n  grid-column: 6;\n  background: blue;\n  color: white;\n}\n\n[part~=\"blue\"] {\n  grid-row: 1;\n  grid-column: 7;\n}\n\n[part~=\"labelRed\"],\n[part~=\"labelGreen\"],\n[part~=\"labelBlue\"] {\n  display: flex;\n  margin-left: 0.25rem;\n  align-items: center;\n  justify-content: center;\n  border-radius: 0.25rem 0 0 0.25rem;\n  color: white;\n  min-width: 1rem;\n}\n\n[part~=\"hex\"] {\n  border-radius: 0.25rem;\n  min-width: 4rem;\n}\n\n[part~=\"hex\"],\n[part~=\"red\"],\n[part~=\"green\"],\n[part~=\"blue\"] {\n  outline: none;\n  font-size: 1rem;\n  padding: 0.25rem 0.5rem;\n  border: 0;\n  width: calc(100% - 1rem);\n}\n\n[part~=\"red\"],\n[part~=\"green\"],\n[part~=\"blue\"] {\n  border-radius: 0 0.25rem 0.25rem 0;\n  -moz-appearance: textfield;\n  width: calc(100% - 1rem);\n  min-width: 2rem;\n}\n\n[part~=\"red\"]::-webkit-inner-spin-button,\n[part~=\"red\"]::-webkit-outer-spin-button,\n[part~=\"green\"]::-webkit-inner-spin-button,\n[part~=\"green\"]::-webkit-outer-spin-button,\n[part~=\"blue\"]::-webkit-inner-spin-button,\n[part~=\"blue\"]::-webkit-outer-spin-button {\n  -webkit-appearance: none;\n  margin: 0;\n}";

let MdiNav$1 = class MdiNav extends HTMLElement {
    constructor() {
        super(...arguments);
        this.value = '#000000';
    }
    connectedCallback() {
        this.$hex.value = this.value;
        this.updateRgb();
        this.$hex.addEventListener('input', this.updateRgbDispatch.bind(this));
        this.$red.addEventListener('input', this.updateHexDispatch.bind(this));
        this.$green.addEventListener('input', this.updateHexDispatch.bind(this));
        this.$blue.addEventListener('input', this.updateHexDispatch.bind(this));
    }
    updateRgb() {
        const hex = normalizeHex(this.$hex.value);
        const rgb = hexToRgb$1(hex);
        if (rgb !== null) {
            this.$red.value = rgb.r.toString();
            this.$green.value = rgb.g.toString();
            this.$blue.value = rgb.b.toString();
        }
    }
    updateRgbDispatch() {
        this.updateRgb();
        this.dispatchSelect();
    }
    updateHexDispatch() {
        this.$hex.value = rgbToHex(parseInt(this.$red.value || '0', 10), parseInt(this.$green.value || '0', 10), parseInt(this.$blue.value || '0', 10));
        this.dispatchSelect();
    }
    dispatchSelect() {
        const hex = normalizeHex(this.$hex.value);
        const rgb = rgbToHex(parseInt(this.$red.value || '0', 10), parseInt(this.$green.value || '0'), parseInt(this.$blue.value || '0'));
        this.value = hex;
        this.dispatchEvent(new CustomEvent('change', {
            detail: {
                hex,
                rgb
            }
        }));
    }
    render() {
        const hex = normalizeHex(this.value);
        const rgb = hexToRgb$1(hex);
        this.$hex.value = hex;
        this.$red.value = `${rgb ? rgb.r : 0}`;
        this.$green.value = `${rgb ? rgb.g : 0}`;
        this.$blue.value = `${rgb ? rgb.b : 0}`;
    }
};
__decorate([
    Prop()
], MdiNav$1.prototype, "value", void 0);
__decorate([
    Part()
], MdiNav$1.prototype, "$hex", void 0);
__decorate([
    Part()
], MdiNav$1.prototype, "$red", void 0);
__decorate([
    Part()
], MdiNav$1.prototype, "$green", void 0);
__decorate([
    Part()
], MdiNav$1.prototype, "$blue", void 0);
MdiNav$1 = __decorate([
    Component({
        selector: 'mdi-input-hex-rgb',
        style: style$9,
        template: template$9
    })
], MdiNav$1);

var template$a = "<input part=\"input\" type=\"range\" />";

var style$a = "";

let MdiNav$2 = class MdiNav extends HTMLElement {
    constructor() {
        super(...arguments);
        this.min = '0';
        this.max = '100';
        this.step = '1';
    }
    render() {
        this.$input.min = this.min;
        this.$input.max = this.max;
        this.$input.step = this.step;
    }
};
__decorate([
    Prop()
], MdiNav$2.prototype, "min", void 0);
__decorate([
    Prop()
], MdiNav$2.prototype, "max", void 0);
__decorate([
    Prop()
], MdiNav$2.prototype, "step", void 0);
__decorate([
    Part()
], MdiNav$2.prototype, "$input", void 0);
MdiNav$2 = __decorate([
    Component({
        selector: 'mdi-input-range',
        style: style$a,
        template: template$a
    })
], MdiNav$2);

var template$b = "<h1>Header 1</h1>\n\n<p>Paragraph</p>\n\n<h2>Header 2</h2>\n\n<p>Paragraph</p>\n\n<h3>Header 3</h3>\n\n<p>Paragraph</p>\n\n<blockquote>\n  <p>Blockquote</p>\n</blockquote>";

var style$b = ":host {\n  color: #453C4F;\n}\n\nblockquote {\n  border-left: 4px solid #453C4F;\n  padding: 0 0.5rem;\n  margin: 0;\n}";

let MdiMarkdown = class MdiMarkdown extends HTMLElement {
    constructor() {
        super(...arguments);
        this.text = '';
    }
};
__decorate([
    Prop()
], MdiMarkdown.prototype, "text", void 0);
MdiMarkdown = __decorate([
    Component({
        selector: 'mdi-markdown',
        style: style$b,
        template: template$b
    })
], MdiMarkdown);

var template$c = "<nav part=\"nav\">\n  <a href=\"/\">\n    <span part=\"name\"></span>\n  </a>\n  <a href=\"/icons\">\n    Icons\n  </a>\n  <a href=\"/icons\">\n    Docs\n  </a>\n  <button part=\"menu\">\n    <svg viewBox=\"0 0 24 24\">\n      <path d=\"M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z\" />\n    </svg>\n  </button>\n</nav>";

var style$c = ":host {\n  align-self: center;\n}\nsvg {\n  width: 1.5rem;\n  height: 1.5rem;\n}\nbutton {\n  border: 0;\n  background: transparent;\n}\nbutton > svg {\n  fill: #fff;\n}";

const noIcon$2 = 'M0 0h24v24H0V0zm2 2v20h20V2H2z';
let MdiNav$3 = class MdiNav extends HTMLElement {
    constructor() {
        super(...arguments);
        this.nav = noIcon$2;
    }
    render() {
    }
};
__decorate([
    Prop()
], MdiNav$3.prototype, "nav", void 0);
__decorate([
    Part()
], MdiNav$3.prototype, "$path", void 0);
MdiNav$3 = __decorate([
    Component({
        selector: 'mdi-nav',
        style: style$c,
        template: template$c
    })
], MdiNav$3);

var template$d = "<parent />\n<div part=\"popover\">\n  <div part=\"arrow\"></div>\n  <input part=\"search\" type=\"text\" />\n  <div part=\"scroll\">\n    <mdi-grid part=\"grid\" height=\"12rem\"></mdi-grid>\n  </div>\n</div>";

var style$d = "[part~=popover] {\n  background: #FFF;\n  padding: 0.5rem;\n  border-radius: 0.5rem;\n  box-shadow: 0 1px 14px rgba(0, 0, 0, 0.2);\n  border: 4px solid #4F8FF9;\n}\n\n[part~=search] {\n  border: 2px solid #453C4F;\n  border-radius: 0.125rem;\n  padding: 0.25rem 0.5rem;\n  font-size: 1rem;\n  width: 27.25rem;\n  margin-bottom: 0.25rem;\n  outline: none;\n}\n\n[part~=arrow],\n[part~=arrow]::before {\n  position: absolute;\n  width: 10px;\n  height: 10px;\n}\n\n[part~=arrow]::before {\n  content: '';\n  transform: rotate(45deg);\n  background: #FFF;\n}\n\n[part~=popover][data-popper-placement^='top'] > [part~=arrow] {\n  bottom: -5px;\n}\n[part~=popover][data-popper-placement^='top'] > [part~=arrow]::before {\n  border-bottom: 4px solid #4F8FF9;\n  border-right: 4px solid #4F8FF9;\n  border-bottom-right-radius: 0.25rem;\n}\n\n[part~=popover][data-popper-placement^='bottom'] > [part~=arrow] {\n  top: -10px;\n}\n[part~=popover][data-popper-placement^='bottom'] > [part~=arrow]::before {\n  border-top: 4px solid #4F8FF9;\n  border-left: 4px solid #4F8FF9;\n  border-top-left-radius: 0.25rem;\n}\n\n[part~=popover][data-popper-placement^='left'] > [part~=arrow] {\n  right: -5px;\n}\n\n[part~=popover][data-popper-placement^='right'] > [part~=arrow] {\n  left: -5px;\n}";

window.process = { env: {} };
let MdiPicker = class MdiPicker extends MdiButton$1 {
    constructor() {
        super(...arguments);
        this.icons = [];
        this.isVisible = false;
        this.search = '';
    }
    connectedCallback() {
        createPopper(this.$button, this.$popover, {
            placement: 'bottom-start',
            modifiers: [
                {
                    name: 'offset',
                    options: {
                        offset: [-4, 8],
                    },
                },
                {
                    name: 'arrow',
                    options: {
                        element: this.$arrow,
                        padding: 0,
                    },
                },
            ]
        });
        this.$popover.style.visibility = 'hidden';
        this.$button.addEventListener('click', () => {
            this.$popover.style.visibility = this.isVisible ? 'hidden' : 'visible';
            this.isVisible = !this.isVisible;
            if (this.isVisible) {
                this.$search.focus();
            }
        });
        this.$search.addEventListener('input', (e) => {
            this.search = e.target.value;
            this.render();
        });
    }
    render() {
        this.$grid.icons = this.icons.filter((icon) => {
            return icon.name.indexOf(this.search) !== -1;
        });
    }
};
__decorate([
    Prop()
], MdiPicker.prototype, "icons", void 0);
__decorate([
    Part()
], MdiPicker.prototype, "$popover", void 0);
__decorate([
    Part()
], MdiPicker.prototype, "$arrow", void 0);
__decorate([
    Part()
], MdiPicker.prototype, "$search", void 0);
__decorate([
    Part()
], MdiPicker.prototype, "$grid", void 0);
MdiPicker = __decorate([
    Component({
        selector: 'mdi-picker',
        style: style$d,
        template: template$d
    })
], MdiPicker);

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Built-in value references. */
var Symbol$1 = root.Symbol;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag$1 && symToStringTag$1 in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber$1(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce$2(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber$1(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber$1(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        timeWaiting = wait - timeSinceLastCall;

    return maxing
      ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/** Error message constants. */
var FUNC_ERROR_TEXT$1 = 'Expected a function';

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT$1);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce$2(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

var template$e = "<div part=\"scroll\">\n  <slot></slot>\n</div>";

var style$e = ":host {\n  display: block;\n}\n\ndiv {\n  transform: translateY(0);\n}";

let MdiScroll = class MdiScroll extends HTMLElement {
    constructor() {
        super(...arguments);
        this.height = 16;
        this.currentHeight = -1;
        this.columns = 10;
        this.size = 44;
        this.visible = false;
        this.y = -1;
        this.width = 0;
        this.resizeObserver = new ResizeObserver(throttle((entries) => {
            const { width } = entries[0].contentRect;
            this.columns = Math.floor(width / (this.size + 20));
            this.y = -1;
            this.width = width;
            this.calculateScroll();
        }, 100));
    }
    connectedCallback() {
        this.resizeObserver.observe(this.$scroll);
    }
    getInnerHeight() {
        let parentElement = this.parentElement;
        while (parentElement) {
            if (parentElement.style.overflow === 'auto') {
                return parentElement.getBoundingClientRect().height;
            }
            parentElement = parentElement.parentElement;
        }
        return window.innerHeight;
    }
    get isWindow() {
        return this.scrollElement === window;
    }
    getView() {
        const innerHeight = this.getInnerHeight();
        const container = this.getBoundingClientRect();
        const { y, height } = this.isWindow
            ? { y: container.y, height: container.height }
            : {
                y: container.y - this.scrollElement.getBoundingClientRect().y,
                height: container.height
            };
        const top = y < 0 ? -1 * y : 0;
        const calcY = height - top - innerHeight < 0
            ? height - innerHeight < 0 ? 0 : height - innerHeight
            : top;
        const calcHeight = height < innerHeight
            ? height
            : y + height - innerHeight > 0
                ? innerHeight
                : y + height - innerHeight;
        return {
            visible: (y < innerHeight && height + y > 0) || !this.isWindow,
            y: calcY,
            height: calcHeight < 0 ? innerHeight : calcHeight,
            atEnd: calcHeight < 0
        };
    }
    calculateScroll() {
        const { visible, y, height } = this.getView();
        if (visible) {
            this.$scroll.style.transform = `translateY(${y}px)`;
            this.$scroll.style.height = `${height}px`;
        }
        if (this.visible !== visible) {
            this.visible = visible;
            if (this.visible) {
                this.enterView();
            }
            else {
                this.leaveView();
            }
        }
        if (this.visible && this.y !== y) {
            this.dispatchEvent(new CustomEvent('calculate', {
                detail: {
                    offsetY: y,
                    viewWidth: this.width,
                    viewHeight: height,
                    height: this.height
                }
            }));
            this.y = y;
        }
    }
    enterView() {
        this.dispatchEvent(new CustomEvent('enter'));
    }
    leaveView() {
        this.dispatchEvent(new CustomEvent('leave'));
    }
    getParentElement() {
        let parentElement = this.parentElement;
        while (parentElement) {
            if (parentElement.style.overflow === 'auto') {
                return parentElement;
            }
            parentElement = parentElement.parentElement;
        }
        return window;
    }
    updateHeight() {
        this.scrollElement = this.getParentElement();
        this.scrollElement.addEventListener('scroll', throttle(() => {
            this.calculateScroll();
        }, 100));
        this.style.height = `${this.currentHeight}px`;
        this.y = -1;
        this.calculateScroll();
    }
    render() {
        const height = parseInt(this.height, 10);
        if (this.currentHeight !== height) {
            this.currentHeight = height;
            this.updateHeight();
        }
    }
};
__decorate([
    Prop()
], MdiScroll.prototype, "height", void 0);
__decorate([
    Part()
], MdiScroll.prototype, "$scroll", void 0);
__decorate([
    Part()
], MdiScroll.prototype, "$text", void 0);
MdiScroll = __decorate([
    Component({
        selector: 'mdi-scroll',
        style: style$e,
        template: template$e
    })
], MdiScroll);

function removeDiacritics(str) {
    var defaultDiacriticsRemovalMap = [
        { 'base': 'A', 'letters': /[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g },
        { 'base': 'AA', 'letters': /[\uA732]/g },
        { 'base': 'AE', 'letters': /[\u00C6\u01FC\u01E2]/g },
        { 'base': 'AO', 'letters': /[\uA734]/g },
        { 'base': 'AU', 'letters': /[\uA736]/g },
        { 'base': 'AV', 'letters': /[\uA738\uA73A]/g },
        { 'base': 'AY', 'letters': /[\uA73C]/g },
        { 'base': 'B', 'letters': /[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g },
        { 'base': 'C', 'letters': /[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g },
        { 'base': 'D', 'letters': /[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g },
        { 'base': 'DZ', 'letters': /[\u01F1\u01C4]/g },
        { 'base': 'Dz', 'letters': /[\u01F2\u01C5]/g },
        { 'base': 'E', 'letters': /[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g },
        { 'base': 'F', 'letters': /[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g },
        { 'base': 'G', 'letters': /[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g },
        { 'base': 'H', 'letters': /[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g },
        { 'base': 'I', 'letters': /[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g },
        { 'base': 'J', 'letters': /[\u004A\u24BF\uFF2A\u0134\u0248]/g },
        { 'base': 'K', 'letters': /[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g },
        { 'base': 'L', 'letters': /[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g },
        { 'base': 'LJ', 'letters': /[\u01C7]/g },
        { 'base': 'Lj', 'letters': /[\u01C8]/g },
        { 'base': 'M', 'letters': /[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g },
        { 'base': 'N', 'letters': /[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g },
        { 'base': 'NJ', 'letters': /[\u01CA]/g },
        { 'base': 'Nj', 'letters': /[\u01CB]/g },
        { 'base': 'O', 'letters': /[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g },
        { 'base': 'OI', 'letters': /[\u01A2]/g },
        { 'base': 'OO', 'letters': /[\uA74E]/g },
        { 'base': 'OU', 'letters': /[\u0222]/g },
        { 'base': 'P', 'letters': /[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g },
        { 'base': 'Q', 'letters': /[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g },
        { 'base': 'R', 'letters': /[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g },
        { 'base': 'S', 'letters': /[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g },
        { 'base': 'T', 'letters': /[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g },
        { 'base': 'TZ', 'letters': /[\uA728]/g },
        { 'base': 'U', 'letters': /[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g },
        { 'base': 'V', 'letters': /[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g },
        { 'base': 'VY', 'letters': /[\uA760]/g },
        { 'base': 'W', 'letters': /[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g },
        { 'base': 'X', 'letters': /[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g },
        { 'base': 'Y', 'letters': /[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g },
        { 'base': 'Z', 'letters': /[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g },
        { 'base': 'a', 'letters': /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g },
        { 'base': 'aa', 'letters': /[\uA733]/g },
        { 'base': 'ae', 'letters': /[\u00E6\u01FD\u01E3]/g },
        { 'base': 'ao', 'letters': /[\uA735]/g },
        { 'base': 'au', 'letters': /[\uA737]/g },
        { 'base': 'av', 'letters': /[\uA739\uA73B]/g },
        { 'base': 'ay', 'letters': /[\uA73D]/g },
        { 'base': 'b', 'letters': /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g },
        { 'base': 'c', 'letters': /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g },
        { 'base': 'd', 'letters': /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g },
        { 'base': 'dz', 'letters': /[\u01F3\u01C6]/g },
        { 'base': 'e', 'letters': /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g },
        { 'base': 'f', 'letters': /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g },
        { 'base': 'g', 'letters': /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g },
        { 'base': 'h', 'letters': /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g },
        { 'base': 'hv', 'letters': /[\u0195]/g },
        { 'base': 'i', 'letters': /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g },
        { 'base': 'j', 'letters': /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g },
        { 'base': 'k', 'letters': /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g },
        { 'base': 'l', 'letters': /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g },
        { 'base': 'lj', 'letters': /[\u01C9]/g },
        { 'base': 'm', 'letters': /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g },
        { 'base': 'n', 'letters': /[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g },
        { 'base': 'nj', 'letters': /[\u01CC]/g },
        { 'base': 'o', 'letters': /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g },
        { 'base': 'oi', 'letters': /[\u01A3]/g },
        { 'base': 'ou', 'letters': /[\u0223]/g },
        { 'base': 'oo', 'letters': /[\uA74F]/g },
        { 'base': 'p', 'letters': /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g },
        { 'base': 'q', 'letters': /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g },
        { 'base': 'r', 'letters': /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g },
        { 'base': 's', 'letters': /[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g },
        { 'base': 't', 'letters': /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g },
        { 'base': 'tz', 'letters': /[\uA729]/g },
        { 'base': 'u', 'letters': /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g },
        { 'base': 'v', 'letters': /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g },
        { 'base': 'vy', 'letters': /[\uA761]/g },
        { 'base': 'w', 'letters': /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g },
        { 'base': 'x', 'letters': /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g },
        { 'base': 'y', 'letters': /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g },
        { 'base': 'z', 'letters': /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g }
    ];
    for (var i = 0; i < defaultDiacriticsRemovalMap.length; i++) {
        str = str.replace(defaultDiacriticsRemovalMap[i].letters, defaultDiacriticsRemovalMap[i].base);
    }
    return str;
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
function exactMatch(icons, term) {
    var _a;
    for (var i = 0, c = icons.length; i < c; i++) {
        if (((_a = icons[i].name) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === term) {
            icons.unshift(icons.splice(i, 1)[0]);
            return icons;
        }
    }
    return icons;
}
function sanitizeTerm(term) {
    return removeDiacritics(term.trim().toLowerCase()).replace(/(\w) (\w)/g, "$1-$2");
}
function iconFilter(icons, term, limit = 5) {
    term = sanitizeTerm(term);
    const iconsByName = filter(icons, (icon) => {
        var _a;
        return ((_a = icon.name) === null || _a === void 0 ? void 0 : _a.toLowerCase().indexOf(term)) === 0;
    }, limit);
    const list = Array.from(iconsByName);
    let skip = list.map(icon => icon.id);
    if (list.length < limit) {
        var more = filter(icons, (icon) => {
            var _a;
            if (skip.includes(icon.id)) {
                return false;
            }
            return ((_a = icon.name) === null || _a === void 0 ? void 0 : _a.toLowerCase().indexOf(term)) !== -1;
        }, limit - list.length);
        var more2 = Array.from(more);
        more2.forEach(icon => list.push(icon));
    }
    skip = list.map(icon => icon.id);
    if (list.length < limit) {
        var iconsByAliases = filter(icons, (icon) => {
            if (skip.includes(icon.id)) {
                return false;
            }
            for (var i = 0, c = icon.aliases.length; i < c; i++) {
                if (icon.aliases[i].name == null) {
                    console.error(`Invalid alias in ${icon.name}`);
                    return false;
                }
                if (icon.aliases[i].name.indexOf(term) !== -1) {
                    icon.aliases[i].match = true;
                    return true;
                }
            }
            return false;
        }, limit - list.length);
        const list2 = Array.from(iconsByAliases);
        list2.forEach(icon => list.push(icon));
    }
    return exactMatch(list, term);
}

var template$f = "<div part=\"grid\">\n  <input part=\"input\" type=\"text\" />\n  <svg viewBox=\"0 0 24 24\"><path d=\"M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z\" /></svg>\n  <div part=\"menu\">\n    <ul part=\"list\"></ul>\n    <section part=\"empty\">\n      <strong>No Results</strong>\n      <a part=\"reqIcon\" href=\"https://github.com/Templarian/MaterialDesign/issues/new?labels=Icon+Request&template=1_icon_request.md&title=\" target=\"_blank\">\n        Request an Icon\n        <svg viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M10.59,13.41C11,13.8 11,14.44 10.59,14.83C10.2,15.22 9.56,15.22 9.17,14.83C7.22,12.88 7.22,9.71 9.17,7.76V7.76L12.71,4.22C14.66,2.27 17.83,2.27 19.78,4.22C21.73,6.17 21.73,9.34 19.78,11.29L18.29,12.78C18.3,11.96 18.17,11.14 17.89,10.36L18.36,9.88C19.54,8.71 19.54,6.81 18.36,5.64C17.19,4.46 15.29,4.46 14.12,5.64L10.59,9.17C9.41,10.34 9.41,12.24 10.59,13.41M13.41,9.17C13.8,8.78 14.44,8.78 14.83,9.17C16.78,11.12 16.78,14.29 14.83,16.24V16.24L11.29,19.78C9.34,21.73 6.17,21.73 4.22,19.78C2.27,17.83 2.27,14.66 4.22,12.71L5.71,11.22C5.7,12.04 5.83,12.86 6.11,13.65L5.64,14.12C4.46,15.29 4.46,17.19 5.64,18.36C6.81,19.54 8.71,19.54 9.88,18.36L13.41,14.83C14.59,13.66 14.59,11.76 13.41,10.59C13,10.2 13,9.56 13.41,9.17Z\" /></svg>\n      </a>\n      <a part=\"reqDoc\" href=\"https://github.com/Templarian/MaterialDesign/issues/new?labels=Documentation&template=6_doc_guide_request.md&title=\" target=\"_blank\">\n        Request Documentation\n        <svg viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M10.59,13.41C11,13.8 11,14.44 10.59,14.83C10.2,15.22 9.56,15.22 9.17,14.83C7.22,12.88 7.22,9.71 9.17,7.76V7.76L12.71,4.22C14.66,2.27 17.83,2.27 19.78,4.22C21.73,6.17 21.73,9.34 19.78,11.29L18.29,12.78C18.3,11.96 18.17,11.14 17.89,10.36L18.36,9.88C19.54,8.71 19.54,6.81 18.36,5.64C17.19,4.46 15.29,4.46 14.12,5.64L10.59,9.17C9.41,10.34 9.41,12.24 10.59,13.41M13.41,9.17C13.8,8.78 14.44,8.78 14.83,9.17C16.78,11.12 16.78,14.29 14.83,16.24V16.24L11.29,19.78C9.34,21.73 6.17,21.73 4.22,19.78C2.27,17.83 2.27,14.66 4.22,12.71L5.71,11.22C5.7,12.04 5.83,12.86 6.11,13.65L5.64,14.12C4.46,15.29 4.46,17.19 5.64,18.36C6.81,19.54 8.71,19.54 9.88,18.36L13.41,14.83C14.59,13.66 14.59,11.76 13.41,10.59C13,10.2 13,9.56 13.41,9.17Z\" /></svg>\n      </a>\n    </section>\n  </div>\n</div>";

var style$f = ":host {\n  align-self: center;\n  width: 10rem;\n}\n\ndiv {\n  display: grid;\n  grid-template-columns: 1fr 0;\n  grid-template-rows: 1fr 0;\n}\ninput {\n  grid-row: 1;\n  grid-column: 1;\n  border-radius: 0.25rem;\n  border: 0;\n  padding: 0.25rem 0.5rem;\n  font-size: 1rem;\n  outline: none;\n  width: calc(100% - 1rem);\n}\n.active input + svg path {\n  fill: #453C4F;\n}\nsvg {\n  grid-row: 1;\n  grid-column: 2;\n  width: 1.5rem;\n  height: 1.5rem;\n  justify-self: right;\n  margin-right: 0.25rem;\n  pointer-events: none;\n  align-self: center;\n}\nsvg > path {\n  transition: fill 0.3s ease-in-out;\n}\n[part=menu] {\n  display: none;\n  background: #FFF;\n  grid-row: 2;\n  grid-column: 1 / span 2;\n  z-index: 1;\n}\nul {\n  list-style: none;\n  display: flex;\n  flex-direction: column;\n  padding: 0;\n  margin: 0;\n  border-radius: 0.25rem;\n  box-shadow: 0 0.125rem 0.75rem rgba(0, 0, 0, 0.4);\n}\nul > li {\n  color: #222;\n}\nul > li > a {\n  display: flex;\n  padding: 0.25rem 0.5rem;\n  background: #FFF;\n  border-left: 1px solid #DDD;\n  border-right: 1px solid #DDD;\n}\nul > li > a:hover,\nul > li > a:active,\nul > li > a:focus {\n  background: #DAF4FB;\n}\nul > li.item:first-child > a {\n  border-top: 1px solid #DDD;\n  border-bottom: 1px solid #DDD;\n  border-radius: 0.25rem 0.25rem 0 0;\n}\nul > li.item:not(:first-child) > a {\n  border-bottom: 1px solid #DDD;\n}\nul > li.item:last-child > a {\n  border-radius: 0 0 0.25rem 0.25rem;\n}\nul > li > a {\n  text-decoration: none;\n  color: #222;\n}\nul > li > a strong {\n  color: #453C4F;\n}\n.section {\n  color: #FFF;\n  padding: 0.25rem 0.5rem;\n  font-weight: bold;\n  background: #453C4F;\n  border-radius: 0.25rem 0.25rem 0 0;\n  cursor: default;\n}\n.section + li a {\n  border-radius: 0;\n}\n\nli + .section {\n  border-radius: 0;\n}\n\n.type {\n  background-color: #453C4F;\n  border-radius: 0.25rem;\n  font-size: 0.75rem;\n  color: #fff;\n  padding-left: 0.25rem;\n  padding-right: 0.25rem;\n  margin: 0.125rem 0 0.125rem 0.25rem;\n}\n\n.icon {\n  background-color: #453C4F;\n  padding-left: 0.25rem;\n  padding-right: 0.25rem;\n}\n.icon.first > a {\n  border-top-left-radius: 0.25rem;\n  border-top-right-radius: 0.25rem;\n}\n.icon.last {\n  padding-bottom: 0.25rem;\n  border-bottom-left-radius: 0.25rem;\n  border-bottom-right-radius: 0.25rem;\n}\n.icon.last > a {\n  border-radius: 0 0 0.25rem 0.25rem;\n}\n.icon svg {\n  color: #453C4F;\n  margin-right: 0.345rem;\n  margin-left: -0.25rem;\n}\n\n.all {\n  background-color: #453C4F;\n  padding: 0 0.25rem 0.25rem 0.25rem;\n  border-radius: 0 0 0.25rem 0.25rem;\n}\n\n.all a {\n  border-radius: 0.25rem;\n}\n\n[part~=empty] {\n  background: #453C4F;\n  border-radius: 0.25rem;\n  padding: 0.25rem;\n  box-shadow: 0 0.125rem 0.75rem rgba(0, 0, 0, 0.4);\n}\n[part~=empty] strong {\n  color: #fff;\n  padding: 0 0.25rem;\n}\n[part~=empty] a {\n  display: block;\n  background: #fff;\n  color: #453C4F;\n  text-decoration: none;\n  padding: 0.25rem 0.5rem;\n  border-radius: 0.25rem;\n  margin-top: 0.25rem;\n}\n[part~=empty] a:hover,\n[part~=empty] a:active,\n[part~=empty] a:focus {\n  background: #DAF4FB;\n}\n[part~=empty] a svg {\n  vertical-align: middle;\n  width: 1.5rem;\n  height: 1.5rem;\n  float: right;\n  margin: -0.125rem -0.25rem 0 0;\n}\n\n.hide {\n  display: none;\n}";

let MdiSearch = class MdiSearch extends HTMLElement {
    constructor() {
        super(...arguments);
        this.items = [];
        this.icons = [];
        this.isOpen = false;
        this.isOver = false;
        this.term = '';
        this.keyIndex = -1;
        this.anchors = [];
    }
    connectedCallback() {
        this.$input.addEventListener('input', this.handleInput.bind(this));
        this.$input.addEventListener('focus', this.handleFocus.bind(this));
        this.$input.addEventListener('blur', this.handleBlur.bind(this));
        this.addEventListener('keydown', this.keydown.bind(this));
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
        this.keyIndex = -1;
        this.updateList();
        this.isOpen = true;
        this.$menu.style.display = 'block';
        this.$grid.classList.add('active');
    }
    handleBlur() {
        if (!this.isOver) {
            this.isOpen = false;
            this.$menu.style.display = 'none';
            this.$grid.classList.remove('active');
            this.keyIndex -= 1;
        }
    }
    keydown(e) {
        if (e.which === 40) {
            this.keyIndex += 1;
            this.setActive();
            e.preventDefault();
            e.stopPropagation();
        }
        else if (e.which === 38) {
            this.keyIndex -= 1;
            this.setActive();
            e.preventDefault();
            e.stopPropagation();
        }
    }
    setActive() {
        if (this.keyIndex === -2) {
            this.keyIndex = this.anchors.length - 1;
        }
        if (this.keyIndex === this.anchors.length) {
            this.keyIndex = -1;
        }
        if (this.keyIndex === -1) {
            this.$input.focus();
            this.isOver = false;
        }
        else {
            this.isOver = true;
            this.anchors[this.keyIndex].focus();
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
        const span = document.createElement('span');
        const term = sanitizeTerm(this.term);
        if (this.term === '') {
            span.innerText = text;
            return span;
        }
        while (normalized) {
            var index = normalized.toLowerCase().indexOf(term);
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
                strong.innerText = normalized.substr(index, term.length);
                span.appendChild(strong);
                normalized = normalized.substr(index + term.length, normalized.length);
            }
        }
        return span;
    }
    clearList() {
        while (this.$list.firstChild) {
            this.$list.removeChild(this.$list.firstChild);
        }
        this.anchors = [];
    }
    updateList() {
        this.clearList();
        let empty = false;
        const termRegex = new RegExp(this.term, 'i');
        const filtered = this.items.filter((item) => item.name.match(termRegex));
        filtered.forEach((item, i) => {
            var li = document.createElement('li');
            li.classList.add('item');
            li.classList.toggle('first', i === 0);
            li.classList.toggle('last', i === filtered.length - 1);
            var a = document.createElement('a');
            a.href = item.url;
            var text = this.highlight(item.name);
            a.appendChild(text);
            var type = document.createElement('span');
            type.innerText = item.type;
            type.classList.add('type');
            a.appendChild(type);
            li.appendChild(a);
            this.$list.appendChild(li);
            this.anchors.push(a);
            empty = true;
        });
        if (this.term !== '') {
            const icons = iconFilter(this.icons, this.term, 5);
            if (icons.length) {
                var li = document.createElement('li');
                li.innerText = 'Icons';
                li.classList.add('section');
                this.$list.appendChild(li);
            }
            icons.forEach((icon, i) => {
                var li = document.createElement('li');
                li.classList.add('icon');
                li.classList.toggle('first', i === 0);
                li.classList.toggle('last', i === icons.length - 1);
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
                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('viewBox', '0 0 24 24');
                svg.setAttribute('fill', 'currentColor');
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', icon.data);
                svg.appendChild(path);
                a.appendChild(svg);
                a.appendChild(text);
                li.appendChild(a);
                this.anchors.push(a);
                this.$list.appendChild(li);
            });
            if (icons.length === 5) {
                var li = document.createElement('li');
                li.classList.add('all');
                var a = document.createElement('a');
                a.href = `/icons?search=${this.term}`;
                a.appendChild(document.createTextNode('All results for "'));
                var strong = document.createElement('strong');
                strong.innerText = this.term;
                a.appendChild(strong);
                a.appendChild(document.createTextNode('"'));
                li.appendChild(a);
                this.anchors.push(a);
                this.$list.appendChild(li);
            }
            if (icons.length > 0) {
                empty = true;
            }
        }
        if (!empty) {
            this.anchors.push(this.$reqIcon);
            this.anchors.push(this.$reqDoc);
        }
        this.$empty.classList.toggle('hide', empty);
    }
};
__decorate([
    Prop()
], MdiSearch.prototype, "items", void 0);
__decorate([
    Prop()
], MdiSearch.prototype, "icons", void 0);
__decorate([
    Part()
], MdiSearch.prototype, "$grid", void 0);
__decorate([
    Part()
], MdiSearch.prototype, "$menu", void 0);
__decorate([
    Part()
], MdiSearch.prototype, "$input", void 0);
__decorate([
    Part()
], MdiSearch.prototype, "$list", void 0);
__decorate([
    Part()
], MdiSearch.prototype, "$empty", void 0);
__decorate([
    Part()
], MdiSearch.prototype, "$reqIcon", void 0);
__decorate([
    Part()
], MdiSearch.prototype, "$reqDoc", void 0);
MdiSearch = __decorate([
    Component({
        selector: 'mdi-search',
        style: style$f,
        template: template$f
    })
], MdiSearch);

var template$g = "<button part=\"button\">\n  <span part=\"loading\">\n    <svg part=\"loadingIcon\" viewBox=\"0 0 24 24\">\n      <path fill=\"currentColor\" d=\"M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z\" />\n    </svg>\n  </span>\n  <span part=\"message\"></span>\n  <span part=\"close\">\n    <svg part=\"closeIcon\" viewBox=\"0 0 24 24\">\n      <path fill=\"currentColor\" d=\"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z\" />\n    </svg>\n  </span>\n</button>";

var style$g = "[part~=button] {\n  display: flex;\n  background: #737E9E;\n  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.4);\n  border-radius: 0.25rem;\n  border: 1px solid #737E9E;\n  padding: 0.5rem 0.5rem 0.5rem 0.75rem;\n  color: #FFF;\n  align-items: center;\n  outline: 0;\n  transition: border-color 0.1s ease-in;\n  margin-bottom: 0.5rem;\n  max-width: 18rem;\n  font-size: 1rem;\n  align-items: center;\n}\n\n[part~=loading] {\n  height: 1.5rem;\n  margin: -0.25rem 0.5rem -0.25rem -0.25rem;\n}\n\n[part~=button]:hover {\n  border: 1px solid rgba(255, 255, 255, 0.75);\n}\n\n[part~=close] {\n  height: 1rem;\n}\n\n[part~=closeIcon] {\n  width: 1rem;\n  height: 1rem;\n}\n\n[part~=loadingIcon] {\n  animation: spin 2s infinite linear;\n  width: 1.5rem;\n  height: 1.5rem;\n}\n\n@keyframes progress {\n  from {\n    width: 0;\n  }\n  to {\n    width: 20rem;\n  }\n}\n\n@keyframes spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(359deg);\n  }\n}\n\n[part~=closeIcon] {\n  margin-left: 0.5rem;\n  color: rgba(255, 255, 255, 0.5);\n  transition: color 0.1s ease-in;\n}\n\n[part~=button]:hover [part~=closeIcon] {\n  color: #fff;\n}\n\n.hide {\n  display: none;\n}\n\n/* Error */\n\n[part~=button].error {\n  color: #721c24;\n  background-color: #f8d7da;\n  border-color: #f5c6cb;\n}\n\n[part~=button].error [part~=closeIcon] {\n  color: rgba(114, 28, 36, 0.6);\n}\n\n[part~=button].error:hover {\n  border-color: #721c24;\n}\n\n[part~=button].error:hover [part~=closeIcon] {\n  color: #721c24;\n}\n\n/* Warning */\n\n[part~=button].warning {\n  color: #856404;\n  background-color: #fff3cd;\n  border-color: #ffeeba;\n}\n\n[part~=button].warning [part~=closeIcon] {\n  color: rgba(133, 101, 4, 0.6);\n}\n\n[part~=button].warning:hover {\n  border-color: #856404;\n}\n\n[part~=button].warning:hover [part~=closeIcon] {\n  color: #856404;\n}";

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
        style: style$g,
        template: template$g
    })
], MdiToast);

var template$h = "<div part=\"container\"></div>";

var style$h = "[part~=container] {\n  display: inline-flex;\n  flex-direction: column;\n  align-items: flex-end;\n  position: fixed;\n  top: 1rem;\n  right: 1rem;\n}";

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
        style: style$h,
        template: template$h
    })
], MdiToasts);
