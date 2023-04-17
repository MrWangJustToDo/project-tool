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
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

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

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var FetchTimeOutError = /** @class */ (function (_super) {
    __extends(FetchTimeOutError, _super);
    function FetchTimeOutError(message) {
        return _super.call(this, message) || this;
    }
    return FetchTimeOutError;
}(Error));

var generateFetchWithTimeout = function (timeout) {
    return function () {
        var props = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            props[_i] = arguments[_i];
        }
        return __awaiter(void 0, void 0, void 0, function () {
            var promiseChain;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promiseChain = [fetch.apply(void 0, props)];
                        if (timeout) {
                            promiseChain.push(new Promise(function (_, reject) {
                                setTimeout(function () {
                                    reject(new FetchTimeOutError("".concat(timeout, " ms timeout to fetch")));
                                }, timeout);
                            }));
                        }
                        return [4 /*yield*/, Promise.race(promiseChain)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
};

/* eslint-disable @typescript-eslint/no-var-requires */
var buildFullPath = require("axios/lib/core/buildFullPath");
var settle = require("axios/lib/core/settle");
var defaults = require("axios/lib/defaults");
var buildURL = require("axios/lib/helpers/buildURL");
var isUndefined = require("axios/lib/utils").isUndefined;
function fetchAdapter(config) {
    return __awaiter(this, void 0, void 0, function () {
        var request, fetchPromise, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    request = null;
                    try {
                        request = createRequest$1(config);
                    }
                    catch (err) {
                        return [2 /*return*/, defaults.adapter(config)];
                    }
                    fetchPromise = getResponse(request, config);
                    return [4 /*yield*/, fetchPromise];
                case 1:
                    data = _a.sent();
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            if (data instanceof Error) {
                                reject(data);
                            }
                            else {
                                settle(resolve, reject, data);
                            }
                        })];
            }
        });
    });
}
/**
 * Fetch API stage two is to get response body. This function tries to retrieve
 * response body based on response's type
 */
function getResponse(request, config) {
    return __awaiter(this, void 0, void 0, function () {
        var stageOne, fetch, e_1, fetchHeaders, axiosHeaders, response, data, _a, e_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    fetch = generateFetchWithTimeout(config.timeout);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch(request)];
                case 2:
                    stageOne = _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _b.sent();
                    if (e_1 instanceof FetchTimeOutError) {
                        return [2 /*return*/, new axios.AxiosError(e_1.message, axios.AxiosError["ETIMEDOUT"], config, request)];
                    }
                    return [2 /*return*/, new axios.AxiosError(e_1 === null || e_1 === void 0 ? void 0 : e_1.message, axios.AxiosError["ERR_NETWORK"], config, request)];
                case 4:
                    fetchHeaders = new Headers(stageOne.headers);
                    axiosHeaders = {};
                    fetchHeaders.forEach(function (v, k) {
                        axiosHeaders[k] = v;
                    });
                    response = {
                        status: stageOne.status,
                        statusText: stageOne.statusText,
                        headers: axiosHeaders,
                        config: config,
                        request: request,
                        data: null,
                    };
                    _b.label = 5;
                case 5:
                    _b.trys.push([5, 15, , 16]);
                    if (!(stageOne.status >= 200 && stageOne.status !== 204)) return [3 /*break*/, 14];
                    _a = config.responseType;
                    switch (_a) {
                        case "arraybuffer": return [3 /*break*/, 6];
                        case "blob": return [3 /*break*/, 8];
                        case "json": return [3 /*break*/, 10];
                    }
                    return [3 /*break*/, 12];
                case 6: return [4 /*yield*/, stageOne.arrayBuffer()];
                case 7:
                    data = _b.sent();
                    return [3 /*break*/, 14];
                case 8: return [4 /*yield*/, stageOne.blob()];
                case 9:
                    data = _b.sent();
                    return [3 /*break*/, 14];
                case 10: return [4 /*yield*/, stageOne.json()];
                case 11:
                    data = _b.sent();
                    return [3 /*break*/, 14];
                case 12: return [4 /*yield*/, stageOne.text()];
                case 13:
                    data = _b.sent();
                    return [3 /*break*/, 14];
                case 14: return [3 /*break*/, 16];
                case 15:
                    e_2 = _b.sent();
                    return [2 /*return*/, new axios.AxiosError(e_2.message, axios.AxiosError["ERR_BAD_RESPONSE"], config, request, response)];
                case 16:
                    response.data = data;
                    return [2 /*return*/, response];
            }
        });
    });
}
/**
 * This function will create a Request object based on configuration's axios
 */
function createRequest$1(config) {
    var _a;
    if (typeof fetch === "undefined") {
        throw new Error("current env not have fetch function");
    }
    var headers = new Headers();
    var axiosHeaders = config.headers;
    if (axiosHeaders) {
        Object.keys(axiosHeaders).forEach(function (key) {
            var _a;
            headers.set(key, ((_a = axiosHeaders[key]) === null || _a === void 0 ? void 0 : _a.toString()) || "");
        });
    }
    // HTTP basic authentication
    if (config.auth) {
        var username = config.auth.username || "";
        var password = config.auth.password ? decodeURI(encodeURIComponent(config.auth.password)) : "";
        headers.set("Authorization", "Basic ".concat(btoa(username + ":" + password)));
    }
    var method = ((_a = config.method) === null || _a === void 0 ? void 0 : _a.toUpperCase()) || "GET";
    var options = {
        headers: headers,
        method: method,
    };
    if (method !== "GET" && method !== "HEAD") {
        options.body = config.data;
    }
    var fetchInternalProperties = ["mode", "cache", "integrity", "redirect", "referrer"];
    fetchInternalProperties.forEach(function (property) {
        var _a;
        if (Object.prototype.hasOwnProperty.call(config, property)) {
            Object.assign(options, (_a = {}, _a[property] = property, _a));
        }
    });
    // This config is similar to XHR’s withCredentials flag, but with three available values instead of two.
    // So if withCredentials is not set, default value 'same-origin' will be used
    if (!isUndefined(config.withCredentials)) {
        options.credentials = config.withCredentials ? "include" : "omit";
    }
    var fullPath = buildFullPath(config.baseURL, config.url);
    var url = buildURL(fullPath, config.params, config.paramsSerializer);
    // Expected browser to throw error if there is any wrong configuration value
    return new Request(url, options);
}

var __SERVER__ = typeof window === "undefined";

var serverLog = function (error) {
    if (__SERVER__ || false) {
        if (error instanceof axios.AxiosError) {
            var config = error.config, status_1 = error.status;
            console.error("[axios]: request error, url: ".concat(config === null || config === void 0 ? void 0 : config.baseURL).concat(config === null || config === void 0 ? void 0 : config.url, ", statusCode: ").concat(status_1, ", error: ").concat(error.message));
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
    var axiosInstance = axios.create(__assign({ method: method, timeout: timeout, adapter: fetchAdapter }, axiosConfig));
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

exports.FetchTimeOutError = FetchTimeOutError;
exports.createRequest = createRequest;
exports.generateFetchWithTimeout = generateFetchWithTimeout;
//# sourceMappingURL=index.production.js.map
