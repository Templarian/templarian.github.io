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

    var template$1 = "<mdi-scroll part=\"scroll\">\n  <div part=\"grid\"></div>\n</mdi-scroll>\n<div part=\"tooltip\">\n  <span part=\"tooltipText\"></span>\n  <div part=\"tooltipArrow\"></div>\n</div>\n<div part=\"contextMenu\">\n  <a part=\"newTab\" href=\"\">Open icon in New Tab</a>\n  <button part=\"copyIconName\">Copy Icon Name</button>\n  <div class=\"section\">Download PNG</div>\n  <div class=\"group\">\n    <button part=\"png24\">24</button>\n    <button part=\"png36\">36</button>\n    <button part=\"png48\">48</button>\n    <button part=\"png96\">96</button>\n  </div>\n  <div class=\"row\" style=\"margin-top: 0.25rem;\">\n    <div class=\"group\">\n      <button part=\"pngBlack\"><span class=\"black\"></span></button>\n      <button part=\"pngWhite\"><span class=\"white\"></span></button>\n      <button part=\"pngColor\">\n        <svg viewBox=\"0 0 24 24\">\n          <path fill=\"#fff\" d=\"M19.35,11.72L17.22,13.85L15.81,12.43L8.1,20.14L3.5,22L2,20.5L3.86,15.9L11.57,8.19L10.15,6.78L12.28,4.65L19.35,11.72M16.76,3C17.93,1.83 19.83,1.83 21,3C22.17,4.17 22.17,6.07 21,7.24L19.08,9.16L14.84,4.92L16.76,3M5.56,17.03L4.5,19.5L6.97,18.44L14.4,11L13,9.6L5.56,17.03Z\"/>\n          <path fill=\"currentColor\" d=\"M12.97 8L15.8 10.85L7.67 19L3.71 20.68L3.15 20.11L4.84 16.15L12.97 8Z\"/>\n        </svg>\n      </button>\n    </div>\n    <div class=\"group\">\n      <button part=\"pngDownload\" class=\"download\">\n        PNG\n        <svg viewBox=\"0 0 24 24\">\n          <path fill=\"currentColor\" d=\"M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z\"/>\n        </svg>\n      </button>\n    </div>\n  </div>\n  <div class=\"section\">SVG</div>\n  <div class=\"row\" style=\"margin-bottom: 0.25rem;\">\n    <div class=\"group\">\n      <button part=\"svgBlack\" class=\"active\"><span class=\"black\"></span></button>\n      <button part=\"svgWhite\"><span class=\"white\"></span></button>\n      <button part=\"svgColor\">\n        <svg viewBox=\"0 0 24 24\">\n          <path fill=\"#fff\" d=\"M19.35,11.72L17.22,13.85L15.81,12.43L8.1,20.14L3.5,22L2,20.5L3.86,15.9L11.57,8.19L10.15,6.78L12.28,4.65L19.35,11.72M16.76,3C17.93,1.83 19.83,1.83 21,3C22.17,4.17 22.17,6.07 21,7.24L19.08,9.16L14.84,4.92L16.76,3M5.56,17.03L4.5,19.5L6.97,18.44L14.4,11L13,9.6L5.56,17.03Z\"/>\n          <path fill=\"currentColor\" d=\"M12.97 8L15.8 10.85L7.67 19L3.71 20.68L3.15 20.11L4.84 16.15L12.97 8Z\"/>\n        </svg>\n      </button>\n    </div>\n    <div class=\"group\">\n      <button part=\"svgDownload\" class=\"download\">\n        SVG\n        <svg viewBox=\"0 0 24 24\">\n          <path fill=\"currentColor\" d=\"M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z\"/>\n        </svg>\n      </button>\n    </div>\n  </div>\n  <button part=\"copySvgInline\">Copy HTML SVG Inline</button>\n  <button part=\"copySvgFile\">Copy SVG File Contents</button>\n  <button part=\"copySvgPath\">Copy SVG Path Data</button>\n  <div class=\"section\">Desktop Font</div>\n  <button part=\"copyUnicode\">Copy Unicode Character</button>\n  <button part=\"copyCodepoint\">Copy Codepoint</button>\n  <div class=\"divider\"></div>\n  <button part=\"copyPreview\">Copy GitHub Preview</button>\n  <div part=\"color\">\n    <mdi-input-hex-rgb part=\"colorHexRgb\"></mdi-input-hex-rgb>\n    <mdi-color part=\"colorPicker\"></mdi-color>\n  </div>\n</div>";

    var style$1 = "* {\n  font-family: var(--mdi-font-family);\n}\n\n:host {\n  display: block;\n}\n\n[part~=grid] {\n  position: relative;\n}\n\n[part~=grid] > button {\n  border: 0;\n  background: transparent;\n  padding: 0.625rem;\n  outline: none;\n  width: 2.75rem;\n  height: 2.75rem;\n  position: absolute;\n  left: 0;\n  top: 0;\n}\n\n[part~=grid] > button:hover {\n  background: #CCC;\n}\n\n[part~=grid] > button > svg {\n  fill: #453C4F;\n  width: 1.5rem;\n  height: 1.5rem;\n}\n\n[part~=grids] > button:focus {\n   background: url(\"data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 44 44'><path fill='rgb(246, 237, 228)' d='M6 4H38C39.11 4 40 4.89 40 6V38C40 39.11 39.11 40 38 40H6C4.89 40 4 39.11 4 38V6C4 4.89 4.89 4 6 4Z' /><path fill='rgb(69, 60, 79)' d='M16.39 39.93C13.91 39.84 11.19 39.81 8.71 39.93C6.23 40.05 5 39.81 4.36 39.27C3.74 38.72 3.93 35.81 4.09 34.74C4.19 32.75 4.16 30.76 4 28.77C3.92 26.87 3.95 24.97 4.09 23.08C4.17 21.38 4.14 19.68 4 18C3.89 16.6 3.89 15.21 4 13.83C4.13 13.45 4.88 13.5 4.94 13.96C5 14.39 4.71 15.93 4.82 18C5.04 19.71 5.11 21.46 5 23.2C4.8 25.05 4.73 26.91 4.82 28.77C5.07 30.75 5.14 32.75 5 34.74C4.76 36.04 4.76 37.36 5 38.66C5.3 39.46 7.15 39.2 8.56 39.09C11.16 38.92 13.78 38.92 16.39 39.09C19.07 39.28 21.77 39.26 24.45 39C27.13 38.84 29.81 38.84 32.5 39C33.95 39.13 34.76 39.09 36.79 39.15C38.82 39.2 38.96 38.2 38.96 37.82V35.29C38.97 34.69 39.89 35.07 39.93 35.29V37.82C39.89 38.93 39.66 39.44 39.13 39.7C38.6 39.96 38.28 40.11 33.97 39.93C29.67 39.76 27.09 39.82 24.58 39.93L20.64 40L16.39 39.93M38.95 33.21C39 32.24 39.03 29.54 38.95 28.88C38.78 27.59 38.78 26.29 38.95 25C39.19 24.47 40.15 24.16 40 25C39.85 26.29 39.85 27.59 40 28.88C40.17 30.2 40 32.9 40 33.21C40 33.41 39.62 33.72 39.3 33.72C39.09 33.72 38.93 33.59 38.94 33.21H38.95M39.15 22.56C38.79 20.59 38.72 18.58 38.96 16.6C39.19 14.63 39.19 12.63 38.96 10.66C38.84 9.47 38.91 8.26 39.15 7.09C39.43 6.23 39 5.29 38.19 4.93C36.96 4.78 35.72 4.76 34.5 4.87L32.55 4.93C31.75 4.88 31.89 4.21 32.85 4.09C32.85 4.09 37.34 3.91 38.3 4.04C39.26 4.18 39.88 4.62 40.08 5.96C40.29 7.31 39.77 8.55 39.9 10.66C40.16 12.63 40.16 14.63 39.9 16.6C39.7 18.64 39.7 20.68 39.9 22.72C39.8 22.84 39.65 22.92 39.5 22.95C39.35 22.95 39.22 22.86 39.15 22.56M4 11.53C4.16 10.75 4.16 9.94 4 9.15C3.8 7.29 3.84 5.88 4.29 5.17C4.72 4.22 5.79 3.75 6.78 4.05C8.42 4.3 10.09 4.3 11.73 4.05C13.12 3.94 14.5 3.94 15.9 4.05C18.04 4.22 20.19 4.22 22.33 4.05C24.5 3.94 26.63 4 28.77 4.28C29.45 4.32 29.19 4.9 28.67 4.88C26.53 4.76 24.38 4.81 22.25 5C20.08 5.21 17.91 5.21 15.76 5C12.4 4.92 13.03 4.86 11.56 5C9.85 5.24 8.12 5.24 6.41 5C5.78 4.76 5.05 5.06 4.79 5.69C4.58 6.89 4.61 8.12 4.86 9.31C5 10.15 5.04 11 4.93 11.86C4.9 11.96 4.72 12.04 4.53 12.04C4.26 12.04 3.96 11.9 4 11.53Z' /></svg>\");\n}\n\n[part~=grids] > button:hover {\n  background: url(\"data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 44 44'><path fill='rgb(246, 237, 228)' d='M6 4H38C39.11 4 40 4.89 40 6V38C40 39.11 39.11 40 38 40H6C4.89 40 4 39.11 4 38V6C4 4.89 4.89 4 6 4Z' /><path fill='rgb(69, 60, 79)' d='M 16.3853,39.932L 15.7864,39.9226L 16.26,40.5207C 16.5467,41.078 18.416,42.2807 18.9587,42.8233C 19.5,43.3647 18.6613,44.162 18.2027,43.458C 17.74,42.7553 17.7293,42.9113 17.0467,42.2233C 16.3693,41.5367 16.412,41.8327 15.6667,40.938C 15.328,40.5619 14.9533,40.2145 14.5489,39.9033L 11.4853,39.8554C 11.8124,40.1401 12.1067,40.4612 12.364,40.812C 12.6507,41.3693 13.0213,41.328 13.5627,41.8693C 14.104,42.412 13.104,42.7347 12.8027,42.344C 12.5053,41.9587 12.516,42.1253 11.7707,41.2347C 11.0267,40.3387 10.5733,40.2813 10.38,40.0267L 10.3289,39.8743L 8.708,39.932C 7.84505,39.9738 7.1316,39.9719 6.54197,39.9287L 7.01,40.5207C 7.29667,41.078 9.166,42.2807 9.70867,42.8233C 10.25,43.3647 9.41133,44.162 8.95267,43.458C 8.49,42.7553 8.47933,42.9113 7.79667,42.2233C 7.11933,41.5367 7.162,41.8327 6.41667,40.938C 6.03133,40.51 5.59933,40.1193 5.13,39.7767L 5.08431,39.6652C 4.78048,39.5591 4.54546,39.4253 4.364,39.2653L 4.14908,38.9149C 3.75384,38.5945 3.40767,38.2168 3.12467,37.7967C 2.838,37.2447 0.968667,36.042 0.427333,35.5007C -0.114,34.9527 0.723333,34.1567 1.182,34.8647C 1.646,35.5673 1.65667,35.4113 2.33267,36.094C 3.01533,36.7807 2.96867,36.49 3.714,37.3807L 3.94445,37.6254C 3.89431,36.591 3.99715,35.3609 4.09333,34.7453C 4.10842,34.4442 4.1205,34.143 4.12959,33.842C 3.60679,33.4763 3.14837,33.0203 2.77067,32.5053C 2.484,31.948 2.11467,31.9893 1.57333,31.448C 1.03067,30.9067 2.03067,30.588 2.328,30.9733C 2.63067,31.364 2.61467,31.1933 3.364,32.088C 3.67619,32.4611 3.93715,32.6879 4.14875,32.8448C 4.15998,31.4834 4.11011,30.1231 4,28.7653L 3.99907,28.744C 3.56208,28.4072 3.18129,28.0019 2.87467,27.5467C 2.588,26.9947 0.718667,25.792 0.177333,25.2507C -0.364,24.7027 0.473333,23.9067 0.932,24.6147C 1.396,25.3173 1.40667,25.1613 2.08267,25.844C 2.76533,26.5307 2.71867,26.24 3.464,27.1307L 3.96424,27.6389C 3.93864,26.3523 3.9653,25.065 4.04462,23.7813C 3.55702,23.4264 3.12777,22.9922 2.77067,22.5053C 2.484,21.948 2.11467,21.9893 1.57333,21.448C 1.03067,20.9067 2.03067,20.588 2.328,20.9733C 2.63067,21.364 2.61467,21.1933 3.364,22.088C 3.65455,22.4352 3.90072,22.6558 4.10402,22.8111C 4.16316,21.2018 4.12886,19.5935 4,17.984L 3.96677,17.51C 3.6468,17.225 3.36328,16.9009 3.12467,16.5467C 2.838,15.9947 0.968667,14.792 0.427333,14.2507C -0.114,13.7027 0.723333,12.9067 1.182,13.6147C 1.646,14.3173 1.65667,14.1613 2.33267,14.844C 3.01533,15.5307 2.96867,15.24 3.714,16.1307L 3.92176,16.3532L 4,13.828C 4.13067,13.4533 4.87467,13.5213 4.94267,13.9587C 5.016,14.3907 4.71333,15.9267 4.82267,17.984C 5.04133,19.7133 5.10933,21.4587 5.02133,23.1973C 4.79733,25.0467 4.72933,26.9067 4.82267,28.7653C 5.07333,30.7493 5.14,32.7493 5.02133,34.7453C 4.77238,36.0005 4.76553,37.2909 5.00078,38.5493L 5.05489,38.7343C 5.4226,39.4414 7.19338,39.1989 8.55733,39.0933C 11.1613,38.9173 13.776,38.9173 16.3853,39.0933C 18.4329,39.2365 20.4859,39.2552 22.5337,39.1481C 22.6239,39.0809 22.7383,39.0603 22.8653,39.1296L 24.4533,39.0107C 27.1307,38.844 29.812,38.844 32.484,39.0107C 33.948,39.1307 34.76,39.0933 36.792,39.1453C 38.8227,39.1973 38.9587,38.1973 38.9587,37.8173L 38.9587,35.2867C 38.9693,34.688 39.8907,35.068 39.932,35.2867L 39.932,37.6131C 40.3487,37.9391 40.7109,38.3317 41.01,38.7707C 41.2967,39.328 43.166,40.5307 43.7087,41.0733C 44.25,41.6147 43.4113,42.412 42.9527,41.708C 42.49,41.0053 42.4793,41.1613 41.7967,40.4733C 41.1193,39.7867 41.162,40.0827 40.4167,39.188L 39.851,38.6173C 39.7391,39.1976 39.5132,39.5152 39.1307,39.7027C 38.7448,39.8902 38.4684,40.0212 36.654,40.0082L 37.364,40.812C 37.6507,41.3693 38.0213,41.328 38.5627,41.8693C 39.104,42.412 38.104,42.7347 37.8027,42.344C 37.5053,41.9587 37.516,42.1253 36.7707,41.2347C 36.0267,40.3387 35.5733,40.2813 35.38,40.0267L 35.3545,39.9819L 33.9733,39.932L 31.7269,39.8589L 32.26,40.5207C 32.5467,41.078 34.416,42.2807 34.9587,42.8233C 35.5,43.3647 34.6613,44.162 34.2027,43.458C 33.74,42.7553 33.7293,42.9113 33.0467,42.2233C 32.3693,41.5367 32.412,41.8327 31.6667,40.938C 31.3029,40.534 30.8975,40.1632 30.4584,39.8346L 27.467,39.8395C 27.8014,40.1281 28.1019,40.4546 28.364,40.812C 28.6507,41.3693 29.0213,41.328 29.5627,41.8693C 30.104,42.412 29.104,42.7347 28.8027,42.344C 28.5053,41.9587 28.516,42.1253 27.7707,41.2347C 27.0267,40.3387 26.5733,40.2813 26.38,40.0267L 26.3283,39.8667L 24.584,39.932L 23.8091,39.9475L 24.26,40.5207C 24.5467,41.078 26.416,42.2807 26.9587,42.8233C 27.5,43.3647 26.6613,44.162 26.2027,43.458C 25.74,42.7553 25.7293,42.9113 25.0467,42.2233C 24.3693,41.5367 24.412,41.8327 23.6667,40.938L 22.6355,39.9709L 20.64,40.0107L 19.6369,39.9921L 20.364,40.812C 20.6507,41.3693 21.0213,41.328 21.5627,41.8693C 22.104,42.412 21.104,42.7347 20.8027,42.344C 20.5053,41.9587 20.516,42.1253 19.7707,41.2347C 19.0267,40.3387 18.5733,40.2813 18.38,40.0267L 18.349,39.9683L 16.3853,39.932 Z M 38.9479,33.2134C 38.9786,32.2454 39.0266,29.5414 38.9479,28.88C 38.7813,27.5934 38.7813,26.2867 38.9479,25C 39.1933,24.4734 40.1453,24.156 40.0053,25L 39.9031,26.3407C 40.332,26.6711 40.7039,27.0717 41.0099,27.5207C 41.2966,28.078 43.1659,29.2807 43.7086,29.8234C 44.2499,30.3647 43.4112,31.162 42.9526,30.458C 42.4899,29.7554 42.4793,29.9114 41.7966,29.2234C 41.1193,28.5367 41.1619,28.8327 40.4166,27.938L 39.8989,27.4116L 40.0053,28.88C 40.0887,29.5643 40.0787,30.6155 40.0532,31.5147C 40.5571,31.874 40.9979,32.3129 41.3639,32.812C 41.6506,33.3693 42.0213,33.328 42.5626,33.8693C 43.1039,34.412 42.1039,34.7347 41.8026,34.344C 41.5053,33.9587 41.5159,34.1253 40.7706,33.2347C 40.4752,32.8789 40.2256,32.6554 40.0199,32.4992L 40.0053,33.2134C 40.0213,33.412 39.6146,33.724 39.2973,33.724C 39.0933,33.724 38.9319,33.5934 38.9426,33.2134L 38.9479,33.2134 Z M 39.1453,22.5627C 38.7866,20.5934 38.7239,18.5841 38.9639,16.5987C 39.1879,14.6254 39.1879,12.6307 38.9639,10.6614C 38.8439,9.46941 38.9066,8.26007 39.1453,7.08808C 39.4319,6.22941 39.0159,5.29208 38.1879,4.92674C 36.9586,4.78141 35.7186,4.76541 34.4839,4.86941L 32.5519,4.92674C 31.839,4.88529 31.8666,4.35466 32.561,4.15249L 31.7706,3.2707C 31.484,2.71337 31.1146,2.7547 30.5733,2.21337C 30.0306,1.67204 31.0306,1.34937 31.328,1.74004C 31.6306,2.12537 31.6146,1.9587 32.364,2.8547C 33.1069,3.74248 33.5597,3.80232 33.7475,4.06018L 37.4524,3.99637L 37.1246,3.56204C 36.838,3.01004 34.9686,1.80737 34.4273,1.26074C 33.886,0.71941 34.7233,-0.0779228 35.182,0.624741C 35.646,1.33274 35.6566,1.17141 36.3326,1.85937C 37.0153,2.54737 36.9686,2.25004 37.714,3.14604L 38.7914,4.15126C 39.0757,4.24283 39.3189,4.38168 39.5178,4.59283L 39.7233,4.70871C 40.2286,5.06205 40.662,5.51004 41.01,6.02071C 41.2966,6.57804 43.1659,7.78071 43.7086,8.32338C 44.2499,8.86471 43.4112,9.66204 42.9526,8.95804C 42.49,8.25537 42.4793,8.41138 41.7966,7.72338C 41.1193,7.03671 41.162,7.33271 40.4166,6.43804L 40.1022,6.1074C 40.2485,7.34326 39.8123,8.51693 39.8872,10.3925L 39.9733,10.4587C 40.5106,10.828 40.9786,11.2867 41.364,11.812C 41.6506,12.3694 42.0213,12.328 42.5626,12.8694C 43.1039,13.412 42.104,13.7347 41.8026,13.344C 41.5053,12.9587 41.516,13.1254 40.7706,12.2347C 40.4618,11.8628 40.203,11.6353 39.9922,11.4783C 40.1222,12.8713 40.1255,14.2738 40.0023,15.6692C 40.3895,15.9838 40.7278,16.3567 41.01,16.7707C 41.2966,17.328 43.1659,18.5307 43.7086,19.0734C 44.2499,19.6147 43.4112,20.412 42.9526,19.708C 42.49,19.0054 42.4793,19.1614 41.7966,18.4734C 41.1193,17.7867 41.162,18.0827 40.4166,17.188L 39.8955,16.6585C 39.7783,17.8842 39.733,19.1133 39.7596,20.3412L 39.9733,20.4587C 40.5106,20.828 40.9786,21.2867 41.364,21.812C 41.6506,22.3694 42.0213,22.328 42.5626,22.8694C 43.1039,23.412 42.104,23.7347 41.8026,23.344C 41.5053,22.9587 41.5159,23.1254 40.7706,22.2347C 40.3589,21.7389 40.0362,21.4999 39.7973,21.3421L 39.9013,22.7187C 39.7973,22.8387 39.6506,22.9214 39.4893,22.948C 39.3546,22.948 39.2239,22.8547 39.1453,22.5627 Z M 3.99999,9.15074C 3.8886,8.09858 3.85326,7.19043 3.92417,6.47162C 3.6216,6.19601 3.35264,5.88511 3.12466,5.54668C 2.838,4.99469 0.968666,3.79202 0.427333,3.25068C -0.114,2.70269 0.723333,1.90668 1.182,2.61469C 1.646,3.31735 1.65667,3.16135 2.33267,3.84402C 3.01533,4.53069 2.96866,4.24002 3.714,5.13068L 4.11984,5.52494L 4.29199,5.16674C 4.72399,4.22408 5.78665,3.74941 6.78131,4.05207L 7.55804,4.14974L 6.77066,3.27069C 6.48399,2.71335 6.11466,2.75469 5.57333,2.21335C 5.03066,1.67202 6.03066,1.34935 6.32799,1.74002C 6.63066,2.12535 6.61466,1.95869 7.36399,2.85469C 8.10933,3.74535 8.56266,3.80268 8.74933,4.06269L 8.80432,4.23001C 9.78101,4.25633 10.7596,4.19703 11.7293,4.05207L 12.2207,4.01791L 11.8747,3.56202C 11.588,3.01002 9.71866,1.80735 9.17733,1.26071C 8.63599,0.719379 9.47333,-0.0779533 9.93199,0.62471C 10.396,1.33271 10.4067,1.17138 11.0827,1.85936C 11.7653,2.54736 11.7187,2.25002 12.464,3.14602L 13.3264,3.97453L 15.896,4.05207L 16.4985,4.09458L 15.7707,3.27069C 15.484,2.71336 15.1147,2.75469 14.5733,2.21336C 14.0307,1.67202 15.0307,1.34936 15.328,1.74002C 15.6307,2.12536 15.6147,1.95869 16.364,2.85469C 17.1093,3.74536 17.5627,3.80269 17.7493,4.06269L 17.7934,4.15609L 20.3452,4.15878L 19.8747,3.56203C 19.588,3.01003 17.7187,1.80736 17.1773,1.26072C 16.636,0.719391 17.4733,-0.0779419 17.932,0.624722C 18.396,1.33272 18.4067,1.17139 19.0827,1.85936C 19.7653,2.54736 19.7187,2.25003 20.464,3.14603L 21.4889,4.10905L 22.3333,4.05207L 24.4,3.9999L 23.7706,3.27069C 23.484,2.71336 23.1146,2.7547 22.5733,2.21336C 22.0306,1.67203 23.0306,1.34936 23.328,1.74003C 23.6306,2.12536 23.6146,1.9587 24.364,2.8547C 25.0748,3.70414 25.5201,3.7956 25.7217,4.0278L 27.687,4.15849L 27.0733,3.41203C 26.7866,2.86003 24.9173,1.65603 24.3746,1.11473C 23.8333,0.568066 24.672,-0.229267 25.136,0.478733C 25.5933,1.18274 25.604,1.02673 26.2866,1.70803C 26.964,2.39603 26.9213,2.10403 27.6666,2.9947C 28.0573,3.4267 28.484,3.81736 28.9533,4.16137L 29.0051,4.3242C 29.3717,4.47285 29.1137,4.89757 28.6719,4.87474C 26.5306,4.75474 24.3799,4.80674 22.2453,5.02141C 20.0826,5.20808 17.912,5.20808 15.7546,5.02141L 13.5927,4.94369C 13.494,5.01292 13.3676,5.0264 13.228,4.92944C 12.5618,4.90575 12.4297,4.92246 11.5573,5.02141C 9.84931,5.23475 8.11998,5.23475 6.41198,5.02141C 5.77598,4.76007 5.05199,5.05741 4.78666,5.68808C 4.58399,6.89074 4.60932,8.12008 4.86399,9.31208C 5.02132,10.1507 5.04132,11.0107 4.93199,11.8547C 4.90132,11.9641 4.71866,12.0361 4.53066,12.0361C 4.3252,12.04 4.11162,11.9635 4.03071,11.7712C 3.54885,11.4181 3.12437,10.9876 2.77066,10.5053C 2.484,9.94802 2.11467,9.98935 1.57333,9.44802C 1.03067,8.90668 2.03067,8.58802 2.328,8.97335C 2.63067,9.36401 2.61467,9.19335 3.364,10.088C 3.65224,10.4325 3.8968,10.6523 4.09917,10.8074C 4.14149,10.2548 4.10843,9.6976 3.99999,9.15074 Z' /></svg>\");\n}\n\n[part~=grid] > button > svg {\n  fill: #453C4F;\n}\n\n[part~=tooltip] {\n  will-change: transform;\n  opacity: 0;\n  transition: opacity 0.2s ease-in;\n  pointer-events: none;\n  visibility: hidden;\n}\n\n[part~=tooltip].visible {\n  visibility: visible;\n  opacity: 1;\n}\n\n[part~=tooltipText] {\n  background: #737E9E;\n  border-radius: 0.25rem;\n  color: #FFF;\n  padding: 0.15rem 0.5rem 0.3rem 0.5rem;\n  white-space: nowrap;\n}\n\n[part~=tooltipArrow] {\n  left: 18px;\n  bottom: -26px;\n}\n\n[part~=tooltipArrow],\n[part~=tooltipArrow]::before {\n  position: absolute;\n  width: 10px;\n  height: 10px;\n}\n\n[part~=tooltipArrow]::before {\n  content: '';\n  transform: rotate(45deg);\n  background: #737E9E;\n}\n\n[part~=grid]::-webkit-scrollbar {\n  width: 1em;\n}\n\n[part~=grid]::-webkit-scrollbar-track {\n  box-shadow: inset 0 0 6px rgba(0,0,0,0.2);\n  border-radius: 0.25rem;\n}\n\n[part~=grid]::-webkit-scrollbar-thumb {\n  background-color: #453C4F;\n  outline: 1px solid slategrey;\n  border-radius: 0.25rem;\n}\n\n[part~=contextMenu] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  background: #737E9E;\n  border-radius: 0.25rem;\n  width: 12rem;\n  display: flex;\n  flex-direction: column;\n  padding: 0.25rem 0;\n  visibility: hidden;\n  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.3);\n}\n\n[part~=contextMenu] > div.section {\n  color: #FFF;\n  font-size: 0.875rem;\n  padding: 0.25rem 0.5rem;\n  cursor: default;\n  font-weight: bold;\n}\n\n[part~=contextMenu] > div.section:not(:first-child) {\n  border-top: 1px solid rgba(255, 255, 255, 0.3);\n  margin-top: 0.5rem;\n}\n\n[part~=contextMenu] > div.group {\n  margin: 0 0.5rem;\n  border: 1px solid rgba(255, 255, 255, 0.2);\n  border-radius: 0.25rem;\n  display: flex;\n  flex-direction: row;\n  overflow: hidden;\n}\n[part~=contextMenu] > div.row > div.group {\n  border: 1px solid rgba(255, 255, 255, 0.2);\n  border-radius: 0.25rem;\n  display: flex;\n  flex-direction: row;\n  flex: 1;\n  overflow: hidden;\n}\n\n[part~=contextMenu] > div.row > div.group:first-child {\n  margin-left: 0.5rem;\n  margin-right: 0.25rem;\n}\n\n[part~=contextMenu] > div.row > div.group:last-child {\n  margin-right: 0.5rem;\n}\n\n[part~=contextMenu] > div.group > button,\n[part~=contextMenu] > div.row > div.group > button {\n  display: flex;\n  flex: 1;\n  padding: 0.25rem;\n  justify-content: center;\n  border: 0;\n  margin: 0;\n  background: transparent;\n  color: #FFF;\n  font-size: 1rem;\n  line-height: 1.25rem;\n  align-items: center;\n  outline: none;\n}\n\n[part~=contextMenu] > button,\n[part~=contextMenu] > a {\n  display: flex;\n  border: 0;\n  margin: 0;\n  padding: 0.125rem 0.5rem;\n  background: transparent;\n  text-align: left;\n  color: #FFF;\n  font-size: 1rem;\n  text-decoration: none;\n  cursor: default;\n  outline: none;\n}\n\n[part~=contextMenu] > div.group > button.active,\n[part~=contextMenu] > div.row > div.group > button.active {\n  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3) inset;\n  background: rgba(0, 0, 0, 0.1);\n}\n\n[part~=contextMenu] > div.group > button.active:hover,\n[part~=contextMenu] > div.row > div.group > button.active:hover {\n  background: rgba(0, 0, 0, 0.2);\n}\n\n[part~=contextMenu] > div.group > button:not(:first-child),\n[part~=contextMenu] > div.row > div.group > button:not(:first-child) {\n  border-left: 1px solid rgba(255, 255, 255, 0.1);\n}\n\n[part~=contextMenu] > div.row > div.group > button > svg,\n[part~=contextMenu] > div.group > button > svg,\n[part~=contextMenu] > div.row > button > svg,\n[part~=contextMenu] > button > svg {\n  width: 1.5rem;\n  height: 1.5rem;\n  align-self: center;\n}\n\n[part~=contextMenu] > div.row > div.group > button:hover,\n[part~=contextMenu] > div.group > button:hover,\n[part~=contextMenu] > button:hover,\n[part~=contextMenu] > a:hover {\n  background: rgba(255, 255, 255, 0.2);\n}\n\n[part~=contextMenu] > div.row > div.group > button:active,\n[part~=contextMenu] > div.group > button:active {\n  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.3) inset;\n  background: rgba(0, 0, 0, 0.2);\n}\n[part~=contextMenu] > button:active,\n[part~=contextMenu] > a:active {\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) inset;\n  background: rgba(0, 0, 0, 0.2);\n}\n\n.row {\n  display: flex;\n}\n\n.divider {\n  border-top: 1px solid rgba(255, 255, 255, 0.3);\n  margin-top: 0.5rem;\n  height: 0.4375rem;\n}\n\n.black {\n  display: inline-flex;\n  border-radius: 50%;\n  width: 1rem;\n  height: 1rem;\n  background: #000;\n}\n\n.white {\n  display: inline-flex;\n  border-radius: 50%;\n  width: 1rem;\n  height: 1rem;\n  background: #FFF;\n}\n\n.download svg {\n  margin-bottom: -0.125rem;\n  margin-left: 0.25rem;\n}\n\n[part~=color] {\n  position: absolute;\n  padding: 0.25rem;\n  background: #737E9E;\n  border-radius: 0.25rem;\n  box-shadow: 0 1px 16px rgba(0, 0, 0, 0.6);\n}\n\n[part~=colorHexRgb] {\n  margin-bottom: 0.25rem;\n}";

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
                const { offsetY, height, viewHeight } = e.detail;
                this.calculate(offsetY, height, viewHeight);
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
            const { size, padding, gap, width, height } = this.getIconMetrics();
            let x = gap;
            let y = gap;
            this.items.forEach(([btn, svg], i) => {
                btn.style.display = i < this.currentCount ? 'block' : 'none';
                btn.style.padding = `${padding}px`;
                btn.style.width = `${width}px`;
                btn.style.height = `${height}px`;
                btn.style.transform = `translate(${x}px, ${y}px)`;
                svg.style.width = `${size}px`;
                svg.style.height = `${size}px`;
                x += width + gap;
                if (i % this.columns === this.columns - 1) {
                    y += height + gap;
                    x = gap;
                }
            });
        }
        calculate(offsetY, height, viewHeight) {
            const rowHeight = this.rowHeight;
            const count = this.icons.length;
            const rows = Math.ceil(viewHeight / rowHeight) + 1;
            const row = Math.floor(offsetY / rowHeight);
            this.$grid.style.transform = `translateY(${-1 * offsetY % rowHeight}px)`;
            if (this.cacheHeight !== height) {
                console.log('syncVirtual');
                this.syncVirtual(rows * this.columns);
                this.cacheHeight = height;
            }
            if (this.currentRow !== row) {
                this.items.forEach(([btn, svg, path], i) => {
                    const index = i + (row * this.columns);
                    if (index < count) {
                        path.setAttribute('d', this.icons[index].data);
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
            return {
                size,
                padding,
                gap,
                width: size + (padding * 2),
                height: size + (padding * 2),
                rowHeight: size + (padding * 2) + gap
            };
        }
        calculateColumns(width, rowHeight) {
            let w = width - this.currentGap;
            return Math.floor(w / rowHeight);
        }
        render() {
            // Calculate Icon Size
            const { size, padding, gap, rowHeight } = this.getIconMetrics();
            if (this.currentSize !== size || this.currentPadding !== padding || this.currentGap !== gap) {
                this.currentSize = size;
                this.currentPadding = padding;
                this.currentGap = gap;
                this.rowHeight = rowHeight;
            }
            // Calculate Columns
            const { width } = this.$scroll.getBoundingClientRect();
            const columns = this.calculateColumns(width, rowHeight);
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
    ], MdiGrid.prototype, "$grids", void 0);
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
