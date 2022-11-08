(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["services-events_service"],{

/***/ "./resources/assets/js/internal_crm/services/events_service.js":
/*!*********************************************************************!*\
  !*** ./resources/assets/js/internal_crm/services/events_service.js ***!
  \*********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);

var apiClient = axios__WEBPACK_IMPORTED_MODULE_0___default.a.create({
  baseURL: "https://" + window.location.hostname + "/internal_crm/test/",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    'Content-Type': "application/json"
  }
});
/* harmony default export */ __webpack_exports__["default"] = ({
  addComment: function addComment(lead_id, comment, event_id) {
    return apiClient.post("set/event/comment", {
      lead_id: lead_id,
      comment: comment,
      event_id: event_id
    });
  },
  editComment: function editComment(lead_id, event_id, comment) {
    return apiClient.post("set/event/edit", {
      lead_id: lead_id,
      event_id: event_id,
      comment: comment
    });
  },
  deleteComment: function deleteComment(lead_id, event_id) {
    return apiClient.post("set/event/delete", {
      lead_id: lead_id,
      event_id: event_id
    });
  }
});

/***/ })

}]);