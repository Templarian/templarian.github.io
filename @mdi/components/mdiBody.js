var mdiBody = (function () {
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

    var template$1 = "<svg class=\"top\" viewBox=\"0 0 1000 20\">\n  <path fill=\"#F9D9A0\" fill-opacity=\"1\" stroke-linejoin=\"round\" d=\"M 1000,10L -4.35511e-005,20L -4.35511e-005,1.90735e-006L 1000,1.90735e-006L 1000,10 Z \"/>\n</svg>\n<slot></slot>\n<svg class=\"bottom\" viewBox=\"0 0 1000 20\">\n\t<path fill=\"#F9D9A0\" fill-opacity=\"1\" stroke-linejoin=\"round\" d=\"M 0,10L 1000,0L 1000,20L 0,20L 0,10 Z \"/>\n\t<linearGradient id=\"SVGID_Fill1_\" gradientUnits=\"objectBoundingBox\" x1=\"0.00104167\" y1=\"0.499994\" x2=\"0.500527\" y2=\"0.499994\" gradientTransform=\"rotate(63.411339 0.001042 0.499994)\">\n\t\t<stop offset=\"0\" stop-color=\"#000000\" stop-opacity=\"0.34902\"/>\n\t\t<stop offset=\"0.10559\" stop-color=\"#000000\" stop-opacity=\"0.301961\"/>\n\t\t<stop offset=\"0.195652\" stop-color=\"#000000\" stop-opacity=\"0.2\"/>\n\t\t<stop offset=\"0.304348\" stop-color=\"#000000\" stop-opacity=\"0.129412\"/>\n\t\t<stop offset=\"0.403727\" stop-color=\"#000000\" stop-opacity=\"0.101961\"/>\n\t\t<stop offset=\"0.503106\" stop-color=\"#000000\" stop-opacity=\"0.0509804\"/>\n\t\t<stop offset=\"0.596273\" stop-color=\"#000000\" stop-opacity=\"0.0509804\"/>\n\t\t<stop offset=\"0.704969\" stop-color=\"#000000\" stop-opacity=\"0.0156863\"/>\n\t\t<stop offset=\"1\" stop-color=\"#000000\" stop-opacity=\"0\"/>\n\t</linearGradient>\n\t<path fill=\"url(#SVGID_Fill1_)\" stroke-linejoin=\"round\" d=\"M -1.33594e-021,10L 1000,-0.0206203L 1000,9.97938L 1.33595e-021,20L -1.33594e-021,10 Z \"/>\n</svg>";

    var style$1 = ":host {\n  display: block;\n  background: linear-gradient(135deg, #ffffff 0%,#f6ede4 100%);\n}\n.top {\n  width: 100%;\n  vertical-align: top;\n}\n.bottom {\n  width: 100%;\n  vertical-align: bottom;\n}";

    let MdiBody = class MdiBody extends HTMLElement {
    };
    MdiBody = __decorate([
        Component({
            selector: 'mdi-body',
            style: style$1,
            template: template$1
        })
    ], MdiBody);
    var MdiBody$1 = MdiBody;

    return MdiBody$1;

}());
//# sourceMappingURL=mdiBody.js.map
