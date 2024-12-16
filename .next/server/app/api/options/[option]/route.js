/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/options/[option]/route";
exports.ids = ["app/api/options/[option]/route"];
exports.modules = {

/***/ "mongodb":
/*!**************************!*\
  !*** external "mongodb" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("mongodb");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Foptions%2F%5Boption%5D%2Froute&page=%2Fapi%2Foptions%2F%5Boption%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Foptions%2F%5Boption%5D%2Froute.js&appDir=%2FUsers%2Fabhinavnishant%2Fcloudshopper%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fabhinavnishant%2Fcloudshopper&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Foptions%2F%5Boption%5D%2Froute&page=%2Fapi%2Foptions%2F%5Boption%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Foptions%2F%5Boption%5D%2Froute.js&appDir=%2FUsers%2Fabhinavnishant%2Fcloudshopper%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fabhinavnishant%2Fcloudshopper&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_abhinavnishant_cloudshopper_app_api_options_option_route_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/options/[option]/route.js */ \"(rsc)/./app/api/options/[option]/route.js\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/options/[option]/route\",\n        pathname: \"/api/options/[option]\",\n        filename: \"route\",\n        bundlePath: \"app/api/options/[option]/route\"\n    },\n    resolvedPagePath: \"/Users/abhinavnishant/cloudshopper/app/api/options/[option]/route.js\",\n    nextConfigOutput,\n    userland: _Users_abhinavnishant_cloudshopper_app_api_options_option_route_js__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZvcHRpb25zJTJGJTVCb3B0aW9uJTVEJTJGcm91dGUmcGFnZT0lMkZhcGklMkZvcHRpb25zJTJGJTVCb3B0aW9uJTVEJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGb3B0aW9ucyUyRiU1Qm9wdGlvbiU1RCUyRnJvdXRlLmpzJmFwcERpcj0lMkZVc2VycyUyRmFiaGluYXZuaXNoYW50JTJGY2xvdWRzaG9wcGVyJTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZVc2VycyUyRmFiaGluYXZuaXNoYW50JTJGY2xvdWRzaG9wcGVyJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUNvQjtBQUNqRztBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiL1VzZXJzL2FiaGluYXZuaXNoYW50L2Nsb3Vkc2hvcHBlci9hcHAvYXBpL29wdGlvbnMvW29wdGlvbl0vcm91dGUuanNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL29wdGlvbnMvW29wdGlvbl0vcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9vcHRpb25zL1tvcHRpb25dXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9vcHRpb25zL1tvcHRpb25dL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiL1VzZXJzL2FiaGluYXZuaXNoYW50L2Nsb3Vkc2hvcHBlci9hcHAvYXBpL29wdGlvbnMvW29wdGlvbl0vcm91dGUuanNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICB3b3JrQXN5bmNTdG9yYWdlLFxuICAgICAgICB3b3JrVW5pdEFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Foptions%2F%5Boption%5D%2Froute&page=%2Fapi%2Foptions%2F%5Boption%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Foptions%2F%5Boption%5D%2Froute.js&appDir=%2FUsers%2Fabhinavnishant%2Fcloudshopper%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fabhinavnishant%2Fcloudshopper&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(rsc)/./app/api/options/[option]/route.js":
/*!*******************************************!*\
  !*** ./app/api/options/[option]/route.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var _lib_mongodb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../lib/mongodb */ \"(rsc)/./lib/mongodb.js\");\n\nasync function GET(req, { params }) {\n    const { option } = await params;\n    // Connect to the database\n    const db = await (0,_lib_mongodb__WEBPACK_IMPORTED_MODULE_0__.connectToDatabase)();\n    // Query the database to find the option data\n    const data = await db.collection('options').find({\n        parent: option\n    }).toArray();\n    // If no data found, return a 404 response\n    if (data.length === 0) {\n        return new Response('Option not found', {\n            status: 404\n        });\n    }\n    // Return the data as JSON\n    return new Response(JSON.stringify(data), {\n        headers: {\n            'Content-Type': 'application/json'\n        }\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL29wdGlvbnMvW29wdGlvbl0vcm91dGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBNEQ7QUFFckQsZUFBZUMsSUFBSUMsR0FBRyxFQUFFLEVBQUVDLE1BQU0sRUFBRTtJQUN2QyxNQUFNLEVBQUVDLE1BQU0sRUFBRSxHQUFHLE1BQU1EO0lBSXpCLDBCQUEwQjtJQUMxQixNQUFNRSxLQUFLLE1BQU1MLCtEQUFpQkE7SUFHbEMsNkNBQTZDO0lBQzdDLE1BQU1NLE9BQU8sTUFBTUQsR0FDaEJFLFVBQVUsQ0FBQyxXQUNYQyxJQUFJLENBQUM7UUFBRUMsUUFBUUw7SUFBTyxHQUN0Qk0sT0FBTztJQUdWLDBDQUEwQztJQUMxQyxJQUFJSixLQUFLSyxNQUFNLEtBQUssR0FBRztRQUNyQixPQUFPLElBQUlDLFNBQVMsb0JBQW9CO1lBQUVDLFFBQVE7UUFBSTtJQUN4RDtJQUVBLDBCQUEwQjtJQUMxQixPQUFPLElBQUlELFNBQVNFLEtBQUtDLFNBQVMsQ0FBQ1QsT0FBTztRQUN4Q1UsU0FBUztZQUFFLGdCQUFnQjtRQUFtQjtJQUNoRDtBQUNGIiwic291cmNlcyI6WyIvVXNlcnMvYWJoaW5hdm5pc2hhbnQvY2xvdWRzaG9wcGVyL2FwcC9hcGkvb3B0aW9ucy9bb3B0aW9uXS9yb3V0ZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjb25uZWN0VG9EYXRhYmFzZSB9IGZyb20gJy4uLy4uLy4uLy4uL2xpYi9tb25nb2RiJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdFVChyZXEsIHsgcGFyYW1zIH0pIHtcbiAgY29uc3QgeyBvcHRpb24gfSA9IGF3YWl0IHBhcmFtcztcblxuXG5cbiAgLy8gQ29ubmVjdCB0byB0aGUgZGF0YWJhc2VcbiAgY29uc3QgZGIgPSBhd2FpdCBjb25uZWN0VG9EYXRhYmFzZSgpO1xuXG4gIFxuICAvLyBRdWVyeSB0aGUgZGF0YWJhc2UgdG8gZmluZCB0aGUgb3B0aW9uIGRhdGFcbiAgY29uc3QgZGF0YSA9IGF3YWl0IGRiXG4gICAgLmNvbGxlY3Rpb24oJ29wdGlvbnMnKVxuICAgIC5maW5kKHsgcGFyZW50OiBvcHRpb24gfSlcbiAgICAudG9BcnJheSgpO1xuXG5cbiAgLy8gSWYgbm8gZGF0YSBmb3VuZCwgcmV0dXJuIGEgNDA0IHJlc3BvbnNlXG4gIGlmIChkYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBuZXcgUmVzcG9uc2UoJ09wdGlvbiBub3QgZm91bmQnLCB7IHN0YXR1czogNDA0IH0pO1xuICB9XG5cbiAgLy8gUmV0dXJuIHRoZSBkYXRhIGFzIEpTT05cbiAgcmV0dXJuIG5ldyBSZXNwb25zZShKU09OLnN0cmluZ2lmeShkYXRhKSwge1xuICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxuICB9KTtcbn1cbiJdLCJuYW1lcyI6WyJjb25uZWN0VG9EYXRhYmFzZSIsIkdFVCIsInJlcSIsInBhcmFtcyIsIm9wdGlvbiIsImRiIiwiZGF0YSIsImNvbGxlY3Rpb24iLCJmaW5kIiwicGFyZW50IiwidG9BcnJheSIsImxlbmd0aCIsIlJlc3BvbnNlIiwic3RhdHVzIiwiSlNPTiIsInN0cmluZ2lmeSIsImhlYWRlcnMiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/options/[option]/route.js\n");

/***/ }),

/***/ "(rsc)/./lib/mongodb.js":
/*!************************!*\
  !*** ./lib/mongodb.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   connectToDatabase: () => (/* binding */ connectToDatabase)\n/* harmony export */ });\n/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongodb */ \"mongodb\");\n/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongodb__WEBPACK_IMPORTED_MODULE_0__);\n// lib/mongodb.js\n\nconst client = new mongodb__WEBPACK_IMPORTED_MODULE_0__.MongoClient(process.env.MONGODB_URI);\nasync function connectToDatabase() {\n    // Connect to the database if not already connected\n    if (!client.isConnected) await client.connect();\n    return client.db(\"cloudshopper\"); // Replace 'cloudshopper' with your database name\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvbW9uZ29kYi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxpQkFBaUI7QUFDcUI7QUFFdEMsTUFBTUMsU0FBUyxJQUFJRCxnREFBV0EsQ0FBQ0UsUUFBUUMsR0FBRyxDQUFDQyxXQUFXO0FBRS9DLGVBQWVDO0lBQ3BCLG1EQUFtRDtJQUNuRCxJQUFJLENBQUNKLE9BQU9LLFdBQVcsRUFBRSxNQUFNTCxPQUFPTSxPQUFPO0lBQzdDLE9BQU9OLE9BQU9PLEVBQUUsQ0FBQyxpQkFBaUIsaURBQWlEO0FBQ3JGIiwic291cmNlcyI6WyIvVXNlcnMvYWJoaW5hdm5pc2hhbnQvY2xvdWRzaG9wcGVyL2xpYi9tb25nb2RiLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGxpYi9tb25nb2RiLmpzXG5pbXBvcnQgeyBNb25nb0NsaWVudCB9IGZyb20gXCJtb25nb2RiXCI7XG5cbmNvbnN0IGNsaWVudCA9IG5ldyBNb25nb0NsaWVudChwcm9jZXNzLmVudi5NT05HT0RCX1VSSSk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb25uZWN0VG9EYXRhYmFzZSgpIHtcbiAgLy8gQ29ubmVjdCB0byB0aGUgZGF0YWJhc2UgaWYgbm90IGFscmVhZHkgY29ubmVjdGVkXG4gIGlmICghY2xpZW50LmlzQ29ubmVjdGVkKSBhd2FpdCBjbGllbnQuY29ubmVjdCgpO1xuICByZXR1cm4gY2xpZW50LmRiKFwiY2xvdWRzaG9wcGVyXCIpOyAvLyBSZXBsYWNlICdjbG91ZHNob3BwZXInIHdpdGggeW91ciBkYXRhYmFzZSBuYW1lXG59XG4iXSwibmFtZXMiOlsiTW9uZ29DbGllbnQiLCJjbGllbnQiLCJwcm9jZXNzIiwiZW52IiwiTU9OR09EQl9VUkkiLCJjb25uZWN0VG9EYXRhYmFzZSIsImlzQ29ubmVjdGVkIiwiY29ubmVjdCIsImRiIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/mongodb.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Foptions%2F%5Boption%5D%2Froute&page=%2Fapi%2Foptions%2F%5Boption%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Foptions%2F%5Boption%5D%2Froute.js&appDir=%2FUsers%2Fabhinavnishant%2Fcloudshopper%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fabhinavnishant%2Fcloudshopper&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();