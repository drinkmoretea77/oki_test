(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["i18n"],{

/***/ "./resources/assets/js/internal_crm/i18n/index.js":
/*!********************************************************!*\
  !*** ./resources/assets/js/internal_crm/i18n/index.js ***!
  \********************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _lang_en_po__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lang/en.po */ "./resources/assets/js/internal_crm/lang/en.po");
/* harmony import */ var _lang_en_po__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_lang_en_po__WEBPACK_IMPORTED_MODULE_0__);

var localizations = {
  en: _lang_en_po__WEBPACK_IMPORTED_MODULE_0___default.a
};
var options = {
  locale: 'ru',
  localeDefault: 'ru'
};

function t(query) {
  for (var _len = arguments.length, props = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    props[_key - 1] = arguments[_key];
  }

  if (options.locale === options.localeDefault) {
    return replacePlaceholders(query, [].concat(props));
  } else {
    if (typeof localizations[options.locale][query] === 'undefined') {
      return replacePlaceholders(query, [].concat(props));
    } else {
      return localizations[options.locale][query]([].concat(props));
    }
  }
}

function replacePlaceholders(query, props) {
  if (props.length === 0) {
    return query;
  }

  var output = query;

  for (var i = 0; i < props.length; i++) {
    output = output.replace('%' + (i + 1), props[i]);
  }

  return output;
}

function i18nForceLocale(locale) {
  options.locale = locale;
}

window.t = t;
window.i18nForceLocale = i18nForceLocale;
document.addEventListener("DOMContentLoaded", function () {
  i18nForceLocale(document.documentElement.lang);
  t('Яблоко: %1 second %2', 2, 4);
});

/***/ }),

/***/ "./resources/assets/js/internal_crm/lang/en.po":
/*!*****************************************************!*\
  !*** ./resources/assets/js/internal_crm/lang/en.po ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {


module.exports = {
  "Привет": function(d) { return "Hello"; },
  "Мир": function(d) { return "World"; }
}

/***/ })

}]);