webpackJsonp([58],{715:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=a(7),u=n(r),o=a(119),l=n(o),s=a(287);t.default={namespace:"refund",state:{loading:!0,list:[],total:0,offlineResponse:{},retryResponse:{}},effects:{getList:l.default.mark(function e(t,a){var n,r=t.payload,u=a.call,o=a.put;return l.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,o({type:"changeLoading",payload:!0});case 2:return e.next=4,u(s.getRefundList,r);case 4:return n=e.sent,e.next=7,o({type:"save",payload:n});case 7:return e.next=9,o({type:"changeLoading",payload:!1});case 9:case"end":return e.stop()}},e,this)}),offlineRefund:l.default.mark(function e(t,a){var n,r=t.payload,u=(t.callback,a.call),o=a.put;return l.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u(s.offlineRefund,r);case 2:return n=e.sent,e.next=5,o({type:"offline",payload:n});case 5:case"end":return e.stop()}},e,this)}),retryRefund:l.default.mark(function e(t,a){var n,r=t.payload,u=(t.callback,a.call),o=a.put;return l.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u(s.retryRefund,r);case 2:return n=e.sent,e.next=5,o({type:"retry",payload:n});case 5:case"end":return e.stop()}},e,this)})},reducers:{save:function(e,t){var a=t.payload;return(0,u.default)({},e,{list:a.data||[],total:a.option.total||0})},offline:function(e,t){var a=t.payload;return(0,u.default)({},e,{offlineResponse:a})},retry:function(e,t){var a=t.payload;return(0,u.default)({},e,{retryResponse:a})},changeLoading:function(e,t){var a=t.payload;return(0,u.default)({},e,{loading:a})}}},e.exports=t.default}});