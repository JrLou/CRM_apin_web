webpackJsonp([51],{694:function(e,n,t){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(n,"__esModule",{value:!0});var r=t(11),o=a(r),u=t(801),c=a(u),i=t(119),s=a(i);t(802);var d=t(288),l=t(182);n.default={namespace:"choose",state:{loading:!0,tableData:{},logData:[]},effects:{fetch:s.default.mark(function e(n,t){var a,r=n.payload,o=t.call,u=t.put;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u({type:"changeLoading",payload:!0});case 2:return e.next=4,o(d.orderList,r);case 4:return a=e.sent,e.next=7,u({type:"getTable",payload:a});case 7:return e.next=9,u({type:"changeLoading",payload:!1});case 9:case"end":return e.stop()}},e,this)}),getLogs:s.default.mark(function e(n,t){var a,r=n.payload,o=t.call,u=t.put;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u({type:"changeLoading",payload:!0});case 2:return e.next=4,o(d.logList,r);case 4:return a=e.sent,e.next=7,u({type:"showLog",payload:a});case 7:return e.next=9,u({type:"changeLoading",payload:!1});case 9:case"end":return e.stop()}},e,this)}),continueAdd:s.default.mark(function e(n,t){var a,r=n.payload,o=t.call,u=t.put;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u({type:"changeLoading",payload:!0});case 2:return e.next=4,o(d.continueAdd,r);case 4:if(a=e.sent,1!=a.code){e.next=10;break}return e.next=8,u(l.routerRedux.push("/fightgroups/demand/checkFightGroups/"+r.groupId));case 8:e.next=11;break;case 10:c.default.error(a.msg);case 11:return e.next=13,u({type:"changeLoading",payload:!1});case 13:case"end":return e.stop()}},e,this)})},reducers:{getTable:function(e,n){var t=n.payload;return(0,o.default)({},e,{tableData:t})},changeLoading:function(e,n){var t=n.payload;return(0,o.default)({},e,{loading:t})},showLog:function(e,n){var t=n.payload;return(0,o.default)({},e,{logData:t})}}},e.exports=n.default},801:function(e,n,t){"use strict";function a(e){if(d)return void e(d);u.default.newInstance({prefixCls:f,transitionName:"move-up",style:{top:s},getContainer:p},function(n){if(d)return void e(d);d=n,e(n)})}function r(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:i,t=arguments[2],r=arguments[3],u={info:"info-circle",success:"check-circle",error:"cross-circle",warning:"exclamation-circle",loading:"loading"}[t];"function"==typeof n&&(r=n,n=i);var s=l++;return a(function(a){a.notice({key:s,duration:n,style:{},content:o.createElement("div",{className:f+"-custom-content "+f+"-"+t},o.createElement(c.default,{type:u}),o.createElement("span",null,e)),onClose:r})}),function(){d&&d.removeNotice(s)}}Object.defineProperty(n,"__esModule",{value:!0});var o=t(4),u=(t.n(o),t(292)),c=t(286),i=3,s=void 0,d=void 0,l=1,f="ant-message",p=void 0;n.default={info:function(e,n,t){return r(e,n,"info",t)},success:function(e,n,t){return r(e,n,"success",t)},error:function(e,n,t){return r(e,n,"error",t)},warn:function(e,n,t){return r(e,n,"warning",t)},warning:function(e,n,t){return r(e,n,"warning",t)},loading:function(e,n,t){return r(e,n,"loading",t)},config:function(e){void 0!==e.top&&(s=e.top,d=null),void 0!==e.duration&&(i=e.duration),void 0!==e.prefixCls&&(f=e.prefixCls),void 0!==e.getContainer&&(p=e.getContainer)},destroy:function(){d&&(d.destroy(),d=null)}}},802:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var a=t(175),r=(t.n(a),t(835));t.n(r)},835:function(e,n){}});