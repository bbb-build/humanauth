import {
  __commonJS,
  __require,
  __toESM
} from "./chunk-6DZX6EAA.mjs";

// ../node_modules/react-dom/cjs/react-dom.production.js
var require_react_dom_production = __commonJS({
  "../node_modules/react-dom/cjs/react-dom.production.js"(exports) {
    "use strict";
    var React = __require("react");
    function formatProdErrorMessage(code) {
      var url = "https://react.dev/errors/" + code;
      if (1 < arguments.length) {
        url += "?args[]=" + encodeURIComponent(arguments[1]);
        for (var i = 2; i < arguments.length; i++)
          url += "&args[]=" + encodeURIComponent(arguments[i]);
      }
      return "Minified React error #" + code + "; visit " + url + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
    }
    function noop() {
    }
    var Internals = {
      d: {
        f: noop,
        r: function() {
          throw Error(formatProdErrorMessage(522));
        },
        D: noop,
        C: noop,
        L: noop,
        m: noop,
        X: noop,
        S: noop,
        M: noop
      },
      p: 0,
      findDOMNode: null
    };
    var REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal");
    function createPortal$1(children, containerInfo, implementation) {
      var key = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
      return {
        $$typeof: REACT_PORTAL_TYPE,
        key: null == key ? null : "" + key,
        children,
        containerInfo,
        implementation
      };
    }
    var ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    function getCrossOriginStringAs(as, input) {
      if ("font" === as) return "";
      if ("string" === typeof input)
        return "use-credentials" === input ? input : "";
    }
    exports.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Internals;
    exports.createPortal = function(children, container) {
      var key = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
      if (!container || 1 !== container.nodeType && 9 !== container.nodeType && 11 !== container.nodeType)
        throw Error(formatProdErrorMessage(299));
      return createPortal$1(children, container, null, key);
    };
    exports.flushSync = function(fn) {
      var previousTransition = ReactSharedInternals.T, previousUpdatePriority = Internals.p;
      try {
        if (ReactSharedInternals.T = null, Internals.p = 2, fn) return fn();
      } finally {
        ReactSharedInternals.T = previousTransition, Internals.p = previousUpdatePriority, Internals.d.f();
      }
    };
    exports.preconnect = function(href, options) {
      "string" === typeof href && (options ? (options = options.crossOrigin, options = "string" === typeof options ? "use-credentials" === options ? options : "" : void 0) : options = null, Internals.d.C(href, options));
    };
    exports.prefetchDNS = function(href) {
      "string" === typeof href && Internals.d.D(href);
    };
    exports.preinit = function(href, options) {
      if ("string" === typeof href && options && "string" === typeof options.as) {
        var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin), integrity = "string" === typeof options.integrity ? options.integrity : void 0, fetchPriority = "string" === typeof options.fetchPriority ? options.fetchPriority : void 0;
        "style" === as ? Internals.d.S(
          href,
          "string" === typeof options.precedence ? options.precedence : void 0,
          {
            crossOrigin,
            integrity,
            fetchPriority
          }
        ) : "script" === as && Internals.d.X(href, {
          crossOrigin,
          integrity,
          fetchPriority,
          nonce: "string" === typeof options.nonce ? options.nonce : void 0
        });
      }
    };
    exports.preinitModule = function(href, options) {
      if ("string" === typeof href)
        if ("object" === typeof options && null !== options) {
          if (null == options.as || "script" === options.as) {
            var crossOrigin = getCrossOriginStringAs(
              options.as,
              options.crossOrigin
            );
            Internals.d.M(href, {
              crossOrigin,
              integrity: "string" === typeof options.integrity ? options.integrity : void 0,
              nonce: "string" === typeof options.nonce ? options.nonce : void 0
            });
          }
        } else null == options && Internals.d.M(href);
    };
    exports.preload = function(href, options) {
      if ("string" === typeof href && "object" === typeof options && null !== options && "string" === typeof options.as) {
        var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin);
        Internals.d.L(href, as, {
          crossOrigin,
          integrity: "string" === typeof options.integrity ? options.integrity : void 0,
          nonce: "string" === typeof options.nonce ? options.nonce : void 0,
          type: "string" === typeof options.type ? options.type : void 0,
          fetchPriority: "string" === typeof options.fetchPriority ? options.fetchPriority : void 0,
          referrerPolicy: "string" === typeof options.referrerPolicy ? options.referrerPolicy : void 0,
          imageSrcSet: "string" === typeof options.imageSrcSet ? options.imageSrcSet : void 0,
          imageSizes: "string" === typeof options.imageSizes ? options.imageSizes : void 0,
          media: "string" === typeof options.media ? options.media : void 0
        });
      }
    };
    exports.preloadModule = function(href, options) {
      if ("string" === typeof href)
        if (options) {
          var crossOrigin = getCrossOriginStringAs(options.as, options.crossOrigin);
          Internals.d.m(href, {
            as: "string" === typeof options.as && "script" !== options.as ? options.as : void 0,
            crossOrigin,
            integrity: "string" === typeof options.integrity ? options.integrity : void 0
          });
        } else Internals.d.m(href);
    };
    exports.requestFormReset = function(form) {
      Internals.d.r(form);
    };
    exports.unstable_batchedUpdates = function(fn, a) {
      return fn(a);
    };
    exports.useFormState = function(action, initialState, permalink) {
      return ReactSharedInternals.H.useFormState(action, initialState, permalink);
    };
    exports.useFormStatus = function() {
      return ReactSharedInternals.H.useHostTransitionStatus();
    };
    exports.version = "19.2.4";
  }
});

// ../node_modules/react-dom/cjs/react-dom.development.js
var require_react_dom_development = __commonJS({
  "../node_modules/react-dom/cjs/react-dom.development.js"(exports) {
    "use strict";
    "production" !== process.env.NODE_ENV && (function() {
      function noop() {
      }
      function testStringCoercion(value) {
        return "" + value;
      }
      function createPortal$1(children, containerInfo, implementation) {
        var key = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
        try {
          testStringCoercion(key);
          var JSCompiler_inline_result = false;
        } catch (e) {
          JSCompiler_inline_result = true;
        }
        JSCompiler_inline_result && (console.error(
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          "function" === typeof Symbol && Symbol.toStringTag && key[Symbol.toStringTag] || key.constructor.name || "Object"
        ), testStringCoercion(key));
        return {
          $$typeof: REACT_PORTAL_TYPE,
          key: null == key ? null : "" + key,
          children,
          containerInfo,
          implementation
        };
      }
      function getCrossOriginStringAs(as, input) {
        if ("font" === as) return "";
        if ("string" === typeof input)
          return "use-credentials" === input ? input : "";
      }
      function getValueDescriptorExpectingObjectForWarning(thing) {
        return null === thing ? "`null`" : void 0 === thing ? "`undefined`" : "" === thing ? "an empty string" : 'something with type "' + typeof thing + '"';
      }
      function getValueDescriptorExpectingEnumForWarning(thing) {
        return null === thing ? "`null`" : void 0 === thing ? "`undefined`" : "" === thing ? "an empty string" : "string" === typeof thing ? JSON.stringify(thing) : "number" === typeof thing ? "`" + thing + "`" : 'something with type "' + typeof thing + '"';
      }
      function resolveDispatcher() {
        var dispatcher = ReactSharedInternals.H;
        null === dispatcher && console.error(
          "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem."
        );
        return dispatcher;
      }
      "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
      var React = __require("react"), Internals = {
        d: {
          f: noop,
          r: function() {
            throw Error(
              "Invalid form element. requestFormReset must be passed a form that was rendered by React."
            );
          },
          D: noop,
          C: noop,
          L: noop,
          m: noop,
          X: noop,
          S: noop,
          M: noop
        },
        p: 0,
        findDOMNode: null
      }, REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
      "function" === typeof Map && null != Map.prototype && "function" === typeof Map.prototype.forEach && "function" === typeof Set && null != Set.prototype && "function" === typeof Set.prototype.clear && "function" === typeof Set.prototype.forEach || console.error(
        "React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"
      );
      exports.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Internals;
      exports.createPortal = function(children, container) {
        var key = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
        if (!container || 1 !== container.nodeType && 9 !== container.nodeType && 11 !== container.nodeType)
          throw Error("Target container is not a DOM element.");
        return createPortal$1(children, container, null, key);
      };
      exports.flushSync = function(fn) {
        var previousTransition = ReactSharedInternals.T, previousUpdatePriority = Internals.p;
        try {
          if (ReactSharedInternals.T = null, Internals.p = 2, fn)
            return fn();
        } finally {
          ReactSharedInternals.T = previousTransition, Internals.p = previousUpdatePriority, Internals.d.f() && console.error(
            "flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task."
          );
        }
      };
      exports.preconnect = function(href, options) {
        "string" === typeof href && href ? null != options && "object" !== typeof options ? console.error(
          "ReactDOM.preconnect(): Expected the `options` argument (second) to be an object but encountered %s instead. The only supported option at this time is `crossOrigin` which accepts a string.",
          getValueDescriptorExpectingEnumForWarning(options)
        ) : null != options && "string" !== typeof options.crossOrigin && console.error(
          "ReactDOM.preconnect(): Expected the `crossOrigin` option (second argument) to be a string but encountered %s instead. Try removing this option or passing a string value instead.",
          getValueDescriptorExpectingObjectForWarning(options.crossOrigin)
        ) : console.error(
          "ReactDOM.preconnect(): Expected the `href` argument (first) to be a non-empty string but encountered %s instead.",
          getValueDescriptorExpectingObjectForWarning(href)
        );
        "string" === typeof href && (options ? (options = options.crossOrigin, options = "string" === typeof options ? "use-credentials" === options ? options : "" : void 0) : options = null, Internals.d.C(href, options));
      };
      exports.prefetchDNS = function(href) {
        if ("string" !== typeof href || !href)
          console.error(
            "ReactDOM.prefetchDNS(): Expected the `href` argument (first) to be a non-empty string but encountered %s instead.",
            getValueDescriptorExpectingObjectForWarning(href)
          );
        else if (1 < arguments.length) {
          var options = arguments[1];
          "object" === typeof options && options.hasOwnProperty("crossOrigin") ? console.error(
            "ReactDOM.prefetchDNS(): Expected only one argument, `href`, but encountered %s as a second argument instead. This argument is reserved for future options and is currently disallowed. It looks like the you are attempting to set a crossOrigin property for this DNS lookup hint. Browsers do not perform DNS queries using CORS and setting this attribute on the resource hint has no effect. Try calling ReactDOM.prefetchDNS() with just a single string argument, `href`.",
            getValueDescriptorExpectingEnumForWarning(options)
          ) : console.error(
            "ReactDOM.prefetchDNS(): Expected only one argument, `href`, but encountered %s as a second argument instead. This argument is reserved for future options and is currently disallowed. Try calling ReactDOM.prefetchDNS() with just a single string argument, `href`.",
            getValueDescriptorExpectingEnumForWarning(options)
          );
        }
        "string" === typeof href && Internals.d.D(href);
      };
      exports.preinit = function(href, options) {
        "string" === typeof href && href ? null == options || "object" !== typeof options ? console.error(
          "ReactDOM.preinit(): Expected the `options` argument (second) to be an object with an `as` property describing the type of resource to be preinitialized but encountered %s instead.",
          getValueDescriptorExpectingEnumForWarning(options)
        ) : "style" !== options.as && "script" !== options.as && console.error(
          'ReactDOM.preinit(): Expected the `as` property in the `options` argument (second) to contain a valid value describing the type of resource to be preinitialized but encountered %s instead. Valid values for `as` are "style" and "script".',
          getValueDescriptorExpectingEnumForWarning(options.as)
        ) : console.error(
          "ReactDOM.preinit(): Expected the `href` argument (first) to be a non-empty string but encountered %s instead.",
          getValueDescriptorExpectingObjectForWarning(href)
        );
        if ("string" === typeof href && options && "string" === typeof options.as) {
          var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin), integrity = "string" === typeof options.integrity ? options.integrity : void 0, fetchPriority = "string" === typeof options.fetchPriority ? options.fetchPriority : void 0;
          "style" === as ? Internals.d.S(
            href,
            "string" === typeof options.precedence ? options.precedence : void 0,
            {
              crossOrigin,
              integrity,
              fetchPriority
            }
          ) : "script" === as && Internals.d.X(href, {
            crossOrigin,
            integrity,
            fetchPriority,
            nonce: "string" === typeof options.nonce ? options.nonce : void 0
          });
        }
      };
      exports.preinitModule = function(href, options) {
        var encountered = "";
        "string" === typeof href && href || (encountered += " The `href` argument encountered was " + getValueDescriptorExpectingObjectForWarning(href) + ".");
        void 0 !== options && "object" !== typeof options ? encountered += " The `options` argument encountered was " + getValueDescriptorExpectingObjectForWarning(options) + "." : options && "as" in options && "script" !== options.as && (encountered += " The `as` option encountered was " + getValueDescriptorExpectingEnumForWarning(options.as) + ".");
        if (encountered)
          console.error(
            "ReactDOM.preinitModule(): Expected up to two arguments, a non-empty `href` string and, optionally, an `options` object with a valid `as` property.%s",
            encountered
          );
        else
          switch (encountered = options && "string" === typeof options.as ? options.as : "script", encountered) {
            case "script":
              break;
            default:
              encountered = getValueDescriptorExpectingEnumForWarning(encountered), console.error(
                'ReactDOM.preinitModule(): Currently the only supported "as" type for this function is "script" but received "%s" instead. This warning was generated for `href` "%s". In the future other module types will be supported, aligning with the import-attributes proposal. Learn more here: (https://github.com/tc39/proposal-import-attributes)',
                encountered,
                href
              );
          }
        if ("string" === typeof href)
          if ("object" === typeof options && null !== options) {
            if (null == options.as || "script" === options.as)
              encountered = getCrossOriginStringAs(
                options.as,
                options.crossOrigin
              ), Internals.d.M(href, {
                crossOrigin: encountered,
                integrity: "string" === typeof options.integrity ? options.integrity : void 0,
                nonce: "string" === typeof options.nonce ? options.nonce : void 0
              });
          } else null == options && Internals.d.M(href);
      };
      exports.preload = function(href, options) {
        var encountered = "";
        "string" === typeof href && href || (encountered += " The `href` argument encountered was " + getValueDescriptorExpectingObjectForWarning(href) + ".");
        null == options || "object" !== typeof options ? encountered += " The `options` argument encountered was " + getValueDescriptorExpectingObjectForWarning(options) + "." : "string" === typeof options.as && options.as || (encountered += " The `as` option encountered was " + getValueDescriptorExpectingObjectForWarning(options.as) + ".");
        encountered && console.error(
          'ReactDOM.preload(): Expected two arguments, a non-empty `href` string and an `options` object with an `as` property valid for a `<link rel="preload" as="..." />` tag.%s',
          encountered
        );
        if ("string" === typeof href && "object" === typeof options && null !== options && "string" === typeof options.as) {
          encountered = options.as;
          var crossOrigin = getCrossOriginStringAs(
            encountered,
            options.crossOrigin
          );
          Internals.d.L(href, encountered, {
            crossOrigin,
            integrity: "string" === typeof options.integrity ? options.integrity : void 0,
            nonce: "string" === typeof options.nonce ? options.nonce : void 0,
            type: "string" === typeof options.type ? options.type : void 0,
            fetchPriority: "string" === typeof options.fetchPriority ? options.fetchPriority : void 0,
            referrerPolicy: "string" === typeof options.referrerPolicy ? options.referrerPolicy : void 0,
            imageSrcSet: "string" === typeof options.imageSrcSet ? options.imageSrcSet : void 0,
            imageSizes: "string" === typeof options.imageSizes ? options.imageSizes : void 0,
            media: "string" === typeof options.media ? options.media : void 0
          });
        }
      };
      exports.preloadModule = function(href, options) {
        var encountered = "";
        "string" === typeof href && href || (encountered += " The `href` argument encountered was " + getValueDescriptorExpectingObjectForWarning(href) + ".");
        void 0 !== options && "object" !== typeof options ? encountered += " The `options` argument encountered was " + getValueDescriptorExpectingObjectForWarning(options) + "." : options && "as" in options && "string" !== typeof options.as && (encountered += " The `as` option encountered was " + getValueDescriptorExpectingObjectForWarning(options.as) + ".");
        encountered && console.error(
          'ReactDOM.preloadModule(): Expected two arguments, a non-empty `href` string and, optionally, an `options` object with an `as` property valid for a `<link rel="modulepreload" as="..." />` tag.%s',
          encountered
        );
        "string" === typeof href && (options ? (encountered = getCrossOriginStringAs(
          options.as,
          options.crossOrigin
        ), Internals.d.m(href, {
          as: "string" === typeof options.as && "script" !== options.as ? options.as : void 0,
          crossOrigin: encountered,
          integrity: "string" === typeof options.integrity ? options.integrity : void 0
        })) : Internals.d.m(href));
      };
      exports.requestFormReset = function(form) {
        Internals.d.r(form);
      };
      exports.unstable_batchedUpdates = function(fn, a) {
        return fn(a);
      };
      exports.useFormState = function(action, initialState, permalink) {
        return resolveDispatcher().useFormState(action, initialState, permalink);
      };
      exports.useFormStatus = function() {
        return resolveDispatcher().useHostTransitionStatus();
      };
      exports.version = "19.2.4";
      "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
    })();
  }
});

// ../node_modules/react-dom/index.js
var require_react_dom = __commonJS({
  "../node_modules/react-dom/index.js"(exports, module2) {
    "use strict";
    function checkDCE() {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
        return;
      }
      if (process.env.NODE_ENV !== "production") {
        throw new Error("^_^");
      }
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
      } catch (err2) {
        console.error(err2);
      }
    }
    if (process.env.NODE_ENV === "production") {
      checkDCE();
      module2.exports = require_react_dom_production();
    } else {
      module2.exports = require_react_dom_development();
    }
  }
});

// ../node_modules/qrcode/lib/core/utils.js
var require_utils = __commonJS({
  "../node_modules/qrcode/lib/core/utils.js"(exports) {
    "use strict";
    var toSJISFunction;
    var CODEWORDS_COUNT = [
      0,
      // Not used
      26,
      44,
      70,
      100,
      134,
      172,
      196,
      242,
      292,
      346,
      404,
      466,
      532,
      581,
      655,
      733,
      815,
      901,
      991,
      1085,
      1156,
      1258,
      1364,
      1474,
      1588,
      1706,
      1828,
      1921,
      2051,
      2185,
      2323,
      2465,
      2611,
      2761,
      2876,
      3034,
      3196,
      3362,
      3532,
      3706
    ];
    exports.getSymbolSize = function getSymbolSize(version) {
      if (!version) throw new Error('"version" cannot be null or undefined');
      if (version < 1 || version > 40) throw new Error('"version" should be in range from 1 to 40');
      return version * 4 + 17;
    };
    exports.getSymbolTotalCodewords = function getSymbolTotalCodewords(version) {
      return CODEWORDS_COUNT[version];
    };
    exports.getBCHDigit = function(data) {
      let digit = 0;
      while (data !== 0) {
        digit++;
        data >>>= 1;
      }
      return digit;
    };
    exports.setToSJISFunction = function setToSJISFunction(f) {
      if (typeof f !== "function") {
        throw new Error('"toSJISFunc" is not a valid function.');
      }
      toSJISFunction = f;
    };
    exports.isKanjiModeEnabled = function() {
      return typeof toSJISFunction !== "undefined";
    };
    exports.toSJIS = function toSJIS(kanji) {
      return toSJISFunction(kanji);
    };
  }
});

// ../node_modules/qrcode/lib/core/error-correction-level.js
var require_error_correction_level = __commonJS({
  "../node_modules/qrcode/lib/core/error-correction-level.js"(exports) {
    "use strict";
    exports.L = { bit: 1 };
    exports.M = { bit: 0 };
    exports.Q = { bit: 3 };
    exports.H = { bit: 2 };
    function fromString(string) {
      if (typeof string !== "string") {
        throw new Error("Param is not a string");
      }
      const lcStr = string.toLowerCase();
      switch (lcStr) {
        case "l":
        case "low":
          return exports.L;
        case "m":
        case "medium":
          return exports.M;
        case "q":
        case "quartile":
          return exports.Q;
        case "h":
        case "high":
          return exports.H;
        default:
          throw new Error("Unknown EC Level: " + string);
      }
    }
    exports.isValid = function isValid(level) {
      return level && typeof level.bit !== "undefined" && level.bit >= 0 && level.bit < 4;
    };
    exports.from = function from(value, defaultValue) {
      if (exports.isValid(value)) {
        return value;
      }
      try {
        return fromString(value);
      } catch (e) {
        return defaultValue;
      }
    };
  }
});

// ../node_modules/qrcode/lib/core/bit-buffer.js
var require_bit_buffer = __commonJS({
  "../node_modules/qrcode/lib/core/bit-buffer.js"(exports, module2) {
    "use strict";
    function BitBuffer() {
      this.buffer = [];
      this.length = 0;
    }
    BitBuffer.prototype = {
      get: function(index) {
        const bufIndex = Math.floor(index / 8);
        return (this.buffer[bufIndex] >>> 7 - index % 8 & 1) === 1;
      },
      put: function(num, length) {
        for (let i = 0; i < length; i++) {
          this.putBit((num >>> length - i - 1 & 1) === 1);
        }
      },
      getLengthInBits: function() {
        return this.length;
      },
      putBit: function(bit) {
        const bufIndex = Math.floor(this.length / 8);
        if (this.buffer.length <= bufIndex) {
          this.buffer.push(0);
        }
        if (bit) {
          this.buffer[bufIndex] |= 128 >>> this.length % 8;
        }
        this.length++;
      }
    };
    module2.exports = BitBuffer;
  }
});

// ../node_modules/qrcode/lib/core/bit-matrix.js
var require_bit_matrix = __commonJS({
  "../node_modules/qrcode/lib/core/bit-matrix.js"(exports, module2) {
    "use strict";
    function BitMatrix(size) {
      if (!size || size < 1) {
        throw new Error("BitMatrix size must be defined and greater than 0");
      }
      this.size = size;
      this.data = new Uint8Array(size * size);
      this.reservedBit = new Uint8Array(size * size);
    }
    BitMatrix.prototype.set = function(row, col, value, reserved) {
      const index = row * this.size + col;
      this.data[index] = value;
      if (reserved) this.reservedBit[index] = true;
    };
    BitMatrix.prototype.get = function(row, col) {
      return this.data[row * this.size + col];
    };
    BitMatrix.prototype.xor = function(row, col, value) {
      this.data[row * this.size + col] ^= value;
    };
    BitMatrix.prototype.isReserved = function(row, col) {
      return this.reservedBit[row * this.size + col];
    };
    module2.exports = BitMatrix;
  }
});

// ../node_modules/qrcode/lib/core/alignment-pattern.js
var require_alignment_pattern = __commonJS({
  "../node_modules/qrcode/lib/core/alignment-pattern.js"(exports) {
    "use strict";
    var getSymbolSize = require_utils().getSymbolSize;
    exports.getRowColCoords = function getRowColCoords(version) {
      if (version === 1) return [];
      const posCount = Math.floor(version / 7) + 2;
      const size = getSymbolSize(version);
      const intervals = size === 145 ? 26 : Math.ceil((size - 13) / (2 * posCount - 2)) * 2;
      const positions = [size - 7];
      for (let i = 1; i < posCount - 1; i++) {
        positions[i] = positions[i - 1] - intervals;
      }
      positions.push(6);
      return positions.reverse();
    };
    exports.getPositions = function getPositions(version) {
      const coords = [];
      const pos = exports.getRowColCoords(version);
      const posLength = pos.length;
      for (let i = 0; i < posLength; i++) {
        for (let j = 0; j < posLength; j++) {
          if (i === 0 && j === 0 || // top-left
          i === 0 && j === posLength - 1 || // bottom-left
          i === posLength - 1 && j === 0) {
            continue;
          }
          coords.push([pos[i], pos[j]]);
        }
      }
      return coords;
    };
  }
});

// ../node_modules/qrcode/lib/core/finder-pattern.js
var require_finder_pattern = __commonJS({
  "../node_modules/qrcode/lib/core/finder-pattern.js"(exports) {
    "use strict";
    var getSymbolSize = require_utils().getSymbolSize;
    var FINDER_PATTERN_SIZE = 7;
    exports.getPositions = function getPositions(version) {
      const size = getSymbolSize(version);
      return [
        // top-left
        [0, 0],
        // top-right
        [size - FINDER_PATTERN_SIZE, 0],
        // bottom-left
        [0, size - FINDER_PATTERN_SIZE]
      ];
    };
  }
});

// ../node_modules/qrcode/lib/core/mask-pattern.js
var require_mask_pattern = __commonJS({
  "../node_modules/qrcode/lib/core/mask-pattern.js"(exports) {
    "use strict";
    exports.Patterns = {
      PATTERN000: 0,
      PATTERN001: 1,
      PATTERN010: 2,
      PATTERN011: 3,
      PATTERN100: 4,
      PATTERN101: 5,
      PATTERN110: 6,
      PATTERN111: 7
    };
    var PenaltyScores = {
      N1: 3,
      N2: 3,
      N3: 40,
      N4: 10
    };
    exports.isValid = function isValid(mask) {
      return mask != null && mask !== "" && !isNaN(mask) && mask >= 0 && mask <= 7;
    };
    exports.from = function from(value) {
      return exports.isValid(value) ? parseInt(value, 10) : void 0;
    };
    exports.getPenaltyN1 = function getPenaltyN1(data) {
      const size = data.size;
      let points = 0;
      let sameCountCol = 0;
      let sameCountRow = 0;
      let lastCol = null;
      let lastRow = null;
      for (let row = 0; row < size; row++) {
        sameCountCol = sameCountRow = 0;
        lastCol = lastRow = null;
        for (let col = 0; col < size; col++) {
          let module3 = data.get(row, col);
          if (module3 === lastCol) {
            sameCountCol++;
          } else {
            if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
            lastCol = module3;
            sameCountCol = 1;
          }
          module3 = data.get(col, row);
          if (module3 === lastRow) {
            sameCountRow++;
          } else {
            if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
            lastRow = module3;
            sameCountRow = 1;
          }
        }
        if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
        if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
      }
      return points;
    };
    exports.getPenaltyN2 = function getPenaltyN2(data) {
      const size = data.size;
      let points = 0;
      for (let row = 0; row < size - 1; row++) {
        for (let col = 0; col < size - 1; col++) {
          const last = data.get(row, col) + data.get(row, col + 1) + data.get(row + 1, col) + data.get(row + 1, col + 1);
          if (last === 4 || last === 0) points++;
        }
      }
      return points * PenaltyScores.N2;
    };
    exports.getPenaltyN3 = function getPenaltyN3(data) {
      const size = data.size;
      let points = 0;
      let bitsCol = 0;
      let bitsRow = 0;
      for (let row = 0; row < size; row++) {
        bitsCol = bitsRow = 0;
        for (let col = 0; col < size; col++) {
          bitsCol = bitsCol << 1 & 2047 | data.get(row, col);
          if (col >= 10 && (bitsCol === 1488 || bitsCol === 93)) points++;
          bitsRow = bitsRow << 1 & 2047 | data.get(col, row);
          if (col >= 10 && (bitsRow === 1488 || bitsRow === 93)) points++;
        }
      }
      return points * PenaltyScores.N3;
    };
    exports.getPenaltyN4 = function getPenaltyN4(data) {
      let darkCount = 0;
      const modulesCount = data.data.length;
      for (let i = 0; i < modulesCount; i++) darkCount += data.data[i];
      const k = Math.abs(Math.ceil(darkCount * 100 / modulesCount / 5) - 10);
      return k * PenaltyScores.N4;
    };
    function getMaskAt(maskPattern, i, j) {
      switch (maskPattern) {
        case exports.Patterns.PATTERN000:
          return (i + j) % 2 === 0;
        case exports.Patterns.PATTERN001:
          return i % 2 === 0;
        case exports.Patterns.PATTERN010:
          return j % 3 === 0;
        case exports.Patterns.PATTERN011:
          return (i + j) % 3 === 0;
        case exports.Patterns.PATTERN100:
          return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
        case exports.Patterns.PATTERN101:
          return i * j % 2 + i * j % 3 === 0;
        case exports.Patterns.PATTERN110:
          return (i * j % 2 + i * j % 3) % 2 === 0;
        case exports.Patterns.PATTERN111:
          return (i * j % 3 + (i + j) % 2) % 2 === 0;
        default:
          throw new Error("bad maskPattern:" + maskPattern);
      }
    }
    exports.applyMask = function applyMask(pattern, data) {
      const size = data.size;
      for (let col = 0; col < size; col++) {
        for (let row = 0; row < size; row++) {
          if (data.isReserved(row, col)) continue;
          data.xor(row, col, getMaskAt(pattern, row, col));
        }
      }
    };
    exports.getBestMask = function getBestMask(data, setupFormatFunc) {
      const numPatterns = Object.keys(exports.Patterns).length;
      let bestPattern = 0;
      let lowerPenalty = Infinity;
      for (let p = 0; p < numPatterns; p++) {
        setupFormatFunc(p);
        exports.applyMask(p, data);
        const penalty = exports.getPenaltyN1(data) + exports.getPenaltyN2(data) + exports.getPenaltyN3(data) + exports.getPenaltyN4(data);
        exports.applyMask(p, data);
        if (penalty < lowerPenalty) {
          lowerPenalty = penalty;
          bestPattern = p;
        }
      }
      return bestPattern;
    };
  }
});

// ../node_modules/qrcode/lib/core/error-correction-code.js
var require_error_correction_code = __commonJS({
  "../node_modules/qrcode/lib/core/error-correction-code.js"(exports) {
    "use strict";
    var ECLevel = require_error_correction_level();
    var EC_BLOCKS_TABLE = [
      // L  M  Q  H
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      2,
      2,
      1,
      2,
      2,
      4,
      1,
      2,
      4,
      4,
      2,
      4,
      4,
      4,
      2,
      4,
      6,
      5,
      2,
      4,
      6,
      6,
      2,
      5,
      8,
      8,
      4,
      5,
      8,
      8,
      4,
      5,
      8,
      11,
      4,
      8,
      10,
      11,
      4,
      9,
      12,
      16,
      4,
      9,
      16,
      16,
      6,
      10,
      12,
      18,
      6,
      10,
      17,
      16,
      6,
      11,
      16,
      19,
      6,
      13,
      18,
      21,
      7,
      14,
      21,
      25,
      8,
      16,
      20,
      25,
      8,
      17,
      23,
      25,
      9,
      17,
      23,
      34,
      9,
      18,
      25,
      30,
      10,
      20,
      27,
      32,
      12,
      21,
      29,
      35,
      12,
      23,
      34,
      37,
      12,
      25,
      34,
      40,
      13,
      26,
      35,
      42,
      14,
      28,
      38,
      45,
      15,
      29,
      40,
      48,
      16,
      31,
      43,
      51,
      17,
      33,
      45,
      54,
      18,
      35,
      48,
      57,
      19,
      37,
      51,
      60,
      19,
      38,
      53,
      63,
      20,
      40,
      56,
      66,
      21,
      43,
      59,
      70,
      22,
      45,
      62,
      74,
      24,
      47,
      65,
      77,
      25,
      49,
      68,
      81
    ];
    var EC_CODEWORDS_TABLE = [
      // L  M  Q  H
      7,
      10,
      13,
      17,
      10,
      16,
      22,
      28,
      15,
      26,
      36,
      44,
      20,
      36,
      52,
      64,
      26,
      48,
      72,
      88,
      36,
      64,
      96,
      112,
      40,
      72,
      108,
      130,
      48,
      88,
      132,
      156,
      60,
      110,
      160,
      192,
      72,
      130,
      192,
      224,
      80,
      150,
      224,
      264,
      96,
      176,
      260,
      308,
      104,
      198,
      288,
      352,
      120,
      216,
      320,
      384,
      132,
      240,
      360,
      432,
      144,
      280,
      408,
      480,
      168,
      308,
      448,
      532,
      180,
      338,
      504,
      588,
      196,
      364,
      546,
      650,
      224,
      416,
      600,
      700,
      224,
      442,
      644,
      750,
      252,
      476,
      690,
      816,
      270,
      504,
      750,
      900,
      300,
      560,
      810,
      960,
      312,
      588,
      870,
      1050,
      336,
      644,
      952,
      1110,
      360,
      700,
      1020,
      1200,
      390,
      728,
      1050,
      1260,
      420,
      784,
      1140,
      1350,
      450,
      812,
      1200,
      1440,
      480,
      868,
      1290,
      1530,
      510,
      924,
      1350,
      1620,
      540,
      980,
      1440,
      1710,
      570,
      1036,
      1530,
      1800,
      570,
      1064,
      1590,
      1890,
      600,
      1120,
      1680,
      1980,
      630,
      1204,
      1770,
      2100,
      660,
      1260,
      1860,
      2220,
      720,
      1316,
      1950,
      2310,
      750,
      1372,
      2040,
      2430
    ];
    exports.getBlocksCount = function getBlocksCount(version, errorCorrectionLevel) {
      switch (errorCorrectionLevel) {
        case ECLevel.L:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 0];
        case ECLevel.M:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 1];
        case ECLevel.Q:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 2];
        case ECLevel.H:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 3];
        default:
          return void 0;
      }
    };
    exports.getTotalCodewordsCount = function getTotalCodewordsCount(version, errorCorrectionLevel) {
      switch (errorCorrectionLevel) {
        case ECLevel.L:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 0];
        case ECLevel.M:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 1];
        case ECLevel.Q:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 2];
        case ECLevel.H:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 3];
        default:
          return void 0;
      }
    };
  }
});

// ../node_modules/qrcode/lib/core/galois-field.js
var require_galois_field = __commonJS({
  "../node_modules/qrcode/lib/core/galois-field.js"(exports) {
    "use strict";
    var EXP_TABLE = new Uint8Array(512);
    var LOG_TABLE = new Uint8Array(256);
    (function initTables() {
      let x = 1;
      for (let i = 0; i < 255; i++) {
        EXP_TABLE[i] = x;
        LOG_TABLE[x] = i;
        x <<= 1;
        if (x & 256) {
          x ^= 285;
        }
      }
      for (let i = 255; i < 512; i++) {
        EXP_TABLE[i] = EXP_TABLE[i - 255];
      }
    })();
    exports.log = function log(n) {
      if (n < 1) throw new Error("log(" + n + ")");
      return LOG_TABLE[n];
    };
    exports.exp = function exp(n) {
      return EXP_TABLE[n];
    };
    exports.mul = function mul(x, y) {
      if (x === 0 || y === 0) return 0;
      return EXP_TABLE[LOG_TABLE[x] + LOG_TABLE[y]];
    };
  }
});

// ../node_modules/qrcode/lib/core/polynomial.js
var require_polynomial = __commonJS({
  "../node_modules/qrcode/lib/core/polynomial.js"(exports) {
    "use strict";
    var GF = require_galois_field();
    exports.mul = function mul(p1, p2) {
      const coeff = new Uint8Array(p1.length + p2.length - 1);
      for (let i = 0; i < p1.length; i++) {
        for (let j = 0; j < p2.length; j++) {
          coeff[i + j] ^= GF.mul(p1[i], p2[j]);
        }
      }
      return coeff;
    };
    exports.mod = function mod(divident, divisor) {
      let result = new Uint8Array(divident);
      while (result.length - divisor.length >= 0) {
        const coeff = result[0];
        for (let i = 0; i < divisor.length; i++) {
          result[i] ^= GF.mul(divisor[i], coeff);
        }
        let offset = 0;
        while (offset < result.length && result[offset] === 0) offset++;
        result = result.slice(offset);
      }
      return result;
    };
    exports.generateECPolynomial = function generateECPolynomial(degree) {
      let poly = new Uint8Array([1]);
      for (let i = 0; i < degree; i++) {
        poly = exports.mul(poly, new Uint8Array([1, GF.exp(i)]));
      }
      return poly;
    };
  }
});

// ../node_modules/qrcode/lib/core/reed-solomon-encoder.js
var require_reed_solomon_encoder = __commonJS({
  "../node_modules/qrcode/lib/core/reed-solomon-encoder.js"(exports, module2) {
    "use strict";
    var Polynomial = require_polynomial();
    function ReedSolomonEncoder(degree) {
      this.genPoly = void 0;
      this.degree = degree;
      if (this.degree) this.initialize(this.degree);
    }
    ReedSolomonEncoder.prototype.initialize = function initialize(degree) {
      this.degree = degree;
      this.genPoly = Polynomial.generateECPolynomial(this.degree);
    };
    ReedSolomonEncoder.prototype.encode = function encode(data) {
      if (!this.genPoly) {
        throw new Error("Encoder not initialized");
      }
      const paddedData = new Uint8Array(data.length + this.degree);
      paddedData.set(data);
      const remainder = Polynomial.mod(paddedData, this.genPoly);
      const start = this.degree - remainder.length;
      if (start > 0) {
        const buff = new Uint8Array(this.degree);
        buff.set(remainder, start);
        return buff;
      }
      return remainder;
    };
    module2.exports = ReedSolomonEncoder;
  }
});

// ../node_modules/qrcode/lib/core/version-check.js
var require_version_check = __commonJS({
  "../node_modules/qrcode/lib/core/version-check.js"(exports) {
    "use strict";
    exports.isValid = function isValid(version) {
      return !isNaN(version) && version >= 1 && version <= 40;
    };
  }
});

// ../node_modules/qrcode/lib/core/regex.js
var require_regex = __commonJS({
  "../node_modules/qrcode/lib/core/regex.js"(exports) {
    "use strict";
    var numeric = "[0-9]+";
    var alphanumeric = "[A-Z $%*+\\-./:]+";
    var kanji = "(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";
    kanji = kanji.replace(/u/g, "\\u");
    var byte = "(?:(?![A-Z0-9 $%*+\\-./:]|" + kanji + ")(?:.|[\r\n]))+";
    exports.KANJI = new RegExp(kanji, "g");
    exports.BYTE_KANJI = new RegExp("[^A-Z0-9 $%*+\\-./:]+", "g");
    exports.BYTE = new RegExp(byte, "g");
    exports.NUMERIC = new RegExp(numeric, "g");
    exports.ALPHANUMERIC = new RegExp(alphanumeric, "g");
    var TEST_KANJI = new RegExp("^" + kanji + "$");
    var TEST_NUMERIC = new RegExp("^" + numeric + "$");
    var TEST_ALPHANUMERIC = new RegExp("^[A-Z0-9 $%*+\\-./:]+$");
    exports.testKanji = function testKanji(str) {
      return TEST_KANJI.test(str);
    };
    exports.testNumeric = function testNumeric(str) {
      return TEST_NUMERIC.test(str);
    };
    exports.testAlphanumeric = function testAlphanumeric(str) {
      return TEST_ALPHANUMERIC.test(str);
    };
  }
});

// ../node_modules/qrcode/lib/core/mode.js
var require_mode = __commonJS({
  "../node_modules/qrcode/lib/core/mode.js"(exports) {
    "use strict";
    var VersionCheck = require_version_check();
    var Regex = require_regex();
    exports.NUMERIC = {
      id: "Numeric",
      bit: 1 << 0,
      ccBits: [10, 12, 14]
    };
    exports.ALPHANUMERIC = {
      id: "Alphanumeric",
      bit: 1 << 1,
      ccBits: [9, 11, 13]
    };
    exports.BYTE = {
      id: "Byte",
      bit: 1 << 2,
      ccBits: [8, 16, 16]
    };
    exports.KANJI = {
      id: "Kanji",
      bit: 1 << 3,
      ccBits: [8, 10, 12]
    };
    exports.MIXED = {
      bit: -1
    };
    exports.getCharCountIndicator = function getCharCountIndicator(mode, version) {
      if (!mode.ccBits) throw new Error("Invalid mode: " + mode);
      if (!VersionCheck.isValid(version)) {
        throw new Error("Invalid version: " + version);
      }
      if (version >= 1 && version < 10) return mode.ccBits[0];
      else if (version < 27) return mode.ccBits[1];
      return mode.ccBits[2];
    };
    exports.getBestModeForData = function getBestModeForData(dataStr) {
      if (Regex.testNumeric(dataStr)) return exports.NUMERIC;
      else if (Regex.testAlphanumeric(dataStr)) return exports.ALPHANUMERIC;
      else if (Regex.testKanji(dataStr)) return exports.KANJI;
      else return exports.BYTE;
    };
    exports.toString = function toString2(mode) {
      if (mode && mode.id) return mode.id;
      throw new Error("Invalid mode");
    };
    exports.isValid = function isValid(mode) {
      return mode && mode.bit && mode.ccBits;
    };
    function fromString(string) {
      if (typeof string !== "string") {
        throw new Error("Param is not a string");
      }
      const lcStr = string.toLowerCase();
      switch (lcStr) {
        case "numeric":
          return exports.NUMERIC;
        case "alphanumeric":
          return exports.ALPHANUMERIC;
        case "kanji":
          return exports.KANJI;
        case "byte":
          return exports.BYTE;
        default:
          throw new Error("Unknown mode: " + string);
      }
    }
    exports.from = function from(value, defaultValue) {
      if (exports.isValid(value)) {
        return value;
      }
      try {
        return fromString(value);
      } catch (e) {
        return defaultValue;
      }
    };
  }
});

// ../node_modules/qrcode/lib/core/version.js
var require_version = __commonJS({
  "../node_modules/qrcode/lib/core/version.js"(exports) {
    "use strict";
    var Utils = require_utils();
    var ECCode = require_error_correction_code();
    var ECLevel = require_error_correction_level();
    var Mode = require_mode();
    var VersionCheck = require_version_check();
    var G18 = 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0;
    var G18_BCH = Utils.getBCHDigit(G18);
    function getBestVersionForDataLength(mode, length, errorCorrectionLevel) {
      for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
        if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, mode)) {
          return currentVersion;
        }
      }
      return void 0;
    }
    function getReservedBitsCount(mode, version) {
      return Mode.getCharCountIndicator(mode, version) + 4;
    }
    function getTotalBitsFromDataArray(segments, version) {
      let totalBits = 0;
      segments.forEach(function(data) {
        const reservedBits = getReservedBitsCount(data.mode, version);
        totalBits += reservedBits + data.getBitsLength();
      });
      return totalBits;
    }
    function getBestVersionForMixedData(segments, errorCorrectionLevel) {
      for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
        const length = getTotalBitsFromDataArray(segments, currentVersion);
        if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, Mode.MIXED)) {
          return currentVersion;
        }
      }
      return void 0;
    }
    exports.from = function from(value, defaultValue) {
      if (VersionCheck.isValid(value)) {
        return parseInt(value, 10);
      }
      return defaultValue;
    };
    exports.getCapacity = function getCapacity(version, errorCorrectionLevel, mode) {
      if (!VersionCheck.isValid(version)) {
        throw new Error("Invalid QR Code version");
      }
      if (typeof mode === "undefined") mode = Mode.BYTE;
      const totalCodewords = Utils.getSymbolTotalCodewords(version);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
      const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
      if (mode === Mode.MIXED) return dataTotalCodewordsBits;
      const usableBits = dataTotalCodewordsBits - getReservedBitsCount(mode, version);
      switch (mode) {
        case Mode.NUMERIC:
          return Math.floor(usableBits / 10 * 3);
        case Mode.ALPHANUMERIC:
          return Math.floor(usableBits / 11 * 2);
        case Mode.KANJI:
          return Math.floor(usableBits / 13);
        case Mode.BYTE:
        default:
          return Math.floor(usableBits / 8);
      }
    };
    exports.getBestVersionForData = function getBestVersionForData(data, errorCorrectionLevel) {
      let seg;
      const ecl = ECLevel.from(errorCorrectionLevel, ECLevel.M);
      if (Array.isArray(data)) {
        if (data.length > 1) {
          return getBestVersionForMixedData(data, ecl);
        }
        if (data.length === 0) {
          return 1;
        }
        seg = data[0];
      } else {
        seg = data;
      }
      return getBestVersionForDataLength(seg.mode, seg.getLength(), ecl);
    };
    exports.getEncodedBits = function getEncodedBits(version) {
      if (!VersionCheck.isValid(version) || version < 7) {
        throw new Error("Invalid QR Code version");
      }
      let d = version << 12;
      while (Utils.getBCHDigit(d) - G18_BCH >= 0) {
        d ^= G18 << Utils.getBCHDigit(d) - G18_BCH;
      }
      return version << 12 | d;
    };
  }
});

// ../node_modules/qrcode/lib/core/format-info.js
var require_format_info = __commonJS({
  "../node_modules/qrcode/lib/core/format-info.js"(exports) {
    "use strict";
    var Utils = require_utils();
    var G15 = 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0;
    var G15_MASK = 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1;
    var G15_BCH = Utils.getBCHDigit(G15);
    exports.getEncodedBits = function getEncodedBits(errorCorrectionLevel, mask) {
      const data = errorCorrectionLevel.bit << 3 | mask;
      let d = data << 10;
      while (Utils.getBCHDigit(d) - G15_BCH >= 0) {
        d ^= G15 << Utils.getBCHDigit(d) - G15_BCH;
      }
      return (data << 10 | d) ^ G15_MASK;
    };
  }
});

// ../node_modules/qrcode/lib/core/numeric-data.js
var require_numeric_data = __commonJS({
  "../node_modules/qrcode/lib/core/numeric-data.js"(exports, module2) {
    "use strict";
    var Mode = require_mode();
    function NumericData(data) {
      this.mode = Mode.NUMERIC;
      this.data = data.toString();
    }
    NumericData.getBitsLength = function getBitsLength(length) {
      return 10 * Math.floor(length / 3) + (length % 3 ? length % 3 * 3 + 1 : 0);
    };
    NumericData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    NumericData.prototype.getBitsLength = function getBitsLength() {
      return NumericData.getBitsLength(this.data.length);
    };
    NumericData.prototype.write = function write(bitBuffer) {
      let i, group, value;
      for (i = 0; i + 3 <= this.data.length; i += 3) {
        group = this.data.substr(i, 3);
        value = parseInt(group, 10);
        bitBuffer.put(value, 10);
      }
      const remainingNum = this.data.length - i;
      if (remainingNum > 0) {
        group = this.data.substr(i);
        value = parseInt(group, 10);
        bitBuffer.put(value, remainingNum * 3 + 1);
      }
    };
    module2.exports = NumericData;
  }
});

// ../node_modules/qrcode/lib/core/alphanumeric-data.js
var require_alphanumeric_data = __commonJS({
  "../node_modules/qrcode/lib/core/alphanumeric-data.js"(exports, module2) {
    "use strict";
    var Mode = require_mode();
    var ALPHA_NUM_CHARS = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      " ",
      "$",
      "%",
      "*",
      "+",
      "-",
      ".",
      "/",
      ":"
    ];
    function AlphanumericData(data) {
      this.mode = Mode.ALPHANUMERIC;
      this.data = data;
    }
    AlphanumericData.getBitsLength = function getBitsLength(length) {
      return 11 * Math.floor(length / 2) + 6 * (length % 2);
    };
    AlphanumericData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    AlphanumericData.prototype.getBitsLength = function getBitsLength() {
      return AlphanumericData.getBitsLength(this.data.length);
    };
    AlphanumericData.prototype.write = function write(bitBuffer) {
      let i;
      for (i = 0; i + 2 <= this.data.length; i += 2) {
        let value = ALPHA_NUM_CHARS.indexOf(this.data[i]) * 45;
        value += ALPHA_NUM_CHARS.indexOf(this.data[i + 1]);
        bitBuffer.put(value, 11);
      }
      if (this.data.length % 2) {
        bitBuffer.put(ALPHA_NUM_CHARS.indexOf(this.data[i]), 6);
      }
    };
    module2.exports = AlphanumericData;
  }
});

// ../node_modules/qrcode/lib/core/byte-data.js
var require_byte_data = __commonJS({
  "../node_modules/qrcode/lib/core/byte-data.js"(exports, module2) {
    "use strict";
    var Mode = require_mode();
    function ByteData(data) {
      this.mode = Mode.BYTE;
      if (typeof data === "string") {
        this.data = new TextEncoder().encode(data);
      } else {
        this.data = new Uint8Array(data);
      }
    }
    ByteData.getBitsLength = function getBitsLength(length) {
      return length * 8;
    };
    ByteData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    ByteData.prototype.getBitsLength = function getBitsLength() {
      return ByteData.getBitsLength(this.data.length);
    };
    ByteData.prototype.write = function(bitBuffer) {
      for (let i = 0, l = this.data.length; i < l; i++) {
        bitBuffer.put(this.data[i], 8);
      }
    };
    module2.exports = ByteData;
  }
});

// ../node_modules/qrcode/lib/core/kanji-data.js
var require_kanji_data = __commonJS({
  "../node_modules/qrcode/lib/core/kanji-data.js"(exports, module2) {
    "use strict";
    var Mode = require_mode();
    var Utils = require_utils();
    function KanjiData(data) {
      this.mode = Mode.KANJI;
      this.data = data;
    }
    KanjiData.getBitsLength = function getBitsLength(length) {
      return length * 13;
    };
    KanjiData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    KanjiData.prototype.getBitsLength = function getBitsLength() {
      return KanjiData.getBitsLength(this.data.length);
    };
    KanjiData.prototype.write = function(bitBuffer) {
      let i;
      for (i = 0; i < this.data.length; i++) {
        let value = Utils.toSJIS(this.data[i]);
        if (value >= 33088 && value <= 40956) {
          value -= 33088;
        } else if (value >= 57408 && value <= 60351) {
          value -= 49472;
        } else {
          throw new Error(
            "Invalid SJIS character: " + this.data[i] + "\nMake sure your charset is UTF-8"
          );
        }
        value = (value >>> 8 & 255) * 192 + (value & 255);
        bitBuffer.put(value, 13);
      }
    };
    module2.exports = KanjiData;
  }
});

// ../node_modules/dijkstrajs/dijkstra.js
var require_dijkstra = __commonJS({
  "../node_modules/dijkstrajs/dijkstra.js"(exports, module2) {
    "use strict";
    var dijkstra = {
      single_source_shortest_paths: function(graph, s, d) {
        var predecessors = {};
        var costs = {};
        costs[s] = 0;
        var open = dijkstra.PriorityQueue.make();
        open.push(s, 0);
        var closest, u, v, cost_of_s_to_u, adjacent_nodes, cost_of_e, cost_of_s_to_u_plus_cost_of_e, cost_of_s_to_v, first_visit;
        while (!open.empty()) {
          closest = open.pop();
          u = closest.value;
          cost_of_s_to_u = closest.cost;
          adjacent_nodes = graph[u] || {};
          for (v in adjacent_nodes) {
            if (adjacent_nodes.hasOwnProperty(v)) {
              cost_of_e = adjacent_nodes[v];
              cost_of_s_to_u_plus_cost_of_e = cost_of_s_to_u + cost_of_e;
              cost_of_s_to_v = costs[v];
              first_visit = typeof costs[v] === "undefined";
              if (first_visit || cost_of_s_to_v > cost_of_s_to_u_plus_cost_of_e) {
                costs[v] = cost_of_s_to_u_plus_cost_of_e;
                open.push(v, cost_of_s_to_u_plus_cost_of_e);
                predecessors[v] = u;
              }
            }
          }
        }
        if (typeof d !== "undefined" && typeof costs[d] === "undefined") {
          var msg = ["Could not find a path from ", s, " to ", d, "."].join("");
          throw new Error(msg);
        }
        return predecessors;
      },
      extract_shortest_path_from_predecessor_list: function(predecessors, d) {
        var nodes = [];
        var u = d;
        var predecessor;
        while (u) {
          nodes.push(u);
          predecessor = predecessors[u];
          u = predecessors[u];
        }
        nodes.reverse();
        return nodes;
      },
      find_path: function(graph, s, d) {
        var predecessors = dijkstra.single_source_shortest_paths(graph, s, d);
        return dijkstra.extract_shortest_path_from_predecessor_list(
          predecessors,
          d
        );
      },
      /**
       * A very naive priority queue implementation.
       */
      PriorityQueue: {
        make: function(opts) {
          var T = dijkstra.PriorityQueue, t = {}, key;
          opts = opts || {};
          for (key in T) {
            if (T.hasOwnProperty(key)) {
              t[key] = T[key];
            }
          }
          t.queue = [];
          t.sorter = opts.sorter || T.default_sorter;
          return t;
        },
        default_sorter: function(a, b) {
          return a.cost - b.cost;
        },
        /**
         * Add a new item to the queue and ensure the highest priority element
         * is at the front of the queue.
         */
        push: function(value, cost) {
          var item = { value, cost };
          this.queue.push(item);
          this.queue.sort(this.sorter);
        },
        /**
         * Return the highest priority element in the queue.
         */
        pop: function() {
          return this.queue.shift();
        },
        empty: function() {
          return this.queue.length === 0;
        }
      }
    };
    if (typeof module2 !== "undefined") {
      module2.exports = dijkstra;
    }
  }
});

// ../node_modules/qrcode/lib/core/segments.js
var require_segments = __commonJS({
  "../node_modules/qrcode/lib/core/segments.js"(exports) {
    "use strict";
    var Mode = require_mode();
    var NumericData = require_numeric_data();
    var AlphanumericData = require_alphanumeric_data();
    var ByteData = require_byte_data();
    var KanjiData = require_kanji_data();
    var Regex = require_regex();
    var Utils = require_utils();
    var dijkstra = require_dijkstra();
    function getStringByteLength(str) {
      return unescape(encodeURIComponent(str)).length;
    }
    function getSegments(regex, mode, str) {
      const segments = [];
      let result;
      while ((result = regex.exec(str)) !== null) {
        segments.push({
          data: result[0],
          index: result.index,
          mode,
          length: result[0].length
        });
      }
      return segments;
    }
    function getSegmentsFromString(dataStr) {
      const numSegs = getSegments(Regex.NUMERIC, Mode.NUMERIC, dataStr);
      const alphaNumSegs = getSegments(Regex.ALPHANUMERIC, Mode.ALPHANUMERIC, dataStr);
      let byteSegs;
      let kanjiSegs;
      if (Utils.isKanjiModeEnabled()) {
        byteSegs = getSegments(Regex.BYTE, Mode.BYTE, dataStr);
        kanjiSegs = getSegments(Regex.KANJI, Mode.KANJI, dataStr);
      } else {
        byteSegs = getSegments(Regex.BYTE_KANJI, Mode.BYTE, dataStr);
        kanjiSegs = [];
      }
      const segs = numSegs.concat(alphaNumSegs, byteSegs, kanjiSegs);
      return segs.sort(function(s1, s2) {
        return s1.index - s2.index;
      }).map(function(obj) {
        return {
          data: obj.data,
          mode: obj.mode,
          length: obj.length
        };
      });
    }
    function getSegmentBitsLength(length, mode) {
      switch (mode) {
        case Mode.NUMERIC:
          return NumericData.getBitsLength(length);
        case Mode.ALPHANUMERIC:
          return AlphanumericData.getBitsLength(length);
        case Mode.KANJI:
          return KanjiData.getBitsLength(length);
        case Mode.BYTE:
          return ByteData.getBitsLength(length);
      }
    }
    function mergeSegments(segs) {
      return segs.reduce(function(acc, curr) {
        const prevSeg = acc.length - 1 >= 0 ? acc[acc.length - 1] : null;
        if (prevSeg && prevSeg.mode === curr.mode) {
          acc[acc.length - 1].data += curr.data;
          return acc;
        }
        acc.push(curr);
        return acc;
      }, []);
    }
    function buildNodes(segs) {
      const nodes = [];
      for (let i = 0; i < segs.length; i++) {
        const seg = segs[i];
        switch (seg.mode) {
          case Mode.NUMERIC:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.ALPHANUMERIC, length: seg.length },
              { data: seg.data, mode: Mode.BYTE, length: seg.length }
            ]);
            break;
          case Mode.ALPHANUMERIC:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.BYTE, length: seg.length }
            ]);
            break;
          case Mode.KANJI:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
            ]);
            break;
          case Mode.BYTE:
            nodes.push([
              { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
            ]);
        }
      }
      return nodes;
    }
    function buildGraph(nodes, version) {
      const table = {};
      const graph = { start: {} };
      let prevNodeIds = ["start"];
      for (let i = 0; i < nodes.length; i++) {
        const nodeGroup = nodes[i];
        const currentNodeIds = [];
        for (let j = 0; j < nodeGroup.length; j++) {
          const node = nodeGroup[j];
          const key = "" + i + j;
          currentNodeIds.push(key);
          table[key] = { node, lastCount: 0 };
          graph[key] = {};
          for (let n = 0; n < prevNodeIds.length; n++) {
            const prevNodeId = prevNodeIds[n];
            if (table[prevNodeId] && table[prevNodeId].node.mode === node.mode) {
              graph[prevNodeId][key] = getSegmentBitsLength(table[prevNodeId].lastCount + node.length, node.mode) - getSegmentBitsLength(table[prevNodeId].lastCount, node.mode);
              table[prevNodeId].lastCount += node.length;
            } else {
              if (table[prevNodeId]) table[prevNodeId].lastCount = node.length;
              graph[prevNodeId][key] = getSegmentBitsLength(node.length, node.mode) + 4 + Mode.getCharCountIndicator(node.mode, version);
            }
          }
        }
        prevNodeIds = currentNodeIds;
      }
      for (let n = 0; n < prevNodeIds.length; n++) {
        graph[prevNodeIds[n]].end = 0;
      }
      return { map: graph, table };
    }
    function buildSingleSegment(data, modesHint) {
      let mode;
      const bestMode = Mode.getBestModeForData(data);
      mode = Mode.from(modesHint, bestMode);
      if (mode !== Mode.BYTE && mode.bit < bestMode.bit) {
        throw new Error('"' + data + '" cannot be encoded with mode ' + Mode.toString(mode) + ".\n Suggested mode is: " + Mode.toString(bestMode));
      }
      if (mode === Mode.KANJI && !Utils.isKanjiModeEnabled()) {
        mode = Mode.BYTE;
      }
      switch (mode) {
        case Mode.NUMERIC:
          return new NumericData(data);
        case Mode.ALPHANUMERIC:
          return new AlphanumericData(data);
        case Mode.KANJI:
          return new KanjiData(data);
        case Mode.BYTE:
          return new ByteData(data);
      }
    }
    exports.fromArray = function fromArray(array) {
      return array.reduce(function(acc, seg) {
        if (typeof seg === "string") {
          acc.push(buildSingleSegment(seg, null));
        } else if (seg.data) {
          acc.push(buildSingleSegment(seg.data, seg.mode));
        }
        return acc;
      }, []);
    };
    exports.fromString = function fromString(data, version) {
      const segs = getSegmentsFromString(data, Utils.isKanjiModeEnabled());
      const nodes = buildNodes(segs);
      const graph = buildGraph(nodes, version);
      const path = dijkstra.find_path(graph.map, "start", "end");
      const optimizedSegs = [];
      for (let i = 1; i < path.length - 1; i++) {
        optimizedSegs.push(graph.table[path[i]].node);
      }
      return exports.fromArray(mergeSegments(optimizedSegs));
    };
    exports.rawSplit = function rawSplit(data) {
      return exports.fromArray(
        getSegmentsFromString(data, Utils.isKanjiModeEnabled())
      );
    };
  }
});

// ../node_modules/qrcode/lib/core/qrcode.js
var require_qrcode = __commonJS({
  "../node_modules/qrcode/lib/core/qrcode.js"(exports) {
    "use strict";
    var Utils = require_utils();
    var ECLevel = require_error_correction_level();
    var BitBuffer = require_bit_buffer();
    var BitMatrix = require_bit_matrix();
    var AlignmentPattern = require_alignment_pattern();
    var FinderPattern = require_finder_pattern();
    var MaskPattern = require_mask_pattern();
    var ECCode = require_error_correction_code();
    var ReedSolomonEncoder = require_reed_solomon_encoder();
    var Version = require_version();
    var FormatInfo = require_format_info();
    var Mode = require_mode();
    var Segments = require_segments();
    function setupFinderPattern(matrix, version) {
      const size = matrix.size;
      const pos = FinderPattern.getPositions(version);
      for (let i = 0; i < pos.length; i++) {
        const row = pos[i][0];
        const col = pos[i][1];
        for (let r = -1; r <= 7; r++) {
          if (row + r <= -1 || size <= row + r) continue;
          for (let c = -1; c <= 7; c++) {
            if (col + c <= -1 || size <= col + c) continue;
            if (r >= 0 && r <= 6 && (c === 0 || c === 6) || c >= 0 && c <= 6 && (r === 0 || r === 6) || r >= 2 && r <= 4 && c >= 2 && c <= 4) {
              matrix.set(row + r, col + c, true, true);
            } else {
              matrix.set(row + r, col + c, false, true);
            }
          }
        }
      }
    }
    function setupTimingPattern(matrix) {
      const size = matrix.size;
      for (let r = 8; r < size - 8; r++) {
        const value = r % 2 === 0;
        matrix.set(r, 6, value, true);
        matrix.set(6, r, value, true);
      }
    }
    function setupAlignmentPattern(matrix, version) {
      const pos = AlignmentPattern.getPositions(version);
      for (let i = 0; i < pos.length; i++) {
        const row = pos[i][0];
        const col = pos[i][1];
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            if (r === -2 || r === 2 || c === -2 || c === 2 || r === 0 && c === 0) {
              matrix.set(row + r, col + c, true, true);
            } else {
              matrix.set(row + r, col + c, false, true);
            }
          }
        }
      }
    }
    function setupVersionInfo(matrix, version) {
      const size = matrix.size;
      const bits = Version.getEncodedBits(version);
      let row, col, mod;
      for (let i = 0; i < 18; i++) {
        row = Math.floor(i / 3);
        col = i % 3 + size - 8 - 3;
        mod = (bits >> i & 1) === 1;
        matrix.set(row, col, mod, true);
        matrix.set(col, row, mod, true);
      }
    }
    function setupFormatInfo(matrix, errorCorrectionLevel, maskPattern) {
      const size = matrix.size;
      const bits = FormatInfo.getEncodedBits(errorCorrectionLevel, maskPattern);
      let i, mod;
      for (i = 0; i < 15; i++) {
        mod = (bits >> i & 1) === 1;
        if (i < 6) {
          matrix.set(i, 8, mod, true);
        } else if (i < 8) {
          matrix.set(i + 1, 8, mod, true);
        } else {
          matrix.set(size - 15 + i, 8, mod, true);
        }
        if (i < 8) {
          matrix.set(8, size - i - 1, mod, true);
        } else if (i < 9) {
          matrix.set(8, 15 - i - 1 + 1, mod, true);
        } else {
          matrix.set(8, 15 - i - 1, mod, true);
        }
      }
      matrix.set(size - 8, 8, 1, true);
    }
    function setupData(matrix, data) {
      const size = matrix.size;
      let inc = -1;
      let row = size - 1;
      let bitIndex = 7;
      let byteIndex = 0;
      for (let col = size - 1; col > 0; col -= 2) {
        if (col === 6) col--;
        while (true) {
          for (let c = 0; c < 2; c++) {
            if (!matrix.isReserved(row, col - c)) {
              let dark = false;
              if (byteIndex < data.length) {
                dark = (data[byteIndex] >>> bitIndex & 1) === 1;
              }
              matrix.set(row, col - c, dark);
              bitIndex--;
              if (bitIndex === -1) {
                byteIndex++;
                bitIndex = 7;
              }
            }
          }
          row += inc;
          if (row < 0 || size <= row) {
            row -= inc;
            inc = -inc;
            break;
          }
        }
      }
    }
    function createData(version, errorCorrectionLevel, segments) {
      const buffer = new BitBuffer();
      segments.forEach(function(data) {
        buffer.put(data.mode.bit, 4);
        buffer.put(data.getLength(), Mode.getCharCountIndicator(data.mode, version));
        data.write(buffer);
      });
      const totalCodewords = Utils.getSymbolTotalCodewords(version);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
      const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
      if (buffer.getLengthInBits() + 4 <= dataTotalCodewordsBits) {
        buffer.put(0, 4);
      }
      while (buffer.getLengthInBits() % 8 !== 0) {
        buffer.putBit(0);
      }
      const remainingByte = (dataTotalCodewordsBits - buffer.getLengthInBits()) / 8;
      for (let i = 0; i < remainingByte; i++) {
        buffer.put(i % 2 ? 17 : 236, 8);
      }
      return createCodewords(buffer, version, errorCorrectionLevel);
    }
    function createCodewords(bitBuffer, version, errorCorrectionLevel) {
      const totalCodewords = Utils.getSymbolTotalCodewords(version);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
      const dataTotalCodewords = totalCodewords - ecTotalCodewords;
      const ecTotalBlocks = ECCode.getBlocksCount(version, errorCorrectionLevel);
      const blocksInGroup2 = totalCodewords % ecTotalBlocks;
      const blocksInGroup1 = ecTotalBlocks - blocksInGroup2;
      const totalCodewordsInGroup1 = Math.floor(totalCodewords / ecTotalBlocks);
      const dataCodewordsInGroup1 = Math.floor(dataTotalCodewords / ecTotalBlocks);
      const dataCodewordsInGroup2 = dataCodewordsInGroup1 + 1;
      const ecCount = totalCodewordsInGroup1 - dataCodewordsInGroup1;
      const rs = new ReedSolomonEncoder(ecCount);
      let offset = 0;
      const dcData = new Array(ecTotalBlocks);
      const ecData = new Array(ecTotalBlocks);
      let maxDataSize = 0;
      const buffer = new Uint8Array(bitBuffer.buffer);
      for (let b = 0; b < ecTotalBlocks; b++) {
        const dataSize = b < blocksInGroup1 ? dataCodewordsInGroup1 : dataCodewordsInGroup2;
        dcData[b] = buffer.slice(offset, offset + dataSize);
        ecData[b] = rs.encode(dcData[b]);
        offset += dataSize;
        maxDataSize = Math.max(maxDataSize, dataSize);
      }
      const data = new Uint8Array(totalCodewords);
      let index = 0;
      let i, r;
      for (i = 0; i < maxDataSize; i++) {
        for (r = 0; r < ecTotalBlocks; r++) {
          if (i < dcData[r].length) {
            data[index++] = dcData[r][i];
          }
        }
      }
      for (i = 0; i < ecCount; i++) {
        for (r = 0; r < ecTotalBlocks; r++) {
          data[index++] = ecData[r][i];
        }
      }
      return data;
    }
    function createSymbol(data, version, errorCorrectionLevel, maskPattern) {
      let segments;
      if (Array.isArray(data)) {
        segments = Segments.fromArray(data);
      } else if (typeof data === "string") {
        let estimatedVersion = version;
        if (!estimatedVersion) {
          const rawSegments = Segments.rawSplit(data);
          estimatedVersion = Version.getBestVersionForData(rawSegments, errorCorrectionLevel);
        }
        segments = Segments.fromString(data, estimatedVersion || 40);
      } else {
        throw new Error("Invalid data");
      }
      const bestVersion = Version.getBestVersionForData(segments, errorCorrectionLevel);
      if (!bestVersion) {
        throw new Error("The amount of data is too big to be stored in a QR Code");
      }
      if (!version) {
        version = bestVersion;
      } else if (version < bestVersion) {
        throw new Error(
          "\nThe chosen QR Code version cannot contain this amount of data.\nMinimum version required to store current data is: " + bestVersion + ".\n"
        );
      }
      const dataBits = createData(version, errorCorrectionLevel, segments);
      const moduleCount = Utils.getSymbolSize(version);
      const modules = new BitMatrix(moduleCount);
      setupFinderPattern(modules, version);
      setupTimingPattern(modules);
      setupAlignmentPattern(modules, version);
      setupFormatInfo(modules, errorCorrectionLevel, 0);
      if (version >= 7) {
        setupVersionInfo(modules, version);
      }
      setupData(modules, dataBits);
      if (isNaN(maskPattern)) {
        maskPattern = MaskPattern.getBestMask(
          modules,
          setupFormatInfo.bind(null, modules, errorCorrectionLevel)
        );
      }
      MaskPattern.applyMask(maskPattern, modules);
      setupFormatInfo(modules, errorCorrectionLevel, maskPattern);
      return {
        modules,
        version,
        errorCorrectionLevel,
        maskPattern,
        segments
      };
    }
    exports.create = function create(data, options) {
      if (typeof data === "undefined" || data === "") {
        throw new Error("No input text");
      }
      let errorCorrectionLevel = ECLevel.M;
      let version;
      let mask;
      if (typeof options !== "undefined") {
        errorCorrectionLevel = ECLevel.from(options.errorCorrectionLevel, ECLevel.M);
        version = Version.from(options.version);
        mask = MaskPattern.from(options.maskPattern);
        if (options.toSJISFunc) {
          Utils.setToSJISFunction(options.toSJISFunc);
        }
      }
      return createSymbol(data, version, errorCorrectionLevel, mask);
    };
  }
});

// ../node_modules/@worldcoin/idkit-server/dist/index.js
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __require2 = /* @__PURE__ */ ((x) => typeof __require !== "undefined" ? __require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof __require !== "undefined" ? __require : a)[b]
}) : x)(function(x) {
  if (typeof __require !== "undefined") return __require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
var _32n = /* @__PURE__ */ BigInt(32);
function fromBig(n, le = false) {
  if (le)
    return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
  return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
}
function split(lst, le = false) {
  const len = lst.length;
  let Ah = new Uint32Array(len);
  let Al = new Uint32Array(len);
  for (let i = 0; i < len; i++) {
    const { h, l } = fromBig(lst[i], le);
    [Ah[i], Al[i]] = [h, l];
  }
  return [Ah, Al];
}
var rotlSH = (h, l, s) => h << s | l >>> 32 - s;
var rotlSL = (h, l, s) => l << s | h >>> 32 - s;
var rotlBH = (h, l, s) => l << s - 32 | h >>> 64 - s;
var rotlBL = (h, l, s) => h << s - 32 | l >>> 64 - s;
function isBytes(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
function anumber(n) {
  if (!Number.isSafeInteger(n) || n < 0)
    throw new Error("positive integer expected, got " + n);
}
function abytes(b, ...lengths) {
  if (!isBytes(b))
    throw new Error("Uint8Array expected");
  if (lengths.length > 0 && !lengths.includes(b.length))
    throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
}
function ahash(h) {
  if (typeof h !== "function" || typeof h.create !== "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  anumber(h.outputLen);
  anumber(h.blockLen);
}
function aexists(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished)
    throw new Error("Hash#digest() has already been called");
}
function aoutput(out, instance) {
  abytes(out);
  const min = instance.outputLen;
  if (out.length < min) {
    throw new Error("digestInto() expects output buffer of length at least " + min);
  }
}
function u32(arr) {
  return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
}
function clean(...arrays) {
  for (let i = 0; i < arrays.length; i++) {
    arrays[i].fill(0);
  }
}
function createView(arr) {
  return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
function rotr(word, shift) {
  return word << 32 - shift | word >>> shift;
}
var isLE = /* @__PURE__ */ (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
function byteSwap(word) {
  return word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
}
function byteSwap32(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i] = byteSwap(arr[i]);
  }
  return arr;
}
var swap32IfBE = isLE ? (u) => u : byteSwap32;
var hasHexBuiltin = /* @__PURE__ */ (() => (
  // @ts-ignore
  typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function"
))();
var hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
function bytesToHex(bytes) {
  abytes(bytes);
  if (hasHexBuiltin)
    return bytes.toHex();
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += hexes[bytes[i]];
  }
  return hex;
}
var asciis = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function asciiToBase16(ch) {
  if (ch >= asciis._0 && ch <= asciis._9)
    return ch - asciis._0;
  if (ch >= asciis.A && ch <= asciis.F)
    return ch - (asciis.A - 10);
  if (ch >= asciis.a && ch <= asciis.f)
    return ch - (asciis.a - 10);
  return;
}
function hexToBytes(hex) {
  if (typeof hex !== "string")
    throw new Error("hex string expected, got " + typeof hex);
  if (hasHexBuiltin)
    return Uint8Array.fromHex(hex);
  const hl = hex.length;
  const al = hl / 2;
  if (hl % 2)
    throw new Error("hex string expected, got unpadded hex of length " + hl);
  const array = new Uint8Array(al);
  for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
    const n1 = asciiToBase16(hex.charCodeAt(hi));
    const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
    if (n1 === void 0 || n2 === void 0) {
      const char = hex[hi] + hex[hi + 1];
      throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
    }
    array[ai] = n1 * 16 + n2;
  }
  return array;
}
function utf8ToBytes(str) {
  if (typeof str !== "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(str));
}
function toBytes(data) {
  if (typeof data === "string")
    data = utf8ToBytes(data);
  abytes(data);
  return data;
}
var Hash = class {
};
function createHasher(hashCons) {
  const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
  const tmp = hashCons();
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = () => hashCons();
  return hashC;
}
var _0n = BigInt(0);
var _1n = BigInt(1);
var _2n = BigInt(2);
var _7n = BigInt(7);
var _256n = BigInt(256);
var _0x71n = BigInt(113);
var SHA3_PI = [];
var SHA3_ROTL = [];
var _SHA3_IOTA = [];
for (let round = 0, R = _1n, x = 1, y = 0; round < 24; round++) {
  [x, y] = [y, (2 * x + 3 * y) % 5];
  SHA3_PI.push(2 * (5 * y + x));
  SHA3_ROTL.push((round + 1) * (round + 2) / 2 % 64);
  let t = _0n;
  for (let j = 0; j < 7; j++) {
    R = (R << _1n ^ (R >> _7n) * _0x71n) % _256n;
    if (R & _2n)
      t ^= _1n << (_1n << /* @__PURE__ */ BigInt(j)) - _1n;
  }
  _SHA3_IOTA.push(t);
}
var IOTAS = split(_SHA3_IOTA, true);
var SHA3_IOTA_H = IOTAS[0];
var SHA3_IOTA_L = IOTAS[1];
var rotlH = (h, l, s) => s > 32 ? rotlBH(h, l, s) : rotlSH(h, l, s);
var rotlL = (h, l, s) => s > 32 ? rotlBL(h, l, s) : rotlSL(h, l, s);
function keccakP(s, rounds = 24) {
  const B = new Uint32Array(5 * 2);
  for (let round = 24 - rounds; round < 24; round++) {
    for (let x = 0; x < 10; x++)
      B[x] = s[x] ^ s[x + 10] ^ s[x + 20] ^ s[x + 30] ^ s[x + 40];
    for (let x = 0; x < 10; x += 2) {
      const idx1 = (x + 8) % 10;
      const idx0 = (x + 2) % 10;
      const B0 = B[idx0];
      const B1 = B[idx0 + 1];
      const Th = rotlH(B0, B1, 1) ^ B[idx1];
      const Tl = rotlL(B0, B1, 1) ^ B[idx1 + 1];
      for (let y = 0; y < 50; y += 10) {
        s[x + y] ^= Th;
        s[x + y + 1] ^= Tl;
      }
    }
    let curH = s[2];
    let curL = s[3];
    for (let t = 0; t < 24; t++) {
      const shift = SHA3_ROTL[t];
      const Th = rotlH(curH, curL, shift);
      const Tl = rotlL(curH, curL, shift);
      const PI = SHA3_PI[t];
      curH = s[PI];
      curL = s[PI + 1];
      s[PI] = Th;
      s[PI + 1] = Tl;
    }
    for (let y = 0; y < 50; y += 10) {
      for (let x = 0; x < 10; x++)
        B[x] = s[y + x];
      for (let x = 0; x < 10; x++)
        s[y + x] ^= ~B[(x + 2) % 10] & B[(x + 4) % 10];
    }
    s[0] ^= SHA3_IOTA_H[round];
    s[1] ^= SHA3_IOTA_L[round];
  }
  clean(B);
}
var Keccak = class _Keccak extends Hash {
  // NOTE: we accept arguments in bytes instead of bits here.
  constructor(blockLen, suffix, outputLen, enableXOF = false, rounds = 24) {
    super();
    this.pos = 0;
    this.posOut = 0;
    this.finished = false;
    this.destroyed = false;
    this.enableXOF = false;
    this.blockLen = blockLen;
    this.suffix = suffix;
    this.outputLen = outputLen;
    this.enableXOF = enableXOF;
    this.rounds = rounds;
    anumber(outputLen);
    if (!(0 < blockLen && blockLen < 200))
      throw new Error("only keccak-f1600 function is supported");
    this.state = new Uint8Array(200);
    this.state32 = u32(this.state);
  }
  clone() {
    return this._cloneInto();
  }
  keccak() {
    swap32IfBE(this.state32);
    keccakP(this.state32, this.rounds);
    swap32IfBE(this.state32);
    this.posOut = 0;
    this.pos = 0;
  }
  update(data) {
    aexists(this);
    data = toBytes(data);
    abytes(data);
    const { blockLen, state } = this;
    const len = data.length;
    for (let pos = 0; pos < len; ) {
      const take = Math.min(blockLen - this.pos, len - pos);
      for (let i = 0; i < take; i++)
        state[this.pos++] ^= data[pos++];
      if (this.pos === blockLen)
        this.keccak();
    }
    return this;
  }
  finish() {
    if (this.finished)
      return;
    this.finished = true;
    const { state, suffix, pos, blockLen } = this;
    state[pos] ^= suffix;
    if ((suffix & 128) !== 0 && pos === blockLen - 1)
      this.keccak();
    state[blockLen - 1] ^= 128;
    this.keccak();
  }
  writeInto(out) {
    aexists(this, false);
    abytes(out);
    this.finish();
    const bufferOut = this.state;
    const { blockLen } = this;
    for (let pos = 0, len = out.length; pos < len; ) {
      if (this.posOut >= blockLen)
        this.keccak();
      const take = Math.min(blockLen - this.posOut, len - pos);
      out.set(bufferOut.subarray(this.posOut, this.posOut + take), pos);
      this.posOut += take;
      pos += take;
    }
    return out;
  }
  xofInto(out) {
    if (!this.enableXOF)
      throw new Error("XOF is not possible for this instance");
    return this.writeInto(out);
  }
  xof(bytes) {
    anumber(bytes);
    return this.xofInto(new Uint8Array(bytes));
  }
  digestInto(out) {
    aoutput(out, this);
    if (this.finished)
      throw new Error("digest() was already called");
    this.writeInto(out);
    this.destroy();
    return out;
  }
  digest() {
    return this.digestInto(new Uint8Array(this.outputLen));
  }
  destroy() {
    this.destroyed = true;
    clean(this.state);
  }
  _cloneInto(to) {
    const { blockLen, suffix, outputLen, rounds, enableXOF } = this;
    to || (to = new _Keccak(blockLen, suffix, outputLen, enableXOF, rounds));
    to.state32.set(this.state32);
    to.pos = this.pos;
    to.posOut = this.posOut;
    to.finished = this.finished;
    to.rounds = rounds;
    to.suffix = suffix;
    to.outputLen = outputLen;
    to.enableXOF = enableXOF;
    to.destroyed = this.destroyed;
    return to;
  }
};
var gen = (suffix, blockLen, outputLen) => createHasher(() => new Keccak(blockLen, suffix, outputLen));
var keccak_256 = /* @__PURE__ */ (() => gen(1, 136, 256 / 8))();
var HMAC = class extends Hash {
  constructor(hash, _key) {
    super();
    this.finished = false;
    this.destroyed = false;
    ahash(hash);
    const key = toBytes(_key);
    this.iHash = hash.create();
    if (typeof this.iHash.update !== "function")
      throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen;
    this.outputLen = this.iHash.outputLen;
    const blockLen = this.blockLen;
    const pad = new Uint8Array(blockLen);
    pad.set(key.length > blockLen ? hash.create().update(key).digest() : key);
    for (let i = 0; i < pad.length; i++)
      pad[i] ^= 54;
    this.iHash.update(pad);
    this.oHash = hash.create();
    for (let i = 0; i < pad.length; i++)
      pad[i] ^= 54 ^ 92;
    this.oHash.update(pad);
    clean(pad);
  }
  update(buf) {
    aexists(this);
    this.iHash.update(buf);
    return this;
  }
  digestInto(out) {
    aexists(this);
    abytes(out, this.outputLen);
    this.finished = true;
    this.iHash.digestInto(out);
    this.oHash.update(out);
    this.oHash.digestInto(out);
    this.destroy();
  }
  digest() {
    const out = new Uint8Array(this.oHash.outputLen);
    this.digestInto(out);
    return out;
  }
  _cloneInto(to) {
    to || (to = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
    to = to;
    to.finished = finished;
    to.destroyed = destroyed;
    to.blockLen = blockLen;
    to.outputLen = outputLen;
    to.oHash = oHash._cloneInto(to.oHash);
    to.iHash = iHash._cloneInto(to.iHash);
    return to;
  }
  clone() {
    return this._cloneInto();
  }
  destroy() {
    this.destroyed = true;
    this.oHash.destroy();
    this.iHash.destroy();
  }
};
var hmac = (hash, key, message) => new HMAC(hash, key).update(message).digest();
hmac.create = (hash, key) => new HMAC(hash, key);
function setBigUint64(view, byteOffset, value, isLE2) {
  if (typeof view.setBigUint64 === "function")
    return view.setBigUint64(byteOffset, value, isLE2);
  const _32n2 = BigInt(32);
  const _u32_max = BigInt(4294967295);
  const wh = Number(value >> _32n2 & _u32_max);
  const wl = Number(value & _u32_max);
  const h = isLE2 ? 4 : 0;
  const l = isLE2 ? 0 : 4;
  view.setUint32(byteOffset + h, wh, isLE2);
  view.setUint32(byteOffset + l, wl, isLE2);
}
function Chi(a, b, c) {
  return a & b ^ ~a & c;
}
function Maj(a, b, c) {
  return a & b ^ a & c ^ b & c;
}
var HashMD = class extends Hash {
  constructor(blockLen, outputLen, padOffset, isLE2) {
    super();
    this.finished = false;
    this.length = 0;
    this.pos = 0;
    this.destroyed = false;
    this.blockLen = blockLen;
    this.outputLen = outputLen;
    this.padOffset = padOffset;
    this.isLE = isLE2;
    this.buffer = new Uint8Array(blockLen);
    this.view = createView(this.buffer);
  }
  update(data) {
    aexists(this);
    data = toBytes(data);
    abytes(data);
    const { view, buffer, blockLen } = this;
    const len = data.length;
    for (let pos = 0; pos < len; ) {
      const take = Math.min(blockLen - this.pos, len - pos);
      if (take === blockLen) {
        const dataView = createView(data);
        for (; blockLen <= len - pos; pos += blockLen)
          this.process(dataView, pos);
        continue;
      }
      buffer.set(data.subarray(pos, pos + take), this.pos);
      this.pos += take;
      pos += take;
      if (this.pos === blockLen) {
        this.process(view, 0);
        this.pos = 0;
      }
    }
    this.length += data.length;
    this.roundClean();
    return this;
  }
  digestInto(out) {
    aexists(this);
    aoutput(out, this);
    this.finished = true;
    const { buffer, view, blockLen, isLE: isLE2 } = this;
    let { pos } = this;
    buffer[pos++] = 128;
    clean(this.buffer.subarray(pos));
    if (this.padOffset > blockLen - pos) {
      this.process(view, 0);
      pos = 0;
    }
    for (let i = pos; i < blockLen; i++)
      buffer[i] = 0;
    setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE2);
    this.process(view, 0);
    const oview = createView(out);
    const len = this.outputLen;
    if (len % 4)
      throw new Error("_sha2: outputLen should be aligned to 32bit");
    const outLen = len / 4;
    const state = this.get();
    if (outLen > state.length)
      throw new Error("_sha2: outputLen bigger than state");
    for (let i = 0; i < outLen; i++)
      oview.setUint32(4 * i, state[i], isLE2);
  }
  digest() {
    const { buffer, outputLen } = this;
    this.digestInto(buffer);
    const res = buffer.slice(0, outputLen);
    this.destroy();
    return res;
  }
  _cloneInto(to) {
    to || (to = new this.constructor());
    to.set(...this.get());
    const { blockLen, buffer, length, finished, destroyed, pos } = this;
    to.destroyed = destroyed;
    to.finished = finished;
    to.length = length;
    to.pos = pos;
    if (length % blockLen)
      to.buffer.set(buffer);
    return to;
  }
  clone() {
    return this._cloneInto();
  }
};
var SHA256_IV = /* @__PURE__ */ Uint32Array.from([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
var SHA256_K = /* @__PURE__ */ Uint32Array.from([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]);
var SHA256_W = /* @__PURE__ */ new Uint32Array(64);
var SHA256 = class extends HashMD {
  constructor(outputLen = 32) {
    super(64, outputLen, 8, false);
    this.A = SHA256_IV[0] | 0;
    this.B = SHA256_IV[1] | 0;
    this.C = SHA256_IV[2] | 0;
    this.D = SHA256_IV[3] | 0;
    this.E = SHA256_IV[4] | 0;
    this.F = SHA256_IV[5] | 0;
    this.G = SHA256_IV[6] | 0;
    this.H = SHA256_IV[7] | 0;
  }
  get() {
    const { A, B, C: C2, D, E, F, G: G2, H } = this;
    return [A, B, C2, D, E, F, G2, H];
  }
  // prettier-ignore
  set(A, B, C2, D, E, F, G2, H) {
    this.A = A | 0;
    this.B = B | 0;
    this.C = C2 | 0;
    this.D = D | 0;
    this.E = E | 0;
    this.F = F | 0;
    this.G = G2 | 0;
    this.H = H | 0;
  }
  process(view, offset) {
    for (let i = 0; i < 16; i++, offset += 4)
      SHA256_W[i] = view.getUint32(offset, false);
    for (let i = 16; i < 64; i++) {
      const W15 = SHA256_W[i - 15];
      const W2 = SHA256_W[i - 2];
      const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
      const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
      SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
    }
    let { A, B, C: C2, D, E, F, G: G2, H } = this;
    for (let i = 0; i < 64; i++) {
      const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
      const T1 = H + sigma1 + Chi(E, F, G2) + SHA256_K[i] + SHA256_W[i] | 0;
      const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
      const T2 = sigma0 + Maj(A, B, C2) | 0;
      H = G2;
      G2 = F;
      F = E;
      E = D + T1 | 0;
      D = C2;
      C2 = B;
      B = A;
      A = T1 + T2 | 0;
    }
    A = A + this.A | 0;
    B = B + this.B | 0;
    C2 = C2 + this.C | 0;
    D = D + this.D | 0;
    E = E + this.E | 0;
    F = F + this.F | 0;
    G2 = G2 + this.G | 0;
    H = H + this.H | 0;
    this.set(A, B, C2, D, E, F, G2, H);
  }
  roundClean() {
    clean(SHA256_W);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0);
    clean(this.buffer);
  }
};
var sha256 = /* @__PURE__ */ createHasher(() => new SHA256());
var secp256k1_CURVE = {
  p: 0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2fn,
  n: 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n,
  b: 7n,
  Gx: 0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798n,
  Gy: 0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8n
};
var { p: P, n: N, Gx, Gy, b: _b } = secp256k1_CURVE;
var L = 32;
var L2 = 64;
var err = (m = "") => {
  throw new Error(m);
};
var isBig = (n) => typeof n === "bigint";
var isStr = (s) => typeof s === "string";
var isBytes2 = (a) => a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
var abytes2 = (a, l) => !isBytes2(a) || typeof l === "number" && l > 0 && a.length !== l ? err("Uint8Array expected") : a;
var u8n = (len) => new Uint8Array(len);
var u8fr = (buf) => Uint8Array.from(buf);
var padh = (n, pad) => n.toString(16).padStart(pad, "0");
var bytesToHex2 = (b) => Array.from(abytes2(b)).map((e) => padh(e, 2)).join("");
var C = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
var _ch = (ch) => {
  if (ch >= C._0 && ch <= C._9)
    return ch - C._0;
  if (ch >= C.A && ch <= C.F)
    return ch - (C.A - 10);
  if (ch >= C.a && ch <= C.f)
    return ch - (C.a - 10);
  return;
};
var hexToBytes2 = (hex) => {
  const e = "hex invalid";
  if (!isStr(hex))
    return err(e);
  const hl = hex.length;
  const al = hl / 2;
  if (hl % 2)
    return err(e);
  const array = u8n(al);
  for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
    const n1 = _ch(hex.charCodeAt(hi));
    const n2 = _ch(hex.charCodeAt(hi + 1));
    if (n1 === void 0 || n2 === void 0)
      return err(e);
    array[ai] = n1 * 16 + n2;
  }
  return array;
};
var toU8 = (a, len) => abytes2(isStr(a) ? hexToBytes2(a) : u8fr(abytes2(a)), len);
var cr = () => globalThis?.crypto;
var subtle = () => cr()?.subtle ?? err("crypto.subtle must be defined");
var concatBytes = (...arrs) => {
  const r = u8n(arrs.reduce((sum, a) => sum + abytes2(a).length, 0));
  let pad = 0;
  arrs.forEach((a) => {
    r.set(a, pad);
    pad += a.length;
  });
  return r;
};
var randomBytes = (len = L) => {
  const c = cr();
  return c.getRandomValues(u8n(len));
};
var big = BigInt;
var arange = (n, min, max, msg = "bad number: out of range") => isBig(n) && min <= n && n < max ? n : err(msg);
var M = (a, b = P) => {
  const r = a % b;
  return r >= 0n ? r : b + r;
};
var modN = (a) => M(a, N);
var invert = (num, md) => {
  if (num === 0n || md <= 0n)
    err("no inverse n=" + num + " mod=" + md);
  let a = M(num, md), b = md, x = 0n, u = 1n;
  while (a !== 0n) {
    const q = b / a, r = b % a;
    const m = x - u * q;
    b = a, a = r, x = u, u = m;
  }
  return b === 1n ? M(x, md) : err("no inverse");
};
var callHash = (name) => {
  const fn = etc[name];
  if (typeof fn !== "function")
    err("hashes." + name + " not set");
  return fn;
};
var apoint = (p) => p instanceof Point ? p : err("Point expected");
var koblitz = (x) => M(M(x * x) * x + _b);
var afield0 = (n) => arange(n, 0n, P);
var afield = (n) => arange(n, 1n, P);
var agroup = (n) => arange(n, 1n, N);
var isEven = (y) => (y & 1n) === 0n;
var u8of = (n) => Uint8Array.of(n);
var getPrefix = (y) => u8of(isEven(y) ? 2 : 3);
var lift_x = (x) => {
  const c = koblitz(afield(x));
  let r = 1n;
  for (let num = c, e = (P + 1n) / 4n; e > 0n; e >>= 1n) {
    if (e & 1n)
      r = r * num % P;
    num = num * num % P;
  }
  return M(r * r) === c ? r : err("sqrt invalid");
};
var _Point = class _Point2 {
  constructor(px, py, pz) {
    __publicField(this, "px");
    __publicField(this, "py");
    __publicField(this, "pz");
    this.px = afield0(px);
    this.py = afield(py);
    this.pz = afield0(pz);
    Object.freeze(this);
  }
  /** Convert Uint8Array or hex string to Point. */
  static fromBytes(bytes) {
    abytes2(bytes);
    let p = void 0;
    const head = bytes[0];
    const tail = bytes.subarray(1);
    const x = sliceBytesNumBE(tail, 0, L);
    const len = bytes.length;
    if (len === L + 1 && [2, 3].includes(head)) {
      let y = lift_x(x);
      const evenY = isEven(y);
      const evenH = isEven(big(head));
      if (evenH !== evenY)
        y = M(-y);
      p = new _Point2(x, y, 1n);
    }
    if (len === L2 + 1 && head === 4)
      p = new _Point2(x, sliceBytesNumBE(tail, L, L2), 1n);
    return p ? p.assertValidity() : err("bad point: not on curve");
  }
  /** Equality check: compare points P&Q. */
  equals(other) {
    const { px: X1, py: Y1, pz: Z1 } = this;
    const { px: X2, py: Y2, pz: Z2 } = apoint(other);
    const X1Z2 = M(X1 * Z2);
    const X2Z1 = M(X2 * Z1);
    const Y1Z2 = M(Y1 * Z2);
    const Y2Z1 = M(Y2 * Z1);
    return X1Z2 === X2Z1 && Y1Z2 === Y2Z1;
  }
  is0() {
    return this.equals(I);
  }
  /** Flip point over y coordinate. */
  negate() {
    return new _Point2(this.px, M(-this.py), this.pz);
  }
  /** Point doubling: P+P, complete formula. */
  double() {
    return this.add(this);
  }
  /**
   * Point addition: P+Q, complete, exception-free formula
   * (Renes-Costello-Batina, algo 1 of [2015/1060](https://eprint.iacr.org/2015/1060)).
   * Cost: `12M + 0S + 3*a + 3*b3 + 23add`.
   */
  // prettier-ignore
  add(other) {
    const { px: X1, py: Y1, pz: Z1 } = this;
    const { px: X2, py: Y2, pz: Z2 } = apoint(other);
    const a = 0n;
    const b = _b;
    let X3 = 0n, Y3 = 0n, Z3 = 0n;
    const b3 = M(b * 3n);
    let t0 = M(X1 * X2), t1 = M(Y1 * Y2), t2 = M(Z1 * Z2), t3 = M(X1 + Y1);
    let t4 = M(X2 + Y2);
    t3 = M(t3 * t4);
    t4 = M(t0 + t1);
    t3 = M(t3 - t4);
    t4 = M(X1 + Z1);
    let t5 = M(X2 + Z2);
    t4 = M(t4 * t5);
    t5 = M(t0 + t2);
    t4 = M(t4 - t5);
    t5 = M(Y1 + Z1);
    X3 = M(Y2 + Z2);
    t5 = M(t5 * X3);
    X3 = M(t1 + t2);
    t5 = M(t5 - X3);
    Z3 = M(a * t4);
    X3 = M(b3 * t2);
    Z3 = M(X3 + Z3);
    X3 = M(t1 - Z3);
    Z3 = M(t1 + Z3);
    Y3 = M(X3 * Z3);
    t1 = M(t0 + t0);
    t1 = M(t1 + t0);
    t2 = M(a * t2);
    t4 = M(b3 * t4);
    t1 = M(t1 + t2);
    t2 = M(t0 - t2);
    t2 = M(a * t2);
    t4 = M(t4 + t2);
    t0 = M(t1 * t4);
    Y3 = M(Y3 + t0);
    t0 = M(t5 * t4);
    X3 = M(t3 * X3);
    X3 = M(X3 - t0);
    t0 = M(t3 * t1);
    Z3 = M(t5 * Z3);
    Z3 = M(Z3 + t0);
    return new _Point2(X3, Y3, Z3);
  }
  /**
   * Point-by-scalar multiplication. Scalar must be in range 1 <= n < CURVE.n.
   * Uses {@link wNAF} for base point.
   * Uses fake point to mitigate side-channel leakage.
   * @param n scalar by which point is multiplied
   * @param safe safe mode guards against timing attacks; unsafe mode is faster
   */
  multiply(n, safe = true) {
    if (!safe && n === 0n)
      return I;
    agroup(n);
    if (n === 1n)
      return this;
    if (this.equals(G))
      return wNAF(n).p;
    let p = I;
    let f = G;
    for (let d = this; n > 0n; d = d.double(), n >>= 1n) {
      if (n & 1n)
        p = p.add(d);
      else if (safe)
        f = f.add(d);
    }
    return p;
  }
  /** Convert point to 2d xy affine point. (X, Y, Z) ∋ (x=X/Z, y=Y/Z) */
  toAffine() {
    const { px: x, py: y, pz: z } = this;
    if (this.equals(I))
      return { x: 0n, y: 0n };
    if (z === 1n)
      return { x, y };
    const iz = invert(z, P);
    if (M(z * iz) !== 1n)
      err("inverse invalid");
    return { x: M(x * iz), y: M(y * iz) };
  }
  /** Checks if the point is valid and on-curve. */
  assertValidity() {
    const { x, y } = this.toAffine();
    afield(x);
    afield(y);
    return M(y * y) === koblitz(x) ? this : err("bad point: not on curve");
  }
  /** Converts point to 33/65-byte Uint8Array. */
  toBytes(isCompressed = true) {
    const { x, y } = this.assertValidity().toAffine();
    const x32b = numTo32b(x);
    if (isCompressed)
      return concatBytes(getPrefix(y), x32b);
    return concatBytes(u8of(4), x32b, numTo32b(y));
  }
  /** Create 3d xyz point from 2d xy. (0, 0) => (0, 1, 0), not (0, 0, 1) */
  static fromAffine(ap) {
    const { x, y } = ap;
    return x === 0n && y === 0n ? I : new _Point2(x, y, 1n);
  }
  toHex(isCompressed) {
    return bytesToHex2(this.toBytes(isCompressed));
  }
  static fromPrivateKey(k) {
    return G.multiply(toPrivScalar(k));
  }
  static fromHex(hex) {
    return _Point2.fromBytes(toU8(hex));
  }
  get x() {
    return this.toAffine().x;
  }
  get y() {
    return this.toAffine().y;
  }
  toRawBytes(isCompressed) {
    return this.toBytes(isCompressed);
  }
};
__publicField(_Point, "BASE");
__publicField(_Point, "ZERO");
var Point = _Point;
var G = new Point(Gx, Gy, 1n);
var I = new Point(0n, 1n, 0n);
Point.BASE = G;
Point.ZERO = I;
var doubleScalarMulUns = (R, u1, u2) => {
  return G.multiply(u1, false).add(R.multiply(u2, false)).assertValidity();
};
var bytesToNumBE = (b) => big("0x" + (bytesToHex2(b) || "0"));
var sliceBytesNumBE = (b, from, to) => bytesToNumBE(b.subarray(from, to));
var B256 = 2n ** 256n;
var numTo32b = (num) => hexToBytes2(padh(arange(num, 0n, B256), L2));
var toPrivScalar = (pr) => {
  const num = isBig(pr) ? pr : bytesToNumBE(toU8(pr, L));
  return arange(num, 1n, N, "private key invalid 3");
};
var highS = (n) => n > N >> 1n;
var Signature = class _Signature {
  constructor(r, s, recovery) {
    __publicField(this, "r");
    __publicField(this, "s");
    __publicField(this, "recovery");
    this.r = agroup(r);
    this.s = agroup(s);
    if (recovery != null)
      this.recovery = recovery;
    Object.freeze(this);
  }
  /** Create signature from 64b compact (r || s) representation. */
  static fromBytes(b) {
    abytes2(b, L2);
    const r = sliceBytesNumBE(b, 0, L);
    const s = sliceBytesNumBE(b, L, L2);
    return new _Signature(r, s);
  }
  toBytes() {
    const { r, s } = this;
    return concatBytes(numTo32b(r), numTo32b(s));
  }
  /** Copy signature, with newly added recovery bit. */
  addRecoveryBit(bit) {
    return new _Signature(this.r, this.s, bit);
  }
  hasHighS() {
    return highS(this.s);
  }
  toCompactRawBytes() {
    return this.toBytes();
  }
  toCompactHex() {
    return bytesToHex2(this.toBytes());
  }
  recoverPublicKey(msg) {
    return recoverPublicKey(this, msg);
  }
  static fromCompact(hex) {
    return _Signature.fromBytes(toU8(hex, L2));
  }
  assertValidity() {
    return this;
  }
  normalizeS() {
    const { r, s, recovery } = this;
    return highS(s) ? new _Signature(r, modN(-s), recovery) : this;
  }
};
var bits2int = (bytes) => {
  const delta = bytes.length * 8 - 256;
  if (delta > 1024)
    err("msg invalid");
  const num = bytesToNumBE(bytes);
  return delta > 0 ? num >> big(delta) : num;
};
var bits2int_modN = (bytes) => modN(bits2int(abytes2(bytes)));
var signOpts = { lowS: true };
var prepSig = (msgh, priv, opts = signOpts) => {
  if (["der", "recovered", "canonical"].some((k) => k in opts))
    err("option not supported");
  let { lowS, extraEntropy } = opts;
  if (lowS == null)
    lowS = true;
  const i2o = numTo32b;
  const h1i = bits2int_modN(toU8(msgh));
  const h1o = i2o(h1i);
  const d = toPrivScalar(priv);
  const seed = [i2o(d), h1o];
  if (extraEntropy)
    seed.push(extraEntropy === true ? randomBytes(L) : toU8(extraEntropy));
  const m = h1i;
  const k2sig = (kBytes) => {
    const k = bits2int(kBytes);
    if (!(1n <= k && k < N))
      return;
    const q = G.multiply(k).toAffine();
    const r = modN(q.x);
    if (r === 0n)
      return;
    const ik = invert(k, N);
    const s = modN(ik * modN(m + modN(d * r)));
    if (s === 0n)
      return;
    let normS = s;
    let recovery = (q.x === r ? 0 : 2) | Number(q.y & 1n);
    if (lowS && highS(s)) {
      normS = modN(-s);
      recovery ^= 1;
    }
    return new Signature(r, normS, recovery);
  };
  return { seed: concatBytes(...seed), k2sig };
};
var hmacDrbg = (asynchronous) => {
  let v = u8n(L);
  let k = u8n(L);
  let i = 0;
  const NULL = u8n(0);
  const reset = () => {
    v.fill(1);
    k.fill(0);
    i = 0;
  };
  const max = 1e3;
  const _e = "drbg: tried 1000 values";
  {
    const h = (...b) => callHash("hmacSha256Sync")(k, v, ...b);
    const reseed = (seed = NULL) => {
      k = h(u8of(0), seed);
      v = h();
      if (seed.length === 0)
        return;
      k = h(u8of(1), seed);
      v = h();
    };
    const gen2 = () => {
      if (i++ >= max)
        err(_e);
      v = h();
      return v;
    };
    return (seed, pred) => {
      reset();
      reseed(seed);
      let res = void 0;
      while (!(res = pred(gen2())))
        reseed();
      reset();
      return res;
    };
  }
};
var sign = (msgh, priv, opts = signOpts) => {
  const { seed, k2sig } = prepSig(msgh, priv, opts);
  const sig = hmacDrbg()(seed, k2sig);
  return sig;
};
var recoverPublicKey = (sig, msgh) => {
  const { r, s, recovery } = sig;
  if (![0, 1, 2, 3].includes(recovery))
    err("recovery id invalid");
  const h = bits2int_modN(toU8(msgh, L));
  const radj = recovery === 2 || recovery === 3 ? r + N : r;
  afield(radj);
  const head = getPrefix(big(recovery));
  const Rb = concatBytes(head, numTo32b(radj));
  const R = Point.fromBytes(Rb);
  const ir = invert(radj, N);
  const u1 = modN(-h * ir);
  const u2 = modN(s * ir);
  return doubleScalarMulUns(R, u1, u2);
};
var hashToPrivateKey = (hash) => {
  hash = toU8(hash);
  if (hash.length < L + 8 || hash.length > 1024)
    err("expected 40-1024b");
  const num = M(bytesToNumBE(hash), N - 1n);
  return numTo32b(num + 1n);
};
var _sha = "SHA-256";
var etc = {
  hexToBytes: hexToBytes2,
  bytesToHex: bytesToHex2,
  concatBytes,
  bytesToNumberBE: bytesToNumBE,
  numberToBytesBE: numTo32b,
  mod: M,
  invert,
  // math utilities
  hmacSha256Async: async (key, ...msgs) => {
    const s = subtle();
    const name = "HMAC";
    const k = await s.importKey("raw", key, { name, hash: { name: _sha } }, false, ["sign"]);
    return u8n(await s.sign(name, k, concatBytes(...msgs)));
  },
  hmacSha256Sync: void 0,
  // For TypeScript. Actual logic is below
  hashToPrivateKey,
  randomBytes
};
var W = 8;
var scalarBits = 256;
var pwindows = Math.ceil(scalarBits / W) + 1;
var pwindowSize = 2 ** (W - 1);
var precompute = () => {
  const points = [];
  let p = G;
  let b = p;
  for (let w = 0; w < pwindows; w++) {
    b = p;
    points.push(b);
    for (let i = 1; i < pwindowSize; i++) {
      b = b.add(p);
      points.push(b);
    }
    p = b.double();
  }
  return points;
};
var Gpows = void 0;
var ctneg = (cnd, p) => {
  const n = p.negate();
  return cnd ? n : p;
};
var wNAF = (n) => {
  const comp = Gpows || (Gpows = precompute());
  let p = I;
  let f = G;
  const pow_2_w = 2 ** W;
  const maxNum = pow_2_w;
  const mask = big(pow_2_w - 1);
  const shiftBy = big(W);
  for (let w = 0; w < pwindows; w++) {
    let wbits = Number(n & mask);
    n >>= shiftBy;
    if (wbits > pwindowSize) {
      wbits -= maxNum;
      n += 1n;
    }
    const off = w * pwindowSize;
    const offF = off;
    const offP = off + Math.abs(wbits) - 1;
    const isEven2 = w % 2 !== 0;
    const isNeg = wbits < 0;
    if (wbits === 0) {
      f = f.add(ctneg(isEven2, comp[offF]));
    } else {
      p = p.add(ctneg(isNeg, comp[offP]));
    }
  }
  return { p, f };
};
var isServerEnvironment = () => {
  if (typeof process !== "undefined" && process.versions?.node) {
    return true;
  }
  if (typeof globalThis.Deno !== "undefined") {
    return true;
  }
  if (typeof globalThis.Bun !== "undefined") {
    return true;
  }
  return false;
};
if (typeof globalThis.crypto === "undefined") {
  globalThis.crypto = __require2("crypto").webcrypto;
}
etc.hmacSha256Sync = (key, ...msgs) => hmac(sha256, key, etc.concatBytes(...msgs));
var DEFAULT_TTL_SEC = 300;
var RP_SIGNATURE_MSG_VERSION = 1;
var ETHEREUM_MESSAGE_PREFIX = "Ethereum Signed Message:\n";
var textEncoder = new TextEncoder();
function hashToField(input) {
  const hash = BigInt("0x" + bytesToHex(keccak_256(input))) >> 8n;
  return hexToBytes(hash.toString(16).padStart(64, "0"));
}
function computeRpSignatureMessage(nonceBytes, createdAt, expiresAt, action) {
  const actionBytes = action === void 0 ? void 0 : hashToField(textEncoder.encode(action));
  const message = new Uint8Array(49 + (actionBytes?.length ?? 0));
  message[0] = RP_SIGNATURE_MSG_VERSION;
  message.set(nonceBytes, 1);
  const view = new DataView(message.buffer);
  view.setBigUint64(33, BigInt(createdAt), false);
  view.setBigUint64(41, BigInt(expiresAt), false);
  if (actionBytes) {
    message.set(actionBytes, 49);
  }
  return message;
}
function hashEthereumMessage(message) {
  const prefix = textEncoder.encode(
    `${ETHEREUM_MESSAGE_PREFIX}${message.length}`
  );
  return keccak_256(etc.concatBytes(prefix, message));
}
function signRequest(params) {
  if (!isServerEnvironment()) {
    throw new Error(
      "signRequest can only be used in Node.js environments. This function requires access to signing keys and should never be called from browser/client-side code."
    );
  }
  if (typeof params !== "object" || params === null) {
    throw new Error(
      "signRequest expects an options object: signRequest({ signingKeyHex, action?, ttl? })"
    );
  }
  const { action, signingKeyHex, ttl = DEFAULT_TTL_SEC } = params;
  if (typeof signingKeyHex !== "string") {
    throw new Error(
      "Invalid signing key: expected signingKeyHex to be a string"
    );
  }
  if (action !== void 0 && typeof action !== "string") {
    throw new Error("Invalid action: expected action to be a string");
  }
  const keyHex = signingKeyHex.startsWith("0x") ? signingKeyHex.slice(2) : signingKeyHex;
  if (!/^[0-9a-fA-F]+$/.test(keyHex)) {
    throw new Error("Invalid signing key: contains non-hex characters");
  }
  if (keyHex.length !== 64) {
    throw new Error(
      `Invalid signing key: expected 32 bytes (64 hex chars), got ${keyHex.length / 2} bytes`
    );
  }
  const privKey = etc.hexToBytes(keyHex);
  const randomBytes2 = crypto.getRandomValues(new Uint8Array(32));
  const nonceBytes = hashToField(randomBytes2);
  const createdAt = Math.floor(Date.now() / 1e3);
  const expiresAt = createdAt + ttl;
  const message = computeRpSignatureMessage(
    nonceBytes,
    createdAt,
    expiresAt,
    action
  );
  const msgHash = hashEthereumMessage(message);
  const recSig = sign(msgHash, privKey);
  const compact = recSig.toCompactRawBytes();
  const sig65 = new Uint8Array(65);
  sig65.set(compact, 0);
  sig65[64] = recSig.recovery + 27;
  return {
    sig: "0x" + bytesToHex(sig65),
    nonce: "0x" + bytesToHex(nonceBytes),
    createdAt,
    expiresAt
  };
}

// ../node_modules/@worldcoin/idkit-core/dist/index.js
var __defProp2 = Object.defineProperty;
var __export = (target, all2) => {
  for (var name in all2)
    __defProp2(target, name, { get: all2[name], enumerable: true });
};
var IDKitErrorCodes = /* @__PURE__ */ ((IDKitErrorCodes2) => {
  IDKitErrorCodes2["UserRejected"] = "user_rejected";
  IDKitErrorCodes2["VerificationRejected"] = "verification_rejected";
  IDKitErrorCodes2["CredentialUnavailable"] = "credential_unavailable";
  IDKitErrorCodes2["MalformedRequest"] = "malformed_request";
  IDKitErrorCodes2["InvalidNetwork"] = "invalid_network";
  IDKitErrorCodes2["InclusionProofPending"] = "inclusion_proof_pending";
  IDKitErrorCodes2["InclusionProofFailed"] = "inclusion_proof_failed";
  IDKitErrorCodes2["UnexpectedResponse"] = "unexpected_response";
  IDKitErrorCodes2["ConnectionFailed"] = "connection_failed";
  IDKitErrorCodes2["MaxVerificationsReached"] = "max_verifications_reached";
  IDKitErrorCodes2["FailedByHostApp"] = "failed_by_host_app";
  IDKitErrorCodes2["InvalidRpSignature"] = "invalid_rp_signature";
  IDKitErrorCodes2["NullifierReplayed"] = "nullifier_replayed";
  IDKitErrorCodes2["DuplicateNonce"] = "duplicate_nonce";
  IDKitErrorCodes2["UnknownRp"] = "unknown_rp";
  IDKitErrorCodes2["InactiveRp"] = "inactive_rp";
  IDKitErrorCodes2["TimestampTooOld"] = "timestamp_too_old";
  IDKitErrorCodes2["TimestampTooFarInFuture"] = "timestamp_too_far_in_future";
  IDKitErrorCodes2["InvalidTimestamp"] = "invalid_timestamp";
  IDKitErrorCodes2["RpSignatureExpired"] = "rp_signature_expired";
  IDKitErrorCodes2["GenericError"] = "generic_error";
  IDKitErrorCodes2["InvalidRpIdFormat"] = "invalid_rp_id_format";
  IDKitErrorCodes2["Timeout"] = "timeout";
  IDKitErrorCodes2["Cancelled"] = "cancelled";
  return IDKitErrorCodes2;
})(IDKitErrorCodes || {});
var idkit_wasm_exports = {};
__export(idkit_wasm_exports, {
  BridgeEncryption: () => BridgeEncryption,
  CredentialRequestWasm: () => CredentialRequestWasm,
  IDKitBuilder: () => IDKitBuilder,
  IDKitProof: () => IDKitProof,
  IDKitRequest: () => IDKitRequest,
  RpContextWasm: () => RpContextWasm,
  RpSignature: () => RpSignature,
  base64Decode: () => base64Decode,
  base64Encode: () => base64Encode,
  computeRpSignatureMessage: () => computeRpSignatureMessage2,
  createSession: () => createSession,
  default: () => __wbg_init,
  hashSignal: () => hashSignal,
  initSync: () => initSync,
  init_wasm: () => init_wasm,
  proveSession: () => proveSession,
  request: () => request,
  signRequest: () => signRequest2
});
var BridgeEncryption = class {
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    BridgeEncryptionFinalization.unregister(this);
    return ptr;
  }
  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_bridgeencryption_free(ptr, 0);
  }
  /**
   * Decrypts a base64-encoded ciphertext using AES-256-GCM
   *
   * # Errors
   *
   * Returns an error if decryption fails or the output is not valid UTF-8
   * @param {string} ciphertext_base64
   * @returns {string}
   */
  decrypt(ciphertext_base64) {
    let deferred3_0;
    let deferred3_1;
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(ciphertext_base64, wasm.__wbindgen_export, wasm.__wbindgen_export2);
      const len0 = WASM_VECTOR_LEN;
      wasm.bridgeencryption_decrypt(retptr, this.__wbg_ptr, ptr0, len0);
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
      var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
      var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
      var ptr2 = r0;
      var len2 = r1;
      if (r3) {
        ptr2 = 0;
        len2 = 0;
        throw takeObject(r2);
      }
      deferred3_0 = ptr2;
      deferred3_1 = len2;
      return getStringFromWasm0(ptr2, len2);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_export4(deferred3_0, deferred3_1, 1);
    }
  }
  /**
   * Encrypts a plaintext string using AES-256-GCM and returns base64
   *
   * # Errors
   *
   * Returns an error if encryption fails
   * @param {string} plaintext
   * @returns {string}
   */
  encrypt(plaintext) {
    let deferred3_0;
    let deferred3_1;
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(plaintext, wasm.__wbindgen_export, wasm.__wbindgen_export2);
      const len0 = WASM_VECTOR_LEN;
      wasm.bridgeencryption_encrypt(retptr, this.__wbg_ptr, ptr0, len0);
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
      var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
      var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
      var ptr2 = r0;
      var len2 = r1;
      if (r3) {
        ptr2 = 0;
        len2 = 0;
        throw takeObject(r2);
      }
      deferred3_0 = ptr2;
      deferred3_1 = len2;
      return getStringFromWasm0(ptr2, len2);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_export4(deferred3_0, deferred3_1, 1);
    }
  }
  /**
   * Returns the key as a base64-encoded string
   * @returns {string}
   */
  keyBase64() {
    let deferred1_0;
    let deferred1_1;
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.bridgeencryption_keyBase64(retptr, this.__wbg_ptr);
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
      deferred1_0 = r0;
      deferred1_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_export4(deferred1_0, deferred1_1, 1);
    }
  }
  /**
   * Creates a new `BridgeEncryption` instance with randomly generated key and nonce
   *
   * # Errors
   *
   * Returns an error if key generation fails
   */
  constructor() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.bridgeencryption_new(retptr);
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
      var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
      if (r2) {
        throw takeObject(r1);
      }
      this.__wbg_ptr = r0 >>> 0;
      BridgeEncryptionFinalization.register(this, this.__wbg_ptr, this);
      return this;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Returns the nonce as a base64-encoded string
   * @returns {string}
   */
  nonceBase64() {
    let deferred1_0;
    let deferred1_1;
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.bridgeencryption_nonceBase64(retptr, this.__wbg_ptr);
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
      deferred1_0 = r0;
      deferred1_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_export4(deferred1_0, deferred1_1, 1);
    }
  }
};
if (Symbol.dispose) BridgeEncryption.prototype[Symbol.dispose] = BridgeEncryption.prototype.free;
var CredentialRequestWasm = class _CredentialRequestWasm {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(_CredentialRequestWasm.prototype);
    obj.__wbg_ptr = ptr;
    CredentialRequestWasmFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    CredentialRequestWasmFinalization.unregister(this);
    return ptr;
  }
  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_credentialrequestwasm_free(ptr, 0);
  }
  /**
   * Gets the credential type
   * @returns {any}
   */
  credentialType() {
    const ret = wasm.credentialrequestwasm_credentialType(this.__wbg_ptr);
    return takeObject(ret);
  }
  /**
   * Gets the signal bytes used by protocol proof requests
   * @returns {Uint8Array | undefined}
   */
  getSignalBytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.credentialrequestwasm_getSignalBytes(retptr, this.__wbg_ptr);
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
      let v1;
      if (r0 !== 0) {
        v1 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export4(r0, r1 * 1, 1);
      }
      return v1;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Creates a new request item
   *
   * # Arguments
   * * `credential_type` - The type of credential to request (e.g., `proof_of_human`, `face`)
   * * `signal` - Optional signal string
   *
   * # Errors
   *
   * Returns an error if the credential type is invalid
   * @param {any} credential_type
   * @param {string | null} [signal]
   */
  constructor(credential_type, signal) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      var ptr0 = isLikeNone(signal) ? 0 : passStringToWasm0(signal, wasm.__wbindgen_export, wasm.__wbindgen_export2);
      var len0 = WASM_VECTOR_LEN;
      wasm.credentialrequestwasm_new(retptr, addHeapObject(credential_type), ptr0, len0);
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
      var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
      if (r2) {
        throw takeObject(r1);
      }
      this.__wbg_ptr = r0 >>> 0;
      CredentialRequestWasmFinalization.register(this, this.__wbg_ptr, this);
      return this;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Converts the request item to JSON
   *
   * # Errors
   *
   * Returns an error if serialization fails
   * @returns {any}
   */
  toJSON() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.credentialrequestwasm_toJSON(retptr, this.__wbg_ptr);
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
      var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Creates a new request item with raw bytes for the signal
   *
   * # Errors
   *
   * Returns an error if the credential type is invalid
   * @param {any} credential_type
   * @param {Uint8Array} signal_bytes
   * @returns {CredentialRequestWasm}
   */
  static withBytes(credential_type, signal_bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(signal_bytes, wasm.__wbindgen_export);
      const len0 = WASM_VECTOR_LEN;
      wasm.credentialrequestwasm_withBytes(retptr, addHeapObject(credential_type), ptr0, len0);
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
      var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
      if (r2) {
        throw takeObject(r1);
      }
      return _CredentialRequestWasm.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Creates a new request item with expiration minimum timestamp
   *
   * # Errors
   *
   * Returns an error if the credential type is invalid
   * @param {any} credential_type
   * @param {string | null | undefined} signal
   * @param {bigint} expires_at_min
   * @returns {CredentialRequestWasm}
   */
  static withExpiresAtMin(credential_type, signal, expires_at_min) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      var ptr0 = isLikeNone(signal) ? 0 : passStringToWasm0(signal, wasm.__wbindgen_export, wasm.__wbindgen_export2);
      var len0 = WASM_VECTOR_LEN;
      wasm.credentialrequestwasm_withExpiresAtMin(retptr, addHeapObject(credential_type), ptr0, len0, expires_at_min);
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
      var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
      if (r2) {
        throw takeObject(r1);
      }
      return _CredentialRequestWasm.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Creates a new request item with genesis minimum timestamp
   *
   * # Errors
   *
   * Returns an error if the credential type is invalid
   * @param {any} credential_type
   * @param {string | null | undefined} signal
   * @param {bigint} genesis_min
   * @returns {CredentialRequestWasm}
   */
  static withGenesisMin(credential_type, signal, genesis_min) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      var ptr0 = isLikeNone(signal) ? 0 : passStringToWasm0(signal, wasm.__wbindgen_export, wasm.__wbindgen_export2);
      var len0 = WASM_VECTOR_LEN;
      wasm.credentialrequestwasm_withGenesisMin(retptr, addHeapObject(credential_type), ptr0, len0, genesis_min);
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
      var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
      if (r2) {
        throw takeObject(r1);
      }
      return _CredentialRequestWasm.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
};
if (Symbol.dispose) CredentialRequestWasm.prototype[Symbol.dispose] = CredentialRequestWasm.prototype.free;
var IDKitBuilder = class _IDKitBuilder {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(_IDKitBuilder.prototype);
    obj.__wbg_ptr = ptr;
    IDKitBuilderFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    IDKitBuilderFinalization.unregister(this);
    return ptr;
  }
  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_idkitbuilder_free(ptr, 0);
  }
  /**
   * Creates a `BridgeConnection` with the given constraints
   * @param {any} constraints_json
   * @returns {Promise<any>}
   */
  constraints(constraints_json) {
    const ptr = this.__destroy_into_raw();
    const ret = wasm.idkitbuilder_constraints(ptr, addHeapObject(constraints_json));
    return takeObject(ret);
  }
  /**
   * Creates a new builder for creating a new session
   * @param {string} app_id
   * @param {RpContextWasm} rp_context
   * @param {string | null} [action_description]
   * @param {string | null} [bridge_url]
   * @param {string | null} [override_connect_base_url]
   * @param {string | null} [return_to]
   * @param {string | null} [environment]
   * @returns {IDKitBuilder}
   */
  static forCreateSession(app_id, rp_context, action_description, bridge_url, override_connect_base_url, return_to, environment) {
    const ptr0 = passStringToWasm0(app_id, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len0 = WASM_VECTOR_LEN;
    _assertClass(rp_context, RpContextWasm);
    var ptr1 = rp_context.__destroy_into_raw();
    var ptr2 = isLikeNone(action_description) ? 0 : passStringToWasm0(action_description, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    var len2 = WASM_VECTOR_LEN;
    var ptr3 = isLikeNone(bridge_url) ? 0 : passStringToWasm0(bridge_url, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    var len3 = WASM_VECTOR_LEN;
    var ptr4 = isLikeNone(override_connect_base_url) ? 0 : passStringToWasm0(override_connect_base_url, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    var len4 = WASM_VECTOR_LEN;
    var ptr5 = isLikeNone(return_to) ? 0 : passStringToWasm0(return_to, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    var len5 = WASM_VECTOR_LEN;
    var ptr6 = isLikeNone(environment) ? 0 : passStringToWasm0(environment, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    var len6 = WASM_VECTOR_LEN;
    const ret = wasm.idkitbuilder_forCreateSession(ptr0, len0, ptr1, ptr2, len2, ptr3, len3, ptr4, len4, ptr5, len5, ptr6, len6);
    return _IDKitBuilder.__wrap(ret);
  }
  /**
   * Creates a new builder for proving an existing session
   * @param {string} session_id
   * @param {string} app_id
   * @param {RpContextWasm} rp_context
   * @param {string | null} [action_description]
   * @param {string | null} [bridge_url]
   * @param {string | null} [override_connect_base_url]
   * @param {string | null} [return_to]
   * @param {string | null} [environment]
   * @returns {IDKitBuilder}
   */
  static forProveSession(session_id, app_id, rp_context, action_description, bridge_url, override_connect_base_url, return_to, environment) {
    const ptr0 = passStringToWasm0(session_id, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(app_id, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len1 = WASM_VECTOR_LEN;
    _assertClass(rp_context, RpContextWasm);
    var ptr2 = rp_context.__destroy_into_raw();
    var ptr3 = isLikeNone(action_description) ? 0 : passStringToWasm0(action_description, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    var len3 = WASM_VECTOR_LEN;
    var ptr4 = isLikeNone(bridge_url) ? 0 : passStringToWasm0(bridge_url, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    var len4 = WASM_VECTOR_LEN;
    var ptr5 = isLikeNone(override_connect_base_url) ? 0 : passStringToWasm0(override_connect_base_url, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    var len5 = WASM_VECTOR_LEN;
    var ptr6 = isLikeNone(return_to) ? 0 : passStringToWasm0(return_to, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    var len6 = WASM_VECTOR_LEN;
    var ptr7 = isLikeNone(environment) ? 0 : passStringToWasm0(environment, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    var len7 = WASM_VECTOR_LEN;
    const ret = wasm.idkitbuilder_forProveSession(ptr0, len0, ptr1, len1, ptr2, ptr3, len3, ptr4, len4, ptr5, len5, ptr6, len6, ptr7, len7);
    return _IDKitBuilder.__wrap(ret);
  }
  /**
   * Builds the native payload for constraints (synchronous, no bridge connection).
   *
   * Used by the native transport to get the same payload format as the bridge
   * without creating a network connection.
   *
   * # Errors
   *
   * Returns an error if constraints are invalid or payload construction fails.
   * @param {any} constraints_json
   * @returns {any}
   */
  nativePayload(constraints_json) {
    try {
      const ptr = this.__destroy_into_raw();
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.idkitbuilder_nativePayload(retptr, ptr, addHeapObject(constraints_json));
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
      var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Builds the native payload from a preset (synchronous, no bridge connection).
   *
   * Used by the native transport to get the same payload format as the bridge
   * without creating a network connection.
   *
   * # Errors
   *
   * Returns an error if the preset is invalid or payload construction fails.
   * @param {any} preset_json
   * @returns {any}
   */
  nativePayloadFromPreset(preset_json) {
    try {
      const ptr = this.__destroy_into_raw();
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.idkitbuilder_nativePayloadFromPreset(retptr, ptr, addHeapObject(preset_json));
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
      var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Builds a v1 (legacy) native payload from a preset (synchronous, no bridge connection).
   *
   * Used by the native transport when the World App only supports verify v1.
   * Only legacy presets produce valid v1 payloads (constraint-based requests
   * default to `Device` level and may not carry the correct action).
   *
   * # Errors
   *
   * Returns an error if the preset is invalid or v1 payload construction fails.
   * @param {any} preset_json
   * @returns {any}
   */
  nativePayloadV1FromPreset(preset_json) {
    try {
      const ptr = this.__destroy_into_raw();
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.idkitbuilder_nativePayloadV1FromPreset(retptr, ptr, addHeapObject(preset_json));
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
      var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Creates a new builder for uniqueness requests
   * @param {string} app_id
   * @param {string} action
   * @param {RpContextWasm} rp_context
   * @param {string | null | undefined} action_description
   * @param {string | null | undefined} bridge_url
   * @param {boolean} allow_legacy_proofs
   * @param {string | null} [override_connect_base_url]
   * @param {string | null} [return_to]
   * @param {string | null} [environment]
   */
  constructor(app_id, action, rp_context, action_description, bridge_url, allow_legacy_proofs, override_connect_base_url, return_to, environment) {
    const ptr0 = passStringToWasm0(app_id, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(action, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len1 = WASM_VECTOR_LEN;
    _assertClass(rp_context, RpContextWasm);
    var ptr2 = rp_context.__destroy_into_raw();
    var ptr3 = isLikeNone(action_description) ? 0 : passStringToWasm0(action_description, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    var len3 = WASM_VECTOR_LEN;
    var ptr4 = isLikeNone(bridge_url) ? 0 : passStringToWasm0(bridge_url, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    var len4 = WASM_VECTOR_LEN;
    var ptr5 = isLikeNone(override_connect_base_url) ? 0 : passStringToWasm0(override_connect_base_url, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    var len5 = WASM_VECTOR_LEN;
    var ptr6 = isLikeNone(return_to) ? 0 : passStringToWasm0(return_to, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    var len6 = WASM_VECTOR_LEN;
    var ptr7 = isLikeNone(environment) ? 0 : passStringToWasm0(environment, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    var len7 = WASM_VECTOR_LEN;
    const ret = wasm.idkitbuilder_new(ptr0, len0, ptr1, len1, ptr2, ptr3, len3, ptr4, len4, allow_legacy_proofs, ptr5, len5, ptr6, len6, ptr7, len7);
    this.__wbg_ptr = ret >>> 0;
    IDKitBuilderFinalization.register(this, this.__wbg_ptr, this);
    return this;
  }
  /**
   * Creates a `BridgeConnection` from a preset (works for all request types)
   * @param {any} preset_json
   * @returns {Promise<any>}
   */
  preset(preset_json) {
    const ptr = this.__destroy_into_raw();
    const ret = wasm.idkitbuilder_preset(ptr, addHeapObject(preset_json));
    return takeObject(ret);
  }
};
if (Symbol.dispose) IDKitBuilder.prototype[Symbol.dispose] = IDKitBuilder.prototype.free;
var IDKitProof = class {
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    IDKitProofFinalization.unregister(this);
    return ptr;
  }
  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_idkitproof_free(ptr, 0);
  }
  /**
   * Creates a new legacy proof (protocol v1 / World ID v3)
   *
   * # Errors
   *
   * Returns an error if the verification level cannot be deserialized
   * @param {string} proof
   * @param {string} merkle_root
   * @param {string} nullifier_hash
   * @param {any} verification_level
   */
  constructor(proof, merkle_root, nullifier_hash, verification_level) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(proof, wasm.__wbindgen_export, wasm.__wbindgen_export2);
      const len0 = WASM_VECTOR_LEN;
      const ptr1 = passStringToWasm0(merkle_root, wasm.__wbindgen_export, wasm.__wbindgen_export2);
      const len1 = WASM_VECTOR_LEN;
      const ptr2 = passStringToWasm0(nullifier_hash, wasm.__wbindgen_export, wasm.__wbindgen_export2);
      const len2 = WASM_VECTOR_LEN;
      wasm.idkitproof_new(retptr, ptr0, len0, ptr1, len1, ptr2, len2, addHeapObject(verification_level));
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
      var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
      if (r2) {
        throw takeObject(r1);
      }
      this.__wbg_ptr = r0 >>> 0;
      IDKitProofFinalization.register(this, this.__wbg_ptr, this);
      return this;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Converts the proof to JSON
   *
   * # Errors
   *
   * Returns an error if serialization fails
   * @returns {any}
   */
  toJSON() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.idkitproof_toJSON(retptr, this.__wbg_ptr);
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
      var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
};
if (Symbol.dispose) IDKitProof.prototype[Symbol.dispose] = IDKitProof.prototype.free;
var IDKitRequest = class _IDKitRequest {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(_IDKitRequest.prototype);
    obj.__wbg_ptr = ptr;
    IDKitRequestFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    IDKitRequestFinalization.unregister(this);
    return ptr;
  }
  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_idkitrequest_free(ptr, 0);
  }
  /**
   * Returns the connect URL for World App
   *
   * This URL should be displayed as a QR code for users to scan with World App.
   *
   * # Errors
   *
   * Returns an error if the request has been closed
   * @returns {string}
   */
  connectUrl() {
    let deferred2_0;
    let deferred2_1;
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.idkitrequest_connectUrl(retptr, this.__wbg_ptr);
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
      var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
      var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
      var ptr1 = r0;
      var len1 = r1;
      if (r3) {
        ptr1 = 0;
        len1 = 0;
        throw takeObject(r2);
      }
      deferred2_0 = ptr1;
      deferred2_1 = len1;
      return getStringFromWasm0(ptr1, len1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_export4(deferred2_0, deferred2_1, 1);
    }
  }
  /**
   * Polls the bridge for the current status (non-blocking)
   *
   * Returns a status object with type:
   * - `"waiting_for_connection"` - Waiting for World App to retrieve the request
   * - `"awaiting_confirmation"` - World App has retrieved the request, waiting for user
   * - `"confirmed"` - User confirmed and provided a proof
   * - `"failed"` - Request has failed
   *
   * # Errors
   *
   * Returns an error if the request fails or the response is invalid
   * @returns {Promise<any>}
   */
  pollForStatus() {
    const ret = wasm.idkitrequest_pollForStatus(this.__wbg_ptr);
    return takeObject(ret);
  }
  /**
   * Returns the request ID for this request
   *
   * # Errors
   *
   * Returns an error if the request has been closed
   * @returns {string}
   */
  requestId() {
    let deferred2_0;
    let deferred2_1;
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.idkitrequest_requestId(retptr, this.__wbg_ptr);
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
      var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
      var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
      var ptr1 = r0;
      var len1 = r1;
      if (r3) {
        ptr1 = 0;
        len1 = 0;
        throw takeObject(r2);
      }
      deferred2_0 = ptr1;
      deferred2_1 = len1;
      return getStringFromWasm0(ptr1, len1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_export4(deferred2_0, deferred2_1, 1);
    }
  }
};
if (Symbol.dispose) IDKitRequest.prototype[Symbol.dispose] = IDKitRequest.prototype.free;
var RpContextWasm = class {
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    RpContextWasmFinalization.unregister(this);
    return ptr;
  }
  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_rpcontextwasm_free(ptr, 0);
  }
  /**
   * Creates a new RP context
   *
   * # Arguments
   * * `rp_id` - The registered RP ID (e.g., `"rp_123456789abcdef0"`)
   * * `nonce` - Unique nonce for this proof request
   * * `created_at` - Unix timestamp (seconds since epoch) when created
   * * `expires_at` - Unix timestamp (seconds since epoch) when expires
   * * `signature` - The RP's ECDSA signature of the `nonce` and `created_at` timestamp
   *
   * # Errors
   *
   * Returns an error if `rp_id` is not a valid RP ID (must start with `rp_`)
   * @param {string} rp_id
   * @param {string} nonce
   * @param {bigint} created_at
   * @param {bigint} expires_at
   * @param {string} signature
   */
  constructor(rp_id, nonce, created_at, expires_at, signature) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(rp_id, wasm.__wbindgen_export, wasm.__wbindgen_export2);
      const len0 = WASM_VECTOR_LEN;
      const ptr1 = passStringToWasm0(nonce, wasm.__wbindgen_export, wasm.__wbindgen_export2);
      const len1 = WASM_VECTOR_LEN;
      const ptr2 = passStringToWasm0(signature, wasm.__wbindgen_export, wasm.__wbindgen_export2);
      const len2 = WASM_VECTOR_LEN;
      wasm.rpcontextwasm_new(retptr, ptr0, len0, ptr1, len1, created_at, expires_at, ptr2, len2);
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
      var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
      if (r2) {
        throw takeObject(r1);
      }
      this.__wbg_ptr = r0 >>> 0;
      RpContextWasmFinalization.register(this, this.__wbg_ptr, this);
      return this;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
};
if (Symbol.dispose) RpContextWasm.prototype[Symbol.dispose] = RpContextWasm.prototype.free;
var RpSignature = class _RpSignature {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(_RpSignature.prototype);
    obj.__wbg_ptr = ptr;
    RpSignatureFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    RpSignatureFinalization.unregister(this);
    return ptr;
  }
  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_rpsignature_free(ptr, 0);
  }
  /**
   * Gets the creation timestamp
   * @returns {bigint}
   */
  get createdAt() {
    const ret = wasm.rpsignature_createdAt(this.__wbg_ptr);
    return BigInt.asUintN(64, ret);
  }
  /**
   * Gets the expiration timestamp
   * @returns {bigint}
   */
  get expiresAt() {
    const ret = wasm.rpsignature_expiresAt(this.__wbg_ptr);
    return BigInt.asUintN(64, ret);
  }
  /**
   * Gets the nonce as hex string (0x-prefixed field element)
   * @returns {string}
   */
  get nonce() {
    let deferred1_0;
    let deferred1_1;
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.rpsignature_nonce(retptr, this.__wbg_ptr);
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
      deferred1_0 = r0;
      deferred1_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_export4(deferred1_0, deferred1_1, 1);
    }
  }
  /**
   * Gets the signature as hex string (0x-prefixed, 65 bytes)
   * @returns {string}
   */
  get sig() {
    let deferred1_0;
    let deferred1_1;
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.rpsignature_sig(retptr, this.__wbg_ptr);
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
      deferred1_0 = r0;
      deferred1_1 = r1;
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_export4(deferred1_0, deferred1_1, 1);
    }
  }
  /**
   * Converts to JSON
   *
   * # Errors
   *
   * Returns an error if setting object properties fails
   * @returns {any}
   */
  toJSON() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.rpsignature_toJSON(retptr, this.__wbg_ptr);
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
      var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
};
if (Symbol.dispose) RpSignature.prototype[Symbol.dispose] = RpSignature.prototype.free;
function base64Decode(data) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    const ptr0 = passStringToWasm0(data, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len0 = WASM_VECTOR_LEN;
    wasm.base64Decode(retptr, ptr0, len0);
    var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
    var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
    var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
    var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
    if (r3) {
      throw takeObject(r2);
    }
    var v2 = getArrayU8FromWasm0(r0, r1).slice();
    wasm.__wbindgen_export4(r0, r1 * 1, 1);
    return v2;
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
  }
}
function base64Encode(data) {
  let deferred2_0;
  let deferred2_1;
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_export);
    const len0 = WASM_VECTOR_LEN;
    wasm.base64Encode(retptr, ptr0, len0);
    var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
    var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
    deferred2_0 = r0;
    deferred2_1 = r1;
    return getStringFromWasm0(r0, r1);
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
    wasm.__wbindgen_export4(deferred2_0, deferred2_1, 1);
  }
}
function computeRpSignatureMessage2(nonce, created_at, expires_at, action) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    const ptr0 = passStringToWasm0(nonce, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len0 = WASM_VECTOR_LEN;
    var ptr1 = isLikeNone(action) ? 0 : passStringToWasm0(action, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    var len1 = WASM_VECTOR_LEN;
    wasm.computeRpSignatureMessage(retptr, ptr0, len0, created_at, expires_at, ptr1, len1);
    var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
    var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
    var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
    var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
    if (r3) {
      throw takeObject(r2);
    }
    var v3 = getArrayU8FromWasm0(r0, r1).slice();
    wasm.__wbindgen_export4(r0, r1 * 1, 1);
    return v3;
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
  }
}
function createSession(app_id, rp_context, action_description, bridge_url, override_connect_base_url, return_to, environment) {
  const ptr0 = passStringToWasm0(app_id, wasm.__wbindgen_export, wasm.__wbindgen_export2);
  const len0 = WASM_VECTOR_LEN;
  _assertClass(rp_context, RpContextWasm);
  var ptr1 = rp_context.__destroy_into_raw();
  var ptr2 = isLikeNone(action_description) ? 0 : passStringToWasm0(action_description, wasm.__wbindgen_export, wasm.__wbindgen_export2);
  var len2 = WASM_VECTOR_LEN;
  var ptr3 = isLikeNone(bridge_url) ? 0 : passStringToWasm0(bridge_url, wasm.__wbindgen_export, wasm.__wbindgen_export2);
  var len3 = WASM_VECTOR_LEN;
  var ptr4 = isLikeNone(override_connect_base_url) ? 0 : passStringToWasm0(override_connect_base_url, wasm.__wbindgen_export, wasm.__wbindgen_export2);
  var len4 = WASM_VECTOR_LEN;
  var ptr5 = isLikeNone(return_to) ? 0 : passStringToWasm0(return_to, wasm.__wbindgen_export, wasm.__wbindgen_export2);
  var len5 = WASM_VECTOR_LEN;
  var ptr6 = isLikeNone(environment) ? 0 : passStringToWasm0(environment, wasm.__wbindgen_export, wasm.__wbindgen_export2);
  var len6 = WASM_VECTOR_LEN;
  const ret = wasm.createSession(ptr0, len0, ptr1, ptr2, len2, ptr3, len3, ptr4, len4, ptr5, len5, ptr6, len6);
  return IDKitBuilder.__wrap(ret);
}
function hashSignal(signal) {
  let deferred2_0;
  let deferred2_1;
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    wasm.hashSignal(retptr, addHeapObject(signal));
    var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
    var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
    var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
    var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
    var ptr1 = r0;
    var len1 = r1;
    if (r3) {
      ptr1 = 0;
      len1 = 0;
      throw takeObject(r2);
    }
    deferred2_0 = ptr1;
    deferred2_1 = len1;
    return getStringFromWasm0(ptr1, len1);
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
    wasm.__wbindgen_export4(deferred2_0, deferred2_1, 1);
  }
}
function init_wasm() {
  wasm.init_wasm();
}
function proveSession(session_id, app_id, rp_context, action_description, bridge_url, override_connect_base_url, return_to, environment) {
  const ptr0 = passStringToWasm0(session_id, wasm.__wbindgen_export, wasm.__wbindgen_export2);
  const len0 = WASM_VECTOR_LEN;
  const ptr1 = passStringToWasm0(app_id, wasm.__wbindgen_export, wasm.__wbindgen_export2);
  const len1 = WASM_VECTOR_LEN;
  _assertClass(rp_context, RpContextWasm);
  var ptr2 = rp_context.__destroy_into_raw();
  var ptr3 = isLikeNone(action_description) ? 0 : passStringToWasm0(action_description, wasm.__wbindgen_export, wasm.__wbindgen_export2);
  var len3 = WASM_VECTOR_LEN;
  var ptr4 = isLikeNone(bridge_url) ? 0 : passStringToWasm0(bridge_url, wasm.__wbindgen_export, wasm.__wbindgen_export2);
  var len4 = WASM_VECTOR_LEN;
  var ptr5 = isLikeNone(override_connect_base_url) ? 0 : passStringToWasm0(override_connect_base_url, wasm.__wbindgen_export, wasm.__wbindgen_export2);
  var len5 = WASM_VECTOR_LEN;
  var ptr6 = isLikeNone(return_to) ? 0 : passStringToWasm0(return_to, wasm.__wbindgen_export, wasm.__wbindgen_export2);
  var len6 = WASM_VECTOR_LEN;
  var ptr7 = isLikeNone(environment) ? 0 : passStringToWasm0(environment, wasm.__wbindgen_export, wasm.__wbindgen_export2);
  var len7 = WASM_VECTOR_LEN;
  const ret = wasm.proveSession(ptr0, len0, ptr1, len1, ptr2, ptr3, len3, ptr4, len4, ptr5, len5, ptr6, len6, ptr7, len7);
  return IDKitBuilder.__wrap(ret);
}
function request(app_id, action, rp_context, action_description, bridge_url, allow_legacy_proofs, override_connect_base_url, return_to, environment) {
  const ptr0 = passStringToWasm0(app_id, wasm.__wbindgen_export, wasm.__wbindgen_export2);
  const len0 = WASM_VECTOR_LEN;
  const ptr1 = passStringToWasm0(action, wasm.__wbindgen_export, wasm.__wbindgen_export2);
  const len1 = WASM_VECTOR_LEN;
  _assertClass(rp_context, RpContextWasm);
  var ptr2 = rp_context.__destroy_into_raw();
  var ptr3 = isLikeNone(action_description) ? 0 : passStringToWasm0(action_description, wasm.__wbindgen_export, wasm.__wbindgen_export2);
  var len3 = WASM_VECTOR_LEN;
  var ptr4 = isLikeNone(bridge_url) ? 0 : passStringToWasm0(bridge_url, wasm.__wbindgen_export, wasm.__wbindgen_export2);
  var len4 = WASM_VECTOR_LEN;
  var ptr5 = isLikeNone(override_connect_base_url) ? 0 : passStringToWasm0(override_connect_base_url, wasm.__wbindgen_export, wasm.__wbindgen_export2);
  var len5 = WASM_VECTOR_LEN;
  var ptr6 = isLikeNone(return_to) ? 0 : passStringToWasm0(return_to, wasm.__wbindgen_export, wasm.__wbindgen_export2);
  var len6 = WASM_VECTOR_LEN;
  var ptr7 = isLikeNone(environment) ? 0 : passStringToWasm0(environment, wasm.__wbindgen_export, wasm.__wbindgen_export2);
  var len7 = WASM_VECTOR_LEN;
  const ret = wasm.request(ptr0, len0, ptr1, len1, ptr2, ptr3, len3, ptr4, len4, allow_legacy_proofs, ptr5, len5, ptr6, len6, ptr7, len7);
  return IDKitBuilder.__wrap(ret);
}
function signRequest2(signing_key_hex, ttl_seconds, action) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    const ptr0 = passStringToWasm0(signing_key_hex, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    const len0 = WASM_VECTOR_LEN;
    var ptr1 = isLikeNone(action) ? 0 : passStringToWasm0(action, wasm.__wbindgen_export, wasm.__wbindgen_export2);
    var len1 = WASM_VECTOR_LEN;
    wasm.signRequest(retptr, ptr0, len0, !isLikeNone(ttl_seconds), isLikeNone(ttl_seconds) ? BigInt(0) : ttl_seconds, ptr1, len1);
    var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
    var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
    var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
    if (r2) {
      throw takeObject(r1);
    }
    return RpSignature.__wrap(r0);
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
  }
}
function __wbg_get_imports() {
  const import0 = {
    __proto__: null,
    __wbg_Error_83742b46f01ce22d: function(arg0, arg1) {
      const ret = Error(getStringFromWasm0(arg0, arg1));
      return addHeapObject(ret);
    },
    __wbg_String_8564e559799eccda: function(arg0, arg1) {
      const ret = String(getObject(arg1));
      const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);
      const len1 = WASM_VECTOR_LEN;
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    },
    __wbg___wbindgen_bigint_get_as_i64_447a76b5c6ef7bda: function(arg0, arg1) {
      const v = getObject(arg1);
      const ret = typeof v === "bigint" ? v : void 0;
      getDataViewMemory0().setBigInt64(arg0 + 8 * 1, isLikeNone(ret) ? BigInt(0) : ret, true);
      getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
    },
    __wbg___wbindgen_boolean_get_c0f3f60bac5a78d1: function(arg0) {
      const v = getObject(arg0);
      const ret = typeof v === "boolean" ? v : void 0;
      return isLikeNone(ret) ? 16777215 : ret ? 1 : 0;
    },
    __wbg___wbindgen_debug_string_5398f5bb970e0daa: function(arg0, arg1) {
      const ret = debugString(getObject(arg1));
      const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);
      const len1 = WASM_VECTOR_LEN;
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    },
    __wbg___wbindgen_in_41dbb8413020e076: function(arg0, arg1) {
      const ret = getObject(arg0) in getObject(arg1);
      return ret;
    },
    __wbg___wbindgen_is_bigint_e2141d4f045b7eda: function(arg0) {
      const ret = typeof getObject(arg0) === "bigint";
      return ret;
    },
    __wbg___wbindgen_is_function_3c846841762788c1: function(arg0) {
      const ret = typeof getObject(arg0) === "function";
      return ret;
    },
    __wbg___wbindgen_is_object_781bc9f159099513: function(arg0) {
      const val = getObject(arg0);
      const ret = typeof val === "object" && val !== null;
      return ret;
    },
    __wbg___wbindgen_is_string_7ef6b97b02428fae: function(arg0) {
      const ret = typeof getObject(arg0) === "string";
      return ret;
    },
    __wbg___wbindgen_is_undefined_52709e72fb9f179c: function(arg0) {
      const ret = getObject(arg0) === void 0;
      return ret;
    },
    __wbg___wbindgen_jsval_eq_ee31bfad3e536463: function(arg0, arg1) {
      const ret = getObject(arg0) === getObject(arg1);
      return ret;
    },
    __wbg___wbindgen_jsval_loose_eq_5bcc3bed3c69e72b: function(arg0, arg1) {
      const ret = getObject(arg0) == getObject(arg1);
      return ret;
    },
    __wbg___wbindgen_number_get_34bb9d9dcfa21373: function(arg0, arg1) {
      const obj = getObject(arg1);
      const ret = typeof obj === "number" ? obj : void 0;
      getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
      getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
    },
    __wbg___wbindgen_string_get_395e606bd0ee4427: function(arg0, arg1) {
      const obj = getObject(arg1);
      const ret = typeof obj === "string" ? obj : void 0;
      var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);
      var len1 = WASM_VECTOR_LEN;
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    },
    __wbg___wbindgen_throw_6ddd609b62940d55: function(arg0, arg1) {
      throw new Error(getStringFromWasm0(arg0, arg1));
    },
    __wbg__wbg_cb_unref_6b5b6b8576d35cb1: function(arg0) {
      getObject(arg0)._wbg_cb_unref();
    },
    __wbg_abort_5ef96933660780b7: function(arg0) {
      getObject(arg0).abort();
    },
    __wbg_abort_6479c2d794ebf2ee: function(arg0, arg1) {
      getObject(arg0).abort(getObject(arg1));
    },
    __wbg_append_608dfb635ee8998f: function() {
      return handleError(function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).append(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
      }, arguments);
    },
    __wbg_arrayBuffer_eb8e9ca620af2a19: function() {
      return handleError(function(arg0) {
        const ret = getObject(arg0).arrayBuffer();
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_call_2d781c1f4d5c0ef8: function() {
      return handleError(function(arg0, arg1, arg2) {
        const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_call_e133b57c9155d22c: function() {
      return handleError(function(arg0, arg1) {
        const ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_clearTimeout_6b8d9a38b9263d65: function(arg0) {
      const ret = clearTimeout(takeObject(arg0));
      return addHeapObject(ret);
    },
    __wbg_crypto_38df2bab126b63dc: function(arg0) {
      const ret = getObject(arg0).crypto;
      return addHeapObject(ret);
    },
    __wbg_done_08ce71ee07e3bd17: function(arg0) {
      const ret = getObject(arg0).done;
      return ret;
    },
    __wbg_entries_e8a20ff8c9757101: function(arg0) {
      const ret = Object.entries(getObject(arg0));
      return addHeapObject(ret);
    },
    __wbg_error_a6fa202b58aa1cd3: function(arg0, arg1) {
      let deferred0_0;
      let deferred0_1;
      try {
        deferred0_0 = arg0;
        deferred0_1 = arg1;
        console.error(getStringFromWasm0(arg0, arg1));
      } finally {
        wasm.__wbindgen_export4(deferred0_0, deferred0_1, 1);
      }
    },
    __wbg_fetch_5550a88cf343aaa9: function(arg0, arg1) {
      const ret = getObject(arg0).fetch(getObject(arg1));
      return addHeapObject(ret);
    },
    __wbg_fetch_9dad4fe911207b37: function(arg0) {
      const ret = fetch(getObject(arg0));
      return addHeapObject(ret);
    },
    __wbg_getRandomValues_a1cf2e70b003a59d: function() {
      return handleError(function(arg0, arg1) {
        globalThis.crypto.getRandomValues(getArrayU8FromWasm0(arg0, arg1));
      }, arguments);
    },
    __wbg_getRandomValues_c44a50d8cfdaebeb: function() {
      return handleError(function(arg0, arg1) {
        getObject(arg0).getRandomValues(getObject(arg1));
      }, arguments);
    },
    __wbg_get_326e41e095fb2575: function() {
      return handleError(function(arg0, arg1) {
        const ret = Reflect.get(getObject(arg0), getObject(arg1));
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_get_a8ee5c45dabc1b3b: function(arg0, arg1) {
      const ret = getObject(arg0)[arg1 >>> 0];
      return addHeapObject(ret);
    },
    __wbg_get_unchecked_329cfe50afab7352: function(arg0, arg1) {
      const ret = getObject(arg0)[arg1 >>> 0];
      return addHeapObject(ret);
    },
    __wbg_has_926ef2ff40b308cf: function() {
      return handleError(function(arg0, arg1) {
        const ret = Reflect.has(getObject(arg0), getObject(arg1));
        return ret;
      }, arguments);
    },
    __wbg_headers_eb2234545f9ff993: function(arg0) {
      const ret = getObject(arg0).headers;
      return addHeapObject(ret);
    },
    __wbg_idkitrequest_new: function(arg0) {
      const ret = IDKitRequest.__wrap(arg0);
      return addHeapObject(ret);
    },
    __wbg_instanceof_ArrayBuffer_101e2bf31071a9f6: function(arg0) {
      let result;
      try {
        result = getObject(arg0) instanceof ArrayBuffer;
      } catch (_) {
        result = false;
      }
      const ret = result;
      return ret;
    },
    __wbg_instanceof_Map_f194b366846aca0c: function(arg0) {
      let result;
      try {
        result = getObject(arg0) instanceof Map;
      } catch (_) {
        result = false;
      }
      const ret = result;
      return ret;
    },
    __wbg_instanceof_Response_9b4d9fd451e051b1: function(arg0) {
      let result;
      try {
        result = getObject(arg0) instanceof Response;
      } catch (_) {
        result = false;
      }
      const ret = result;
      return ret;
    },
    __wbg_instanceof_Uint8Array_740438561a5b956d: function(arg0) {
      let result;
      try {
        result = getObject(arg0) instanceof Uint8Array;
      } catch (_) {
        result = false;
      }
      const ret = result;
      return ret;
    },
    __wbg_isArray_33b91feb269ff46e: function(arg0) {
      const ret = Array.isArray(getObject(arg0));
      return ret;
    },
    __wbg_isSafeInteger_ecd6a7f9c3e053cd: function(arg0) {
      const ret = Number.isSafeInteger(getObject(arg0));
      return ret;
    },
    __wbg_iterator_d8f549ec8fb061b1: function() {
      const ret = Symbol.iterator;
      return addHeapObject(ret);
    },
    __wbg_length_b3416cf66a5452c8: function(arg0) {
      const ret = getObject(arg0).length;
      return ret;
    },
    __wbg_length_ea16607d7b61445b: function(arg0) {
      const ret = getObject(arg0).length;
      return ret;
    },
    __wbg_msCrypto_bd5a034af96bcba6: function(arg0) {
      const ret = getObject(arg0).msCrypto;
      return addHeapObject(ret);
    },
    __wbg_new_0837727332ac86ba: function() {
      return handleError(function() {
        const ret = new Headers();
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_new_227d7c05414eb861: function() {
      const ret = new Error();
      return addHeapObject(ret);
    },
    __wbg_new_49d5571bd3f0c4d4: function() {
      const ret = /* @__PURE__ */ new Map();
      return addHeapObject(ret);
    },
    __wbg_new_5f486cdf45a04d78: function(arg0) {
      const ret = new Uint8Array(getObject(arg0));
      return addHeapObject(ret);
    },
    __wbg_new_a70fbab9066b301f: function() {
      const ret = new Array();
      return addHeapObject(ret);
    },
    __wbg_new_ab79df5bd7c26067: function() {
      const ret = new Object();
      return addHeapObject(ret);
    },
    __wbg_new_c518c60af666645b: function() {
      return handleError(function() {
        const ret = new AbortController();
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_new_from_slice_22da9388ac046e50: function(arg0, arg1) {
      const ret = new Uint8Array(getArrayU8FromWasm0(arg0, arg1));
      return addHeapObject(ret);
    },
    __wbg_new_typed_aaaeaf29cf802876: function(arg0, arg1) {
      try {
        var state0 = { a: arg0, b: arg1 };
        var cb0 = (arg02, arg12) => {
          const a = state0.a;
          state0.a = 0;
          try {
            return __wasm_bindgen_func_elem_1487(a, state0.b, arg02, arg12);
          } finally {
            state0.a = a;
          }
        };
        const ret = new Promise(cb0);
        return addHeapObject(ret);
      } finally {
        state0.a = state0.b = 0;
      }
    },
    __wbg_new_with_length_825018a1616e9e55: function(arg0) {
      const ret = new Uint8Array(arg0 >>> 0);
      return addHeapObject(ret);
    },
    __wbg_new_with_str_and_init_b4b54d1a819bc724: function() {
      return handleError(function(arg0, arg1, arg2) {
        const ret = new Request(getStringFromWasm0(arg0, arg1), getObject(arg2));
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_next_11b99ee6237339e3: function() {
      return handleError(function(arg0) {
        const ret = getObject(arg0).next();
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_next_e01a967809d1aa68: function(arg0) {
      const ret = getObject(arg0).next;
      return addHeapObject(ret);
    },
    __wbg_node_84ea875411254db1: function(arg0) {
      const ret = getObject(arg0).node;
      return addHeapObject(ret);
    },
    __wbg_now_16f0c993d5dd6c27: function() {
      const ret = Date.now();
      return ret;
    },
    __wbg_process_44c7a14e11e9f69e: function(arg0) {
      const ret = getObject(arg0).process;
      return addHeapObject(ret);
    },
    __wbg_prototypesetcall_d62e5099504357e6: function(arg0, arg1, arg2) {
      Uint8Array.prototype.set.call(getArrayU8FromWasm0(arg0, arg1), getObject(arg2));
    },
    __wbg_queueMicrotask_0c399741342fb10f: function(arg0) {
      const ret = getObject(arg0).queueMicrotask;
      return addHeapObject(ret);
    },
    __wbg_queueMicrotask_a082d78ce798393e: function(arg0) {
      queueMicrotask(getObject(arg0));
    },
    __wbg_randomFillSync_6c25eac9869eb53c: function() {
      return handleError(function(arg0, arg1) {
        getObject(arg0).randomFillSync(takeObject(arg1));
      }, arguments);
    },
    __wbg_require_b4edbdcf3e2a1ef0: function() {
      return handleError(function() {
        const ret = module.require;
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_resolve_ae8d83246e5bcc12: function(arg0) {
      const ret = Promise.resolve(getObject(arg0));
      return addHeapObject(ret);
    },
    __wbg_setTimeout_f757f00851f76c42: function(arg0, arg1) {
      const ret = setTimeout(getObject(arg0), arg1);
      return addHeapObject(ret);
    },
    __wbg_set_282384002438957f: function(arg0, arg1, arg2) {
      getObject(arg0)[arg1 >>> 0] = takeObject(arg2);
    },
    __wbg_set_6be42768c690e380: function(arg0, arg1, arg2) {
      getObject(arg0)[takeObject(arg1)] = takeObject(arg2);
    },
    __wbg_set_7eaa4f96924fd6b3: function() {
      return handleError(function(arg0, arg1, arg2) {
        const ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
        return ret;
      }, arguments);
    },
    __wbg_set_bf7251625df30a02: function(arg0, arg1, arg2) {
      const ret = getObject(arg0).set(getObject(arg1), getObject(arg2));
      return addHeapObject(ret);
    },
    __wbg_set_body_a3d856b097dfda04: function(arg0, arg1) {
      getObject(arg0).body = getObject(arg1);
    },
    __wbg_set_cache_ec7e430c6056ebda: function(arg0, arg1) {
      getObject(arg0).cache = __wbindgen_enum_RequestCache[arg1];
    },
    __wbg_set_credentials_ed63183445882c65: function(arg0, arg1) {
      getObject(arg0).credentials = __wbindgen_enum_RequestCredentials[arg1];
    },
    __wbg_set_headers_3c8fecc693b75327: function(arg0, arg1) {
      getObject(arg0).headers = getObject(arg1);
    },
    __wbg_set_method_8c015e8bcafd7be1: function(arg0, arg1, arg2) {
      getObject(arg0).method = getStringFromWasm0(arg1, arg2);
    },
    __wbg_set_mode_5a87f2c809cf37c2: function(arg0, arg1) {
      getObject(arg0).mode = __wbindgen_enum_RequestMode[arg1];
    },
    __wbg_set_signal_0cebecb698f25d21: function(arg0, arg1) {
      getObject(arg0).signal = getObject(arg1);
    },
    __wbg_signal_166e1da31adcac18: function(arg0) {
      const ret = getObject(arg0).signal;
      return addHeapObject(ret);
    },
    __wbg_stack_3b0d974bbf31e44f: function(arg0, arg1) {
      const ret = getObject(arg1).stack;
      const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);
      const len1 = WASM_VECTOR_LEN;
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    },
    __wbg_static_accessor_GLOBAL_8adb955bd33fac2f: function() {
      const ret = typeof global === "undefined" ? null : global;
      return isLikeNone(ret) ? 0 : addHeapObject(ret);
    },
    __wbg_static_accessor_GLOBAL_THIS_ad356e0db91c7913: function() {
      const ret = typeof globalThis === "undefined" ? null : globalThis;
      return isLikeNone(ret) ? 0 : addHeapObject(ret);
    },
    __wbg_static_accessor_SELF_f207c857566db248: function() {
      const ret = typeof self === "undefined" ? null : self;
      return isLikeNone(ret) ? 0 : addHeapObject(ret);
    },
    __wbg_static_accessor_WINDOW_bb9f1ba69d61b386: function() {
      const ret = typeof window === "undefined" ? null : window;
      return isLikeNone(ret) ? 0 : addHeapObject(ret);
    },
    __wbg_status_318629ab93a22955: function(arg0) {
      const ret = getObject(arg0).status;
      return ret;
    },
    __wbg_stringify_5ae93966a84901ac: function() {
      return handleError(function(arg0) {
        const ret = JSON.stringify(getObject(arg0));
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_subarray_a068d24e39478a8a: function(arg0, arg1, arg2) {
      const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
      return addHeapObject(ret);
    },
    __wbg_text_372f5b91442c50f9: function() {
      return handleError(function(arg0) {
        const ret = getObject(arg0).text();
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_then_098abe61755d12f6: function(arg0, arg1) {
      const ret = getObject(arg0).then(getObject(arg1));
      return addHeapObject(ret);
    },
    __wbg_then_9e335f6dd892bc11: function(arg0, arg1, arg2) {
      const ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
      return addHeapObject(ret);
    },
    __wbg_url_7fefc1820fba4e0c: function(arg0, arg1) {
      const ret = getObject(arg1).url;
      const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export, wasm.__wbindgen_export2);
      const len1 = WASM_VECTOR_LEN;
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    },
    __wbg_value_21fc78aab0322612: function(arg0) {
      const ret = getObject(arg0).value;
      return addHeapObject(ret);
    },
    __wbg_versions_276b2795b1c6a219: function(arg0) {
      const ret = getObject(arg0).versions;
      return addHeapObject(ret);
    },
    __wbindgen_cast_0000000000000001: function(arg0, arg1) {
      const ret = makeMutClosure(arg0, arg1, wasm.__wasm_bindgen_func_elem_699, __wasm_bindgen_func_elem_700);
      return addHeapObject(ret);
    },
    __wbindgen_cast_0000000000000002: function(arg0, arg1) {
      const ret = makeMutClosure(arg0, arg1, wasm.__wasm_bindgen_func_elem_1027, __wasm_bindgen_func_elem_1028);
      return addHeapObject(ret);
    },
    __wbindgen_cast_0000000000000003: function(arg0) {
      const ret = arg0;
      return addHeapObject(ret);
    },
    __wbindgen_cast_0000000000000004: function(arg0) {
      const ret = arg0;
      return addHeapObject(ret);
    },
    __wbindgen_cast_0000000000000005: function(arg0, arg1) {
      const ret = getArrayU8FromWasm0(arg0, arg1);
      return addHeapObject(ret);
    },
    __wbindgen_cast_0000000000000006: function(arg0, arg1) {
      const ret = getStringFromWasm0(arg0, arg1);
      return addHeapObject(ret);
    },
    __wbindgen_cast_0000000000000007: function(arg0) {
      const ret = BigInt.asUintN(64, arg0);
      return addHeapObject(ret);
    },
    __wbindgen_object_clone_ref: function(arg0) {
      const ret = getObject(arg0);
      return addHeapObject(ret);
    },
    __wbindgen_object_drop_ref: function(arg0) {
      takeObject(arg0);
    }
  };
  return {
    __proto__: null,
    "./idkit_wasm_bg.js": import0
  };
}
function __wasm_bindgen_func_elem_700(arg0, arg1) {
  wasm.__wasm_bindgen_func_elem_700(arg0, arg1);
}
function __wasm_bindgen_func_elem_1028(arg0, arg1, arg2) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    wasm.__wasm_bindgen_func_elem_1028(retptr, arg0, arg1, addHeapObject(arg2));
    var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
    var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
    if (r1) {
      throw takeObject(r0);
    }
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
  }
}
function __wasm_bindgen_func_elem_1487(arg0, arg1, arg2, arg3) {
  wasm.__wasm_bindgen_func_elem_1487(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
}
var __wbindgen_enum_RequestCache = ["default", "no-store", "reload", "no-cache", "force-cache", "only-if-cached"];
var __wbindgen_enum_RequestCredentials = ["omit", "same-origin", "include"];
var __wbindgen_enum_RequestMode = ["same-origin", "no-cors", "cors", "navigate"];
var BridgeEncryptionFinalization = typeof FinalizationRegistry === "undefined" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((ptr) => wasm.__wbg_bridgeencryption_free(ptr >>> 0, 1));
var CredentialRequestWasmFinalization = typeof FinalizationRegistry === "undefined" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((ptr) => wasm.__wbg_credentialrequestwasm_free(ptr >>> 0, 1));
var IDKitBuilderFinalization = typeof FinalizationRegistry === "undefined" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((ptr) => wasm.__wbg_idkitbuilder_free(ptr >>> 0, 1));
var IDKitProofFinalization = typeof FinalizationRegistry === "undefined" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((ptr) => wasm.__wbg_idkitproof_free(ptr >>> 0, 1));
var IDKitRequestFinalization = typeof FinalizationRegistry === "undefined" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((ptr) => wasm.__wbg_idkitrequest_free(ptr >>> 0, 1));
var RpContextWasmFinalization = typeof FinalizationRegistry === "undefined" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((ptr) => wasm.__wbg_rpcontextwasm_free(ptr >>> 0, 1));
var RpSignatureFinalization = typeof FinalizationRegistry === "undefined" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((ptr) => wasm.__wbg_rpsignature_free(ptr >>> 0, 1));
function addHeapObject(obj) {
  if (heap_next === heap.length) heap.push(heap.length + 1);
  const idx = heap_next;
  heap_next = heap[idx];
  heap[idx] = obj;
  return idx;
}
function _assertClass(instance, klass) {
  if (!(instance instanceof klass)) {
    throw new Error(`expected instance of ${klass.name}`);
  }
}
var CLOSURE_DTORS = typeof FinalizationRegistry === "undefined" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((state) => state.dtor(state.a, state.b));
function debugString(val) {
  const type = typeof val;
  if (type == "number" || type == "boolean" || val == null) {
    return `${val}`;
  }
  if (type == "string") {
    return `"${val}"`;
  }
  if (type == "symbol") {
    const description = val.description;
    if (description == null) {
      return "Symbol";
    } else {
      return `Symbol(${description})`;
    }
  }
  if (type == "function") {
    const name = val.name;
    if (typeof name == "string" && name.length > 0) {
      return `Function(${name})`;
    } else {
      return "Function";
    }
  }
  if (Array.isArray(val)) {
    const length = val.length;
    let debug = "[";
    if (length > 0) {
      debug += debugString(val[0]);
    }
    for (let i = 1; i < length; i++) {
      debug += ", " + debugString(val[i]);
    }
    debug += "]";
    return debug;
  }
  const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
  let className;
  if (builtInMatches && builtInMatches.length > 1) {
    className = builtInMatches[1];
  } else {
    return toString.call(val);
  }
  if (className == "Object") {
    try {
      return "Object(" + JSON.stringify(val) + ")";
    } catch (_) {
      return "Object";
    }
  }
  if (val instanceof Error) {
    return `${val.name}: ${val.message}
${val.stack}`;
  }
  return className;
}
function dropObject(idx) {
  if (idx < 1028) return;
  heap[idx] = heap_next;
  heap_next = idx;
}
function getArrayU8FromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}
var cachedDataViewMemory0 = null;
function getDataViewMemory0() {
  if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || cachedDataViewMemory0.buffer.detached === void 0 && cachedDataViewMemory0.buffer !== wasm.memory.buffer) {
    cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
  }
  return cachedDataViewMemory0;
}
function getStringFromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return decodeText(ptr, len);
}
var cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
  if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
    cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8ArrayMemory0;
}
function getObject(idx) {
  return heap[idx];
}
function handleError(f, args) {
  try {
    return f.apply(this, args);
  } catch (e) {
    wasm.__wbindgen_export3(addHeapObject(e));
  }
}
var heap = new Array(1024).fill(void 0);
heap.push(void 0, null, true, false);
var heap_next = heap.length;
function isLikeNone(x) {
  return x === void 0 || x === null;
}
function makeMutClosure(arg0, arg1, dtor, f) {
  const state = { a: arg0, b: arg1, cnt: 1, dtor };
  const real = (...args) => {
    state.cnt++;
    const a = state.a;
    state.a = 0;
    try {
      return f(a, state.b, ...args);
    } finally {
      state.a = a;
      real._wbg_cb_unref();
    }
  };
  real._wbg_cb_unref = () => {
    if (--state.cnt === 0) {
      state.dtor(state.a, state.b);
      state.a = 0;
      CLOSURE_DTORS.unregister(state);
    }
  };
  CLOSURE_DTORS.register(real, state, state);
  return real;
}
function passArray8ToWasm0(arg, malloc) {
  const ptr = malloc(arg.length * 1, 1) >>> 0;
  getUint8ArrayMemory0().set(arg, ptr / 1);
  WASM_VECTOR_LEN = arg.length;
  return ptr;
}
function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === void 0) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr2 = malloc(buf.length, 1) >>> 0;
    getUint8ArrayMemory0().subarray(ptr2, ptr2 + buf.length).set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr2;
  }
  let len = arg.length;
  let ptr = malloc(len, 1) >>> 0;
  const mem = getUint8ArrayMemory0();
  let offset = 0;
  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 127) break;
    mem[ptr + offset] = code;
  }
  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
    const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
    const ret = cachedTextEncoder.encodeInto(arg, view);
    offset += ret.written;
    ptr = realloc(ptr, len, offset, 1) >>> 0;
  }
  WASM_VECTOR_LEN = offset;
  return ptr;
}
function takeObject(idx) {
  const ret = getObject(idx);
  dropObject(idx);
  return ret;
}
var cachedTextDecoder = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
var MAX_SAFARI_DECODE_BYTES = 2146435072;
var numBytesDecoded = 0;
function decodeText(ptr, len) {
  numBytesDecoded += len;
  if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
    cachedTextDecoder = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
    cachedTextDecoder.decode();
    numBytesDecoded = len;
  }
  return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}
var cachedTextEncoder = new TextEncoder();
if (!("encodeInto" in cachedTextEncoder)) {
  cachedTextEncoder.encodeInto = function(arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
      read: arg.length,
      written: buf.length
    };
  };
}
var WASM_VECTOR_LEN = 0;
var wasm;
function __wbg_finalize_init(instance, module2) {
  wasm = instance.exports;
  cachedDataViewMemory0 = null;
  cachedUint8ArrayMemory0 = null;
  wasm.__wbindgen_start();
  return wasm;
}
async function __wbg_load(module2, imports) {
  if (typeof Response === "function" && module2 instanceof Response) {
    if (typeof WebAssembly.instantiateStreaming === "function") {
      try {
        return await WebAssembly.instantiateStreaming(module2, imports);
      } catch (e) {
        const validResponse = module2.ok && expectedResponseType(module2.type);
        if (validResponse && module2.headers.get("Content-Type") !== "application/wasm") {
          console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
        } else {
          throw e;
        }
      }
    }
    const bytes = await module2.arrayBuffer();
    return await WebAssembly.instantiate(bytes, imports);
  } else {
    const instance = await WebAssembly.instantiate(module2, imports);
    if (instance instanceof WebAssembly.Instance) {
      return { instance, module: module2 };
    } else {
      return instance;
    }
  }
  function expectedResponseType(type) {
    switch (type) {
      case "basic":
      case "cors":
      case "default":
        return true;
    }
    return false;
  }
}
function initSync(module2) {
  if (wasm !== void 0) return wasm;
  if (module2 !== void 0) {
    if (Object.getPrototypeOf(module2) === Object.prototype) {
      ({ module: module2 } = module2);
    } else {
      console.warn("using deprecated parameters for `initSync()`; pass a single object instead");
    }
  }
  const imports = __wbg_get_imports();
  if (!(module2 instanceof WebAssembly.Module)) {
    module2 = new WebAssembly.Module(module2);
  }
  const instance = new WebAssembly.Instance(module2, imports);
  return __wbg_finalize_init(instance);
}
async function __wbg_init(module_or_path) {
  if (wasm !== void 0) return wasm;
  if (module_or_path !== void 0) {
    if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
      ({ module_or_path } = module_or_path);
    } else {
      console.warn("using deprecated parameters for the initialization function; pass a single object instead");
    }
  }
  if (module_or_path === void 0) {
    module_or_path = new URL("idkit_wasm_bg.wasm", import.meta.url);
  }
  const imports = __wbg_get_imports();
  if (typeof module_or_path === "string" || typeof Request === "function" && module_or_path instanceof Request || typeof URL === "function" && module_or_path instanceof URL) {
    module_or_path = fetch(module_or_path);
  }
  const { instance, module: module2 } = await __wbg_load(await module_or_path, imports);
  return __wbg_finalize_init(instance);
}
var wasmInitialized = false;
var wasmInitPromise = null;
async function initIDKit() {
  if (wasmInitialized) {
    return;
  }
  if (wasmInitPromise) {
    return wasmInitPromise;
  }
  wasmInitPromise = (async () => {
    try {
      await __wbg_init();
      wasmInitialized = true;
    } catch (error) {
      wasmInitPromise = null;
      throw new Error(`Failed to initialize IDKit WASM: ${error}`);
    }
  })();
  return wasmInitPromise;
}
var _debug = false;
function isDebug() {
  if (_debug) return true;
  return typeof window !== "undefined" && Boolean(window.IDKIT_DEBUG);
}
function setDebug(enabled) {
  _debug = enabled;
}
var MINIAPP_VERIFY_ACTION = "miniapp-verify-action";
function isInWorldApp() {
  return typeof window !== "undefined" && Boolean(window.WorldApp);
}
function getWorldAppVerifyVersion() {
  const cmds = window.WorldApp?.supported_commands;
  if (!Array.isArray(cmds)) return 1;
  const verify = cmds.find((c) => c.name === "verify");
  return verify?.supported_versions?.includes(2) ? 2 : 1;
}
var _requestCounter = 0;
var _activeNativeRequest = null;
function createNativeRequest(wasmPayload, config, signalHashes = {}, legacySignalHash, version = 2) {
  if (_activeNativeRequest?.isPending()) {
    if (isDebug())
      console.warn(
        "[IDKit] Native: request already in flight, reusing active request"
      );
    return _activeNativeRequest;
  }
  const request2 = new NativeIDKitRequest(
    wasmPayload,
    config,
    signalHashes,
    legacySignalHash,
    version
  );
  _activeNativeRequest = request2;
  return request2;
}
var NativeIDKitRequest = class {
  constructor(wasmPayload, config, signalHashes = {}, legacySignalHash, version = 2) {
    this.connectorURI = "";
    this.completionResult = null;
    this.resolveFn = null;
    this.messageHandler = null;
    this.miniKitHandler = null;
    this.requestId = crypto.randomUUID?.() ?? `native-${Date.now()}-${++_requestCounter}`;
    this.resultPromise = new Promise((resolve) => {
      this.resolveFn = resolve;
      const handleIncomingPayload = (responsePayload) => {
        if (this.completionResult) return;
        if (responsePayload?.status === "error") {
          if (isDebug())
            console.warn(
              "[IDKit] Native: received error response",
              responsePayload.error_code
            );
          this.complete({
            success: false,
            error: responsePayload.error_code ?? "generic_error"
            /* GenericError */
          });
          return;
        }
        this.complete({
          success: true,
          result: nativeResultToIDKitResult(
            responsePayload,
            config,
            signalHashes,
            legacySignalHash
          )
        });
      };
      const handler = (event) => {
        const data = event.data;
        if (data?.type === MINIAPP_VERIFY_ACTION || data?.command === MINIAPP_VERIFY_ACTION) {
          handleIncomingPayload(data.payload ?? data);
        }
      };
      this.messageHandler = handler;
      window.addEventListener("message", handler);
      try {
        const miniKit = window.MiniKit;
        if (typeof miniKit?.subscribe === "function") {
          const miniKitHandler = (payload) => {
            handleIncomingPayload(payload?.payload ?? payload);
          };
          this.miniKitHandler = miniKitHandler;
          miniKit.subscribe(MINIAPP_VERIFY_ACTION, miniKitHandler);
        }
      } catch (err2) {
        if (isDebug())
          console.warn("[IDKit] Native: MiniKit subscribe failed", err2);
      }
      const sendPayload = {
        command: "verify",
        version,
        payload: wasmPayload
      };
      try {
        const w = window;
        if (w.webkit?.messageHandlers?.minikit) {
          if (isDebug())
            console.debug(
              `[IDKit] Native: sending verify command (version=${version}, platform=ios)`
            );
          w.webkit.messageHandlers.minikit.postMessage(sendPayload);
        } else if (w.Android) {
          if (isDebug())
            console.debug(
              `[IDKit] Native: sending verify command (version=${version}, platform=android)`
            );
          w.Android.postMessage(JSON.stringify(sendPayload));
        } else {
          if (isDebug())
            console.warn(
              "[IDKit] Native: no native bridge found (no webkit/Android)"
            );
          this.complete({
            success: false,
            error: "generic_error"
            /* GenericError */
          });
        }
      } catch (err2) {
        if (isDebug()) console.warn("[IDKit] Native: postMessage failed", err2);
        this.complete({
          success: false,
          error: "generic_error"
          /* GenericError */
        });
      }
    });
  }
  // Single entry point for finishing the request. Idempotent — first caller wins.
  complete(result) {
    if (this.completionResult) return;
    if (isDebug())
      console.debug(
        "[IDKit] Native: request completed",
        result.success ? "success" : `error=${result.error}`
      );
    this.completionResult = result;
    this.cleanup();
    this.resolveFn?.(result);
    if (_activeNativeRequest === this) {
      _activeNativeRequest = null;
    }
  }
  cancel() {
    this.complete({
      success: false,
      error: "cancelled"
      /* Cancelled */
    });
  }
  cleanup() {
    if (this.messageHandler) {
      window.removeEventListener("message", this.messageHandler);
      this.messageHandler = null;
    }
    if (this.miniKitHandler) {
      try {
        const miniKit = window.MiniKit;
        miniKit?.unsubscribe?.(MINIAPP_VERIFY_ACTION);
      } catch (err2) {
        if (isDebug())
          console.warn("[IDKit] Native: MiniKit unsubscribe failed", err2);
      }
      this.miniKitHandler = null;
    }
  }
  isPending() {
    return this.completionResult === null;
  }
  async pollOnce() {
    if (!this.completionResult) {
      return { type: "awaiting_confirmation" };
    }
    if (this.completionResult.success) {
      return { type: "confirmed", result: this.completionResult.result };
    }
    return { type: "failed", error: this.completionResult.error };
  }
  async pollUntilCompletion(options) {
    const timeout = options?.timeout ?? 9e5;
    const timeoutId = setTimeout(() => {
      this.complete({
        success: false,
        error: "timeout"
        /* Timeout */
      });
    }, timeout);
    const abortHandler = options?.signal ? () => {
      this.complete({
        success: false,
        error: "cancelled"
        /* Cancelled */
      });
    } : null;
    if (abortHandler) {
      if (options.signal.aborted) {
        abortHandler();
      } else {
        options.signal.addEventListener("abort", abortHandler, {
          once: true
        });
      }
    }
    try {
      return await this.resultPromise;
    } catch (error) {
      console.error("Unexpected rejection in native resultPromise", error);
      this.complete({
        success: false,
        error: "generic_error"
        /* GenericError */
      });
      return this.completionResult;
    } finally {
      clearTimeout(timeoutId);
      if (options?.signal && abortHandler) {
        options.signal.removeEventListener("abort", abortHandler);
      }
    }
  }
};
function nativeResultToIDKitResult(payload, config, signalHashes, legacySignalHash) {
  const p = payload;
  const rpNonce = config.rp_context?.nonce ?? "";
  if ("proof_response" in p && p.proof_response != null) {
    const proof_response = p.proof_response;
    const items = proof_response.responses ?? [];
    if (proof_response.session_id) {
      return {
        protocol_version: "4.0",
        nonce: proof_response.nonce ?? rpNonce,
        action_description: proof_response.action_description,
        session_id: proof_response.session_id,
        responses: items.map((item) => ({
          identifier: item.identifier,
          signal_hash: signalHashes[item.identifier],
          proof: item.proof,
          session_nullifier: item.session_nullifier,
          issuer_schema_id: item.issuer_schema_id,
          expires_at_min: item.expires_at_min
        })),
        environment: config.environment ?? "production"
      };
    }
    return {
      protocol_version: "4.0",
      nonce: proof_response.nonce ?? rpNonce,
      action: proof_response.action ?? config.action ?? "",
      action_description: proof_response.action_description,
      responses: items.map((item) => ({
        identifier: item.identifier,
        signal_hash: signalHashes[item.identifier],
        proof: item.proof,
        nullifier: item.nullifier,
        issuer_schema_id: item.issuer_schema_id,
        expires_at_min: item.expires_at_min
      })),
      environment: config.environment ?? "production"
    };
  }
  if ("verifications" in p && Array.isArray(p.verifications)) {
    const verifications = p.verifications;
    return {
      protocol_version: "3.0",
      nonce: rpNonce,
      action: config.action ?? "",
      responses: verifications.map((v) => ({
        identifier: v.verification_level,
        signal_hash: v.signal_hash ?? signalHashes[v.verification_level] ?? legacySignalHash,
        proof: v.proof,
        merkle_root: v.merkle_root,
        nullifier: v.nullifier_hash
      })),
      environment: config.environment ?? "production"
    };
  }
  return {
    protocol_version: "3.0",
    nonce: rpNonce,
    action: config.action ?? "",
    responses: [
      {
        identifier: p.verification_level,
        signal_hash: p.signal_hash ?? signalHashes[p.verification_level] ?? legacySignalHash,
        proof: p.proof,
        merkle_root: p.merkle_root,
        nullifier: p.nullifier_hash
      }
    ],
    environment: config.environment ?? "production"
  };
}
var SESSION_ID_PATTERN = /^session_[0-9a-fA-F]{128}$/;
var IDKitRequestImpl = class {
  constructor(wasmRequest) {
    this.wasmRequest = wasmRequest;
    this._connectorURI = wasmRequest.connectUrl();
    this._requestId = wasmRequest.requestId();
  }
  get connectorURI() {
    return this._connectorURI;
  }
  get requestId() {
    return this._requestId;
  }
  async pollOnce() {
    return await this.wasmRequest.pollForStatus();
  }
  async pollUntilCompletion(options) {
    const pollInterval = options?.pollInterval ?? 1e3;
    const timeout = options?.timeout ?? 9e5;
    const startTime = Date.now();
    while (true) {
      if (options?.signal?.aborted) {
        return {
          success: false,
          error: "cancelled"
          /* Cancelled */
        };
      }
      if (Date.now() - startTime > timeout) {
        return {
          success: false,
          error: "timeout"
          /* Timeout */
        };
      }
      const status = await this.pollOnce();
      if (status.type === "confirmed" && status.result) {
        return { success: true, result: status.result };
      }
      if (status.type === "failed") {
        return {
          success: false,
          error: status.error ?? "generic_error"
          /* GenericError */
        };
      }
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }
  }
};
function CredentialRequest(credential_type, options) {
  return {
    type: credential_type,
    signal: options?.signal,
    genesis_issued_at_min: options?.genesis_issued_at_min,
    expires_at_min: options?.expires_at_min
  };
}
function any(...nodes) {
  return { any: nodes };
}
function all(...nodes) {
  return { all: nodes };
}
function enumerate(...nodes) {
  return { enumerate: nodes };
}
function orbLegacy(opts = {}) {
  return { type: "OrbLegacy", signal: opts.signal };
}
function secureDocumentLegacy(opts = {}) {
  return { type: "SecureDocumentLegacy", signal: opts.signal };
}
function documentLegacy(opts = {}) {
  return { type: "DocumentLegacy", signal: opts.signal };
}
function deviceLegacy(opts = {}) {
  return { type: "DeviceLegacy", signal: opts.signal };
}
function selfieCheckLegacy(opts = {}) {
  return { type: "SelfieCheckLegacy", signal: opts.signal };
}
function createWasmBuilderFromConfig(config) {
  if (!config.rp_context) {
    throw new Error("rp_context is required for WASM bridge transport");
  }
  const rpContext = new idkit_wasm_exports.RpContextWasm(
    config.rp_context.rp_id,
    config.rp_context.nonce,
    BigInt(config.rp_context.created_at),
    BigInt(config.rp_context.expires_at),
    config.rp_context.signature
  );
  if (config.type === "request") {
    return idkit_wasm_exports.request(
      config.app_id,
      String(config.action ?? ""),
      rpContext,
      config.action_description ?? null,
      config.bridge_url ?? null,
      config.allow_legacy_proofs ?? false,
      config.override_connect_base_url ?? null,
      config.return_to ?? null,
      config.environment ?? null
    );
  }
  if (config.type === "proveSession") {
    return idkit_wasm_exports.proveSession(
      config.session_id,
      config.app_id,
      rpContext,
      config.action_description ?? null,
      config.bridge_url ?? null,
      config.override_connect_base_url ?? null,
      config.return_to ?? null,
      config.environment ?? null
    );
  }
  return idkit_wasm_exports.createSession(
    config.app_id,
    rpContext,
    config.action_description ?? null,
    config.bridge_url ?? null,
    config.override_connect_base_url ?? null,
    config.return_to ?? null,
    config.environment ?? null
  );
}
var IDKitBuilder2 = class {
  constructor(config) {
    this.config = config;
  }
  /**
   * Creates an IDKit request with the given constraints
   *
   * @param constraints - Constraint tree (CredentialRequest or any/all/enumerate combinators)
   * @returns A new IDKitRequest instance
   *
   * @example
   * ```typescript
   * const request = await IDKit.request({ app_id, action, rp_context, allow_legacy_proofs: false })
   *   .constraints(any(CredentialRequest('proof_of_human'), CredentialRequest('face')));
   * ```
   */
  async constraints(constraints) {
    await initIDKit();
    if (isInWorldApp()) {
      const verifyVersion = getWorldAppVerifyVersion();
      if (verifyVersion < 2) {
        throw new Error(
          "verify v2 is not supported by this World App version. Use a legacy preset (e.g. orbLegacy()) or update the World App."
        );
      }
      const wasmBuilder2 = createWasmBuilderFromConfig(this.config);
      const wasmResult = wasmBuilder2.nativePayload(constraints);
      return createNativeRequest(
        wasmResult.payload,
        this.config,
        wasmResult.signal_hashes ?? {},
        wasmResult.legacy_signal_hash,
        2
      );
    }
    const wasmBuilder = createWasmBuilderFromConfig(this.config);
    const wasmRequest = await wasmBuilder.constraints(
      constraints
    );
    return new IDKitRequestImpl(wasmRequest);
  }
  /**
   * Creates an IDKit request from a preset (works for all request types)
   *
   * Presets provide a simplified way to create requests with predefined
   * credential configurations.
   *
   * @param preset - A preset object from orbLegacy(), secureDocumentLegacy(), documentLegacy(), selfieCheckLegacy(), or deviceLegacy()
   * @returns A new IDKitRequest instance
   *
   * @example
   * ```typescript
   * const request = await IDKit.request({ app_id, action, rp_context, allow_legacy_proofs: true })
   *   .preset(orbLegacy({ signal: 'user-123' }));
   * ```
   */
  async preset(preset) {
    if (this.config.type === "createSession" || this.config.type === "proveSession") {
      throw new Error(
        "Presets are not supported for session flows. Use .constraints() instead."
      );
    }
    await initIDKit();
    if (isInWorldApp()) {
      const verifyVersion = getWorldAppVerifyVersion();
      if (verifyVersion === 2) {
        const wasmBuilder2 = createWasmBuilderFromConfig(this.config);
        const wasmResult = wasmBuilder2.nativePayloadFromPreset(preset);
        return createNativeRequest(
          wasmResult.payload,
          this.config,
          wasmResult.signal_hashes ?? {},
          wasmResult.legacy_signal_hash,
          2
        );
      }
      try {
        const wasmBuilder2 = createWasmBuilderFromConfig(this.config);
        const wasmResult = wasmBuilder2.nativePayloadV1FromPreset(preset);
        return createNativeRequest(
          wasmResult.payload,
          this.config,
          wasmResult.signal_hashes ?? {},
          wasmResult.legacy_signal_hash,
          1
        );
      } catch (err2) {
        if (err2 instanceof Error && String(err2.message).includes("v1 payload")) {
          throw new Error(
            "verify v2 is not supported by this World App version. Use a legacy preset (e.g. orbLegacy()) or update the World App."
          );
        }
        throw err2;
      }
    }
    const wasmBuilder = createWasmBuilderFromConfig(this.config);
    const wasmRequest = await wasmBuilder.preset(
      preset
    );
    return new IDKitRequestImpl(wasmRequest);
  }
};
function createRequest(config) {
  if (!config.app_id) {
    throw new Error("app_id is required");
  }
  if (!config.action) {
    throw new Error("action is required");
  }
  if (!config.rp_context) {
    throw new Error(
      "rp_context is required. Generate it on your backend using signRequest()."
    );
  }
  if (typeof config.allow_legacy_proofs !== "boolean") {
    throw new Error(
      "allow_legacy_proofs is required. Set to true to accept v3 proofs during migration, or false to only accept v4 proofs."
    );
  }
  return new IDKitBuilder2({
    type: "request",
    app_id: config.app_id,
    action: String(config.action),
    rp_context: config.rp_context,
    action_description: config.action_description,
    bridge_url: config.bridge_url,
    return_to: config.return_to,
    allow_legacy_proofs: config.allow_legacy_proofs,
    override_connect_base_url: config.override_connect_base_url,
    environment: config.environment
  });
}
function createSession2(config) {
  if (!config.app_id) {
    throw new Error("app_id is required");
  }
  if (!config.rp_context) {
    throw new Error(
      "rp_context is required. Generate it on your backend using signRequest()."
    );
  }
  return new IDKitBuilder2({
    type: "createSession",
    app_id: config.app_id,
    rp_context: config.rp_context,
    action_description: config.action_description,
    bridge_url: config.bridge_url,
    return_to: config.return_to,
    override_connect_base_url: config.override_connect_base_url,
    environment: config.environment
  });
}
function proveSession2(sessionId, config) {
  if (!sessionId) {
    throw new Error("session_id is required");
  }
  if (!SESSION_ID_PATTERN.test(sessionId)) {
    throw new Error(
      "session_id must be in the format session_<128 hex characters>"
    );
  }
  if (!config.app_id) {
    throw new Error("app_id is required");
  }
  if (!config.rp_context) {
    throw new Error(
      "rp_context is required. Generate it on your backend using signRequest()."
    );
  }
  return new IDKitBuilder2({
    type: "proveSession",
    session_id: sessionId,
    app_id: config.app_id,
    rp_context: config.rp_context,
    action_description: config.action_description,
    bridge_url: config.bridge_url,
    return_to: config.return_to,
    override_connect_base_url: config.override_connect_base_url,
    environment: config.environment
  });
}
var IDKit = {
  /** Create a new verification request */
  request: createRequest,
  /** Create a new session (no action, no existing session_id) */
  createSession: createSession2,
  /** Prove an existing session (no action, has session_id) */
  proveSession: proveSession2,
  /** Create a CredentialRequest for a credential type */
  CredentialRequest,
  /** Create an OR constraint - at least one child must be satisfied */
  any,
  /** Create an AND constraint - all children must be satisfied */
  all,
  /** Create an enumerate constraint - all satisfiable children should be selected */
  enumerate,
  /** Create an OrbLegacy preset for World ID 3.0 legacy support */
  orbLegacy,
  /** Create a SecureDocumentLegacy preset for World ID 3.0 legacy support */
  secureDocumentLegacy,
  /** Create a DocumentLegacy preset for World ID 3.0 legacy support */
  documentLegacy,
  /** Create a DeviceLegacy preset for World ID 3.0 legacy support */
  deviceLegacy,
  /** Create a SelfieCheckLegacy preset for face verification */
  selfieCheckLegacy
};

// ../node_modules/@worldcoin/idkit/dist/index.js
var import_react_dom = __toESM(require_react_dom(), 1);
var import_qrcode = __toESM(require_qrcode(), 1);
import { memo, useMemo, useState, useRef, useCallback, useEffect } from "react";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
function createInitialHookState() {
  return {
    isOpen: false,
    status: "idle",
    connectorURI: null,
    result: null,
    errorCode: null
  };
}
function ensureNotAborted(signal) {
  if (signal?.aborted) {
    throw IDKitErrorCodes.Cancelled;
  }
}
async function delay(ms, signal) {
  if (!signal) {
    await new Promise((resolve) => setTimeout(resolve, ms));
    return;
  }
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      signal.removeEventListener("abort", abortHandler);
      resolve();
    }, ms);
    const abortHandler = () => {
      clearTimeout(timeout);
      signal.removeEventListener("abort", abortHandler);
      reject(IDKitErrorCodes.Cancelled);
    };
    signal.addEventListener("abort", abortHandler, { once: true });
  });
}
var knownErrorCodes = new Set(Object.values(IDKitErrorCodes));
function asKnownErrorCode(value) {
  if (typeof value === "string" && knownErrorCodes.has(value)) {
    return value;
  }
  return null;
}
function getErrorMessage(error) {
  if (typeof error === "string") {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = error.message;
    return typeof message === "string" ? message : null;
  }
  return null;
}
function errorCodeFromMessage(message) {
  const normalized = message.toLowerCase();
  if (normalized.includes("invalid rp id") || normalized.includes("valid rp id must start with") || normalized.includes("expected hex string")) {
    return IDKitErrorCodes.InvalidRpIdFormat;
  }
  if (normalized.includes("created_at cannot be in the future")) {
    return IDKitErrorCodes.TimestampTooFarInFuture;
  }
  if (normalized.includes("expires_at must be greater than created_at") || normalized.includes("invalid timestamp") || normalized.includes("failed to format timestamp")) {
    return IDKitErrorCodes.InvalidTimestamp;
  }
  return null;
}
function toErrorCode(error) {
  const directCode = asKnownErrorCode(error);
  if (directCode) {
    return directCode;
  }
  if (typeof error === "object" && error !== null && "code" in error) {
    const nestedCode = asKnownErrorCode(error.code);
    if (nestedCode) {
      return nestedCode;
    }
  }
  const message = getErrorMessage(error);
  if (message) {
    const messageCode = errorCodeFromMessage(message);
    if (messageCode) {
      return messageCode;
    }
  }
  return IDKitErrorCodes.GenericError;
}
function useIDKitFlow(createFlowHandle, config) {
  const isInWorldApp$1 = useMemo(() => isInWorldApp(), []);
  const [state, setState] = useState(
    createInitialHookState
  );
  const [runId, setRunId] = useState(0);
  const abortRef = useRef(null);
  const createFlowHandleRef = useRef(createFlowHandle);
  const configRef = useRef(config);
  createFlowHandleRef.current = createFlowHandle;
  configRef.current = config;
  const reset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setState(createInitialHookState);
    setRunId((id) => id + 1);
  }, []);
  const open = useCallback(() => {
    setState((prev) => {
      if (prev.isOpen) {
        return prev;
      }
      return {
        isOpen: true,
        status: "waiting_for_connection",
        connectorURI: null,
        result: null,
        errorCode: null
      };
    });
  }, []);
  useEffect(() => {
    if (!state.isOpen) {
      return;
    }
    const controller = new AbortController();
    abortRef.current = controller;
    const setFailed = (errorCode) => {
      setState((prev) => {
        if (prev.status === "failed" && prev.errorCode === errorCode) {
          return prev;
        }
        return {
          ...prev,
          status: "failed",
          errorCode
        };
      });
    };
    void (async () => {
      try {
        if (isDebug()) console.debug("[IDKit] Creating flow handle\u2026");
        const request2 = await createFlowHandleRef.current();
        ensureNotAborted(controller.signal);
        if (isDebug())
          console.debug("[IDKit] Flow created", {
            connectorURI: request2.connectorURI,
            requestId: request2.requestId
          });
        const connectorURI = isInWorldApp$1 ? null : request2.connectorURI;
        setState((prev) => {
          if (prev.connectorURI === connectorURI) {
            return prev;
          }
          return { ...prev, connectorURI };
        });
        const pollInterval = configRef.current.polling?.interval ?? 1e3;
        const timeout = configRef.current.polling?.timeout ?? 9e5;
        const startedAt = Date.now();
        while (true) {
          ensureNotAborted(controller.signal);
          if (Date.now() - startedAt > timeout) {
            setFailed(IDKitErrorCodes.Timeout);
            return;
          }
          const nextStatus = await request2.pollOnce();
          ensureNotAborted(controller.signal);
          if (nextStatus.type === "confirmed") {
            const confirmedResult = nextStatus.result;
            if (!confirmedResult) {
              setFailed(IDKitErrorCodes.UnexpectedResponse);
              return;
            }
            setState((prev) => ({
              ...prev,
              status: "confirmed",
              result: confirmedResult,
              errorCode: null
            }));
            return;
          }
          if (nextStatus.type === "failed") {
            if (isDebug())
              console.warn("[IDKit] Poll returned failed", nextStatus);
            setFailed(nextStatus.error ?? IDKitErrorCodes.GenericError);
            return;
          }
          setState((prev) => {
            if (prev.status === nextStatus.type) {
              return prev;
            }
            return { ...prev, status: nextStatus.type };
          });
          await delay(pollInterval, controller.signal);
        }
      } catch (error) {
        if (controller.signal.aborted) {
          if (isDebug()) console.debug("[IDKit] Flow aborted");
          return;
        }
        if (isDebug()) console.error("[IDKit] Flow error:", error);
        setFailed(toErrorCode(error));
      }
    })();
    return () => {
      controller.abort();
      if (abortRef.current === controller) {
        abortRef.current = null;
      }
    };
  }, [state.isOpen, runId, isInWorldApp$1]);
  return {
    open,
    reset,
    isAwaitingUserConnection: state.status === "waiting_for_connection",
    isAwaitingUserConfirmation: state.status === "awaiting_confirmation",
    isSuccess: state.status === "confirmed",
    isError: state.status === "failed",
    connectorURI: state.connectorURI,
    result: state.result,
    errorCode: state.errorCode,
    isOpen: state.isOpen,
    isInWorldApp: isInWorldApp$1
  };
}
function useIDKitRequest(config) {
  return useIDKitFlow(() => {
    const builder = IDKit.request({
      app_id: config.app_id,
      action: config.action,
      rp_context: config.rp_context,
      action_description: config.action_description,
      bridge_url: config.bridge_url,
      return_to: config.return_to,
      allow_legacy_proofs: config.allow_legacy_proofs,
      override_connect_base_url: config.override_connect_base_url,
      environment: config.environment
    });
    if ("constraints" in config && config.constraints) {
      return builder.constraints(config.constraints);
    }
    return builder.preset(config.preset);
  }, config);
}
var SESSION_ID_PATTERN2 = /^session_[0-9a-fA-F]{128}$/;
function assertSessionId(sessionId) {
  if (sessionId === void 0) {
    return void 0;
  }
  if (sessionId.trim().length === 0 || !SESSION_ID_PATTERN2.test(sessionId)) {
    throw IDKitErrorCodes.MalformedRequest;
  }
  return sessionId;
}
function useIDKitSession(config) {
  return useIDKitFlow(() => {
    const existingSessionId = assertSessionId(config.existing_session_id);
    const builder = existingSessionId ? IDKit.proveSession(existingSessionId, {
      app_id: config.app_id,
      rp_context: config.rp_context,
      action_description: config.action_description,
      bridge_url: config.bridge_url,
      override_connect_base_url: config.override_connect_base_url,
      return_to: config.return_to,
      environment: config.environment
    }) : IDKit.createSession({
      app_id: config.app_id,
      rp_context: config.rp_context,
      action_description: config.action_description,
      bridge_url: config.bridge_url,
      override_connect_base_url: config.override_connect_base_url,
      return_to: config.return_to,
      environment: config.environment
    });
    return builder.constraints(config.constraints);
  }, config);
}
var WIDGET_STYLES = `
@font-face {
  font-family: 'TWK Lausanne';
  src: url('https://world-id-assets.com/fonts/TWKLausanne-200.woff2') format('woff2');
  font-weight: 200;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'TWK Lausanne';
  src: url('https://world-id-assets.com/fonts/TWKLausanne-300.woff2') format('woff2');
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'TWK Lausanne';
  src: url('https://world-id-assets.com/fonts/TWKLausanne-400.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'TWK Lausanne';
  src: url('https://world-id-assets.com/fonts/TWKLausanne-500.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'TWK Lausanne';
  src: url('https://world-id-assets.com/fonts/TWKLausanne-600.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

/* CSS Custom Properties */
:host {
  --idkit-font: 'TWK Lausanne', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  --idkit-bg: #ffffff;
  --idkit-text: #0d151d;
  --idkit-text-muted: #657080;
  --idkit-text-secondary: #9eafc0;
  --idkit-border: #EBECEF;
  --idkit-border-light: #f1f5f8;
  --idkit-surface: #f8fafc;
  --idkit-success: #00C230;
  --idkit-error: #9BA3AE;
  --idkit-warning: #FFAE00;
  --idkit-btn-bg: #0d151d;
  --idkit-btn-text: #ffffff;
}
:host(.dark) {
  --idkit-bg: #0d151d;
  --idkit-text: #ffffff;
  --idkit-text-muted: #9eafc0;
  --idkit-text-secondary: #657080;
  --idkit-border: rgba(235, 236, 239, 0.15);
  --idkit-border-light: rgba(241, 245, 248, 0.1);
  --idkit-surface: rgba(255, 255, 255, 0.05);
  --idkit-btn-bg: #ffffff;
  --idkit-btn-text: #0d151d;
}

/* Animations */
@keyframes idkit-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes idkit-scale-in {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes idkit-slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
@keyframes idkit-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes idkit-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Backdrop */
.idkit-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2147483646;
  padding: 16px;
  animation: idkit-fade-in 0.2s ease-out;
}

/* Modal */
.idkit-modal {
  position: relative;
  width: 100%;
  max-width: 448px;
  min-height: 35rem;
  background: var(--idkit-bg);
  border-radius: 24px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.28), 0 0 0 1px rgba(0, 0, 0, 0.04);
  font-family: var(--idkit-font);
  color: var(--idkit-text);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: idkit-scale-in 0.25s ease-out;
}

/* Close button */
.idkit-close {
  position: absolute;
  top: 24px;
  right: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1.2px solid var(--idkit-border);
  border-radius: 50%;
  background: transparent;
  color: var(--idkit-text);
  cursor: pointer;
  padding: 0;
  z-index: 1;
  transition: background 0.15s ease;
}
.idkit-close:hover {
  background: var(--idkit-surface);
}
.idkit-close svg {
  width: 16px;
  height: 16px;
}

/* Content area */
.idkit-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 24px 24px;
  text-align: center;
}

/* Footer */
.idkit-footer {
  border-top: 1px solid #F5F5F7;
  padding: 28px 32px;
  text-align: center;
}
:host(.dark) .idkit-footer {
  border-top-color: rgba(245, 245, 247, 0.15);
}
.idkit-footer a {
  color: var(--idkit-text-muted);
  font-size: 14px;
  text-decoration: none;
  transition: color 0.15s ease;
}
.idkit-footer a:hover {
  color: var(--idkit-text);
}

/* World ID State */
.idkit-worldid-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 1.2px solid var(--idkit-border);
  margin-bottom: 16px;
}
.idkit-worldid-icon svg {
  width: 32px;
  height: 32px;
  color: var(--idkit-text);
}

.idkit-heading {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  line-height: 1.2;
  color: var(--idkit-text);
}

.idkit-subtext {
  margin: 12px 0 0;
  font-size: 16px;
  line-height: 1.4;
  color: var(--idkit-text-muted);
}

/* QR Container */
.idkit-qr-container {
  position: relative;
  width: 100%;
  margin-top: 40px;
}

.idkit-qr-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  z-index: 2;
}

.idkit-qr-blur {
  transition: filter 0.5s ease-in-out, opacity 0.5s ease-in-out;
}
.idkit-qr-blur.blurred {
  filter: blur(16px);
  opacity: 0.4;
}

.idkit-qr-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  border: 1px solid var(--idkit-border-light);
  padding: 12px;
}

.idkit-qr-inner {
  color: var(--idkit-text);
}

/* QR Code SVG colors for finder patterns */
.idkit-qr-inner .qr-finder-dark { color: #000000; }
.idkit-qr-inner .qr-finder-light { color: #ffffff; }
:host(.dark) .idkit-qr-inner .qr-finder-dark { color: #000000; }
:host(.dark) .idkit-qr-inner .qr-finder-light { color: #ffffff; }
.idkit-qr-inner .qr-dot { color: #000000; }
:host(.dark) .idkit-qr-inner .qr-dot { color: #ffffff; }

/* QR Placeholder */
.idkit-qr-placeholder {
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.idkit-qr-placeholder svg {
  width: 200px;
  height: 200px;
  animation: idkit-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Copy toast \u2014 absolutely positioned so it never shifts layout */
.idkit-copy-toast {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px;
  opacity: 0;
  transition: opacity 0.25s ease-in-out;
  pointer-events: none;
  white-space: nowrap;
}
.idkit-copy-toast.visible {
  opacity: 1;
  transition: opacity 0.2s ease-in-out 0.05s;
}
.idkit-copy-toast > span {
  display: inline-block;
  border-radius: 8px;
  border: 1px solid var(--idkit-border-light);
  padding: 4px 8px;
  font-size: 14px;
  color: var(--idkit-text-secondary);
}

/* Simulator callout (staging only) */
.idkit-simulator-callout {
  margin: 12px 0 0;
  font-size: 14px;
  color: var(--idkit-text-secondary);
  text-align: center;
}
.idkit-simulator-callout a {
  color: var(--idkit-text-muted);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.idkit-simulator-callout a:hover {
  color: var(--idkit-text);
}

/* Mobile deep-link button */
.idkit-deeplink-btn {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 8px;
  border-radius: 16px;
  border: 1px solid transparent;
  background: var(--idkit-btn-bg);
  color: var(--idkit-btn-text);
  padding: 16px;
  font-family: var(--idkit-font);
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.idkit-deeplink-btn svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}
.idkit-deeplink-btn span {
  flex: 1;
  text-align: center;
}

/* Loading spinner */
.idkit-spinner {
  animation: idkit-spin 1s linear infinite;
}
.idkit-spinner svg {
  display: block;
  width: 24px;
  height: 24px;
}

.idkit-connecting-text {
  text-align: center;
}
.idkit-connecting-text p:first-child {
  font-weight: 500;
  color: var(--idkit-text-muted);
  margin: 0;
}
.idkit-connecting-text p:last-child {
  font-size: 14px;
  font-weight: 300;
  color: var(--idkit-text-muted);
  margin: 4px 0 0;
}

/* Success State */
.idkit-success-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}
.idkit-success-icon svg {
  width: 96px;
  height: 96px;
}

/* Error State */
.idkit-error-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}
.idkit-error-icon svg {
  width: 96px;
  height: 96px;
}

.idkit-error-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--idkit-text);
}

.idkit-error-message {
  margin: 8px auto 0;
  max-width: 224px;
  font-size: 16px;
  color: var(--idkit-text-muted);
  line-height: 1.4;
}

/* Retry button */
.idkit-retry-btn {
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  border: 1.2px solid var(--idkit-border);
  background: transparent;
  padding: 12px 32px;
  font-family: var(--idkit-font);
  font-size: 16px;
  font-weight: 600;
  color: var(--idkit-text);
  cursor: pointer;
  transition: box-shadow 0.3s ease;
  margin-top: 32px;
}
.idkit-retry-btn:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Success subtext: old SDK used text-lg (18px) */
.idkit-success-icon ~ .idkit-subtext {
  font-size: 18px;
  line-height: 1.56;
}

/* Responsive: mobile full-screen bottom-anchored */
@media (max-width: 1024px) {
  .idkit-backdrop {
    align-items: flex-end;
    padding: 0;
  }
  .idkit-modal {
    max-width: 100%;
    min-height: auto;
    max-height: 95vh;
    border-radius: 24px 24px 0 0;
    animation: idkit-slide-up 0.3s ease-out;
  }

  /* Hide desktop QR on mobile */
  .idkit-desktop-only {
    display: none;
  }
  .idkit-mobile-only {
    display: block;
  }
}

@media (min-width: 1025px) {
  .idkit-mobile-only {
    display: none;
  }
  .idkit-desktop-only {
    display: block;
    position: relative;
  }
  .idkit-subtext {
    margin-top: 8px;
  }
}
`;
function ShadowHost({ children }) {
  const [root, setRoot] = useState(null);
  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    const host = document.createElement("div");
    host.setAttribute("data-idkit-shadow-host", "true");
    document.body.appendChild(host);
    const shadowRoot = host.attachShadow({ mode: "open" });
    setRoot(shadowRoot);
    return () => {
      host.remove();
      setRoot(null);
    };
  }, []);
  if (!root) {
    return null;
  }
  return (0, import_react_dom.createPortal)(children, root);
}
function XMarkIcon(props) {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      viewBox: "0 0 24 24",
      ...props,
      children: /* @__PURE__ */ jsx(
        "path",
        {
          strokeWidth: "1.5",
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          d: "m16.243 7.758-8.485 8.485m8.485 0L7.758 7.758"
        }
      )
    }
  );
}
var en = {
  "All set!": "All set!",
  "Your World ID is now connected": "Your World ID is now connected",
  "Already verified": "Already verified",
  "You've already verified for this action.": "You've already verified for this action.",
  "Something went wrong": "Something went wrong",
  "Request cancelled": "Request cancelled",
  "You've cancelled the request in World App.": "You've cancelled the request in World App.",
  "Verification unavailable": "Verification unavailable",
  "This verification request couldn't be completed. Please contact the website owner.": "This verification request couldn't be completed. Please contact the website owner.",
  "Connection lost": "Connection lost",
  "Please check your connection and try again.": "Please check your connection and try again.",
  "Verification declined": "Verification declined",
  "Failed to verify your credential proof. Please contact the website owner.": "Failed to verify your credential proof. Please contact the website owner.",
  "We couldn't complete your request. Please try again.": "We couldn't complete your request. Please try again.",
  "Try Again": "Try Again",
  Close: "Close",
  "Open World App": "Open World App",
  "QR Code copied": "QR Code copied",
  "Connect your World ID": "Connect your World ID",
  "Use phone camera to scan the QR code": "Use phone camera to scan the QR code",
  "Connecting...": "Connecting...",
  "Please continue in app": "Please continue in app",
  "Transmitting verification to host app. Please wait...": "Transmitting verification to host app. Please wait...",
  "You will be redirected to the app, please return to this page once you're done": "You will be redirected to the app, please return to this page once you're done",
  "Terms & Privacy": "Terms & Privacy"
};
var es = {
  "All set!": "\xA1Todo listo!",
  "Your World ID is now connected": "Tu World ID ahora est\xE1 conectado",
  "Already verified": "Ya verificado",
  "You've already verified for this action.": "Ya has verificado para esta accion.",
  "Something went wrong": "Algo sali\xF3 mal",
  "Request cancelled": "Solicitud cancelada",
  "You've cancelled the request in World App.": "Has cancelado la solicitud en World App.",
  "Verification unavailable": "Verificacion no disponible",
  "This verification request couldn't be completed. Please contact the website owner.": "No se pudo completar esta solicitud de verificacion. Por favor contacta al propietario del sitio web.",
  "Connection lost": "Conexion perdida",
  "Please check your connection and try again.": "Por favor verifica tu conexion e intenta de nuevo.",
  "Verification declined": "Verificaci\xF3n rechazada",
  "Failed to verify your credential proof. Please contact the website owner.": "No se pudo verificar tu prueba de credencial. Por favor contacta al propietario del sitio web.",
  "We couldn't complete your request. Please try again.": "No pudimos completar tu solicitud. Por favor intenta de nuevo.",
  "Try Again": "Intentar de nuevo",
  Close: "Cerrar",
  "Open World App": "Abrir World App",
  "QR Code copied": "C\xF3digo QR copiado",
  "Connect your World ID": "Conecta tu World ID",
  "Use phone camera to scan the QR code": "Usa la c\xE1mara del tel\xE9fono para escanear el c\xF3digo QR",
  "Connecting...": "Conectando...",
  "Please continue in app": "Por favor contin\xFAa en la aplicaci\xF3n",
  "Transmitting verification to host app. Please wait...": "Enviando verificaci\xF3n a la aplicaci\xF3n anfitriona. Por favor espera...",
  "You will be redirected to the app, please return to this page once you're done": "Ser\xE1s redirigido a la aplicaci\xF3n, por favor regresa a esta p\xE1gina una vez que hayas terminado",
  "Terms & Privacy": "T\xE9rminos y privacidad"
};
var th = {
  "All set!": "\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22!",
  "Your World ID is now connected": "World ID \u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D\u0E41\u0E25\u0E49\u0E27",
  "Already verified": "\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E41\u0E25\u0E49\u0E27",
  "You've already verified for this action.": "\u0E04\u0E38\u0E13\u0E44\u0E14\u0E49\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E01\u0E32\u0E23\u0E14\u0E33\u0E40\u0E19\u0E34\u0E19\u0E01\u0E32\u0E23\u0E19\u0E35\u0E49\u0E41\u0E25\u0E49\u0E27",
  "Something went wrong": "\u0E40\u0E01\u0E34\u0E14\u0E02\u0E49\u0E2D\u0E1C\u0E34\u0E14\u0E1E\u0E25\u0E32\u0E14",
  "Request cancelled": "\u0E04\u0E33\u0E02\u0E2D\u0E16\u0E39\u0E01\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01",
  "You've cancelled the request in World App.": "\u0E04\u0E38\u0E13\u0E44\u0E14\u0E49\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01\u0E04\u0E33\u0E02\u0E2D\u0E43\u0E19 World App",
  "Verification unavailable": "\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E44\u0E14\u0E49",
  "This verification request couldn't be completed. Please contact the website owner.": "\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E14\u0E33\u0E40\u0E19\u0E34\u0E19\u0E01\u0E32\u0E23\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E19\u0E35\u0E49\u0E44\u0E14\u0E49 \u0E42\u0E1B\u0E23\u0E14\u0E15\u0E34\u0E14\u0E15\u0E48\u0E2D\u0E40\u0E08\u0E49\u0E32\u0E02\u0E2D\u0E07\u0E40\u0E27\u0E47\u0E1A\u0E44\u0E0B\u0E15\u0E4C",
  "Connection lost": "\u0E01\u0E32\u0E23\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D\u0E02\u0E32\u0E14\u0E2B\u0E32\u0E22",
  "Please check your connection and try again.": "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E01\u0E32\u0E23\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D\u0E41\u0E25\u0E49\u0E27\u0E25\u0E2D\u0E07\u0E2D\u0E35\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07",
  "Verification declined": "\u0E01\u0E32\u0E23\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E16\u0E39\u0E01\u0E1B\u0E0F\u0E34\u0E40\u0E2A\u0E18",
  "Failed to verify your credential proof. Please contact the website owner.": "\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E2B\u0E25\u0E31\u0E01\u0E10\u0E32\u0E19\u0E02\u0E2D\u0E07 Credential \u0E44\u0E14\u0E49 \u0E42\u0E1B\u0E23\u0E14\u0E15\u0E34\u0E14\u0E15\u0E48\u0E2D\u0E40\u0E08\u0E49\u0E32\u0E02\u0E2D\u0E07\u0E40\u0E27\u0E47\u0E1A\u0E44\u0E0B\u0E15\u0E4C",
  "We couldn't complete your request. Please try again.": "\u0E40\u0E23\u0E32\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E14\u0E33\u0E40\u0E19\u0E34\u0E19\u0E01\u0E32\u0E23\u0E15\u0E32\u0E21\u0E04\u0E33\u0E02\u0E2D\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13\u0E44\u0E14\u0E49 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E25\u0E2D\u0E07\u0E2D\u0E35\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07",
  "Try Again": "\u0E25\u0E2D\u0E07\u0E2D\u0E35\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07",
  Close: "\u0E1B\u0E34\u0E14",
  "Open World App": "\u0E40\u0E1B\u0E34\u0E14 World App",
  "QR Code copied": "\u0E04\u0E31\u0E14\u0E25\u0E2D\u0E01 QR Code \u0E41\u0E25\u0E49\u0E27",
  "Connect your World ID": "\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D World ID \u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13",
  "Use phone camera to scan the QR code": "\u0E43\u0E0A\u0E49\u0E01\u0E25\u0E49\u0E2D\u0E07\u0E42\u0E17\u0E23\u0E28\u0E31\u0E1E\u0E17\u0E4C\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E2A\u0E41\u0E01\u0E19 QR code",
  "Connecting...": "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D...",
  "Please continue in app": "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E14\u0E33\u0E40\u0E19\u0E34\u0E19\u0E01\u0E32\u0E23\u0E15\u0E48\u0E2D\u0E43\u0E19\u0E41\u0E2D\u0E1B",
  "Transmitting verification to host app. Please wait...": "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E2A\u0E48\u0E07\u0E01\u0E32\u0E23\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E44\u0E1B\u0E22\u0E31\u0E07\u0E41\u0E2D\u0E1B\u0E42\u0E2E\u0E2A\u0E15\u0E4C \u0E01\u0E23\u0E38\u0E13\u0E32\u0E23\u0E2D\u0E2A\u0E31\u0E01\u0E04\u0E23\u0E39\u0E48...",
  "You will be redirected to the app, please return to this page once you're done": "\u0E04\u0E38\u0E13\u0E08\u0E30\u0E16\u0E39\u0E01\u0E19\u0E33\u0E44\u0E1B\u0E22\u0E31\u0E07\u0E41\u0E2D\u0E1B \u0E01\u0E23\u0E38\u0E13\u0E32\u0E01\u0E25\u0E31\u0E1A\u0E21\u0E32\u0E17\u0E35\u0E48\u0E2B\u0E19\u0E49\u0E32\u0E19\u0E35\u0E49\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E40\u0E2A\u0E23\u0E47\u0E08\u0E41\u0E25\u0E49\u0E27",
  "Terms & Privacy": "\u0E02\u0E49\u0E2D\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E41\u0E25\u0E30\u0E04\u0E27\u0E32\u0E21\u0E40\u0E1B\u0E47\u0E19\u0E2A\u0E48\u0E27\u0E19\u0E15\u0E31\u0E27"
};
var translations = {
  en,
  es,
  th
};
var currentConfig = {};
var setLocalizationConfig = (config) => {
  currentConfig = config;
};
var getLocalizationConfig = () => currentConfig;
var detectBrowserLanguage = () => {
  if (typeof navigator === "undefined") return void 0;
  for (const lang of navigator.languages) {
    const [language] = lang.split("-");
    const normalizedLang = language.toLowerCase();
    if (normalizedLang in translations) {
      return normalizedLang;
    }
  }
  return void 0;
};
var getCurrentLanguage = () => {
  const config = getLocalizationConfig();
  if (config.language && config.language in translations) {
    return config.language;
  }
  const browserLang = detectBrowserLanguage();
  if (browserLang) {
    return browserLang;
  }
  return "en";
};
var getTranslations = () => {
  const currentLang = getCurrentLanguage();
  return translations[currentLang];
};
var getLang = () => {
  return getTranslations();
};
var replaceParams = (str, params) => {
  if (!params) return str;
  let result = str;
  for (const [key, value] of Object.entries(params)) {
    result = result.replace(`:${key}`, value);
  }
  return result;
};
function __(str, ...args) {
  const [params] = args;
  if (typeof navigator === "undefined" && typeof window === "undefined") {
    return replaceParams(str, params);
  }
  const translated = getLang()?.[str] ?? str;
  return replaceParams(translated, params);
}
function ModalContent({
  onOpenChange,
  children
}) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("style", { children: WIDGET_STYLES }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "idkit-backdrop",
        role: "presentation",
        onClick: () => onOpenChange(false),
        children: /* @__PURE__ */ jsxs(
          "section",
          {
            className: "idkit-modal",
            role: "dialog",
            "aria-modal": "true",
            onClick: (event) => event.stopPropagation(),
            children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "idkit-close",
                  onClick: () => onOpenChange(false),
                  "aria-label": "Close",
                  children: /* @__PURE__ */ jsx(XMarkIcon, {})
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "idkit-content", children }),
              /* @__PURE__ */ jsx("footer", { className: "idkit-footer", children: /* @__PURE__ */ jsx(
                "a",
                {
                  href: "https://developer.world.org/privacy-statement",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  children: __("Terms & Privacy")
                }
              ) })
            ]
          }
        )
      }
    )
  ] });
}
function IDKitModal({
  open,
  onOpenChange,
  children
}) {
  useEffect(() => {
    if (!open || typeof document === "undefined") {
      return;
    }
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onOpenChange, open]);
  if (!open || typeof document === "undefined") {
    return null;
  }
  const content = /* @__PURE__ */ jsx(ModalContent, { onOpenChange, children });
  return /* @__PURE__ */ jsx(ShadowHost, { children: content });
}
function useMedia() {
  const getInitialState = () => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(max-width: 1024px)").matches ? "mobile" : "desktop";
    }
    return "desktop";
  };
  const [media, setMedia] = useState(getInitialState);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1024px)");
    const handleChange = (e) => setMedia(e.matches ? "mobile" : "desktop");
    handleChange(mql);
    mql.addEventListener("change", handleChange);
    return () => {
      mql.removeEventListener("change", handleChange);
    };
  }, []);
  return media;
}
function WorldcoinIcon(props) {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "32",
      height: "32",
      viewBox: "0 0 32 32",
      fill: "none",
      ...props,
      children: /* @__PURE__ */ jsx(
        "path",
        {
          d: "M30.7367 9.77239C29.9301 7.86586 28.7772 6.15721 27.3084 4.68831C25.8397 3.21941 24.1275 2.06636 22.225 1.2596C20.2502 0.422405 18.1574 0 15.9962 0C13.8388 0 11.7422 0.422405 9.76742 1.2596C7.86112 2.06636 6.15268 3.21941 4.68395 4.68831C3.21522 6.15721 2.06231 7.86966 1.25565 9.77239C0.422354 11.7436 0 13.8404 0 15.9981C0 18.1558 0.422354 20.2526 1.25945 22.2276C2.06611 24.1341 3.21903 25.8428 4.68775 27.3117C6.15648 28.7806 7.86873 29.9336 9.77122 30.7404C11.746 31.5738 13.8388 32 16 32C18.1574 32 20.254 31.5776 22.2288 30.7404C24.1351 29.9336 25.8435 28.7806 27.3122 27.3117C28.781 25.8428 29.9339 24.1303 30.7405 22.2276C31.5738 20.2526 32 18.1596 32 15.9981C31.9962 13.8404 31.57 11.7436 30.7367 9.77239ZM10.6844 14.4949C11.3503 11.9377 13.679 10.0464 16.4452 10.0464H27.552C28.2673 11.4278 28.7239 12.9309 28.9027 14.4949H10.6844ZM28.9027 17.5012C28.7239 19.0653 28.2635 20.5684 27.552 21.9498H16.4452C13.6828 21.9498 11.3541 20.0585 10.6844 17.5012H28.9027ZM6.81094 6.81175C9.26516 4.35724 12.526 3.0063 15.9962 3.0063C19.4663 3.0063 22.7272 4.35724 25.1815 6.81175C25.2576 6.88786 25.3298 6.96397 25.4021 7.04008H16.4452C14.0518 7.04008 11.8031 7.97241 10.1099 9.66583C8.77812 10.9977 7.91819 12.6759 7.60999 14.4988H3.09346C3.42449 11.5952 4.71439 8.90855 6.81094 6.81175ZM15.9962 28.9937C12.526 28.9937 9.26516 27.6428 6.81094 25.1883C4.71439 23.0915 3.42449 20.4048 3.09346 17.5051H7.60999C7.91439 19.3279 8.77812 21.0061 10.1099 22.338C11.8031 24.0314 14.0518 24.9637 16.4452 24.9637H25.4059C25.3337 25.0398 25.2576 25.1159 25.1853 25.1921C22.731 27.639 19.4663 28.9937 15.9962 28.9937Z",
          fill: "currentColor"
        }
      )
    }
  );
}
function LoadingIcon(props) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      viewBox: "0 0 24 24",
      ...props,
      children: [
        /* @__PURE__ */ jsx(
          "circle",
          {
            cx: "12",
            cy: "12",
            r: "10.75",
            stroke: "#191C20",
            strokeOpacity: ".16",
            strokeWidth: "2.5"
          }
        ),
        /* @__PURE__ */ jsx(
          "path",
          {
            fill: "#191C20",
            d: "M17.28 2.633c.338-.6.127-1.368-.505-1.642A12 12 0 0 0 7.459.892c-.638.261-.864 1.024-.539 1.632.326.607 1.08.827 1.725.584a9.504 9.504 0 0 1 6.897.073c.64.257 1.399.053 1.737-.548Z"
          }
        )
      ]
    }
  );
}
var generateMatrix = (data) => {
  const arr = import_qrcode.default.create(data, { errorCorrectionLevel: "M" }).modules.data;
  const sqrt = Math.sqrt(arr.length);
  return arr.reduce(
    (rows, key, index) => {
      if (index % sqrt === 0) rows.push([key]);
      else rows[rows.length - 1].push(key);
      return rows;
    },
    []
  );
};
function QRCodeInner({ data, size = 200 }) {
  const dots = useMemo(() => {
    const elements = [];
    const matrix = generateMatrix(data);
    const cellSize = size / matrix.length;
    const qrList = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 }
    ];
    qrList.forEach(({ x, y }) => {
      const x1 = (matrix.length - 7) * cellSize * x;
      const y1 = (matrix.length - 7) * cellSize * y;
      for (let i = 0; i < 3; i++) {
        elements.push(
          /* @__PURE__ */ jsx(
            "rect",
            {
              fill: "currentColor",
              x: x1 + cellSize * i,
              y: y1 + cellSize * i,
              width: cellSize * (7 - i * 2),
              height: cellSize * (7 - i * 2),
              rx: (i - 2) * -5,
              ry: (i - 2) * -5,
              className: i % 3 === 0 ? "qr-finder-dark" : i % 3 === 1 ? "qr-finder-light" : "qr-finder-dark"
            },
            `${i}-${x}-${y}`
          )
        );
      }
    });
    matrix.forEach((row, i) => {
      row.forEach((_, j) => {
        if (!matrix[i][j]) return;
        if (i < 7 && j < 7 || i > matrix.length - 8 && j < 7 || i < 7 && j > matrix.length - 8)
          return;
        elements.push(
          /* @__PURE__ */ jsx(
            "circle",
            {
              fill: "currentColor",
              r: cellSize / 2.2,
              cx: i * cellSize + cellSize / 2,
              cy: j * cellSize + cellSize / 2,
              className: "qr-dot"
            },
            `circle-${i}-${j}`
          )
        );
      });
    });
    return elements;
  }, [size, data]);
  return /* @__PURE__ */ jsx("svg", { height: size, width: size, "data-test-id": "qr-code", children: dots });
}
var QRCode = memo(QRCodeInner);
function QRPlaceholderIcon(props) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      viewBox: "0 0 200 200",
      ...props,
      children: [
        /* @__PURE__ */ jsx(
          "path",
          {
            fill: "#EBECEF",
            fillRule: "evenodd",
            d: "M12.1 0C5.417 0 0 5.417 0 12.1v18.505c0 6.682 5.417 12.1 12.1 12.1h18.505c6.682 0 12.1-5.418 12.1-12.1V12.1c0-6.683-5.418-12.1-12.1-12.1H12.1Zm18.505 11.388H12.1a.712.712 0 0 0-.712.712v18.505c0 .393.319.712.712.712h18.505a.712.712 0 0 0 .712-.712V12.1a.712.712 0 0 0-.712-.712Z",
            clipRule: "evenodd"
          }
        ),
        /* @__PURE__ */ jsx(
          "path",
          {
            fill: "#EBECEF",
            d: "M197.026 200c.789 0 1.545-.309 2.103-.86.558-.55.871-1.297.871-2.076v-17.616c0-.778-.313-1.525-.871-2.076a2.996 2.996 0 0 0-2.103-.86h-5.948c-.789 0-1.545.31-2.103.86a2.918 2.918 0 0 0-.871 2.076v8.808h-11.897v-11.744h-11.896v-23.487h11.896v8.808c0 .778.314 1.525.872 2.076.557.55 1.314.86 2.102.86h5.949c.788 0 1.545-.31 2.103-.86a2.922 2.922 0 0 0 .871-2.076v-8.808h8.922c.789 0 1.545-.309 2.103-.86a2.916 2.916 0 0 0 .871-2.076v-5.872c0-.779-.313-1.525-.871-2.076a2.992 2.992 0 0 0-2.103-.86h-29.741c-.789 0-1.545.309-2.103.86a2.916 2.916 0 0 0-.871 2.076v8.808h-23.792v-11.744h8.922c.789 0 1.545-.309 2.103-.86.558-.55.871-1.297.871-2.076v-5.872c0-.778-.313-1.525-.871-2.076a2.996 2.996 0 0 0-2.103-.86h-5.948c-.789 0-1.546.31-2.103.86a2.918 2.918 0 0 0-.871 2.076v8.808H119.7c-.789 0-1.545.309-2.103.86a2.916 2.916 0 0 0-.871 2.076v5.872c0 .779.313 1.525.871 2.076.558.551 1.314.86 2.103.86h20.819v8.808c0 .778.313 1.525.871 2.076.557.55 1.314.86 2.103.86h8.922v8.808c0 .778.313 1.525.871 2.076.558.55 1.314.859 2.103.859h8.922v11.744h-20.818c-.789 0-1.546.31-2.103.86a2.916 2.916 0 0 0-.871 2.076v5.872c0 .779.313 1.526.871 2.076a2.99 2.99 0 0 0 2.103.86h17.844c.789 0 1.545-.309 2.103-.86.558-.55.871-1.297.871-2.076v-8.808h11.896v8.808c0 .779.314 1.526.872 2.076a2.99 2.99 0 0 0 2.102.86h17.845Z"
          }
        ),
        /* @__PURE__ */ jsx(
          "path",
          {
            fill: "#EBECEF",
            fillRule: "evenodd",
            d: "M157.295 12.1c0-6.683 5.418-12.1 12.1-12.1H187.9c6.683 0 12.1 5.417 12.1 12.1v18.505c0 6.682-5.417 12.1-12.1 12.1h-18.505c-6.682 0-12.1-5.418-12.1-12.1V12.1Zm12.1-.712H187.9c.393 0 .712.319.712.712v18.505a.712.712 0 0 1-.712.712h-18.505a.712.712 0 0 1-.712-.712V12.1c0-.393.319-.712.712-.712ZM12.1 157.295c-6.683 0-12.1 5.418-12.1 12.1V187.9c0 6.683 5.417 12.1 12.1 12.1h18.505c6.682 0 12.1-5.417 12.1-12.1v-18.505c0-6.682-5.418-12.1-12.1-12.1H12.1Zm19.217 12.1a.712.712 0 0 0-.712-.712H12.1a.712.712 0 0 0-.712.712V187.9c0 .393.319.712.712.712h18.505a.712.712 0 0 0 .712-.712v-18.505Z",
            clipRule: "evenodd"
          }
        ),
        /* @__PURE__ */ jsx(
          "path",
          {
            fill: "#EBECEF",
            d: "M6.05 89.68A6.05 6.05 0 0 0 0 95.73v9.252a6.05 6.05 0 0 0 6.05 6.05h9.253a6.05 6.05 0 0 0 6.05-6.05V95.73c0-.678-.112-1.33-.318-1.94.445.105.908.16 1.385.16h27.758a6.05 6.05 0 0 0 6.05-6.05v-9.252a6.05 6.05 0 0 0-6.05-6.05H22.42a6.05 6.05 0 0 0-6.05 6.05V87.9c0 .678.112 1.33.317 1.939a6.065 6.065 0 0 0-1.385-.16H6.05Zm102.135-40.926a6.05 6.05 0 0 1 6.05-6.05h9.253a6.05 6.05 0 0 1 6.049 6.05v9.253a6.05 6.05 0 0 1-6.049 6.05h-9.253a6.05 6.05 0 0 1-6.05-6.05v-9.253ZM67.616 184.698a6.05 6.05 0 0 1 6.05-6.05h9.252c.678 0 1.33.111 1.939.317a6.064 6.064 0 0 1-.16-1.385v-9.253a6.05 6.05 0 0 1 6.05-6.049H100a6.05 6.05 0 0 1 6.05 6.049v9.253a6.05 6.05 0 0 1-6.05 6.05h-9.253c-.678 0-1.33-.112-1.938-.317.104.444.159.908.159 1.385v9.252a6.05 6.05 0 0 1-6.05 6.05h-9.253a6.05 6.05 0 0 1-6.05-6.05v-9.252Zm78.291-120.285a6.05 6.05 0 0 1 6.05-6.05h41.993a6.05 6.05 0 0 1 6.05 6.05v9.252a6.05 6.05 0 0 1-6.05 6.05h-41.993a6.05 6.05 0 0 1-6.05-6.05v-9.252ZM95.018 0a6.05 6.05 0 0 0-6.05 6.05v17.082a6.05 6.05 0 0 0 6.05 6.05h9.252a6.05 6.05 0 0 0 6.05-6.05V6.05A6.05 6.05 0 0 0 104.27 0h-9.252Z"
          }
        ),
        /* @__PURE__ */ jsx(
          "path",
          {
            fill: "url(#idkit_qr_placeholder_gradient)",
            fillRule: "evenodd",
            d: "M12.1 0C5.417 0 0 5.417 0 12.1v18.505c0 6.682 5.417 12.1 12.1 12.1h18.505c6.682 0 12.1-5.418 12.1-12.1V12.1c0-6.683-5.418-12.1-12.1-12.1H12.1Zm18.505 11.388H12.1a.712.712 0 0 0-.712.712v18.505c0 .393.319.712.712.712h18.505a.712.712 0 0 0 .712-.712V12.1a.712.712 0 0 0-.712-.712Z",
            clipRule: "evenodd"
          }
        ),
        /* @__PURE__ */ jsx(
          "path",
          {
            fill: "url(#idkit_qr_placeholder_gradient)",
            d: "M197.026 200c.789 0 1.545-.309 2.103-.86.558-.55.871-1.297.871-2.076v-17.616c0-.778-.313-1.525-.871-2.076a2.996 2.996 0 0 0-2.103-.86h-5.948c-.789 0-1.545.31-2.103.86a2.918 2.918 0 0 0-.871 2.076v8.808h-11.897v-11.744h-11.896v-23.487h11.896v8.808c0 .778.314 1.525.872 2.076.557.55 1.314.86 2.102.86h5.949c.788 0 1.545-.31 2.103-.86a2.922 2.922 0 0 0 .871-2.076v-8.808h8.922c.789 0 1.545-.309 2.103-.86a2.916 2.916 0 0 0 .871-2.076v-5.872c0-.779-.313-1.525-.871-2.076a2.992 2.992 0 0 0-2.103-.86h-29.741c-.789 0-1.545.309-2.103.86a2.916 2.916 0 0 0-.871 2.076v8.808h-23.792v-11.744h8.922c.789 0 1.545-.309 2.103-.86.558-.55.871-1.297.871-2.076v-5.872c0-.778-.313-1.525-.871-2.076a2.996 2.996 0 0 0-2.103-.86h-5.948c-.789 0-1.546.31-2.103.86a2.918 2.918 0 0 0-.871 2.076v8.808H119.7c-.789 0-1.545.309-2.103.86a2.916 2.916 0 0 0-.871 2.076v5.872c0 .779.313 1.525.871 2.076.558.551 1.314.86 2.103.86h20.819v8.808c0 .778.313 1.525.871 2.076.557.55 1.314.86 2.103.86h8.922v8.808c0 .778.313 1.525.871 2.076.558.55 1.314.859 2.103.859h8.922v11.744h-20.818c-.789 0-1.546.31-2.103.86a2.916 2.916 0 0 0-.871 2.076v5.872c0 .779.313 1.526.871 2.076a2.99 2.99 0 0 0 2.103.86h17.844c.789 0 1.545-.309 2.103-.86.558-.55.871-1.297.871-2.076v-8.808h11.896v8.808c0 .779.314 1.526.872 2.076a2.99 2.99 0 0 0 2.102.86h17.845Z"
          }
        ),
        /* @__PURE__ */ jsx(
          "path",
          {
            fill: "url(#idkit_qr_placeholder_gradient)",
            fillRule: "evenodd",
            d: "M157.295 12.1c0-6.683 5.418-12.1 12.1-12.1H187.9c6.683 0 12.1 5.417 12.1 12.1v18.505c0 6.682-5.417 12.1-12.1 12.1h-18.505c-6.682 0-12.1-5.418-12.1-12.1V12.1Zm12.1-.712H187.9c.393 0 .712.319.712.712v18.505a.712.712 0 0 1-.712.712h-18.505a.712.712 0 0 1-.712-.712V12.1c0-.393.319-.712.712-.712Z",
            clipRule: "evenodd"
          }
        ),
        /* @__PURE__ */ jsx(
          "path",
          {
            fill: "url(#idkit_qr_placeholder_gradient)",
            fillRule: "evenodd",
            d: "M12.1 157.295c-6.683 0-12.1 5.418-12.1 12.1V187.9c0 6.683 5.417 12.1 12.1 12.1h18.505c6.682 0 12.1-5.417 12.1-12.1v-18.505c0-6.682-5.418-12.1-12.1-12.1H12.1Zm19.217 12.1a.712.712 0 0 0-.712-.712H12.1a.712.712 0 0 0-.712.712V187.9c0 .393.319.712.712.712h18.505a.712.712 0 0 0 .712-.712v-18.505Z",
            clipRule: "evenodd"
          }
        ),
        /* @__PURE__ */ jsx(
          "path",
          {
            fill: "url(#idkit_qr_placeholder_gradient)",
            d: "M6.05 89.68A6.05 6.05 0 0 0 0 95.73v9.252a6.05 6.05 0 0 0 6.05 6.05h9.253a6.05 6.05 0 0 0 6.05-6.05V95.73c0-.678-.112-1.33-.318-1.94.445.105.908.16 1.385.16h27.758a6.05 6.05 0 0 0 6.05-6.05v-9.252a6.05 6.05 0 0 0-6.05-6.05H22.42a6.05 6.05 0 0 0-6.05 6.05V87.9c0 .678.112 1.33.317 1.939a6.065 6.065 0 0 0-1.385-.16H6.05Z"
          }
        ),
        /* @__PURE__ */ jsx(
          "path",
          {
            fill: "url(#idkit_qr_placeholder_gradient)",
            d: "M108.185 48.754a6.05 6.05 0 0 1 6.05-6.05h9.253a6.05 6.05 0 0 1 6.049 6.05v9.253a6.05 6.05 0 0 1-6.049 6.05h-9.253a6.05 6.05 0 0 1-6.05-6.05v-9.253Z"
          }
        ),
        /* @__PURE__ */ jsx(
          "path",
          {
            fill: "url(#idkit_qr_placeholder_gradient)",
            d: "M67.616 184.698a6.05 6.05 0 0 1 6.05-6.05h9.252c.678 0 1.33.111 1.939.317a6.064 6.064 0 0 1-.16-1.385v-9.253a6.05 6.05 0 0 1 6.05-6.049H100a6.05 6.05 0 0 1 6.05 6.049v9.253a6.05 6.05 0 0 1-6.05 6.05h-9.253c-.678 0-1.33-.112-1.938-.317.104.444.159.908.159 1.385v9.252a6.05 6.05 0 0 1-6.05 6.05h-9.253a6.05 6.05 0 0 1-6.05-6.05v-9.252Z"
          }
        ),
        /* @__PURE__ */ jsx(
          "path",
          {
            fill: "url(#idkit_qr_placeholder_gradient)",
            d: "M145.907 64.413a6.05 6.05 0 0 1 6.05-6.05h41.993a6.05 6.05 0 0 1 6.05 6.05v9.252a6.05 6.05 0 0 1-6.05 6.05h-41.993a6.05 6.05 0 0 1-6.05-6.05v-9.252Z"
          }
        ),
        /* @__PURE__ */ jsx(
          "path",
          {
            fill: "url(#idkit_qr_placeholder_gradient)",
            d: "M95.018 0a6.05 6.05 0 0 0-6.05 6.05v17.082a6.05 6.05 0 0 0 6.05 6.05h9.252a6.05 6.05 0 0 0 6.05-6.05V6.05A6.05 6.05 0 0 0 104.27 0h-9.252Z"
          }
        ),
        /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs(
          "linearGradient",
          {
            id: "idkit_qr_placeholder_gradient",
            x1: "0",
            x2: "200",
            y1: "0",
            y2: "200",
            gradientUnits: "userSpaceOnUse",
            children: [
              /* @__PURE__ */ jsx("stop", { offset: ".37", stopColor: "#fff", stopOpacity: "0" }),
              /* @__PURE__ */ jsx("stop", { offset: ".5", stopColor: "#fff", stopOpacity: ".85" }),
              /* @__PURE__ */ jsx("stop", { offset: ".63", stopColor: "#fff", stopOpacity: "0" })
            ]
          }
        ) })
      ]
    }
  );
}
function QRState({
  qrData,
  showSimulatorCallout
}) {
  const media = useMedia();
  const [copiedLink, setCopiedLink] = useState(false);
  const copyLink = useCallback(() => {
    if (!qrData) return;
    void navigator.clipboard.writeText(qrData);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2e3);
  }, [qrData]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "idkit-mobile-only", children: /* @__PURE__ */ jsxs("a", { href: qrData ?? void 0, className: "idkit-deeplink-btn", children: [
      /* @__PURE__ */ jsx(WorldcoinIcon, {}),
      /* @__PURE__ */ jsx("span", { children: __("Open World App") })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "idkit-desktop-only", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: `idkit-copy-toast ${copiedLink ? "visible" : "hidden"}`,
          style: {
            textAlign: "center",
            fontSize: "14px",
            color: "var(--idkit-text-secondary)"
          },
          children: /* @__PURE__ */ jsx("span", { children: __("QR Code copied") })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "idkit-qr-wrapper", children: /* @__PURE__ */ jsx("div", { className: "idkit-qr-inner", children: qrData ? /* @__PURE__ */ jsx(
        "div",
        {
          onClick: copyLink,
          onKeyDown: (e) => {
            if (e.key === "Enter") copyLink();
          },
          role: "button",
          tabIndex: 0,
          style: { cursor: "pointer" },
          children: /* @__PURE__ */ jsx(QRCode, { data: qrData, size: media === "mobile" ? 160 : 200 })
        }
      ) : /* @__PURE__ */ jsx("div", { className: "idkit-qr-placeholder", children: /* @__PURE__ */ jsx(QRPlaceholderIcon, {}) }) }) }),
      showSimulatorCallout && qrData && /* @__PURE__ */ jsxs("p", { className: "idkit-simulator-callout", children: [
        "Testing in staging?",
        " ",
        /* @__PURE__ */ jsx(
          "a",
          {
            href: `https://simulator.worldcoin.org?connect_url=${encodeURIComponent(qrData)}`,
            target: "_blank",
            rel: "noopener noreferrer",
            children: "Use the simulator"
          }
        )
      ] })
    ] })
  ] });
}
function WorldIDState({
  connectorURI,
  isAwaitingUserConfirmation,
  showSimulatorCallout
}) {
  const media = useMedia();
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center"
      },
      children: [
        /* @__PURE__ */ jsx("div", { className: "idkit-worldid-icon", children: /* @__PURE__ */ jsx(WorldcoinIcon, {}) }),
        /* @__PURE__ */ jsx("h2", { className: "idkit-heading", children: __("Connect your World ID") }),
        /* @__PURE__ */ jsx("p", { className: "idkit-subtext", children: media === "mobile" ? __(
          "You will be redirected to the app, please return to this page once you're done"
        ) : __("Use phone camera to scan the QR code") }),
        /* @__PURE__ */ jsxs("div", { className: "idkit-qr-container", children: [
          isAwaitingUserConfirmation && /* @__PURE__ */ jsxs("div", { className: "idkit-qr-overlay", children: [
            /* @__PURE__ */ jsx("div", { className: "idkit-spinner", children: /* @__PURE__ */ jsx(LoadingIcon, {}) }),
            /* @__PURE__ */ jsxs("div", { className: "idkit-connecting-text", children: [
              /* @__PURE__ */ jsx("p", { children: __("Connecting...") }),
              /* @__PURE__ */ jsx("p", { children: __("Please continue in app") })
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: `idkit-qr-blur ${isAwaitingUserConfirmation ? "blurred" : ""}`,
              children: /* @__PURE__ */ jsx("div", { style: { display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ jsx(
                QRState,
                {
                  qrData: connectorURI,
                  showSimulatorCallout
                }
              ) })
            }
          )
        ] })
      ]
    }
  );
}
function CheckIcon(props) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      width: "88",
      height: "88",
      viewBox: "0 0 88 88",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      children: [
        /* @__PURE__ */ jsx("rect", { width: "88", height: "88", rx: "44", fill: "#00C230" }),
        /* @__PURE__ */ jsx(
          "rect",
          {
            opacity: "0.2",
            width: "88",
            height: "88",
            rx: "44",
            fill: "url(#idkit_check_radial)"
          }
        ),
        /* @__PURE__ */ jsx(
          "rect",
          {
            x: "0.5",
            y: "0.5",
            width: "87",
            height: "87",
            rx: "43.5",
            stroke: "url(#idkit_check_linear)"
          }
        ),
        /* @__PURE__ */ jsx("path", { d: "M29.5 45.5L37.5 53.5L57.5 33.5", stroke: "white", strokeWidth: "3" }),
        /* @__PURE__ */ jsxs("defs", { children: [
          /* @__PURE__ */ jsxs(
            "radialGradient",
            {
              id: "idkit_check_radial",
              cx: "0",
              cy: "0",
              r: "1",
              gradientUnits: "userSpaceOnUse",
              gradientTransform: "translate(20 -1.6729e-06) rotate(63.4349) scale(98.387 97.9627)",
              children: [
                /* @__PURE__ */ jsx("stop", { stopColor: "white" }),
                /* @__PURE__ */ jsx("stop", { offset: "1", stopColor: "white", stopOpacity: "0" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "linearGradient",
            {
              id: "idkit_check_linear",
              x1: "44",
              y1: "0",
              x2: "44",
              y2: "88",
              gradientUnits: "userSpaceOnUse",
              children: [
                /* @__PURE__ */ jsx("stop", { stopColor: "white", stopOpacity: "0.3" }),
                /* @__PURE__ */ jsx("stop", { offset: "1", stopColor: "white", stopOpacity: "0" })
              ]
            }
          )
        ] })
      ]
    }
  );
}
function SuccessState() {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center"
      },
      children: [
        /* @__PURE__ */ jsx("div", { className: "idkit-success-icon", children: /* @__PURE__ */ jsx(CheckIcon, {}) }),
        /* @__PURE__ */ jsx("h2", { className: "idkit-heading", children: __("All set!") }),
        /* @__PURE__ */ jsx("p", { className: "idkit-subtext", style: { maxWidth: 260 }, children: __("Your World ID is now connected") })
      ]
    }
  );
}
function ErrorIcon(props) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      width: "88",
      height: "88",
      viewBox: "0 0 88 88",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      children: [
        /* @__PURE__ */ jsx("rect", { width: "88", height: "88", rx: "44", fill: "#9BA3AE" }),
        /* @__PURE__ */ jsx(
          "rect",
          {
            opacity: "0.2",
            width: "88",
            height: "88",
            rx: "44",
            fill: "url(#idkit_error_radial)"
          }
        ),
        /* @__PURE__ */ jsx(
          "rect",
          {
            x: "0.5",
            y: "0.5",
            width: "87",
            height: "87",
            rx: "43.5",
            stroke: "url(#idkit_error_linear)"
          }
        ),
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M33.0146 53.9853L43.4999 43.5M53.9851 33.0147L43.4999 43.5M43.4999 43.5L33.0146 33.0147M43.4999 43.5L53.9851 53.9853",
            stroke: "white",
            strokeWidth: "3"
          }
        ),
        /* @__PURE__ */ jsxs("defs", { children: [
          /* @__PURE__ */ jsxs(
            "radialGradient",
            {
              id: "idkit_error_radial",
              cx: "0",
              cy: "0",
              r: "1",
              gradientUnits: "userSpaceOnUse",
              gradientTransform: "translate(20 -1.6729e-06) rotate(63.4349) scale(98.387 97.9627)",
              children: [
                /* @__PURE__ */ jsx("stop", { stopColor: "white" }),
                /* @__PURE__ */ jsx("stop", { offset: "1", stopColor: "white", stopOpacity: "0" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "linearGradient",
            {
              id: "idkit_error_linear",
              x1: "44",
              y1: "0",
              x2: "44",
              y2: "88",
              gradientUnits: "userSpaceOnUse",
              children: [
                /* @__PURE__ */ jsx("stop", { stopColor: "white", stopOpacity: "0.3" }),
                /* @__PURE__ */ jsx("stop", { offset: "1", stopColor: "white", stopOpacity: "0" })
              ]
            }
          )
        ] })
      ]
    }
  );
}
function WarningIcon(props) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      width: "88",
      height: "88",
      viewBox: "0 0 88 88",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      children: [
        /* @__PURE__ */ jsx("rect", { width: "88", height: "88", rx: "44", fill: "#FFAE00" }),
        /* @__PURE__ */ jsx(
          "rect",
          {
            opacity: "0.2",
            width: "88",
            height: "88",
            rx: "44",
            fill: "url(#idkit_warning_radial)"
          }
        ),
        /* @__PURE__ */ jsx(
          "rect",
          {
            x: "0.5",
            y: "0.5",
            width: "87",
            height: "87",
            rx: "43.5",
            stroke: "url(#idkit_warning_linear)"
          }
        ),
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M64.1707 59.5415H22.8298L43.4998 22.3354L64.1707 59.5415ZM42.1208 51.3003L42.1218 54.0503H44.8992L44.8982 51.3003H42.1208ZM42.1248 46.7085H44.8748V36.6255H42.1248V46.7085Z",
            fill: "white"
          }
        ),
        /* @__PURE__ */ jsxs("defs", { children: [
          /* @__PURE__ */ jsxs(
            "radialGradient",
            {
              id: "idkit_warning_radial",
              cx: "0",
              cy: "0",
              r: "1",
              gradientUnits: "userSpaceOnUse",
              gradientTransform: "translate(20 -1.6729e-06) rotate(63.4349) scale(98.387 97.9627)",
              children: [
                /* @__PURE__ */ jsx("stop", { stopColor: "white" }),
                /* @__PURE__ */ jsx("stop", { offset: "1", stopColor: "white", stopOpacity: "0" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "linearGradient",
            {
              id: "idkit_warning_linear",
              x1: "44",
              y1: "0",
              x2: "44",
              y2: "88",
              gradientUnits: "userSpaceOnUse",
              children: [
                /* @__PURE__ */ jsx("stop", { stopColor: "white", stopOpacity: "0.3" }),
                /* @__PURE__ */ jsx("stop", { offset: "1", stopColor: "white", stopOpacity: "0" })
              ]
            }
          )
        ] })
      ]
    }
  );
}
var errorCodeVariants = {
  [IDKitErrorCodes.UserRejected]: "cancelled",
  [IDKitErrorCodes.VerificationRejected]: "cancelled",
  [IDKitErrorCodes.Cancelled]: "cancelled",
  [IDKitErrorCodes.ConnectionFailed]: "connection",
  [IDKitErrorCodes.FailedByHostApp]: "host_verification",
  [IDKitErrorCodes.InvalidRpSignature]: "configuration_error",
  [IDKitErrorCodes.NullifierReplayed]: "already_verified",
  [IDKitErrorCodes.DuplicateNonce]: "configuration_error",
  [IDKitErrorCodes.UnknownRp]: "configuration_error",
  [IDKitErrorCodes.InactiveRp]: "configuration_error",
  [IDKitErrorCodes.TimestampTooOld]: "configuration_error",
  [IDKitErrorCodes.TimestampTooFarInFuture]: "configuration_error",
  [IDKitErrorCodes.InvalidTimestamp]: "configuration_error",
  [IDKitErrorCodes.RpSignatureExpired]: "configuration_error",
  [IDKitErrorCodes.InvalidRpIdFormat]: "configuration_error"
};
var variantConfig = {
  already_verified: {
    title: "Already verified",
    message: "You've already verified for this action.",
    Icon: WarningIcon,
    actionLabel: "Close",
    action: "close"
  },
  cancelled: {
    title: "Request cancelled",
    message: "You've cancelled the request in World App.",
    Icon: WarningIcon,
    actionLabel: "Try Again",
    action: "retry"
  },
  configuration_error: {
    title: "Verification unavailable",
    message: "This verification request couldn't be completed. Please contact the website owner.",
    Icon: ErrorIcon,
    actionLabel: "Close",
    action: "close"
  },
  connection: {
    title: "Connection lost",
    message: "Please check your connection and try again.",
    Icon: ErrorIcon,
    // placeholder — swap for WifiOffIcon later
    actionLabel: "Try Again",
    action: "retry"
  },
  host_verification: {
    title: "Verification declined",
    message: "Failed to verify your credential proof. Please contact the website owner.",
    Icon: ErrorIcon,
    actionLabel: "Try Again",
    action: "retry"
  },
  generic: {
    title: "Something went wrong",
    message: "We couldn't complete your request. Please try again.",
    Icon: ErrorIcon,
    actionLabel: "Try Again",
    action: "retry"
  }
};
function getVariant(errorCode) {
  if (!errorCode) {
    return "generic";
  }
  return errorCodeVariants[errorCode] ?? "generic";
}
function ErrorState({
  errorCode,
  onClose,
  onRetry
}) {
  const variant = getVariant(errorCode);
  const { title, message, Icon, action, actionLabel } = variantConfig[variant];
  const handleAction = action === "close" ? onClose : onRetry;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center"
      },
      children: [
        /* @__PURE__ */ jsx("div", { className: "idkit-error-icon", children: /* @__PURE__ */ jsx(Icon, {}) }),
        /* @__PURE__ */ jsx("p", { className: "idkit-error-title", children: __(title) }),
        /* @__PURE__ */ jsx("p", { className: "idkit-error-message", children: __(message) }),
        /* @__PURE__ */ jsx("button", { type: "button", className: "idkit-retry-btn", onClick: handleAction, children: __(actionLabel) })
      ]
    }
  );
}
function HostAppVerificationState({ onVerify }) {
  const calledRef = useRef(false);
  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;
    void onVerify();
  }, []);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center"
      },
      children: [
        /* @__PURE__ */ jsx("div", { className: "idkit-spinner", children: /* @__PURE__ */ jsx(LoadingIcon, {}) }),
        /* @__PURE__ */ jsx("p", { className: "idkit-subtext", children: __("Transmitting verification to host app. Please wait...") })
      ]
    }
  );
}
function getVisualStage(isSuccess, isError, isHostVerifying) {
  if (isError) return "error";
  if (isHostVerifying) return "host_verification";
  if (isSuccess) return "success";
  return "worldid";
}
function IDKitWidgetBase({
  flow,
  open,
  onOpenChange,
  handleVerify,
  onSuccess,
  onError,
  autoClose = true,
  language,
  showSimulatorCallout
}) {
  const { open: openFlow, reset: resetFlow } = flow;
  const [hostVerifyResult, setHostVerifyResult] = useState(null);
  const lastResultRef = useRef(null);
  const lastErrorCodeRef = useRef(null);
  const verifyGenRef = useRef(0);
  useEffect(() => {
    if (language) {
      setLocalizationConfig({ language });
    }
  }, [language]);
  useEffect(() => {
    if (open) {
      setHostVerifyResult(null);
      openFlow();
      return;
    }
    setHostVerifyResult(null);
    lastResultRef.current = null;
    lastErrorCodeRef.current = null;
    verifyGenRef.current++;
    resetFlow();
  }, [open, openFlow, resetFlow]);
  const isSuccess = flow.isSuccess && (!handleVerify || hostVerifyResult === "passed");
  const isError = flow.isError || hostVerifyResult === "failed";
  const isHostVerifying = flow.isSuccess && Boolean(handleVerify) && hostVerifyResult === null;
  const effectiveErrorCode = flow.errorCode ?? (hostVerifyResult === "failed" ? IDKitErrorCodes.FailedByHostApp : null);
  useEffect(() => {
    if (!isSuccess || !flow.result || flow.result === lastResultRef.current) {
      return;
    }
    lastResultRef.current = flow.result;
    void Promise.resolve(onSuccess(flow.result)).catch(() => {
    });
  }, [flow.result, isSuccess, onSuccess]);
  useEffect(() => {
    if (!effectiveErrorCode || effectiveErrorCode === lastErrorCodeRef.current) {
      return;
    }
    lastErrorCodeRef.current = effectiveErrorCode;
    void Promise.resolve(onError?.(effectiveErrorCode)).catch(() => {
    });
  }, [effectiveErrorCode, onError]);
  useEffect(() => {
    if (!flow.isInWorldApp || !isHostVerifying || !flow.result || !handleVerify) {
      return;
    }
    const gen2 = ++verifyGenRef.current;
    void Promise.resolve(handleVerify(flow.result)).then(() => {
      if (verifyGenRef.current === gen2) setHostVerifyResult("passed");
    }).catch(() => {
      if (verifyGenRef.current === gen2) setHostVerifyResult("failed");
    });
  }, [flow.isInWorldApp, isHostVerifying, flow.result, handleVerify]);
  useEffect(() => {
    if (flow.isInWorldApp && (isSuccess || isError)) {
      onOpenChange(false);
    } else if (isSuccess && autoClose) {
      const timer = setTimeout(() => onOpenChange(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, isError, autoClose, onOpenChange, flow.isInWorldApp]);
  if (flow.isInWorldApp) {
    return null;
  }
  const stage = getVisualStage(isSuccess, isError, isHostVerifying);
  return /* @__PURE__ */ jsxs(IDKitModal, { open, onOpenChange, children: [
    stage === "worldid" && /* @__PURE__ */ jsx(
      WorldIDState,
      {
        connectorURI: flow.connectorURI,
        isAwaitingUserConfirmation: flow.isAwaitingUserConfirmation,
        showSimulatorCallout
      }
    ),
    stage === "host_verification" && /* @__PURE__ */ jsx(
      HostAppVerificationState,
      {
        onVerify: () => {
          const gen2 = ++verifyGenRef.current;
          return Promise.resolve(handleVerify(flow.result)).then(
            () => {
              if (verifyGenRef.current === gen2) setHostVerifyResult("passed");
            },
            () => {
              if (verifyGenRef.current === gen2) setHostVerifyResult("failed");
            }
          );
        }
      }
    ),
    stage === "success" && /* @__PURE__ */ jsx(SuccessState, {}),
    stage === "error" && /* @__PURE__ */ jsx(
      ErrorState,
      {
        errorCode: effectiveErrorCode,
        onClose: () => onOpenChange(false),
        onRetry: () => {
          setHostVerifyResult(null);
          lastResultRef.current = null;
          lastErrorCodeRef.current = null;
          verifyGenRef.current++;
          resetFlow();
          openFlow();
        }
      }
    )
  ] });
}
function IDKitRequestWidget({
  open,
  onOpenChange,
  handleVerify,
  onSuccess,
  onError,
  autoClose,
  language,
  ...config
}) {
  if (typeof onSuccess !== "function") {
    throw new Error("IDKitRequestWidget requires an onSuccess callback.");
  }
  const flow = useIDKitRequest(config);
  return /* @__PURE__ */ jsx(
    IDKitWidgetBase,
    {
      flow,
      open,
      onOpenChange,
      handleVerify,
      onSuccess,
      onError,
      autoClose,
      language,
      showSimulatorCallout: config.environment === "staging"
    }
  );
}
function IDKitSessionWidget({
  open,
  onOpenChange,
  handleVerify,
  onSuccess,
  onError,
  autoClose,
  language,
  ...config
}) {
  if (typeof onSuccess !== "function") {
    throw new Error("IDKitSessionWidget requires an onSuccess callback.");
  }
  const flow = useIDKitSession(config);
  return /* @__PURE__ */ jsx(
    IDKitWidgetBase,
    {
      flow,
      open,
      onOpenChange,
      handleVerify,
      onSuccess,
      onError,
      autoClose,
      language,
      showSimulatorCallout: config.environment === "staging"
    }
  );
}
export {
  CredentialRequest,
  IDKit,
  IDKitErrorCodes,
  IDKitRequestWidget,
  IDKitSessionWidget,
  all,
  any,
  deviceLegacy,
  documentLegacy,
  enumerate,
  isDebug,
  orbLegacy,
  secureDocumentLegacy,
  selfieCheckLegacy,
  setDebug,
  signRequest,
  useIDKitRequest,
  useIDKitSession
};
/*! Bundled license information:

react-dom/cjs/react-dom.production.js:
  (**
   * @license React
   * react-dom.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-dom/cjs/react-dom.development.js:
  (**
   * @license React
   * react-dom.development.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

@worldcoin/idkit-server/dist/index.js:
  (*! Bundled license information:
  
  @noble/hashes/esm/utils.js:
    (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
  
  @noble/secp256k1/index.js:
    (*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) *)
  *)
*/
