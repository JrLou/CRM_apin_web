webpackJsonp([58],{718:function(e,a,t){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(a,"__esModule",{value:!0});var r=t(11),u=n(r),c=t(119),d=n(c),o=t(288);a.default={namespace:"rule",state:{data:{list:[],pagination:{}},loading:!0},effects:{fetch:d.default.mark(function e(a,t){var n,r=a.payload,u=t.call,c=t.put;return d.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,c({type:"changeLoading",payload:!0});case 2:return e.next=4,u(o.queryRule,r);case 4:return n=e.sent,e.next=7,c({type:"save",payload:n});case 7:return e.next=9,c({type:"changeLoading",payload:!1});case 9:case"end":return e.stop()}},e,this)}),add:d.default.mark(function e(a,t){var n,r=a.payload,u=a.callback,c=t.call,s=t.put;return d.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,s({type:"changeLoading",payload:!0});case 2:return e.next=4,c(o.addRule,r);case 4:return n=e.sent,e.next=7,s({type:"save",payload:n});case 7:return e.next=9,s({type:"changeLoading",payload:!1});case 9:u&&u();case 10:case"end":return e.stop()}},e,this)}),remove:d.default.mark(function e(a,t){var n,r=a.payload,u=a.callback,c=t.call,s=t.put;return d.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,s({type:"changeLoading",payload:!0});case 2:return e.next=4,c(o.removeRule,r);case 4:return n=e.sent,e.next=7,s({type:"save",payload:n});case 7:return e.next=9,s({type:"changeLoading",payload:!1});case 9:u&&u();case 10:case"end":return e.stop()}},e,this)})},reducers:{save:function(e,a){return(0,u.default)({},e,{data:a.payload})},changeLoading:function(e,a){return(0,u.default)({},e,{loading:a.payload})}}},e.exports=a.default}});