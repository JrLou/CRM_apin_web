webpackJsonp([60],{701:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var a=n(7),u=r(a),o=n(821),c=r(o),i=n(120),s=r(i);n(822);var d=n(291);t.default={namespace:"flightstockAdd",state:{accurate:{},numbering:null,visible:!1,ok:"",judgment:!1},effects:{addAirLine:s.default.mark(function e(t,n){var r,a=t.payload,u=n.call,o=n.put;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,o({type:"clearAdd",payload:a});case 2:return e.next=4,u(d.getaddAirLine,a);case 4:if(!((r=e.sent)&&r.code>=1&&r.data)){e.next=14;break}return e.next=8,o({type:"accurates",payload:r});case 8:return e.next=10,o({type:"numbering",payload:a});case 10:return e.next=12,o({type:"oktxt",payload:{ok:"\u9009\u62e9\u822a\u73ed"}});case 12:e.next=16;break;case 14:return e.next=16,o({type:"oktxt",payload:{ok:"\u624b\u5de5\u5f55\u5165"}});case 16:return e.next=18,o({type:"visibles",payload:{visible:!0}});case 18:case"end":return e.stop()}},e,this)}),visiblebs:s.default.mark(function e(t,n){var r=t.payload,a=(n.call,n.put);return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,a({type:"visibles",payload:r});case 2:case"end":return e.stop()}},e,this)}),clearAdds:s.default.mark(function e(t,n){var r=t.payload,a=(n.call,n.put);return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,a({type:"clearAdd",payload:r});case 2:case"end":return e.stop()}},e,this)}),getaddtit:s.default.mark(function e(t,n){var r,a=t.payload,u=n.call,o=n.put;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u(d.getadd,a);case 2:if(!((r=e.sent)&&r.code>=1)){e.next=7;break}return c.default.success("\u64cd\u4f5c\u6210\u529f"),e.next=7,o({type:"judgmentes",payload:{judgmentes:!0}});case 7:case"end":return e.stop()}},e,this)}),judgmentesdobj:s.default.mark(function e(t,n){var r=t.payload,a=(n.call,n.put);return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,a({type:"judgmentes",payload:r});case 2:case"end":return e.stop()}},e,this)})},reducers:{numbering:function(e,t){return(0,u.default)({},e,{numbering:t.payload.numbering})},oktxt:function(e,t){return(0,u.default)({},e,{ok:t.payload.ok})},accurates:function(e,t){return(0,u.default)({},e,{accurate:t.payload})},clearAdd:function(e,t){return(0,u.default)({},e,{accurate:{},numbering:null})},visibles:function(e,t){return(0,u.default)({},e,{visible:t.payload.visible})},judgmentes:function(e,t){return(0,u.default)({},e,{judgment:t.payload.judgmentes})}}},e.exports=t.default},821:function(e,t,n){"use strict";function r(e){if(d)return void e(d);o.default.newInstance({prefixCls:f,transitionName:"move-up",style:{top:s},getContainer:p},function(t){if(d)return void e(d);d=t,e(t)})}function a(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:i,n=arguments[2],a=arguments[3],o={info:"info-circle",success:"check-circle",error:"cross-circle",warning:"exclamation-circle",loading:"loading"}[n];"function"==typeof t&&(a=t,t=i);var s=l++;return r(function(r){r.notice({key:s,duration:t,style:{},content:u.createElement("div",{className:f+"-custom-content "+f+"-"+n},u.createElement(c.default,{type:o}),u.createElement("span",null,e)),onClose:a})}),function(){d&&d.removeNotice(s)}}Object.defineProperty(t,"__esModule",{value:!0});var u=n(4),o=(n.n(u),n(296)),c=n(289),i=3,s=void 0,d=void 0,l=1,f="ant-message",p=void 0;t.default={info:function(e,t,n){return a(e,t,"info",n)},success:function(e,t,n){return a(e,t,"success",n)},error:function(e,t,n){return a(e,t,"error",n)},warn:function(e,t,n){return a(e,t,"warning",n)},warning:function(e,t,n){return a(e,t,"warning",n)},loading:function(e,t,n){return a(e,t,"loading",n)},config:function(e){void 0!==e.top&&(s=e.top,d=null),void 0!==e.duration&&(i=e.duration),void 0!==e.prefixCls&&(f=e.prefixCls),void 0!==e.getContainer&&(p=e.getContainer)},destroy:function(){d&&(d.destroy(),d=null)}}},822:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(176),a=(n.n(r),n(863));n.n(a)},863:function(e,t){}});