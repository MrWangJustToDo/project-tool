'use strict';

var axios = require('axios');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var __SERVER__ = typeof window === "undefined";

var serverLog = function (error) {
    if (__SERVER__ || false) {
        if (error instanceof axios.AxiosError) {
            var config = error.config, status_1 = error.status;
            console.error("[axios]: request error, url: ".concat((config === null || config === void 0 ? void 0 : config.baseURL) || "").concat((config === null || config === void 0 ? void 0 : config.url) || "", ", statusCode: ").concat(status_1, ", error: ").concat(error.message));
        }
        else if (error instanceof Error) {
            console.error("[axios]: request error, message: ".concat(error.message));
        }
        else {
            console.error("[axios]: request error");
        }
    }
    throw error;
};

var BASE_TIME_OUT = 3000;
var BASE_REQUEST_INTERCEPTORS = [];
var BASE_RESPONSE_INTERCEPTORS = [[undefined, serverLog]];
function createRequest(_a) {
    if (_a === void 0) { _a = {}; }
    var _b = _a.method, method = _b === void 0 ? "get" : _b, _c = _a.timeout, timeout = _c === void 0 ? BASE_TIME_OUT : _c, _d = _a.requestInterceptors, requestInterceptors = _d === void 0 ? [] : _d, _e = _a.responseInterceptors, responseInterceptors = _e === void 0 ? [] : _e, axiosConfig = __rest(_a, ["method", "timeout", "requestInterceptors", "responseInterceptors"]);
    var axiosInstance = axios.create(__assign({ method: method, timeout: timeout, adapter: 'fetch' }, axiosConfig));
    var finalRequestInterceptors = BASE_REQUEST_INTERCEPTORS.concat(requestInterceptors);
    var finalResponseInterceptors = BASE_RESPONSE_INTERCEPTORS.concat(responseInterceptors);
    finalRequestInterceptors.forEach(function (interceptor) {
        var _a;
        return (_a = axiosInstance.interceptors.request).use.apply(_a, interceptor);
    });
    finalResponseInterceptors.forEach(function (interceptor) {
        var _a;
        return (_a = axiosInstance.interceptors.response).use.apply(_a, interceptor);
    });
    return axiosInstance;
}

exports.createRequest = createRequest;
//# sourceMappingURL=index.production.js.map
