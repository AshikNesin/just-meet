/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./source/inject.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/delay/index.js":
/*!*************************************!*\
  !*** ./node_modules/delay/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// From https://github.com/sindresorhus/random-int/blob/c37741b56f76b9160b0b63dae4e9c64875128146/index.js#L13-L15
const randomInteger = (minimum, maximum) => Math.floor((Math.random() * (maximum - minimum + 1)) + minimum);

const createAbortError = () => {
	const error = new Error('Delay aborted');
	error.name = 'AbortError';
	return error;
};

const createDelay = ({clearTimeout: defaultClear, setTimeout: set, willResolve}) => (ms, {value, signal} = {}) => {
	if (signal && signal.aborted) {
		return Promise.reject(createAbortError());
	}

	let timeoutId;
	let settle;
	let rejectFn;
	const clear = defaultClear || clearTimeout;

	const signalListener = () => {
		clear(timeoutId);
		rejectFn(createAbortError());
	};

	const cleanup = () => {
		if (signal) {
			signal.removeEventListener('abort', signalListener);
		}
	};

	const delayPromise = new Promise((resolve, reject) => {
		settle = () => {
			cleanup();
			if (willResolve) {
				resolve(value);
			} else {
				reject(value);
			}
		};

		rejectFn = reject;
		timeoutId = (set || setTimeout)(settle, ms);
	});

	if (signal) {
		signal.addEventListener('abort', signalListener, {once: true});
	}

	delayPromise.clear = () => {
		clear(timeoutId);
		timeoutId = null;
		settle();
	};

	return delayPromise;
};

const delay = createDelay({willResolve: true});
delay.reject = createDelay({willResolve: false});
delay.range = (minimum, maximum, options) => delay(randomInteger(minimum, maximum), options);
delay.createWithTimers = ({clearTimeout, setTimeout}) => {
	const delay = createDelay({clearTimeout, setTimeout, willResolve: true});
	delay.reject = createDelay({clearTimeout, setTimeout, willResolve: false});
	return delay;
};

module.exports = delay;
// TODO: Remove this for the next major release
module.exports.default = delay;


/***/ }),

/***/ "./node_modules/webext-detect-page/index.js":
/*!**************************************************!*\
  !*** ./node_modules/webext-detect-page/index.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/bfred-it/webext-detect-page
Object.defineProperty(exports, "__esModule", { value: true });
function isBackgroundPage() {
    return location.pathname === '/_generated_background_page.html' &&
        !location.protocol.startsWith('http') &&
        Boolean(typeof chrome === 'object' && chrome.runtime);
}
exports.isBackgroundPage = isBackgroundPage;
function isContentScript() {
    return location.protocol.startsWith('http') &&
        Boolean(typeof chrome === 'object' && chrome.runtime);
}
exports.isContentScript = isContentScript;
function isOptionsPage() {
    if (typeof chrome !== 'object' || !chrome.runtime) {
        return false;
    }
    const { options_ui } = chrome.runtime.getManifest();
    if (typeof options_ui !== 'object' || typeof options_ui.page !== 'string') {
        return false;
    }
    const url = new URL(options_ui.page, location.origin);
    return url.pathname === location.pathname &&
        url.origin === location.origin;
}
exports.isOptionsPage = isOptionsPage;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/webext-options-sync/index.js":
/*!***************************************************!*\
  !*** ./node_modules/webext-options-sync/index.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const webext_detect_page_1 = __webpack_require__(/*! webext-detect-page */ "./node_modules/webext-detect-page/index.js");
class OptionsSync {
    /**
    @constructor Returns an instance linked to the chosen storage.
    @param options - Configuration to determine where options are stored.
    */
    constructor(options) {
        const fullOptions = {
            // https://github.com/bfred-it/webext-options-sync/pull/21#issuecomment-500314074
            // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
            defaults: {},
            storageName: 'options',
            migrations: [],
            logging: true,
            ...options
        };
        this.storageName = fullOptions.storageName;
        this.defaults = fullOptions.defaults;
        if (fullOptions.logging === false) {
            this._log = () => { };
        }
        if (webext_detect_page_1.isBackgroundPage()) {
            chrome.management.getSelf(({ installType }) => {
                // Chrome doesn't run `onInstalled` when launching the browser with a pre-loaded development extension #25
                if (installType === 'development') {
                    this._applyDefinition(fullOptions);
                }
                else {
                    chrome.runtime.onInstalled.addListener(() => this._applyDefinition(fullOptions));
                }
            });
        }
        this._handleFormUpdatesDebounced = this._handleFormUpdatesDebounced.bind(this);
    }
    _log(method, ...args) {
        console[method](...args);
    }
    async _applyDefinition(defs) {
        const options = { ...defs.defaults, ...await this.getAll() };
        this._log('group', 'Appling definitions');
        this._log('info', 'Current options:', options);
        if (defs.migrations && defs.migrations.length > 0) {
            this._log('info', 'Running', defs.migrations.length, 'migrations');
            defs.migrations.forEach(migrate => migrate(options, defs.defaults));
        }
        this._log('info', 'Migrated options:', options);
        this._log('groupEnd');
        this.setAll(options);
    }
    _parseNumbers(options) {
        for (const name of Object.keys(options)) {
            if (options[name] === String(Number(options[name]))) {
                // @ts-ignore it will be dropped in #13
                options[name] = Number(options[name]);
            }
        }
        return options;
    }
    /**
    Retrieves all the options stored.

    @returns Promise that will resolve with **all** the options stored, as an object.

    @example

    new OptionsSync().getAll().then(options => {
        console.log('The user’s options are', options);
        if (options.color) {
            document.body.style.color = color;
        }
    });
    */
    async getAll() {
        const keys = await new Promise((resolve, reject) => {
            chrome.storage.sync.get({
                [this.storageName]: this.defaults
            }, result => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                }
                else {
                    resolve(result);
                }
            });
        });
        return this._parseNumbers(keys[this.storageName]);
    }
    /**
    Overrides **all** the options stored with your `options`.

    @param newOptions - A map of default options as strings or booleans. The keys will have to match the form fields' `name` attributes.
    */
    async setAll(newOptions) {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.set({
                [this.storageName]: newOptions
            }, () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                }
                else {
                    resolve();
                }
            });
        });
    }
    /**
    Merges new options with the existing stored options.

    @param newOptions - A map of default options as strings or booleans. The keys will have to match the form fields' `name` attributes.
    */
    async set(newOptions) {
        return this.setAll({ ...await this.getAll(), ...newOptions });
    }
    /**
    Any defaults or saved options will be loaded into the `<form>` and any change will automatically be saved via `chrome.storage.sync`.

    @param selector - The `<form>` that needs to be synchronized or a CSS selector (one element).
    The form fields' `name` attributes will have to match the option names.
    */
    async syncForm(form) {
        const element = form instanceof HTMLFormElement ?
            form :
            document.querySelector(form);
        element.addEventListener('input', this._handleFormUpdatesDebounced);
        element.addEventListener('change', this._handleFormUpdatesDebounced);
        chrome.storage.onChanged.addListener((changes, namespace) => {
            if (namespace === 'sync' &&
                changes[this.storageName] &&
                !element.contains(document.activeElement) // Avoid applying changes while the user is editing a field
            ) {
                this._applyToForm(changes[this.storageName].newValue, element);
            }
        });
        this._applyToForm(await this.getAll(), element);
    }
    _applyToForm(options, form) {
        this._log('group', 'Updating form');
        for (const name of Object.keys(options)) {
            const els = form.querySelectorAll(`[name="${CSS.escape(name)}"]`);
            const [field] = els;
            if (field) {
                this._log('info', name, ':', options[name]);
                switch (field.type) {
                    case 'checkbox':
                        field.checked = options[name];
                        break;
                    case 'radio': {
                        const [selected] = [...els].filter(el => el.value === options[name]);
                        if (selected) {
                            selected.checked = true;
                        }
                        break;
                    }
                    default:
                        field.value = options[name];
                        break;
                }
                field.dispatchEvent(new InputEvent('input'));
            }
            else {
                this._log('warn', 'Stored option {', name, ':', options[name], '} was not found on the page');
            }
        }
        this._log('groupEnd');
    }
    _handleFormUpdatesDebounced({ target }) {
        if (this._timer) {
            clearTimeout(this._timer);
        }
        this._timer = setTimeout(() => {
            this._handleFormUpdates(target);
            this._timer = undefined;
        }, 600);
    }
    _handleFormUpdates(el) {
        const { name } = el;
        let { value } = el;
        if (!name || !el.validity.valid) {
            return;
        }
        switch (el.type) {
            case 'select-one':
                value = el.options[el.selectedIndex].value;
                break;
            case 'checkbox':
                value = el.checked;
                break;
            default: break;
        }
        this._log('info', 'Saving option', el.name, 'to', value);
        // @ts-ignore `name` should be a keyof TOptions but it's a plain string, so it fails
        this.set({
            [name]: value
        });
    }
}
OptionsSync.migrations = {
    /**
    Helper method that removes any option that isn't defined in the defaults. It's useful to avoid leaving old options taking up space.
    */
    removeUnused(options, defaults) {
        for (const key of Object.keys(options)) {
            if (!(key in defaults)) {
                delete options[key];
            }
        }
    }
};
module.exports = OptionsSync;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./source/features/auto-join-call.js":
/*!*******************************************!*\
  !*** ./source/features/auto-join-call.js ***!
  \*******************************************/
/*! exports provided: autoJoinCall, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "autoJoinCall", function() { return autoJoinCall; });
/* harmony import */ var _options_storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../options-storage */ "./source/options-storage.js");
/* harmony import */ var delay__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! delay */ "./node_modules/delay/index.js");
/* harmony import */ var delay__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(delay__WEBPACK_IMPORTED_MODULE_1__);





const autoJoinCall = async () => {
    const options = await _options_storage__WEBPACK_IMPORTED_MODULE_0__["default"].getAll()
    if (options.autoJoinCall) {
        const joinNowBtnCheckInterval = setInterval(async function () {
            const allBtnElements = [...document.querySelectorAll('[role="button"]')];
            if (allBtnElements.length > 4 && allBtnElements[4].textContent === 'Join now') { 
                const joinNowBtn = allBtnElements[4];
                await delay__WEBPACK_IMPORTED_MODULE_1___default()(1000);
                joinNowBtn.click()
                clearInterval(joinNowBtnCheckInterval);
            } 
        }, 10);
    }
}

/* harmony default export */ __webpack_exports__["default"] = (autoJoinCall);


/***/ }),

/***/ "./source/features/auto-mute-on-join.js":
/*!**********************************************!*\
  !*** ./source/features/auto-mute-on-join.js ***!
  \**********************************************/
/*! exports provided: autoMuteOnJoin, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "autoMuteOnJoin", function() { return autoMuteOnJoin; });
/* harmony import */ var _helpers_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../helpers/dom */ "./source/helpers/dom.js");
/* harmony import */ var _options_storage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../options-storage */ "./source/options-storage.js");



const autoMuteOnJoin = async () => {
    const options = await _options_storage__WEBPACK_IMPORTED_MODULE_1__["default"].getAll()
    const [micBtnEl] = [...document.querySelectorAll('[role="button"]')]
    if (options.autoMuteOnJoin) {
        micBtnEl.click()
    }
}

/* harmony default export */ __webpack_exports__["default"] = (autoMuteOnJoin);


/***/ }),

/***/ "./source/features/auto-turn-off-cam-on-join.js":
/*!******************************************************!*\
  !*** ./source/features/auto-turn-off-cam-on-join.js ***!
  \******************************************************/
/*! exports provided: autoTurnOffCamOnJoin, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "autoTurnOffCamOnJoin", function() { return autoTurnOffCamOnJoin; });
/* harmony import */ var _helpers_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../helpers/dom */ "./source/helpers/dom.js");
/* harmony import */ var _options_storage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../options-storage */ "./source/options-storage.js");




const autoTurnOffCamOnJoin = async () => {
    const options = await _options_storage__WEBPACK_IMPORTED_MODULE_1__["default"].getAll()

    const camBtnEl = [...document.querySelectorAll('[role="button"]')][1]

    if (options.autoTurnOffCamOnJoin) {
        camBtnEl.click()
    }
}

/* harmony default export */ __webpack_exports__["default"] = (autoTurnOffCamOnJoin);


/***/ }),

/***/ "./source/helpers/dom.js":
/*!*******************************!*\
  !*** ./source/helpers/dom.js ***!
  \*******************************/
/*! exports provided: $click */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "$click", function() { return $click; });
const $click = selector => {
    const el = document.querySelector(selector)
    if (el) {
        el.click();
    }
}

/***/ }),

/***/ "./source/inject.js":
/*!**************************!*\
  !*** ./source/inject.js ***!
  \**************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _features_auto_mute_on_join__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./features/auto-mute-on-join */ "./source/features/auto-mute-on-join.js");
/* harmony import */ var _features_auto_turn_off_cam_on_join__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./features/auto-turn-off-cam-on-join */ "./source/features/auto-turn-off-cam-on-join.js");
/* harmony import */ var _features_auto_join_call__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./features/auto-join-call */ "./source/features/auto-join-call.js");



const readyStateCheckInterval = setInterval(function () {
    if (document.readyState === "complete") {
        clearInterval(readyStateCheckInterval);
        Object(_features_auto_mute_on_join__WEBPACK_IMPORTED_MODULE_0__["default"])()
        Object(_features_auto_turn_off_cam_on_join__WEBPACK_IMPORTED_MODULE_1__["default"])()
        Object(_features_auto_join_call__WEBPACK_IMPORTED_MODULE_2__["default"])()

    }
}, 10);


/***/ }),

/***/ "./source/options-storage.js":
/*!***********************************!*\
  !*** ./source/options-storage.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var webext_options_sync__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! webext-options-sync */ "./node_modules/webext-options-sync/index.js");
/* harmony import */ var webext_options_sync__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(webext_options_sync__WEBPACK_IMPORTED_MODULE_0__);


/* harmony default export */ __webpack_exports__["default"] = (new webext_options_sync__WEBPACK_IMPORTED_MODULE_0___default.a({
	defaults: {
		autoMuteOnJoin: true,
		autoJoinCall:true,
		autoTurnOffCamOnJoin: true,
		debugMode:false
	},
	migrations: [
		webext_options_sync__WEBPACK_IMPORTED_MODULE_0___default.a.migrations.removeUnused
	],
	logging: true
}));


/***/ })

/******/ });
//# sourceMappingURL=inject.js.map