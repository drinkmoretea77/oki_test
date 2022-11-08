(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["components-lead-tabs-TabNodes"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/assets/js/internal_crm/components/lead/tabs/TabNodes.vue?vue&type=script&lang=js&":
/*!*************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/assets/js/internal_crm/components/lead/tabs/TabNodes.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");


function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  props: {
    // Входные параметры лида
    lead: {
      type: Object,
      required: true
    }
  },
  data: function data() {
    return {
      // Статус загрузки
      load: false,
      // Локальное состояние
      localState: null
    };
  },
  computed: {
    // Создание кастомной кнопки вызова модалки
    modalButton: function modalButton() {
      return '<a href="javascript:;" class="routes-all-man btn btn-primary margin-top--8" style="margin-top: -8px;" data-modalid="#route-all-modal" data-modal-data="&id=' + this.lead.id + '">' + this.$t('Переместить') + '</a>';
    }
  },
  created: function created() {
    if (this.lead.node_change) {
      this.localState = this.lead.node_change;
    }
  },
  methods: _objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_1__["mapActions"])(['saveNodeLead']), {
    /**
     * Сохранение состояния
     * @return {Promise}
     */
    save: function save() {
      var _this = this;

      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {
        var params, data;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!_this.load) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return");

              case 2:
                _this.load = true;
                params = {
                  id: _this.lead.id,
                  node: _this.localState
                };
                _context.next = 6;
                return _this.saveNodeLead(params);

              case 6:
                data = _context.sent;

                if (data && data.result) {
                  toastr['success'](_this.$t("Узел установлен"), _this.$t("Изменение узла"));
                } else {
                  toastr['error'](_this.$t("Ошибка"), _this.$t("Изменение узла"));
                }

                _this.load = false;

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    }
  })
});

/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/assets/js/internal_crm/components/lead/tabs/TabNodes.vue?vue&type=template&id=5c68b812&":
/*!*****************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/assets/js/internal_crm/components/lead/tabs/TabNodes.vue?vue&type=template&id=5c68b812& ***!
  \*****************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "tab-pane" },
    [
      _c("TabSpinner", { tag: "div", attrs: { load: _vm.load } }),
      _vm._v(" "),
      _c("div", { staticClass: "alert alert-danger" }, [
        _c("strong", [_vm._v(_vm._s(_vm.$t("Внимание!")))]),
        _vm._v(
          " " +
            _vm._s(
              _vm.$t(
                "Смена узла компании влечет за собой следующие последствия:"
              )
            ) +
            "\n        "
        ),
        _c("ul", [
          _c("li", [
            _vm._v(
              _vm._s(
                _vm.$t(
                  "Все регистрации и GSM-шлюзы, в настройках которых, указан узел AUTO начнут регистрироваться с нового узла компании."
                )
              )
            )
          ]),
          _vm._v(" "),
          _c("li", [
            _vm._v(
              _vm._s(
                _vm.$t(
                  "Все автообзвоны, в настройках которых, указан узел AUTO начнут работать но новом узле компании."
                )
              )
            )
          ]),
          _vm._v(" "),
          _c("li", [
            _vm._v(
              _vm._s(
                _vm.$t(
                  "Операторы, в настройках опер. места которых, указан узел AUTO будут подключаться к новому узлу компании."
                )
              )
            )
          ])
        ]),
        _vm._v(" "),
        _c("strong", [_vm._v(_vm._s(_vm.$t("Важно!")))]),
        _vm._v(
          " " +
            _vm._s(
              _vm.$t(
                "Смена узла компании никак не влияет на регистрации, шлюзы, автообзвоны и операторов, в настройка которых выбран вручную конкретный узел."
              )
            ) +
            "\n    "
        )
      ]),
      _vm._v(" "),
      _c(
        "div",
        {
          staticClass: "form-horizontal margin-bottom-15",
          attrs: { role: "form" }
        },
        [
          _c("div", { staticClass: "form-group" }, [
            _c("label", { staticClass: "col-md-3 control-label" }, [
              _vm._v(
                "\n                " +
                  _vm._s(_vm.$t("Выбранный узел")) +
                  "\n            "
              )
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "col-md-9 " }, [
              _c(
                "select",
                {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.localState,
                      expression: "localState"
                    }
                  ],
                  staticClass: "form-control",
                  on: {
                    change: function($event) {
                      var $$selectedVal = Array.prototype.filter
                        .call($event.target.options, function(o) {
                          return o.selected
                        })
                        .map(function(o) {
                          var val = "_value" in o ? o._value : o.value
                          return val
                        })
                      _vm.localState = $event.target.multiple
                        ? $$selectedVal
                        : $$selectedVal[0]
                    }
                  }
                },
                _vm._l(_vm.lead.nodes, function(value, key) {
                  return _c("option", { key: key, domProps: { value: key } }, [
                    _vm._v(_vm._s(key) + "(" + _vm._s(value.region) + ")")
                  ])
                }),
                0
              )
            ])
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "row" }, [
            _c("div", { staticClass: "col-md-12 text-center" }, [
              _c(
                "button",
                {
                  staticClass: "btn blue",
                  attrs: { type: "button" },
                  on: {
                    click: function($event) {
                      return _vm.save()
                    }
                  }
                },
                [_vm._v(_vm._s(_vm.$t("Изменить узел")))]
              )
            ])
          ])
        ]
      ),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "help-block", staticStyle: { "margin-left": "3px" } },
        [
          _vm._v("\n        " + _vm._s(_vm.$t("Нажмите")) + "\n        "),
          _c("span", [
            _c(
              "a",
              {
                attrs: {
                  href: "javascript:;",
                  "data-modal-url":
                    "/support/ajax_get_nodes_list?id=" + _vm.lead.id,
                  "data-modal-submit": "false",
                  "data-modal-head-button": _vm.modalButton,
                  "data-html": "true",
                  "data-modal-title": _vm.$t("Узлы компании")
                }
              },
              [
                _vm._v(
                  " \n                " +
                    _vm._s(_vm.$t("Сюда")) +
                    "\n            "
                )
              ]
            )
          ]),
          _vm._v(
            "    \n        " +
              _vm._s(_vm.$t("чтобы изменить привязку шлюзов,")) +
              " " +
              _vm._s(_vm.$t("автодозвонов и операторских мест.")) +
              "\n    "
          )
        ]
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./resources/assets/js/internal_crm/components/lead/tabs/TabNodes.vue":
/*!****************************************************************************!*\
  !*** ./resources/assets/js/internal_crm/components/lead/tabs/TabNodes.vue ***!
  \****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _TabNodes_vue_vue_type_template_id_5c68b812___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TabNodes.vue?vue&type=template&id=5c68b812& */ "./resources/assets/js/internal_crm/components/lead/tabs/TabNodes.vue?vue&type=template&id=5c68b812&");
/* harmony import */ var _TabNodes_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TabNodes.vue?vue&type=script&lang=js& */ "./resources/assets/js/internal_crm/components/lead/tabs/TabNodes.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _TabNodes_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _TabNodes_vue_vue_type_template_id_5c68b812___WEBPACK_IMPORTED_MODULE_0__["render"],
  _TabNodes_vue_vue_type_template_id_5c68b812___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/assets/js/internal_crm/components/lead/tabs/TabNodes.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/assets/js/internal_crm/components/lead/tabs/TabNodes.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************************!*\
  !*** ./resources/assets/js/internal_crm/components/lead/tabs/TabNodes.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_TabNodes_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../../node_modules/vue-loader/lib??vue-loader-options!./TabNodes.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/assets/js/internal_crm/components/lead/tabs/TabNodes.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_TabNodes_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/assets/js/internal_crm/components/lead/tabs/TabNodes.vue?vue&type=template&id=5c68b812&":
/*!***********************************************************************************************************!*\
  !*** ./resources/assets/js/internal_crm/components/lead/tabs/TabNodes.vue?vue&type=template&id=5c68b812& ***!
  \***********************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TabNodes_vue_vue_type_template_id_5c68b812___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../../node_modules/vue-loader/lib??vue-loader-options!./TabNodes.vue?vue&type=template&id=5c68b812& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/assets/js/internal_crm/components/lead/tabs/TabNodes.vue?vue&type=template&id=5c68b812&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TabNodes_vue_vue_type_template_id_5c68b812___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TabNodes_vue_vue_type_template_id_5c68b812___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);