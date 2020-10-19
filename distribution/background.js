(function(modules) {
  var installedModules = {};
  function __webpack_require__(moduleId) {
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    var module = installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}
    };
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    module.l = true;
    return module.exports;
  }
  __webpack_require__.m = modules;
  __webpack_require__.c = installedModules;
  __webpack_require__.d = function(exports, name, getter) {
    if (!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, {
        enumerable: true,
        get: getter
      });
    }
  };
  __webpack_require__.r = function(exports) {
    if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, {
        value: "Module"
      });
    }
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
  };
  __webpack_require__.t = function(value, mode) {
    if (mode & 1) value = __webpack_require__(value);
    if (mode & 8) return value;
    if (mode & 4 && typeof value === "object" && value && value.__esModule) return value;
    var ns = Object.create(null);
    __webpack_require__.r(ns);
    Object.defineProperty(ns, "default", {
      enumerable: true,
      value: value
    });
    if (mode & 2 && typeof value != "string") for (var key in value) __webpack_require__.d(ns, key, function(key) {
      return value[key];
    }.bind(null, key));
    return ns;
  };
  __webpack_require__.n = function(module) {
    var getter = module && module.__esModule ? function getDefault() {
      return module["default"];
    } : function getModuleExports() {
      return module;
    };
    __webpack_require__.d(getter, "a", getter);
    return getter;
  };
  __webpack_require__.o = function(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  };
  __webpack_require__.p = "";
  return __webpack_require__(__webpack_require__.s = 4);
})([ function(module, __webpack_exports__, __webpack_require__) {
  "use strict";
  var webext_options_sync__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
  var webext_options_sync__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(webext_options_sync__WEBPACK_IMPORTED_MODULE_0__);
  __webpack_exports__["a"] = new webext_options_sync__WEBPACK_IMPORTED_MODULE_0___default.a({
    defaults: {
      autoMuteOnJoin: true,
      autoJoinCall: false,
      autoTurnOffCamOnJoin: true,
      debugMode: false
    },
    migrations: [ webext_options_sync__WEBPACK_IMPORTED_MODULE_0___default.a.migrations.removeUnused ],
    logging: true
  });
}, function(module, exports, __webpack_require__) {
  "use strict";
  const webext_detect_page_1 = __webpack_require__(2);
  class OptionsSync {
    constructor(options) {
      const fullOptions = {
        defaults: {},
        storageName: "options",
        migrations: [],
        logging: true,
        ...options
      };
      this.storageName = fullOptions.storageName;
      this.defaults = fullOptions.defaults;
      if (fullOptions.logging === false) {
        this._log = () => {};
      }
      if (webext_detect_page_1.isBackgroundPage()) {
        chrome.management.getSelf(({installType: installType}) => {
          if (installType === "development") {
            this._applyDefinition(fullOptions);
          } else {
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
      const options = {
        ...defs.defaults,
        ...await this.getAll()
      };
      this._log("group", "Appling definitions");
      this._log("info", "Current options:", options);
      if (defs.migrations && defs.migrations.length > 0) {
        this._log("info", "Running", defs.migrations.length, "migrations");
        defs.migrations.forEach(migrate => migrate(options, defs.defaults));
      }
      this._log("info", "Migrated options:", options);
      this._log("groupEnd");
      this.setAll(options);
    }
    _parseNumbers(options) {
      for (const name of Object.keys(options)) {
        if (options[name] === String(Number(options[name]))) {
          options[name] = Number(options[name]);
        }
      }
      return options;
    }
    async getAll() {
      const keys = await new Promise((resolve, reject) => {
        chrome.storage.sync.get({
          [this.storageName]: this.defaults
        }, result => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(result);
          }
        });
      });
      return this._parseNumbers(keys[this.storageName]);
    }
    async setAll(newOptions) {
      return new Promise((resolve, reject) => {
        chrome.storage.sync.set({
          [this.storageName]: newOptions
        }, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      });
    }
    async set(newOptions) {
      return this.setAll({
        ...await this.getAll(),
        ...newOptions
      });
    }
    async syncForm(form) {
      const element = form instanceof HTMLFormElement ? form : document.querySelector(form);
      element.addEventListener("input", this._handleFormUpdatesDebounced);
      element.addEventListener("change", this._handleFormUpdatesDebounced);
      chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === "sync" && changes[this.storageName] && !element.contains(document.activeElement)) {
          this._applyToForm(changes[this.storageName].newValue, element);
        }
      });
      this._applyToForm(await this.getAll(), element);
    }
    _applyToForm(options, form) {
      this._log("group", "Updating form");
      for (const name of Object.keys(options)) {
        const els = form.querySelectorAll(`[name="${CSS.escape(name)}"]`);
        const [field] = els;
        if (field) {
          this._log("info", name, ":", options[name]);
          switch (field.type) {
           case "checkbox":
            field.checked = options[name];
            break;

           case "radio":
            {
              const [selected] = [ ...els ].filter(el => el.value === options[name]);
              if (selected) {
                selected.checked = true;
              }
              break;
            }

           default:
            field.value = options[name];
            break;
          }
          field.dispatchEvent(new InputEvent("input"));
        } else {
          this._log("warn", "Stored option {", name, ":", options[name], "} was not found on the page");
        }
      }
      this._log("groupEnd");
    }
    _handleFormUpdatesDebounced({target: target}) {
      if (this._timer) {
        clearTimeout(this._timer);
      }
      this._timer = setTimeout(() => {
        this._handleFormUpdates(target);
        this._timer = undefined;
      }, 600);
    }
    _handleFormUpdates(el) {
      const {name: name} = el;
      let {value: value} = el;
      if (!name || !el.validity.valid) {
        return;
      }
      switch (el.type) {
       case "select-one":
        value = el.options[el.selectedIndex].value;
        break;

       case "checkbox":
        value = el.checked;
        break;

       default:
        break;
      }
      this._log("info", "Saving option", el.name, "to", value);
      this.set({
        [name]: value
      });
    }
  }
  OptionsSync.migrations = {
    removeUnused(options, defaults) {
      for (const key of Object.keys(options)) {
        if (!(key in defaults)) {
          delete options[key];
        }
      }
    }
  };
  module.exports = OptionsSync;
}, function(module, exports, __webpack_require__) {
  "use strict";
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  function isBackgroundPage() {
    return location.pathname === "/_generated_background_page.html" && !location.protocol.startsWith("http") && Boolean(typeof chrome === "object" && chrome.runtime);
  }
  exports.isBackgroundPage = isBackgroundPage;
  function isContentScript() {
    return location.protocol.startsWith("http") && Boolean(typeof chrome === "object" && chrome.runtime);
  }
  exports.isContentScript = isContentScript;
  function isOptionsPage() {
    if (typeof chrome !== "object" || !chrome.runtime) {
      return false;
    }
    const {options_ui: options_ui} = chrome.runtime.getManifest();
    if (typeof options_ui !== "object" || typeof options_ui.page !== "string") {
      return false;
    }
    const url = new URL(options_ui.page, location.origin);
    return url.pathname === location.pathname && url.origin === location.origin;
  }
  exports.isOptionsPage = isOptionsPage;
}, , function(module, __webpack_exports__, __webpack_require__) {
  "use strict";
  __webpack_require__.r(__webpack_exports__);
  var _options_storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
} ]);