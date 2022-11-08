(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["components-EventsItem"],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/assets/js/internal_crm/components/EventsItem.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/assets/js/internal_crm/components/EventsItem.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
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
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  props: {
    event: {
      type: Object,
      required: true
    }
  },
  data: function data() {
    return {
      is_adding_reaction: false,
      is_editing_comment: false,
      is_deleting_comment: false
    };
  },
  computed: _objectSpread({
    is_clickable: function is_clickable() {
      return this.event.active && !this.event.active.has_reaction;
    }
  }, Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapState"])({
    current_user_id: function current_user_id(state) {
      return state.users_store.current_user_id;
    },
    users: function users(state) {
      return state.users_store.user_names;
    }
  })),
  methods: {
    event_reaction: function event_reaction() {
      this.is_adding_reaction = !this.is_adding_reaction;
    },
    edit_comment: function edit_comment() {
      this.is_editing_comment = !this.is_editing_comment;
    },
    delete_comment: function delete_comment(event) {
      var _this = this;

      if (confirm(this.$t("Комментарий будет удален"))) {
        this.is_deleting_comment = true;
        event.can_edit = false;
        this.$store.dispatch("deleteComment", {
          event_id: event.id
        }).then(function () {
          _this.is_deleting_comment = false;
        });
      }
    }
  }
});

/***/ }),

/***/ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/assets/js/internal_crm/components/EventsItem.vue?vue&type=style&index=0&id=24bb8678&scoped=true&lang=css&":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader??ref--5-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--5-2!./node_modules/vue-loader/lib??vue-loader-options!./resources/assets/js/internal_crm/components/EventsItem.vue?vue&type=style&index=0&id=24bb8678&scoped=true&lang=css& ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "\n.events-item[data-v-24bb8678] {\n    font-size: 14px;\n    overflow: auto; /* это хак, чтоб родительский контейнер float-элементов не \"схлопывался\" */\n    margin-bottom: 0;\n    margin-top: 10px;\n}\n.small[data-v-24bb8678] {\n    font-size: 10px;\n}\n.message[data-v-24bb8678] {\n    clear: both;\n    background: none;\n}\n.message > *[data-v-24bb8678] {\n    margin-left: 5px;\n}\n.message .comment_content .comment_action[data-v-24bb8678] {\n    position: absolute;\n    top: 50%;\n    left: -80px;\n    margin-top: -20px;\n}\n.events-item > div[data-v-24bb8678] {\n    clear: both;\n}\n.events-item:not(.right) .message[data-v-24bb8678] {\n    position: relative;\n    margin-left: 0;\n    padding-right: 40%;\n}\n.events-item.right .message[data-v-24bb8678] {\n    position: relative;\n    margin-right: 0;\n    padding-left: 40%;\n    text-align: right;\n}\n.events-item.right .message .body[data-v-24bb8678] {\n    clear: both;\n    text-align: left;\n}\n.events-item.right .message .body.body_short[data-v-24bb8678] {\n    text-align: right;\n}\n.events-item .body a[data-v-24bb8678] {\n    word-break: break-all;\n}\n.events-item .message .name[data-v-24bb8678] {\n    font-weight: bold;\n}\n.event-reaction[data-v-24bb8678] {\n    margin: 5px 0 5px 20px;\n}\n.message:hover .edit-comment[data-v-24bb8678] {\n    display: inline;\n}\n.edit-comment[data-v-24bb8678] {\n    display: none;\n    cursor: pointer;\n    opacity: 0.8;\n}\n.edit-comment[data-v-24bb8678]:hover {\n    opacity: 1;\n    color: #4c87b9; /* blue-soft */\n}\n.edit-comment.delete[data-v-24bb8678]:hover {\n    opacity: 1;\n    color: #e43a45; /* red-mint */\n}\n.deleted[data-v-24bb8678] {\n    text-decoration: line-through;\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/assets/js/internal_crm/components/EventsItem.vue?vue&type=style&index=0&id=24bb8678&scoped=true&lang=css&":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader??ref--5-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--5-2!./node_modules/vue-loader/lib??vue-loader-options!./resources/assets/js/internal_crm/components/EventsItem.vue?vue&type=style&index=0&id=24bb8678&scoped=true&lang=css& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../../node_modules/css-loader??ref--5-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--5-2!../../../../../node_modules/vue-loader/lib??vue-loader-options!./EventsItem.vue?vue&type=style&index=0&id=24bb8678&scoped=true&lang=css& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/assets/js/internal_crm/components/EventsItem.vue?vue&type=style&index=0&id=24bb8678&scoped=true&lang=css&");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/assets/js/internal_crm/components/EventsItem.vue?vue&type=template&id=24bb8678&scoped=true&":
/*!*********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/assets/js/internal_crm/components/EventsItem.vue?vue&type=template&id=24bb8678&scoped=true& ***!
  \*********************************************************************************************************************************************************************************************************************************************/
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
    {
      staticClass: "events-item",
      class: {
        "outline-left": _vm.is_adding_reaction,
        right: _vm.event.align === "right"
      }
    },
    [
      _c(
        "div",
        {
          staticClass: "message",
          class: { deleted: _vm.event.deleted },
          attrs: {
            title: _vm.event.deleted
              ? _vm.$t("Удалено") +
                " " +
                this.users[_vm.event.deleted.user_id] +
                " " +
                _vm.event.deleted.dtime
              : null
          }
        },
        [
          _c("div", { staticClass: "header" }, [
            _vm.event.active && _vm.event.align === "right"
              ? _c("div", [
                  _c("span", { staticClass: "active-event" }, [
                    _vm.event.active.has_reaction
                      ? _c("i", {
                          staticClass:
                            "fa fa-exclamation-triangle font-blue-soft",
                          attrs: {
                            title:
                              _vm.$t("Отреагировал(а)") +
                              " " +
                              this.users[_vm.event.active.reacted_by] +
                              " " +
                              _vm.event.active.reacted_at +
                              " #" +
                              _vm.event.active.reaction_id
                          }
                        })
                      : _c("i", {
                          staticClass:
                            "fa fa-exclamation-triangle font-red-flamingo pointer",
                          attrs: { title: _vm.$t("Отреагировать") },
                          on: { click: _vm.event_reaction }
                        })
                  ])
                ])
              : _vm._e(),
            _vm._v(" "),
            _c("span", { staticClass: "name font-grey-cascade" }, [
              _vm._v(_vm._s(_vm.event.type))
            ]),
            _vm._v(" "),
            _c("span", { staticClass: "font-grey-cascade small" }, [
              _vm._v(_vm._s(_vm.event.dtime))
            ]),
            _vm._v(" "),
            _c("span", { staticClass: "font-grey-cascade small" }, [
              _vm._v("#" + _vm._s(_vm.event.id))
            ]),
            _vm._v(" "),
            _vm.event.reaction_on
              ? _c(
                  "span",
                  {
                    staticClass: "font-grey-cascade small",
                    attrs: {
                      title:
                        _vm.$t("Реакция на событие") +
                        " #" +
                        _vm.event.reaction_on
                    }
                  },
                  [
                    _c("i", { staticClass: "fa fa-arrow-right" }),
                    _vm._v(
                      "\n                #" +
                        _vm._s(_vm.event.reaction_on) +
                        "\n            "
                    )
                  ]
                )
              : _vm._e(),
            _vm._v(" "),
            _vm.event.active && _vm.event.align !== "right"
              ? _c("div", [
                  _c("span", { staticClass: "active-event" }, [
                    _vm.event.active.has_reaction
                      ? _c("i", {
                          staticClass:
                            "fa fa-exclamation-triangle font-blue-soft",
                          attrs: {
                            title:
                              _vm.$t("Отреагировал(а)") +
                              " " +
                              this.users[_vm.event.active.reacted_by] +
                              " " +
                              _vm.event.active.reacted_at +
                              " #" +
                              _vm.event.active.reaction_id
                          }
                        })
                      : _c("i", {
                          staticClass:
                            "fa fa-exclamation-triangle font-red-flamingo pointer",
                          attrs: { title: _vm.$t("Отреагировать") },
                          on: { click: _vm.event_reaction }
                        })
                  ])
                ])
              : _vm._e(),
            _vm._v(" "),
            _vm.event.edited
              ? _c(
                  "span",
                  {
                    staticClass: "font-grey-cascade",
                    attrs: {
                      title:
                        _vm.$t("Изменено") +
                        " " +
                        this.users[_vm.event.edited.user_id] +
                        " " +
                        _vm.event.edited.dtime
                    }
                  },
                  [_c("i", { staticClass: "fa fa-pencil" })]
                )
              : _vm._e(),
            _vm._v(" "),
            _vm.event.author && _vm.event.author === _vm.current_user_id
              ? _c("span", [
                  _c(
                    "span",
                    {
                      staticClass: "edit-comment",
                      attrs: { title: _vm.$t("Редактировать комментарий") },
                      on: {
                        click: function($event) {
                          return _vm.edit_comment(_vm.event.id)
                        }
                      }
                    },
                    [_c("i", { staticClass: "fa fa-edit" })]
                  ),
                  _vm._v(" "),
                  _c(
                    "span",
                    {
                      staticClass: "edit-comment delete",
                      attrs: { title: _vm.$t("Удалить комментарий") },
                      on: {
                        click: function($event) {
                          return _vm.delete_comment(_vm.event)
                        }
                      }
                    },
                    [_c("i", { staticClass: "fa fa-trash" })]
                  ),
                  _vm._v(" "),
                  _vm.is_deleting_comment
                    ? _c(
                        "span",
                        { attrs: { title: _vm.$t("Комментарий удаляется") } },
                        [_c("i", { staticClass: "fa fa-spinner fa-spin" })]
                      )
                    : _vm._e()
                ])
              : _vm._e()
          ]),
          _vm._v(" "),
          _c("div", [
            _c(
              "span",
              _vm._g(
                {
                  class: { "body anchorme": true, pointer: _vm.is_clickable },
                  attrs: {
                    title: _vm.is_clickable ? _vm.$t("Отреагировать") : null
                  },
                  domProps: { textContent: _vm._s(_vm.event.data) }
                },
                _vm.is_clickable ? { click: _vm.event_reaction } : null
              )
            )
          ])
        ]
      ),
      _vm._v(" "),
      _vm.is_adding_reaction
        ? _c("EventCreate", {
            tag: "div",
            staticClass: "event-reaction",
            attrs: { event_id: _vm.event.id },
            on: {
              close: function($event) {
                _vm.is_adding_reaction = false
              }
            }
          })
        : _vm._e(),
      _vm._v(" "),
      _vm.is_editing_comment
        ? _c("EventEdit", {
            tag: "div",
            staticClass: "event-reaction",
            attrs: { event_id: _vm.event.id, comment: _vm.event.data },
            on: {
              close: function($event) {
                _vm.is_editing_comment = false
              }
            }
          })
        : _vm._e(),
      _vm._v(" "),
      _vm.event.active
        ? _c("div", [
            _c("span", { staticClass: "active-event" }, [
              _vm.event.active.has_reaction
                ? _c("i", {
                    staticClass: "fa fa-exclamation-triangle font-blue-soft",
                    attrs: {
                      title:
                        _vm.$t("Отреагировал(а)") +
                        " " +
                        this.users[_vm.event.active.reacted_by] +
                        " " +
                        _vm.event.active.reacted_at +
                        " #" +
                        _vm.event.active.reaction_id
                    }
                  })
                : _c("i", {
                    staticClass:
                      "fa fa-exclamation-triangle font-red-flamingo pointer",
                    attrs: { title: _vm.$t("Отреагировать") },
                    on: { click: _vm.event_reaction }
                  })
            ])
          ])
        : _vm._e()
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./resources/assets/js/internal_crm/components/EventsItem.vue":
/*!********************************************************************!*\
  !*** ./resources/assets/js/internal_crm/components/EventsItem.vue ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _EventsItem_vue_vue_type_template_id_24bb8678_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EventsItem.vue?vue&type=template&id=24bb8678&scoped=true& */ "./resources/assets/js/internal_crm/components/EventsItem.vue?vue&type=template&id=24bb8678&scoped=true&");
/* harmony import */ var _EventsItem_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EventsItem.vue?vue&type=script&lang=js& */ "./resources/assets/js/internal_crm/components/EventsItem.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _EventsItem_vue_vue_type_style_index_0_id_24bb8678_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./EventsItem.vue?vue&type=style&index=0&id=24bb8678&scoped=true&lang=css& */ "./resources/assets/js/internal_crm/components/EventsItem.vue?vue&type=style&index=0&id=24bb8678&scoped=true&lang=css&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _EventsItem_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _EventsItem_vue_vue_type_template_id_24bb8678_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _EventsItem_vue_vue_type_template_id_24bb8678_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "24bb8678",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/assets/js/internal_crm/components/EventsItem.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/assets/js/internal_crm/components/EventsItem.vue?vue&type=script&lang=js&":
/*!*********************************************************************************************!*\
  !*** ./resources/assets/js/internal_crm/components/EventsItem.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_EventsItem_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./EventsItem.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/assets/js/internal_crm/components/EventsItem.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_EventsItem_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/assets/js/internal_crm/components/EventsItem.vue?vue&type=style&index=0&id=24bb8678&scoped=true&lang=css&":
/*!*****************************************************************************************************************************!*\
  !*** ./resources/assets/js/internal_crm/components/EventsItem.vue?vue&type=style&index=0&id=24bb8678&scoped=true&lang=css& ***!
  \*****************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_5_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_5_2_node_modules_vue_loader_lib_index_js_vue_loader_options_EventsItem_vue_vue_type_style_index_0_id_24bb8678_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/style-loader!../../../../../node_modules/css-loader??ref--5-1!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/src??ref--5-2!../../../../../node_modules/vue-loader/lib??vue-loader-options!./EventsItem.vue?vue&type=style&index=0&id=24bb8678&scoped=true&lang=css& */ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/assets/js/internal_crm/components/EventsItem.vue?vue&type=style&index=0&id=24bb8678&scoped=true&lang=css&");
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_5_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_5_2_node_modules_vue_loader_lib_index_js_vue_loader_options_EventsItem_vue_vue_type_style_index_0_id_24bb8678_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_5_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_5_2_node_modules_vue_loader_lib_index_js_vue_loader_options_EventsItem_vue_vue_type_style_index_0_id_24bb8678_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_5_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_5_2_node_modules_vue_loader_lib_index_js_vue_loader_options_EventsItem_vue_vue_type_style_index_0_id_24bb8678_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_5_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_5_2_node_modules_vue_loader_lib_index_js_vue_loader_options_EventsItem_vue_vue_type_style_index_0_id_24bb8678_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_5_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_5_2_node_modules_vue_loader_lib_index_js_vue_loader_options_EventsItem_vue_vue_type_style_index_0_id_24bb8678_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./resources/assets/js/internal_crm/components/EventsItem.vue?vue&type=template&id=24bb8678&scoped=true&":
/*!***************************************************************************************************************!*\
  !*** ./resources/assets/js/internal_crm/components/EventsItem.vue?vue&type=template&id=24bb8678&scoped=true& ***!
  \***************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_EventsItem_vue_vue_type_template_id_24bb8678_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./EventsItem.vue?vue&type=template&id=24bb8678&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/assets/js/internal_crm/components/EventsItem.vue?vue&type=template&id=24bb8678&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_EventsItem_vue_vue_type_template_id_24bb8678_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_EventsItem_vue_vue_type_template_id_24bb8678_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);