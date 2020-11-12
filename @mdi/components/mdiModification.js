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
            else {
                throw "Cannot find part=\"" + part + "\" in template. node(template, { " + part + ": {} })";
            }
        }
        return $node;
    }

    var template$1 = "<div part=\"items\"></div>";

    var style$1 = ":host {\n  display: flex;\n  flex-direction: row;\n}\n\n";

    var templateNews = "<div part=\"news\">\n  <mdi-avatar part=\"avatar\"></mdi-avatar>\n  <mdi-icon part=\"icon\"></mdi-icon>\n  <span part=\"text\"></span>\n</div>";

    var templateIconAliasCreated = "<div part=\"iconAliasCreated\">\n  <mdi-avatar part=\"avatar\"></mdi-avatar>\n  <mdi-icon part=\"icon\"></mdi-icon>\n  <span part=\"text\"></span>\n</div>";

    function list($list, items, key, add, update) {
        const elements = Array.from($list.children);
        const current = elements.map((e) => e.dataset.key);
        items.forEach(item => {
            if (current.length === 0) {
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
            const element = elements.find((e) => e.dataset.key === current[key]);
            if (item[key] === current[key]) {
                update(item, element);
                return;
            }
            element === null || element === void 0 ? void 0 : element.remove();
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
    })(ModificationType || (ModificationType = {}));

    const mapTemplates = {
        [ModificationType.News]: templateNews,
        [ModificationType.IconCreated]: templateNews,
        [ModificationType.IconModified]: templateNews,
        [ModificationType.IconRenamed]: templateNews,
        [ModificationType.IconDeleted]: templateNews,
        [ModificationType.IconAliasCreated]: templateIconAliasCreated,
        [ModificationType.IconAliasDeleted]: templateNews,
        [ModificationType.IconTagCreated]: templateNews,
        [ModificationType.IconTagDeleted]: templateNews
    };
    let MdiModification = class MdiModification extends HTMLElement {
        constructor() {
            super(...arguments);
            this.modifications = null;
            this.edit = false;
        }
        render(changes) {
            if (changes.modifications && this.modifications) {
                list(this.$items, this.modifications, 'id', (modification) => {
                    if (modification.modificationId in mapTemplates) {
                        return node(mapTemplates[modification.modificationId], {
                            text: {
                                innerText: modification.text
                            },
                            icon: {
                                path: modification.icon.data
                            },
                            avatar: {
                                user: modification.user
                            }
                        });
                    }
                    const invalid = document.createElement('div');
                    invalid.innerText = `Error: Unsupported modificationId with text: "${modification.text}"`;
                    return invalid;
                }, (modifiction, $item) => {
                });
            }
            if (changes.edit) ;
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
