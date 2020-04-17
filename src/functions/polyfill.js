import 'url-search-params-polyfill'

if (!RegExp.escape) {
  RegExp.escape = function (s) {
    return String(s).replace(/[\\^$*+?.()|[\]{}]/g, '\\$&')
  }
}

if (!Promise.finally) {
  var globalNS = (function () {
    // the only reliable means to get the global object is
    // `Function('return this')()`
    // However, this causes CSP violations in Chrome apps.
    if (typeof self !== 'undefined') {
      return self
    }
    if (typeof window !== 'undefined') {
      return window
    }
    if (typeof global !== 'undefined') {
      return global
    }
    throw new Error('unable to locate global object')
  })()

  if (!('Promise' in globalNS)) {
    globalNS['Promise'] = Promise
  } else if (!globalNS.Promise.prototype['finally']) {
    globalNS.Promise.prototype['finally'] = function (callback) {
      var constructor = this.constructor
      return this.then(
        function (value) {
          // @ts-ignore
          return constructor.resolve(callback()).then(function () {
            return value
          })
        },
        function (reason) {
          // @ts-ignore
          return constructor.resolve(callback()).then(function () {
            // @ts-ignore
            return constructor.reject(reason)
          })
        }
      )
    }
  }
}
