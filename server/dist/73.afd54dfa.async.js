webpackJsonp([73],{703:function(e,a,t){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(a,"__esModule",{value:!0});var r=t(7),u=n(r),l=t(120),i=n(l),d=t(291);a.default={namespace:"flightstockView",state:{details:[],airline:[],accurate:null,ajaxJudgment:!1,logs:{}},effects:{addtailAirLine:i.default.mark(function e(a,t){var n,r=a.payload,u=t.call,l=t.put;return i.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u(d.getdetailAirLine,r);case 2:if(n=e.sent,!(n.code>=1)){e.next=6;break}return e.next=6,l({type:"detail",payload:n});case 6:case"end":return e.stop()}},e,this)}),getpriceAirline:i.default.mark(function e(a,t){var n,r=a.payload,u=t.call,l=t.put;return i.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u(d.getpriceAirline,r);case 2:if(n=e.sent,!(n.code>0)){e.next=6;break}return e.next=6,l({type:"airline",payload:n});case 6:case"end":return e.stop()}},e,this)}),ajaxJu:i.default.mark(function e(a,t){var n=a.payload,r=(t.call,t.put);return i.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r({type:"ajaxJudg",payload:n});case 2:case"end":return e.stop()}},e,this)})},reducers:{detail:function(e,a){return(0,u.default)({},e,{details:a.payload.data})},airline:function(e,a){return(0,u.default)({},e,{airline:a.payload.data})},log:function(e,a){return(0,u.default)({},e,{logs:a.payload})},ajaxJudg:function(e,a){return(0,u.default)({},e,{ajaxJudgment:a.payload.ajaxJudgment})}}},e.exports=a.default}});