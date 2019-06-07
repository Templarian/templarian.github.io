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
/******/
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
/* harmony import */ var demo_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! demo/app */ "./src/modules/demo/app/app.js");


const app = Object(lwc__WEBPACK_IMPORTED_MODULE_0__["createElement"])('demo-app', {
  is: demo_app__WEBPACK_IMPORTED_MODULE_1__["default"]
}); // eslint-disable-next-line @lwc/lwc/no-document-query

document.querySelector('#main').appendChild(app);

/***/ }),

/***/ "./src/modules/demo/apiTable/apiTable.css":
/*!************************************************!*\
  !*** ./src/modules/demo/apiTable/apiTable.css ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function stylesheet(hostSelector, shadowSelector, nativeShadow) {
  return "\n" + (nativeShadow ? (":host {display: block;border: 1px solid #16325c;border-radius: 0.25rem;padding: 0.5rem;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);margin-top: 1rem;}") : (hostSelector + " {display: block;border: 1px solid #16325c;border-radius: 0.25rem;padding: 0.5rem;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);margin-top: 1rem;}")) + "\ntable" + shadowSelector + " {width: 100%;border-spacing: 0;line-height: 1.25rem;}\ntable" + shadowSelector + " th" + shadowSelector + " {border-bottom: 1px solid #16325c;padding: 0.2rem 0.25rem;text-align: left;}\ntable" + shadowSelector + " tr:not(:last-child)" + shadowSelector + " td" + shadowSelector + " {border-bottom: 1px dotted #16325c;}\ntable" + shadowSelector + " tr" + shadowSelector + " td:not(:last-child)" + shadowSelector + " {border-right: 1px dotted #16325c;}\ntable" + shadowSelector + " td" + shadowSelector + " {padding: 0.2rem 0.25rem;}\n";
}
/* harmony default export */ __webpack_exports__["default"] = ([stylesheet]);

/***/ }),

/***/ "./src/modules/demo/apiTable/apiTable.html":
/*!*************************************************!*\
  !*** ./src/modules/demo/apiTable/apiTable.html ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _apiTable_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./apiTable.css */ "./src/modules/demo/apiTable/apiTable.css");
/* harmony import */ var lwc__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lwc */ "./node_modules/@lwc/engine/lib/framework/main.js");
/* harmony import */ var lwc__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lwc__WEBPACK_IMPORTED_MODULE_1__);




function tmpl($api, $cmp, $slotset, $ctx) {
  const {
    t: api_text,
    h: api_element,
    d: api_dynamic,
    k: api_key,
    i: api_iterator,
    f: api_flatten
  } = $api;
  return [api_element("table", {
    key: 2
  }, [api_element("tbody", {
    key: 3
  }, api_flatten([api_element("tr", {
    key: 4
  }, [api_element("th", {
    key: 5
  }, [api_text("Name")]), api_element("th", {
    key: 6
  }, [api_text("Type")]), api_element("th", {
    key: 7
  }, [api_text("Description")])]), api_iterator($cmp.items, function (item) {
    return api_element("tr", {
      key: api_key(9, item.name)
    }, [api_element("td", {
      key: 10
    }, [api_dynamic(item.name)]), api_element("td", {
      key: 11
    }, api_iterator(item.types, function (itValue, itIndex, itFirst, itLast) {
      return [api_element("code", {
        key: api_key(13, itValue)
      }, [api_dynamic(itValue)]), !itLast ? api_text(", ") : null];
    })), api_element("td", {
      key: 15
    }, [api_dynamic(item.description)])]);
  })]))])];
}

/* harmony default export */ __webpack_exports__["default"] = (Object(lwc__WEBPACK_IMPORTED_MODULE_1__["registerTemplate"])(tmpl));
tmpl.stylesheets = [];

if (_apiTable_css__WEBPACK_IMPORTED_MODULE_0__["default"]) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _apiTable_css__WEBPACK_IMPORTED_MODULE_0__["default"])
}
tmpl.stylesheetTokens = {
  hostAttribute: "demo-apiTable-_apiTable-host",
  shadowAttribute: "demo-apiTable-_apiTable"
};


/***/ }),

/***/ "./src/modules/demo/apiTable/apiTable.js":
/*!***********************************************!*\
  !*** ./src/modules/demo/apiTable/apiTable.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var lwc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lwc */ "./node_modules/@lwc/engine/lib/framework/main.js");
/* harmony import */ var lwc__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lwc__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _apiTable_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./apiTable.html */ "./src/modules/demo/apiTable/apiTable.html");





class ApiTable extends lwc__WEBPACK_IMPORTED_MODULE_0__["LightningElement"] {
  constructor(...args) {
    super(...args);
    this.jsdoc = [];
  }

  get items() {
    var items = this.jsdoc.filter(x => x.kind === "ClassProperty");
    return items;
  }

}

Object(lwc__WEBPACK_IMPORTED_MODULE_0__["registerDecorators"])(ApiTable, {
  publicProps: {
    jsdoc: {
      config: 0
    }
  }
})

/* harmony default export */ __webpack_exports__["default"] = (Object(lwc__WEBPACK_IMPORTED_MODULE_0__["registerComponent"])(ApiTable, {
  tmpl: _apiTable_html__WEBPACK_IMPORTED_MODULE_1__["default"]
}));

/***/ }),

/***/ "./src/modules/demo/app/app.css":
/*!**************************************!*\
  !*** ./src/modules/demo/app/app.css ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function stylesheet(hostSelector, shadowSelector, nativeShadow) {
  return ".mobile-menu" + shadowSelector + " {display: block;box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);background: #f6f4f4;padding: 0.5rem 2rem;}\n.mobile-menu" + shadowSelector + " svg" + shadowSelector + " {width: 3rem;height: 3rem;vertical-align: middle;}\n.mobile-menu" + shadowSelector + " svg" + shadowSelector + " path" + shadowSelector + " {fill: #16325c;}\n.wrapper" + shadowSelector + " {max-width: calc(65em - 23em);margin: 2rem;color: #16325c;}\n.aside" + shadowSelector + " {width: auto;}\n.aside" + shadowSelector + " .details" + shadowSelector + " {padding: 1.5em 2em;text-align: center;display: none;}\n.aside" + shadowSelector + " .details" + shadowSelector + " a" + shadowSelector + " {border: 1px solid #DDD;border-radius: 0.25rem;text-decoration: none;padding: 0.25rem 0.5rem;color: #02a0e0;}\n.aside" + shadowSelector + " .details" + shadowSelector + " a:hover" + shadowSelector + " {background: #02a0e0;color: #FFF;border-color: #02a0e0;}\n.card" + shadowSelector + " {background: #f6f4f4;box-shadow: 0 0 0.25rem rgba(0, 0, 0, 0.5);padding-bottom: 1rem;}\n.card" + shadowSelector + " > ul" + shadowSelector + " {list-style: none;margin: 0;padding: 0;}\n.card" + shadowSelector + " > ul" + shadowSelector + " > li" + shadowSelector + " {display: block;line-height: 1rem;}\n.card" + shadowSelector + " > ul" + shadowSelector + " > li" + shadowSelector + " > span" + shadowSelector + " {display: block;padding: 2rem 2rem 1rem 2rem;font-weight: bold;font-size: 1.25rem;}\n.card" + shadowSelector + " > ul" + shadowSelector + " > li" + shadowSelector + " > span" + shadowSelector + " code" + shadowSelector + " {opacity: 0.5;font-size: 0.875rem;color: #16325c;background: transparent;}\n.card" + shadowSelector + " > ul" + shadowSelector + " > li" + shadowSelector + " > ul" + shadowSelector + " {list-style: none;margin: 0;padding: 0;}\n.card" + shadowSelector + " > ul" + shadowSelector + " > li" + shadowSelector + " > ul" + shadowSelector + " > li" + shadowSelector + " {line-height: 1rem;}\n.card" + shadowSelector + " > ul" + shadowSelector + " > li" + shadowSelector + " > ul" + shadowSelector + " > li" + shadowSelector + " > a" + shadowSelector + " {display: block;padding: 1rem 2rem;text-decoration: none;color: #111;}\n.card" + shadowSelector + " > ul" + shadowSelector + " > li" + shadowSelector + " > ul" + shadowSelector + " > li" + shadowSelector + " > a:hover" + shadowSelector + " {background: rgba(3,160,224,.1);}\n.card" + shadowSelector + " > ul" + shadowSelector + " > li" + shadowSelector + " > ul" + shadowSelector + " > li" + shadowSelector + " > a:active" + shadowSelector + " {background: #128dd8;color: #FFF;}\n.card" + shadowSelector + " .error" + shadowSelector + " {padding: 0.5rem;margin-left: 2rem;margin-right: 2rem;line-height: 1.5rem;}\n.card" + shadowSelector + " .loading" + shadowSelector + " {text-align: center;margin-top: 2rem;}\n.card" + shadowSelector + " .loading" + shadowSelector + " svg" + shadowSelector + " {width: 4rem;height: 4rem;}\n.card" + shadowSelector + " .loading" + shadowSelector + " svg" + shadowSelector + " path" + shadowSelector + " {fill: #02a0e0;}\nh1" + shadowSelector + ", h2" + shadowSelector + ", h3" + shadowSelector + ", h4" + shadowSelector + " {color: #16325c;}\nh1" + shadowSelector + " {font-weight: normal;}\nh1" + shadowSelector + " svg" + shadowSelector + " {width: 2rem;height: 2rem;margin-right: 0.5rem;margin-bottom: -0.29rem;}\nh1" + shadowSelector + " svg" + shadowSelector + " path" + shadowSelector + " {fill: #02a0e0;}\nh2" + shadowSelector + " code" + shadowSelector + " {opacity: 0.75;font-size: 1.25rem;}\n.header-anchor" + shadowSelector + " {color: #02a0e0;text-decoration: none;margin-right: 0.5rem;}\ncode" + shadowSelector + " {font-family: 'Consolas', 'Courier New', Courier, monospace;}\np" + shadowSelector + " {line-height: 1.75rem;}\nul" + shadowSelector + " li" + shadowSelector + " {line-height: 1.75rem;}\np" + shadowSelector + " code" + shadowSelector + ",ul" + shadowSelector + " li" + shadowSelector + " code" + shadowSelector + " {background: rgba(206, 206, 206, 0.3);padding: 0.2rem 0.3rem;color: #333;border-radius: 0.25rem;}\n.example" + shadowSelector + " {margin-bottom: 2rem;}\n.example" + shadowSelector + " div:first-child" + shadowSelector + " {padding: 1rem;border-radius: 0.25rem 0.25rem 0 0;border-top: 1px solid #DDD;border-right: 1px solid #DDD;border-left: 1px solid #DDD;}\n.example" + shadowSelector + " div:last-child" + shadowSelector + " code" + shadowSelector + " pre" + shadowSelector + " {display: block;background: #222;padding: 1rem;border-radius: 0 0 0.25rem 0.25rem;color: #FFF;overflow: auto;margin: 0;}\ndiv.error" + shadowSelector + " {background: #ffe6e5;border: 2px solid #e0002e;padding: 0.25rem 1.5rem;border-radius: 0.5rem;}\ndiv.error" + shadowSelector + " code" + shadowSelector + " {background: rgba(224, 0, 46, 0.05);color: #111;}\ndiv.error" + shadowSelector + " ul" + shadowSelector + " {margin: 0;padding: 0 0.25rem;}\n.tabs" + shadowSelector + " {border-bottom: 1px solid #16325c;}\n.tabs" + shadowSelector + " ul" + shadowSelector + " {list-style: none;padding: 0;margin-bottom: 0;}\n.tabs" + shadowSelector + " ul" + shadowSelector + " li" + shadowSelector + " {display: inline-block;}\n.tabs" + shadowSelector + " ul" + shadowSelector + " li" + shadowSelector + " button" + shadowSelector + " {border-top: 1px solid #16325c;border-right: 1px solid #16325c;border-bottom: 0;border-left: 1px solid #16325c;background: #FFF;padding: 0.5rem 1rem;}\n.tabs" + shadowSelector + " ul" + shadowSelector + " li:first-child" + shadowSelector + " button" + shadowSelector + " {border-radius: 0.25rem 0 0 0;}\n.tabs" + shadowSelector + " ul" + shadowSelector + " li:last-child" + shadowSelector + " button" + shadowSelector + " {border-left: 0;border-radius: 0 0.25rem 0 0;}\n.tab-contents" + shadowSelector + " {border-bottom: 1px solid #16325c;border-left: 1px solid #16325c;border-right: 1px solid #16325c;border-radius: 0 0 0.25rem 0.25rem;}\n.tab-contents" + shadowSelector + " pre" + shadowSelector + " {margin: 0;}\n@media (min-width: 65em) {.mobile-menu" + shadowSelector + " {display: none;}\n.wrapper" + shadowSelector + " {position: relative;padding-left: 23em;margin: 3rem auto;}\n.aside" + shadowSelector + " {position: absolute;top: 0;left: 0;margin: 0;width: 20em;}\n.aside" + shadowSelector + " .details" + shadowSelector + " {display: block;}\n}.spin" + shadowSelector + " {animation: spin 2s infinite linear;}\n@keyframes spin {0% {-webkit-transform: rotate(0deg);transform: rotate(0deg);}\n100% {-webkit-transform: rotate(359deg);transform: rotate(359deg);}\n}";
}
/* harmony default export */ __webpack_exports__["default"] = ([stylesheet]);

/***/ }),

/***/ "./src/modules/demo/app/app.html":
/*!***************************************!*\
  !*** ./src/modules/demo/app/app.html ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _app_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app.css */ "./src/modules/demo/app/app.css");
/* harmony import */ var demo_description__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! demo/description */ "./src/modules/demo/description/description.js");
/* harmony import */ var demo_apiTable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! demo/apiTable */ "./src/modules/demo/apiTable/apiTable.js");
/* harmony import */ var mdi_icon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! mdi/icon */ "./src/modules/mdi/icon/icon.js");
/* harmony import */ var mdi_stack__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! mdi/stack */ "./src/modules/mdi/stack/stack.js");
/* harmony import */ var lwc__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lwc */ "./node_modules/@lwc/engine/lib/framework/main.js");
/* harmony import */ var lwc__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(lwc__WEBPACK_IMPORTED_MODULE_5__);








function tmpl($api, $cmp, $slotset, $ctx) {
  const {
    h: api_element,
    d: api_dynamic,
    t: api_text,
    fid: api_scoped_frag_id,
    k: api_key,
    i: api_iterator,
    f: api_flatten,
    gid: api_scoped_id,
    c: api_custom_element
  } = $api;
  return [api_element("div", {
    classMap: {
      "mobile-menu": true
    },
    key: 2
  }, [api_element("svg", {
    attrs: {
      "viewBox": "0 0 24 24"
    },
    key: 3
  }, [api_element("path", {
    attrs: {
      "d": "M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"
    },
    key: 4
  }, [])]), api_element("svg", {
    attrs: {
      "viewBox": "0 0 24 24"
    },
    key: 5
  }, [api_element("path", {
    attrs: {
      "d": "M21,15.61L19.59,17L14.58,12L19.59,7L21,8.39L17.44,12L21,15.61M3,6H16V8H3V6M3,13V11H13V13H3M3,18V16H16V18H3Z"
    },
    key: 6
  }, [])])]), api_element("div", {
    classMap: {
      "wrapper": true
    },
    key: 7
  }, api_flatten([api_element("div", {
    classMap: {
      "aside": true
    },
    key: 8
  }, [api_element("div", {
    classMap: {
      "card": true
    },
    key: 9
  }, [$cmp.isLoading ? api_element("div", {
    classMap: {
      "loading": true
    },
    key: 11
  }, [api_element("svg", {
    classMap: {
      "spin": true
    },
    attrs: {
      "viewBox": "0 0 24 24"
    },
    key: 12
  }, [api_element("path", {
    attrs: {
      "d": "M12,4V2C6.48,2 2,6.48 2,12H4C4,7.58 7.58,4 12,4Z"
    },
    key: 13
  }, [])])]) : null, $cmp.selectedNamespace ? api_element("ul", {
    key: 15
  }, api_iterator($cmp.selectedNamespace.components, function (component) {
    return api_element("li", {
      key: api_key(17, component.name)
    }, [api_element("span", {
      key: 18
    }, [api_dynamic(component.name), api_text(" "), api_element("code", {
      key: 19
    }, [api_dynamic(component.tag)])]), api_element("ul", {
      key: 20
    }, api_flatten([!component.hasExamplesFolder ? api_element("div", {
      classMap: {
        "error": true
      },
      key: 22
    }, [api_element("code", {
      key: 23
    }, [api_dynamic(component.namespace), api_text("/"), api_dynamic(component.name), api_text("/__examples__")]), api_text(" missing.")]) : null, component.examples.length ? api_iterator(component.examples, function (example) {
      return api_element("li", {
        key: api_key(26, example.name)
      }, [api_element("a", {
        attrs: {
          "href": api_scoped_frag_id("#icon-basic")
        },
        key: 27
      }, [api_dynamic(example.name)])]);
    }) : []]))]);
  })) : null]), api_element("div", {
    classMap: {
      "details": true
    },
    key: 28
  }, [api_text("View "), api_element("a", {
    attrs: {
      "href": "demo.json"
    },
    key: 29
  }, [api_text("demo.json")])])]), $cmp.isLoading ? api_element("h1", {
    key: 31
  }, [api_element("svg", {
    classMap: {
      "spin": true
    },
    attrs: {
      "viewBox": "0 0 24 24"
    },
    key: 32
  }, [api_element("path", {
    attrs: {
      "d": "M12,4V2C6.48,2 2,6.48 2,12H4C4,7.58 7.58,4 12,4Z"
    },
    key: 33
  }, [])]), api_text("Loading...")]) : null, $cmp.isLoading ? api_element("p", {
    key: 34
  }, [api_text("Loading "), api_element("code", {
    key: 35
  }, [api_text("data.json")]), api_text("...")]) : null, $cmp.moreThanOneNamespace ? api_element("div", {
    classMap: {
      "error": true
    },
    key: 37
  }, [api_element("p", {
    key: 38
  }, api_flatten([api_element("strong", {
    key: 39
  }, [api_text("Error:")]), api_text(" Excluding"), !$cmp.excludes.length ? api_element("span", {
    key: 41
  }, [api_text(" no ")]) : null, $cmp.excludes.length ? api_iterator($cmp.excludes, function (itValue, itIndex, itFirst, itLast) {
    return [api_element("code", {
      key: api_key(44, itValue)
    }, [api_dynamic(itValue)]), !itLast ? api_text(", ") : null];
  }) : [], api_element("span", {
    key: 46
  }, [api_text("namespaces, but found ")]), api_iterator($cmp.namespaces, function (itValue, itIndex, itFirst, itLast) {
    return [api_element("code", {
      key: api_key(48, itValue.name)
    }, [api_dynamic(itValue.name)]), !itLast ? api_text(", ") : null];
  }), api_text(". Only one namespace is supported at this time.")])), api_element("ul", {
    key: 50
  }, [api_element("li", {
    key: 51
  }, [api_text("Add "), api_element("code", {
    key: 52
  }, [api_text("includes: [\"namespace\"]")]), api_text(" to the "), api_element("code", {
    key: 53
  }, [api_text("webpack.config.js")]), api_text(".")]), api_element("li", {
    key: 54
  }, [api_text("Or append additional namespaces to the "), api_element("code", {
    key: 55
  }, [api_text("excludes")]), api_text(" in "), api_element("code", {
    key: 56
  }, [api_text("webpack.config.js")]), api_text(".")])])]) : null, api_element("h1", {
    key: 57
  }, [api_element("svg", {
    attrs: {
      "viewBox": "0 0 24 24"
    },
    key: 58
  }, [api_element("path", {
    attrs: {
      "d": "M2,2H8V4H16V2H22V8H20V16H22V22H16V20H8V22H2V16H4V8H2V2M16,8V6H8V8H6V16H8V18H16V16H18V8H16M4,4V6H6V4H4M18,4V6H20V4H18M4,18V20H6V18H4M18,18V20H20V18H18Z"
    },
    key: 59
  }, [])]), api_text("MDI Lighting web components")]), api_element("p", {
    key: 60
  }, [api_text("The "), api_element("code", {
    key: 61
  }, [api_text("@mdi/lwc")]), api_text(" module contains two components. The "), api_element("code", {
    key: 62
  }, [api_text("mdi-icon")]), api_text(" component renders a SVG path from the "), api_element("code", {
    key: 63
  }, [api_text("@mdi/js")]), api_text(" module or any SVG path.")]), $cmp.selectedNamespace ? api_iterator($cmp.selectedNamespace.components, function (component) {
    return api_element("section", {
      key: api_key(66, component.name)
    }, api_flatten([api_element("h2", {
      attrs: {
        "id": api_scoped_id(component.name)
      },
      key: 67
    }, [api_element("a", {
      classMap: {
        "header-anchor": true
      },
      attrs: {
        "href": api_scoped_frag_id("#tag"),
        "aria-hidden": "true"
      },
      key: 68
    }, [api_text("#")]), api_element("span", {
      key: 69
    }, [api_dynamic(component.name), api_text(" "), api_element("code", {
      key: 70
    }, [api_dynamic(component.tag)])])]), component.jsdoc.length ? api_custom_element("demo-description", demo_description__WEBPACK_IMPORTED_MODULE_1__["default"], {
      props: {
        "jsdoc": component.jsdoc
      },
      key: 72
    }, []) : null, component.jsdoc.length ? api_custom_element("demo-api-table", demo_apiTable__WEBPACK_IMPORTED_MODULE_2__["default"], {
      props: {
        "jsdoc": component.jsdoc
      },
      key: 73
    }, []) : null, !component.hasExamplesFolder ? api_element("div", {
      classMap: {
        "error": true
      },
      key: 75
    }, [api_element("code", {
      key: 76
    }, [api_dynamic(component.namespace), api_text("/"), api_dynamic(component.name), api_text("/__examples__")]), api_text(" missing.")]) : null, component.examples.length ? api_iterator(component.examples, function (example) {
      return api_element("section", {
        key: api_key(79, example.name)
      }, [api_element("h3", {
        attrs: {
          "id": api_scoped_id(example.name)
        },
        key: 80
      }, [api_element("a", {
        classMap: {
          "header-anchor": true
        },
        attrs: {
          "href": api_scoped_frag_id("#icon-basic"),
          "aria-hidden": "true"
        },
        key: 81
      }, [api_text("#")]), api_dynamic(example.name), api_text(" "), api_element("small", {
        key: 82
      }, [api_text("("), api_dynamic(example.subName), api_text(")")])]), example.errors.length ? api_element("div", {
        classMap: {
          "error": true
        },
        key: 84
      }, [api_element("ul", {
        key: 85
      }, api_iterator(example.errors, function (error) {
        return api_element("li", {
          key: api_key(87, error.code)
        }, [api_dynamic(error.message)]);
      }))]) : null, example.files.length ? api_element("div", {
        classMap: {
          "tabs": true
        },
        key: 89
      }, [api_element("ul", {
        key: 90
      }, api_iterator(example.files, function (file) {
        return api_element("li", {
          key: api_key(92, file.name)
        }, [api_element("button", {
          key: 93
        }, [api_dynamic(file.name)])]);
      }))]) : null, example.files.length ? api_element("div", {
        classMap: {
          "tab-contents": true
        },
        key: 94
      }, api_iterator(example.files, function (file) {
        return api_element("pre", {
          key: api_key(96, file.name)
        }, [api_element("code", {
          key: 97
        }, [api_dynamic(file.source)])]);
      })) : null]);
    }) : []]));
  }) : [], api_element("hr", {
    key: 98
  }, []), api_element("h2", {
    attrs: {
      "id": api_scoped_id("icon")
    },
    key: 99
  }, [api_element("a", {
    classMap: {
      "header-anchor": true
    },
    attrs: {
      "href": api_scoped_frag_id("#icon"),
      "aria-hidden": "true"
    },
    key: 100
  }, [api_text("#")]), api_text("Icon Component "), api_element("code", {
    key: 101
  }, [api_text("mdi-icon")])]), api_element("h3", {
    attrs: {
      "id": api_scoped_id("icon-basic")
    },
    key: 102
  }, [api_element("a", {
    classMap: {
      "header-anchor": true
    },
    attrs: {
      "href": api_scoped_frag_id("#icon-basic"),
      "aria-hidden": "true"
    },
    key: 103
  }, [api_text("#")]), api_text("Basic "), api_element("small", {
    key: 104
  }, [api_text("(No Attributes)")])]), api_element("div", {
    classMap: {
      "example": true
    },
    key: 105
  }, [api_element("div", {
    key: 106
  }, [api_custom_element("mdi-icon", mdi_icon__WEBPACK_IMPORTED_MODULE_3__["default"], {
    key: 107
  }, [])]), api_element("div", {
    key: 108
  }, [api_element("code", {
    key: 109
  }, [api_element("pre", {
    key: 110
  }, [api_text("<mdi-icon></mdi-icon>")])])])]), api_element("h3", {
    attrs: {
      "id": api_scoped_id("icon-path")
    },
    key: 111
  }, [api_element("a", {
    classMap: {
      "header-anchor": true
    },
    attrs: {
      "href": api_scoped_frag_id("#icon-path"),
      "aria-hidden": "true"
    },
    key: 112
  }, [api_text("#")]), api_text("Path Attribute")]), api_element("div", {
    classMap: {
      "example": true
    },
    key: 113
  }, [api_element("div", {
    key: 114
  }, [api_custom_element("mdi-icon", mdi_icon__WEBPACK_IMPORTED_MODULE_3__["default"], {
    props: {
      "path": "M12,4C14.21,4 16,5.79 16,8C16,10.21 14.21,12 12,12C9.79,12 8,10.21 8,8C8,5.79 9.79,4 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"
    },
    key: 115
  }, [])]), api_element("div", {
    key: 116
  }, [api_element("code", {
    key: 117
  }, [api_element("pre", {
    key: 118
  }, [api_text("<mdi-icon"), api_element("br", {
    key: 119
  }, []), api_text("\xA0\xA0\xA0\xA0path=\"M12,4C14.21,4 16,5.79 16,8C16,10.21 14.21,12 12,12C9.79,12 8,10.21 8,8C8,5.79 9.79,4 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z\"></mdi-icon>")])])])]), api_element("h3", {
    attrs: {
      "id": api_scoped_id("icon-color")
    },
    key: 120
  }, [api_element("a", {
    classMap: {
      "header-anchor": true
    },
    attrs: {
      "href": api_scoped_frag_id("#icon-color"),
      "aria-hidden": "true"
    },
    key: 121
  }, [api_text("#")]), api_text("Color Attribute")]), api_element("div", {
    classMap: {
      "example": true
    },
    key: 122
  }, [api_element("div", {
    key: 123
  }, [api_custom_element("mdi-icon", mdi_icon__WEBPACK_IMPORTED_MODULE_3__["default"], {
    props: {
      "path": "M12,4C14.21,4 16,5.79 16,8C16,10.21 14.21,12 12,12C9.79,12 8,10.21 8,8C8,5.79 9.79,4 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z",
      "color": "red"
    },
    key: 124
  }, [])]), api_element("div", {
    key: 125
  }, [api_element("code", {
    key: 126
  }, [api_element("pre", {
    key: 127
  }, [api_text("<mdi-icon"), api_element("br", {
    key: 128
  }, []), api_text("\xA0\xA0\xA0\xA0path=\"M12,4C14.21,4 16,5.79 16,8C16,10.21 14.21,12 12,12C9.79,12 8,10.21 8,8C8,5.79 9.79,4 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z\""), api_element("br", {
    key: 129
  }, []), api_text("\xA0\xA0\xA0\xA0color=\"red\"></mdi-icon>")])])])]), api_element("h2", {
    attrs: {
      "id": api_scoped_id("stack-basic")
    },
    key: 130
  }, [api_element("a", {
    classMap: {
      "header-anchor": true
    },
    attrs: {
      "href": api_scoped_frag_id("#stack-basic"),
      "aria-hidden": "true"
    },
    key: 131
  }, [api_text("#")]), api_text("Stack Component "), api_element("code", {
    key: 132
  }, [api_text("mdi-stack")])]), api_element("h3", {
    key: 133
  }, [api_text("Basic")]), api_element("div", {
    classMap: {
      "example": true
    },
    key: 134
  }, [api_element("div", {
    key: 135
  }, [api_custom_element("mdi-stack", mdi_stack__WEBPACK_IMPORTED_MODULE_4__["default"], {
    key: 136
  }, [api_custom_element("mdi-icon", mdi_icon__WEBPACK_IMPORTED_MODULE_3__["default"], {
    key: 137
  }, []), api_custom_element("mdi-icon", mdi_icon__WEBPACK_IMPORTED_MODULE_3__["default"], {
    props: {
      "path": "M12,4C14.21,4 16,5.79 16,8C16,10.21 14.21,12 12,12C9.79,12 8,10.21 8,8C8,5.79 9.79,4 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z",
      "color": "red"
    },
    key: 138
  }, [])])]), api_element("div", {
    key: 139
  }, [api_element("code", {
    key: 140
  }, [api_element("pre", {
    key: 141
  }, [api_text("<mdi-icon"), api_element("br", {
    key: 142
  }, []), api_text("\xA0\xA0\xA0\xA0path=\"M12,4C14.21,4 16,5.79 16,8C16,10.21 14.21,12 12,12C9.79,12 8,10.21 8,8C8,5.79 9.79,4 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z\""), api_element("br", {
    key: 143
  }, []), api_text("\xA0\xA0\xA0\xA0color=\"red\"></mdi-icon>")])])])])]))];
}

/* harmony default export */ __webpack_exports__["default"] = (Object(lwc__WEBPACK_IMPORTED_MODULE_5__["registerTemplate"])(tmpl));
tmpl.stylesheets = [];

if (_app_css__WEBPACK_IMPORTED_MODULE_0__["default"]) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _app_css__WEBPACK_IMPORTED_MODULE_0__["default"])
}
tmpl.stylesheetTokens = {
  hostAttribute: "demo-app-_app-host",
  shadowAttribute: "demo-app-_app"
};


/***/ }),

/***/ "./src/modules/demo/app/app.js":
/*!*************************************!*\
  !*** ./src/modules/demo/app/app.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var lwc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lwc */ "./node_modules/@lwc/engine/lib/framework/main.js");
/* harmony import */ var lwc__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lwc__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _app_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app.html */ "./src/modules/demo/app/app.html");





class App extends lwc__WEBPACK_IMPORTED_MODULE_0__["LightningElement"] {
  constructor(...args) {
    super(...args);
    this.isLoading = true;
    this.namespaces = [];
    this.excludes = [];
    this.moreThanOneNamespace = true;
    this.selectedNamespace = null;
  }

  async connectedCallback() {
    try {
      const response = await fetch('demo.json');
      var data = await response.json();
      this.excludes = data.excludes;
      this.namespaces = data.namespaces;

      if (data.namespaces.length === 1) {
        this.moreThanOneNamespace = false;
      }

      this.selectedNamespace = data.namespaces[0];
      this.selectedNamespace.components.sort((a, b) => b - a);
      this.isLoading = false;
    } catch (e) {
      this.isLoading = false;
    }
  }

}

Object(lwc__WEBPACK_IMPORTED_MODULE_0__["registerDecorators"])(App, {
  track: {
    isLoading: 1,
    namespaces: 1,
    excludes: 1,
    moreThanOneNamespace: 1,
    selectedNamespace: 1
  }
})

/* harmony default export */ __webpack_exports__["default"] = (Object(lwc__WEBPACK_IMPORTED_MODULE_0__["registerComponent"])(App, {
  tmpl: _app_html__WEBPACK_IMPORTED_MODULE_1__["default"]
}));

/***/ }),

/***/ "./src/modules/demo/description/description.html":
/*!*******************************************************!*\
  !*** ./src/modules/demo/description/description.html ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _description_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./description.css */ "./node_modules/lwc-services/lib/utils/webpack/mocks/empty-style.js");
/* harmony import */ var _description_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_description_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var demo_markdown__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! demo/markdown */ "./src/modules/demo/markdown/markdown.js");
/* harmony import */ var lwc__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lwc */ "./node_modules/@lwc/engine/lib/framework/main.js");
/* harmony import */ var lwc__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lwc__WEBPACK_IMPORTED_MODULE_2__);





function tmpl($api, $cmp, $slotset, $ctx) {
  const {
    c: api_custom_element
  } = $api;
  return [api_custom_element("demo-markdown", demo_markdown__WEBPACK_IMPORTED_MODULE_1__["default"], {
    props: {
      "content": $cmp.description
    },
    key: 2
  }, [])];
}

/* harmony default export */ __webpack_exports__["default"] = (Object(lwc__WEBPACK_IMPORTED_MODULE_2__["registerTemplate"])(tmpl));
tmpl.stylesheets = [];

if (_description_css__WEBPACK_IMPORTED_MODULE_0___default.a) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _description_css__WEBPACK_IMPORTED_MODULE_0___default.a)
}
tmpl.stylesheetTokens = {
  hostAttribute: "demo-description-_description-host",
  shadowAttribute: "demo-description-_description"
};


/***/ }),

/***/ "./src/modules/demo/description/description.js":
/*!*****************************************************!*\
  !*** ./src/modules/demo/description/description.js ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var lwc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lwc */ "./node_modules/@lwc/engine/lib/framework/main.js");
/* harmony import */ var lwc__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lwc__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _description_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./description.html */ "./src/modules/demo/description/description.html");





class Description extends lwc__WEBPACK_IMPORTED_MODULE_0__["LightningElement"] {
  constructor(...args) {
    super(...args);
    this.jsdoc = [];
  }

  get description() {
    var item = this.jsdoc.find(x => x.kind === "Class");
    return item ? item.description : "";
  }

}

Object(lwc__WEBPACK_IMPORTED_MODULE_0__["registerDecorators"])(Description, {
  publicProps: {
    jsdoc: {
      config: 0
    }
  }
})

/* harmony default export */ __webpack_exports__["default"] = (Object(lwc__WEBPACK_IMPORTED_MODULE_0__["registerComponent"])(Description, {
  tmpl: _description_html__WEBPACK_IMPORTED_MODULE_1__["default"]
}));

/***/ }),

/***/ "./src/modules/demo/markdown/markdown.css":
/*!************************************************!*\
  !*** ./src/modules/demo/markdown/markdown.css ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function stylesheet(hostSelector, shadowSelector, nativeShadow) {
  return "\n" + (nativeShadow ? (":host {color: #16325c;}") : (hostSelector + " {color: #16325c;}")) + "\nblockquote" + shadowSelector + " {border-left: 4px solid #DDD;margin: 0;padding: 0.05rem 1rem;}\nblockquote" + shadowSelector + " p" + shadowSelector + " {margin: 0.75rem 0;}\npre" + shadowSelector + " code" + shadowSelector + " {display: block;position: relative;padding: 0.5rem;border: 1px solid #16325c;border-radius: 0.25rem;}\npre" + shadowSelector + " code.language-javascript" + shadowSelector + "::before {content: 'JS';}\npre" + shadowSelector + " code.language-css" + shadowSelector + "::before {content: 'CSS';}\npre" + shadowSelector + " code.language-html" + shadowSelector + "::before {content: 'HTML';}\npre" + shadowSelector + " code" + shadowSelector + "::before {content: 'Text';color: #FFF;right: 0;top: 0;position: absolute;border-bottom: 1px solid #16325c;background: #16325c;border-bottom-left-radius: 0.25rem;padding: 0.25rem 0.5rem;font-family: 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;}\n";
}
/* harmony default export */ __webpack_exports__["default"] = ([stylesheet]);

/***/ }),

/***/ "./src/modules/demo/markdown/markdown.html":
/*!*************************************************!*\
  !*** ./src/modules/demo/markdown/markdown.html ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _markdown_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./markdown.css */ "./src/modules/demo/markdown/markdown.css");
/* harmony import */ var lwc__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lwc */ "./node_modules/@lwc/engine/lib/framework/main.js");
/* harmony import */ var lwc__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lwc__WEBPACK_IMPORTED_MODULE_1__);




function tmpl($api, $cmp, $slotset, $ctx) {
  const {
    h: api_element
  } = $api;
  return [api_element("div", {
    context: {
      lwc: {
        dom: "manual"
      }
    },
    key: 2
  }, [])];
}

/* harmony default export */ __webpack_exports__["default"] = (Object(lwc__WEBPACK_IMPORTED_MODULE_1__["registerTemplate"])(tmpl));
tmpl.stylesheets = [];

if (_markdown_css__WEBPACK_IMPORTED_MODULE_0__["default"]) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _markdown_css__WEBPACK_IMPORTED_MODULE_0__["default"])
}
tmpl.stylesheetTokens = {
  hostAttribute: "demo-markdown-_markdown-host",
  shadowAttribute: "demo-markdown-_markdown"
};


/***/ }),

/***/ "./src/modules/demo/markdown/markdown.js":
/*!***********************************************!*\
  !*** ./src/modules/demo/markdown/markdown.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var lwc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lwc */ "./node_modules/@lwc/engine/lib/framework/main.js");
/* harmony import */ var lwc__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lwc__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _markdown_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./markdown.html */ "./src/modules/demo/markdown/markdown.html");
/* harmony import */ var marked__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! marked */ "./node_modules/marked/lib/marked.js");
/* harmony import */ var marked__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(marked__WEBPACK_IMPORTED_MODULE_2__);






class Markdown extends lwc__WEBPACK_IMPORTED_MODULE_0__["LightningElement"] {
  constructor(...args) {
    super(...args);
    this.content = void 0;
    this.privateIsConnected = false;
  }

  connectedCallback() {
    this.privateIsConnected = true;
  }

  disconnectedCallback() {
    this.privateIsConnected = false;
  }

  renderedCallback() {
    if (this.privateIsConnected) {
      const container = this.template.querySelector('div'); // eslint-disable-next-line lwc/no-inner-html

      container.innerHTML = marked__WEBPACK_IMPORTED_MODULE_2___default()(this.content);
    }
  }

}

Object(lwc__WEBPACK_IMPORTED_MODULE_0__["registerDecorators"])(Markdown, {
  publicProps: {
    content: {
      config: 0
    }
  }
})

/* harmony default export */ __webpack_exports__["default"] = (Object(lwc__WEBPACK_IMPORTED_MODULE_0__["registerComponent"])(Markdown, {
  tmpl: _markdown_html__WEBPACK_IMPORTED_MODULE_1__["default"]
}));

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
/**
 * Render an SVG path icon into the page.
 * 
 * ```javascript
 * import { mdiAccount } from '@mdi/js'
 * 
 * export default class Example extends LightningElement {
 *   mdiAccount = mdiAccount;
 * }
 * ```
 * 
 * ```html
 * <template>
 *   <mdi-icon path={mdiAccount}></mdi-icon>
 * </template>
 * ```
 * 
 * @name Icon
 * @order 1
 */

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



/**
 * Render overlapping child `mdi-icon` elements.
 * 
 * @name Stack
 * @order 2
 */

class Stack extends lwc__WEBPACK_IMPORTED_MODULE_1__["LightningElement"] {}

/* harmony default export */ __webpack_exports__["default"] = (Object(lwc__WEBPACK_IMPORTED_MODULE_1__["registerComponent"])(Stack, {
  tmpl: _stack_html__WEBPACK_IMPORTED_MODULE_0__["default"]
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