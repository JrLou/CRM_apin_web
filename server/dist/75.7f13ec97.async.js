webpackJsonp([75],{698:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=a(7),u=n(r),o=a(120),c=n(o),s=a(291);t.default={namespace:"fightGroupsList",state:{listData:{},loading:!1,double:!1},effects:{fetch:c.default.mark(function e(t,a){var n,r,u,o=t.payload,l=a.call,d=a.put;return c.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,d({type:"changeLoading",payload:!0});case 2:return e.next=4,d({type:"changeDouble",payload:!0});case 4:return n=Date.now(),e.next=7,l(s.queryFightGroupsList,o);case 7:if(r=e.sent,!(r.code>=1)){e.next=11;break}return e.next=11,d({type:"getList",payload:r});case 11:return e.next=13,d({type:"changeLoading",payload:!1});case 13:if((u=Date.now())-n>2e3){e.next=17;break}return e.next=17,l(s.fakequest,1e3);case 17:return e.next=19,d({type:"changeDouble",payload:!1});case 19:case"end":return e.stop()}},e,this)})},reducers:{getList:function(e,t){var a=t.payload;return(0,u.default)({},e,{listData:a})},changeLoading:function(e,t){var a=t.payload;return(0,u.default)({},e,{loading:a})},changeDouble:function(e,t){var a=t.payload;return(0,u.default)({},e,{double:a})}}},e.exports=t.default}});