webpackJsonp([49],{709:function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(7),o=a(r),u=n(822),c=a(u),i=n(120),s=a(i);n(823);var l=n(291);t.default={namespace:"h5List",state:{list:{data:[],option:{}},loading:!1,double:!1,logs:{}},effects:{fetch:s.default.mark(function e(t,n){var a,r,o,u=t.payload,c=n.call,i=n.put;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,i({type:"changeLoading",payload:!0});case 2:return e.next=4,i({type:"changeDouble",payload:!0});case 4:return a=Date.now(),e.next=7,c(l.geth5,u);case 7:if(!((r=e.sent)&&r.code>=1)){e.next=11;break}return e.next=11,i({type:"save",payload:r});case 11:return e.next=13,i({type:"changeLoading",payload:!1});case 13:if((o=Date.now())-a>2e3){e.next=17;break}return e.next=17,c(l.fakequest,1e3);case 17:return e.next=19,i({type:"changeDouble",payload:!1});case 19:case"end":return e.stop()}},e,this)}),changeStatus:s.default.mark(function e(t,n){var a,r,o=t.payload,u=n.call,i=n.put;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,i({type:"changeLoading",payload:!0});case 2:return e.next=4,u(l.stateAirLine,o.status);case 4:return a=e.sent,a&&a.code>=1&&c.default.success("\u64cd\u4f5c\u6210\u529f"),e.next=8,u(l.geth5,o.filter);case 8:if(!((r=e.sent)&&r.code>=1)){e.next=14;break}return e.next=12,i({type:"save",payload:r});case 12:return e.next=14,i({type:"changeLoading",payload:!1});case 14:case"end":return e.stop()}},e,this)}),loglist:s.default.mark(function e(t,n){var a,r=t.payload,o=n.call,u=n.put;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,o(l.getAirLineLogs,r);case 2:if(!((a=e.sent)&&a.code>=1)){e.next=6;break}return e.next=6,u({type:"log",payload:a});case 6:case"end":return e.stop()}},e,this)})},reducers:{save:function(e,t){if(t.payload.option)return(0,o.default)({},e,{list:t.payload})},log:function(e,t){return(0,o.default)({},e,{logs:t.payload})},changeLoading:function(e,t){return(0,o.default)({},e,{loading:t.payload})},changeDouble:function(e,t){return(0,o.default)({},e,{double:t.payload})}}},e.exports=t.default},822:function(e,t,n){"use strict";function a(e){if(l)return void e(l);u.default.newInstance({prefixCls:f,transitionName:"move-up",style:{top:s},getContainer:p},function(t){if(l)return void e(l);l=t,e(t)})}function r(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:i,n=arguments[2],r=arguments[3],u={info:"info-circle",success:"check-circle",error:"cross-circle",warning:"exclamation-circle",loading:"loading"}[n];"function"==typeof t&&(r=t,t=i);var s=d++;return a(function(a){a.notice({key:s,duration:t,style:{},content:o.createElement("div",{className:f+"-custom-content "+f+"-"+n},o.createElement(c.default,{type:u}),o.createElement("span",null,e)),onClose:r})}),function(){l&&l.removeNotice(s)}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(4),u=(n.n(o),n(296)),c=n(289),i=3,s=void 0,l=void 0,d=1,f="ant-message",p=void 0;t.default={info:function(e,t,n){return r(e,t,"info",n)},success:function(e,t,n){return r(e,t,"success",n)},error:function(e,t,n){return r(e,t,"error",n)},warn:function(e,t,n){return r(e,t,"warning",n)},warning:function(e,t,n){return r(e,t,"warning",n)},loading:function(e,t,n){return r(e,t,"loading",n)},config:function(e){void 0!==e.top&&(s=e.top,l=null),void 0!==e.duration&&(i=e.duration),void 0!==e.prefixCls&&(f=e.prefixCls),void 0!==e.getContainer&&(p=e.getContainer)},destroy:function(){l&&(l.destroy(),l=null)}}},823:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=n(176),r=(n.n(a),n(878));n.n(r)},878:function(e,t){}});