webpackJsonp([51],{708:function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(7),u=a(r),i=n(812),c=a(i),o=n(120),d=a(o);n(813);var s=n(292);t.default={namespace:"h5Add",state:{accurate:{},numbering:null,visible:!1,ok:"",judgment:!1,details:[]},effects:{addAirLine:d.default.mark(function e(t,n){var a,r=t.payload,u=n.call,i=n.put;return d.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,i({type:"clearAdd",payload:r});case 2:return e.next=4,u(s.getaddAirLine,r);case 4:if(!((a=e.sent)&&a.code>=1&&a.data)){e.next=14;break}return e.next=8,i({type:"accurates",payload:a});case 8:return e.next=10,i({type:"numbering",payload:r});case 10:return e.next=12,i({type:"oktxt",payload:{ok:"\u9009\u62e9\u822a\u73ed"}});case 12:e.next=16;break;case 14:return e.next=16,i({type:"oktxt",payload:{ok:"\u624b\u5de5\u5f55\u5165"}});case 16:return e.next=18,i({type:"visibles",payload:{visible:!0}});case 18:case"end":return e.stop()}},e,this)}),addtailAirLine:d.default.mark(function e(t,n){var a,r=t.payload,u=n.call,i=n.put;return d.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u(s.getdetailAirLine,r);case 2:if(!((a=e.sent)&&a.code>=1)){e.next=6;break}return e.next=6,i({type:"detail",payload:a});case 6:case"end":return e.stop()}},e,this)}),geteditAirlines:d.default.mark(function e(t,n){var a,r=t.payload,u=n.call,i=n.put;return d.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u(s.geth5Edit,r);case 2:if(!((a=e.sent)&&a.code>=1)){e.next=7;break}return c.default.success("\u64cd\u4f5c\u6210\u529f"),e.next=7,i({type:"judgme",payload:{judgmentes:!0}});case 7:case"end":return e.stop()}},e,this)}),visiblebs:d.default.mark(function e(t,n){var a=t.payload,r=(n.call,n.put);return d.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r({type:"visibles",payload:a});case 2:case"end":return e.stop()}},e,this)}),clearAdds:d.default.mark(function e(t,n){var a=t.payload,r=(n.call,n.put);return d.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r({type:"clearAdd",payload:a});case 2:case"end":return e.stop()}},e,this)}),getaddtit:d.default.mark(function e(t,n){var a,r=t.payload,u=n.call,i=n.put;return d.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u(s.geth5Add,r);case 2:if(!((a=e.sent)&&a.code>=1)){e.next=7;break}return c.default.success("\u64cd\u4f5c\u6210\u529f"),e.next=7,i({type:"judgme",payload:{judgmentes:!0}});case 7:case"end":return e.stop()}},e,this)}),judgmentesd:d.default.mark(function e(t,n){var a=t.payload,r=(n.call,n.put);return d.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r({type:"judgme",payload:a});case 2:case"end":return e.stop()}},e,this)}),detailsadd:d.default.mark(function e(t,n){var a=t.payload,r=(n.call,n.put);return d.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r({type:"detailsadder",payload:a});case 2:case"end":return e.stop()}},e,this)})},reducers:{numbering:function(e,t){return(0,u.default)({},e,{numbering:t.payload.numbering})},detail:function(e,t){return(0,u.default)({},e,{details:t.payload.data})},detailsadder:function(e,t){return(0,u.default)({},e,{details:[]})},oktxt:function(e,t){return(0,u.default)({},e,{ok:t.payload.ok})},accurates:function(e,t){return(0,u.default)({},e,{accurate:t.payload})},clearAdd:function(e,t){return(0,u.default)({},e,{accurate:{},numbering:null})},visibles:function(e,t){return(0,u.default)({},e,{visible:t.payload.visible})},judgme:function(e,t){return(0,u.default)({},e,{judgment:t.payload.judgmentes})}}},e.exports=t.default},812:function(e,t,n){"use strict";function a(e){if(s)return void e(s);i.default.newInstance({prefixCls:f,transitionName:"move-up",style:{top:d},getContainer:p},function(t){if(s)return void e(s);s=t,e(t)})}function r(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:o,n=arguments[2],r=arguments[3],i={info:"info-circle",success:"check-circle",error:"cross-circle",warning:"exclamation-circle",loading:"loading"}[n];"function"==typeof t&&(r=t,t=o);var d=l++;return a(function(a){a.notice({key:d,duration:t,style:{},content:u.createElement("div",{className:f+"-custom-content "+f+"-"+n},u.createElement(c.default,{type:i}),u.createElement("span",null,e)),onClose:r})}),function(){s&&s.removeNotice(d)}}Object.defineProperty(t,"__esModule",{value:!0});var u=n(4),i=(n.n(u),n(295)),c=n(289),o=3,d=void 0,s=void 0,l=1,f="ant-message",p=void 0;t.default={info:function(e,t,n){return r(e,t,"info",n)},success:function(e,t,n){return r(e,t,"success",n)},error:function(e,t,n){return r(e,t,"error",n)},warn:function(e,t,n){return r(e,t,"warning",n)},warning:function(e,t,n){return r(e,t,"warning",n)},loading:function(e,t,n){return r(e,t,"loading",n)},config:function(e){void 0!==e.top&&(d=e.top,s=null),void 0!==e.duration&&(o=e.duration),void 0!==e.prefixCls&&(f=e.prefixCls),void 0!==e.getContainer&&(p=e.getContainer)},destroy:function(){s&&(s.destroy(),s=null)}}},813:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=n(176),r=(n.n(a),n(849));n.n(r)},849:function(e,t){}});