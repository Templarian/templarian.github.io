var mdiModification = (function () {
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
    function node(template, init) {
        var $template = document.createElement('template');
        $template.innerHTML = template;
        var $node = document.importNode($template.content, true);
        for (var _i = 0, _a = Object.entries(init); _i < _a.length; _i++) {
            var _b = _a[_i], part = _b[0], attributes = _b[1];
            var $part = $node.querySelector("[part~=\"" + part + "\"]");
            if ($part) {
                for (var _c = 0, _d = Object.entries(attributes); _c < _d.length; _c++) {
                    var _e = _d[_c], prop = _e[0], value = _e[1];
                    if (value instanceof Function) {
                        var val = value();
                        if (val === null) {
                            $part.removeAttribute(prop);
                        }
                        else {
                            $part.setAttribute(prop, value());
                        }
                    }
                    else {
                        $part[prop] = value;
                    }
                }
            }
        }
        return $node;
    }

    var template$1 = "<div part=\"items\"></div>";

    var style$1 = ":host {\n  display: flex;\n  flex-direction: column;\n  color: #453C4F;\n}\n\n.invalid {\n  color: #721c24;\n  background-color: #f8d7da;\n  border-color: #f5c6cb;\n}\n\nh2 {\n  font-weight: normal;\n  font-size: 1.25rem;\n  margin: 0.5rem 0 0.5rem 0;\n}\n\n/* Individual Templates */\n\n[part=\"news\"] {\n  display: grid;\n  grid-template-columns: 3.5rem 1fr;\n  grid-template-rows: 3.25rem auto;\n  padding: 0.25rem;\n}\n[part=\"news\"] [part=\"avatar\"] {\n  grid-column: 1;\n}\n[part=\"news\"] [part=\"label\"] {\n  grid-column: 1;\n  grid-row: 2;\n  text-align: center;\n  padding-right: 0.5rem;\n}\n[part=\"news\"] [part=\"markdown\"] {\n  grid-column: 2;\n  grid-row: 1 / span 2;\n  border: 1px solid #DDD;\n  padding: 0 1rem;\n  background: #fff;\n  border-radius: 0.25rem;\n}\n\n[part=\"iconCreated\"],\n[part=\"iconRenamed\"],\n[part=\"iconDeleted\"],\n[part=\"iconAliasCreated\"],\n[part=\"iconAliasDeleted\"],\n[part=\"iconTagCreated\"],\n[part=\"iconTagDeleted\"],\n[part=\"iconAuthorModified\"],\n[part=\"iconDeprecated\"] {\n  display: grid;\n  grid-template-columns: 3.5rem 3.5rem 1fr auto auto;\n  padding: 0.25rem;\n}\n[part=\"iconCreated\"] [part=\"avatar\"],\n[part=\"iconModified\"] [part=\"avatar\"],\n[part=\"iconRenamed\"] [part=\"avatar\"],\n[part=\"iconDeleted\"] [part=\"avatar\"],\n[part=\"iconAliasCreated\"] [part=\"avatar\"],\n[part=\"iconAliasDeleted\"] [part=\"avatar\"],\n[part=\"iconTagCreated\"] [part=\"avatar\"],\n[part=\"iconTagDeleted\"] [part=\"avatar\"],\n[part=\"iconAuthorModified\"] [part=\"avatar\"],\n[part=\"iconDeprecated\"] [part=\"avatar\"] {\n  grid-column: 1;\n}\n[part=\"iconCreated\"] [part=\"icon\"],\n[part=\"iconModified\"] [part=\"iconDataBefore\"],\n[part=\"iconModified\"] [part=\"iconDataAfter\"],\n[part=\"iconRenamed\"] [part=\"icon\"],\n[part=\"iconDeleted\"] [part=\"icon\"],\n[part=\"iconAliasCreated\"] [part=\"icon\"],\n[part=\"iconAliasDeleted\"] [part=\"icon\"],\n[part=\"iconTagCreated\"] [part=\"icon\"],\n[part=\"iconTagDeleted\"] [part=\"icon\"],\n[part=\"iconAuthorModified\"] [part=\"icon\"],\n[part=\"iconDeprecated\"] [part=\"icon\"] {\n  grid-column: 2;\n  --mdi-icon-width: 3rem;\n  --mdi-icon-height: 3rem;\n  width: 3rem;\n  border: 1px solid #ddd;\n  background: #fff;\n  border-radius: 0.25rem;\n  align-self: flex-start;\n}\n[part=\"iconCreated\"] [part=\"content\"],\n[part=\"iconModified\"] [part=\"content\"],\n[part=\"iconRenamed\"] [part=\"content\"],\n[part=\"iconDeleted\"] [part=\"content\"],\n[part=\"iconAliasCreated\"] [part=\"content\"],\n[part=\"iconAliasDeleted\"] [part=\"content\"],\n[part=\"iconTagCreated\"] [part=\"content\"],\n[part=\"iconTagDeleted\"] [part=\"content\"],\n[part=\"iconAuthorModified\"] [part=\"content\"],\n[part=\"iconDeprecated\"] [part=\"content\"] {\n  grid-column: 3;\n  align-content: center;\n  display: flex;\n  align-items: center;\n}\n[part=\"iconCreated\"] [part=\"content\"] code,\n[part=\"iconModified\"] [part=\"content\"] code,\n[part=\"iconRenamed\"] [part=\"content\"] code,\n[part=\"iconDeleted\"] [part=\"content\"] code,\n[part=\"iconAliasCreated\"] [part=\"content\"] code,\n[part=\"iconAliasDeleted\"] [part=\"content\"] code,\n[part=\"iconTagCreated\"] [part=\"content\"] code,\n[part=\"iconTagDeleted\"] [part=\"content\"] code,\n[part=\"iconAuthorModified\"] [part=\"content\"] code,\n[part=\"iconDeprecated\"] [part=\"content\"] code {\n  display: inline-block;\n  background: rgba(0, 0, 0, 0.05);\n  padding: 0.125rem 0.25rem;\n  border-radius: 0.125rem;\n  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.5);\n  border: 1px solid rgba(69, 60, 79, 0.2);\n  line-height: 1.125rem;\n}\n[part=\"iconCreated\"] [part=\"issue\"],\n[part=\"iconModified\"] [part=\"issue\"],\n[part=\"iconRenamed\"] [part=\"issue\"],\n[part=\"iconDeleted\"] [part=\"issue\"],\n[part=\"iconAliasCreated\"] [part=\"issue\"],\n[part=\"iconAliasDeleted\"] [part=\"issue\"],\n[part=\"iconTagCreated\"] [part=\"issue\"],\n[part=\"iconTagDeleted\"] [part=\"issue\"],\n[part=\"iconDescriptionModified\"] [part=\"issue\"],\n[part=\"iconAuthorModified\"] [part=\"issue\"],\n[part=\"iconDeprecated\"] [part=\"issue\"] {\n  grid-column: 4;\n  display: flex;\n  align-self: center;\n  text-decoration: none;\n  padding: 0.25rem 0.5rem;\n  border: 1px solid #453C4F;\n  color: #453C4F;\n  border-radius: 0.25rem;\n}\n[part=\"iconCreated\"] [part=\"issue\"]:hover,\n[part=\"iconModified\"] [part=\"issue\"]:hover,\n[part=\"iconRenamed\"] [part=\"issue\"]:hover,\n[part=\"iconDeleted\"] [part=\"issue\"]:hover,\n[part=\"iconAliasCreated\"] [part=\"issue\"]:hover,\n[part=\"iconAliasDeleted\"] [part=\"issue\"]:hover,\n[part=\"iconTagCreated\"] [part=\"issue\"]:hover,\n[part=\"iconTagDeleted\"] [part=\"issue\"]:hover,\n[part=\"iconDescriptionModified\"] [part=\"issue\"]:hover,\n[part=\"iconAuthorModified\"] [part=\"issue\"]:hover,\n[part=\"iconDeprecated\"] [part=\"issue\"]:hover {\n  background: #453C4F;\n  color: #fff;\n}\n.edit [part=\"iconCreated\"] [part=\"edit\"],\n.edit [part=\"iconModified\"] [part=\"edit\"],\n.edit [part=\"iconRenamed\"] [part=\"edit\"],\n.edit [part=\"iconDeleted\"] [part=\"edit\"],\n.edit [part=\"iconAliasCreated\"] [part=\"edit\"],\n.edit [part=\"iconAliasDeleted\"] [part=\"edit\"],\n.edit [part=\"iconTagCreated\"] [part=\"edit\"],\n.edit [part=\"iconTagDeleted\"] [part=\"edit\"],\n.edit [part=\"iconDescriptionModified\"] [part=\"edit\"],\n.edit [part=\"iconAuthorModified\"] [part=\"edit\"],\n.edit [part=\"iconDeprecated\"] [part=\"edit\"] {\n  display: flex;\n}\n[part=\"iconCreated\"] [part=\"edit\"],\n[part=\"iconModified\"] [part=\"edit\"],\n[part=\"iconRenamed\"] [part=\"edit\"],\n[part=\"iconDeleted\"] [part=\"edit\"],\n[part=\"iconAliasCreated\"] [part=\"edit\"],\n[part=\"iconAliasDeleted\"] [part=\"edit\"],\n[part=\"iconTagCreated\"] [part=\"edit\"],\n[part=\"iconTagDeleted\"] [part=\"edit\"],\n[part=\"iconDescriptionModified\"] [part=\"edit\"],\n[part=\"iconAuthorModified\"] [part=\"edit\"],\n[part=\"iconDeprecated\"] [part=\"edit\"] {\n  display: none;\n  grid-column: 5;\n  align-self: center;\n  padding: 0.25rem;\n  border: 0;\n  border-radius: 0.25rem;\n  margin-left: 0.5rem;\n  cursor: pointer;\n}\n[part=\"iconCreated\"] [part=\"edit\"]:hover,\n[part=\"iconModified\"] [part=\"edit\"]:hover,\n[part=\"iconRenamed\"] [part=\"edit\"]:hover,\n[part=\"iconDeleted\"] [part=\"edit\"]:hover,\n[part=\"iconAliasCreated\"] [part=\"edit\"]:hover,\n[part=\"iconAliasDeleted\"] [part=\"edit\"]:hover,\n[part=\"iconTagCreated\"] [part=\"edit\"]:hover,\n[part=\"iconTagDeleted\"] [part=\"edit\"]:hover,\n[part=\"iconDescriptionModified\"] [part=\"edit\"]:hover,\n[part=\"iconAuthorModified\"] [part=\"edit\"]:hover,\n[part=\"iconDeprecated\"] [part=\"edit\"]:hover {\n  background: #453C4F;\n  --mdi-icon-color: #fff;\n}\n\n/* Individiual Tweaks */\n[part=\"iconCreated\"] [part=\"icon\"] {\n  background: #d1e7dd;\n  border-color: #badbcc;\n}\n\n[part=\"iconRenamed\"] [part=\"icon\"] {\n  background-color: #fff3cd;\n  border-color: #ffecb5;\n}\n\n[part=\"iconDeleted\"] [part=\"icon\"] {\n  background: #f5c6cb;\n  border-color: #d06e78;\n}\n\n[part=\"iconModified\"] {\n  display: grid;\n  grid-template-columns: 3.5rem 3.5rem 3.5rem 1fr auto auto;\n  padding: 0.25rem;\n}\n[part=\"iconModified\"] [part=\"iconDataBefore\"] {\n  opacity: 0.4;\n}\n[part=\"iconModified\"] [part=\"iconDataAfter\"] {\n  grid-column: 3;\n}\n[part=\"iconModified\"] [part=\"content\"] {\n  grid-column: 4;\n}\n[part=\"iconModified\"] [part=\"issue\"] {\n  grid-column: 5;\n}\n[part=\"iconModified\"] [part=\"edit\"] {\n  grid-column: 6;\n}\n\n[part=\"iconAliasCreated\"] [part=\"icon\"],\n[part=\"iconAliasDeleted\"] [part=\"icon\"] {\n  background-color: #DDC6E7;\n  border-color: 1px solid #DBBDE5;\n}\n\n[part=\"iconTagCreated\"] [part=\"icon\"],\n[part=\"iconTagDeleted\"] [part=\"icon\"] {\n  background-color: #cff4fc;\n  border-color: #b6effb;\n}\n\n[part=\"iconDescriptionModified\"] {\n  display: grid;\n  grid-template-columns: 3.5rem 3.5rem 1fr 0.5rem 1fr auto;\n  grid-template-rows: auto auto;\n  padding: 0.25rem;\n}\n[part=\"iconDescriptionModified\"] [part=\"avatar\"] {\n  grid-column: 1;\n  grid-row: 1 / span 2;\n}\n[part=\"iconDescriptionModified\"] [part=\"icon\"] {\n  grid-column: 2;\n  grid-row: 1 / span 2;\n  --mdi-icon-width: 3rem;\n  --mdi-icon-height: 3rem;\n  width: 3rem;\n  border: 1px solid #ddd;\n  background: #fff;\n  border-radius: 0.25rem;\n  align-self: flex-start;\n}\n[part=\"iconDescriptionModified\"] [part=\"iconDescriptionBefore\"] {\n  grid-column: 3;\n  grid-row: 1 / span 2;\n  border: 1px solid #DDD;\n  padding: 0 1rem;\n  background: #fff;\n  border-radius: 0.25rem;\n}\n[part=\"iconDescriptionModified\"] [part=\"iconDescriptionAfter\"] {\n  grid-column: 5;\n  grid-row: 1 / span 2;\n  border: 1px solid #DDD;\n  padding: 0 1rem;\n  background: #fff;\n  border-radius: 0.25rem;\n}\n[part=\"iconDescriptionModified\"] [part=\"issue\"] {\n  grid-column: 6;\n  grid-row: 1;\n  margin-left: 0.5rem;\n}\n[part=\"iconDescriptionModified\"] [part=\"edit\"] {\n  grid-column: 6;\n  grid-row: 2;\n  justify-content: center;\n  margin-top: 0.25rem;\n}\n\n.added,\n.created {\n  border-bottom: 3px solid #badbcc;\n}\n\n.removed,\n.deleted {\n  border-bottom: 3px solid #f5c6cb;\n}";

    var templateDate = "<h2 part=\"text\"></h1>";

    var templateNews = "<div part=\"news\">\n  <mdi-avatar part=\"avatar\"></mdi-avatar>\n  <span part=\"label\">News</span>\n  <mdi-markdown part=\"markdown\"></mdi-markdown>\n</div>";

    var templateIconCreated = "<div part=\"iconCreated\">\n  <mdi-avatar part=\"avatar\"></mdi-avatar>\n  <mdi-icon part=\"icon\"></mdi-icon>\n  <span part=\"content\">\n    <span>\n      Icon <code part=\"iconName\"></code> <span class=\"created\">created</span>.\n    </span>\n  </span>\n  <a part=\"issue\"></a>\n  <button part=\"edit\">\n    <mdi-icon part=\"editIcon\"></mdi-icon>\n  </button>\n</div>";

    var templateIconModified = "<div part=\"iconModified\">\n  <mdi-avatar part=\"avatar\"></mdi-avatar>\n  <mdi-icon part=\"iconDataBefore\"></mdi-icon>\n  <mdi-icon part=\"iconDataAfter\"></mdi-icon>\n  <span part=\"content\">\n    <span>\n      Icon <code part=\"iconName\"></code> modified.\n    </span>\n  </span>\n  <a part=\"issue\"></a>\n  <button part=\"edit\">\n    <mdi-icon part=\"editIcon\"></mdi-icon>\n  </button>\n</div>";

    var templateIconRenamed = "<div part=\"iconRenamed\">\n  <mdi-avatar part=\"avatar\"></mdi-avatar>\n  <mdi-icon part=\"icon\"></mdi-icon>\n  <span part=\"content\">\n    <span>\n      Icon <code part=\"iconNameBefore\"></code> renamed to <code part=\"iconNameAfter\"></code>.\n    </span>\n  </span>\n  <a part=\"issue\"></a>\n  <button part=\"edit\">\n    <mdi-icon part=\"editIcon\"></mdi-icon>\n  </button>\n</div>";

    var templateIconDeleted = "<div part=\"iconDeleted\">\n  <mdi-avatar part=\"avatar\"></mdi-avatar>\n  <mdi-icon part=\"icon\"></mdi-icon>\n  <span part=\"content\">\n    <span>\n      Icon <code part=\"iconName\"></code> <span class=\"deleted\">deleted</span>.\n    </span>\n  </span>\n  <a part=\"issue\"></a>\n  <button part=\"edit\">\n    <mdi-icon part=\"editIcon\"></mdi-icon>\n  </button>\n</div>";

    var templateIconAliasCreated = "<div part=\"iconAliasCreated\">\n  <mdi-avatar part=\"avatar\"></mdi-avatar>\n  <mdi-icon part=\"icon\"></mdi-icon>\n  <span part=\"content\">\n    <span>\n      <span class=\"added\">Added</span> alias <code part=\"text\"></code> to <code part=\"iconName\"></code>.\n    </span>\n  </span>\n  <a part=\"issue\"></a>\n  <button part=\"edit\">\n    <mdi-icon part=\"editIcon\"></mdi-icon>\n  </button>\n</div>";

    var templateIconAliasDeleted = "<div part=\"iconAliasDeleted\">\n  <mdi-avatar part=\"avatar\"></mdi-avatar>\n  <mdi-icon part=\"icon\"></mdi-icon>\n  <span part=\"content\">\n    <span>\n      <span class=\"removed\">Removed</span> alias <code part=\"text\"></code> from <code part=\"iconName\"></code>.\n    </span>\n  </span>\n  <a part=\"issue\"></a>\n  <button part=\"edit\">\n    <mdi-icon part=\"editIcon\"></mdi-icon>\n  </button>\n</div>";

    var templateIconTagCreated = "<div part=\"iconTagCreated\">\n  <mdi-avatar part=\"avatar\"></mdi-avatar>\n  <mdi-icon part=\"icon\"></mdi-icon>\n  <span part=\"content\">\n    <span>\n      <span class=\"added\">Added</span> tag <code part=\"text\"></code> to <code part=\"iconName\"></code>.\n    </span>\n  </span>\n  <a part=\"issue\"></a>\n  <button part=\"edit\">\n    <mdi-icon part=\"editIcon\"></mdi-icon>\n  </button>\n</div>";

    var templateIconTagDeleted = "<div part=\"iconTagDeleted\">\n  <mdi-avatar part=\"avatar\"></mdi-avatar>\n  <mdi-icon part=\"icon\"></mdi-icon>\n  <span part=\"content\">\n    <span>\n      <span class=\"removed\">Removed</span> tag <code part=\"text\"></code> from <code part=\"iconName\"></code>.\n    </span>\n  </span>\n  <a part=\"issue\"></a>\n  <button part=\"edit\">\n    <mdi-icon part=\"editIcon\"></mdi-icon>\n  </button>\n</div>";

    var templateIconDescriptionModified = "<div part=\"iconDescriptionModified\">\n  <mdi-avatar part=\"avatar\"></mdi-avatar>\n  <mdi-icon part=\"icon\"></mdi-icon>\n  <mdi-markdown part=\"iconDescriptionBefore\"></mdi-markdown>\n  <mdi-markdown part=\"iconDescriptionAfter\"></mdi-markdown>\n  <a part=\"issue\"></a>\n  <button part=\"edit\">\n    <mdi-icon part=\"editIcon\"></mdi-icon>\n  </button>\n</div>";

    var templateIconAuthorModified = "<div part=\"iconAuthorModified\">\n  <mdi-avatar part=\"avatar\"></mdi-avatar>\n  <mdi-icon part=\"icon\"></mdi-icon>\n  <span part=\"content\">\n    <span>\n      Author modified.\n    </span>\n  </span>\n  <a part=\"issue\"></a>\n  <button part=\"edit\">\n    <mdi-icon part=\"editIcon\"></mdi-icon>\n  </button>\n</div>";

    var templateIconDeprecated = "<div part=\"iconDeprecated\">\n  <mdi-avatar part=\"avatar\"></mdi-avatar>\n  <mdi-icon part=\"icon\"></mdi-icon>\n  <span part=\"content\">\n    <span>\n      Deprecated. Warning this icon will be removed in a future release.\n    </span>\n  </span>\n  <a part=\"issue\"></a>\n  <button part=\"edit\">\n    <mdi-icon part=\"editIcon\"></mdi-icon>\n  </button>\n</div>";

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
            this.core = false;
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
            this.core = user.core;
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

    class FontIcon {
        from(fontIcon) {
            this.id = fontIcon.id;
            this.codepoint = fontIcon.codepoint;
            this.font = fontIcon.font;
            this.version = fontIcon.version;
            return this;
        }
        to() {
            return {
                id: this.id,
                codepoint: this.codepoint,
                font: this.font,
                version: this.version
            };
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
            this.fontIcons = [];
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
            if (icon.fontIcons) {
                this.fontIcons = icon.fontIcons.map(t => new FontIcon().from(t));
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

    class Modification {
        constructor() { }
        from(modification) {
            this.id = modification.id;
            this.modificationId = modification.modificationId;
            this.packageId = modification.packageId;
            this.user = new User().from(modification.user);
            this.icon = new Icon().from(modification.icon);
            this.iconNameBefore = modification.iconNameBefore;
            this.iconNameAfter = modification.iconNameAfter;
            this.iconDescriptionBefore = modification.iconDescriptionBefore;
            this.iconDescriptionAfter = modification.iconDescriptionAfter;
            this.iconDataBefore = modification.iconDataBefore;
            this.iconDataAfter = modification.iconDataAfter;
            this.text = modification.text;
            this.date = modification.date;
            this.issue = modification.issue;
            this.isVisible = modification.isVisible;
            return this;
        }
    }

    function list($list, items, key, add, update) {
        const elements = Array.from($list.children);
        const current = elements.map((e) => e.dataset.key);
        const itemKeys = items.map(x => x[key]);
        items.forEach(item => {
            if (current.includes(item[key])) {
                const element = elements.find((e) => e.dataset.key === current[key]);
                if (item[key] === current[key]) {
                    update(item, element);
                    return;
                }
            }
            else {
                const newItem = add(item);
                if (newItem instanceof DocumentFragment) {
                    newItem.children[0].dataset.key = item[key];
                }
                else {
                    newItem.dataset.key = item[key];
                }
                $list.appendChild(newItem);
                return;
            }
        });
        elements.forEach(element => {
            if (!itemKeys.includes(element.dataset.key)) {
                element.remove();
            }
        });
    }

    var ModificationType;
    (function (ModificationType) {
        ModificationType["IconAliasCreated"] = "691c8829-b1e7-11e7-bf5c-94188269ec50";
        ModificationType["IconAliasDeleted"] = "f1f70a76-b975-11e9-8ca0-94188269ec50";
        ModificationType["IconCreated"] = "AFFE875E-01BC-4A34-9BE3-27625A155B28";
        ModificationType["IconDeleted"] = "B1CE1713-A18A-4E9D-9E26-D0B4E44A1FAC";
        ModificationType["IconModified"] = "1506F66B-CC2A-4575-A20A-DC138628977A";
        ModificationType["IconRenamed"] = "F7B6D49B-A86F-49AC-AF92-6B9D0DF6188B";
        ModificationType["IconTagCreated"] = "a185a9e8-c192-11e7-bf5c-94188269ec50";
        ModificationType["IconTagDeleted"] = "ffe6b5f6-b975-11e9-8ca0-94188269ec50";
        ModificationType["IconDescriptionModified"] = "3c638179-c4ca-11e8-9f27-94188269ec50";
        ModificationType["IconAuthorModified"] = "254591d0-b28e-11e9-8ca0-94188269ec50";
        ModificationType["WebfontPublished"] = "66B9FA99-1FAA-4D8F-B87F-B6F3CA444624";
        ModificationType["News"] = "B4DEB3A8-A146-4086-9D7B-B67842A9CCB8";
        ModificationType["IconDeprecated"] = "f92f310f-bfed-11e9-8ca0-94188269ec50";
        ModificationType["IconWorkInProgress"] = "e262be80-bfed-11e9-8ca0-94188269ec50";
        ModificationType["IconLive"] = "f92f2ba6-bfed-11e9-8ca0-94188269ec50";
        ModificationType["IconPublished"] = "e262b92e-bfed-11e9-8ca0-94188269ec50";
        ModificationType["Date"] = "date";
    })(ModificationType || (ModificationType = {}));

    var template$2 = "<div part=\"tooltip\">\n  <span part=\"tooltipText\"></span>\n  <div part=\"tooltipArrow\"></div>\n</div>";

    var style$2 = ":host {\n  pointer-events: none;\n}\n\n[part~=tooltip] {\n  position: relative;\n}\n\n[part~=tooltipText] {\n  position: absolute;\n  background: #737E9E;\n  border-radius: 0.25rem;\n  color: #FFF;\n  padding: 0.15rem 0.5rem 0.3rem 0.5rem;\n  white-space: nowrap;\n  left: 0;\n  top: 0;\n}\n\n[part~=tooltipArrow] {\n  left: 16px;\n  top: -7px;\n}\n\n[part~=tooltipArrow],\n[part~=tooltipArrow]::before {\n  position: absolute;\n  width: 10px;\n  height: 10px;\n}\n\n[part~=tooltipArrow]::before {\n  content: '';\n  transform: rotate(45deg);\n  background: #737E9E;\n}";

    const TOP = 'top';
    const TOP_START = 'top-start';
    const TOP_END = 'top-end';
    const RIGHT = 'right';
    const RIGHT_START = 'right-start';
    const RIGHT_END = 'right-end';
    const BOTTOM = 'bottom';
    const BOTTOM_START = 'bottom-start';
    const BOTTOM_END = 'bottom-end';
    const LEFT = 'left';
    const LEFT_START = 'left-start';
    const LEFT_END = 'left-end';

    const map = {
        [TOP_START]: (width, height, rect) => {
            return {
                arrowTop: height - 5,
                arrowLeft: rect.width > width
                    ? Math.floor(width / 2) - 5
                    : Math.floor(rect.width / 2) - 5,
                left: rect.left,
                top: rect.top - height - 10
            };
        },
        [TOP]: (width, height, rect) => {
            return {
                arrowTop: height - 5,
                arrowLeft: Math.floor(width / 2) - 5,
                left: rect.left - Math.floor((width - rect.width) / 2),
                top: rect.top - height - 10
            };
        },
        [TOP_END]: (width, height, rect) => {
            return {
                arrowTop: height - 5,
                arrowLeft: rect.width > width
                    ? width - Math.floor(width / 2) - 5
                    : width - Math.floor(rect.width / 2) - 5,
                left: rect.left - width + rect.width,
                top: rect.top - height - 10
            };
        },
        [RIGHT_START]: (width, height, rect) => {
            return {
                arrowTop: Math.floor(height / 2) - 5,
                arrowLeft: -5,
                left: rect.left + rect.width + 10,
                top: rect.top
            };
        },
        [RIGHT]: (width, height, rect) => {
            return {
                arrowTop: Math.floor(height / 2) - 5,
                arrowLeft: -5,
                left: rect.left + rect.width + 10,
                top: rect.top + Math.floor(rect.height / 2) - Math.floor(height / 2)
            };
        },
        [RIGHT_END]: (width, height, rect) => {
            return {
                arrowTop: Math.floor(height / 2) - 5,
                arrowLeft: -5,
                left: rect.left + rect.width + 10,
                top: rect.top + rect.height - height
            };
        },
        [BOTTOM_START]: (width, height, rect) => {
            return {
                arrowTop: -5,
                arrowLeft: rect.width > width
                    ? Math.floor(width / 2) - 5
                    : Math.floor(rect.width / 2) - 5,
                left: rect.left,
                top: rect.top + rect.height + height - 20
            };
        },
        [BOTTOM]: (width, height, rect) => {
            return {
                arrowTop: -5,
                arrowLeft: Math.floor(width / 2) - 5,
                left: rect.left - Math.floor((width - rect.width) / 2),
                top: rect.top + rect.height + height - 20
            };
        },
        [BOTTOM_END]: (width, height, rect) => {
            return {
                arrowTop: -5,
                arrowLeft: rect.width > width
                    ? width - Math.floor(width / 2) - 5
                    : width - Math.floor(rect.width / 2) - 5,
                left: rect.left - width + rect.width,
                top: rect.top + rect.height + height - 20
            };
        },
        [LEFT_START]: (width, height, rect) => {
            return {
                arrowTop: Math.floor(height / 2) - 5,
                arrowLeft: width - 5,
                left: rect.left - width - 10,
                top: rect.top
            };
        },
        [LEFT]: (width, height, rect) => {
            return {
                arrowTop: Math.floor(height / 2) - 5,
                arrowLeft: width - 5,
                left: rect.left - width - 10,
                top: rect.top + Math.floor(rect.height / 2) - Math.floor(height / 2)
            };
        },
        [LEFT_END]: (width, height, rect) => {
            return {
                arrowTop: Math.floor(height / 2) - 5,
                arrowLeft: width - 5,
                left: rect.left - width - 10,
                top: rect.top + rect.height - height
            };
        }
    };
    let MdiTooltip = class MdiTooltip extends HTMLElement {
        constructor() {
            super(...arguments);
            this.visible = false;
            this.rect = null;
            this.text = '';
            this.position = BOTTOM;
        }
        render(changes) {
            this.$tooltipText.innerText = this.text;
            this.style.position = 'absolute';
            if (changes.visible) {
                this.style.display = this.visible ? 'block' : 'none';
            }
            const { width: tooltipWidth, height: tooltipHeight } = this.$tooltipText.getBoundingClientRect();
            let position = this.position;
            if (!(position in map)) {
                position = BOTTOM;
            }
            if (this.rect) {
                const { arrowLeft, arrowTop, left, top } = map[position](tooltipWidth, tooltipHeight, this.rect);
                this.style.left = `${left + window.scrollX}px`;
                this.style.top = `${top + window.scrollY}px`;
                this.$tooltipArrow.style.left = `${arrowLeft}px`;
                this.$tooltipArrow.style.top = `${arrowTop}px`;
            }
        }
    };
    __decorate([
        Prop()
    ], MdiTooltip.prototype, "visible", void 0);
    __decorate([
        Prop()
    ], MdiTooltip.prototype, "rect", void 0);
    __decorate([
        Prop()
    ], MdiTooltip.prototype, "text", void 0);
    __decorate([
        Prop()
    ], MdiTooltip.prototype, "position", void 0);
    __decorate([
        Part()
    ], MdiTooltip.prototype, "$tooltip", void 0);
    __decorate([
        Part()
    ], MdiTooltip.prototype, "$tooltipText", void 0);
    __decorate([
        Part()
    ], MdiTooltip.prototype, "$tooltipArrow", void 0);
    MdiTooltip = __decorate([
        Component({
            selector: 'mdi-tooltip',
            style: style$2,
            template: template$2
        })
    ], MdiTooltip);

    function addTooltip($part, render, position) {
        function handleMouseEnter() {
            $part.dispatchEvent(new CustomEvent('tooltip', {
                detail: {
                    visible: true,
                    rect: $part.getBoundingClientRect(),
                    text: render(),
                    position: position
                },
                bubbles: true,
                composed: true
            }));
        }
        function handleMouseLeave() {
            $part.dispatchEvent(new CustomEvent('tooltip', {
                detail: {
                    visible: false
                },
                bubbles: true,
                composed: true
            }));
        }
        $part.addEventListener('mouseenter', handleMouseEnter);
        $part.addEventListener('mouseleave', handleMouseLeave);
    }

    const editIcon = 'M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z';
    const mapTemplates = {
        [ModificationType.News]: templateNews,
        [ModificationType.IconCreated]: templateIconCreated,
        [ModificationType.IconModified]: templateIconModified,
        [ModificationType.IconRenamed]: templateIconRenamed,
        [ModificationType.IconDeleted]: templateIconDeleted,
        [ModificationType.IconAliasCreated]: templateIconAliasCreated,
        [ModificationType.IconAliasDeleted]: templateIconAliasDeleted,
        [ModificationType.IconTagCreated]: templateIconTagCreated,
        [ModificationType.IconTagDeleted]: templateIconTagDeleted,
        [ModificationType.IconDescriptionModified]: templateIconDescriptionModified,
        [ModificationType.IconAuthorModified]: templateIconAuthorModified,
        [ModificationType.IconDeprecated]: templateIconDeprecated,
        [ModificationType.Date]: templateDate
    };
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
    function dateToString(date) {
        const d = new Date(date);
        const month = months[d.getMonth()];
        return `${month} ${d.getDate()}, ${d.getFullYear()}`;
    }
    function dateToUUID(date) {
        const d = new Date(date);
        const month = months[d.getMonth()];
        return `${d.getFullYear()}-${month}-${d.getDate()}`;
    }
    function itemsInsertDates(modifications) {
        const items = [];
        let unique = '';
        modifications.forEach((m, i) => {
            const date = dateToString(m.date);
            if (unique !== date) {
                items.push(new Modification().from({
                    id: `date-${dateToUUID(m.date)}`,
                    modificationId: ModificationType.Date,
                    text: date,
                    user: new User(),
                    icon: new Icon()
                }));
                unique = date;
            }
            items.push(m);
        });
        return items;
    }
    let MdiModification = class MdiModification extends HTMLElement {
        constructor() {
            super(...arguments);
            this.modifications = null;
            this.edit = false;
            // Ex: pictogrammers/repo
            this.github = '';
        }
        render(changes) {
            if (changes.modifications && this.modifications) {
                list(this.$items, itemsInsertDates(this.modifications), 'id', (modification) => {
                    if (modification.modificationId in mapTemplates) {
                        const n = node(mapTemplates[modification.modificationId], {
                            text: {
                                innerText: modification.text
                            },
                            markdown: {
                                text: modification.text
                            },
                            icon: {
                                path: modification.icon && modification.icon.data
                            },
                            iconName: {
                                innerText: modification.icon && modification.icon.name
                            },
                            iconNameBefore: {
                                innerText: modification.iconNameBefore
                            },
                            iconNameAfter: {
                                innerText: modification.iconNameAfter
                            },
                            iconDescriptionBefore: {
                                text: modification.iconDescriptionBefore
                            },
                            iconDescriptionAfter: {
                                text: modification.iconDescriptionAfter
                            },
                            iconDataBefore: {
                                path: modification.iconDataBefore
                            },
                            iconDataAfter: {
                                path: modification.iconDataAfter
                            },
                            avatar: {
                                user: modification.user
                            },
                            editIcon: {
                                path: editIcon
                            },
                            issue: {
                                style: modification.issue ? '' : 'display:none',
                                innerText: modification.issue ? `#${modification.issue}` : '',
                                href: `https://github.com/${this.github}/issues/${modification.issue}`
                            }
                        });
                        const issue = n.querySelector('[part="issue"]');
                        if (issue) {
                            addTooltip(issue, () => {
                                return `View on GitHub`;
                            }, BOTTOM_END);
                        }
                        const avatar = n.querySelector('[part="avatar"]');
                        if (avatar) {
                            addTooltip(avatar, () => {
                                return modification.user.name;
                            }, BOTTOM_START);
                        }
                        const edit = n.querySelector('[part="edit"]');
                        if (edit) {
                            edit.addEventListener('click', () => {
                                this.dispatchEvent(new CustomEvent('edit', {
                                    detail: {
                                        modification
                                    }
                                }));
                            });
                        }
                        return n;
                    }
                    const invalid = document.createElement('div');
                    invalid.classList.add('invalid');
                    invalid.innerText = `Error: Unsupported modificationId with text: "${modification.text}"`;
                    return invalid;
                }, (modifiction, $item) => {
                });
            }
            if (changes.edit) {
                this.$items.classList.toggle('edit', this.edit);
            }
        }
        addItem(modification) {
            const div = document.createElement('div');
            this.$items.appendChild(div);
        }
    };
    __decorate([
        Prop()
    ], MdiModification.prototype, "modifications", void 0);
    __decorate([
        Prop()
    ], MdiModification.prototype, "edit", void 0);
    __decorate([
        Prop()
    ], MdiModification.prototype, "github", void 0);
    __decorate([
        Part()
    ], MdiModification.prototype, "$items", void 0);
    MdiModification = __decorate([
        Component({
            selector: 'mdi-modification',
            style: style$1,
            template: template$1
        })
    ], MdiModification);
    var MdiModification$1 = MdiModification;

    return MdiModification$1;

}());
//# sourceMappingURL=mdiModification.js.map
