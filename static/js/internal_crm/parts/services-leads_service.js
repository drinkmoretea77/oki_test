(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["services-leads_service"],{

/***/ "./resources/assets/js/internal_crm/services/leads_service.js":
/*!********************************************************************!*\
  !*** ./resources/assets/js/internal_crm/services/leads_service.js ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_1__);


function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }


var apiClient = axios__WEBPACK_IMPORTED_MODULE_1___default.a.create({
  baseURL: "https://" + window.location.hostname + "/internal_crm/test/",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    'Content-Type': "application/json"
  }
});
var token = window.csrfToken;

function getFormData(params) {
  var needToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var formData = new FormData();

  for (var key in params) {
    if (params.hasOwnProperty(key)) {
      formData.append(key, params[key]);
    }
  }

  if (needToken) {
    formData.append('_token', token);
  }

  return formData;
}

/* harmony default export */ __webpack_exports__["default"] = ({
  getLeads: function getLeads() {
    return apiClient.get("get/leads");
  },
  getLead: function getLead(id) {
    return apiClient.get("get/lead/" + id);
  },
  getDictionaries: function getDictionaries() {
    return apiClient.get("get/dictionaries");
  },
  setLeadName: function setLeadName(lead_id, name, comment, event_id) {
    return apiClient.post("set/lead/name", {
      lead_id: lead_id,
      name: name,
      comment: comment,
      event_id: event_id
    });
  },
  setLeadStatus: function setLeadStatus(lead_id, status, comment, event_id) {
    return apiClient.post("set/lead/status", {
      lead_id: lead_id,
      status: status,
      comment: comment,
      event_id: event_id
    });
  },
  setLeadStage: function setLeadStage(lead_id, stage, comment, event_id) {
    return apiClient.post("set/lead/stage", {
      lead_id: lead_id,
      stage: stage,
      comment: comment,
      event_id: event_id
    });
  },
  assignLead: function assignLead(lead_id, user_id, comment, event_id) {
    return apiClient.post("set/lead/assign", {
      lead_id: lead_id,
      user_id: user_id,
      comment: comment,
      event_id: event_id
    });
  },
  getDetailsLead: function getDetailsLead(id) {
    return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return apiClient.get("get/lead/" + id + "/details");

            case 2:
              return _context.abrupt("return", _context.sent);

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  },
  setSettingsLead: function setSettingsLead(params) {
    return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2() {
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return apiClient.post("set/lead/settings", getFormData(params));

            case 2:
              return _context2.abrupt("return", _context2.sent);

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }))();
  },
  setTrialLead: function setTrialLead(params) {
    return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee3() {
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return apiClient.post("set/lead/trial", getFormData(params));

            case 2:
              return _context3.abrupt("return", _context3.sent);

            case 3:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }))();
  },
  setAdminsLead: function setAdminsLead(params) {
    return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee4() {
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return apiClient.post("set/lead/admins", getFormData(params));

            case 2:
              return _context4.abrupt("return", _context4.sent);

            case 3:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }))();
  }
});

/***/ })

}]);