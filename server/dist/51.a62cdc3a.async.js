webpackJsonp([51],{708:function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(7),u=a(r),c=n(812),o=a(c),d=n(120),i=a(d);n(813);var s=n(292);t.default={namespace:"h5Add",state:{accurate:{},numbering:null,visible:!1,ok:"",judgment:!1,details:[],code:[]},effects:{addAirLine:i.default.mark(function e(t,n){var a,r=t.payload,u=n.call,c=n.put;return i.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,c({type:"clearAdd",payload:r});case 2:return e.next=4,u(s.getaddAirLine,r);case 4:if(!((a=e.sent)&&a.code>=1&&a.data)){e.next=14;break}return e.next=8,c({type:"accurates",payload:a});case 8:return e.next=10,c({type:"numbering",payload:r});case 10:return e.next=12,c({type:"oktxt",payload:{ok:"\u9009\u62e9\u822a\u73ed"}});case 12:e.next=16;break;case 14:return e.next=16,c({type:"oktxt",payload:{ok:"\u624b\u5de5\u5f55\u5165"}});case 16:return e.next=18,c({type:"visibles",payload:{visible:!0}});case 18:case"end":return e.stop()}},e,this)}),addtailAirLine:i.default.mark(function e(t,n){var a,r=t.payload,u=n.call,c=n.put;return i.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u(s.getdetailAirLine,r);case 2:if(!((a=e.sent)&&a.code>=1)){e.next=6;break}return e.next=6,c({type:"detail",payload:a});case 6:case"end":return e.stop()}},e,this)}),geteditAirlines:i.default.mark(function e(t,n){var a,r=t.payload,u=n.call,c=n.put;return i.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u(s.geth5Edit,r);case 2:if(!((a=e.sent)&&a.code>=1)){e.next=7;break}return o.default.success("\u64cd\u4f5c\u6210\u529f"),e.next=7,c({type:"judgme",payload:{judgmentes:!0}});case 7:case"end":return e.stop()}},e,this)}),getsearchAirportes:i.default.mark(function e(t,n){var a,r,u=t.payload,c=n.call,d=n.put;return i.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,c(s.getsearchAirport,{code:u.code[0]});case 2:return a=e.sent,e.next=5,c(s.getsearchAirport,{code:u.code[1]});case 5:if(r=e.sent,!(a&&r&&a.data.length>0&&r.data.length>0)){e.next=11;break}return e.next=9,d({type:"codes",payload:{code:[a,r]}});case 9:e.next=13;break;case 11:return o.default.warning("\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u673a\u573a\u4e09\u5b57\u7801"),e.abrupt("return");case 13:case"end":return e.stop()}},e,this)}),getsearchAirportesaddes:i.default.mark(function e(t,n){var a=t.payload,r=(n.call,n.put);return i.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r({type:"getsearchAirportesadd",payload:a});case 2:case"end":return e.stop()}},e,this)}),visiblebs:i.default.mark(function e(t,n){var a=t.payload,r=(n.call,n.put);return i.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r({type:"visibles",payload:a});case 2:case"end":return e.stop()}},e,this)}),clearAdds:i.default.mark(function e(t,n){var a=t.payload,r=(n.call,n.put);return i.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r({type:"clearAdd",payload:a});case 2:case"end":return e.stop()}},e,this)}),getaddtit:i.default.mark(function e(t,n){var a,r=t.payload,u=n.call,c=n.put;return i.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u(s.geth5Add,r);case 2:if(!((a=e.sent)&&a.code>=1)){e.next=7;break}return o.default.success("\u64cd\u4f5c\u6210\u529f"),e.next=7,c({type:"judgme",payload:{judgmentes:!0}});case 7:case"end":return e.stop()}},e,this)}),judgmentesd:i.default.mark(function e(t,n){var a=t.payload,r=(n.call,n.put);return i.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r({type:"judgme",payload:a});case 2:case"end":return e.stop()}},e,this)}),detailsadd:i.default.mark(function e(t,n){var a=t.payload,r=(n.call,n.put);return i.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r({type:"detailsadder",payload:a});case 2:case"end":return e.stop()}},e,this)})},reducers:{numbering:function(e,t){return(0,u.default)({},e,{numbering:t.payload.numbering})},detail:function(e,t){return(0,u.default)({},e,{details:t.payload.data})},detailsadder:function(e,t){return(0,u.default)({},e,{details:[]})},oktxt:function(e,t){return(0,u.default)({},e,{ok:t.payload.ok})},accurates:function(e,t){return(0,u.default)({},e,{accurate:t.payload})},clearAdd:function(e,t){return(0,u.default)({},e,{accurate:{},numbering:null})},codes:function(e,t){return(0,u.default)({},e,{code:t.payload.code})},visibles:function(e,t){return(0,u.default)({},e,{visible:t.payload.visible})},getsearchAirportesadd:function(e,t){return(0,u.default)({},e,{code:[]})},judgme:function(e,t){return(0,u.default)({},e,{judgment:t.payload.judgmentes})}}},e.exports=t.default},812:function(e,t,n){"use strict";function a(e){if(s)return void e(s);c.default.newInstance({prefixCls:f,transitionName:"move-up",style:{top:i},getContainer:p},function(t){if(s)return void e(s);s=t,e(t)})}function r(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:d,n=arguments[2],r=arguments[3],c={info:"info-circle",success:"check-circle",error:"cross-circle",warning:"exclamation-circle",loading:"loading"}[n];"function"==typeof t&&(r=t,t=d);var i=l++;return a(function(a){a.notice({key:i,duration:t,style:{},content:u.createElement("div",{className:f+"-custom-content "+f+"-"+n},u.createElement(o.default,{type:c}),u.createElement("span",null,e)),onClose:r})}),function(){s&&s.removeNotice(i)}}Object.defineProperty(t,"__esModule",{value:!0});var u=n(4),c=(n.n(u),n(295)),o=n(289),d=3,i=void 0,s=void 0,l=1,f="ant-message",p=void 0;t.default={info:function(e,t,n){return r(e,t,"info",n)},success:function(e,t,n){return r(e,t,"success",n)},error:function(e,t,n){return r(e,t,"error",n)},warn:function(e,t,n){return r(e,t,"warning",n)},warning:function(e,t,n){return r(e,t,"warning",n)},loading:function(e,t,n){return r(e,t,"loading",n)},config:function(e){void 0!==e.top&&(i=e.top,s=null),void 0!==e.duration&&(d=e.duration),void 0!==e.prefixCls&&(f=e.prefixCls),void 0!==e.getContainer&&(p=e.getContainer)},destroy:function(){s&&(s.destroy(),s=null)}}},813:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=n(176),r=(n.n(a),n(849));n.n(r)},849:function(e,t){}});