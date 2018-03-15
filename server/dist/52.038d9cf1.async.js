webpackJsonp([52],{713:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=a(76),o=n(r),c=a(816),u=n(c),i=a(7),d=n(i),l=a(120),s=n(l);a(817);var p=a(291),f=a(178),y=n(f),h=a(183);t.default={namespace:"offline",state:{list:{},usernameData:[],nameWithMoreInfo:[],supplierData:[],cityData:[],cityData2:[],loading:!1,isDill:!1,changeInfo:[],schemeInfo:[{supplierName:"",adultUnitprice:"",childUnitprice:"",babyUnitprice:"",flight:""}],originalPlans:[],orderDetail:{},currentOrder:"",totalCustomer:[],totalSupplier:[]},effects:{fetch:s.default.mark(function e(t,a){var n,r=t.payload,o=a.call,c=a.put;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,c({type:"changeLoading",payload:!0});case 2:return e.next=4,o(p.offlineList,r);case 4:return n=e.sent,e.next=7,c({type:"queryList",payload:n});case 7:return e.next=9,c({type:"changeLoading",payload:!1});case 9:case"end":return e.stop()}},e,this)}),fetchDetail:s.default.mark(function e(t,a){var n,r=t.payload,o=t.succCb,c=void 0===o?function(){}:o,u=a.call,i=a.put;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,i({type:"changeLoading",payload:!0});case 2:return e.next=4,u(p.orderDetail,r);case 4:if(!(n=e.sent)||200!=n.code){e.next=9;break}return e.next=8,i({type:"getDetail",payload:(0,d.default)({},n,{curId:r.id})});case 8:c();case 9:return e.next=11,i({type:"changeLoading",payload:!1});case 11:case"end":return e.stop()}},e,this)}),delOrder:s.default.mark(function e(t,a){var n,r,o=t.payload,c=a.call,i=a.put;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,i({type:"changeLoading",payload:!0});case 2:return e.next=4,c(p.delOrder,{id:o.id});case 4:if(n=e.sent,200!=n.code){e.next=11;break}return u.default.success("\u64cd\u4f5c\u6210\u529f"),r=o.listParams,1===o.currentCount&&1!==r.pageNum&&(r.pageNum=r.pageNum-1),e.next=11,i({type:"fetch",payload:r});case 11:return e.next=13,i({type:"changeLoading",payload:!1});case 13:case"end":return e.stop()}},e,this)}),addOrder:s.default.mark(function e(t,a){var n,r=t.payload,o=a.call,c=a.put;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,c({type:"changeLoading",payload:!0});case 2:return e.next=4,o(p.addOrder,r);case 4:if(n=e.sent,200!=n.code){e.next=9;break}return u.default.success("\u64cd\u4f5c\u6210\u529f"),e.next=9,c(h.routerRedux.push("/offline/order"));case 9:return e.next=11,c({type:"changeLoading",payload:!1});case 11:case"end":return e.stop()}},e,this)}),updateOrder:s.default.mark(function e(t,a){var n,r=t.payload,o=a.call,c=a.put;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,c({type:"changeLoading",payload:!0});case 2:return e.next=4,o(p.updateOrder,r);case 4:if(n=e.sent,200!=n.code){e.next=9;break}return u.default.success("\u4fee\u6539\u6210\u529f"),e.next=9,c(h.routerRedux.push("/offline/order"));case 9:return e.next=11,c({type:"changeLoading",payload:!1});case 11:case"end":return e.stop()}},e,this)}),addOneChange:s.default.mark(function e(t,a){var n,r=t.payload,o=a.call,c=a.put;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,c({type:"changeLoading",payload:!0});case 2:return e.next=4,o(p.addChange,r);case 4:if(n=e.sent,200!=n.code){e.next=11;break}return u.default.success("\u64cd\u4f5c\u6210\u529f"),e.next=9,c({type:"getOneChange",payload:r});case 9:return e.next=11,c({type:"isShowModal",payload:!1});case 11:return e.next=13,c({type:"changeLoading",payload:!1});case 13:case"end":return e.stop()}},e,this)}),outExcel:s.default.mark(function e(t,a){var n,r=t.payload,o=a.call,c=a.put;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,c({type:"changeLoading",payload:!0});case 2:return e.next=4,o(p.outExcel,r);case 4:return n=e.sent,200==n.code&&(u.default.success("\u64cd\u4f5c\u6210\u529f"),window.location.href=n.data.url),e.next=8,c({type:"changeLoading",payload:!1});case 8:case"end":return e.stop()}},e,this)}),searchCustomer:s.default.mark(function e(t,a){var n,r,o,c=t.payload,u=t.succCb,i=a.call,d=a.put;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,i(p.searchCustomer,c);case 2:if(n=e.sent,200!=n.code){e.next=9;break}return r=n.data.map(function(e,t){return e.name}),o=n.data.map(function(e){return{name:e.name,type:e.type,contacts:e.contacts}}),e.next=8,d({type:"getCustomers",payload:{nameArr:r,totalCustomer:n.data,nameWithMoreInfo:o}});case 8:u&&u();case 9:case"end":return e.stop()}},e,this)}),searchSupplier:s.default.mark(function e(t,a){var n,r,o=t.payload,c=a.call,u=a.put;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,c(p.searchSupplier,o);case 2:if(n=e.sent,r=n.data.map(function(e,t){return e.name}),!n||200!=n.code){e.next=7;break}return e.next=7,u({type:"getSupplier",payload:{nameArr:r,totalSupplier:n.data}});case 7:case"end":return e.stop()}},e,this)}),searchCity:s.default.mark(function e(t,a){var n,r,o=t.payload,c=a.call,u=a.put;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(""!==o.condition.trim()){e.next=4;break}return e.next=3,u({type:"getCity",payload:{data:[],arrFlag:o.arrFlag}});case 3:return e.abrupt("return");case 4:return e.next=6,c(p.searchCity,{condition:o.condition});case 6:if(!(n=e.sent)||200!=n.code){e.next=12;break}return n.data.length>10&&(n.data=n.data.splice(0,10)),r=n.data.map(function(e,t){return e.cityName}),e.next=12,u({type:"getCity",payload:{data:r,arrFlag:o.arrFlag}});case 12:case"end":return e.stop()}},e,this)}),delOneSchemeWithid:s.default.mark(function e(t,a){var n,r=t.payload,o=a.call,c=a.put;return s.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,o(p.delSchemeWithid,{id:r.id});case 2:if(!(n=e.sent)||200!=n.code){e.next=6;break}return e.next=6,c({type:"delOneScheme",payload:r.index});case 6:case"end":return e.stop()}},e,this)})},reducers:{queryList:function(e,t){return(0,d.default)({},e,{list:t.payload})},getDetail:function(e,t){var a=t.payload.data.endorse.map(function(e,t){return e.handleDate=(0,y.default)(e.handleDate),e});return(0,d.default)({},e,{orderDetail:t.payload.data,schemeInfo:t.payload.data.plans.length>0?t.payload.data.plans:[{supplierName:"",adultUnitprice:"",childUnitprice:"",babyUnitprice:"",flight:""}],changeInfo:a,currentOrder:t.payload.curId,originalPlans:t.payload.data.plans})},changeLoading:function(e,t){return(0,d.default)({},e,{loading:t.payload})},delOneChange:function(e,t){var a=e.changeInfo;return a.splice(t.payload,1),(0,d.default)({},e,{changeInfo:a})},getOneChange:function(e,t){t.payload.handleDate=(0,y.default)(t.payload.handleDate,"YYYY-MM-DD"),e.changeInfo.push(t.payload);var a=e.changeInfo;return(0,d.default)({},e,{changeInfo:a})},changeChangeInfo:function(e,t){return(0,d.default)({},e,{changeInfo:t.payload})},addOneScheme:function(e,t){e.schemeInfo.push({supplierName:"",adultUnitprice:"",childUnitprice:"",babyUnitprice:"",flight:"",orderId:t.payload});var a=e.schemeInfo;return(0,d.default)({},e,{schemeInfo:a})},changeSchemeInfo:function(e,t){return(0,d.default)({},e,{schemeInfo:t.payload})},delOneScheme:function(e,t){var a=e.schemeInfo;return a.splice(t.payload,1),(0,d.default)({},e,{schemeInfo:a})},getCustomers:function(e,t){return(0,d.default)({},e,{usernameData:t.payload.nameArr,nameWithMoreInfo:t.payload.nameWithMoreInfo,totalCustomer:t.payload.totalCustomer})},getCity:function(e,t){var a=t.payload.arrFlag?"cityData2":"cityData";return(0,d.default)({},e,(0,o.default)({},a,t.payload.data))},getSupplier:function(e,t){return(0,d.default)({},e,{supplierData:t.payload.nameArr,totalSupplier:t.payload.totalSupplier})},resetPlansAndEndorse:function(e,t){return(0,d.default)({},e,{schemeInfo:[{supplierName:"",adultUnitprice:"",childUnitprice:"",babyUnitprice:"",flight:""}],changeInfo:[]})},isShowModal:function(e,t){return(0,d.default)({},e,{isShowModal:t.payload})},changeSelected:function(e,t){var a=e.schemeInfo.map(function(e,a){return t.payload==a?e.selected=1:e.selected=0,e});return(0,d.default)({},e,{schemeInfo:a})},resetOrderDetail:function(e){return(0,d.default)({},e,{orderDetail:{}})}}},e.exports=t.default},816:function(e,t,a){"use strict";function n(e){if(l)return void e(l);c.default.newInstance({prefixCls:p,transitionName:"move-up",style:{top:d},getContainer:f},function(t){if(l)return void e(l);l=t,e(t)})}function r(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:i,a=arguments[2],r=arguments[3],c={info:"info-circle",success:"check-circle",error:"cross-circle",warning:"exclamation-circle",loading:"loading"}[a];"function"==typeof t&&(r=t,t=i);var d=s++;return n(function(n){n.notice({key:d,duration:t,style:{},content:o.createElement("div",{className:p+"-custom-content "+p+"-"+a},o.createElement(u.default,{type:c}),o.createElement("span",null,e)),onClose:r})}),function(){l&&l.removeNotice(d)}}Object.defineProperty(t,"__esModule",{value:!0});var o=a(4),c=(a.n(o),a(296)),u=a(289),i=3,d=void 0,l=void 0,s=1,p="ant-message",f=void 0;t.default={info:function(e,t,a){return r(e,t,"info",a)},success:function(e,t,a){return r(e,t,"success",a)},error:function(e,t,a){return r(e,t,"error",a)},warn:function(e,t,a){return r(e,t,"warning",a)},warning:function(e,t,a){return r(e,t,"warning",a)},loading:function(e,t,a){return r(e,t,"loading",a)},config:function(e){void 0!==e.top&&(d=e.top,l=null),void 0!==e.duration&&(i=e.duration),void 0!==e.prefixCls&&(p=e.prefixCls),void 0!==e.getContainer&&(f=e.getContainer)},destroy:function(){l&&(l.destroy(),l=null)}}},817:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=a(176),r=(a.n(n),a(863));a.n(r)},863:function(e,t){}});