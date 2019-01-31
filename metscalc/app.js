(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
'use strict';

// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
// original notice:

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) {
    return -1;
  }
  if (y < x) {
    return 1;
  }
  return 0;
}
function isBuffer(b) {
  if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
    return global.Buffer.isBuffer(b);
  }
  return !!(b != null && b._isBuffer);
}

// based on node assert, original notice:

// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var util = require('util/');
var hasOwn = Object.prototype.hasOwnProperty;
var pSlice = Array.prototype.slice;
var functionsHaveNames = (function () {
  return function foo() {}.name === 'foo';
}());
function pToString (obj) {
  return Object.prototype.toString.call(obj);
}
function isView(arrbuf) {
  if (isBuffer(arrbuf)) {
    return false;
  }
  if (typeof global.ArrayBuffer !== 'function') {
    return false;
  }
  if (typeof ArrayBuffer.isView === 'function') {
    return ArrayBuffer.isView(arrbuf);
  }
  if (!arrbuf) {
    return false;
  }
  if (arrbuf instanceof DataView) {
    return true;
  }
  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
    return true;
  }
  return false;
}
// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

var regex = /\s*function\s+([^\(\s]*)\s*/;
// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
function getName(func) {
  if (!util.isFunction(func)) {
    return;
  }
  if (functionsHaveNames) {
    return func.name;
  }
  var str = func.toString();
  var match = str.match(regex);
  return match && match[1];
}
assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = getName(stackStartFunction);
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function truncate(s, n) {
  if (typeof s === 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}
function inspect(something) {
  if (functionsHaveNames || !util.isFunction(something)) {
    return util.inspect(something);
  }
  var rawname = getName(something);
  var name = rawname ? ': ' + rawname : '';
  return '[Function' +  name + ']';
}
function getMessage(self) {
  return truncate(inspect(self.actual), 128) + ' ' +
         self.operator + ' ' +
         truncate(inspect(self.expected), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
  }
};

function _deepEqual(actual, expected, strict, memos) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (isBuffer(actual) && isBuffer(expected)) {
    return compare(actual, expected) === 0;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if ((actual === null || typeof actual !== 'object') &&
             (expected === null || typeof expected !== 'object')) {
    return strict ? actual === expected : actual == expected;

  // If both values are instances of typed arrays, wrap their underlying
  // ArrayBuffers in a Buffer each to increase performance
  // This optimization requires the arrays to have the same type as checked by
  // Object.prototype.toString (aka pToString). Never perform binary
  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
  // bit patterns are not identical.
  } else if (isView(actual) && isView(expected) &&
             pToString(actual) === pToString(expected) &&
             !(actual instanceof Float32Array ||
               actual instanceof Float64Array)) {
    return compare(new Uint8Array(actual.buffer),
                   new Uint8Array(expected.buffer)) === 0;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else if (isBuffer(actual) !== isBuffer(expected)) {
    return false;
  } else {
    memos = memos || {actual: [], expected: []};

    var actualIndex = memos.actual.indexOf(actual);
    if (actualIndex !== -1) {
      if (actualIndex === memos.expected.indexOf(expected)) {
        return true;
      }
    }

    memos.actual.push(actual);
    memos.expected.push(expected);

    return objEquiv(actual, expected, strict, memos);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b, strict, actualVisitedObjects) {
  if (a === null || a === undefined || b === null || b === undefined)
    return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b))
    return a === b;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
    return false;
  var aIsArgs = isArguments(a);
  var bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b, strict);
  }
  var ka = objectKeys(a);
  var kb = objectKeys(b);
  var key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length !== kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] !== kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
      return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

assert.notDeepStrictEqual = notDeepStrictEqual;
function notDeepStrictEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
  }
}


// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  }

  try {
    if (actual instanceof expected) {
      return true;
    }
  } catch (e) {
    // Ignore.  The instanceof check doesn't work for arrow functions.
  }

  if (Error.isPrototypeOf(expected)) {
    return false;
  }

  return expected.call({}, actual) === true;
}

function _tryBlock(block) {
  var error;
  try {
    block();
  } catch (e) {
    error = e;
  }
  return error;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof block !== 'function') {
    throw new TypeError('"block" argument must be a function');
  }

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  actual = _tryBlock(block);

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  var userProvidedMessage = typeof message === 'string';
  var isUnwantedException = !shouldThrow && util.isError(actual);
  var isUnexpectedException = !shouldThrow && actual && !expected;

  if ((isUnwantedException &&
      userProvidedMessage &&
      expectedException(actual, expected)) ||
      isUnexpectedException) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws(true, block, error, message);
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws(false, block, error, message);
};

assert.ifError = function(err) { if (err) throw err; };

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"util/":4}],2:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],3:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],4:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":3,"_process":6,"inherits":2}],5:[function(require,module,exports){

},{}],6:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],7:[function(require,module,exports){
"use strict";

var _bmiagerev$split$redu;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/*
   Copyright 2019 University of Florida

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var assert = require('assert');

var Sex = {
  Male: 1,
  Female: 2 // BMIAdult calculates the body-mass-index for an adult older than 20 years old
  // given their weight in kilograms and height in meters.
  // See https://www.nhs.uk/common-health-questions/lifestyle/how-can-i-work-out-my-body-mass-index-bmi/

};

function BMIAdult(weight, height) {
  return weight / (height * height);
} // BMIZscore calculates the body-mass-index z-score for a person older than 2
// years old and younger than 20 years old given their weight in kilograms,
// height in meters, age in months, and sex.


function BMIZscore(weight, height, sex, age) {
  assert(age >= 24 && age <= 240.5, 'age must be [24, 240.5]');
  assert(sex === Sex.Male || sex === Sex.Female, 'sex must be 1=male or 2=female');
  var bmi = BMIAdult(weight, height);

  var _bmiForAge$Get = bmiForAge.Get(sex, age),
      L = _bmiForAge$Get.L,
      M = _bmiForAge$Get.M,
      S = _bmiForAge$Get.S; // See https://www.cdc.gov/nccdphp/dnpao/growthcharts/resources/sas.htm
  // Z = [ ((value / M)**L) – 1] / (S * L)


  return (Math.pow(bmi / M, L) - 1) / (S * L);
} // bmiagerev is the "BMI-for-age charts, 2 to 20 years, LMS parameters and
// selected smoothed BMI (kilograms/meters squared) percentiles, by sex and
// age".
// Downloaded from https://www.cdc.gov/growthcharts/percentile_data_files.htm
//   Sex     1=male, 2=female
//   Agemos  age in months
//   L       Box-Cox transformation
//   M       Median
//   S       Generalized coefficient of variation


var bmiagerev = "\nSex,Agemos,L,M,S,P3,P5,P10,P25,P50,P75,P85,P90,P95,P97\n1,24,-2.01118107,16.57502768,0.080592465,14.52095333,14.73731947,15.09032827,15.74164233,16.57502768,17.55718781,18.16219473,18.60948128,19.33801062,19.85985812\n1,24.5,-1.982373595,16.54777487,0.080127429,14.50347667,14.71929257,15.07117474,15.71962876,16.54777487,17.52129279,18.11954923,18.56110634,19.27889813,19.79194014\n1,25.5,-1.924100169,16.49442763,0.079233994,14.46882381,14.68360841,15.03335725,15.67634464,16.49442763,17.45135039,18.03668013,18.46729593,19.16465965,19.66102345\n1,26.5,-1.86549793,16.44259552,0.078389356,14.43459737,14.64843329,14.99619505,15.634035,16.44259552,17.38383656,17.95700228,18.37736191,19.05567423,19.5365754\n1,27.5,-1.807261899,16.3922434,0.077593501,14.40082828,14.61378626,14.95969047,15.5926798,16.3922434,17.3187102,17.88047101,18.29125345,18.9518675,19.41848805\n1,28.5,-1.750118905,16.34333654,0.076846462,14.36754718,14.57968578,14.92384514,15.55225853,16.34333654,17.2559313,17.80704259,18.20892041,18.85316529,19.30665411\n1,29.5,-1.69481584,16.29584097,0.076148308,14.33478414,14.54614966,14.88866003,15.51275057,16.29584097,17.19546093,17.73667414,18.1303131,18.75949359,19.20096691\n1,30.5,-1.642106779,16.24972371,0.075499126,14.30256837,14.51319492,14.85413557,15.47413549,16.24972371,17.13726129,17.66932346,18.05538214,18.67077841,19.10132056\n1,31.5,-1.592744414,16.20495268,0.074898994,14.27092833,14.48083795,14.82027189,15.43639319,16.20495268,17.0812953,17.6049486,17.98407812,18.58694589,19.00761051\n1,32.5,-1.547442391,16.16149871,0.074347997,14.23988971,14.44909329,14.7870687,15.39950521,16.16149871,17.02752831,17.54350898,17.91635198,18.50792131,18.91973125\n1,33.5,-1.506902601,16.11933258,0.073846139,14.2094782,14.41797561,14.7545259,15.36345335,16.11933258,16.97592485,17.48496295,17.85215384,18.43363072,18.83758072\n1,34.5,-1.471770047,16.07842758,0.07339337,14.17971698,14.38749811,14.72264343,15.32822125,16.07842758,16.92645101,17.42926933,17.79143359,18.3639996,18.76105711\n1,35.5,-1.442628957,16.03875896,0.072989551,14.15062715,14.35767293,14.69142152,15.2937943,16.03875896,16.87907357,17.37638677,17.73414053,18.29895323,18.69005992\n1,36.5,-1.419991255,16.00030401,0.072634432,14.12222757,14.32851119,14.66086088,15.26015988,16.00030401,16.8337599,17.32627356,17.68022325,18.23841666,18.62449011\n1,37.5,-1.404277619,15.96304277,0.072327649,14.09453413,14.30002256,14.63096272,15.22730791,15.96304277,16.79047852,17.27888795,17.62962965,18.1823144,18.5642493\n1,38.5,-1.39586317,15.92695418,0.07206864,14.06756329,14.27221761,14.60172936,15.1952288,15.92695418,16.74919525,17.23418554,17.58230587,18.13057244,18.50924478\n1,39.5,-1.394935252,15.89202582,0.071856805,14.04132288,14.24510202,14.57316316,15.16391901,15.89202582,16.70988247,17.19212545,17.53819888,18.08311311,18.45937719\n1,40.5,-1.401671596,15.85824093,0.071691278,14.0158243,14.21868433,14.54526806,15.13337382,15.85824093,16.67250668,17.15266201,17.49725289,18.03986198,18.41455697\n1,41.5,-1.416100312,15.82558822,0.071571093,13.99107332,14.19297011,14.51804847,15.10359281,15.82558822,16.63703787,17.11575098,17.45941207,18.00074262,18.37469187\n1,42.5,-1.438164899,15.79405728,0.071495113,13.96707439,14.16796472,14.49150978,15.07457728,15.79405728,16.60344521,17.08134677,17.42461935,17.96567903,18.33969264\n1,43.5,-1.467669032,15.76364255,0.071462106,13.94382698,14.14367089,14.4656578,15.04633235,15.76364255,16.57170092,17.04940504,17.39281759,17.9345935,18.30946785\n1,44.5,-1.504376347,15.73433668,0.071470646,13.9213319,14.12009269,14.44049947,15.01886319,15.73433668,16.54177412,17.0198786,17.36394785,17.90741007,18.28393204\n1,45.5,-1.547942838,15.70613566,0.071519218,13.8995866,14.09723246,14.4160421,14.99217766,15.70613566,16.51363577,16.99272087,17.33795095,17.88405183,18.26299911\n1,46.5,-1.597896397,15.67904062,0.071606277,13.87858352,14.07508966,14.392293,14.96628719,15.67904062,16.48726082,16.96788739,17.31476822,17.86443983,18.24657949\n1,47.5,-1.653732283,15.65305192,0.071730167,13.85831582,14.05366443,14.36926,14.94120325,15.65305192,16.46262258,16.94533215,17.29433999,17.84849622,18.2345875\n1,48.5,-1.714869347,15.62817269,0.071889214,13.83877404,14.03295533,14.34695084,14.91693911,15.62817269,16.43969657,16.92501028,17.27660684,17.8361423,18.22693633\n1,49.5,-1.780673181,15.604408,0.072081737,13.81994711,14.01295984,14.32537305,14.89350913,15.604408,16.41845985,16.90687779,17.26150966,17.82729891,18.22353875\n1,50.5,-1.850468473,15.58176458,0.072306081,13.80182253,13.99367445,14.30453377,14.87092845,15.58176458,16.39889119,16.89089179,17.24898984,17.8218865,18.22430691\n1,51.5,-1.923551865,15.56025067,0.072560637,13.78438667,13.97509464,14.2844396,14.84921259,15.56025067,16.38097113,16.87701073,17.23898952,17.81982523,18.22915216\n1,52.5,-1.999220429,15.5398746,0.07284384,13.76762605,13.95721572,14.26509665,14.82837662,15.5398746,16.36468088,16.86519374,17.23145142,17.82103559,18.23798637\n1,53.5,-2.076707178,15.52064993,0.073154324,13.75152248,13.94002947,14.24650943,14.80843749,15.52064993,16.3500079,16.85540483,17.22632105,17.82543578,18.25071444\n1,54.5,-2.155348017,15.50258427,0.073490667,13.73606368,13.92353116,14.22868271,14.7894083,15.50258427,16.33693462,16.8476049,17.22354286,17.83294744,18.26724918\n1,55.5,-2.234438552,15.48568973,0.073851672,13.72123322,13.90771281,14.21161954,14.77130343,15.48568973,16.32544946,16.84175987,17.22306443,17.84349028,18.28749643\n1,56.5,-2.313321723,15.46997718,0.074236235,13.70701599,13.89256678,14.19532216,14.75413556,15.46997718,16.31554106,16.8378366,17.22483458,17.85698505,18.31136265\n1,57.5,-2.391381273,15.45545692,0.074643374,13.69339739,13.87808525,14.1797919,14.73791599,15.45545692,16.30719914,16.83580365,17.22880383,17.87335318,18.33875356\n1,58.5,-2.468032491,15.44213961,0.075072264,13.68036242,13.86425959,14.16502885,14.72265501,15.44213961,16.30041561,16.83563223,17.23492502,17.89251642,18.36957256\n1,59.5,-2.542781541,15.43003207,0.075522104,13.66789962,13.85108308,14.15103287,14.70836004,15.43003207,16.29517994,16.83729272,17.24315148,17.91439894,18.40372671\n1,60.5,-2.61516595,15.41914163,0.07599225,13.65599683,13.83854804,14.13780261,14.69503764,15.41914163,16.29148397,16.84075838,17.25343909,17.93892524,18.44112021\n1,61.5,-2.684789516,15.40947356,0.076482128,13.64464353,13.82664746,14.1253362,14.68269244,15.40947356,16.28931904,16.84600319,17.26574515,17.96602144,18.48165813\n1,62.5,-2.751316949,15.40103139,0.076991232,13.63383056,13.81537489,14.11363117,14.67132735,15.40103139,16.28867619,16.85300198,17.28002846,17.99561523,18.52524599\n1,63.5,-2.81445945,15.39381785,0.077519149,13.62354907,13.8047237,14.10268433,14.66094403,15.39381785,16.28954723,16.86173124,17.29624981,18.02763543,18.57178832\n1,64.5,-2.87402476,15.38783094,0.07806539,13.61379452,13.79469004,14.09249299,14.65154144,15.38783094,16.29191982,16.87216519,17.31436954,18.06201396,18.62119533\n1,65.5,-2.92984048,15.38306945,0.078629592,13.60456106,13.78526882,14.08305345,14.64311821,15.38306945,16.29578396,16.88428085,17.33435063,18.09868317,18.67337395\n1,66.5,-2.981796828,15.37952958,0.079211369,13.595845,13.77645627,14.0743621,14.63567131,15.37952958,16.30112773,16.89805459,17.35615653,18.13757754,18.72823379\n1,67.5,-3.029831343,15.37720582,0.079810334,13.58764387,13.76824936,14.06641528,14.62919656,15.37720582,16.30793819,16.91346275,17.37975148,18.17863327,18.78568583\n1,68.5,-3.073924224,15.37609107,0.080426086,13.57995642,13.76064574,14.05920932,14.62368881,15.37609107,16.31620135,16.93048153,17.40510042,18.22178824,18.84564261\n1,69.5,-3.114093476,15.37617677,0.081058206,13.57278245,13.75364373,14.05274063,14.619142,15.37617677,16.32590217,16.94908693,17.43216882,18.26698191,18.90801826\n1,70.5,-3.15039004,15.37745304,0.081706249,13.56612272,13.7472423,14.04700569,14.61554938,15.37745304,16.33702456,16.96925461,17.46092258,18.31415529,18.97272855\n1,71.5,-3.182893018,15.37990886,0.082369741,13.55997887,13.74144099,14.04200114,14.6129036,15.37990886,16.34955145,16.99095993,17.49132795,18.36325085,19.03969094\n1,72.5,-3.21170511,15.38353217,0.083048178,13.55435329,13.73623987,14.03772376,14.61119682,15.38353217,16.36346484,17.01417786,17.52335144,18.41421242,19.10882456\n1,73.5,-3.23694834,15.38831005,0.083741021,13.54924901,13.73163946,14.03417051,14.61042085,15.38831005,16.37874588,17.03888299,17.55695978,18.46698511,19.18005024\n1,74.5,-3.25876011,15.39422883,0.0844477,13.54466964,13.72764072,14.03133851,14.61056719,15.39422883,16.39537493,17.06504953,17.59211982,18.52151524,19.25329044\n1,75.5,-3.277281546,15.40127496,0.085167651,13.54061839,13.72424433,14.02922475,14.61162737,15.40127496,16.41333266,17.09265223,17.62879914,18.57774996,19.32846782\n1,76.5,-3.292683774,15.40943252,0.085900184,13.53710097,13.72145289,14.02782718,14.61359223,15.40943252,16.43259653,17.12166319,17.66696377,18.63563816,19.4055104\n1,77.5,-3.305124073,15.41868691,0.086644667,13.53412147,13.71926775,14.02714319,14.61645307,15.41868691,16.45314588,17.15205629,17.70658129,18.69512904,19.48434431\n1,78.5,-3.314768951,15.42902273,0.087400421,13.53168472,13.71769094,14.0271705,14.62020097,15.42902273,16.47495885,17.18380454,17.74761885,18.75617288,19.56489823\n1,79.5,-3.321785992,15.44042439,0.088166744,13.52979573,13.71672458,14.027907,14.62482705,15.44042439,16.49801329,17.21688072,17.7900437,18.81872078,19.64710224\n1,80.5,-3.326345795,15.45287581,0.088942897,13.52845994,13.71637124,14.02935081,14.63032238,15.45287581,16.52228624,17.25125697,17.83382275,18.88272474,19.7308886\n1,81.5,-3.328602731,15.46636218,0.089728202,13.5276813,13.71663233,14.03149952,14.63667844,15.46636218,16.54775649,17.28690708,17.87892434,18.948137,19.81618799\n1,82.5,-3.328725277,15.48086704,0.090521875,13.52746565,13.71751078,14.03435159,14.64388639,15.48086704,16.57440029,17.32380254,17.9253152,19.01491107,19.902936\n1,83.5,-3.32687018,15.49637465,0.091323162,13.52781794,13.71900887,14.03790521,14.65193763,15.49637465,16.6021948,17.3619157,17.97296286,19.08300081,19.99106797\n1,84.5,-3.323188896,15.51286936,0.092131305,13.52874305,13.72112886,14.0421586,14.66082372,15.51286936,16.6311172,17.40121891,18.02183493,19.15236073,20.08052042\n1,85.5,-3.317827016,15.53033563,0.092945544,13.53024568,13.72387293,14.04710998,14.67053629,15.53033563,16.66114466,17.44168456,18.07189919,19.22294589,20.17123104\n1,86.5,-3.310923871,15.54875807,0.093765118,13.53233036,13.72724315,14.05275762,14.68106712,15.54875807,16.69225445,17.48328513,18.12312353,19.29471191,20.2631386\n1,87.5,-3.302612272,15.56812143,0.09458927,13.53500147,13.7312415,14.05909975,14.69240809,15.56812143,16.72442396,17.52599317,18.17547605,19.36761493,20.35618297\n1,88.5,-3.293018361,15.58841065,0.095417247,13.53826314,13.73586983,14.06613458,14.7045512,15.58841065,16.7576307,17.56978138,18.22892501,19.44161165,20.45030507\n1,89.5,-3.282260813,15.60961101,0.096248301,13.54211938,13.7411299,14.0738604,14.71748869,15.60961101,16.79185246,17.61462266,18.28343882,19.51665894,20.54544624\n1,90.5,-3.270454609,15.63170735,0.097081694,13.54657375,13.74702309,14.08227508,14.73121238,15.63170735,16.82706672,17.66048985,18.33898626,19.59271539,20.64155132\n1,91.5,-3.257703616,15.65468563,0.097916698,13.55162988,13.753551,14.091377,14.74571498,15.65468563,16.86325188,17.70735632,18.39553611,19.6697383,20.73856241\n1,92.5,-3.244108214,15.67853139,0.098752593,13.55729098,13.7607148,14.10116411,14.76098876,15.67853139,16.90038609,17.75519541,18.45305756,19.74768666,20.83642509\n1,93.5,-3.229761713,15.70323052,0.099588675,13.56356006,13.76851558,14.1116344,14.77702622,15.70323052,16.9384478,17.80398077,18.51151998,19.82651963,20.93508525\n1,94.5,-3.214751287,15.72876911,0.100424251,13.57043987,13.77695423,14.12278578,14.79381994,15.72876911,16.97741575,17.85368626,18.57089304,19.90619689,21.03448975\n1,95.5,-3.199158184,15.75513347,0.101258643,13.57793291,13.78603145,14.13461608,14.81136258,15.75513347,17.01726889,17.90428602,18.63114669,19.98667859,21.13458634\n1,96.5,-3.18305795,15.78231007,0.102091189,13.58604144,13.79574779,14.14712305,14.82964685,15.78231007,17.05798645,17.95575444,18.69225117,20.06792538,21.2353237\n1,97.5,-3.166520664,15.8102856,0.102921245,13.59476742,13.80610355,14.16030433,14.84866554,15.8102856,17.09954792,18.00806622,18.75417705,20.1498984,21.33665138\n1,98.5,-3.1496103,15.83904708,0.103748189,13.60411246,13.81709878,14.17415743,14.86841153,15.83904708,17.14193325,18.06119653,18.81689537,20.23255928,21.4385195\n1,99.5,-3.132389637,15.86858123,0.104571386,13.61407844,13.82873375,14.18867999,14.88887764,15.86858123,17.18512191,18.1151201,18.8803769,20.31587026,21.54088032\n1,100.5,-3.114911153,15.89887562,0.105390269,13.62466611,13.84100784,14.20386916,14.91005687,15.89887562,17.22909475,18.16981303,18.94459357,20.39979379,21.64368493\n1,101.5,-3.097226399,15.92991765,0.106204258,13.63587653,13.85392068,14.21972223,14.93194218,15.92991765,17.2738323,18.22525119,19.00951733,20.48429323,21.74688677\n1,102.5,-3.079383079,15.96169481,0.107012788,13.64771054,13.86747174,14.23623642,14.95452659,15.96169481,17.31931519,18.28141055,19.07512019,20.56933216,21.85043987\n1,103.5,-3.061423765,15.99419489,0.107815327,13.66016853,13.88166013,14.25340873,14.97780313,15.99419489,17.36552463,18.33826774,19.14137485,20.6548748,21.95429887\n1,104.5,-3.043386071,16.02740607,0.108611374,13.67325038,13.89648454,14.27123591,15.00176488,16.02740607,17.4124424,18.39579999,19.20825462,20.74088584,22.05841878\n1,105.5,-3.025310003,16.0613159,0.109400388,13.68695684,13.91194439,14.28971516,15.02640489,16.0613159,17.46004925,18.45398355,19.27573205,20.82733059,22.16275742\n1,106.5,-3.007225737,16.09591292,0.110181915,13.70128712,13.92803786,14.30884292,15.05171626,16.09591292,17.50832768,18.51279647,19.34378135,20.9141748,22.26727123\n1,107.5,-2.989164598,16.13118532,0.110955478,13.71624103,13.94476358,14.32861592,15.07769209,16.13118532,17.55725951,18.57221621,19.41237631,21.00138483,22.37191887\n1,108.5,-2.971148225,16.16712234,0.111720691,13.73181676,13.9621189,14.3490301,15.10432556,16.16712234,17.60682848,18.63222223,19.48149248,21.08892746,22.47665729\n1,109.5,-2.953208047,16.20371168,0.112477059,13.7480147,13.98010297,14.37008248,15.13160968,16.20371168,17.65701563,18.69279128,19.55110329,21.17677023,22.58144893\n1,110.5,-2.935363951,16.24094239,0.1132242,13.76483325,13.99871328,14.39176909,15.15953759,16.24094239,17.70780444,18.75390266,19.62118443,21.26488107,22.68625363\n1,111.5,-2.917635157,16.27880346,0.113961734,13.78227084,14.01794738,14.41408598,15.1881024,16.27880346,17.75917825,18.81553565,19.69171163,21.3532285,22.79103265\n1,112.5,-2.900039803,16.31728385,0.114689291,13.80032593,14.03780282,14.43702918,15.21729722,16.31728385,17.81112044,18.87766958,19.76266083,21.44178165,22.89574847\n1,113.5,-2.882593796,16.35637267,0.115406523,13.81899666,14.0582769,14.46059456,15.2471151,16.35637267,17.86361469,18.94028419,19.83400841,21.53051015,23.00036429\n1,114.5,-2.865311266,16.39605916,0.116113097,13.83828098,14.07936677,14.48477791,15.27754914,16.39605916,17.91664493,19.00335954,19.90573115,21.61938426,23.10484416\n1,115.5,-2.848204697,16.43633265,0.116808702,13.85817663,14.10106937,14.50957485,15.30859238,16.43633265,17.97019532,19.06687603,19.97780623,21.70837477,23.20915296\n1,116.5,-2.831285052,16.47718256,0.117493042,13.87868113,14.1233815,14.53498094,15.34023785,16.47718256,18.02425026,19.13081436,20.05021121,21.79745308,23.31325641\n1,117.5,-2.81456189,16.51859843,0.11816584,13.8997918,14.14629977,14.56099157,15.37247856,16.51859843,18.0787944,19.19515554,20.12292406,21.88659115,23.41712109\n1,118.5,-2.79804347,16.56056987,0.118826835,13.92150576,14.16982063,14.58760204,15.40530752,16.56056987,18.13381258,19.25988094,20.19592313,21.97576153,23.5207144\n1,119.5,-2.781736856,16.60308661,0.119475785,13.94381995,14.19394037,14.61480754,15.43871766,16.60308661,18.1892899,19.3249722,20.26918717,22.06493737,23.62400462\n1,120.5,-2.765648008,16.64613844,0.120112464,13.96673109,14.21865508,14.64260311,15.47270195,16.64613844,18.24521166,19.3904113,20.34269534,22.15409238,23.72696086\n1,121.5,-2.749782197,16.68971518,0.120736656,13.99023581,14.24396081,14.67098376,15.50725326,16.68971518,18.3015633,19.45618042,20.41642709,22.24320091,23.82955322\n1,122.5,-2.734142443,16.73380695,0.121348181,14.01433021,14.26985313,14.6999442,15.5423645,16.73380695,18.35833084,19.52226247,20.49036263,22.33223786,23.93175206\n1,123.5,-2.718732873,16.77840363,0.121946849,14.0390107,14.29632789,14.72947925,15.57802849,16.77840363,18.41549995,19.58864006,20.56448202,22.42117875,24.0335295\n1,124.5,-2.703555506,16.82349538,0.122532501,14.06427317,14.32338048,14.75958347,15.61423805,16.82349538,18.4730569,19.65529649,20.63876611,22.5099997,24.1348579\n1,125.5,-2.688611957,16.86907238,0.123104991,14.09011344,14.35100623,14.79025137,15.65098595,16.86907238,18.53098805,19.72221531,20.71319602,22.59867744,24.23571063\n1,126.5,-2.673903164,16.91512487,0.123664186,14.11652711,14.37920031,14.8214773,15.68826493,16.91512487,18.58928,19.78938034,20.78775327,22.68718928,24.33606191\n1,127.5,-2.659429443,16.96164317,0.124209969,14.14350962,14.40795771,14.85325552,15.72606768,16.96164317,18.64791953,19.85677572,20.86241981,22.77551316,24.43588681\n1,128.5,-2.645190534,17.00861766,0.124742239,14.17105623,14.43727329,14.88558018,15.76438688,17.00861766,18.70689364,19.92438591,20.93717795,22.86362762,24.53516127\n1,129.5,-2.631185649,17.05603879,0.125260905,14.19916203,14.46714175,14.91844531,15.80321513,17.05603879,18.76618951,19.99219565,21.01201043,22.95151182,24.63386207\n1,130.5,-2.617413511,17.10389705,0.125765895,14.22782193,14.49755765,14.95184482,15.84254502,17.10389705,18.82579454,20.06019002,21.08690037,23.03914551,24.73196683\n1,131.5,-2.603872392,17.15218302,0.126257147,14.25703066,14.52851537,14.98577251,15.8823691,17.15218302,18.88569633,20.12835437,21.1618313,23.12650908,24.82945404\n1,132.5,-2.590560148,17.20088732,0.126734613,14.28678279,14.56000917,15.02022206,15.92267985,17.20088732,18.94588267,20.19667437,21.23678716,23.21358351,24.92630305\n1,133.5,-2.577474253,17.25000062,0.12719826,14.31707271,14.59203313,15.05518706,15.96346973,17.25000062,19.00634155,20.265136,21.31175226,23.30035043,25.02249405\n1,134.5,-2.564611831,17.29951367,0.127648067,14.34789463,14.62458122,15.09066095,16.00473115,17.29951367,19.06706116,20.33372554,21.38671134,23.38679204,25.11800807\n1,135.5,-2.551969684,17.34941726,0.128084023,14.37924262,14.65764722,15.1266371,16.04645648,17.34941726,19.12802987,20.40242956,21.46164953,23.4728912,25.21282703\n1,136.5,-2.539539972,17.39970308,0.128506192,14.41110933,14.69122381,15.16310811,16.08863812,17.39970308,19.18923776,20.4712365,21.53655365,23.55863129,25.3069313\n1,137.5,-2.527325681,17.45036072,0.128914497,14.44349038,14.72530601,15.20006805,16.13126821,17.45036072,19.25067129,20.54013114,21.61140764,23.64399652,25.40030815\n1,138.5,-2.515320235,17.50138161,0.129309001,14.47637861,14.75988661,15.23750958,16.17433905,17.50138161,19.31232029,20.60910189,21.6861986,23.72897155,25.49294066\n1,139.5,-2.503519447,17.55275674,0.129689741,14.50976741,14.79495883,15.27542561,16.21784281,17.55275674,19.37417388,20.6781365,21.76091323,23.81354171,25.58481418\n1,140.5,-2.491918934,17.60447714,0.130056765,14.54365005,14.83051578,15.31380892,16.26177162,17.60447714,19.43622137,20.74722303,21.83553865,23.89769296,25.67591492\n1,141.5,-2.480514136,17.6565339,0.130410133,14.57801961,14.86655039,15.3526522,16.30611758,17.6565339,19.49845226,20.81634983,21.91006237,23.98141187,25.76622996\n1,142.5,-2.469300331,17.70891811,0.130749913,14.61286903,14.90305549,15.39194804,16.35087272,17.70891811,19.5608562,20.88550554,21.98447229,24.06468566,25.85574725\n1,143.5,-2.458272656,17.76162094,0.131076187,14.6481911,14.94002374,15.43168891,16.39602903,17.76162094,19.62342306,20.95467909,22.05875672,24.14750216,25.94445561\n1,144.5,-2.447426113,17.81463359,0.131389042,14.68397844,14.97744768,15.47186716,16.44157847,17.81463359,19.68614286,21.02385969,22.13290433,24.22984982,26.0323447\n1,145.5,-2.436755595,17.86794729,0.131688579,14.72022354,15.01531973,15.51247506,16.48751291,17.86794729,19.74900579,21.09303687,22.20690421,24.31171774,26.11940509\n1,146.5,-2.426255887,17.92155332,0.131974905,14.75691872,15.05363215,15.55350476,16.53382421,17.92155332,19.81200224,21.1622004,22.28074585,24.39309562,26.20562819\n1,147.5,-2.415921689,17.97544299,0.132248138,14.79405616,15.09237707,15.5949483,16.58050415,17.97544299,19.87512275,21.23134038,22.35441912,24.47397382,26.2910063\n1,148.5,-2.405747619,18.02960765,0.132508403,14.83162791,15.13154651,15.63679762,16.62754449,18.02960765,19.93835804,21.30044717,22.42791427,24.55434332,26.37553258\n1,149.5,-2.395728233,18.08403868,0.132755834,14.86962583,15.17113234,15.67904455,16.67493692,18.08403868,20.001699,21.36951141,22.50122197,24.63419572,26.45920106\n1,150.5,-2.385858029,18.1387275,0.132990575,14.90804168,15.2111263,15.72168083,16.72267307,18.1387275,20.06513669,21.43852405,22.57433325,24.71352325,26.54200665\n1,151.5,-2.376131459,18.19366555,0.133212776,14.94686707,15.25152001,15.76469808,16.77074454,18.19366555,20.12866232,21.5074763,22.64723955,24.79231881,26.62394515\n1,152.5,-2.366542942,18.24884431,0.133422595,14.98609343,15.29230496,15.80808782,16.81914286,18.24884431,20.1922673,21.57635964,22.7199327,24.87057587,26.7050132\n1,153.5,-2.357086871,18.3042553,0.133620197,15.0257121,15.33347251,15.85184148,16.86785954,18.3042553,20.25594317,21.64516586,22.79240491,24.9482886,26.78520835\n1,154.5,-2.347757625,18.35989003,0.133805756,15.06571426,15.37501389,15.89595038,16.91688599,18.35989003,20.31968165,21.71388701,22.86464879,25.02545175,26.86452902\n1,155.5,-2.338549576,18.41574009,0.133979452,15.10609095,15.41692023,15.94040572,16.96621361,18.41574009,20.38347461,21.78251541,22.93665733,25.10206075,26.94297451\n1,156.5,-2.3294571,18.47179706,0.13414147,15.14683307,15.4591825,15.98519864,17.01583373,18.47179706,20.44731409,21.85104367,23.0084239,25.17811163,27.02054498\n1,157.5,-2.320474586,18.52805255,0.134292005,15.1879314,15.50179159,16.03032014,17.06573761,18.52805255,20.51119228,21.91946467,23.07994228,25.25360108,27.09724149\n1,158.5,-2.311596446,18.5844982,0.134431256,15.22937658,15.54473823,16.07576115,17.11591649,18.5844982,20.57510153,21.98777156,23.15120662,25.32852641,27.173066\n1,159.5,-2.302817124,18.64112567,0.134559427,15.27115913,15.58801305,16.12151248,17.16636153,18.64112567,20.63903434,22.05595776,23.22221145,25.4028856,27.24802132\n1,160.5,-2.294131107,18.69792663,0.134676731,15.31326943,15.63160658,16.16756484,17.21706384,18.69792663,20.70298336,22.12401698,23.2929517,25.47667722,27.32211115\n1,161.5,-2.285532933,18.75489278,0.134783385,15.35569774,15.67550919,16.21390888,17.26801449,18.75489278,20.76694139,22.19194317,23.36342268,25.54990054,27.39534011\n1,162.5,-2.277017201,18.81201584,0.134879611,15.39843418,15.71971118,16.2605351,17.31920447,18.81201584,20.83090139,22.25973057,23.43362008,25.62255542,27.46771366\n1,163.5,-2.268578584,18.86928753,0.134965637,15.44146877,15.7642027,16.30743394,17.37062472,18.86928753,20.89485646,22.32737368,23.50353999,25.6946424,27.53923819\n1,164.5,-2.260211837,18.92669959,0.135041695,15.48479139,15.80897382,16.35459573,17.42226614,18.92669959,20.95879983,22.39486727,23.57317887,25.76616263,27.60992094\n1,165.5,-2.251911809,18.98424378,0.135108024,15.52839182,15.85401448,16.40201071,17.47411956,18.98424378,21.02272489,22.46220636,23.64253356,25.83711794,27.67977007\n1,166.5,-2.243673453,19.04191185,0.135164867,15.57225971,15.89931451,16.44966902,17.52617573,19.04191185,21.08662518,22.52938625,23.71160129,25.90751079,27.74879463\n1,167.5,-2.235491842,19.09969557,0.135212469,15.6163846,15.94486363,16.49756071,17.57842539,19.09969557,21.15049434,22.5964025,23.78037969,25.97734428,27.81700453\n1,168.5,-2.227362173,19.15758672,0.135251083,15.66075591,15.99065148,16.54567574,17.63085916,19.15758672,21.21432619,22.66325092,23.84886673,26.04662217,27.88441062\n1,169.5,-2.21927979,19.21557707,0.135280963,15.70536296,16.03666757,16.59400398,17.68346764,19.21557707,21.27811465,22.7299276,23.91706081,26.11534887,27.95102462\n1,170.5,-2.211240187,19.27365839,0.135302371,15.75019496,16.0829013,16.64253518,17.73624136,19.27365839,21.34185379,22.79642886,23.98496068,26.18352944,28.01685913\n1,171.5,-2.203239029,19.33182247,0.135315568,15.79524102,16.129342,16.69125904,17.78917078,19.33182247,21.40553781,22.86275131,24.05256549,26.25116959,28.08192768\n1,172.5,-2.195272161,19.39006106,0.135320824,15.84049013,16.17597888,16.74016514,17.84224628,19.39006106,21.46916104,22.92889179,24.11987476,26.31827569,28.14624467\n1,173.5,-2.187335625,19.44836594,0.135318407,15.8859312,16.22280106,16.78924297,17.8954582,19.44836594,21.53271791,22.99484741,24.18688841,26.38485476,28.20982542\n1,174.5,-2.179425674,19.50672885,0.135308594,15.93155303,16.26979755,16.83848195,17.9487968,19.50672885,21.596203,23.06061552,24.25360674,26.45091448,28.27268613\n1,175.5,-2.171538789,19.56514153,0.135291662,15.97734432,16.31695728,16.8878714,18.00225228,19.56514153,21.659611,23.12619375,24.3200304,26.51646321,28.33484391\n1,176.5,-2.163671689,19.62359571,0.135267891,16.02329371,16.3642691,16.93740054,18.05581474,19.62359571,21.72293673,23.19157996,24.38616048,26.58150994,28.39631678\n1,177.5,-2.155821357,19.6820831,0.135237567,16.0693897,16.41172173,16.98705851,18.10947424,19.6820831,21.78617511,23.25677226,24.4519984,26.64606434,28.45712363\n1,178.5,-2.147985046,19.74059538,0.135200976,16.11562074,16.45930384,17.03683437,18.16322076,19.74059538,21.84932117,23.32176902,24.517546,26.71013675,28.51728428\n1,179.5,-2.140160305,19.7991242,0.135158409,16.1619752,16.50700399,17.08671707,18.21704418,19.7991242,21.91237008,23.38656886,24.5828055,26.77373817,28.57681946\n1,180.5,-2.132344989,19.85766121,0.135110159,16.20844134,16.55481067,17.13669551,18.27093434,19.85766121,21.97531708,23.45117065,24.64777949,26.83688026,28.63575076\n1,181.5,-2.124537282,19.916198,0.135056522,16.25500735,16.60271228,17.18675845,18.32488097,19.916198,22.03815755,23.5155735,24.71247097,26.89957537,28.69410072\n1,182.5,-2.116735712,19.97472615,0.134997797,16.30166137,16.65069714,17.23689462,18.37887373,19.97472615,22.10088696,23.57977678,24.77688329,26.96183652,28.75189275\n1,183.5,-2.108939167,20.03323719,0.134934285,16.34839144,16.69875348,17.28709261,18.4329022,20.03323719,22.16350089,23.6437801,24.84102024,27.02367739,28.80915118\n1,184.5,-2.10114692,20.09172262,0.134866291,16.39518554,16.74686947,17.33734097,18.48695587,20.09172262,22.22599501,23.70758332,24.90488595,27.08511234,28.86590125\n1,185.5,-2.093358637,20.15017387,0.134794121,16.44203157,16.79503318,17.38762812,18.54102414,20.15017387,22.2883651,23.77118654,24.96848498,27.14615643,28.92216908\n1,186.5,-2.085574403,20.20858236,0.134718085,16.4889174,16.84323264,17.43794242,18.59509632,20.20858236,22.35060703,23.83459013,25.03182226,27.20682538,28.97798172\n1,187.5,-2.077794735,20.26693944,0.134638494,16.53583079,16.89145577,17.48827215,18.64916164,20.26693944,22.41271676,23.89779468,25.09490311,27.2671356,29.03336709\n1,188.5,-2.070020599,20.32523642,0.134555663,16.58275947,16.93969043,17.53860547,18.70320922,20.32523642,22.47469037,23.96080104,25.15773327,27.32710417,29.08835404\n1,189.5,-2.062253431,20.38346455,0.13446991,16.62969112,16.98792443,17.58893048,18.7572281,20.38346455,22.53652401,24.02361032,25.22031884,27.38674888,29.14297232\n1,190.5,-2.054495145,20.44161501,0.134381553,16.67661334,17.03614547,17.63923518,18.8112072,20.44161501,22.59821392,24.08622386,25.28266636,27.4460882,29.19725256\n1,191.5,-2.046748156,20.49967894,0.134290916,16.72351369,17.08434122,17.68950749,18.86513537,20.49967894,22.65975645,24.14864327,25.34478272,27.50514126,29.25122631\n1,192.5,-2.039015385,20.5576474,0.134198323,16.77037969,17.13249925,17.73973524,18.91900132,20.5576474,22.72114803,24.21087038,25.40667527,27.56392793,29.30492601\n1,193.5,-2.031300282,20.6155114,0.134104101,16.81719878,17.18060709,17.78990616,18.97279368,20.6155114,22.78238517,24.2729073,25.46835171,27.62246873,29.35838499\n1,194.5,-2.023606828,20.67326189,0.134008581,16.86395838,17.22865219,17.8400079,19.02650098,20.67326189,22.84346448,24.33475639,25.52982017,27.68078489,29.41163748\n1,195.5,-2.015942013,20.73088905,0.133912066,16.91064668,17.27662259,17.89002837,19.08011149,20.73088905,22.90438167,24.39641931,25.59108848,27.73889854,29.46472007\n1,196.5,-2.008305745,20.7883851,0.133814954,16.95724926,17.32450423,17.93995429,19.13361379,20.7883851,22.96513563,24.4579009,25.65216707,27.79683185,29.51766572\n1,197.5,-2.000706389,20.84574003,0.133717552,17.0037543,17.37228509,17.98977343,19.18699593,20.84574003,23.02572213,24.51920324,25.71306451,27.85460837,29.57051295\n1,198.5,-1.993150137,20.90294449,0.1336202,17.05014902,17.41995236,18.03947307,19.24024598,20.90294449,23.08613815,24.58032971,25.77379055,27.91225209,29.62329955\n1,199.5,-1.985643741,20.95998909,0.133523244,17.09642062,17.46749315,18.0890404,19.29335192,20.95998909,23.14638076,24.64128395,25.83435539,27.96978771,29.67606419\n1,200.5,-1.97819451,21.01686433,0.133427032,17.1425562,17.51489451,18.1384625,19.34630158,21.01686433,23.20644712,24.70206989,25.89476963,28.02724061,29.72884644\n1,201.5,-1.970810308,21.07356067,0.133331914,17.18854287,17.56214342,18.18772638,19.39908272,21.07356067,23.26633451,24.76269168,25.95504426,28.08463689,29.78168674\n1,202.5,-1.96349954,21.1300685,0.133238245,17.23436764,17.60922679,18.23681892,19.45168294,21.1300685,23.3260403,24.82315378,26.01519074,28.1420033,29.83462638\n1,203.5,-1.956271141,21.18637813,0.133146383,17.2800175,17.65613146,18.28572693,19.50408975,21.18637813,23.38556196,24.88346091,26.07522093,28.19936732,29.88770757\n1,204.5,-1.949134561,21.24247982,0.13305669,17.32547937,17.70284417,18.3344371,19.55629056,21.24247982,23.44489706,24.94361805,26.13514709,28.25675709,29.94097335\n1,205.5,-1.942099744,21.29836376,0.132969531,17.37074012,17.74935161,18.38293604,19.60827264,21.29836376,23.50404332,25.00363048,26.19498193,28.31420146,29.99446764\n1,206.5,-1.935177101,21.35402009,0.132885274,17.41578654,17.79564039,18.43121023,19.66002316,21.35402009,23.56299853,25.06350375,26.2547386,28.37172995,30.04823522\n1,207.5,-1.92837748,21.40943891,0.132804292,17.46060537,17.84169701,18.47924607,19.71152919,21.40943891,23.62176064,25.1232437,26.31443063,28.42937274,30.10232173\n1,208.5,-1.921712136,21.46461026,0.132726962,17.50518327,17.8875079,18.52702984,19.76277767,21.46461026,23.68032771,25.18285645,26.37407203,28.48716074,30.15677367\n1,209.5,-1.915192685,21.51952414,0.132653664,17.54950683,17.9330594,18.57454772,19.81375546,21.51952414,23.73869794,25.24234842,26.4336772,28.54512548,30.21163837\n1,210.5,-1.908831065,21.57417053,0.132584784,17.59356252,17.97833773,18.62178578,19.8644493,21.57417053,23.79686967,25.30172632,26.49326098,28.60329919,30.26696403\n1,211.5,-1.902639482,21.62853937,0.132520711,17.63733676,18.02332903,18.66872998,19.91484586,21.62853937,23.85484139,25.36099716,26.55283865,28.66171476,30.32279966\n1,212.5,-1.896630358,21.68262062,0.132461838,17.68081585,18.06801933,18.71536617,19.96493169,21.68262062,23.91261174,25.42016826,26.6124259,28.72040572,30.37919514\n1,213.5,-1.890816268,21.73640419,0.132408563,17.72398595,18.11239453,18.76168008,20.01469327,21.73640419,23.97017953,25.47924723,26.67203887,28.77940629,30.43620115\n1,214.5,-1.885209876,21.78988003,0.132361289,17.76683315,18.15644042,18.80765734,20.06411699,21.78988003,24.02754374,25.538242,26.73169411,28.8387513,30.49386923\n1,215.5,-1.879823505,21.84303819,0.132320427,17.80934323,18.20014256,18.8532834,20.11318921,21.84303819,24.08470367,25.59716095,26.79140871,28.89847621,30.55225152\n1,216.5,-1.874670324,21.8958685,0.132286382,17.85150219,18.24348662,18.89854373,20.16189615,21.8958685,24.14165845,25.65601244,26.85119991,28.9586172,30.61140148\n1,217.5,-1.869760299,21.94836168,0.1322596,17.89329472,18.28645727,18.94342321,20.21022414,21.94836168,24.19840866,25.71480629,26.91108626,29.0192108,30.67137176\n1,218.5,-1.865113245,22.00050569,0.132240418,17.93470899,18.32904183,18.98790813,20.25815885,22.00050569,24.25495098,25.77354888,26.97108394,29.08029503,30.73222122\n1,219.5,-1.860734944,22.05229242,0.13222933,17.97572809,18.37122369,19.03198262,20.3056868,22.05229242,24.31128792,25.83225207,27.03121333,29.14190734,30.79400211\n1,220.5,-1.85663384,22.10371305,0.132226801,18.01633608,18.41298696,19.07563119,20.35279433,22.10371305,24.36742097,25.89092687,27.09149434,29.20408599,30.85676906\n1,221.5,-1.852827186,22.15475603,0.132233201,18.05651989,18.45431794,19.11883943,20.39946695,22.15475603,24.42334799,25.94958116,27.15194482,29.26687079,30.92058278\n1,222.5,-1.849323204,22.20541249,0.132248993,18.09626344,18.49520062,19.16159172,20.44569089,22.20541249,24.47907063,26.00822631,27.21258528,29.33030127,30.9855\n1,223.5,-1.846131607,22.255673,0.132274625,18.13555112,18.53561932,19.2038726,20.49145219,22.255673,24.53458985,26.06687321,27.27343608,29.39441777,31.05157949\n1,224.5,-1.843261294,22.30552831,0.132310549,18.17436706,18.57555819,19.24566649,20.53673687,22.30552831,24.58990692,26.1255331,27.33451796,29.45926122,31.1188808\n1,225.5,-1.840720248,22.3549693,0.132357221,18.21269512,18.61500111,19.28695764,20.581531,22.3549693,24.64502338,26.18421759,27.39585208,29.52487306,31.18746427\n1,226.5,-1.83851544,22.40398706,0.132415103,18.25051886,18.65393178,19.32773023,20.62582066,22.40398706,24.69994107,26.24293861,27.45746001,29.59129532,31.25739102\n1,227.5,-1.83665586,22.45257182,0.132484631,18.28782254,18.69233437,19.36796858,20.66959159,22.45257182,24.75466075,26.30170723,27.51936283,29.65857091,31.32872478\n1,228.5,-1.835138046,22.50071778,0.132566359,18.3245866,18.73019025,19.40765581,20.71283095,22.50071778,24.80918852,26.36053932,27.58158516,29.72674204,31.40152344\n1,229.5,-1.833972004,22.54841437,0.132660699,18.36079565,18.7674838,19.44677624,20.75552409,22.54841437,24.86352415,26.41944523,27.64414785,29.79585303,31.47585441\n1,230.5,-1.833157751,22.59565422,0.132768153,18.39643137,18.80419732,19.48531336,20.79765756,22.59565422,24.91767166,26.47843912,27.70707459,29.86594782,31.55178078\n1,231.5,-1.83269562,22.64242956,0.132889211,18.43147564,18.84031318,19.52325062,20.83921773,22.64242956,24.97163459,26.53753478,27.77038891,29.93707103,31.62936748\n1,232.5,-1.832584342,22.68873292,0.133024368,18.46590991,18.87581348,19.56057136,20.88019106,22.68873292,25.02541685,26.59674639,27.83411475,30.00926778,31.7086802\n1,233.5,-1.832820974,22.73455713,0.133174129,18.49971524,18.91067999,19.59725875,20.9205641,22.73455713,25.07902274,26.65608851,27.89827645,30.08258369,31.78978539\n1,234.5,-1.833400825,22.7798953,0.133338999,18.53287228,18.9448942,19.63329582,20.96032349,22.7798953,25.13245693,26.71557609,27.96289869,30.15706484,31.87275025\n1,235.5,-1.834317405,22.82474087,0.133519496,18.56536124,18.97843726,19.66866547,20.99945599,22.82474087,25.18572453,26.77522448,28.0280066,30.23275779,31.95764272\n1,236.5,-1.83555752,22.86908912,0.133716192,18.59716016,19.0112887,19.70334974,21.03794885,22.86908912,25.23883315,26.83505132,28.09362697,30.30970901,32.04452853\n1,237.5,-1.837119466,22.91293151,0.133929525,18.62825142,19.04343134,19.7373324,21.07578835,22.91293151,25.29178502,26.89506944,28.15978336,30.387967,32.13348232\n1,238.5,-1.838987063,22.95626373,0.134160073,18.65861245,19.07484425,19.7705953,21.11296191,22.95626373,25.34458825,26.95529697,28.22650313,30.46757924,32.22457182\n1,239.5,-1.841146139,22.99908062,0.134408381,18.68822161,19.10550722,19.80312068,21.14945673,22.99908062,25.39724967,27.01575092,28.29381294,30.54859414,32.31786791\n1,240,-1.84233016,23.02029424,0.134539365,18.70273741,19.12055111,19.81910123,21.16744563,23.02029424,25.4235294,27.04606818,28.32769753,30.58964285,32.36536586\n1,240.5,-1.843580575,23.04137734,0.134675001,18.71705679,19.13539969,19.83489061,21.18526014,23.04137734,25.44977657,27.07644874,28.3617399,30.63106054,32.41344218\nSex,Agemos,L,M,S,P3,P5,P10,P25,P50,P75,P85,P90,P95,P97\n2,24,-0.98660853,16.42339664,0.085451785,14.1473467,14.39787089,14.80134054,15.52807587,16.42339664,17.42745659,18.01820579,18.44139317,19.10623522,19.56410958\n2,24.5,-1.024496827,16.38804056,0.085025838,14.13226271,14.3801866,14.77964811,15.49975639,16.38804056,17.38581552,17.97371413,18.39526372,19.05823845,19.51534333\n2,25.5,-1.102698353,16.3189719,0.084214052,14.10240814,14.34527262,14.73694628,15.44421901,16.3189719,17.30484811,17.88748812,18.30610782,18.9659499,19.42197989\n2,26.5,-1.18396635,16.25207985,0.083455124,14.07297394,14.31096806,14.6951581,15.39014846,16.25207985,17.2269319,17.80489051,18.22103253,18.87853388,19.33410382\n2,27.5,-1.268071036,16.18734669,0.082748284,14.04396337,14.27727686,14.65428696,15.33754218,16.18734669,17.15202498,17.72586396,18.13997016,18.79590999,19.25163039\n2,28.5,-1.354751525,16.12475448,0.082092737,14.01538008,14.24420303,14.61433601,15.28639717,16.12475448,17.08008556,17.65035137,18.06285334,18.71799839,19.17447582\n2,29.5,-1.443689692,16.06428762,0.081487717,13.98722569,14.21174909,14.57530775,15.23671134,16.06428762,17.01107457,17.57829774,17.98961595,18.64471845,19.10255392\n2,30.5,-1.53454192,16.00593001,0.080932448,13.95950246,14.17991775,14.53720437,15.18848189,16.00593001,16.94495296,17.50964839,17.92019231,18.5759903,19.03577948\n2,31.5,-1.626928093,15.94966631,0.080426175,13.93221207,14.14871111,14.50002752,15.14170598,15.94966631,16.88168308,17.44434994,17.85451773,18.51173402,18.97406651\n2,32.5,-1.720434829,15.89548197,0.079968176,13.90535562,14.11813062,14.46377827,15.09638064,15.89548197,16.82122877,17.38235043,17.79252859,18.45186978,18.91732801\n2,33.5,-1.814635262,15.84336179,0.079557735,13.87893492,14.08817793,14.42845728,15.05250203,15.84336179,16.763554,17.32359846,17.73416201,18.39631848,18.86547771\n2,34.5,-1.909076262,15.79329146,0.079194187,13.852951,14.0588539,14.39406456,15.01006617,15.79329146,16.70862449,17.26804436,17.67935646,18.34500099,18.81842784\n2,35.5,-2.003296102,15.7452564,0.078876895,13.82740517,14.03015932,14.36059959,14.96906838,15.7452564,16.65640663,17.21563951,17.62805146,18.29783876,18.7760905\n2,36.5,-2.096828937,15.69924188,0.078605255,13.80229888,14.00209476,14.32806133,14.92950329,15.69924188,16.60686761,17.16633643,17.5801877,18.25475381,18.73837743\n2,37.5,-2.189211877,15.65523282,0.078378696,13.77763382,13.97466073,14.29644823,14.89136478,15.65523282,16.55997523,17.12008872,17.53570705,18.21566879,18.70520011\n2,38.5,-2.279991982,15.61321371,0.078196674,13.75341201,13.94785767,14.26575827,14.85464591,15.61321371,16.51569783,17.07685104,17.49455256,18.18050711,18.67646985\n2,39.5,-2.368732949,15.57316843,0.078058667,13.72963586,13.92168608,14.23598902,14.81933896,15.57316843,16.4740041,17.03657894,17.45666842,18.14919304,18.65209796\n2,40.5,-2.455021314,15.53508019,0.077964169,13.70630824,13.89614655,14.20713766,14.78543535,15.53508019,16.43486298,16.99922885,17.42199993,18.12165176,18.63199585\n2,41.5,-2.538471972,15.49893145,0.077912684,13.68343254,13.87123981,14.17920105,14.75292568,15.49893145,16.39824347,16.96475788,17.39049347,18.09780945,18.61607518\n2,42.5,-2.618732901,15.46470384,0.077903716,13.66101266,13.84696678,14.15217581,14.72179977,15.46470384,16.36411453,16.93312378,17.36209639,18.07759336,18.60424802\n2,43.5,-2.695488973,15.43237817,0.077936763,13.63905306,13.82332865,14.12605833,14.69204668,15.43237817,16.33244497,16.90428477,17.33675699,18.06093184,18.59642696\n2,44.5,-2.768464816,15.40193436,0.078011309,13.61755872,13.80032682,14.10084485,14.6636548,15.40193436,16.30320336,16.87819947,17.31442438,18.04775438,18.59252526\n2,45.5,-2.837426693,15.37335154,0.078126817,13.59653518,13.77796299,14.07653151,14.63661186,15.37335154,16.27635793,16.85482681,17.29504843,18.03799161,18.59245694\n2,46.5,-2.902178205,15.34660842,0.078282739,13.57598804,13.75623885,14.05311425,14.61090523,15.34660842,16.25187703,16.83412628,17.27857995,18.03157513,18.59613624\n2,47.5,-2.962580386,15.32168181,0.078478449,13.55592455,13.73515717,14.03058936,14.58652134,15.32168181,16.22972719,16.81605638,17.2649696,18.02843822,18.6034803\n2,48.5,-3.018521987,15.29854897,0.078713325,13.53635124,13.71472021,14.00895279,14.56344665,15.29854897,16.20987583,16.80057671,17.25416922,18.02851473,18.61440545\n2,49.5,-3.069936555,15.27718618,0.078986694,13.51727537,13.6949307,13.98820066,14.54166718,15.27718618,16.19228952,16.78764654,17.24613088,18.03173977,18.62882971\n2,50.5,-3.116795864,15.2575692,0.079297841,13.49870449,13.67579162,13.96832912,14.52116867,15.2575692,16.17693441,16.77722512,17.24080701,18.03804946,18.64667225\n2,51.5,-3.159107331,15.23967338,0.079646006,13.48064637,13.65730608,13.94933441,14.50193674,15.23967338,16.16377626,16.76927159,17.23815034,18.04738091,18.66785338\n2,52.5,-3.196911083,15.22347371,0.080030389,13.46310899,13.63947739,13.93121283,14.48395686,15.22347371,16.15278049,16.76374505,17.23811389,18.05967216,18.6922946\n2,53.5,-3.230276759,15.20894491,0.080450145,13.44610041,13.62230894,13.91396079,14.46721445,15.20894491,16.14391221,16.76060449,17.24065086,18.0748621,18.71991859\n2,54.5,-3.259300182,15.19606152,0.080904391,13.42962877,13.60580421,13.89757474,14.45169495,15.19606152,16.13713628,16.75980884,17.24571467,18.09289045,18.75064919\n2,55.5,-3.284099963,15.18479799,0.081392203,13.41370222,13.58996673,13.88205123,14.4373838,15.18479799,16.13241736,16.76131695,17.25325891,18.11369768,18.78441142\n2,56.5,-3.30481415,15.17512871,0.081912623,13.39832882,13.57480002,13.8673869,14.42426656,15.17512871,16.12971996,16.76508763,17.2632373,18.13722499,18.82113141\n2,57.5,-3.321596954,15.16702811,0.082464661,13.38351658,13.56030761,13.8535784,14.41232886,15.16702811,16.12900854,16.77107966,17.27560372,18.16341422,18.86073644\n2,58.5,-3.334615646,15.16047068,0.083047295,13.36927334,13.54649295,13.84062247,14.40155647,15.16047068,16.13024748,16.77925184,17.29031217,18.19220786,18.90315485\n2,59.5,-3.344047622,15.15543107,0.083659478,13.35560679,13.53335941,13.82851587,14.39193532,15.15543107,16.13340121,16.78956298,17.30731682,18.22354893,18.94831604\n2,60.5,-3.35007771,15.15188405,0.084300139,13.34252439,13.52091027,13.81725538,14.38345148,15.15188405,16.13843423,16.80197195,17.32657196,18.25738105,18.99615046\n2,61.5,-3.352893805,15.14980479,0.0849682,13.33003322,13.50914853,13.80683773,14.37609125,15.14980479,16.14531133,16.81643792,17.34803218,18.29364826,19.04658918\n2,62.5,-3.352691376,15.14916825,0.085662539,13.31814053,13.4980774,13.79725982,14.36984096,15.14916825,16.15399692,16.83291965,17.37165187,18.33229525,19.09956514\n2,63.5,-3.34966438,15.14994984,0.086382035,13.3068531,13.48769977,13.78851848,14.3646872,15.14994984,16.16445581,16.85137625,17.39738575,18.37326713,19.15501183\n2,64.5,-3.343998803,15.15212585,0.087125591,13.29617673,13.47801782,13.78061022,14.3606169,15.15212585,16.17665394,16.87176785,17.42518932,18.41650918,19.21286229\n2,65.5,-3.335889574,15.15567186,0.087892047,13.28611805,13.4690344,13.77353197,14.35761687,15.15567186,16.19055603,16.89405345,17.45501735,18.46196754,19.27305261\n2,66.5,-3.325522491,15.16056419,0.088680264,13.27668282,13.46075175,13.76728041,14.35567422,15.16056419,16.20612774,16.91819285,17.48682523,18.50958858,19.33551875\n2,67.5,-3.31307846,15.16677947,0.089489106,13.26787651,13.45317191,13.76185216,14.35477623,15.16677947,16.22333502,16.94414613,17.52056863,18.55931907,19.40019747\n2,68.5,-3.298732648,15.17429464,0.090317434,13.25970423,13.44629667,13.75724378,14.35491035,15.17429464,16.24214414,16.97187362,17.55620345,18.6111062,19.46702632\n2,69.5,-3.282653831,15.18308694,0.091164117,13.25217076,13.44012761,13.75345175,14.35606415,15.18308694,16.26252167,17.00133593,17.5936859,18.6648976,19.53594365\n2,70.5,-3.265003896,15.1931339,0.092028028,13.24528055,13.43466608,13.75047248,14.35822537,15.1931339,16.28443453,17.03249399,17.63297244,18.72064127,19.60688859\n2,71.5,-3.245937506,15.20441335,0.092908048,13.23903773,13.42991321,13.74830229,14.36138186,15.20441335,16.30784995,17.065309,17.67401984,18.77828567,19.67980103\n2,72.5,-3.225606516,15.21690296,0.093803033,13.23344678,13.42587042,13.74693776,14.36552155,15.21690296,16.33273474,17.09974172,17.7167845,18.83777954,19.75462234\n2,73.5,-3.204146115,15.2305815,0.094711916,13.22851054,13.42253788,13.74637473,14.37063258,15.2305815,16.35905747,17.13575468,17.7612244,18.89907229,19.83129333\n2,74.5,-3.181690237,15.24542745,0.095633595,13.22423251,13.41991629,13.74660941,14.37670312,15.24542745,16.38678602,17.17330968,17.80729692,18.96211354,19.90975644\n2,75.5,-3.158363475,15.26141966,0.096566992,13.22061564,13.41800595,13.74763782,14.38372148,15.26141966,16.41588887,17.21236911,17.85496,19.02685341,19.9899546\n2,76.5,-3.134282833,15.27853728,0.097511046,13.21766256,13.41680692,13.74945586,14.39167606,15.27853728,16.44633482,17.25289572,17.90417191,19.09324243,20.07183146\n2,77.5,-3.109557879,15.29675967,0.09846471,13.21537563,13.41631905,13.75205934,14.40055533,15.29675967,16.478093,17.29485256,17.95489128,19.16123158,20.15533137\n2,78.5,-3.084290931,15.31606644,0.099426955,13.2137569,13.41654198,13.75544399,14.41034784,15.31606644,16.51113288,17.33820304,18.00707707,19.23077228,20.24039941\n2,79.5,-3.058577292,15.33643745,0.100396769,13.21280815,13.41747514,13.7596054,14.42104223,15.33643745,16.54542424,17.38291092,18.06068861,19.30181639,20.32698132\n2,80.5,-3.032505499,15.35785274,0.101373159,13.21253087,13.41911775,13.76453911,14.43262719,15.35785274,16.58093719,17.42894029,18.11568557,19.37431624,20.41502357\n2,81.5,-3.0061576,15.38029261,0.10235515,13.2129263,13.42146884,13.7702405,14.44509148,15.38029261,16.61764214,17.4762556,18.17202801,19.44822461,20.5044733\n2,82.5,-2.979609448,15.40373754,0.103341788,13.21399541,13.42452722,13.77670491,14.4584239,15.40373754,16.65550982,17.52482162,18.22967635,19.52349477,20.59527834\n2,83.5,-2.952930993,15.42816819,0.104332139,13.2157389,13.42829152,13.78392751,14.4726133,15.42816819,16.69451128,17.57460349,18.28859138,19.60008044,20.68738721\n2,84.5,-2.926186592,15.45356545,0.105325289,13.21815723,13.43276016,13.79190343,14.48764859,15.45356545,16.73461785,17.6255667,18.34873428,19.67793583,20.7807491\n2,85.5,-2.899435307,15.47991037,0.106320346,13.22125062,13.43793139,13.80062765,14.50351871,15.47991037,16.77580119,17.67767708,18.4100666,19.75701564,20.8753139\n2,86.5,-2.872731211,15.50718419,0.10731644,13.22501902,13.44380325,13.81009508,14.52021262,15.50718419,16.81803321,17.7309008,18.47255029,19.83727506,20.97103216\n2,87.5,-2.846123683,15.53536829,0.108312721,13.22946217,13.45037362,13.82030049,14.53771933,15.53536829,16.86128616,17.78520438,18.53614768,19.91866977,21.06785511\n2,88.5,-2.819657704,15.56444426,0.109308364,13.23457958,13.45764018,13.83123858,14.55602787,15.56444426,16.90553254,17.8405547,18.60082149,20.00115598,21.16573466\n2,89.5,-2.793374145,15.5943938,0.110302563,13.24037052,13.46560044,13.84290393,14.57512728,15.5943938,16.95074515,17.89691898,18.66653485,20.08469037,21.2646234\n2,90.5,-2.767310047,15.6251988,0.111294537,13.24683405,13.47425174,13.85529103,14.59500664,15.6251988,16.99689705,17.95426475,18.73325124,20.16923016,21.3644746\n2,91.5,-2.741498897,15.65684126,0.112283526,13.25396902,13.48359125,13.86839426,14.61565502,15.65684126,17.04396158,18.01255992,18.80093458,20.25473307,21.46524221\n2,92.5,-2.715970894,15.68930333,0.113268793,13.26177409,13.49361598,13.8822079,14.63706153,15.68930333,17.09191233,18.07177271,18.86954915,20.34115737,21.56688088\n2,93.5,-2.690753197,15.7225673,0.114249622,13.27024769,13.50432278,13.89672614,14.65921526,15.7225673,17.14072316,18.13187166,18.93905963,20.42846182,21.66934595\n2,94.5,-2.665870146,15.75661555,0.115225321,13.27938808,13.51570835,13.91194308,14.68210532,15.75661555,17.19036814,18.19282565,19.00943108,20.51660573,21.77259347\n2,95.5,-2.641343436,15.79143062,0.116195218,13.28919334,13.52776922,13.9278527,14.70572083,15.79143062,17.24082164,18.25460388,19.08062897,20.60554896,21.87658015\n2,96.5,-2.617192204,15.82699517,0.117158667,13.2996613,13.54050176,13.9444489,14.7300509,15.82699517,17.29205828,18.31717594,19.15261918,20.69525186,21.98126336\n2,97.5,-2.593430614,15.86329241,0.118115073,13.31078904,13.55390172,13.96172519,14.75508471,15.86329241,17.34405364,18.38051241,19.22536854,20.78567525,22.08660008\n2,98.5,-2.570076037,15.90030484,0.119063807,13.32257456,13.56796556,13.97967549,14.78081132,15.90030484,17.39678222,18.44458291,19.29884326,20.87678068,22.19254999\n2,99.5,-2.547141473,15.93801545,0.12000429,13.33501512,13.58268918,13.99829338,14.80721981,15.93801545,17.45021936,18.50935798,19.3730104,20.96853014,22.29907253\n2,100.5,-2.524635245,15.97640787,0.120935994,13.34810726,13.59806788,14.01757212,14.83429943,15.97640787,17.50434149,18.57480931,19.44783809,21.06088607,22.4061266\n2,101.5,-2.502569666,16.01546483,0.121858355,13.36184843,13.61409768,14.0375053,14.86203913,16.01546483,17.55912371,18.6409074,19.52329364,21.15381165,22.51367407\n2,102.5,-2.48095189,16.05516984,0.12277087,13.37623516,13.63077388,14.05808613,14.89042805,16.05516984,17.61454239,18.70762408,19.59934557,21.24727049,22.62167597\n2,103.5,-2.459785573,16.09550688,0.123673085,13.39126329,13.6480912,14.07930747,14.91945533,16.09550688,17.67057478,18.77493214,19.67596331,21.34122666,22.73009308\n2,104.5,-2.439080117,16.13645881,0.124564484,13.40693007,13.6660455,14.1011628,14.94910996,16.13645881,17.72719638,18.84280276,19.75311515,21.43564505,22.8388898\n2,105.5,-2.418838304,16.17800955,0.125444639,13.42323134,13.68463148,14.12364494,14.97938101,16.17800955,17.78438449,18.91120897,19.830771,21.5304909,22.94802887\n2,106.5,-2.399063683,16.22014281,0.126313121,13.44016315,13.70384401,14.1467468,15.01025752,16.22014281,17.84211614,18.98012366,19.90890079,21.62573005,23.05747448\n2,107.5,-2.379756861,16.26284277,0.127169545,13.45772088,13.72367745,14.17046092,15.04172856,16.26284277,17.9003692,19.04952063,19.98747533,21.72132885,23.16719057\n2,108.5,-2.360920527,16.30609316,0.128013515,13.47590046,13.74412656,14.19478013,15.0737831,16.30609316,17.95912092,19.11937316,20.06646519,21.8172543,23.27714304\n2,109.5,-2.342557728,16.34987759,0.128844639,13.49469797,13.7651862,14.21969726,15.10641007,16.34987759,18.01834843,19.18965453,20.14584104,21.91347402,23.38729906\n2,110.5,-2.324663326,16.39418118,0.129662637,13.51410735,13.78684956,14.24520415,15.13959859,16.39418118,18.07803138,19.26034062,20.22557581,22.00995586,23.49762289\n2,111.5,-2.307240716,16.43898741,0.130467138,13.53412476,13.80911155,14.27129365,15.17333749,16.43898741,18.13814687,19.33140487,20.30564061,22.10666864,23.60808381\n2,112.5,-2.290287663,16.48428082,0.131257852,13.55474487,13.83196589,14.29795787,15.20761574,16.48428082,18.19867379,19.4028226,20.38600821,22.20358151,23.71864933\n2,113.5,-2.273803847,16.53004554,0.132034479,13.5759628,13.85540667,14.32518913,15.24242219,16.53004554,18.25959047,19.47456869,20.46665117,22.30066429,23.82928884\n2,114.5,-2.257782149,16.57626713,0.132796819,13.59777181,13.87942647,14.35297886,15.27774591,16.57626713,18.32087764,19.54662051,20.5475442,22.39788709,23.9399692\n2,115.5,-2.242227723,16.62292864,0.133544525,13.62016849,13.90402053,14.38132004,15.31357557,16.62292864,18.38251202,19.6189515,20.628659,22.49522108,24.05066418\n2,116.5,-2.227132805,16.67001572,0.134277436,13.64314567,13.92918106,14.4102038,15.34990008,16.67001572,18.44447472,19.69153965,20.70997108,22.59263755,24.16134214\n2,117.5,-2.212495585,16.71751288,0.134995324,13.66669786,13.95490163,14.43962209,15.38670828,16.71751288,18.50674506,19.7643612,20.79145469,22.69010855,24.27197506\n2,118.5,-2.19831275,16.76540496,0.135697996,13.69081905,13.98117536,14.46956659,15.42398894,16.76540496,18.56930296,19.83739314,20.87308482,22.78760665,24.38253502\n2,119.5,-2.184580762,16.81367689,0.136385276,13.71550304,14.00799522,14.50002883,15.46173083,16.81367689,18.63212859,19.91061278,20.9548369,22.88510501,24.49299479\n2,120.5,-2.171295888,16.86231366,0.137057004,13.7407435,14.03535405,14.5310003,15.49992271,16.86231366,18.69520235,19.98399779,21.03668675,22.98257733,24.60332779\n2,121.5,-2.158454232,16.91130036,0.137713039,13.7665339,14.06324456,14.56247234,15.53855329,16.91130036,18.75850486,20.05752615,21.11861063,23.07999788,24.7135081\n2,122.5,-2.146051754,16.96062216,0.138353254,13.79286758,14.0916593,14.59443621,15.57761127,16.96062216,18.82201698,20.13117619,21.20058521,23.17734149,24.8235105\n2,123.5,-2.134084303,17.0102643,0.138977537,13.81973772,14.12059071,14.62688307,15.61708531,17.0102643,18.8857198,20.20492657,21.28258757,23.27458358,24.93331042\n2,124.5,-2.122547629,17.06021213,0.139585795,13.84713731,14.15003106,14.65980398,15.65696405,17.06021213,18.94959465,20.27875629,21.36459523,23.3717001,25.04288396\n2,125.5,-2.111437411,17.11045106,0.140177947,13.87505922,14.17997251,14.69318989,15.69723611,17.11045106,19.01362305,20.35264468,21.44658611,23.46866758,25.1522079\n2,126.5,-2.100749266,17.16096656,0.140753927,13.90349614,14.21040706,14.72703166,15.73789008,17.16096656,19.07778681,20.42657139,21.52853856,23.56546313,25.26125968\n2,127.5,-2.090478774,17.21174424,0.141313686,13.9324406,14.2413266,14.76132003,15.77891452,17.21174424,19.14206792,20.50051644,21.61043134,23.6620644,25.37001743\n2,128.5,-2.080621484,17.26276973,0.141857186,13.96188497,14.27272286,14.79604567,15.82029796,17.26276973,19.20644863,20.57446015,21.69224364,23.7584496,25.47845992\n2,129.5,-2.071172932,17.31402878,0.142384404,13.99182148,14.30458743,14.83119912,15.86202891,17.31402878,19.2709114,20.64838321,21.77395506,23.85459754,25.58656661\n2,130.5,-2.062128649,17.3655072,0.142895332,14.02224218,14.33691178,14.86677084,15.90409584,17.3655072,19.33543894,20.72226661,21.85554562,23.95048756,25.69431763\n2,131.5,-2.053484173,17.4171909,0.143389972,14.05313898,14.36968723,14.90275116,15.94648722,17.4171909,19.40001418,20.79609169,21.93699575,24.04609957,25.80169379\n2,132.5,-2.045235058,17.46906585,0.143868341,14.0845036,14.40290497,14.93913036,15.98919146,17.46906585,19.46462028,20.86984014,22.01828633,24.14141407,25.90867656\n2,133.5,-2.03737688,17.52111811,0.144330469,14.11632765,14.43655605,14.97589856,16.03219696,17.52111811,19.52924064,20.94349396,22.09939861,24.23641208,26.01524807\n2,134.5,-2.029906684,17.57333347,0.144776372,14.14860307,14.47063181,15.01304607,16.07549205,17.57333347,19.59385826,21.01703489,22.18031382,24.33107526,26.12139201\n2,135.5,-2.022817914,17.62569869,0.145206138,14.18132032,14.50512237,15.05056245,16.11906513,17.62569869,19.65845792,21.09044653,22.26101479,24.4253857,26.22709056\n2,136.5,-2.016107084,17.67819987,0.145619819,14.21447084,14.54001862,15.08843769,16.1629045,17.67819987,19.72302336,21.16371155,22.34148377,24.51932616,26.33232837\n2,137.5,-2.009769905,17.7308234,0.146017491,14.24804556,14.57531107,15.12666154,16.20699844,17.7308234,19.78753889,21.2368133,22.42170373,24.61287993,26.43709027\n2,138.5,-2.003802134,17.78355575,0.146399239,14.28203528,14.61099007,15.16522362,16.25133521,17.78355575,19.85198907,21.30973548,22.50165801,24.70603086,26.54136175\n2,139.5,-1.998199572,17.83638347,0.146765161,14.31643062,14.64704584,15.20411349,16.29590305,17.83638347,19.91635869,21.38246211,22.58133043,24.79876336,26.64512897\n2,140.5,-1.992958064,17.88929321,0.147115364,14.35122206,14.68346846,15.24332057,16.34069017,17.88929321,19.98063276,21.45497756,22.66070517,24.89106241,26.74837878\n2,141.5,-1.988073505,17.94227168,0.147449967,14.3863999,14.72024789,15.28283421,16.38568475,17.94227168,20.04479655,21.52726655,22.73976686,24.98291353,26.85109867\n2,142.5,-1.983541835,17.9953057,0.147769097,14.42195429,14.75737391,15.32264362,16.43087493,17.9953057,20.10883554,21.5993141,22.81850056,25.07430281,26.95327681\n2,143.5,-1.979359041,18.04838216,0.148072891,14.45787522,14.7948362,15.36273794,16.47624886,18.04838216,20.17273546,21.6711056,22.89689172,25.16521691,27.05490205\n2,144.5,-1.975521156,18.10148804,0.148361495,14.4941525,14.83262428,15.40310619,16.52179463,18.10148804,20.23648228,21.74262677,22.97492622,25.25564304,27.15596389\n2,145.5,-1.972024258,18.15461039,0.148635067,14.53077581,14.87072753,15.44373731,16.56750033,18.15461039,20.30006219,21.81386368,23.05259037,25.34556897,27.25645252\n2,146.5,-1.968864465,18.20773639,0.148893769,14.56773463,14.90913518,15.4846201,16.61335399,18.20773639,20.36346164,21.88480271,23.12987089,25.43498301,27.35635878\n2,147.5,-1.966037938,18.26085325,0.149137776,14.6050183,14.94783635,15.52574328,16.65934366,18.26085325,20.42666729,21.95543061,23.20675491,25.52387405,27.45567419\n2,148.5,-1.963540872,18.31394832,0.14936727,14.64261599,14.98681999,15.56709547,16.70545732,18.31394832,20.48966607,22.02573445,23.28322999,25.61223153,27.55439092\n2,149.5,-1.961369499,18.36700902,0.149582439,14.68051671,15.0260749,15.60866519,16.75168297,18.36700902,20.55244514,22.09570166,23.35928412,25.70004544,27.65250183\n2,150.5,-1.959520079,18.42002284,0.149783482,14.7187093,15.06558978,15.65044083,16.79800855,18.42002284,20.61499187,22.16531999,23.43490568,25.78730634,27.75000043\n2,151.5,-1.9579889,18.47297739,0.149970604,14.75718241,15.10535314,15.6924107,16.844422,18.47297739,20.67729392,22.23457754,23.51008349,25.87400532,27.8468809\n2,152.5,-1.956772271,18.52586035,0.15014402,14.79592458,15.14535337,15.734563,16.89091121,18.52586035,20.73933915,22.30346276,23.58480678,25.96013405,27.9431381\n2,153.5,-1.95586652,18.57865951,0.15030395,14.83492412,15.18557871,15.77688582,16.93746408,18.57865951,20.80111569,22.37196443,23.65906521,26.04568474,28.03876753\n2,154.5,-1.955267984,18.63136275,0.150450621,14.87416922,15.22601726,15.81936717,16.98406846,18.63136275,20.86261191,22.44007167,23.73284885,26.13065016,28.13376538\n2,155.5,-1.954973011,18.68395801,0.15058427,14.91364786,15.26665697,15.86199492,17.0307122,18.68395801,20.9238164,22.50777397,23.80614819,26.21502362,28.22812848\n2,156.5,-1.954977947,18.73643338,0.150705138,14.95334789,15.30748565,15.90475685,17.07738309,18.73643338,20.98471803,22.57506113,23.87895414,26.298799,28.32185435\n2,157.5,-1.955279136,18.788777,0.150813475,14.99325696,15.34849095,15.94764066,17.12406895,18.788777,21.04530589,22.6419233,23.95125804,26.38197072,28.41494115\n2,158.5,-1.955872909,18.84097713,0.150909535,15.03336257,15.38966039,15.9906339,17.17075754,18.84097713,21.10556932,22.70835101,24.02305164,26.46453376,28.50738772\n2,159.5,-1.956755579,18.89302212,0.150993582,15.07365202,15.43098133,16.03372404,17.21743662,18.89302212,21.16549792,22.77433508,24.0943271,26.54648363,28.59919355\n2,160.5,-1.957923436,18.94490041,0.151065883,15.11411246,15.47244099,16.07689846,17.2640939,18.94490041,21.22508152,22.83986672,24.16507702,26.62781643,28.69035881\n2,161.5,-1.959372737,18.99660055,0.151126714,15.15473086,15.51402643,16.1201444,17.31071712,18.99660055,21.28431023,22.90493747,24.23529442,26.70852876,28.7808843\n2,162.5,-1.9610997,19.04811118,0.151176355,15.19549401,15.55572457,16.16344901,17.35729394,19.04811118,21.34317438,22.96953922,24.30497273,26.78861781,28.8707715\n2,163.5,-1.963100496,19.09942105,0.151215094,15.23638853,15.59752218,16.20679934,17.40381205,19.09942105,21.40166456,23.03366421,24.37410579,26.8680813,28.96002256\n2,164.5,-1.96537124,19.15051899,0.151243223,15.27740086,15.63940588,16.25018232,17.45025909,19.15051899,21.45977162,23.09730502,24.4426879,26.94691749,29.04864025\n2,165.5,-1.967907983,19.20139397,0.151261042,15.31851726,15.68136213,16.2935848,17.4966227,19.20139397,21.51748666,23.16045458,24.51071375,27.02512521,29.13662805\n2,166.5,-1.970706706,19.25203503,0.151268855,15.35972381,15.72337724,16.33699348,17.54289048,19.25203503,21.57480102,23.2231062,24.57817846,27.10270382,29.22399004\n2,167.5,-1.973763307,19.30243131,0.151266974,15.40100642,15.76543738,16.38039498,17.58905003,19.30243131,21.63170632,23.28525349,24.64507758,27.17965324,29.31073101\n2,168.5,-1.977073595,19.35257209,0.151255713,15.44235082,15.80752854,16.42377582,17.63508894,19.35257209,21.68819441,23.34689045,24.71140708,27.25597392,29.39685635\n2,169.5,-1.980633277,19.40244671,0.151235395,15.48374254,15.84963659,16.46712239,17.68099474,19.40244671,21.74425743,23.40801143,24.77716335,27.33166687,29.48237214\n2,170.5,-1.984437954,19.45204465,0.151206347,15.52516693,15.89174721,16.51042098,17.72675499,19.45204465,21.79988774,23.46861112,24.8423432,27.40673363,29.56728511\n2,171.5,-1.988483106,19.50135548,0.151168902,15.56660919,15.93384595,16.55365778,17.7723572,19.50135548,21.855078,23.52868458,24.90694389,27.4811763,29.65160263\n2,172.5,-1.992764085,19.55036888,0.151123398,15.60805429,15.97591819,16.59681886,17.81778887,19.55036888,21.90982109,23.5882272,24.97096308,27.55499753,29.73533271\n2,173.5,-1.997276103,19.59907464,0.15107018,15.64948704,16.01794916,16.63989017,17.86303751,19.59907464,21.96411019,23.64723476,25.03439887,27.62820049,29.81848403\n2,174.5,-2.002014224,19.64746266,0.151009595,15.69089206,16.05992392,16.68285759,17.90809056,19.64746266,22.01793871,23.70570337,25.09724977,27.70078892,29.90106591\n2,175.5,-2.00697335,19.69552294,0.150942,15.73225378,16.10182739,16.72570683,17.95293549,19.69552294,22.07130033,23.76362952,25.15951476,27.77276709,29.9830883\n2,176.5,-2.012148213,19.7432456,0.150867753,15.77355644,16.14364432,16.76842355,17.99755974,19.7432456,22.12418902,23.82101004,25.22119319,27.84413981,30.06456182\n2,177.5,-2.017533363,19.79062086,0.150787221,15.8147841,16.1853593,16.81099326,18.04195071,19.79062086,22.17659899,23.87784214,25.28228489,27.91491246,30.14549772\n2,178.5,-2.023123159,19.83763907,0.150700774,15.85592062,16.22695676,16.85340136,18.08609581,19.83763907,22.22852472,23.93412338,25.3427901,27.98509093,30.22590789\n2,179.5,-2.028911755,19.88429066,0.150608788,15.89694967,16.26842096,16.89563315,18.12998242,19.88429066,22.27996095,23.98985168,25.40270949,28.05468167,30.30580486\n2,180.5,-2.034893091,19.9305662,0.150511645,15.93785473,16.30973602,16.93767383,18.17359792,19.9305662,22.33090272,24.04502533,25.46204417,28.12369169,30.3852018\n2,181.5,-2.041060881,19.97645636,0.150409731,15.97861909,16.35088587,16.97950845,18.21692964,19.97645636,22.3813453,24.09964299,25.52079568,28.19212851,30.46411251\n2,182.5,-2.047408604,20.02195192,0.15030344,16.01922586,16.3918543,17.02112198,18.25996492,20.02195192,22.43128425,24.15370368,25.578966,28.26000023,30.54255145\n2,183.5,-2.05392949,20.06704377,0.150193169,16.05965792,16.43262492,17.06249925,18.30269107,20.06704377,22.4807154,24.20720678,25.63655753,28.32731547,30.62053368\n2,184.5,-2.060616513,20.11172291,0.150079322,16.09989799,16.47318119,17.10362501,18.34509539,20.11172291,22.52963484,24.26015204,25.69357313,28.3940834,30.69807493\n2,185.5,-2.067462375,20.15598047,0.149962308,16.13992859,16.5135064,17.14448385,18.38716515,20.15598047,22.57803895,24.3125396,25.75001608,28.46031375,30.77519152\n2,186.5,-2.074459502,20.19980767,0.14984254,16.17973203,16.55358366,17.18506029,18.42888762,20.19980767,22.62592435,24.36436993,25.80589011,28.52601678,30.85190042\n2,187.5,-2.081600029,20.24319586,0.149720441,16.21929043,16.59339594,17.22533871,18.47025003,20.24319586,22.67328797,24.41564391,25.86119939,28.59120331,30.92821925\n2,188.5,-2.088875793,20.28613648,0.149596434,16.25858573,16.63292602,17.26530336,18.5112396,20.28613648,22.72012699,24.46636278,25.91594853,28.6558847,31.00416621\n2,189.5,-2.096278323,20.32862109,0.149470953,16.29759966,16.67215653,17.30493841,18.55184353,20.32862109,22.76643886,24.51652812,25.97014258,28.72007286,31.07976017\n2,190.5,-2.103798828,20.37064138,0.149344433,16.33631375,16.71106993,17.34422789,18.592049,20.37064138,22.81222132,24.56614194,26.02378703,28.78378025,31.15502058\n2,191.5,-2.111428194,20.41218911,0.149217319,16.37470935,16.74964852,17.38315572,18.63184317,20.41218911,22.85747235,24.61520657,26.07688783,28.84701989,31.22996756\n2,192.5,-2.119156972,20.45325617,0.14909006,16.4127676,16.78787442,17.4217057,18.67121316,20.45325617,22.90219024,24.66372475,26.12945136,28.90980533,31.30462183\n2,193.5,-2.126975375,20.49383457,0.14896311,16.45046946,16.82572959,17.4598615,18.7101461,20.49383457,22.94637354,24.71169957,26.18148447,28.97215071,31.37900471\n2,194.5,-2.134873266,20.5339164,0.148836931,16.48779567,16.86319583,17.49760671,18.74862906,20.5339164,22.99002104,24.75913451,26.23299442,29.03407069,31.45313817\n2,195.5,-2.142840157,20.57349387,0.148711989,16.52472682,16.90025476,17.53492476,18.78664912,20.57349387,23.03313184,24.80603342,26.28398896,29.0955805,31.5270448\n2,196.5,-2.150865204,20.61255929,0.148588757,16.56124326,16.93688787,17.57179899,18.82419331,20.61255929,23.07570528,24.85240053,26.33447627,29.15669594,31.6007478\n2,197.5,-2.158937201,20.65110506,0.148467715,16.59732518,16.97307644,17.60821261,18.86124863,20.65110506,23.11774099,24.89824041,26.38446498,29.21743336,31.67427098\n2,198.5,-2.167044578,20.6891237,0.148349348,16.63295257,17.00880162,17.64414872,18.89780209,20.6891237,23.15923885,24.94355805,26.43396418,29.27780966,31.74763877\n2,199.5,-2.175176987,20.72660728,0.14823412,16.6681059,17.04404492,17.67959061,18.93384056,20.72660728,23.2001981,24.98835785,26.48298259,29.33784232,31.8208776\n2,200.5,-2.183317362,20.76355011,0.148122614,16.70276277,17.07878553,17.71452019,18.96935117,20.76355011,23.24062188,25.03264836,26.53153263,29.39754939,31.89400908\n2,201.5,-2.191457792,20.79994337,0.148015249,16.73690461,17.11300574,17.74892115,19.00432062,20.79994337,23.28050814,25.07643282,26.57962232,29.45694948,31.96706354\n2,202.5,-2.199583649,20.83578051,0.147912564,16.77050999,17.14668547,17.78277581,19.03873583,20.83578051,23.31985872,25.11971866,26.62726338,29.51606178,32.04006655\n2,203.5,-2.207681525,20.87105449,0.147815078,16.80355796,17.17980508,17.81606667,19.07258364,20.87105449,23.35867482,25.16251271,26.67446717,29.57490604,32.11304561\n2,204.5,-2.215737645,20.90575839,0.147723315,16.83602739,17.21234472,17.8487761,19.10585083,20.90575839,23.39695789,25.20482218,26.7212455,29.63350259,32.18602887\n2,205.5,-2.223739902,20.93988477,0.147637768,16.86789789,17.24428517,17.88088689,19.13852417,20.93988477,23.43470854,25.24665348,26.76760965,29.69187236,32.25904682\n2,206.5,-2.231667995,20.97342858,0.147559083,16.89914528,17.27560407,17.91237975,19.1705904,20.97342858,23.4719319,25.28801794,26.81357526,29.75003682,32.33212376\n2,207.5,-2.239511942,21.00638171,0.147487716,16.92975012,17.30628297,17.9432379,19.20203617,21.00638171,23.50862756,25.32892108,26.85915312,29.80801808,32.40529387\n2,208.5,-2.247257081,21.0387374,0.14742421,16.95969079,17.33630159,17.97344339,19.23284815,21.0387374,23.54479768,25.3693713,26.90435663,29.8658388,32.47858818\n2,209.5,-2.254885145,21.07048996,0.147369174,16.98894397,17.36563825,18.00297732,19.26301292,21.07048996,23.58044651,25.40937929,26.94920132,29.92352223,32.55203545\n2,210.5,-2.26238209,21.10163241,0.147323144,17.01748828,17.39427286,18.03182181,19.29251705,21.10163241,23.61557603,25.44895346,26.9937009,29.98109225,32.62566902\n2,211.5,-2.269731517,21.13215845,0.147286698,17.0453012,17.42218439,18.05995835,19.32134706,21.13215845,23.65018962,25.48810377,27.03787056,30.03857329,32.69952105\n2,212.5,-2.276917229,21.16206171,0.147260415,17.07236026,17.44935184,18.08736842,19.34948942,21.16206171,23.68429059,25.52684029,27.08172575,30.09599042,32.77362474\n2,213.5,-2.283925442,21.1913351,0.147244828,17.09864412,17.47575509,18.11403409,19.37693055,21.1913351,23.71788103,25.56517184,27.12528094,30.15336926,32.84801632\n2,214.5,-2.290731442,21.21997472,0.147240683,17.12412619,17.50136974,18.13993458,19.4036568,21.21997472,23.75096919,25.603114,27.16855668,30.21073618,32.92272296\n2,215.5,-2.29732427,21.24797262,0.147248467,17.14878634,17.52617667,18.16505254,19.4296545,21.24797262,23.78355579,25.64067435,27.21156668,30.26811799,32.9977851\n2,216.5,-2.303687802,21.27532239,0.14726877,17.17260194,17.55015468,18.18936927,19.45490996,21.27532239,23.81564452,25.67786376,27.25432769,30.32554216,33.07323931\n2,217.5,-2.309799971,21.30201933,0.147302299,17.19554744,17.57328018,18.21286444,19.47940934,21.30201933,23.84724252,25.714697,27.29685999,30.38303689,33.14911749\n2,218.5,-2.315651874,21.32805489,0.147349514,17.21760352,17.59553468,18.23552108,19.50313889,21.32805489,23.8783497,25.75118107,27.33917721,30.44063073,33.22546443\n2,219.5,-2.32121731,21.35342563,0.147411215,17.23874246,17.61689275,18.25731763,19.52608462,21.35342563,23.90897582,25.7873338,27.38130268,30.49835324,33.30230965\n2,220.5,-2.326481911,21.37812462,0.147487979,17.25894211,17.63733356,18.27823552,19.54823263,21.37812462,23.93912415,25.82316611,27.42325378,30.55623433,33.37969431\n2,221.5,-2.331428139,21.40214589,0.147580453,17.2781787,17.6568349,18.29825524,19.5695689,21.40214589,23.96879993,25.85869115,27.46505002,30.61430463,33.45765732\n2,222.5,-2.336038473,21.42548351,0.147689289,17.29642829,17.67537444,18.31735722,19.59007937,21.42548351,23.99800858,25.89392241,27.50671138,30.67259539,33.53623826\n2,223.5,-2.34029545,21.44813156,0.14781515,17.31366688,17.69292976,18.33552175,19.60974989,21.44813156,24.02675569,25.92887369,27.54825824,30.73113849,33.61547736\n2,224.5,-2.344181703,21.47008412,0.147958706,17.32987032,17.70947829,18.35272903,19.62856629,21.47008412,24.05504702,25.96355908,27.58971144,30.78996648,33.69541553\n2,225.5,-2.34768,21.49133529,0.148120633,17.34501435,17.72499741,18.36895919,19.64651429,21.49133529,24.08288851,25.99799301,27.63109226,30.84911253,33.77609435\n2,226.5,-2.350773286,21.51187918,0.148301619,17.35907462,17.73946435,18.38419225,19.66357958,21.51187918,24.11028624,26.03219019,27.67242239,30.90861047,33.8575561\n2,227.5,-2.353444725,21.53170989,0.148502355,17.37202667,17.75285625,18.39840811,19.67974776,21.53170989,24.13724646,26.06616563,27.71372396,30.96849476,33.93984372\n2,228.5,-2.355677743,21.55082155,0.148723546,17.38384594,17.76515018,18.41158663,19.69500438,21.55082155,24.16377555,26.09993465,27.75501954,31.02880054,34.02300086\n2,229.5,-2.35745607,21.56920824,0.148965902,17.39450778,17.77632308,18.42370753,19.70933491,21.56920824,24.18988006,26.13351285,27.7963321,31.08956357,34.10707184\n2,230.5,-2.358763788,21.58686406,0.149230142,17.40398745,17.78635182,18.43475047,19.72272474,21.58686406,24.21556667,26.16691611,27.83768505,31.1508203,34.1921017\n2,231.5,-2.359585369,21.60378309,0.149516994,17.41226013,17.79521318,18.44469501,19.73515921,21.60378309,24.24084219,26.20016061,27.87910223,31.21260782,34.27813617\n2,232.5,-2.359905726,21.61995939,0.149827195,17.41930091,17.80288385,18.45352064,19.74662357,21.61995939,24.26571357,26.23326279,27.92060786,31.27496389,34.3652217\n2,233.5,-2.359710258,21.635387,0.150161492,17.42508482,17.80934044,18.46120675,19.757103,21.635387,24.29018788,26.26623937,27.9622266,31.33792691,34.45340544\n2,234.5,-2.358980464,21.65006126,0.150520734,17.42958448,17.81455755,18.46773133,19.76658246,21.65006126,24.31427499,26.29911039,28.00398629,31.40153631,34.54273066\n2,235.5,-2.357714508,21.6639727,0.150905439,17.43278087,17.81851675,18.47307706,19.77504736,21.6639727,24.33797514,26.33188509,28.04590512,31.46583097,34.6332581\n2,236.5,-2.355892424,21.67711736,0.151316531,17.43464513,17.82119134,18.47722102,19.78248242,21.67711736,24.3613,26.36458581,28.08801335,31.53085181,34.72502979\n2,237.5,-2.353501353,21.68948935,0.151754808,17.43515168,17.82255737,18.48014209,19.78887249,21.68948935,24.3842575,26.39723077,28.13033767,31.59663995,34.81809511\n2,238.5,-2.350528726,21.70108288,0.152221086,17.43427465,17.8225906,18.48181892,19.79420232,21.70108288,24.40685591,26.42983873,28.17290543,31.66323724,34.91250374\n2,239.5,-2.346962247,21.71189225,0.152716206,17.43198786,17.82126653,18.48222995,19.79845655,21.71189225,24.42910393,26.4624291,28.21574476,31.73068625,35.00830552\n2,240,-2.34495843,21.71699934,0.152974718,17.43031075,17.82009046,18.48195582,19.80017572,21.71699934,24.44009565,26.47871966,28.23727135,31.76474311,35.05675093\n2,240.5,-2.342796948,21.72190973,0.153240872,17.42826863,17.81856356,18.48135557,19.80161999,21.72190973,24.45100622,26.49501679,28.25887983,31.79902964,35.10555822\n"; // bmiForAge is an object which wraps a multi-level map from
// Sex => HalfMonths => (L, M, S) values. These are parsed from bimagerev.
//
// The .data JSON looks like something like this:
//   { 1: {48: {"L": -2.01118107, "M": 16.57502768, "S" 0.080592465], ... }
//
// If you want the LMS values for a 24 month old boy, you would write:
//   let {L,M,S} = bmiForAge.Get(Sex.Male, 24)

var bmiForAge = {
  data: bmiagerev.split('\n').reduce(function (bmiForAge, line, lineno) {
    if (line === '') {
      // skip blank lines
      return bmiForAge;
    }

    var _line$split = line.split(','),
        _line$split2 = _slicedToArray(_line$split, 5),
        sex = _line$split2[0],
        agemos = _line$split2[1],
        l = _line$split2[2],
        m = _line$split2[3],
        s = _line$split2[4];

    if (sex === 'Sex') {
      // skip header
      return bmiForAge;
    }

    sex = sex === '1' ? Sex.Male : Sex.Female;
    bmiForAge[sex][parseFloat(agemos)] = {
      L: parseFloat(l),
      M: parseFloat(m),
      S: parseFloat(s)
    };
    return bmiForAge;
  }, (_bmiagerev$split$redu = {}, _defineProperty(_bmiagerev$split$redu, Sex.Male, {}), _defineProperty(_bmiagerev$split$redu, Sex.Female, {}), _bmiagerev$split$redu)),
  Get: function Get(sex, agemos) {
    if (agemos === 24) {
      return bmiForAge.data[sex][24];
    }

    var adjusted = parseInt(agemos) + 0.5;
    return bmiForAge.data[sex][adjusted];
  }
};
module.exports = {
  BMIAdult: BMIAdult,
  BMIZscore: BMIZscore,
  Sex: Sex
};

},{"assert":1}],8:[function(require,module,exports){
"use strict";

/*
   Copyright 2019 University of Florida

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var assert = require('assert');

var RaceEthnicity = {
  Black: 'BLACK',
  Hispanic: 'HISPANIC',
  White: 'WHITE'
};
var Sex = {
  Female: 'FEMALE',
  Male: 'MALE'
};

function CalculateMSS(args) {
  var log = Math.log;
  assert(args, 'missing all arguments');
  var age = args.age,
      sex = args.sex,
      race = args.race,
      bmi = args.bmi,
      hdl = args.hdl,
      sbp = args.sbp,
      triglyceride = args.triglyceride,
      glucose = args.glucose,
      bmiZScore = args.bmiZScore,
      waist = args.waist;
  age = parseInt(args.age);
  assert(age >= 0, 'age must be a non-negative integer');
  assert(Object.keys(Sex).some(function (s) {
    return Sex[s] === sex;
  }), 'sex must be FEMALE or MALE');
  assert(Object.keys(RaceEthnicity).some(function (r) {
    return RaceEthnicity[r] === race;
  }), 'race must be BLACK, HISPANIC, or WHITE');

  if (age >= 20) {
    /* Adults */
    if (sex === Sex.Female) {
      switch (race) {
        case RaceEthnicity.Black:
          return {
            mets_z_bmi: bmi ? -6.7982 + 0.0484 * bmi - 0.0108 * hdl + 0.0073 * sbp + 0.5278 * log(triglyceride) + 0.0281 * glucose : null,
            mets_z_wc: waist ? -7.1913 + 0.0304 * waist - 0.0095 * hdl + 0.0054 * sbp + 0.4455 * log(triglyceride) + 0.0225 * glucose : null
          };

        case RaceEthnicity.Hispanic:
          return {
            mets_z_bmi: bmi ? -7.1844 + 0.0333 * bmi - 0.0166 * hdl + 0.0085 * sbp + 0.8625 * log(triglyceride) + 0.0221 * glucose : null,
            mets_z_wc: waist ? -7.7641 + 0.0162 * waist - 0.0157 * hdl + 0.0084 * sbp + 0.8872 * log(triglyceride) + 0.0206 * glucose : null
          };

        case RaceEthnicity.White:
          return {
            mets_z_bmi: bmi ? -6.5231 + 0.0523 * bmi - 0.0138 * hdl + 0.0081 * sbp + 0.6125 * log(triglyceride) + 0.0208 * glucose : null,
            mets_z_wc: waist ? -7.2591 + 0.0254 * waist - 0.0120 * hdl + 0.0075 * sbp + 0.5800 * log(triglyceride) + 0.0203 * glucose : null
          };
      }
    }
    /* Male */


    switch (race) {
      case RaceEthnicity.Black:
        // Adult Male Black Non-Hispanic
        return {
          mets_z_bmi: bmi ? -4.8134 + 0.0460 * bmi - 0.0233 * hdl + 0.0020 * sbp + 0.5983 * log(triglyceride) + 0.0166 * glucose : null,
          mets_z_wc: waist ? -6.3767 + 0.0232 * waist - 0.0175 * hdl + 0.0040 * sbp + 0.5400 * log(triglyceride) + 0.0203 * glucose : null
        };

      case RaceEthnicity.Hispanic:
        // Adult Male Hispanic
        return {
          mets_z_bmi: bmi ? -4.8198 + 0.0355 * bmi - 0.0303 * hdl + 0.0051 * sbp + 0.7835 * log(triglyceride) + 0.0104 * glucose : null,
          mets_z_wc: waist ? -5.5541 + 0.0135 * waist - 0.0278 * hdl + 0.0054 * sbp + 0.8340 * log(triglyceride) + 0.0105 * glucose : null
        };

      case RaceEthnicity.White:
        // Adult Male White Non-Hispanic
        return {
          mets_z_bmi: bmi ? -4.8316 + 0.0315 * bmi - 0.0272 * hdl + 0.0044 * sbp + 0.8018 * log(triglyceride) + 0.0101 * glucose : null,
          mets_z_wc: waist ? -5.4559 + 0.0125 * waist - 0.0251 * hdl + 0.0047 * sbp + 0.8244 * log(triglyceride) + 0.0106 * glucose : null
        };
    }
  }
  /* Adolescents */


  if (sex === Sex.Female) {
    switch (race) {
      case RaceEthnicity.Black:
        return {
          mets_z_bmi: bmiZScore ? -3.7145 + 0.5136 * bmiZScore - 0.0190 * hdl + 0.0131 * sbp + 0.4442 * log(triglyceride) + 0.0108 * glucose : null
        };

      case RaceEthnicity.Hispanic:
        return {
          mets_z_bmi: bmiZScore ? -4.7637 + 0.3520 * bmiZScore - 0.0263 * hdl + 0.0152 * sbp + 0.6910 * log(triglyceride) + 0.0133 * glucose : null
        };

      case RaceEthnicity.White:
        return {
          mets_z_bmi: bmiZScore ? -4.3757 + 0.4849 * bmiZScore - 0.0176 * hdl + 0.0257 * sbp + 0.3172 * log(triglyceride) + 0.0083 * glucose : null
        };
    }
  }
  /* Male */


  switch (race) {
    case RaceEthnicity.Black:
      return {
        mets_z_bmi: -4.7544 + 0.2401 * bmiZScore - 0.0284 * hdl + 0.0134 * sbp + 0.6773 * log(triglyceride) + 0.0179 * glucose
      };

    case RaceEthnicity.Hispanic:
      return {
        mets_z_bmi: -3.2971 + 0.2930 * bmiZScore - 0.0315 * hdl + 0.0109 * sbp + 0.6137 * log(triglyceride) + 0.0095 * glucose
      };

    case RaceEthnicity.White:
      return {
        mets_z_bmi: -4.931 + 0.2804 * bmiZScore - 0.0257 * hdl + 0.0189 * sbp + 0.6240 * log(triglyceride) + 0.0140 * glucose
      };
  }
} // Percentile calculates the percentile from the specified z-score, z. This can
// be used for both the BMI and MetS percenitles.
// https://github.com/travm/ZMI/blob/5340e9d194cc716dd4cf9ff7b5ae479e915798a5/app/js/zmi.js +194


function Percentile(z) {
  return 100 * (1 / (1 + Math.exp(-0.07056 * Math.pow(z, 3) - 1.5976 * z)));
}

module.exports = {
  CalculateMSS: CalculateMSS,
  Percentile: Percentile,
  RaceEthnicity: RaceEthnicity,
  Sex: Sex
};

},{"assert":1}],9:[function(require,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

/*
   Copyright 2019 University of Florida

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var React = window.React || require('react');

var ReactDOM = window.ReactDOM || require('react-dom');

var moment = window.moment || require('moment');

var msscalc = require('./msscalc');

var bmi = require('./bmi');

var Calculator =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Calculator, _React$Component);

  function Calculator(props) {
    var _this;

    _classCallCheck(this, Calculator);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Calculator).call(this, props));
    _this.state = {
      age: null,
      sex: '',
      race: '',
      hdl: '',
      sbp: '',
      triglyceride: '',
      glucose: '',
      waist: '',
      waistUnit: 'cm',
      weight: '',
      weightUnit: 'kg',
      height: '',
      heightUnit: 'cm',
      bmiadult: '',
      bmiz: '',
      birth: '',
      appointment: moment().format(moment.HTML5_FMT.DATE),
      result: null
    };
    _this.handleBack = _this.handleBack.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.handleClick = _this.handleClick.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.handleSubmit = _this.handleSubmit.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.afterUpdate = _this.afterUpdate.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(Calculator, [{
    key: "render",
    value: function render() {
      var _this$state = this.state,
          age = _this$state.age,
          sex = _this$state.sex,
          race = _this$state.race,
          weight = _this$state.weight,
          weightUnit = _this$state.weightUnit,
          height = _this$state.height,
          heightUnit = _this$state.heightUnit,
          hdl = _this$state.hdl,
          sbp = _this$state.sbp,
          triglyceride = _this$state.triglyceride,
          glucose = _this$state.glucose,
          waist = _this$state.waist,
          waistUnit = _this$state.waistUnit,
          bmiadult = _this$state.bmiadult,
          bmiz = _this$state.bmiz,
          birth = _this$state.birth,
          appointment = _this$state.appointment,
          result = _this$state.result;
      var adolescent = age !== null && age < 20;
      return React.createElement("form", {
        onSubmit: this.handleSubmit
      }, React.createElement("h3", null, "Demographics"), React.createElement("div", {
        className: "form-group"
      }, React.createElement("label", {
        htmlFor: "birth"
      }, "Birthdate ", React.createElement("em", null, "(if younger than 20 years old)")), React.createElement("input", {
        className: "form-control",
        type: "date",
        name: "birth",
        value: birth,
        placeholder: "Ex. 1984-12-23",
        onChange: this.handleChange
      })), birth && React.createElement("div", {
        className: "form-group"
      }, React.createElement("label", {
        htmlFor: "appointment"
      }, "Appointment Date"), React.createElement("input", {
        className: "form-control",
        type: "date",
        name: "appointment",
        value: appointment,
        onChange: this.handleChange
      })), birth && appointment && React.createElement("div", {
        className: "form-group"
      }, React.createElement("label", {
        htmlFor: "age"
      }, "Age at Appointment (years)"), React.createElement("input", {
        className: "form-control",
        name: "age",
        type: "number",
        readOnly: true,
        value: age === null ? '' : age
      })), React.createElement(ButtonGroup, {
        name: "sex",
        label: "Sex",
        value: sex,
        required: true,
        options: msscalc.Sex,
        onClick: this.handleClick
      }), React.createElement(ButtonGroup, {
        name: "race",
        label: "Race and Ethnicity",
        value: race,
        required: true,
        options: {
          'Hispanic': msscalc.RaceEthnicity.Hispanic,
          'Non-Hispanic Black': msscalc.RaceEthnicity.Black,
          'Non-Hispanic White': msscalc.RaceEthnicity.White
        },
        onClick: this.handleClick
      }), React.createElement("h3", null, "Measurements"), React.createElement("div", {
        className: "form-group"
      }, React.createElement("label", {
        htmlFor: "height"
      }, "Height"), React.createElement(Measurement, {
        name: "height",
        value: height,
        unit: heightUnit,
        min: "0",
        required: true,
        onValueChange: this.handleChange,
        onUnitChange: this.handleChange,
        units: {
          cm: 'Centimeters (cm)',
          in: 'Inches (in)'
        }
      })), React.createElement("label", {
        htmlFor: "weight"
      }, "Weight"), React.createElement(Measurement, {
        name: "weight",
        value: weight,
        unit: weightUnit,
        min: "0",
        required: true,
        onValueChange: this.handleChange,
        onUnitChange: this.handleChange,
        units: {
          kg: 'Kilograms (kg)',
          lbs: 'Pounds (lbs)'
        }
      }), !adolescent && React.createElement("div", {
        className: "form-group"
      }, React.createElement("label", {
        htmlFor: "waist"
      }, "Waist Circumference ", React.createElement("em", null, "(if available)")), React.createElement(Measurement, {
        name: "waist",
        value: waist,
        unit: waistUnit,
        min: "0",
        onValueChange: this.handleChange,
        onUnitChange: this.handleChange,
        units: {
          cm: 'Centimeters (cm)',
          in: 'Inches (in)'
        }
      })), bmiadult && React.createElement("div", {
        className: "form-group"
      }, React.createElement("label", {
        htmlFor: "bmiadult"
      }, " BMI "), React.createElement("input", {
        className: "form-control",
        name: "bmiadult",
        value: bmiadult.toFixed(3),
        readOnly: true
      })), React.createElement("div", {
        className: "form-group"
      }, React.createElement("label", {
        htmlFor: "sbp"
      }, "Systolic Blood Pressure (mmHg)"), React.createElement("input", {
        className: "form-control",
        name: "sbp",
        type: "number",
        min: "0",
        required: true,
        step: "any",
        value: sbp,
        placeholder: "Ex: 120",
        onChange: this.handleChange
      })), React.createElement("h3", null, "Lab Values"), React.createElement("div", {
        className: "form-group"
      }, React.createElement("label", {
        htmlFor: "hdl"
      }, React.createElement("abbr", {
        title: "High-density lipoprotein"
      }, "HDL"), " (mg/dL)"), React.createElement("input", {
        className: "form-control",
        name: "hdl",
        type: "number",
        required: true,
        min: "0",
        step: "any",
        value: hdl,
        placeholder: "Ex: 50",
        onChange: this.handleChange
      })), React.createElement("div", {
        className: "form-group"
      }, React.createElement("label", {
        htmlFor: "triglyceride"
      }, "Triglycerides (mg/dL)"), React.createElement("input", {
        className: "form-control",
        name: "triglyceride",
        type: "number",
        min: "0",
        step: "any",
        required: true,
        value: triglyceride,
        placeholder: "Ex: 120",
        onChange: this.handleChange
      })), React.createElement("div", {
        className: "form-group"
      }, React.createElement("label", {
        htmlFor: "glucose"
      }, "Fasting Glucose (mg/dL)"), React.createElement("input", {
        className: "form-control",
        name: "glucose",
        type: "number",
        min: "0",
        step: "any",
        required: true,
        value: glucose,
        placeholder: "Ex: 75",
        onChange: this.handleChange
      })), !result && React.createElement("button", {
        type: "submit",
        className: "btn btn-primary float-right"
      }, "Calculate"), result && React.createElement("div", {
        className: "result"
      }, React.createElement("h2", null, "Results"), React.createElement("div", {
        className: "row"
      }, adolescent && bmiz && React.createElement("div", {
        className: "col-sm"
      }, React.createElement("p", null, "BMI Z-Score for Adolescents", React.createElement("span", {
        className: "amount"
      }, bmiz.toFixed(3))), React.createElement("p", null, "BMI Percentile for Adolescents", React.createElement("span", {
        className: "amount"
      }, msscalc.Percentile(bmiz).toFixed(2), "%"))), React.createElement("div", {
        className: "col-sm"
      }, result.mets_z_bmi && React.createElement("p", null, "MetS Z-Score based on Body Mass Index", React.createElement("span", {
        className: "amount"
      }, result.mets_z_bmi.toFixed(3))), result.mets_z_bmi && React.createElement("p", null, "MetS Percentile based on Body Mass Index", React.createElement("span", {
        className: "amount"
      }, msscalc.Percentile(result.mets_z_bmi).toFixed(2), "%"))), result.mets_z_wc && React.createElement("div", {
        className: "col-sm"
      }, result.mets_z_wc && React.createElement("p", null, "MetS Z-Score based on Waistline", React.createElement("span", {
        className: "amount"
      }, result.mets_z_wc.toFixed(3))), result.mets_z_wc && React.createElement("p", null, "MetS Percentile based on Waistline", React.createElement("span", {
        className: "amount"
      }, msscalc.Percentile(result.mets_z_wc).toFixed(2), "%"))))));
    }
  }, {
    key: "handleBack",
    value: function handleBack(event) {
      event.preventDefault();
      this.setState({
        result: null
      });
    }
  }, {
    key: "handleChange",
    value: function handleChange(event) {
      var _this2 = this;

      event.persist();
      this.setState(_defineProperty({}, event.target.name, event.target.value), function () {
        _this2.afterUpdate();

        runValidator(event.target);
      });
    }
  }, {
    key: "handleClick",
    value: function handleClick(event) {
      var _this3 = this;

      var input;

      switch (event.target.tagName.toLowerCase()) {
        case 'input':
          input = event.target;
          break;

        case 'label':
          input = event.target.getElementsByTagName('input')[0];
          break;
      }

      if (!input) {
        return;
      }

      this.setState(_defineProperty({}, input.name, input.value), function () {
        _this3.afterUpdate();

        runValidator(input);
      });
    }
  }, {
    key: "handleSubmit",
    value: function handleSubmit(event) {
      event.preventDefault();
      var _this$state2 = this.state,
          age = _this$state2.age,
          bmiadult = _this$state2.bmiadult,
          sex = _this$state2.sex,
          race = _this$state2.race,
          hdl = _this$state2.hdl,
          sbp = _this$state2.sbp,
          triglyceride = _this$state2.triglyceride,
          glucose = _this$state2.glucose,
          waist = _this$state2.waist,
          waistUnit = _this$state2.waistUnit,
          birth = _this$state2.birth,
          appointment = _this$state2.appointment,
          bmiz = _this$state2.bmiz,
          weight = _this$state2.weight,
          height = _this$state2.height;

      if (!(sex && race && sbp && glucose && hdl && triglyceride) || !(weight && height || waist)) {
        alert('Please fill out the required fields.');
        return;
      }

      if (age !== null && age < 2) {
        alert('The age at appointment time must be at least 2 years old.');
        return;
      }

      var result = msscalc.CalculateMSS({
        age: age ? moment(appointment).diff(moment(birth), 'years') : 25,
        sex: sex,
        race: race,
        bmi: bmiadult,
        hdl: hdl,
        sbp: sbp,
        triglyceride: triglyceride,
        glucose: glucose,
        bmiZScore: bmiz,
        waist: waist && (age === null || age > 20) ? centimeters(waist, waistUnit) || null : null
      });
      this.setState({
        result: result
      });
    }
  }, {
    key: "afterUpdate",
    value: function afterUpdate() {
      var _this$state3 = this.state,
          birth = _this$state3.birth,
          appointment = _this$state3.appointment,
          weight = _this$state3.weight,
          weightUnit = _this$state3.weightUnit,
          height = _this$state3.height,
          heightUnit = _this$state3.heightUnit,
          sex = _this$state3.sex;
      var age = null;
      var bmiz = '';
      var bmiadult = '';

      if (birth && appointment) {
        age = moment(appointment).diff(moment(birth), 'years');
      }

      if (height && weight) {
        var weightKG = kilograms(weight, weightUnit);
        var heightMeters = meters(height, heightUnit);
        bmiadult = bmi.BMIAdult(weightKG, heightMeters);
        var adolescent = age !== null && age >= 2 && age < 20;

        if (adolescent && sex) {
          var agemos = moment(appointment).diff(moment(birth), 'months');
          var sexord = sex === 'MALE' ? bmi.Sex.Male : bmi.Sex.Female;
          bmiz = bmi.BMIZscore(weightKG, heightMeters, sexord, agemos);
        }
      }

      this.setState({
        age: age,
        bmiz: bmiz,
        bmiadult: bmiadult,
        result: null
      });
    }
  }]);

  return Calculator;
}(React.Component); // meters converts the length from units into meters.


function meters(length, units) {
  if (isNaN(parseFloat(length))) {
    console.error('length must be a number; got:', length);
    return null;
  }

  switch (units) {
    case 'm':
      return length;

    case 'cm':
      return length / 100;

    case 'in':
      // https://www.google.com/search?q=in+to+m
      return length / 39.37;
  }

  console.error("units must be 'm', 'cm', or 'in'; got:", units);
  return null;
}

function centimeters(length, units) {
  if (isNaN(parseFloat(length))) {
    console.error('length must be a number; got:', length);
    return null;
  }

  switch (units) {
    case 'cm':
      return length;

    case 'm':
      return length * 100;

    case 'in':
      // https://www.google.com/search?q=in+to+cm
      return length * 2.54;
  }

  console.error("units must be 'm', 'cm', or 'in'; got:", units);
  return null;
} // kilograms converts the mass from units into kilograms.


function kilograms(mass, units) {
  if (isNaN(parseFloat(mass))) {
    console.error('mass must be a number; got:', mass);
    return null;
  }

  switch (units) {
    case 'kg':
      return mass;

    case 'lbs':
      // See https://www.ngs.noaa.gov/PUBS_LIB/FedRegister/FRdoc59-5442.pdf
      return mass * 0.45359237;
  }

  console.error("units must be 'kg' or 'lbs'; got:", units);
  return null;
}

function runValidator(target) {
  if (!target.checkValidity || !target.reportValidity) {
    return;
  }

  if (!target.checkValidity()) {
    target.classList.add('is-invalid');
  } else {
    target.classList.remove('is-invalid');
  }

  target.reportValidity();
}

function ButtonGroup(props) {
  var name = props.name,
      label = props.label,
      options = props.options,
      value = props.value,
      required = props.required,
      onClick = props.onClick,
      onKeyPress = props.onKeyPress;

  if (!options || options.length === 0) {
    return null;
  }

  return React.createElement("div", {
    className: "form-group"
  }, React.createElement("label", {
    htmlFor: name
  }, label), React.createElement("div", {
    className: "input-group btn-group btn-group-toggle",
    "data-toggle": "buttons"
  }, Object.keys(options).map(function (label) {
    return React.createElement(Button, {
      key: label,
      required: required,
      group: name,
      label: label,
      value: options[label],
      pressed: value === options[label],
      onClick: onClick,
      onKeyPress: onKeyPress
    });
  })));
}

function Button(props) {
  var group = props.group,
      label = props.label,
      pressed = props.pressed,
      value = props.value,
      onClick = props.onClick,
      onKeyPress = props.onKeyPress,
      _props$required = props.required,
      required = _props$required === void 0 ? false : _props$required;
  return React.createElement("label", {
    className: "btn btn-light ".concat(pressed ? 'active' : ''),
    role: "button",
    checked: pressed,
    "aria-pressed": pressed,
    onClick: onClick,
    onKeyPress: onKeyPress
  }, React.createElement("input", {
    type: "radio",
    name: group,
    value: value,
    autoComplete: "off",
    required: required
  }), " ", label);
}

function Measurement(props) {
  var name = props.name,
      unit = props.unit,
      units = props.units,
      value = props.value,
      onValueChange = props.onValueChange,
      onUnitChange = props.onUnitChange,
      min = props.min,
      max = props.max,
      required = props.required;
  return React.createElement("div", {
    className: "Measurement input-group"
  }, React.createElement("input", {
    className: "form-control",
    name: name,
    type: "number",
    min: min,
    max: max,
    required: required,
    step: "any",
    value: value,
    onChange: onValueChange
  }), units && React.createElement("div", {
    className: "input-group-append"
  }, React.createElement("select", {
    className: "custom-select",
    value: unit,
    name: "".concat(name, "Unit"),
    onChange: onUnitChange
  }, Object.keys(units).map(function (key) {
    return React.createElement("option", {
      key: key,
      value: key
    }, units[key]);
  }))));
}

ReactDOM.render(React.createElement(Calculator, null), document.getElementById('calculator'));

function resizeBtnGroup() {
  var groups = document.getElementsByClassName('btn-group');
  var smallWindow = window.innerWidth < 500;

  for (var i = 0; i < groups.length; i++) {
    var group = groups[i];

    if (smallWindow) {
      group.classList.add('btn-group-vertical');
    } else {
      group.classList.remove('btn-group-vertical');
    }
  }
}

window.onresize = resizeBtnGroup;
resizeBtnGroup();

},{"./bmi":7,"./msscalc":8,"moment":5,"react":5,"react-dom":5}]},{},[9]);
