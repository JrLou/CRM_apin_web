webpackJsonp([50],{714:function(e,a,t){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(a,"__esModule",{value:!0});var r=t(7),u=n(r),o=t(119),s=n(o),c=t(286);a.default={namespace:"roleManageList",state:{list:[],loading:!0},effects:{fetch:s.default.mark(function e(a,t){var n,r=a.payload,u=t.call,o=t.put;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,o({type:"changeLoading",payload:!0});case 2:return e.next=4,u(c.roleManageList,r);case 4:return n=e.sent,e.next=7,o({type:"save",payload:n.data});case 7:return e.next=9,o({type:"changeLoading",payload:!1});case 9:case"end":return e.stop()}},e,this)})},reducers:{save:function(e,a){return(0,u.default)({},e,{list:a.payload})},changeLoading:function(e,a){return(0,u.default)({},e,{loading:a.payload})}}},e.exports=a.default}});