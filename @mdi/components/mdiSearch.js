var mdiSearch = (function () {
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
    function iconFilter(icons, term, limit = 5) {
        term = removeDiacritics(term.toLowerCase());
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

    var template$1 = "<div>\n  <input part=\"input\" type=\"text\" />\n  <svg viewBox=\"0 0 24 24\"><path d=\"M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z\" /></svg>\n  <div part=\"menu\">\n    <ul part=\"list\"></ul>\n    <section part=\"empty\">\n      <strong>No Results</strong>\n      <a href=\"https://github.com/Templarian/MaterialDesign/issues/new?labels=Icon+Request&template=1_icon_request.md&title=\" target=\"_blank\">\n        Request an Icon\n        <svg viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M10.59,13.41C11,13.8 11,14.44 10.59,14.83C10.2,15.22 9.56,15.22 9.17,14.83C7.22,12.88 7.22,9.71 9.17,7.76V7.76L12.71,4.22C14.66,2.27 17.83,2.27 19.78,4.22C21.73,6.17 21.73,9.34 19.78,11.29L18.29,12.78C18.3,11.96 18.17,11.14 17.89,10.36L18.36,9.88C19.54,8.71 19.54,6.81 18.36,5.64C17.19,4.46 15.29,4.46 14.12,5.64L10.59,9.17C9.41,10.34 9.41,12.24 10.59,13.41M13.41,9.17C13.8,8.78 14.44,8.78 14.83,9.17C16.78,11.12 16.78,14.29 14.83,16.24V16.24L11.29,19.78C9.34,21.73 6.17,21.73 4.22,19.78C2.27,17.83 2.27,14.66 4.22,12.71L5.71,11.22C5.7,12.04 5.83,12.86 6.11,13.65L5.64,14.12C4.46,15.29 4.46,17.19 5.64,18.36C6.81,19.54 8.71,19.54 9.88,18.36L13.41,14.83C14.59,13.66 14.59,11.76 13.41,10.59C13,10.2 13,9.56 13.41,9.17Z\" /></svg>\n      </a>\n      <a href=\"https://github.com/Templarian/MaterialDesign/issues/new?labels=Documentation&template=6_doc_guide_request.md&title=\" target=\"_blank\">\n        Request Documentation\n        <svg viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M10.59,13.41C11,13.8 11,14.44 10.59,14.83C10.2,15.22 9.56,15.22 9.17,14.83C7.22,12.88 7.22,9.71 9.17,7.76V7.76L12.71,4.22C14.66,2.27 17.83,2.27 19.78,4.22C21.73,6.17 21.73,9.34 19.78,11.29L18.29,12.78C18.3,11.96 18.17,11.14 17.89,10.36L18.36,9.88C19.54,8.71 19.54,6.81 18.36,5.64C17.19,4.46 15.29,4.46 14.12,5.64L10.59,9.17C9.41,10.34 9.41,12.24 10.59,13.41M13.41,9.17C13.8,8.78 14.44,8.78 14.83,9.17C16.78,11.12 16.78,14.29 14.83,16.24V16.24L11.29,19.78C9.34,21.73 6.17,21.73 4.22,19.78C2.27,17.83 2.27,14.66 4.22,12.71L5.71,11.22C5.7,12.04 5.83,12.86 6.11,13.65L5.64,14.12C4.46,15.29 4.46,17.19 5.64,18.36C6.81,19.54 8.71,19.54 9.88,18.36L13.41,14.83C14.59,13.66 14.59,11.76 13.41,10.59C13,10.2 13,9.56 13.41,9.17Z\" /></svg>\n      </a>\n    </section>\n  </div>\n</div>";

    var style$1 = ":host {\n  align-self: center;\n  width: 10rem;\n}\n\ndiv {\n  display: grid;\n  grid-template-columns: 1fr 0;\n  grid-template-rows: 1fr 0;\n}\ninput {\n  grid-row: 1;\n  grid-column: 1;\n  border-radius: 0.25rem;\n  border: 0;\n  padding: 0.25rem 0.5rem;\n  font-size: 1rem;\n  outline: none;\n  width: calc(100% - 1rem);\n}\ninput:focus + svg path {\n  fill: #ccc;\n}\nsvg {\n  grid-row: 1;\n  grid-column: 2;\n  width: 1.5rem;\n  height: 1.5rem;\n  justify-self: right;\n  margin-right: 0.25rem;\n  pointer-events: none;\n  align-self: center;\n}\nsvg > path {\n  transition: fill 0.3s ease-in-out;\n}\n[part=menu] {\n  display: none;\n  background: #FFF;\n  grid-row: 2;\n  grid-column: 1 / span 2;\n  z-index: 1;\n}\nul {\n  list-style: none;\n  display: flex;\n  flex-direction: column;\n  padding: 0;\n  margin: 0;\n  border-radius: 0.25rem;\n  box-shadow: 0 0.125rem 0.75rem rgba(0, 0, 0, 0.4);\n}\nul > li {\n  color: #222;\n}\nul > li > a {\n  display: flex;\n  padding: 0.25rem 0.5rem;\n  background: #FFF;\n  border-left: 1px solid #DDD;\n  border-right: 1px solid #DDD;\n}\nul > li > a:hover {\n  background: #DAF4FB;\n}\nul > li.item:first-child > a {\n  border-top: 1px solid #DDD;\n  border-bottom: 1px solid #DDD;\n  border-radius: 0.25rem 0.25rem 0 0;\n}\nul > li.item:not(:first-child) > a {\n  border-bottom: 1px solid #DDD;\n}\nul > li.item:last-child > a {\n  border-radius: 0 0 0.25rem 0.25rem;\n}\nul > li > a {\n  text-decoration: none;\n  color: #222;\n}\nul > li > a strong {\n  color: #453C4F;\n}\n.section {\n  color: #FFF;\n  padding: 0.25rem 0.5rem;\n  font-weight: bold;\n  background: #453C4F;\n  border-radius: 0.25rem 0.25rem 0 0;\n  cursor: default;\n}\n.section + li a {\n  border-radius: 0;\n}\n\nli + .section {\n  border-radius: 0;\n}\n\n.type {\n  background-color: #453C4F;\n  border-radius: 0.25rem;\n  font-size: 0.75rem;\n  color: #fff;\n  padding-left: 0.25rem;\n  padding-right: 0.25rem;\n  margin: 0.125rem 0 0.125rem 0.25rem;\n}\n\n.icon {\n  background-color: #453C4F;\n  padding-left: 0.25rem;\n  padding-right: 0.25rem;\n}\n.icon.first > a {\n  border-top-left-radius: 0.25rem;\n  border-top-right-radius: 0.25rem;\n}\n.icon.last {\n  padding-bottom: 0.25rem;\n  border-bottom-left-radius: 0.25rem;\n  border-bottom-right-radius: 0.25rem;\n}\n.icon.last > a {\n  border-radius: 0 0 0.25rem 0.25rem;\n}\n.icon svg {\n  color: #453C4F;\n  margin-right: 0.345rem;\n  margin-left: -0.25rem;\n}\n\n.all {\n  background-color: #453C4F;\n  padding: 0 0.25rem 0.25rem 0.25rem;\n  border-radius: 0 0 0.25rem 0.25rem;\n}\n\n.all a {\n  border-radius: 0.25rem;\n}\n\n[part~=empty] {\n  background: #453C4F;\n  border-radius: 0.25rem;\n  padding: 0.25rem;\n  box-shadow: 0 0.125rem 0.75rem rgba(0, 0, 0, 0.4);\n}\n[part~=empty] strong {\n  color: #fff;\n  padding: 0 0.25rem;\n}\n[part~=empty] a {\n  display: block;\n  background: #fff;\n  color: #453C4F;\n  text-decoration: none;\n  padding: 0.25rem 0.5rem;\n  border-radius: 0.25rem;\n  margin-top: 0.25rem;\n}\n[part~=empty] a:hover {\n  background: #DAF4FB;\n}\n[part~=empty] a svg {\n  vertical-align: middle;\n  width: 1.5rem;\n  height: 1.5rem;\n  float: right;\n  margin: -0.125rem -0.25rem 0 0;\n}\n\n.hide {\n  display: none;\n}";

    const noIcon = 'M0 0h24v24H0V0zm2 2v20h20V2H2z';
    let MdiSearch = class MdiSearch extends HTMLElement {
        constructor() {
            super(...arguments);
            this.path = noIcon;
            this.items = [];
            this.icons = [];
            this.isOpen = false;
            this.isOver = false;
            this.term = '';
        }
        connectedCallback() {
            this.$input.addEventListener('input', this.handleInput.bind(this));
            this.$input.addEventListener('focus', this.handleFocus.bind(this));
            this.$input.addEventListener('blur', this.handleBlur.bind(this));
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
            this.updateList();
            this.isOpen = true;
            this.$menu.style.display = 'block';
        }
        handleBlur() {
            if (!this.isOver) {
                this.isOpen = false;
                this.$menu.style.display = 'none';
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
            var span = document.createElement('span');
            if (this.term === '') {
                span.innerText = text;
                return span;
            }
            while (normalized) {
                var index = normalized.toLowerCase().indexOf(this.term);
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
                    strong.innerText = normalized.substr(index, this.term.length);
                    span.appendChild(strong);
                    normalized = normalized.substr(index + this.term.length, normalized.length);
                }
            }
            return span;
        }
        clearList() {
            while (this.$list.firstChild) {
                this.$list.removeChild(this.$list.firstChild);
            }
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
                    this.$list.appendChild(li);
                }
                if (icons.length > 0) {
                    empty = true;
                }
            }
            console.log(empty);
            this.$empty.classList.toggle('hide', empty);
        }
        render() {
        }
    };
    __decorate([
        Prop()
    ], MdiSearch.prototype, "path", void 0);
    __decorate([
        Prop()
    ], MdiSearch.prototype, "items", void 0);
    __decorate([
        Prop()
    ], MdiSearch.prototype, "icons", void 0);
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
    MdiSearch = __decorate([
        Component({
            selector: 'mdi-search',
            style: style$1,
            template: template$1
        })
    ], MdiSearch);
    var MdiSearch$1 = MdiSearch;

    return MdiSearch$1;

}());
//# sourceMappingURL=mdiSearch.js.map
