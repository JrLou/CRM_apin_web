webpackJsonp([53],{704:function(e,n,t){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(n,"__esModule",{value:!0});var a=t(7),o=r(a),i=t(120),c=r(i),u=t(812),s=r(u);t(813);var l=t(292);n.default={namespace:"flyingpigList",state:{loading:!0,data:{data:[],option:{}}},effects:{getList:c.default.mark(function e(n,t){var r,a,o=n.payload,i=t.call,u=t.put;return c.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u({type:"changeLoading",payload:!0});case 2:return e.next=4,i(l.getFlylist,o);case 4:if(!((r=e.sent)&&r.code>=1)){e.next=10;break}return e.next=8,u({type:"save",payload:r});case 8:e.next=11;break;case 10:r?(a=r.msg?r.msg:"\u8bf7\u6c42\u6709\u8bef",s.default.error(a)):s.default.error("\u7cfb\u7edf\u5f02\u5e38");case 11:return e.next=13,u({type:"changeLoading",payload:!1});case 13:case"end":return e.stop()}},e,this)})},reducers:{save:function(e,n){var t=n.payload;return(0,o.default)({},e,{data:t})},changeLoading:function(e,n){var t=n.payload;return(0,o.default)({},e,{loading:t})}}},e.exports=n.default},812:function(e,n,t){"use strict";function r(e){if(l)return void e(l);i.default.newInstance({prefixCls:f,transitionName:"move-up",style:{top:s},getContainer:p},function(n){if(l)return void e(l);l=n,e(n)})}function a(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:u,t=arguments[2],a=arguments[3],i={info:"info-circle",success:"check-circle",error:"cross-circle",warning:"exclamation-circle",loading:"loading"}[t];"function"==typeof n&&(a=n,n=u);var s=d++;return r(function(r){r.notice({key:s,duration:n,style:{},content:o.createElement("div",{className:f+"-custom-content "+f+"-"+t},o.createElement(c.default,{type:i}),o.createElement("span",null,e)),onClose:a})}),function(){l&&l.removeNotice(s)}}Object.defineProperty(n,"__esModule",{value:!0});var o=t(4),i=(t.n(o),t(295)),c=t(289),u=3,s=void 0,l=void 0,d=1,f="ant-message",p=void 0;n.default={info:function(e,n,t){return a(e,n,"info",t)},success:function(e,n,t){return a(e,n,"success",t)},error:function(e,n,t){return a(e,n,"error",t)},warn:function(e,n,t){return a(e,n,"warning",t)},warning:function(e,n,t){return a(e,n,"warning",t)},loading:function(e,n,t){return a(e,n,"loading",t)},config:function(e){void 0!==e.top&&(s=e.top,l=null),void 0!==e.duration&&(u=e.duration),void 0!==e.prefixCls&&(f=e.prefixCls),void 0!==e.getContainer&&(p=e.getContainer)},destroy:function(){l&&(l.destroy(),l=null)}}},813:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=t(176),a=(t.n(r),t(849));t.n(a)},849:function(e,n){}});