webpackJsonp([50],{717:function(t,e,a){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var r=a(76),o=n(r),l=a(7),i=n(l),u=a(816),d=n(u),c=a(120),s=n(c);a(817);var f=a(291),p=a(183);e.default={namespace:"push",state:{loading:!1,isLeft:!0,depData:{},arrData:{},flightsTableShow:!1,flightsArr:[],showWhat:"",modalTitle:"",flightNo:""},effects:{fetch:s.default.mark(function t(e,a){var n,r=e.payload,o=a.call,l=a.put;return s.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,l({type:"changeLoading",payload:!0});case 2:return t.next=4,o(f.postGroupData,r);case 4:if(!((n=t.sent)&&n.code>=1)){t.next=11;break}return d.default.success("\u63a8\u9001\u6210\u529f\uff0c\u5c06\u8fdb\u5165\u62fc\u56e2\u67e5\u770b\u9875\u9762"),t.next=9,l({type:"reset",payload:""});case 9:return t.next=11,l(p.routerRedux.push("/fightgroups/demand/checkFightGroups/"+n.data));case 11:return t.next=13,l({type:"changeLoading",payload:!1});case 13:case"end":return t.stop()}},t,this)}),search:s.default.mark(function t(e,a){var n,r=e.payload,o=a.call,l=a.put;return s.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,l({type:"changeLoading",payload:!0});case 2:return t.next=4,o(f.searchFlights,r);case 4:if(!((n=t.sent)&&n.code>=1)){t.next=9;break}return d.default.success("\u64cd\u4f5c\u6210\u529f"),t.next=9,l({type:"getFlights",payload:(0,i.default)({},n,{modalTitle:"\u822a\u73ed\u53f7\u4e3a\uff1a"+r.fnum+"\u7684\u6240\u6709\u822a\u73ed",flightNo:r.fnum})});case 9:return t.next=11,l({type:"changeLoading",payload:!1});case 11:case"end":return t.stop()}},t,this)})},reducers:{reset:function(t,e){return(0,i.default)({},t,{depData:{},arrData:{},flightsTableShow:!1,flightsArr:[],modalTitle:""})},changeLoading:function(t,e){return(0,i.default)({},t,{loading:e.payload})},getFlights:function(t,e){return e.payload.data&&e.payload.data.length>0&&e.payload.data.map(function(t,e){t._id=e}),e.payload.data&&e.payload.data.length>0?(0,i.default)({},t,{flightsArr:e.payload.data,flightsTableShow:!0,showWhat:"selectFlight",modalTitle:e.payload.modalTitle}):(0,i.default)({},t,{flightsArr:[],flightsTableShow:!0,showWhat:"toAddFlight",flightNo:e.payload.flightNo,modalTitle:e.payload.modalTitle})},whichCard:function(t,e){return(0,i.default)({},t,{isLeft:e.payload})},showModal:function(t,e){return(0,i.default)({},t,{flightsTableShow:e.payload})},setCard:function(t,e){var a,n=t.isLeft?"depData":"arrData";return(0,i.default)({},t,(a={},(0,o.default)(a,n,e.payload[0]),(0,o.default)(a,"showWhat","null"),(0,o.default)(a,"modalTitle",""),(0,o.default)(a,"flightsTableShow",!1),a))},resetCard:function(t,e){var a=e.payload?"depData":"arrData";return(0,i.default)({},t,(0,o.default)({},a,{}))},goAddFlight:function(t,e){return(0,i.default)({},t,{flightNo:e.payload,showWhat:"addFlight",modalTitle:"\u624b\u5de5\u5f55\u5165\u822a\u73ed"})}}},t.exports=e.default},816:function(t,e,a){"use strict";function n(t){if(c)return void t(c);l.default.newInstance({prefixCls:f,transitionName:"move-up",style:{top:d},getContainer:p},function(e){if(c)return void t(c);c=e,t(e)})}function r(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:u,a=arguments[2],r=arguments[3],l={info:"info-circle",success:"check-circle",error:"cross-circle",warning:"exclamation-circle",loading:"loading"}[a];"function"==typeof e&&(r=e,e=u);var d=s++;return n(function(n){n.notice({key:d,duration:e,style:{},content:o.createElement("div",{className:f+"-custom-content "+f+"-"+a},o.createElement(i.default,{type:l}),o.createElement("span",null,t)),onClose:r})}),function(){c&&c.removeNotice(d)}}Object.defineProperty(e,"__esModule",{value:!0});var o=a(4),l=(a.n(o),a(296)),i=a(289),u=3,d=void 0,c=void 0,s=1,f="ant-message",p=void 0;e.default={info:function(t,e,a){return r(t,e,"info",a)},success:function(t,e,a){return r(t,e,"success",a)},error:function(t,e,a){return r(t,e,"error",a)},warn:function(t,e,a){return r(t,e,"warning",a)},warning:function(t,e,a){return r(t,e,"warning",a)},loading:function(t,e,a){return r(t,e,"loading",a)},config:function(t){void 0!==t.top&&(d=t.top,c=null),void 0!==t.duration&&(u=t.duration),void 0!==t.prefixCls&&(f=t.prefixCls),void 0!==t.getContainer&&(p=t.getContainer)},destroy:function(){c&&(c.destroy(),c=null)}}},817:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a(176),r=(a.n(n),a(863));a.n(r)},863:function(t,e){}});