/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"main": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push([0,"node_vendors~main"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var lwc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lwc */ "./node_modules/@lwc/engine/lib/framework/main.js");
/* harmony import */ var lwc__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lwc__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var my_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! my/app */ "./src/modules/my/app/app.js");


const app = Object(lwc__WEBPACK_IMPORTED_MODULE_0__["createElement"])('my-app', {
  is: my_app__WEBPACK_IMPORTED_MODULE_1__["default"]
}); // eslint-disable-next-line @lwc/lwc/no-document-query

document.querySelector('#main').appendChild(app);

/***/ }),

/***/ "./src/modules/mdi/icon/icon.css":
/*!***************************************!*\
  !*** ./src/modules/mdi/icon/icon.css ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function stylesheet(hostSelector, shadowSelector, nativeShadow) {
  return "svg" + shadowSelector + " {width: 1.5rem;height: 1.5rem;}\n";
}
/* harmony default export */ __webpack_exports__["default"] = ([stylesheet]);

/***/ }),

/***/ "./src/modules/mdi/icon/icon.html":
/*!****************************************!*\
  !*** ./src/modules/mdi/icon/icon.html ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _icon_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./icon.css */ "./src/modules/mdi/icon/icon.css");
/* harmony import */ var lwc__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lwc */ "./node_modules/@lwc/engine/lib/framework/main.js");
/* harmony import */ var lwc__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lwc__WEBPACK_IMPORTED_MODULE_1__);




function tmpl($api, $cmp, $slotset, $ctx) {
  const {
    h: api_element,
    gid: api_scoped_id,
    d: api_dynamic
  } = $api;
  return [$cmp.computedIsAriaHidden ? api_element("svg", {
    attrs: {
      "viewBox": "0 0 24 24",
      "aria-labelledby": `${api_scoped_id("title")}`,
      "aria-hidden": "true"
    },
    key: 3
  }, [api_element("path", {
    style: $cmp.computedStyle,
    attrs: {
      "d": $cmp.path
    },
    key: 4
  }, [])]) : null, !$cmp.computedIsAriaHidden ? api_element("svg", {
    attrs: {
      "viewBox": "0 0 24 24",
      "aria-labelledby": `${api_scoped_id("title")}`,
      "role": "presentation"
    },
    key: 6
  }, [api_element("title", {
    attrs: {
      "id": api_scoped_id("title")
    },
    key: 7
  }, [api_dynamic($cmp.label)]), api_element("path", {
    style: $cmp.computedStyle,
    attrs: {
      "d": $cmp.path
    },
    key: 8
  }, [])]) : null];
}

/* harmony default export */ __webpack_exports__["default"] = (Object(lwc__WEBPACK_IMPORTED_MODULE_1__["registerTemplate"])(tmpl));
tmpl.stylesheets = [];

if (_icon_css__WEBPACK_IMPORTED_MODULE_0__["default"]) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _icon_css__WEBPACK_IMPORTED_MODULE_0__["default"])
}
tmpl.stylesheetTokens = {
  hostAttribute: "mdi-icon-_icon-host",
  shadowAttribute: "mdi-icon-_icon"
};


/***/ }),

/***/ "./src/modules/mdi/icon/icon.js":
/*!**************************************!*\
  !*** ./src/modules/mdi/icon/icon.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var lwc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lwc */ "./node_modules/@lwc/engine/lib/framework/main.js");
/* harmony import */ var lwc__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lwc__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _icon_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./icon.html */ "./src/modules/mdi/icon/icon.html");




const DEFAULT_PATH = 'M0 0h24v24H0V0zm2 2v20h20V2H2z';

class Icon extends lwc__WEBPACK_IMPORTED_MODULE_0__["LightningElement"] {
  constructor(...args) {
    super(...args);
    this.path = DEFAULT_PATH;
    this.color = null;
    this.label = null;
  }

  get computedIsAriaHidden() {
    return this.label === null;
  }

  get computedStyle() {
    const style = [];

    if (this.color) {
      style.push(`fill:${this.color};`);
    }

    return style.join(';');
  }

}

Object(lwc__WEBPACK_IMPORTED_MODULE_0__["registerDecorators"])(Icon, {
  publicProps: {
    path: {
      config: 0
    },
    color: {
      config: 0
    },
    label: {
      config: 0
    }
  }
})

/* harmony default export */ __webpack_exports__["default"] = (Object(lwc__WEBPACK_IMPORTED_MODULE_0__["registerComponent"])(Icon, {
  tmpl: _icon_html__WEBPACK_IMPORTED_MODULE_1__["default"]
}));

/***/ }),

/***/ "./src/modules/mdi/stack/stack.css":
/*!*****************************************!*\
  !*** ./src/modules/mdi/stack/stack.css ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function stylesheet(hostSelector, shadowSelector, nativeShadow) {
  return "svg" + shadowSelector + " {width: 1.5rem;height: 1.5rem;}\n";
}
/* harmony default export */ __webpack_exports__["default"] = ([stylesheet]);

/***/ }),

/***/ "./src/modules/mdi/stack/stack.html":
/*!******************************************!*\
  !*** ./src/modules/mdi/stack/stack.html ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _stack_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./stack.css */ "./src/modules/mdi/stack/stack.css");
/* harmony import */ var lwc__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lwc */ "./node_modules/@lwc/engine/lib/framework/main.js");
/* harmony import */ var lwc__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lwc__WEBPACK_IMPORTED_MODULE_1__);




function tmpl($api, $cmp, $slotset, $ctx) {
  const {
    s: api_slot
  } = $api;
  return [api_slot("", {
    key: 2
  }, [], $slotset)];
}

/* harmony default export */ __webpack_exports__["default"] = (Object(lwc__WEBPACK_IMPORTED_MODULE_1__["registerTemplate"])(tmpl));
tmpl.slots = [""];
tmpl.stylesheets = [];

if (_stack_css__WEBPACK_IMPORTED_MODULE_0__["default"]) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _stack_css__WEBPACK_IMPORTED_MODULE_0__["default"])
}
tmpl.stylesheetTokens = {
  hostAttribute: "mdi-stack-_stack-host",
  shadowAttribute: "mdi-stack-_stack"
};


/***/ }),

/***/ "./src/modules/mdi/stack/stack.js":
/*!****************************************!*\
  !*** ./src/modules/mdi/stack/stack.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _stack_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./stack.html */ "./src/modules/mdi/stack/stack.html");
/* harmony import */ var lwc__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lwc */ "./node_modules/@lwc/engine/lib/framework/main.js");
/* harmony import */ var lwc__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lwc__WEBPACK_IMPORTED_MODULE_1__);




class Stack extends lwc__WEBPACK_IMPORTED_MODULE_1__["LightningElement"] {}

/* harmony default export */ __webpack_exports__["default"] = (Object(lwc__WEBPACK_IMPORTED_MODULE_1__["registerComponent"])(Stack, {
  tmpl: _stack_html__WEBPACK_IMPORTED_MODULE_0__["default"]
}));

/***/ }),

/***/ "./src/modules/my/app/app.css":
/*!************************************!*\
  !*** ./src/modules/my/app/app.css ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function stylesheet(hostSelector, shadowSelector, nativeShadow) {
  return ".wrapper" + shadowSelector + " {max-width: calc(65em - 23em);margin: 2rem;color: #111;}\n.aside" + shadowSelector + " {min-width: 20em;background: #f6f4f4;box-shadow: 0 0 0.25rem rgba(0, 0, 0, 0.5);padding-bottom: 1rem;}\n.aside" + shadowSelector + " > ul" + shadowSelector + " {list-style: none;margin: 0;padding: 0;}\n.aside" + shadowSelector + " > ul" + shadowSelector + " > li" + shadowSelector + " {display: block;}\n.aside" + shadowSelector + " > ul" + shadowSelector + " > li" + shadowSelector + " > span" + shadowSelector + " {display: block;padding: 2rem 2rem 1rem 2rem;font-weight: bold;font-size: 1.25rem;}\n.aside" + shadowSelector + " > ul" + shadowSelector + " > li" + shadowSelector + " > span" + shadowSelector + " code" + shadowSelector + " {opacity: 0.5;font-size: 0.875rem;}\n.aside" + shadowSelector + " > ul" + shadowSelector + " > li" + shadowSelector + " > ul" + shadowSelector + " {list-style: none;margin: 0;padding: 0;}\n.aside" + shadowSelector + " > ul" + shadowSelector + " > li" + shadowSelector + " > ul" + shadowSelector + " > li" + shadowSelector + " > a" + shadowSelector + " {display: block;padding: 1rem 2rem;text-decoration: none;color: #111;}\n.aside" + shadowSelector + " > ul" + shadowSelector + " > li" + shadowSelector + " > ul" + shadowSelector + " > li" + shadowSelector + " > a:hover" + shadowSelector + " {background: rgba(3,160,224,.1);}\n.aside" + shadowSelector + " > ul" + shadowSelector + " > li" + shadowSelector + " > ul" + shadowSelector + " > li" + shadowSelector + " > a:active" + shadowSelector + " {background: #128dd8;color: #FFF;}\nh1" + shadowSelector + ", h2" + shadowSelector + ", h3" + shadowSelector + ", h4" + shadowSelector + " {color: #16325c;}\nh1" + shadowSelector + " {font-weight: normal;}\nh1" + shadowSelector + " svg" + shadowSelector + " {width: 2rem;height: 2rem;margin-right: 0.5rem;margin-bottom: -0.29rem;}\nh1" + shadowSelector + " svg" + shadowSelector + " path" + shadowSelector + " {fill: #02a0e0;}\nh2" + shadowSelector + " code" + shadowSelector + " {opacity: 0.75;font-size: 1.25rem;}\n.header-anchor" + shadowSelector + " {color: #02a0e0;text-decoration: none;margin-right: 0.5rem;}\ncode" + shadowSelector + " {font-family: 'Consolas', 'Courier New', Courier, monospace;}\np" + shadowSelector + " {line-height: 1.75rem;}\np" + shadowSelector + " code" + shadowSelector + " {background: rgba(206, 206, 206, 0.3);padding: 0.2rem 0.3rem;color: #333;border-radius: 0.25rem;}\n.example" + shadowSelector + " {margin-bottom: 2rem;}\n.example" + shadowSelector + " div:first-child" + shadowSelector + " {padding: 1rem;border-radius: 0.25rem 0.25rem 0 0;border-top: 1px solid #DDD;border-right: 1px solid #DDD;border-left: 1px solid #DDD;}\n.example" + shadowSelector + " div:last-child" + shadowSelector + " code" + shadowSelector + " pre" + shadowSelector + " {display: block;background: #222;padding: 1rem;border-radius: 0 0 0.25rem 0.25rem;color: #FFF;overflow: auto;margin: 0;}\n@media (min-width: 65em) {.wrapper" + shadowSelector + " {position: relative;padding-left: 23em;margin: 3rem auto;}\n.aside" + shadowSelector + " {position: absolute;top: 0;left: 0;margin: 0;}\n}";
}
/* harmony default export */ __webpack_exports__["default"] = ([stylesheet]);

/***/ }),

/***/ "./src/modules/my/app/app.html":
/*!*************************************!*\
  !*** ./src/modules/my/app/app.html ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _app_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app.css */ "./src/modules/my/app/app.css");
/* harmony import */ var mdi_icon__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mdi/icon */ "./src/modules/mdi/icon/icon.js");
/* harmony import */ var mdi_stack__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mdi/stack */ "./src/modules/mdi/stack/stack.js");
/* harmony import */ var lwc__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lwc */ "./node_modules/@lwc/engine/lib/framework/main.js");
/* harmony import */ var lwc__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lwc__WEBPACK_IMPORTED_MODULE_3__);






function tmpl($api, $cmp, $slotset, $ctx) {
  const {
    t: api_text,
    h: api_element,
    fid: api_scoped_frag_id,
    gid: api_scoped_id,
    c: api_custom_element
  } = $api;
  return [api_element("div", {
    classMap: {
      "wrapper": true
    },
    key: 2
  }, [api_element("div", {
    classMap: {
      "aside": true
    },
    key: 3
  }, [api_element("ul", {
    key: 4
  }, [api_element("li", {
    key: 5
  }, [api_element("span", {
    key: 6
  }, [api_text("Icon "), api_element("code", {
    key: 7
  }, [api_text("mdi-icon")])]), api_element("ul", {
    key: 8
  }, [api_element("li", {
    key: 9
  }, [api_element("a", {
    attrs: {
      "href": api_scoped_frag_id("#icon-basic")
    },
    key: 10
  }, [api_text("Basic")])]), api_element("li", {
    key: 11
  }, [api_element("a", {
    attrs: {
      "href": api_scoped_frag_id("#icon-path")
    },
    key: 12
  }, [api_text("Path Attribute")])]), api_element("li", {
    key: 13
  }, [api_element("a", {
    attrs: {
      "href": api_scoped_frag_id("#icon-color")
    },
    key: 14
  }, [api_text("Color Attribute")])])])]), api_element("li", {
    key: 15
  }, [api_element("span", {
    key: 16
  }, [api_text("Stack "), api_element("code", {
    key: 17
  }, [api_text("mdi-stack")])]), api_element("ul", {
    key: 18
  }, [api_element("li", {
    key: 19
  }, [api_element("a", {
    attrs: {
      "href": api_scoped_frag_id("#stack-basic")
    },
    key: 20
  }, [api_text("Basic")])])])])])]), api_element("h1", {
    key: 21
  }, [api_element("svg", {
    attrs: {
      "viewBox": "0 0 24 24"
    },
    key: 22
  }, [api_element("path", {
    attrs: {
      "d": "M2,2H8V4H16V2H22V8H20V16H22V22H16V20H8V22H2V16H4V8H2V2M16,8V6H8V8H6V16H8V18H16V16H18V8H16M4,4V6H6V4H4M18,4V6H20V4H18M4,18V20H6V18H4M18,18V20H20V18H18Z"
    },
    key: 23
  }, [])]), api_text("MDI Lighting web components")]), api_element("p", {
    key: 24
  }, [api_text("The "), api_element("code", {
    key: 25
  }, [api_text("@mdi/lwc")]), api_text(" module contains two components. The "), api_element("code", {
    key: 26
  }, [api_text("mdi-icon")]), api_text(" component renders a SVG path from the "), api_element("code", {
    key: 27
  }, [api_text("@mdi/js")]), api_text(" module or any SVG path.")]), api_element("h2", {
    attrs: {
      "id": api_scoped_id("icon")
    },
    key: 28
  }, [api_element("a", {
    classMap: {
      "header-anchor": true
    },
    attrs: {
      "href": api_scoped_frag_id("#icon"),
      "aria-hidden": "true"
    },
    key: 29
  }, [api_text("#")]), api_text("Icon Component "), api_element("code", {
    key: 30
  }, [api_text("mdi-icon")])]), api_element("h3", {
    attrs: {
      "id": api_scoped_id("icon-basic")
    },
    key: 31
  }, [api_element("a", {
    classMap: {
      "header-anchor": true
    },
    attrs: {
      "href": api_scoped_frag_id("#icon-basic"),
      "aria-hidden": "true"
    },
    key: 32
  }, [api_text("#")]), api_text("Basic "), api_element("small", {
    key: 33
  }, [api_text("(No Attributes)")])]), api_element("div", {
    classMap: {
      "example": true
    },
    key: 34
  }, [api_element("div", {
    key: 35
  }, [api_custom_element("mdi-icon", mdi_icon__WEBPACK_IMPORTED_MODULE_1__["default"], {
    key: 36
  }, [])]), api_element("div", {
    key: 37
  }, [api_element("code", {
    key: 38
  }, [api_element("pre", {
    key: 39
  }, [api_text("<mdi-icon></mdi-icon>")])])])]), api_element("h3", {
    attrs: {
      "id": api_scoped_id("icon-path")
    },
    key: 40
  }, [api_element("a", {
    classMap: {
      "header-anchor": true
    },
    attrs: {
      "href": api_scoped_frag_id("#icon-path"),
      "aria-hidden": "true"
    },
    key: 41
  }, [api_text("#")]), api_text("Path Attribute")]), api_element("div", {
    classMap: {
      "example": true
    },
    key: 42
  }, [api_element("div", {
    key: 43
  }, [api_custom_element("mdi-icon", mdi_icon__WEBPACK_IMPORTED_MODULE_1__["default"], {
    props: {
      "path": "M12,4C14.21,4 16,5.79 16,8C16,10.21 14.21,12 12,12C9.79,12 8,10.21 8,8C8,5.79 9.79,4 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"
    },
    key: 44
  }, [])]), api_element("div", {
    key: 45
  }, [api_element("code", {
    key: 46
  }, [api_element("pre", {
    key: 47
  }, [api_text("<mdi-icon"), api_element("br", {
    key: 48
  }, []), api_text("\xA0\xA0\xA0\xA0path=\"M12,4C14.21,4 16,5.79 16,8C16,10.21 14.21,12 12,12C9.79,12 8,10.21 8,8C8,5.79 9.79,4 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z\"></mdi-icon>")])])])]), api_element("h3", {
    attrs: {
      "id": api_scoped_id("icon-color")
    },
    key: 49
  }, [api_element("a", {
    classMap: {
      "header-anchor": true
    },
    attrs: {
      "href": api_scoped_frag_id("#icon-color"),
      "aria-hidden": "true"
    },
    key: 50
  }, [api_text("#")]), api_text("Color Attribute")]), api_element("div", {
    classMap: {
      "example": true
    },
    key: 51
  }, [api_element("div", {
    key: 52
  }, [api_custom_element("mdi-icon", mdi_icon__WEBPACK_IMPORTED_MODULE_1__["default"], {
    props: {
      "path": "M12,4C14.21,4 16,5.79 16,8C16,10.21 14.21,12 12,12C9.79,12 8,10.21 8,8C8,5.79 9.79,4 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z",
      "color": "red"
    },
    key: 53
  }, [])]), api_element("div", {
    key: 54
  }, [api_element("code", {
    key: 55
  }, [api_element("pre", {
    key: 56
  }, [api_text("<mdi-icon"), api_element("br", {
    key: 57
  }, []), api_text("\xA0\xA0\xA0\xA0path=\"M12,4C14.21,4 16,5.79 16,8C16,10.21 14.21,12 12,12C9.79,12 8,10.21 8,8C8,5.79 9.79,4 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z\""), api_element("br", {
    key: 58
  }, []), api_text("\xA0\xA0\xA0\xA0color=\"red\"></mdi-icon>")])])])]), api_element("h2", {
    attrs: {
      "id": api_scoped_id("stack-basic")
    },
    key: 59
  }, [api_element("a", {
    classMap: {
      "header-anchor": true
    },
    attrs: {
      "href": api_scoped_frag_id("#stack-basic"),
      "aria-hidden": "true"
    },
    key: 60
  }, [api_text("#")]), api_text("Stack Component "), api_element("code", {
    key: 61
  }, [api_text("mdi-stack")])]), api_element("h3", {
    key: 62
  }, [api_text("Basic")]), api_element("div", {
    classMap: {
      "example": true
    },
    key: 63
  }, [api_element("div", {
    key: 64
  }, [api_custom_element("mdi-stack", mdi_stack__WEBPACK_IMPORTED_MODULE_2__["default"], {
    key: 65
  }, [api_custom_element("mdi-icon", mdi_icon__WEBPACK_IMPORTED_MODULE_1__["default"], {
    key: 66
  }, []), api_custom_element("mdi-icon", mdi_icon__WEBPACK_IMPORTED_MODULE_1__["default"], {
    props: {
      "path": "M12,4C14.21,4 16,5.79 16,8C16,10.21 14.21,12 12,12C9.79,12 8,10.21 8,8C8,5.79 9.79,4 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z",
      "color": "red"
    },
    key: 67
  }, [])])]), api_element("div", {
    key: 68
  }, [api_element("code", {
    key: 69
  }, [api_element("pre", {
    key: 70
  }, [api_text("<mdi-icon"), api_element("br", {
    key: 71
  }, []), api_text("\xA0\xA0\xA0\xA0path=\"M12,4C14.21,4 16,5.79 16,8C16,10.21 14.21,12 12,12C9.79,12 8,10.21 8,8C8,5.79 9.79,4 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z\""), api_element("br", {
    key: 72
  }, []), api_text("\xA0\xA0\xA0\xA0color=\"red\"></mdi-icon>")])])])])])];
}

/* harmony default export */ __webpack_exports__["default"] = (Object(lwc__WEBPACK_IMPORTED_MODULE_3__["registerTemplate"])(tmpl));
tmpl.stylesheets = [];

if (_app_css__WEBPACK_IMPORTED_MODULE_0__["default"]) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _app_css__WEBPACK_IMPORTED_MODULE_0__["default"])
}
tmpl.stylesheetTokens = {
  hostAttribute: "my-app-_app-host",
  shadowAttribute: "my-app-_app"
};


/***/ }),

/***/ "./src/modules/my/app/app.js":
/*!***********************************!*\
  !*** ./src/modules/my/app/app.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _app_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app.html */ "./src/modules/my/app/app.html");
/* harmony import */ var lwc__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lwc */ "./node_modules/@lwc/engine/lib/framework/main.js");
/* harmony import */ var lwc__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lwc__WEBPACK_IMPORTED_MODULE_1__);




class App extends lwc__WEBPACK_IMPORTED_MODULE_1__["LightningElement"] {}

/* harmony default export */ __webpack_exports__["default"] = (Object(lwc__WEBPACK_IMPORTED_MODULE_1__["registerComponent"])(App, {
  tmpl: _app_html__WEBPACK_IMPORTED_MODULE_0__["default"]
}));

/***/ }),

/***/ 0:
/*!*******************************************************************************************!*\
  !*** multi ./node_modules/error-overlay-webpack-plugin/lib/entry-basic.js ./src/index.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! C:\Users\admin\Documents\GitHub\playground\node_modules\error-overlay-webpack-plugin\lib\entry-basic.js */"./node_modules/error-overlay-webpack-plugin/lib/entry-basic.js");
module.exports = __webpack_require__(/*! C:\Users\admin\Documents\GitHub\playground\src\index.js */"./src/index.js");


/***/ })

/******/ });
//# sourceMappingURL=app.js.map