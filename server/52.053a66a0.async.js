webpackJsonp([52],{711:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=a(7),u=n(r),o=a(119),d=n(o),s=a(286);t.default={namespace:"refund",state:{loading:!0,list:[],total:0},effects:{getList:d.default.mark(function e(t,a){var n,r=t.payload,u=a.call,o=a.put;return d.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,o({type:"changeLoading",payload:!0});case 2:return e.next=4,u(s.getRefundList,r);case 4:return n=e.sent,e.next=7,o({type:"save",payload:n});case 7:return e.next=9,o({type:"changeLoading",payload:!1});case 9:case"end":return e.stop()}},e,this)})},reducers:{save:function(e,t){var a=t.payload;return(0,u.default)({},e,{list:a.data||[],total:a.option.total||0})},changeLoading:function(e,t){var a=t.payload;return(0,u.default)({},e,{loading:a})}}},e.exports=t.default}});