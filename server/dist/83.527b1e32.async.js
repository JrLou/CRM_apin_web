webpackJsonp([83],{695:function(e,a,t){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(a,"__esModule",{value:!0});var r=t(7),o=n(r),u=t(120),c=n(u),d=t(291),s=t(183);a.default={namespace:"choose",state:{loading:!0,tableData:{},logData:[]},effects:{fetch:c.default.mark(function e(a,t){var n,r=a.payload,o=t.call,u=t.put;return c.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u({type:"changeLoading",payload:!0});case 2:return e.next=4,o(d.orderList,r);case 4:return n=e.sent,e.next=7,u({type:"getTable",payload:n});case 7:return e.next=9,u({type:"changeLoading",payload:!1});case 9:case"end":return e.stop()}},e,this)}),getLogs:c.default.mark(function e(a,t){var n,r=a.payload,o=t.call,u=t.put;return c.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u({type:"changeLoading",payload:!0});case 2:return e.next=4,o(d.logList,r);case 4:return n=e.sent,e.next=7,u({type:"showLog",payload:n});case 7:return e.next=9,u({type:"changeLoading",payload:!1});case 9:case"end":return e.stop()}},e,this)}),continueAdd:c.default.mark(function e(a,t){var n,r=a.payload,o=t.call,u=t.put;return c.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u({type:"changeLoading",payload:!0});case 2:return e.next=4,o(d.continueAdd,r);case 4:if(!((n=e.sent)&&n.code>=1)){e.next=8;break}return e.next=8,u(s.routerRedux.push("/fightgroups/demand/checkFightGroups/"+r.groupId));case 8:return e.next=10,u({type:"changeLoading",payload:!1});case 10:case"end":return e.stop()}},e,this)})},reducers:{getTable:function(e,a){var t=a.payload;return(0,o.default)({},e,{tableData:t})},changeLoading:function(e,a){var t=a.payload;return(0,o.default)({},e,{loading:t})},showLog:function(e,a){var t=a.payload;return(0,o.default)({},e,{logData:t})}}},e.exports=a.default}});