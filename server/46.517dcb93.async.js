webpackJsonp([46],{719:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=a(7),u=n(r),c=a(119),o=n(c),d=a(286);t.default={namespace:"view",state:{tableData:{},loading:!1},effects:{fetch:o.default.mark(function e(t,a){var n,r=t.payload,u=a.call,c=a.put;return o.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,c({type:"changeLoading",payload:!0});case 2:return e.next=4,u(d.viewList,r);case 4:return n=e.sent,e.next=7,c({type:"queryList",payload:n});case 7:return e.next=9,c({type:"changeLoading",payload:!1});case 9:case"end":return e.stop()}},e,this)})},reducers:{queryList:function(e,t){return(0,u.default)({},e,{tableData:t.payload})},changeLoading:function(e,t){return(0,u.default)({},e,{loading:t.payload})}}},e.exports=t.default}});