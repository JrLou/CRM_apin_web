webpackJsonp([49],{713:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=a(76),c=n(r),u=a(812),o=n(u),d=a(7),i=n(d),l=a(120),s=n(l);a(813);var f=a(292),p=a(178),h=n(p),y=a(183);t.default={namespace:"offline",state:{list:{},usernameData:[],supplierData:[],cityData:[],cityData2:[],loading:!1,isDill:!1,changeInfo:[],schemeInfo:[{supplierName:"",unitprice:"",flight:""}],originalPlans:[],orderDetail:{},currentOrder:""},effects:{fetch:s.default.mark(function e(t,a){var n,r=t.payload,c=a.call,u=a.put;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u({type:"changeLoading",payload:!0});case 2:return e.next=4,c(f.offlineList,r);case 4:return n=e.sent,e.next=7,u({type:"queryList",payload:n});case 7:return e.next=9,u({type:"changeLoading",payload:!1});case 9:case"end":return e.stop()}},e,this)}),fetchDetail:s.default.mark(function e(t,a){var n,r=t.payload,c=a.call,u=a.put;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u({type:"changeLoading",payload:!0});case 2:return e.next=4,c(f.orderDetail,r);case 4:if(!(n=e.sent)||200!=n.code){e.next=8;break}return e.next=8,u({type:"getDetail",payload:(0,i.default)({},n,{curId:r.id})});case 8:return e.next=10,u({type:"changeLoading",payload:!1});case 10:case"end":return e.stop()}},e,this)}),delOrder:s.default.mark(function e(t,a){var n,r=t.payload,c=a.call,u=a.put;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u({type:"changeLoading",payload:!0});case 2:return e.next=4,c(f.delOrder,r);case 4:return n=e.sent,200==n.code&&o.default.success("\u64cd\u4f5c\u6210\u529f"),e.next=8,u({type:"changeLoading",payload:!1});case 8:case"end":return e.stop()}},e,this)}),addOrder:s.default.mark(function e(t,a){var n,r=t.payload,c=a.call,u=a.put;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u({type:"changeLoading",payload:!0});case 2:return e.next=4,c(f.addOrder,r);case 4:if(n=e.sent,200!=n.code){e.next=9;break}return o.default.success("\u64cd\u4f5c\u6210\u529f"),e.next=9,u(y.routerRedux.push("/offline/order"));case 9:return e.next=11,u({type:"changeLoading",payload:!1});case 11:case"end":return e.stop()}},e,this)}),updateOrder:s.default.mark(function e(t,a){var n,r=t.payload,c=a.call,u=a.put;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u({type:"changeLoading",payload:!0});case 2:return e.next=4,c(f.updateOrder,r);case 4:if(n=e.sent,200!=n.code){e.next=9;break}return o.default.success("\u4fee\u6539\u6210\u529f"),e.next=9,u(y.routerRedux.push("/offline/order"));case 9:return e.next=11,u({type:"changeLoading",payload:!1});case 11:case"end":return e.stop()}},e,this)}),addOneChange:s.default.mark(function e(t,a){var n,r=t.payload,c=a.call,u=a.put;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u({type:"changeLoading",payload:!0});case 2:return e.next=4,c(f.addChange,r);case 4:if(n=e.sent,200!=n.code){e.next=9;break}return o.default.success("\u64cd\u4f5c\u6210\u529f"),e.next=9,u({type:"getOneChange",payload:r});case 9:return e.next=11,u({type:"changeLoading",payload:!1});case 11:case"end":return e.stop()}},e,this)}),outExcel:s.default.mark(function e(t,a){var n,r=t.payload,c=a.call,u=a.put;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u({type:"changeLoading",payload:!0});case 2:return e.next=4,c(f.outExcel,r);case 4:return n=e.sent,200==n.code&&(o.default.success("\u64cd\u4f5c\u6210\u529f"),window.location.href=n.data.url),e.next=8,u({type:"changeLoading",payload:!1});case 8:case"end":return e.stop()}},e,this)}),searchCustomer:s.default.mark(function e(t,a){var n,r=t.payload,c=a.call,u=a.put;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,c(f.searchCustomer,r);case 2:if(n=e.sent,200!=n.code){e.next=6;break}return e.next=6,u({type:"getCustomers",payload:n.data?n.data:[]});case 6:case"end":return e.stop()}},e,this)}),searchSupplier:s.default.mark(function e(t,a){var n,r=t.payload,c=a.call,u=a.put;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,c(f.searchSupplier,r);case 2:if(!(n=e.sent)||200!=n.code){e.next=6;break}return e.next=6,u({type:"getSupplier",payload:n.data?n.data:[]});case 6:case"end":return e.stop()}},e,this)}),searchCity:s.default.mark(function e(t,a){var n,r,c=t.payload,u=a.call,o=a.put;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u(f.searchCity,{condition:c.condition});case 2:if(!(n=e.sent)||200!=n.code){e.next=8;break}return n.data.length>10&&(n.data=n.data.splice(0,10)),r=n.data.map(function(e,t){return e.cityName}),e.next=8,o({type:"getCity",payload:{data:r,arrFlag:c.arrFlag}});case 8:case"end":return e.stop()}},e,this)}),delOneSchemeWithid:s.default.mark(function e(t,a){var n,r=t.payload,c=a.call,u=a.put;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,c(f.delSchemeWithid,{id:r.id});case 2:if(!(n=e.sent)||200!=n.code){e.next=6;break}return e.next=6,u({type:"delOneScheme",payload:r.index});case 6:case"end":return e.stop()}},e,this)})},reducers:{queryList:function(e,t){return(0,i.default)({},e,{list:t.payload})},getDetail:function(e,t){return(0,i.default)({},e,{orderDetail:t.payload.data,schemeInfo:t.payload.data.plans.length>0?t.payload.data.plans:[{supplierName:"",unitprice:"",flight:""}],changeInfo:t.payload.data.endorse,currentOrder:t.payload.curId,originalPlans:t.payload.data.plans})},changeLoading:function(e,t){return(0,i.default)({},e,{loading:t.payload})},delOneChange:function(e,t){var a=e.changeInfo;return a.splice(t.payload,1),(0,i.default)({},e,{changeInfo:a})},getOneChange:function(e,t){t.payload.handle_date=(0,h.default)(t.payload.handle_date,"YYYY-MM-DD"),e.changeInfo.push(t.payload);var a=e.changeInfo;return(0,i.default)({},e,{changeInfo:a})},changeChangeInfo:function(e,t){return(0,i.default)({},e,{changeInfo:t.payload})},addOneScheme:function(e,t){e.schemeInfo.push({supplierName:"",unitprice:"",flight:"",orderId:t.payload});var a=e.schemeInfo;return(0,i.default)({},e,{schemeInfo:a})},changeSchemeInfo:function(e,t){return(0,i.default)({},e,{schemeInfo:t.payload})},delOneScheme:function(e,t){var a=e.schemeInfo;return a.splice(t.payload,1),(0,i.default)({},e,{schemeInfo:a})},getCustomers:function(e,t){return(0,i.default)({},e,{usernameData:t.payload})},getCity:function(e,t){var a=t.payload.arrFlag?"cityData2":"cityData";return(0,i.default)({},e,(0,c.default)({},a,t.payload.data))},getSupplier:function(e,t){return(0,i.default)({},e,{supplierData:t.payload})},resetPlansAndEndorse:function(e,t){return(0,i.default)({},e,{schemeInfo:[{supplierName:"",unitprice:"",flight:""}],changeInfo:[]})},changeSelected:function(e,t){var a=e.schemeInfo.map(function(e,a){return t.payload==a?e.selected=1:e.selected=0,e});return(0,i.default)({},e,{schemeInfo:a})}}},e.exports=t.default},812:function(e,t,a){"use strict";function n(e){if(l)return void e(l);u.default.newInstance({prefixCls:f,transitionName:"move-up",style:{top:i},getContainer:p},function(t){if(l)return void e(l);l=t,e(t)})}function r(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:d,a=arguments[2],r=arguments[3],u={info:"info-circle",success:"check-circle",error:"cross-circle",warning:"exclamation-circle",loading:"loading"}[a];"function"==typeof t&&(r=t,t=d);var i=s++;return n(function(n){n.notice({key:i,duration:t,style:{},content:c.createElement("div",{className:f+"-custom-content "+f+"-"+a},c.createElement(o.default,{type:u}),c.createElement("span",null,e)),onClose:r})}),function(){l&&l.removeNotice(i)}}Object.defineProperty(t,"__esModule",{value:!0});var c=a(4),u=(a.n(c),a(295)),o=a(289),d=3,i=void 0,l=void 0,s=1,f="ant-message",p=void 0;t.default={info:function(e,t,a){return r(e,t,"info",a)},success:function(e,t,a){return r(e,t,"success",a)},error:function(e,t,a){return r(e,t,"error",a)},warn:function(e,t,a){return r(e,t,"warning",a)},warning:function(e,t,a){return r(e,t,"warning",a)},loading:function(e,t,a){return r(e,t,"loading",a)},config:function(e){void 0!==e.top&&(i=e.top,l=null),void 0!==e.duration&&(d=e.duration),void 0!==e.prefixCls&&(f=e.prefixCls),void 0!==e.getContainer&&(p=e.getContainer)},destroy:function(){l&&(l.destroy(),l=null)}}},813:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=a(176),r=(a.n(n),a(849));a.n(r)},849:function(e,t){}});