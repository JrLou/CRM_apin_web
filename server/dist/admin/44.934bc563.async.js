webpackJsonp([44],{701:function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(7),u=a(r),i=n(806),c=a(i),o=n(119),s=a(o);n(807);var d=n(287);t.default={namespace:"flightstockEdit",state:{details:[],airline:[],accurate:null,ajaxJudgment:!1,logs:{}},effects:{addtailAirLine:s.default.mark(function e(t,n){var a,r=t.payload,u=n.call,i=n.put;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u(d.getdetailAirLine,r);case 2:if(a=e.sent,!(a.code>=1)){e.next=6;break}return e.next=6,i({type:"detail",payload:a});case 6:case"end":return e.stop()}},e,this)}),getpriceAirline:s.default.mark(function e(t,n){var a,r=t.payload,u=n.call,i=n.put;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u(d.getpriceAirline,r);case 2:if(a=e.sent,!(a.code>0)){e.next=6;break}return e.next=6,i({type:"airline",payload:a});case 6:case"end":return e.stop()}},e,this)}),getmodifyPricees:s.default.mark(function e(t,n){var a,r=t.payload,u=n.call,i=n.put;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u(d.getmodifyPrice,r);case 2:if(a=e.sent,!(a.code>0)){e.next=7;break}return c.default.success("\u64cd\u4f5c\u6210\u529f"),e.next=7,i({type:"ajaxJudg",payload:{ajaxJudgment:!0}});case 7:case"end":return e.stop()}},e,this)}),getmodifyInventoryes:s.default.mark(function e(t,n){var a,r=t.payload,u=n.call,i=n.put;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u(d.getmodifyInventory,r);case 2:if(a=e.sent,!(a.code>0)){e.next=7;break}return c.default.success("\u64cd\u4f5c\u6210\u529f"),e.next=7,i({type:"ajaxJudg",payload:{ajaxJudgment:!0}});case 7:case"end":return e.stop()}},e,this)}),getgetmodifyDayses:s.default.mark(function e(t,n){var a,r=t.payload,u=n.call,i=n.put;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u(d.getmodifyDays,r);case 2:if(a=e.sent,!(a.code>0)){e.next=7;break}return c.default.success("\u64cd\u4f5c\u6210\u529f"),e.next=7,i({type:"ajaxJudg",payload:{ajaxJudgment:!0}});case 7:case"end":return e.stop()}},e,this)}),getimportFilees:s.default.mark(function e(t,n){var a,r=t.payload,u=n.call,i=n.put;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u(d.getimportFile,r);case 2:if(a=e.sent,!(a.code>0)){e.next=7;break}return c.default.success("\u64cd\u4f5c\u6210\u529f"),e.next=7,i({type:"ajaxJudg",payload:{ajaxJudgment:!0}});case 7:case"end":return e.stop()}},e,this)}),geteditAirlines:s.default.mark(function e(t,n){var a,r=t.payload,u=n.call,i=n.put;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u(d.geteditAirline,r);case 2:if(a=e.sent,!(a.code>0)){e.next=7;break}return c.default.success("\u64cd\u4f5c\u6210\u529f"),e.next=7,i({type:"ajaxJudg",payload:{ajaxJudgment:!0}});case 7:case"end":return e.stop()}},e,this)}),getstateAirLines:s.default.mark(function e(t,n){var a,r=t.payload,u=n.call,i=n.put;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u(d.stateAirLine,r);case 2:if(a=e.sent,!(a.code>0)){e.next=7;break}return c.default.success("\u64cd\u4f5c\u6210\u529f"),e.next=7,i({type:"ajaxJudg",payload:{ajaxJudgment:!0}});case 7:case"end":return e.stop()}},e,this)}),loglist:s.default.mark(function e(t,n){var a,r=t.payload,u=n.call,i=n.put;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u(d.getAirLineLogs,r);case 2:return a=e.sent,e.next=5,i({type:"log",payload:a});case 5:case"end":return e.stop()}},e,this)}),LogAirLine:s.default.mark(function e(t,n){var a,r=t.payload,u=n.call,i=n.put;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u(d.getLogAirLine,r);case 2:if(a=e.sent,!(a.code>0)){e.next=7;break}return c.default.success("\u64cd\u4f5c\u6210\u529f"),e.next=7,i({type:"ajaxJudg",payload:{ajaxJudgment:!0}});case 7:case"end":return e.stop()}},e,this)}),ajaxJu:s.default.mark(function e(t,n){var a=t.payload,r=(n.call,n.put);return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r({type:"ajaxJudg",payload:a});case 2:case"end":return e.stop()}},e,this)})},reducers:{detail:function(e,t){return(0,u.default)({},e,{details:t.payload.data})},airline:function(e,t){return(0,u.default)({},e,{airline:t.payload.data})},log:function(e,t){return(0,u.default)({},e,{logs:t.payload})},ajaxJudg:function(e,t){return(0,u.default)({},e,{ajaxJudgment:t.payload.ajaxJudgment})}}},e.exports=t.default},806:function(e,t,n){"use strict";function a(e){if(d)return void e(d);i.a.newInstance({prefixCls:f,transitionName:"move-up",style:{top:s},getContainer:p},function(t){if(d)return void e(d);d=t,e(t)})}function r(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:o,n=arguments[2],r=arguments[3],i={info:"info-circle",success:"check-circle",error:"cross-circle",warning:"exclamation-circle",loading:"loading"}[n];"function"==typeof t&&(r=t,t=o);var s=l++;return a(function(a){a.notice({key:s,duration:t,style:{},content:u.createElement("div",{className:f+"-custom-content "+f+"-"+n},u.createElement(c.default,{type:i}),u.createElement("span",null,e)),onClose:r})}),function(){d&&d.removeNotice(s)}}Object.defineProperty(t,"__esModule",{value:!0});var u=n(4),i=(n.n(u),n(291)),c=n(286),o=3,s=void 0,d=void 0,l=1,f="ant-message",p=void 0;t.default={info:function(e,t,n){return r(e,t,"info",n)},success:function(e,t,n){return r(e,t,"success",n)},error:function(e,t,n){return r(e,t,"error",n)},warn:function(e,t,n){return r(e,t,"warning",n)},warning:function(e,t,n){return r(e,t,"warning",n)},loading:function(e,t,n){return r(e,t,"loading",n)},config:function(e){void 0!==e.top&&(s=e.top,d=null),void 0!==e.duration&&(o=e.duration),void 0!==e.prefixCls&&(f=e.prefixCls),void 0!==e.getContainer&&(p=e.getContainer)},destroy:function(){d&&(d.destroy(),d=null)}}},807:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=n(175),r=(n.n(a),n(840));n.n(r)},840:function(e,t){}});