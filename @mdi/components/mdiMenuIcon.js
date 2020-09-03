var mdiMenuIcon = (function () {
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

    var template$1 = "<div part=\"contextMenu\">\n  <a part=\"newTab\" href=\"\">Open icon in New Tab</a>\n  <button part=\"copyIconName\">Copy Icon Name</button>\n  <div class=\"section\">Download PNG</div>\n  <div class=\"group\">\n    <button part=\"png24\">24</button>\n    <button part=\"png36\">36</button>\n    <button part=\"png48\">48</button>\n    <button part=\"png96\">96</button>\n  </div>\n  <div class=\"row\" style=\"margin-top: 0.25rem;\">\n    <div class=\"group\">\n      <button part=\"pngBlack\"><span class=\"black\"></span></button>\n      <button part=\"pngWhite\"><span class=\"white\"></span></button>\n      <button part=\"pngColor\">\n        <svg viewBox=\"0 0 24 24\">\n          <path fill=\"#fff\" d=\"M19.35,11.72L17.22,13.85L15.81,12.43L8.1,20.14L3.5,22L2,20.5L3.86,15.9L11.57,8.19L10.15,6.78L12.28,4.65L19.35,11.72M16.76,3C17.93,1.83 19.83,1.83 21,3C22.17,4.17 22.17,6.07 21,7.24L19.08,9.16L14.84,4.92L16.76,3M5.56,17.03L4.5,19.5L6.97,18.44L14.4,11L13,9.6L5.56,17.03Z\"/>\n          <path fill=\"currentColor\" d=\"M12.97 8L15.8 10.85L7.67 19L3.71 20.68L3.15 20.11L4.84 16.15L12.97 8Z\"/>\n        </svg>\n      </button>\n    </div>\n    <div class=\"group\">\n      <button part=\"pngDownload\" class=\"download\">\n        PNG\n        <svg viewBox=\"0 0 24 24\">\n          <path fill=\"currentColor\" d=\"M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z\"/>\n        </svg>\n      </button>\n    </div>\n  </div>\n  <div class=\"section\">SVG</div>\n  <div class=\"row\" style=\"margin-bottom: 0.25rem;\">\n    <div class=\"group\">\n      <button part=\"svgBlack\" class=\"active\"><span class=\"black\"></span></button>\n      <button part=\"svgWhite\"><span class=\"white\"></span></button>\n      <button part=\"svgColor\">\n        <svg viewBox=\"0 0 24 24\">\n          <path fill=\"#fff\" d=\"M19.35,11.72L17.22,13.85L15.81,12.43L8.1,20.14L3.5,22L2,20.5L3.86,15.9L11.57,8.19L10.15,6.78L12.28,4.65L19.35,11.72M16.76,3C17.93,1.83 19.83,1.83 21,3C22.17,4.17 22.17,6.07 21,7.24L19.08,9.16L14.84,4.92L16.76,3M5.56,17.03L4.5,19.5L6.97,18.44L14.4,11L13,9.6L5.56,17.03Z\"/>\n          <path fill=\"currentColor\" d=\"M12.97 8L15.8 10.85L7.67 19L3.71 20.68L3.15 20.11L4.84 16.15L12.97 8Z\"/>\n        </svg>\n      </button>\n    </div>\n    <div class=\"group\">\n      <button part=\"svgDownload\" class=\"download\">\n        SVG\n        <svg viewBox=\"0 0 24 24\">\n          <path fill=\"currentColor\" d=\"M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z\"/>\n        </svg>\n      </button>\n    </div>\n  </div>\n  <button part=\"copySvgInline\">Copy HTML SVG Inline</button>\n  <button part=\"copySvgFile\">Copy SVG File Contents</button>\n  <button part=\"copySvgPath\">Copy SVG Path Data</button>\n  <div class=\"section\">Desktop Font</div>\n  <button part=\"copyUnicode\">Copy Unicode Character</button>\n  <button part=\"copyCodepoint\">Copy Codepoint</button>\n  <div class=\"divider\"></div>\n  <button part=\"copyPreview\">Copy GitHub Preview</button>\n  <div part=\"color\">\n    <mdi-input-hex-rgb part=\"colorHexRgb\"></mdi-input-hex-rgb>\n    <mdi-color part=\"colorPicker\"></mdi-color>\n  </div>\n</div>";

    var style$1 = "\n[part~=contextMenu] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  background: #737E9E;\n  border-radius: 0.25rem;\n  width: 12rem;\n  display: flex;\n  flex-direction: column;\n  padding: 0.25rem 0;\n  visibility: hidden;\n  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.3);\n}\n\n[part~=contextMenu] > div.section {\n  color: #FFF;\n  font-size: 0.875rem;\n  padding: 0.25rem 0.5rem;\n  cursor: default;\n  font-weight: bold;\n}\n\n[part~=contextMenu] > div.section:not(:first-child) {\n  border-top: 1px solid rgba(255, 255, 255, 0.3);\n  margin-top: 0.5rem;\n}\n\n[part~=contextMenu] > div.group {\n  margin: 0 0.5rem;\n  border: 1px solid rgba(255, 255, 255, 0.2);\n  border-radius: 0.25rem;\n  display: flex;\n  flex-direction: row;\n  overflow: hidden;\n}\n[part~=contextMenu] > div.row > div.group {\n  border: 1px solid rgba(255, 255, 255, 0.2);\n  border-radius: 0.25rem;\n  display: flex;\n  flex-direction: row;\n  flex: 1;\n  overflow: hidden;\n}\n\n[part~=contextMenu] > div.row > div.group:first-child {\n  margin-left: 0.5rem;\n  margin-right: 0.25rem;\n}\n\n[part~=contextMenu] > div.row > div.group:last-child {\n  margin-right: 0.5rem;\n}\n\n[part~=contextMenu] > div.group > button,\n[part~=contextMenu] > div.row > div.group > button {\n  display: flex;\n  flex: 1;\n  padding: 0.25rem;\n  justify-content: center;\n  border: 0;\n  margin: 0;\n  background: transparent;\n  color: #FFF;\n  font-size: 1rem;\n  line-height: 1.25rem;\n  align-items: center;\n  outline: none;\n}\n\n[part~=contextMenu] > button,\n[part~=contextMenu] > a {\n  display: flex;\n  border: 0;\n  margin: 0;\n  padding: 0.125rem 0.5rem;\n  background: transparent;\n  text-align: left;\n  color: #FFF;\n  font-size: 1rem;\n  text-decoration: none;\n  cursor: default;\n  outline: none;\n}\n\n[part~=contextMenu] > div.group > button.active,\n[part~=contextMenu] > div.row > div.group > button.active {\n  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3) inset;\n  background: rgba(0, 0, 0, 0.1);\n}\n\n[part~=contextMenu] > div.group > button.active:hover,\n[part~=contextMenu] > div.row > div.group > button.active:hover {\n  background: rgba(0, 0, 0, 0.2);\n}\n\n[part~=contextMenu] > div.group > button:not(:first-child),\n[part~=contextMenu] > div.row > div.group > button:not(:first-child) {\n  border-left: 1px solid rgba(255, 255, 255, 0.1);\n}\n\n[part~=contextMenu] > div.row > div.group > button > svg,\n[part~=contextMenu] > div.group > button > svg,\n[part~=contextMenu] > div.row > button > svg,\n[part~=contextMenu] > button > svg {\n  width: 1.5rem;\n  height: 1.5rem;\n  align-self: center;\n}\n\n[part~=contextMenu] > div.row > div.group > button:hover,\n[part~=contextMenu] > div.group > button:hover,\n[part~=contextMenu] > button:hover,\n[part~=contextMenu] > a:hover {\n  background: rgba(255, 255, 255, 0.2);\n}\n\n[part~=contextMenu] > div.row > div.group > button:active,\n[part~=contextMenu] > div.group > button:active {\n  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.3) inset;\n  background: rgba(0, 0, 0, 0.2);\n}\n[part~=contextMenu] > button:active,\n[part~=contextMenu] > a:active {\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) inset;\n  background: rgba(0, 0, 0, 0.2);\n}\n\n.row {\n  display: flex;\n}\n\n.divider {\n  border-top: 1px solid rgba(255, 255, 255, 0.3);\n  margin-top: 0.5rem;\n  height: 0.4375rem;\n}\n\n.black {\n  display: inline-flex;\n  border-radius: 50%;\n  width: 1rem;\n  height: 1rem;\n  background: #000;\n}\n\n.white {\n  display: inline-flex;\n  border-radius: 50%;\n  width: 1rem;\n  height: 1rem;\n  background: #FFF;\n}\n\n.download svg {\n  margin-bottom: -0.125rem;\n  margin-left: 0.25rem;\n}\n\n[part~=color] {\n  position: absolute;\n  padding: 0.25rem;\n  background: #737E9E;\n  border-radius: 0.25rem;\n  box-shadow: 0 1px 16px rgba(0, 0, 0, 0.6);\n}\n\n[part~=colorHexRgb] {\n  margin-bottom: 0.25rem;\n}";

    let MdiMenuIcon = class MdiMenuIcon extends HTMLElement {
    };
    __decorate([
        Part()
    ], MdiMenuIcon.prototype, "$contextMenu", void 0);
    __decorate([
        Part()
    ], MdiMenuIcon.prototype, "$newTab", void 0);
    __decorate([
        Part()
    ], MdiMenuIcon.prototype, "$copyIconName", void 0);
    __decorate([
        Part()
    ], MdiMenuIcon.prototype, "$pngBlack", void 0);
    __decorate([
        Part()
    ], MdiMenuIcon.prototype, "$pngWhite", void 0);
    __decorate([
        Part()
    ], MdiMenuIcon.prototype, "$pngColor", void 0);
    __decorate([
        Part()
    ], MdiMenuIcon.prototype, "$png24", void 0);
    __decorate([
        Part()
    ], MdiMenuIcon.prototype, "$png36", void 0);
    __decorate([
        Part()
    ], MdiMenuIcon.prototype, "$png48", void 0);
    __decorate([
        Part()
    ], MdiMenuIcon.prototype, "$png96", void 0);
    __decorate([
        Part()
    ], MdiMenuIcon.prototype, "$pngDownload", void 0);
    __decorate([
        Part()
    ], MdiMenuIcon.prototype, "$svgBlack", void 0);
    __decorate([
        Part()
    ], MdiMenuIcon.prototype, "$svgWhite", void 0);
    __decorate([
        Part()
    ], MdiMenuIcon.prototype, "$svgColor", void 0);
    __decorate([
        Part()
    ], MdiMenuIcon.prototype, "$svgDownload", void 0);
    __decorate([
        Part()
    ], MdiMenuIcon.prototype, "$copySvgInline", void 0);
    __decorate([
        Part()
    ], MdiMenuIcon.prototype, "$copySvgFile", void 0);
    __decorate([
        Part()
    ], MdiMenuIcon.prototype, "$copySvgPath", void 0);
    __decorate([
        Part()
    ], MdiMenuIcon.prototype, "$copyUnicode", void 0);
    __decorate([
        Part()
    ], MdiMenuIcon.prototype, "$copyCodepoint", void 0);
    __decorate([
        Part()
    ], MdiMenuIcon.prototype, "$copyPreview", void 0);
    __decorate([
        Part()
    ], MdiMenuIcon.prototype, "$color", void 0);
    __decorate([
        Part()
    ], MdiMenuIcon.prototype, "$colorPicker", void 0);
    __decorate([
        Part()
    ], MdiMenuIcon.prototype, "$colorHexRgb", void 0);
    __decorate([
        Local('#000000')
    ], MdiMenuIcon.prototype, "cachePngColor", void 0);
    __decorate([
        Local('24')
    ], MdiMenuIcon.prototype, "cachePngSize", void 0);
    __decorate([
        Local('#000000')
    ], MdiMenuIcon.prototype, "cacheSvgColor", void 0);
    MdiMenuIcon = __decorate([
        Component({
            selector: 'mdi-menu-icon',
            style: style$1,
            template: template$1
        })
    ], MdiMenuIcon);
    var MdiMenuIcon$1 = MdiMenuIcon;

    return MdiMenuIcon$1;

}());
//# sourceMappingURL=mdiMenuIcon.js.map
