(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[2849],{1674:function(e,r,n){"use strict";n.d(r,{BH:function(){return Deferred},LL:function(){return ErrorFactory},ZR:function(){return FirebaseError},zI:function(){return areCookiesEnabled},L:function(){return base64urlEncodeWithoutPadding},vZ:function(){return deepEqual},aH:function(){return getDefaultAppConfig},m9:function(){return getModularInstance},hl:function(){return isIndexedDBAvailable},eu:function(){return validateIndexedDBOpenable}});let getDefaultsFromPostinstall=()=>void 0;var l=n(2601);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let stringToByteArray$1=function(e){let r=[],n=0;for(let l=0;l<e.length;l++){let c=e.charCodeAt(l);c<128?r[n++]=c:(c<2048?r[n++]=c>>6|192:((64512&c)==55296&&l+1<e.length&&(64512&e.charCodeAt(l+1))==56320?(c=65536+((1023&c)<<10)+(1023&e.charCodeAt(++l)),r[n++]=c>>18|240,r[n++]=c>>12&63|128):r[n++]=c>>12|224,r[n++]=c>>6&63|128),r[n++]=63&c|128)}return r},byteArrayToString=function(e){let r=[],n=0,l=0;for(;n<e.length;){let c=e[n++];if(c<128)r[l++]=String.fromCharCode(c);else if(c>191&&c<224){let d=e[n++];r[l++]=String.fromCharCode((31&c)<<6|63&d)}else if(c>239&&c<365){let d=e[n++],f=e[n++],h=e[n++],g=((7&c)<<18|(63&d)<<12|(63&f)<<6|63&h)-65536;r[l++]=String.fromCharCode(55296+(g>>10)),r[l++]=String.fromCharCode(56320+(1023&g))}else{let d=e[n++],f=e[n++];r[l++]=String.fromCharCode((15&c)<<12|(63&d)<<6|63&f)}}return r.join("")},c={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:"function"==typeof atob,encodeByteArray(e,r){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();let n=r?this.byteToCharMapWebSafe_:this.byteToCharMap_,l=[];for(let r=0;r<e.length;r+=3){let c=e[r],d=r+1<e.length,f=d?e[r+1]:0,h=r+2<e.length,g=h?e[r+2]:0,b=c>>2,y=(3&c)<<4|f>>4,w=(15&f)<<2|g>>6,v=63&g;h||(v=64,d||(w=64)),l.push(n[b],n[y],n[w],n[v])}return l.join("")},encodeString(e,r){return this.HAS_NATIVE_SUPPORT&&!r?btoa(e):this.encodeByteArray(stringToByteArray$1(e),r)},decodeString(e,r){return this.HAS_NATIVE_SUPPORT&&!r?atob(e):byteArrayToString(this.decodeStringToByteArray(e,r))},decodeStringToByteArray(e,r){this.init_();let n=r?this.charToByteMapWebSafe_:this.charToByteMap_,l=[];for(let r=0;r<e.length;){let c=n[e.charAt(r++)],d=r<e.length,f=d?n[e.charAt(r)]:0;++r;let h=r<e.length,g=h?n[e.charAt(r)]:64;++r;let b=r<e.length,y=b?n[e.charAt(r)]:64;if(++r,null==c||null==f||null==g||null==y)throw new DecodeBase64StringError;let w=c<<2|f>>4;if(l.push(w),64!==g){let e=f<<4&240|g>>2;if(l.push(e),64!==y){let e=g<<6&192|y;l.push(e)}}}return l},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}};let DecodeBase64StringError=class DecodeBase64StringError extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}};let base64Encode=function(e){let r=stringToByteArray$1(e);return c.encodeByteArray(r,!0)},base64urlEncodeWithoutPadding=function(e){return base64Encode(e).replace(/\./g,"")},base64Decode=function(e){try{return c.decodeString(e,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function getGlobal(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if(void 0!==n.g)return n.g;throw Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let getDefaultsFromGlobal=()=>getGlobal().__FIREBASE_DEFAULTS__,getDefaultsFromEnvVariable=()=>{if(void 0===l||void 0===l.env)return;let e=l.env.__FIREBASE_DEFAULTS__;if(e)return JSON.parse(e)},getDefaultsFromCookie=()=>{let e;if("undefined"==typeof document)return;try{e=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch(e){return}let r=e&&base64Decode(e[1]);return r&&JSON.parse(r)},getDefaults=()=>{try{return getDefaultsFromPostinstall()||getDefaultsFromGlobal()||getDefaultsFromEnvVariable()||getDefaultsFromCookie()}catch(e){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);return}},getDefaultAppConfig=()=>{var e;return null===(e=getDefaults())||void 0===e?void 0:e.config};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Deferred=class Deferred{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,r)=>{this.resolve=e,this.reject=r})}wrapCallback(e){return(r,n)=>{r?this.reject(r):this.resolve(n),"function"==typeof e&&(this.promise.catch(()=>{}),1===e.length?e(r):e(r,n))}}};function isIndexedDBAvailable(){try{return"object"==typeof indexedDB}catch(e){return!1}}function validateIndexedDBOpenable(){return new Promise((e,r)=>{try{let n=!0,l="validate-browser-context-for-indexeddb-analytics-module",c=self.indexedDB.open(l);c.onsuccess=()=>{c.result.close(),n||self.indexedDB.deleteDatabase(l),e(!0)},c.onupgradeneeded=()=>{n=!1},c.onerror=()=>{var e;r((null===(e=c.error)||void 0===e?void 0:e.message)||"")}}catch(e){r(e)}})}function areCookiesEnabled(){return"undefined"!=typeof navigator&&!!navigator.cookieEnabled}let FirebaseError=class FirebaseError extends Error{constructor(e,r,n){super(r),this.code=e,this.customData=n,this.name="FirebaseError",Object.setPrototypeOf(this,FirebaseError.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,ErrorFactory.prototype.create)}};let ErrorFactory=class ErrorFactory{constructor(e,r,n){this.service=e,this.serviceName=r,this.errors=n}create(e,...r){let n=r[0]||{},l=`${this.service}/${e}`,c=this.errors[e],d=c?replaceTemplate(c,n):"Error",f=`${this.serviceName}: ${d} (${l}).`,h=new FirebaseError(l,f,n);return h}};function replaceTemplate(e,r){return e.replace(d,(e,n)=>{let l=r[n];return null!=l?String(l):`<${n}?>`})}let d=/\{\$([^}]+)}/g;function deepEqual(e,r){if(e===r)return!0;let n=Object.keys(e),l=Object.keys(r);for(let c of n){if(!l.includes(c))return!1;let n=e[c],d=r[c];if(isObject(n)&&isObject(d)){if(!deepEqual(n,d))return!1}else if(n!==d)return!1}for(let e of l)if(!n.includes(e))return!1;return!0}function isObject(e){return null!==e&&"object"==typeof e}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function getModularInstance(e){return e&&e._delegate?e._delegate:e}},2601:function(e,r,n){"use strict";var l,c;e.exports=(null==(l=n.g.process)?void 0:l.env)&&"object"==typeof(null==(c=n.g.process)?void 0:c.env)?n.g.process:n(8960)},3784:function(e){e.exports={style:{fontFamily:"'__Inter_d65c78', '__Inter_Fallback_d65c78'",fontStyle:"normal"},className:"__className_d65c78",variable:"__variable_d65c78"}},8960:function(e){!function(){var r={229:function(e){var r,n,l,c=e.exports={};function defaultSetTimout(){throw Error("setTimeout has not been defined")}function defaultClearTimeout(){throw Error("clearTimeout has not been defined")}function runTimeout(e){if(r===setTimeout)return setTimeout(e,0);if((r===defaultSetTimout||!r)&&setTimeout)return r=setTimeout,setTimeout(e,0);try{return r(e,0)}catch(n){try{return r.call(null,e,0)}catch(n){return r.call(this,e,0)}}}function runClearTimeout(e){if(n===clearTimeout)return clearTimeout(e);if((n===defaultClearTimeout||!n)&&clearTimeout)return n=clearTimeout,clearTimeout(e);try{return n(e)}catch(r){try{return n.call(null,e)}catch(r){return n.call(this,e)}}}!function(){try{r="function"==typeof setTimeout?setTimeout:defaultSetTimout}catch(e){r=defaultSetTimout}try{n="function"==typeof clearTimeout?clearTimeout:defaultClearTimeout}catch(e){n=defaultClearTimeout}}();var d=[],f=!1,h=-1;function cleanUpNextTick(){f&&l&&(f=!1,l.length?d=l.concat(d):h=-1,d.length&&drainQueue())}function drainQueue(){if(!f){var e=runTimeout(cleanUpNextTick);f=!0;for(var r=d.length;r;){for(l=d,d=[];++h<r;)l&&l[h].run();h=-1,r=d.length}l=null,f=!1,runClearTimeout(e)}}function Item(e,r){this.fun=e,this.array=r}function noop(){}c.nextTick=function(e){var r=Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)r[n-1]=arguments[n];d.push(new Item(e,r)),1!==d.length||f||runTimeout(drainQueue)},Item.prototype.run=function(){this.fun.apply(null,this.array)},c.title="browser",c.browser=!0,c.env={},c.argv=[],c.version="",c.versions={},c.on=noop,c.addListener=noop,c.once=noop,c.off=noop,c.removeListener=noop,c.removeAllListeners=noop,c.emit=noop,c.prependListener=noop,c.prependOnceListener=noop,c.listeners=function(e){return[]},c.binding=function(e){throw Error("process.binding is not supported")},c.cwd=function(){return"/"},c.chdir=function(e){throw Error("process.chdir is not supported")},c.umask=function(){return 0}}},n={};function __nccwpck_require__(e){var l=n[e];if(void 0!==l)return l.exports;var c=n[e]={exports:{}},d=!0;try{r[e](c,c.exports,__nccwpck_require__),d=!1}finally{d&&delete n[e]}return c.exports}__nccwpck_require__.ab="//";var l=__nccwpck_require__(229);e.exports=l}()},622:function(e,r,n){"use strict";/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var l=n(2265),c=Symbol.for("react.element"),d=Symbol.for("react.fragment"),f=Object.prototype.hasOwnProperty,h=l.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,g={key:!0,ref:!0,__self:!0,__source:!0};function q(e,r,n){var l,d={},b=null,y=null;for(l in void 0!==n&&(b=""+n),void 0!==r.key&&(b=""+r.key),void 0!==r.ref&&(y=r.ref),r)f.call(r,l)&&!g.hasOwnProperty(l)&&(d[l]=r[l]);if(e&&e.defaultProps)for(l in r=e.defaultProps)void 0===d[l]&&(d[l]=r[l]);return{$$typeof:c,type:e,key:b,ref:y,props:d,_owner:h.current}}r.Fragment=d,r.jsx=q,r.jsxs=q},7437:function(e,r,n){"use strict";e.exports=n(622)},4033:function(e,r,n){e.exports=n(94)},5460:function(e,r,n){"use strict";n.d(r,{qX:function(){return _getProvider},Xd:function(){return _registerComponent},Mq:function(){return getApp},ZF:function(){return initializeApp},KN:function(){return registerVersion}});var l,c,d=n(5538);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let f=[];(l=c||(c={}))[l.DEBUG=0]="DEBUG",l[l.VERBOSE=1]="VERBOSE",l[l.INFO=2]="INFO",l[l.WARN=3]="WARN",l[l.ERROR=4]="ERROR",l[l.SILENT=5]="SILENT";let h={debug:c.DEBUG,verbose:c.VERBOSE,info:c.INFO,warn:c.WARN,error:c.ERROR,silent:c.SILENT},g=c.INFO,b={[c.DEBUG]:"log",[c.VERBOSE]:"log",[c.INFO]:"info",[c.WARN]:"warn",[c.ERROR]:"error"},defaultLogHandler=(e,r,...n)=>{if(r<e.logLevel)return;let l=new Date().toISOString(),c=b[r];if(c)console[c](`[${l}]  ${e.name}:`,...n);else throw Error(`Attempted to log a message with an invalid logType (value: ${r})`)};let Logger=class Logger{constructor(e){this.name=e,this._logLevel=g,this._logHandler=defaultLogHandler,this._userLogHandler=null,f.push(this)}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in c))throw TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel="string"==typeof e?h[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if("function"!=typeof e)throw TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,c.DEBUG,...e),this._logHandler(this,c.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,c.VERBOSE,...e),this._logHandler(this,c.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,c.INFO,...e),this._logHandler(this,c.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,c.WARN,...e),this._logHandler(this,c.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,c.ERROR,...e),this._logHandler(this,c.ERROR,...e)}};var y=n(1674),w=n(8542);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let PlatformLoggerServiceImpl=class PlatformLoggerServiceImpl{constructor(e){this.container=e}getPlatformInfoString(){let e=this.container.getProviders();return e.map(e=>{if(!isVersionServiceProvider(e))return null;{let r=e.getImmediate();return`${r.library}/${r.version}`}}).filter(e=>e).join(" ")}};function isVersionServiceProvider(e){let r=e.getComponent();return(null==r?void 0:r.type)==="VERSION"}let v="@firebase/app",_="0.12.3",I=new Logger("@firebase/app"),E="[DEFAULT]",T={[v]:"fire-core","@firebase/app-compat":"fire-core-compat","@firebase/analytics":"fire-analytics","@firebase/analytics-compat":"fire-analytics-compat","@firebase/app-check":"fire-app-check","@firebase/app-check-compat":"fire-app-check-compat","@firebase/auth":"fire-auth","@firebase/auth-compat":"fire-auth-compat","@firebase/database":"fire-rtdb","@firebase/data-connect":"fire-data-connect","@firebase/database-compat":"fire-rtdb-compat","@firebase/functions":"fire-fn","@firebase/functions-compat":"fire-fn-compat","@firebase/installations":"fire-iid","@firebase/installations-compat":"fire-iid-compat","@firebase/messaging":"fire-fcm","@firebase/messaging-compat":"fire-fcm-compat","@firebase/performance":"fire-perf","@firebase/performance-compat":"fire-perf-compat","@firebase/remote-config":"fire-rc","@firebase/remote-config-compat":"fire-rc-compat","@firebase/storage":"fire-gcs","@firebase/storage-compat":"fire-gcs-compat","@firebase/firestore":"fire-fst","@firebase/firestore-compat":"fire-fst-compat","@firebase/vertexai":"fire-vertex","fire-js":"fire-js",firebase:"fire-js-all"},S=new Map,C=new Map,k=new Map;function _addComponent(e,r){try{e.container.addComponent(r)}catch(n){I.debug(`Component ${r.name} failed to register with FirebaseApp ${e.name}`,n)}}function _registerComponent(e){let r=e.name;if(k.has(r))return I.debug(`There were multiple attempts to register component ${r}.`),!1;for(let n of(k.set(r,e),S.values()))_addComponent(n,e);for(let r of C.values())_addComponent(r,e);return!0}function _getProvider(e,r){let n=e.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),e.container.getProvider(r)}let P=new y.LL("app","Firebase",{"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."});/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let FirebaseAppImpl=class FirebaseAppImpl{constructor(e,r,n){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},r),this._name=r.name,this._automaticDataCollectionEnabled=r.automaticDataCollectionEnabled,this._container=n,this.container.addComponent(new d.wA("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw P.create("app-deleted",{appName:this._name})}};function initializeApp(e,r={}){let n=e;if("object"!=typeof r){let e=r;r={name:e}}let l=Object.assign({name:E,automaticDataCollectionEnabled:!1},r),c=l.name;if("string"!=typeof c||!c)throw P.create("bad-app-name",{appName:String(c)});if(n||(n=(0,y.aH)()),!n)throw P.create("no-options");let f=S.get(c);if(f){if((0,y.vZ)(n,f.options)&&(0,y.vZ)(l,f.config))return f;throw P.create("duplicate-app",{appName:c})}let h=new d.H0(c);for(let e of k.values())h.addComponent(e);let g=new FirebaseAppImpl(n,l,h);return S.set(c,g),g}function getApp(e=E){let r=S.get(e);if(!r&&e===E&&(0,y.aH)())return initializeApp();if(!r)throw P.create("no-app",{appName:e});return r}function registerVersion(e,r,n){var l;let c=null!==(l=T[e])&&void 0!==l?l:e;n&&(c+=`-${n}`);let f=c.match(/\s|\//),h=r.match(/\s|\//);if(f||h){let e=[`Unable to register library "${c}" with version "${r}":`];f&&e.push(`library name "${c}" contains illegal characters (whitespace or "/")`),f&&h&&e.push("and"),h&&e.push(`version name "${r}" contains illegal characters (whitespace or "/")`),I.warn(e.join(" "));return}_registerComponent(new d.wA(`${c}-version`,()=>({library:c,version:r}),"VERSION"))}let B="firebase-heartbeat-store",N=null;function getDbPromise(){return N||(N=(0,w.X3)("firebase-heartbeat-database",1,{upgrade:(e,r)=>{if(0===r)try{e.createObjectStore(B)}catch(e){console.warn(e)}}}).catch(e=>{throw P.create("idb-open",{originalErrorMessage:e.message})})),N}async function readHeartbeatsFromIndexedDB(e){try{let r=await getDbPromise(),n=r.transaction(B),l=await n.objectStore(B).get(computeKey(e));return await n.done,l}catch(e){if(e instanceof y.ZR)I.warn(e.message);else{let r=P.create("idb-get",{originalErrorMessage:null==e?void 0:e.message});I.warn(r.message)}}}async function writeHeartbeatsToIndexedDB(e,r){try{let n=await getDbPromise(),l=n.transaction(B,"readwrite"),c=l.objectStore(B);await c.put(r,computeKey(e)),await l.done}catch(e){if(e instanceof y.ZR)I.warn(e.message);else{let r=P.create("idb-set",{originalErrorMessage:null==e?void 0:e.message});I.warn(r.message)}}}function computeKey(e){return`${e.name}!${e.options.appId}`}let HeartbeatServiceImpl=class HeartbeatServiceImpl{constructor(e){this.container=e,this._heartbeatsCache=null;let r=this.container.getProvider("app").getImmediate();this._storage=new HeartbeatStorageImpl(r),this._heartbeatsCachePromise=this._storage.read().then(e=>(this._heartbeatsCache=e,e))}async triggerHeartbeat(){var e,r;try{let n=this.container.getProvider("platform-logger").getImmediate(),l=n.getPlatformInfoString(),c=getUTCDateString();if((null===(e=this._heartbeatsCache)||void 0===e?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,(null===(r=this._heartbeatsCache)||void 0===r?void 0:r.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===c||this._heartbeatsCache.heartbeats.some(e=>e.date===c))return;if(this._heartbeatsCache.heartbeats.push({date:c,agent:l}),this._heartbeatsCache.heartbeats.length>30){let e=getEarliestHeartbeatIdx(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(e,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(e){I.warn(e)}}async getHeartbeatsHeader(){var e;try{if(null===this._heartbeatsCache&&await this._heartbeatsCachePromise,(null===(e=this._heartbeatsCache)||void 0===e?void 0:e.heartbeats)==null||0===this._heartbeatsCache.heartbeats.length)return"";let r=getUTCDateString(),{heartbeatsToSend:n,unsentEntries:l}=extractHeartbeatsForHeader(this._heartbeatsCache.heartbeats),c=(0,y.L)(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=r,l.length>0?(this._heartbeatsCache.heartbeats=l,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),c}catch(e){return I.warn(e),""}}};function getUTCDateString(){let e=new Date;return e.toISOString().substring(0,10)}function extractHeartbeatsForHeader(e,r=1024){let n=[],l=e.slice();for(let c of e){let e=n.find(e=>e.agent===c.agent);if(e){if(e.dates.push(c.date),countBytes(n)>r){e.dates.pop();break}}else if(n.push({agent:c.agent,dates:[c.date]}),countBytes(n)>r){n.pop();break}l=l.slice(1)}return{heartbeatsToSend:n,unsentEntries:l}}let HeartbeatStorageImpl=class HeartbeatStorageImpl{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return!!(0,y.hl)()&&(0,y.eu)().then(()=>!0).catch(()=>!1)}async read(){let e=await this._canUseIndexedDBPromise;if(!e)return{heartbeats:[]};{let e=await readHeartbeatsFromIndexedDB(this.app);return(null==e?void 0:e.heartbeats)?e:{heartbeats:[]}}}async overwrite(e){var r;let n=await this._canUseIndexedDBPromise;if(n){let n=await this.read();return writeHeartbeatsToIndexedDB(this.app,{lastSentHeartbeatDate:null!==(r=e.lastSentHeartbeatDate)&&void 0!==r?r:n.lastSentHeartbeatDate,heartbeats:e.heartbeats})}}async add(e){var r;let n=await this._canUseIndexedDBPromise;if(n){let n=await this.read();return writeHeartbeatsToIndexedDB(this.app,{lastSentHeartbeatDate:null!==(r=e.lastSentHeartbeatDate)&&void 0!==r?r:n.lastSentHeartbeatDate,heartbeats:[...n.heartbeats,...e.heartbeats]})}}};function countBytes(e){return(0,y.L)(JSON.stringify({version:2,heartbeats:e})).length}function getEarliestHeartbeatIdx(e){if(0===e.length)return -1;let r=0,n=e[0].date;for(let l=1;l<e.length;l++)e[l].date<n&&(n=e[l].date,r=l);return r}_registerComponent(new d.wA("platform-logger",e=>new PlatformLoggerServiceImpl(e),"PRIVATE")),_registerComponent(new d.wA("heartbeat",e=>new HeartbeatServiceImpl(e),"PRIVATE")),registerVersion(v,_,""),registerVersion(v,_,"esm2017"),registerVersion("fire-js","")},5538:function(e,r,n){"use strict";n.d(r,{H0:function(){return ComponentContainer},wA:function(){return Component}});var l=n(1674);let Component=class Component{constructor(e,r,n){this.name=e,this.instanceFactory=r,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let c="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Provider=class Provider{constructor(e,r){this.name=e,this.container=r,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){let r=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(r)){let e=new l.BH;if(this.instancesDeferred.set(r,e),this.isInitialized(r)||this.shouldAutoInitialize())try{let n=this.getOrInitializeService({instanceIdentifier:r});n&&e.resolve(n)}catch(e){}}return this.instancesDeferred.get(r).promise}getImmediate(e){var r;let n=this.normalizeInstanceIdentifier(null==e?void 0:e.identifier),l=null!==(r=null==e?void 0:e.optional)&&void 0!==r&&r;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(e){if(l)return null;throw e}else{if(l)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,this.shouldAutoInitialize()){if(isComponentEager(e))try{this.getOrInitializeService({instanceIdentifier:c})}catch(e){}for(let[e,r]of this.instancesDeferred.entries()){let n=this.normalizeInstanceIdentifier(e);try{let e=this.getOrInitializeService({instanceIdentifier:n});r.resolve(e)}catch(e){}}}}clearInstance(e=c){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){let e=Array.from(this.instances.values());await Promise.all([...e.filter(e=>"INTERNAL"in e).map(e=>e.INTERNAL.delete()),...e.filter(e=>"_delete"in e).map(e=>e._delete())])}isComponentSet(){return null!=this.component}isInitialized(e=c){return this.instances.has(e)}getOptions(e=c){return this.instancesOptions.get(e)||{}}initialize(e={}){let{options:r={}}=e,n=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(n))throw Error(`${this.name}(${n}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);let l=this.getOrInitializeService({instanceIdentifier:n,options:r});for(let[e,r]of this.instancesDeferred.entries()){let c=this.normalizeInstanceIdentifier(e);n===c&&r.resolve(l)}return l}onInit(e,r){var n;let l=this.normalizeInstanceIdentifier(r),c=null!==(n=this.onInitCallbacks.get(l))&&void 0!==n?n:new Set;c.add(e),this.onInitCallbacks.set(l,c);let d=this.instances.get(l);return d&&e(d,l),()=>{c.delete(e)}}invokeOnInitCallbacks(e,r){let n=this.onInitCallbacks.get(r);if(n)for(let l of n)try{l(e,r)}catch(e){}}getOrInitializeService({instanceIdentifier:e,options:r={}}){let n=this.instances.get(e);if(!n&&this.component&&(n=this.component.instanceFactory(this.container,{instanceIdentifier:normalizeIdentifierForFactory(e),options:r}),this.instances.set(e,n),this.instancesOptions.set(e,r),this.invokeOnInitCallbacks(n,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,n)}catch(e){}return n||null}normalizeInstanceIdentifier(e=c){return this.component?this.component.multipleInstances?e:c:e}shouldAutoInitialize(){return!!this.component&&"EXPLICIT"!==this.component.instantiationMode}};function normalizeIdentifierForFactory(e){return e===c?void 0:e}function isComponentEager(e){return"EAGER"===e.instantiationMode}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ComponentContainer=class ComponentContainer{constructor(e){this.name=e,this.providers=new Map}addComponent(e){let r=this.getProvider(e.name);if(r.isComponentSet())throw Error(`Component ${e.name} has already been registered with ${this.name}`);r.setComponent(e)}addOrOverwriteComponent(e){let r=this.getProvider(e.name);r.isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);let r=new Provider(e,this);return this.providers.set(e,r),r}getProviders(){return Array.from(this.providers.values())}}},994:function(e,r,n){"use strict";n.d(r,{ZF:function(){return l.ZF}});var l=n(5460);/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(0,l.KN)("firebase","11.7.3","app")},6690:function(e,r,n){"use strict";n.d(r,{KL:function(){return getMessagingInWindow},LP:function(){return index_esm2017_getToken},Gb:function(){return isWindowSupported},ps:function(){return onMessage}});var l,c,d,f,h=n(5460),g=n(5538),b=n(1674),y=n(8542);let w="@firebase/installations",v="0.6.16",_=`w:${v}`,I="FIS_v2",E=new b.LL("installations","Installations",{"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."});function isServerError(e){return e instanceof b.ZR&&e.code.includes("request-failed")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function getInstallationsEndpoint({projectId:e}){return`https://firebaseinstallations.googleapis.com/v1/projects/${e}/installations`}function extractAuthTokenInfoFromResponse(e){return{token:e.token,requestStatus:2,expiresIn:getExpiresInFromResponseExpiresIn(e.expiresIn),creationTime:Date.now()}}async function getErrorFromResponse(e,r){let n=await r.json(),l=n.error;return E.create("request-failed",{requestName:e,serverCode:l.code,serverMessage:l.message,serverStatus:l.status})}function getHeaders({apiKey:e}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":e})}function getHeadersWithAuth(e,{refreshToken:r}){let n=getHeaders(e);return n.append("Authorization",getAuthorizationHeader(r)),n}async function retryIfServerError(e){let r=await e();return r.status>=500&&r.status<600?e():r}function getExpiresInFromResponseExpiresIn(e){return Number(e.replace("s","000"))}function getAuthorizationHeader(e){return`${I} ${e}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function createInstallationRequest({appConfig:e,heartbeatServiceProvider:r},{fid:n}){let l=getInstallationsEndpoint(e),c=getHeaders(e),d=r.getImmediate({optional:!0});if(d){let e=await d.getHeartbeatsHeader();e&&c.append("x-firebase-client",e)}let f={fid:n,authVersion:I,appId:e.appId,sdkVersion:_},h={method:"POST",headers:c,body:JSON.stringify(f)},g=await retryIfServerError(()=>fetch(l,h));if(g.ok){let e=await g.json(),r={fid:e.fid||n,registrationStatus:2,refreshToken:e.refreshToken,authToken:extractAuthTokenInfoFromResponse(e.authToken)};return r}throw await getErrorFromResponse("Create Installation",g)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sleep(e){return new Promise(r=>{setTimeout(r,e)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bufferToBase64UrlSafe(e){let r=btoa(String.fromCharCode(...e));return r.replace(/\+/g,"-").replace(/\//g,"_")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let T=/^[cdef][\w-]{21}$/;function generateFid(){try{let e=new Uint8Array(17),r=self.crypto||self.msCrypto;r.getRandomValues(e),e[0]=112+e[0]%16;let n=encode(e);return T.test(n)?n:""}catch(e){return""}}function encode(e){let r=bufferToBase64UrlSafe(e);return r.substr(0,22)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function getKey(e){return`${e.appName}!${e.appId}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let S=new Map;function fidChanged(e,r){let n=getKey(e);callFidChangeCallbacks(n,r),broadcastFidChange(n,r)}function callFidChangeCallbacks(e,r){let n=S.get(e);if(n)for(let e of n)e(r)}function broadcastFidChange(e,r){let n=getBroadcastChannel();n&&n.postMessage({key:e,fid:r}),closeBroadcastChannel()}let C=null;function getBroadcastChannel(){return!C&&"BroadcastChannel"in self&&((C=new BroadcastChannel("[Firebase] FID Change")).onmessage=e=>{callFidChangeCallbacks(e.data.key,e.data.fid)}),C}function closeBroadcastChannel(){0===S.size&&C&&(C.close(),C=null)}let k="firebase-installations-store",P=null;function getDbPromise(){return P||(P=(0,y.X3)("firebase-installations-database",1,{upgrade:(e,r)=>{0===r&&e.createObjectStore(k)}})),P}async function set(e,r){let n=getKey(e),l=await getDbPromise(),c=l.transaction(k,"readwrite"),d=c.objectStore(k),f=await d.get(n);return await d.put(r,n),await c.done,f&&f.fid===r.fid||fidChanged(e,r.fid),r}async function remove(e){let r=getKey(e),n=await getDbPromise(),l=n.transaction(k,"readwrite");await l.objectStore(k).delete(r),await l.done}async function update(e,r){let n=getKey(e),l=await getDbPromise(),c=l.transaction(k,"readwrite"),d=c.objectStore(k),f=await d.get(n),h=r(f);return void 0===h?await d.delete(n):await d.put(h,n),await c.done,h&&(!f||f.fid!==h.fid)&&fidChanged(e,h.fid),h}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function getInstallationEntry(e){let r;let n=await update(e.appConfig,n=>{let l=updateOrCreateInstallationEntry(n),c=triggerRegistrationIfNecessary(e,l);return r=c.registrationPromise,c.installationEntry});return""===n.fid?{installationEntry:await r}:{installationEntry:n,registrationPromise:r}}function updateOrCreateInstallationEntry(e){let r=e||{fid:generateFid(),registrationStatus:0};return clearTimedOutRequest(r)}function triggerRegistrationIfNecessary(e,r){if(0===r.registrationStatus){if(!navigator.onLine){let e=Promise.reject(E.create("app-offline"));return{installationEntry:r,registrationPromise:e}}let n={fid:r.fid,registrationStatus:1,registrationTime:Date.now()},l=registerInstallation(e,n);return{installationEntry:n,registrationPromise:l}}return 1===r.registrationStatus?{installationEntry:r,registrationPromise:waitUntilFidRegistration(e)}:{installationEntry:r}}async function registerInstallation(e,r){try{let n=await createInstallationRequest(e,r);return set(e.appConfig,n)}catch(n){throw isServerError(n)&&409===n.customData.serverCode?await remove(e.appConfig):await set(e.appConfig,{fid:r.fid,registrationStatus:0}),n}}async function waitUntilFidRegistration(e){let r=await updateInstallationRequest(e.appConfig);for(;1===r.registrationStatus;)await sleep(100),r=await updateInstallationRequest(e.appConfig);if(0===r.registrationStatus){let{installationEntry:r,registrationPromise:n}=await getInstallationEntry(e);return n||r}return r}function updateInstallationRequest(e){return update(e,e=>{if(!e)throw E.create("installation-not-found");return clearTimedOutRequest(e)})}function clearTimedOutRequest(e){return hasInstallationRequestTimedOut(e)?{fid:e.fid,registrationStatus:0}:e}function hasInstallationRequestTimedOut(e){return 1===e.registrationStatus&&e.registrationTime+1e4<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function generateAuthTokenRequest({appConfig:e,heartbeatServiceProvider:r},n){let l=getGenerateAuthTokenEndpoint(e,n),c=getHeadersWithAuth(e,n),d=r.getImmediate({optional:!0});if(d){let e=await d.getHeartbeatsHeader();e&&c.append("x-firebase-client",e)}let f={installation:{sdkVersion:_,appId:e.appId}},h={method:"POST",headers:c,body:JSON.stringify(f)},g=await retryIfServerError(()=>fetch(l,h));if(g.ok){let e=await g.json(),r=extractAuthTokenInfoFromResponse(e);return r}throw await getErrorFromResponse("Generate Auth Token",g)}function getGenerateAuthTokenEndpoint(e,{fid:r}){return`${getInstallationsEndpoint(e)}/${r}/authTokens:generate`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function refreshAuthToken(e,r=!1){let n;let l=await update(e.appConfig,l=>{if(!isEntryRegistered(l))throw E.create("not-registered");let c=l.authToken;if(!r&&isAuthTokenValid(c))return l;if(1===c.requestStatus)return n=waitUntilAuthTokenRequest(e,r),l;{if(!navigator.onLine)throw E.create("app-offline");let r=makeAuthTokenRequestInProgressEntry(l);return n=fetchAuthTokenFromServer(e,r),r}}),c=n?await n:l.authToken;return c}async function waitUntilAuthTokenRequest(e,r){let n=await updateAuthTokenRequest(e.appConfig);for(;1===n.authToken.requestStatus;)await sleep(100),n=await updateAuthTokenRequest(e.appConfig);let l=n.authToken;return 0===l.requestStatus?refreshAuthToken(e,r):l}function updateAuthTokenRequest(e){return update(e,e=>{if(!isEntryRegistered(e))throw E.create("not-registered");let r=e.authToken;return hasAuthTokenRequestTimedOut(r)?Object.assign(Object.assign({},e),{authToken:{requestStatus:0}}):e})}async function fetchAuthTokenFromServer(e,r){try{let n=await generateAuthTokenRequest(e,r),l=Object.assign(Object.assign({},r),{authToken:n});return await set(e.appConfig,l),n}catch(n){if(isServerError(n)&&(401===n.customData.serverCode||404===n.customData.serverCode))await remove(e.appConfig);else{let n=Object.assign(Object.assign({},r),{authToken:{requestStatus:0}});await set(e.appConfig,n)}throw n}}function isEntryRegistered(e){return void 0!==e&&2===e.registrationStatus}function isAuthTokenValid(e){return 2===e.requestStatus&&!isAuthTokenExpired(e)}function isAuthTokenExpired(e){let r=Date.now();return r<e.creationTime||e.creationTime+e.expiresIn<r+36e5}function makeAuthTokenRequestInProgressEntry(e){let r={requestStatus:1,requestTime:Date.now()};return Object.assign(Object.assign({},e),{authToken:r})}function hasAuthTokenRequestTimedOut(e){return 1===e.requestStatus&&e.requestTime+1e4<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function getId(e){let{installationEntry:r,registrationPromise:n}=await getInstallationEntry(e);return n?n.catch(console.error):refreshAuthToken(e).catch(console.error),r.fid}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function getToken(e,r=!1){await completeInstallationRegistration(e);let n=await refreshAuthToken(e,r);return n.token}async function completeInstallationRegistration(e){let{registrationPromise:r}=await getInstallationEntry(e);r&&await r}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function extractAppConfig(e){if(!e||!e.options)throw getMissingValueError("App Configuration");if(!e.name)throw getMissingValueError("App Name");for(let r of["projectId","apiKey","appId"])if(!e.options[r])throw getMissingValueError(r);return{appName:e.name,projectId:e.options.projectId,apiKey:e.options.apiKey,appId:e.options.appId}}function getMissingValueError(e){return E.create("missing-app-config-values",{valueName:e})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let B="installations";(0,h.Xd)(new g.wA(B,e=>{let r=e.getProvider("app").getImmediate(),n=extractAppConfig(r),l=(0,h.qX)(r,"heartbeat");return{app:r,appConfig:n,heartbeatServiceProvider:l,_delete:()=>Promise.resolve()}},"PUBLIC")),(0,h.Xd)(new g.wA("installations-internal",e=>{let r=e.getProvider("app").getImmediate(),n=(0,h.qX)(r,B).getImmediate();return{getId:()=>getId(n),getToken:e=>getToken(n,e)}},"PRIVATE")),(0,h.KN)(w,v),(0,h.KN)(w,v,"esm2017");let N="BDOU99-h67HcA6JeFXHbSNMu7e2yNNu3RzoMj8TM4W88jITfq7ZmPvIM1Iv-4_l2LxQcYwhqby2xGpWwzjfAnG4",R="google.c.a.c_id";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function arrayToBase64(e){let r=new Uint8Array(e),n=btoa(String.fromCharCode(...r));return n.replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")}function base64ToArray(e){let r="=".repeat((4-e.length%4)%4),n=(e+r).replace(/\-/g,"+").replace(/_/g,"/"),l=atob(n),c=new Uint8Array(l.length);for(let e=0;e<l.length;++e)c[e]=l.charCodeAt(e);return c}(l=d||(d={}))[l.DATA_MESSAGE=1]="DATA_MESSAGE",l[l.DISPLAY_NOTIFICATION=3]="DISPLAY_NOTIFICATION",(c=f||(f={})).PUSH_RECEIVED="push-received",c.NOTIFICATION_CLICKED="notification-clicked";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let F="fcm_token_details_db",L="fcm_token_object_Store";async function migrateOldDatabase(e){if("databases"in indexedDB){let e=await indexedDB.databases(),r=e.map(e=>e.name);if(!r.includes(F))return null}let r=null,n=await (0,y.X3)(F,5,{upgrade:async(n,l,c,d)=>{var f;if(l<2||!n.objectStoreNames.contains(L))return;let h=d.objectStore(L),g=await h.index("fcmSenderId").get(e);if(await h.clear(),g){if(2===l){if(!g.auth||!g.p256dh||!g.endpoint)return;r={token:g.fcmToken,createTime:null!==(f=g.createTime)&&void 0!==f?f:Date.now(),subscriptionOptions:{auth:g.auth,p256dh:g.p256dh,endpoint:g.endpoint,swScope:g.swScope,vapidKey:"string"==typeof g.vapidKey?g.vapidKey:arrayToBase64(g.vapidKey)}}}else 3===l?r={token:g.fcmToken,createTime:g.createTime,subscriptionOptions:{auth:arrayToBase64(g.auth),p256dh:arrayToBase64(g.p256dh),endpoint:g.endpoint,swScope:g.swScope,vapidKey:arrayToBase64(g.vapidKey)}}:4===l&&(r={token:g.fcmToken,createTime:g.createTime,subscriptionOptions:{auth:arrayToBase64(g.auth),p256dh:arrayToBase64(g.p256dh),endpoint:g.endpoint,swScope:g.swScope,vapidKey:arrayToBase64(g.vapidKey)}})}}});return n.close(),await (0,y.Lj)(F),await (0,y.Lj)("fcm_vapid_details_db"),await (0,y.Lj)("undefined"),checkTokenDetails(r)?r:null}function checkTokenDetails(e){if(!e||!e.subscriptionOptions)return!1;let{subscriptionOptions:r}=e;return"number"==typeof e.createTime&&e.createTime>0&&"string"==typeof e.token&&e.token.length>0&&"string"==typeof r.auth&&r.auth.length>0&&"string"==typeof r.p256dh&&r.p256dh.length>0&&"string"==typeof r.endpoint&&r.endpoint.length>0&&"string"==typeof r.swScope&&r.swScope.length>0&&"string"==typeof r.vapidKey&&r.vapidKey.length>0}let H="firebase-messaging-store",$=null;function index_esm2017_getDbPromise(){return $||($=(0,y.X3)("firebase-messaging-database",1,{upgrade:(e,r)=>{0===r&&e.createObjectStore(H)}})),$}async function dbGet(e){let r=function({appConfig:e}){return e.appId}(e),n=await index_esm2017_getDbPromise(),l=await n.transaction(H).objectStore(H).get(r);if(l)return l;{let r=await migrateOldDatabase(e.appConfig.senderId);if(r)return await dbSet(e,r),r}}async function dbSet(e,r){let n=function({appConfig:e}){return e.appId}(e),l=await index_esm2017_getDbPromise(),c=l.transaction(H,"readwrite");return await c.objectStore(H).put(r,n),await c.done,r}let V=new b.LL("messaging","Messaging",{"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"only-available-in-window":"This method is available in a Window context.","only-available-in-sw":"This method is available in a service worker context.","permission-default":"The notification permission was not granted and dismissed instead.","permission-blocked":"The notification permission was not granted and blocked instead.","unsupported-browser":"This browser doesn't support the API's required to use the Firebase SDK.","indexed-db-unsupported":"This browser doesn't support indexedDb.open() (ex. Safari iFrame, Firefox Private Browsing, etc)","failed-service-worker-registration":"We are unable to register the default service worker. {$browserErrorMessage}","token-subscribe-failed":"A problem occurred while subscribing the user to FCM: {$errorInfo}","token-subscribe-no-token":"FCM returned no token when subscribing the user to push.","token-unsubscribe-failed":"A problem occurred while unsubscribing the user from FCM: {$errorInfo}","token-update-failed":"A problem occurred while updating the user from FCM: {$errorInfo}","token-update-no-token":"FCM returned no token when updating the user to push.","use-sw-after-get-token":"The useServiceWorker() method may only be called once and must be called before calling getToken() to ensure your service worker is used.","invalid-sw-registration":"The input to useServiceWorker() must be a ServiceWorkerRegistration.","invalid-bg-handler":"The input to setBackgroundMessageHandler() must be a function.","invalid-vapid-key":"The public VAPID key must be a string.","use-vapid-key-after-get-token":"The usePublicVapidKey() method may only be called once and must be called before calling getToken() to ensure your VAPID key is used."});/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function requestGetToken(e,r){let n;let l=await index_esm2017_getHeaders(e),c=getBody(r),d={method:"POST",headers:l,body:JSON.stringify(c)};try{let r=await fetch(getEndpoint(e.appConfig),d);n=await r.json()}catch(e){throw V.create("token-subscribe-failed",{errorInfo:null==e?void 0:e.toString()})}if(n.error){let e=n.error.message;throw V.create("token-subscribe-failed",{errorInfo:e})}if(!n.token)throw V.create("token-subscribe-no-token");return n.token}async function requestUpdateToken(e,r){let n;let l=await index_esm2017_getHeaders(e),c=getBody(r.subscriptionOptions),d={method:"PATCH",headers:l,body:JSON.stringify(c)};try{let l=await fetch(`${getEndpoint(e.appConfig)}/${r.token}`,d);n=await l.json()}catch(e){throw V.create("token-update-failed",{errorInfo:null==e?void 0:e.toString()})}if(n.error){let e=n.error.message;throw V.create("token-update-failed",{errorInfo:e})}if(!n.token)throw V.create("token-update-no-token");return n.token}async function requestDeleteToken(e,r){let n=await index_esm2017_getHeaders(e);try{let l=await fetch(`${getEndpoint(e.appConfig)}/${r}`,{method:"DELETE",headers:n}),c=await l.json();if(c.error){let e=c.error.message;throw V.create("token-unsubscribe-failed",{errorInfo:e})}}catch(e){throw V.create("token-unsubscribe-failed",{errorInfo:null==e?void 0:e.toString()})}}function getEndpoint({projectId:e}){return`https://fcmregistrations.googleapis.com/v1/projects/${e}/registrations`}async function index_esm2017_getHeaders({appConfig:e,installations:r}){let n=await r.getToken();return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":e.apiKey,"x-goog-firebase-installations-auth":`FIS ${n}`})}function getBody({p256dh:e,auth:r,endpoint:n,vapidKey:l}){let c={web:{endpoint:n,auth:r,p256dh:e}};return l!==N&&(c.web.applicationPubKey=l),c}async function getTokenInternal(e){let r=await getPushSubscription(e.swRegistration,e.vapidKey),n={vapidKey:e.vapidKey,swScope:e.swRegistration.scope,endpoint:r.endpoint,auth:arrayToBase64(r.getKey("auth")),p256dh:arrayToBase64(r.getKey("p256dh"))},l=await dbGet(e.firebaseDependencies);if(!l)return getNewToken(e.firebaseDependencies,n);if(isTokenValid(l.subscriptionOptions,n))return Date.now()>=l.createTime+6048e5?updateToken(e,{token:l.token,createTime:Date.now(),subscriptionOptions:n}):l.token;try{await requestDeleteToken(e.firebaseDependencies,l.token)}catch(e){console.warn(e)}return getNewToken(e.firebaseDependencies,n)}async function updateToken(e,r){try{let n=await requestUpdateToken(e.firebaseDependencies,r),l=Object.assign(Object.assign({},r),{token:n,createTime:Date.now()});return await dbSet(e.firebaseDependencies,l),n}catch(e){throw e}}async function getNewToken(e,r){let n=await requestGetToken(e,r),l={token:n,createTime:Date.now(),subscriptionOptions:r};return await dbSet(e,l),l.token}async function getPushSubscription(e,r){let n=await e.pushManager.getSubscription();return n||e.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:base64ToArray(r)})}function isTokenValid(e,r){let n=r.vapidKey===e.vapidKey,l=r.endpoint===e.endpoint,c=r.auth===e.auth,d=r.p256dh===e.p256dh;return n&&l&&c&&d}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function externalizePayload(e){let r={from:e.from,collapseKey:e.collapse_key,messageId:e.fcmMessageId};return propagateNotificationPayload(r,e),propagateDataPayload(r,e),propagateFcmOptions(r,e),r}function propagateNotificationPayload(e,r){if(!r.notification)return;e.notification={};let n=r.notification.title;n&&(e.notification.title=n);let l=r.notification.body;l&&(e.notification.body=l);let c=r.notification.image;c&&(e.notification.image=c);let d=r.notification.icon;d&&(e.notification.icon=d)}function propagateDataPayload(e,r){r.data&&(e.data=r.data)}function propagateFcmOptions(e,r){var n,l,c,d,f;if(!r.fcmOptions&&!(null===(n=r.notification)||void 0===n?void 0:n.click_action))return;e.fcmOptions={};let h=null!==(c=null===(l=r.fcmOptions)||void 0===l?void 0:l.link)&&void 0!==c?c:null===(d=r.notification)||void 0===d?void 0:d.click_action;h&&(e.fcmOptions.link=h);let g=null===(f=r.fcmOptions)||void 0===f?void 0:f.analytics_label;g&&(e.fcmOptions.analyticsLabel=g)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function isConsoleMessage(e){return"object"==typeof e&&!!e&&R in e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function index_esm2017_extractAppConfig(e){if(!e||!e.options)throw index_esm2017_getMissingValueError("App Configuration Object");if(!e.name)throw index_esm2017_getMissingValueError("App Name");let{options:r}=e;for(let e of["projectId","apiKey","appId","messagingSenderId"])if(!r[e])throw index_esm2017_getMissingValueError(e);return{appName:e.name,projectId:r.projectId,apiKey:r.apiKey,appId:r.appId,senderId:r.messagingSenderId}}function index_esm2017_getMissingValueError(e){return V.create("missing-app-config-values",{valueName:e})}!/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function(e,r){let n=[];for(let l=0;l<e.length;l++)n.push(e.charAt(l)),l<r.length&&n.push(r.charAt(l));n.join("")}("AzSCbw63g1R0nCw85jG8","Iaya3yLKwmgvh7cF0q4");/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let MessagingService=class MessagingService{constructor(e,r,n){this.deliveryMetricsExportedToBigQueryEnabled=!1,this.onBackgroundMessageHandler=null,this.onMessageHandler=null,this.logEvents=[],this.isLogServiceStarted=!1;let l=index_esm2017_extractAppConfig(e);this.firebaseDependencies={app:e,appConfig:l,installations:r,analyticsProvider:n}}_delete(){return Promise.resolve()}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function registerDefaultSw(e){try{e.swRegistration=await navigator.serviceWorker.register("/firebase-messaging-sw.js",{scope:"/firebase-cloud-messaging-push-scope"}),e.swRegistration.update().catch(()=>{}),await waitForRegistrationActive(e.swRegistration)}catch(e){throw V.create("failed-service-worker-registration",{browserErrorMessage:null==e?void 0:e.message})}}async function waitForRegistrationActive(e){return new Promise((r,n)=>{let l=setTimeout(()=>n(Error("Service worker not registered after 10000 ms")),1e4),c=e.installing||e.waiting;e.active?(clearTimeout(l),r()):c?c.onstatechange=e=>{var n;(null===(n=e.target)||void 0===n?void 0:n.state)==="activated"&&(c.onstatechange=null,clearTimeout(l),r())}:(clearTimeout(l),n(Error("No incoming service worker found.")))})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function updateSwReg(e,r){if(r||e.swRegistration||await registerDefaultSw(e),r||!e.swRegistration){if(!(r instanceof ServiceWorkerRegistration))throw V.create("invalid-sw-registration");e.swRegistration=r}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function updateVapidKey(e,r){r?e.vapidKey=r:e.vapidKey||(e.vapidKey=N)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function getToken$1(e,r){if(!navigator)throw V.create("only-available-in-window");if("default"===Notification.permission&&await Notification.requestPermission(),"granted"!==Notification.permission)throw V.create("permission-blocked");return await updateVapidKey(e,null==r?void 0:r.vapidKey),await updateSwReg(e,null==r?void 0:r.serviceWorkerRegistration),getTokenInternal(e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function logToScion(e,r,n){let l=getEventType(r),c=await e.firebaseDependencies.analyticsProvider.get();c.logEvent(l,{message_id:n[R],message_name:n["google.c.a.c_l"],message_time:n["google.c.a.ts"],message_device_time:Math.floor(Date.now()/1e3)})}function getEventType(e){switch(e){case f.NOTIFICATION_CLICKED:return"notification_open";case f.PUSH_RECEIVED:return"notification_foreground";default:throw Error()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function messageEventListener(e,r){let n=r.data;if(!n.isFirebaseMessaging)return;e.onMessageHandler&&n.messageType===f.PUSH_RECEIVED&&("function"==typeof e.onMessageHandler?e.onMessageHandler(externalizePayload(n)):e.onMessageHandler.next(externalizePayload(n)));let l=n.data;isConsoleMessage(l)&&"1"===l["google.c.a.e"]&&await logToScion(e,n.messageType,l)}let z="@firebase/messaging",G="0.12.20";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function isWindowSupported(){try{await (0,b.eu)()}catch(e){return!1}return"undefined"!=typeof window&&(0,b.hl)()&&(0,b.zI)()&&"serviceWorker"in navigator&&"PushManager"in window&&"Notification"in window&&"fetch"in window&&ServiceWorkerRegistration.prototype.hasOwnProperty("showNotification")&&PushSubscription.prototype.hasOwnProperty("getKey")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function onMessage$1(e,r){if(!navigator)throw V.create("only-available-in-window");return e.onMessageHandler=r,()=>{e.onMessageHandler=null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function getMessagingInWindow(e=(0,h.Mq)()){return isWindowSupported().then(e=>{if(!e)throw V.create("unsupported-browser")},e=>{throw V.create("indexed-db-unsupported")}),(0,h.qX)((0,b.m9)(e),"messaging").getImmediate()}async function index_esm2017_getToken(e,r){return getToken$1(e=(0,b.m9)(e),r)}function onMessage(e,r){return onMessage$1(e=(0,b.m9)(e),r)}(0,h.Xd)(new g.wA("messaging",e=>{let r=new MessagingService(e.getProvider("app").getImmediate(),e.getProvider("installations-internal").getImmediate(),e.getProvider("analytics-internal"));return navigator.serviceWorker.addEventListener("message",e=>messageEventListener(r,e)),r},"PUBLIC")),(0,h.Xd)(new g.wA("messaging-internal",e=>{let r=e.getProvider("messaging").getImmediate();return{getToken:e=>getToken$1(r,e)}},"PRIVATE")),(0,h.KN)(z,G),(0,h.KN)(z,G,"esm2017")},8542:function(e,r,n){"use strict";let l,c;n.d(r,{Lj:function(){return deleteDB},X3:function(){return openDB}});let instanceOfAny=(e,r)=>r.some(r=>e instanceof r);function getIdbProxyableTypes(){return l||(l=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function getCursorAdvanceMethods(){return c||(c=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}let d=new WeakMap,f=new WeakMap,h=new WeakMap,g=new WeakMap,b=new WeakMap;function promisifyRequest(e){let r=new Promise((r,n)=>{let unlisten=()=>{e.removeEventListener("success",success),e.removeEventListener("error",error)},success=()=>{r(wrap(e.result)),unlisten()},error=()=>{n(e.error),unlisten()};e.addEventListener("success",success),e.addEventListener("error",error)});return r.then(r=>{r instanceof IDBCursor&&d.set(r,e)}).catch(()=>{}),b.set(r,e),r}function cacheDonePromiseForTransaction(e){if(f.has(e))return;let r=new Promise((r,n)=>{let unlisten=()=>{e.removeEventListener("complete",complete),e.removeEventListener("error",error),e.removeEventListener("abort",error)},complete=()=>{r(),unlisten()},error=()=>{n(e.error||new DOMException("AbortError","AbortError")),unlisten()};e.addEventListener("complete",complete),e.addEventListener("error",error),e.addEventListener("abort",error)});f.set(e,r)}let y={get(e,r,n){if(e instanceof IDBTransaction){if("done"===r)return f.get(e);if("objectStoreNames"===r)return e.objectStoreNames||h.get(e);if("store"===r)return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return wrap(e[r])},set:(e,r,n)=>(e[r]=n,!0),has:(e,r)=>e instanceof IDBTransaction&&("done"===r||"store"===r)||r in e};function replaceTraps(e){y=e(y)}function wrapFunction(e){return e!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?getCursorAdvanceMethods().includes(e)?function(...r){return e.apply(unwrap(this),r),wrap(d.get(this))}:function(...r){return wrap(e.apply(unwrap(this),r))}:function(r,...n){let l=e.call(unwrap(this),r,...n);return h.set(l,r.sort?r.sort():[r]),wrap(l)}}function transformCachableValue(e){return"function"==typeof e?wrapFunction(e):(e instanceof IDBTransaction&&cacheDonePromiseForTransaction(e),instanceOfAny(e,getIdbProxyableTypes()))?new Proxy(e,y):e}function wrap(e){if(e instanceof IDBRequest)return promisifyRequest(e);if(g.has(e))return g.get(e);let r=transformCachableValue(e);return r!==e&&(g.set(e,r),b.set(r,e)),r}let unwrap=e=>b.get(e);function openDB(e,r,{blocked:n,upgrade:l,blocking:c,terminated:d}={}){let f=indexedDB.open(e,r),h=wrap(f);return l&&f.addEventListener("upgradeneeded",e=>{l(wrap(f.result),e.oldVersion,e.newVersion,wrap(f.transaction),e)}),n&&f.addEventListener("blocked",e=>n(e.oldVersion,e.newVersion,e)),h.then(e=>{d&&e.addEventListener("close",()=>d()),c&&e.addEventListener("versionchange",e=>c(e.oldVersion,e.newVersion,e))}).catch(()=>{}),h}function deleteDB(e,{blocked:r}={}){let n=indexedDB.deleteDatabase(e);return r&&n.addEventListener("blocked",e=>r(e.oldVersion,e)),wrap(n).then(()=>void 0)}let w=["get","getKey","getAll","getAllKeys","count"],v=["put","add","delete","clear"],_=new Map;function getMethod(e,r){if(!(e instanceof IDBDatabase&&!(r in e)&&"string"==typeof r))return;if(_.get(r))return _.get(r);let n=r.replace(/FromIndex$/,""),l=r!==n,c=v.includes(n);if(!(n in(l?IDBIndex:IDBObjectStore).prototype)||!(c||w.includes(n)))return;let method=async function(e,...r){let d=this.transaction(e,c?"readwrite":"readonly"),f=d.store;return l&&(f=f.index(r.shift())),(await Promise.all([f[n](...r),c&&d.done]))[0]};return _.set(r,method),method}replaceTraps(e=>({...e,get:(r,n,l)=>getMethod(r,n)||e.get(r,n,l),has:(r,n)=>!!getMethod(r,n)||e.has(r,n)}))},5925:function(e,r,n){"use strict";let l,c;n.r(r),n.d(r,{CheckmarkIcon:function(){return z},ErrorIcon:function(){return F},LoaderIcon:function(){return H},ToastBar:function(){return en},ToastIcon:function(){return M},Toaster:function(){return Oe},default:function(){return ei},resolveValue:function(){return dist_f},toast:function(){return dist_c},useToaster:function(){return O},useToasterStore:function(){return D}});var d=n(2265);let f={data:""},t=e=>"object"==typeof window?((e?e.querySelector("#_goober"):window._goober)||Object.assign((e||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:e||f,h=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,g=/\/\*[^]*?\*\/|  +/g,b=/\n+/g,o=(e,r)=>{let n="",l="",c="";for(let d in e){let f=e[d];"@"==d[0]?"i"==d[1]?n=d+" "+f+";":l+="f"==d[1]?o(f,d):d+"{"+o(f,"k"==d[1]?"":r)+"}":"object"==typeof f?l+=o(f,r?r.replace(/([^,])+/g,e=>d.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,r=>/&/.test(r)?r.replace(/&/g,e):e?e+" "+r:r)):d):null!=f&&(d=/^--/.test(d)?d:d.replace(/[A-Z]/g,"-$&").toLowerCase(),c+=o.p?o.p(d,f):d+":"+f+";")}return n+(r&&c?r+"{"+c+"}":c)+l},y={},s=e=>{if("object"==typeof e){let r="";for(let n in e)r+=n+s(e[n]);return r}return e},i=(e,r,n,l,c)=>{var d;let f=s(e),w=y[f]||(y[f]=(e=>{let r=0,n=11;for(;r<e.length;)n=101*n+e.charCodeAt(r++)>>>0;return"go"+n})(f));if(!y[w]){let r=f!==e?e:(e=>{let r,n,l=[{}];for(;r=h.exec(e.replace(g,""));)r[4]?l.shift():r[3]?(n=r[3].replace(b," ").trim(),l.unshift(l[0][n]=l[0][n]||{})):l[0][r[1]]=r[2].replace(b," ").trim();return l[0]})(e);y[w]=o(c?{["@keyframes "+w]:r}:r,n?"":"."+w)}let v=n&&y.g?y.g:null;return n&&(y.g=y[w]),d=y[w],v?r.data=r.data.replace(v,d):-1===r.data.indexOf(d)&&(r.data=l?d+r.data:r.data+d),w},p=(e,r,n)=>e.reduce((e,l,c)=>{let d=r[c];if(d&&d.call){let e=d(n),r=e&&e.props&&e.props.className||/^go/.test(e)&&e;d=r?"."+r:e&&"object"==typeof e?e.props?"":o(e,""):!1===e?"":e}return e+l+(null==d?"":d)},"");function u(e){let r=this||{},n=e.call?e(r.p):e;return i(n.unshift?n.raw?p(n,[].slice.call(arguments,1),r.p):n.reduce((e,n)=>Object.assign(e,n&&n.call?n(r.p):n),{}):n,t(r.target),r.g,r.o,r.k)}u.bind({g:1});let w,v,_,I=u.bind({k:1});function m(e,r,n,l){o.p=r,w=e,v=n,_=l}function j(e,r){let n=this||{};return function(){let l=arguments;function a(c,d){let f=Object.assign({},c),h=f.className||a.className;n.p=Object.assign({theme:v&&v()},f),n.o=/ *go\d+/.test(h),f.className=u.apply(n,l)+(h?" "+h:""),r&&(f.ref=d);let g=e;return e[0]&&(g=f.as||e,delete f.as),_&&g[0]&&_(f),w(g,f)}return r?r(a):a}}var W=e=>"function"==typeof e,dist_f=(e,r)=>W(e)?e(r):e,E=(l=0,()=>(++l).toString()),A=()=>{if(void 0===c&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");c=!e||e.matches}return c},U=(e,r)=>{switch(r.type){case 0:return{...e,toasts:[r.toast,...e.toasts].slice(0,20)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===r.toast.id?{...e,...r.toast}:e)};case 2:let{toast:n}=r;return U(e,{type:e.toasts.find(e=>e.id===n.id)?1:0,toast:n});case 3:let{toastId:l}=r;return{...e,toasts:e.toasts.map(e=>e.id===l||void 0===l?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===r.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==r.toastId)};case 5:return{...e,pausedAt:r.time};case 6:let c=r.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+c}))}}},T=[],S={toasts:[],pausedAt:void 0},dist_u=e=>{S=U(S,e),T.forEach(e=>{e(S)})},C={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},D=(e={})=>{let[r,n]=(0,d.useState)(S),l=(0,d.useRef)(S);(0,d.useEffect)(()=>(l.current!==S&&n(S),T.push(n),()=>{let e=T.indexOf(n);e>-1&&T.splice(e,1)}),[]);let c=r.toasts.map(r=>{var n,l,c;return{...e,...e[r.type],...r,removeDelay:r.removeDelay||(null==(n=e[r.type])?void 0:n.removeDelay)||(null==e?void 0:e.removeDelay),duration:r.duration||(null==(l=e[r.type])?void 0:l.duration)||(null==e?void 0:e.duration)||C[r.type],style:{...e.style,...null==(c=e[r.type])?void 0:c.style,...r.style}}});return{...r,toasts:c}},J=(e,r="blank",n)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:r,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...n,id:(null==n?void 0:n.id)||E()}),x=e=>(r,n)=>{let l=J(r,e,n);return dist_u({type:2,toast:l}),l.id},dist_c=(e,r)=>x("blank")(e,r);dist_c.error=x("error"),dist_c.success=x("success"),dist_c.loading=x("loading"),dist_c.custom=x("custom"),dist_c.dismiss=e=>{dist_u({type:3,toastId:e})},dist_c.remove=e=>dist_u({type:4,toastId:e}),dist_c.promise=(e,r,n)=>{let l=dist_c.loading(r.loading,{...n,...null==n?void 0:n.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let c=r.success?dist_f(r.success,e):void 0;return c?dist_c.success(c,{id:l,...n,...null==n?void 0:n.success}):dist_c.dismiss(l),e}).catch(e=>{let c=r.error?dist_f(r.error,e):void 0;c?dist_c.error(c,{id:l,...n,...null==n?void 0:n.error}):dist_c.dismiss(l)}),e};var K=(e,r)=>{dist_u({type:1,toast:{id:e,height:r}})},X=()=>{dist_u({type:5,time:Date.now()})},k=new Map,P=1e3,ee=(e,r=P)=>{if(k.has(e))return;let n=setTimeout(()=>{k.delete(e),dist_u({type:4,toastId:e})},r);k.set(e,n)},O=e=>{let{toasts:r,pausedAt:n}=D(e);(0,d.useEffect)(()=>{if(n)return;let e=Date.now(),l=r.map(r=>{if(r.duration===1/0)return;let n=(r.duration||0)+r.pauseDuration-(e-r.createdAt);if(n<0){r.visible&&dist_c.dismiss(r.id);return}return setTimeout(()=>dist_c.dismiss(r.id),n)});return()=>{l.forEach(e=>e&&clearTimeout(e))}},[r,n]);let l=(0,d.useCallback)(()=>{n&&dist_u({type:6,time:Date.now()})},[n]),c=(0,d.useCallback)((e,n)=>{let{reverseOrder:l=!1,gutter:c=8,defaultPosition:d}=n||{},f=r.filter(r=>(r.position||d)===(e.position||d)&&r.height),h=f.findIndex(r=>r.id===e.id),g=f.filter((e,r)=>r<h&&e.visible).length;return f.filter(e=>e.visible).slice(...l?[g+1]:[0,g]).reduce((e,r)=>e+(r.height||0)+c,0)},[r]);return(0,d.useEffect)(()=>{r.forEach(e=>{if(e.dismissed)ee(e.id,e.removeDelay);else{let r=k.get(e.id);r&&(clearTimeout(r),k.delete(e.id))}})},[r]),{toasts:r,handlers:{updateHeight:K,startPause:X,endPause:l,calculateOffset:c}}},B=I`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,N=I`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,R=I`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,F=j("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${B} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${N} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${R} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,L=I`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,H=j("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${L} 1s linear infinite;
`,$=I`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,V=I`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,z=j("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${$} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${V} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,G=j("div")`
  position: absolute;
`,Z=j("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,Y=I`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Q=j("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${Y} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,M=({toast:e})=>{let{icon:r,type:n,iconTheme:l}=e;return void 0!==r?"string"==typeof r?d.createElement(Q,null,r):r:"blank"===n?null:d.createElement(Z,null,d.createElement(H,{...l}),"loading"!==n&&d.createElement(G,null,"error"===n?d.createElement(F,{...l}):d.createElement(z,{...l})))},ye=e=>`
0% {transform: translate3d(0,${-200*e}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,ge=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*e}%,-1px) scale(.6); opacity:0;}
`,et=j("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,er=j("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,Ae=(e,r)=>{let n=e.includes("top")?1:-1,[l,c]=A()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[ye(n),ge(n)];return{animation:r?`${I(l)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${I(c)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},en=d.memo(({toast:e,position:r,style:n,children:l})=>{let c=e.height?Ae(e.position||r||"top-center",e.visible):{opacity:0},f=d.createElement(M,{toast:e}),h=d.createElement(er,{...e.ariaProps},dist_f(e.message,e));return d.createElement(et,{className:e.className,style:{...c,...n,...e.style}},"function"==typeof l?l({icon:f,message:h}):d.createElement(d.Fragment,null,f,h))});m(d.createElement);var ve=({id:e,className:r,style:n,onHeightUpdate:l,children:c})=>{let f=d.useCallback(r=>{if(r){let i=()=>{l(e,r.getBoundingClientRect().height)};i(),new MutationObserver(i).observe(r,{subtree:!0,childList:!0,characterData:!0})}},[e,l]);return d.createElement("div",{ref:f,className:r,style:n},c)},Ee=(e,r)=>{let n=e.includes("top"),l=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:A()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${r*(n?1:-1)}px)`,...n?{top:0}:{bottom:0},...l}},ea=u`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,Oe=({reverseOrder:e,position:r="top-center",toastOptions:n,gutter:l,children:c,containerStyle:f,containerClassName:h})=>{let{toasts:g,handlers:b}=O(n);return d.createElement("div",{id:"_rht_toaster",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...f},className:h,onMouseEnter:b.startPause,onMouseLeave:b.endPause},g.map(n=>{let f=n.position||r,h=Ee(f,b.calculateOffset(n,{reverseOrder:e,gutter:l,defaultPosition:r}));return d.createElement(ve,{id:n.id,key:n.id,onHeightUpdate:b.updateHeight,className:n.visible?ea:"",style:h},"custom"===n.type?dist_f(n.message,n):c?c(n):d.createElement(en,{toast:n,position:f}))}))},ei=dist_c}}]);