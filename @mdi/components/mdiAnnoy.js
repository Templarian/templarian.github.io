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

    var style$1 = ":host {\n  display: block;\n  font-family: var(--mdi-font-family);\n}\n\n[part~=list] {\n  width: 12rem;\n  font-size: 1rem;\n  transition: 0.1s margin-bottom ease-in;\n}\n\n[part~=list] > div {\n  display: none;\n}\n\n[part~=list] > div.show {\n  display: grid;\n  padding: 0.5rem;\n  border: 1px solid #fff;\n  border-radius: 0.25rem;\n  background: #fff;\n  box-shadow: 0 1px 2rem rgba(0, 0, 0, 0.3);\n}\n\n:host(.footer) {\n  margin-bottom: 4rem;\n}\n\n[part~=close] {\n  position: relative;\n  left: 11.25rem;\n  width: 1.5rem;\n  height: 1.5rem;\n  border: 1px solid #fff;\n  border-radius: 50%;\n  background: #fff;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  top: 0.75rem;\n  box-shadow: 0 1px 0.25rem rgba(0, 0, 0, 0.4);\n  padding: 0;\n  color: rgba(69, 60, 79, 0.8);\n  outline: none;\n}\n\n[part~=close]:hover {\n  color: #453C4F;\n  border-color: rgba(69, 60, 79, 0.6);\n}\n\n[part~=close]:active {\n  box-shadow: 0 1px 0.25rem rgba(0, 0, 0, 0.2);\n  border-color: rgba(69, 60, 79, 0.9);\n}\n\n[part~=close] svg {\n  width: 1rem;\n  height: 1rem;\n}\n\n[part=extension] {\n  display: grid;\n  grid-template-rows: auto auto;\n  grid-template-columns: 1fr 1fr;\n  color: #453C4F;\n}\n\n[part=extension] a.chrome {\n  display: flex;\n  grid-row: 1;\n  grid-column: 1;\n  color: #453C4F;\n  border: 1px solid #453C4F;\n  border-radius: 0.25rem;\n  padding: 0.4rem 0.9rem;\n  justify-self: center;\n  text-align: center;\n  margin: 0.25rem;\n}\n\n[part=extension] a.firefox {\n  display: flex;\n  grid-row: 1;\n  grid-column: 2;\n  color: #453C4F;\n  border: 1px solid #453C4F;\n  border-radius: 0.25rem;\n  padding: 0.4rem 0.9rem;\n  justify-self: center;\n  text-align: center;\n  margin: 0.25rem;\n}\n\n[part=extension] a.chrome:hover,\n[part=extension] a.firefox:hover {\n  color: #fff;\n  background: #453C4F;\n}\n\n[part=extension] a svg {\n  width: 2rem;\n  height: 2rem;\n}\n\n[part=extension] div.text {\n  grid-row: 2;\n  grid-column: 1 / span 2;\n  text-align: center;\n  margin-top: 0.25rem;\n  font-weight: bold;\n  cursor: default;\n}\n\n[part=contextMenu] {\n  color: #453C4F;\n}\n\n[part=contextMenu] div.text {\n  text-align: center;\n  margin-top: 0.25rem;\n  font-weight: bold;\n  cursor: default;\n}\n\n[part=react] code {\n  padding: 0.5rem;\n  background: #222;\n  border-radius: 0.25rem;\n  color: #FFF;\n  font-size: 12px;\n  text-align: center;\n  margin: 0.25rem;\n}\n\n[part=react] a {\n  display: grid;\n  position: relative;\n  grid-row: 1;\n  grid-column: 1;\n  grid-template-rows: auto 2rem;\n  grid-template-columns: auto;\n  color: #453C4F;\n  border: 1px solid #453C4F;\n  border-radius: 0.25rem;\n  padding: 0.5rem 0 0 0;\n  margin: 0.25rem;\n  text-decoration: none;\n}\n\n[part=react] a:hover,\n[part=react] a:hover {\n  color: #fff;\n  background: #453C4F;\n}\n\n[part=react] a svg.link {\n  width: 1.5rem;\n  height: 1.5rem;\n  position: absolute;\n  bottom: 0.5rem;\n  right: 0.5rem;\n}\n\n[part=react] a svg.file {\n  width: 4rem;\n  height: 4rem;\n  grid-row: 1;\n  grid-column: 1;\n  justify-self: center;\n}\n\n[part=react] a .link-text {\n  grid-row: 2;\n  grid-column: 1;\n  text-align: center;\n  font-weight: bold;\n}\n\n/* Upgrade */\n\n[part=upgrade] {\n  grid-template-rows: auto auto;\n  color: #453C4F;\n}\n\n[part=upgrade] div.text {\n  grid-row: 2;\n  grid-column: 1;\n  text-align: center;\n  margin-top: 0.25rem;\n  font-weight: bold;\n  cursor: default;\n}\n\n[part=upgrade] a {\n  display: grid;\n  position: relative;\n  grid-row: 1;\n  grid-column: 1;\n  grid-template-rows: auto 2rem;\n  grid-template-columns: auto;\n  color: #453C4F;\n  border: 1px solid #453C4F;\n  border-radius: 0.25rem;\n  padding: 0.5rem 0 0 0;\n  margin: 0.25rem;\n  text-decoration: none;\n}\n\n[part=upgrade] a:hover,\n[part=upgrade] a:hover {\n  color: #fff;\n  background: #453C4F;\n}\n\n[part=upgrade] a svg.link {\n  width: 1.5rem;\n  height: 1.5rem;\n  position: absolute;\n  bottom: 0.5rem;\n  right: 0.5rem;\n}\n\n[part=upgrade] a svg.file {\n  width: 4rem;\n  height: 4rem;\n  grid-row: 1;\n  grid-column: 1;\n  justify-self: center;\n}\n\n[part=upgrade] a .link-text {\n  grid-row: 2;\n  grid-column: 1;\n  text-align: center;\n  font-weight: bold;\n}";

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
            window.addEventListener('scroll', (event) => {
                var d = document.documentElement;
                var offset = d.scrollTop + window.innerHeight;
                var height = d.offsetHeight;
                this.classList.toggle('footer', offset >= height - (4 * 16));
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
    var MdiAnnoy$1 = MdiAnnoy;

    return MdiAnnoy$1;

}());
//# sourceMappingURL=mdiAnnoy.js.map
