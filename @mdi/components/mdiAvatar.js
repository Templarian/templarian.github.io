var mdiAvatar = (function () {
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

    var template$1 = "<div part=\"wrap\">\n  <img part=\"img\" src=\"data:image/png;base64,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\"/>\n</div>\n<a part=\"sponsored\" href=\"\" title=\"Sponsor on GitHub\">\n  <svg viewBox=\"0 0 24 24\">\n    <path fill=\"currentColor\" d=\"M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z\" />\n  </svg>\n</a>";

    var style$1 = ":host {\n  display: flex;\n  position: relative;\n  width: var(--mdi-avatar-width, 3rem);\n  height: var(--mdi-avatar-height, 3rem);\n}\n\n[part=\"wrap\"] {\n  border: 1px solid var(--mdi-icon-border-color, #453C4F);\n  border-radius: 50%;\n  overflow: hidden;\n}\n\n[part=\"img\"] {\n  width: calc(var(--mdi-avatar-width, 3rem) - 2px);\n  height: calc(var(--mdi-avatar-height, 3rem) - 2px);\n}\n\n[part=\"sponsored\"] {\n  display: flex;\n  position: absolute;\n  bottom: -0.25rem;\n  right: -0.5rem;\n  border: 1px solid var(--mdi-icon-border-color, #453C4F);\n  background-color: #fff;\n  border-radius: 50%;\n  color: #ea4aaa;\n  width: 1.5rem;\n  height: 1.5rem;\n  align-content: center;\n  align-items: center;\n  justify-items: center;\n  justify-content: center;\n}\n[part=\"sponsored\"]:hover {\n  box-shadow: 0 0 0 0.125rem #fff;\n  color: #fff;\n  background-color: #ea4aaa;\n  border-color: #ea4aaa;\n}\n[part=\"sponsored\"] svg {\n  width: 1rem;\n  height: 1rem;\n  margin-top: 1px; /* meh */\n}";

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

    const noAvatar = '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';
    let MdiAvatar = class MdiAvatar extends HTMLElement {
        constructor() {
            super(...arguments);
            this.user = new User();
        }
        render(changes) {
            if (changes.user) {
                this.$img.src = `data:image/png;base64,${this.user.base64 || noAvatar}`;
                this.$sponsored.style.display = this.user.sponsored ? 'flex' : 'none';
                if (this.user.sponsored) {
                    this.$sponsored.href = `https://github.com/sponsors/${this.user.github}`;
                }
            }
        }
    };
    __decorate([
        Prop()
    ], MdiAvatar.prototype, "user", void 0);
    __decorate([
        Part()
    ], MdiAvatar.prototype, "$img", void 0);
    __decorate([
        Part()
    ], MdiAvatar.prototype, "$sponsored", void 0);
    MdiAvatar = __decorate([
        Component({
            selector: 'mdi-avatar',
            style: style$1,
            template: template$1
        })
    ], MdiAvatar);
    var MdiAvatar$1 = MdiAvatar;

    return MdiAvatar$1;

}());
//# sourceMappingURL=mdiAvatar.js.map
