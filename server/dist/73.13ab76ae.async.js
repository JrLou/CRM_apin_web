webpackJsonp([73],{706:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=a(7),o=n(r),u=a(120),l=n(u),d=a(292);t.default={namespace:"flyPiglist",state:{loading:!0,data:{},total:0},effects:{fetch:l.default.mark(function e(t,a){var n,r=t.payload,o=a.call,u=a.put;return l.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u({type:"changeLoading",payload:!0});case 2:return e.next=4,o(d.queryFlyList,r);case 4:return n=e.sent,e.next=7,u({type:"save",payload:n});case 7:return e.next=9,u({type:"changeLoading",payload:!1});case 9:case"end":return e.stop()}},e,this)})},reducers:{save:function(e,t){var a=t.payload;return(0,o.default)({},e,{list:a.data,total:a.option.total})},changeLoading:function(e,t){var a=t.payload;return(0,o.default)({},e,{loading:a})}}},e.exports=t.default}});