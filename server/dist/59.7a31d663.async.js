webpackJsonp([59],{696:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=a(816),o=n(r),c=a(120),u=n(c),l=a(7),s=n(l);a(817);var d=a(183),i=a(291),f=function(e,t){var a=null;if("c"===e)switch(t){case"list":a=i.offlineCustomerList;break;case"add":a=i.offlineCustomerAdd;break;case"query":a=i.offlineCustomerQuery;break;case"edit":a=i.offlineCustomerEdit;break;case"delete":a=i.offlineCustomerDelete}else switch(t){case"list":a=i.offlineSupporterList;break;case"add":a=i.offlineSupporterAdd;break;case"query":a=i.offlineSupporterQuery;break;case"edit":a=i.offlineSupporterEdit;break;case"delete":a=i.offlineSupporterDelete}return a},p=function(){return{formData:{data:{}}}},y=function(){return{detailTableData:{data:[],option:{}}}},m=function(){return{cacheSearchFormData:{charge:"",contacts:"",mobile:"",name:"",type:"",wxqq:""}}},x=function(){return(0,s.default)({pageType:"c",data:{data:[],message:"",option:0},loading:!0,detailTableData:{data:[],option:{}},recordData:{data:[],loading:!1},modalData:{data:{},message:""},showModal:!1,modalFormLoading:!1,modalConfirmLoading:!1,deleteItemId:""},p(),y(),m())};t.default={namespace:"customerMannagement",state:x(),effects:{fetch:u.default.mark(function e(t,a){var n,r,o=t.payload,c=t.succCB,l=a.call,s=a.put,d=a.select;return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,s({type:"changeLoading",payload:!0});case 2:return e.next=4,d(function(e){return e.customerMannagement.pageType});case 4:return n=e.sent,e.next=7,l(f(n,"list"),o);case 7:if(!(r=e.sent)||200!==r.code){e.next=12;break}return e.next=11,s({type:"saveTableData",payload:r});case 11:c&&c(r.data);case 12:return e.next=14,s({type:"changeLoading",payload:!1});case 14:case"end":return e.stop()}},e,this)}),fetchCustomerList:u.default.mark(function e(t,a){var n,r=t.payload,o=t.succCB,c=a.call,l=a.put;return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,l({type:"changeLoading",payload:!0});case 2:return e.next=4,c(i.offlineCustomerByCustomerList,r);case 4:if(!(n=e.sent)||200!==n.code){e.next=9;break}return e.next=8,l({type:"saveDetailTableData",payload:n});case 8:o&&o(n.data);case 9:return e.next=11,l({type:"changeLoading",payload:!1});case 11:case"end":return e.stop()}},e,this)}),fetchRecordQuery:u.default.mark(function e(t,a){var n,r=t.payload,o=t.succCB,c=a.call,l=a.put;return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,l({type:"saveRecordData",payload:{loading:!0}});case 2:return e.next=4,c(i.offlineCustomerRecordQuery,r);case 4:if(!(n=e.sent)||200!==n.code){e.next=9;break}return e.next=8,l({type:"saveRecordData",payload:n});case 8:o&&o(n.data);case 9:return e.next=11,l({type:"saveRecordData",payload:{loading:!1}});case 11:case"end":return e.stop()}},e,this)}),fetchAdd:u.default.mark(function e(t,a){var n,r,c=t.payload,l=t.succCB,s=a.call,i=a.put,p=a.select;return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,i({type:"extendAll",payload:{modalConfirmLoading:!0}});case 2:return e.next=4,p(function(e){return e.customerMannagement.pageType});case 4:return n=e.sent,e.next=7,s(f(n,"add"),c);case 7:if(!(r=e.sent)||200!==r.code){e.next=16;break}return e.next=11,i({type:"extendAll",payload:{showModal:!1}});case 11:if("c"!==n){e.next=14;break}return e.next=14,i(d.routerRedux.push("/offline_data/customerMannagement"));case 14:o.default.success(r.message),l&&l();case 16:return e.next=18,i({type:"extendAll",payload:{modalConfirmLoading:!1}});case 18:case"end":return e.stop()}},e,this)}),fetchQueryOne:u.default.mark(function e(t,a){var n,r,o=t.payload,c=t.succCB,l=a.call,s=a.put,d=a.select;return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,s({type:"extendAll",payload:{modalFormLoading:!0,loading:!0}});case 2:return e.next=4,d(function(e){return e.customerMannagement.pageType});case 4:return n=e.sent,e.next=7,l(f(n,"query"),o);case 7:if(!(r=e.sent)||200!==r.code){e.next=17;break}if("c"!==n){e.next=14;break}return e.next=12,s({type:"extendAll",payload:{formData:r}});case 12:e.next=16;break;case 14:return e.next=16,s({type:"extendAll",payload:{modalData:r}});case 16:c&&c(r.data);case 17:return e.next=19,s({type:"extendAll",payload:{modalFormLoading:!1,loading:!1}});case 19:case"end":return e.stop()}},e,this)}),fetchEdit:u.default.mark(function e(t,a){var n,r,c=t.payload,l=t.succCB,s=a.call,i=a.put,p=a.select;return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,i({type:"extendAll",payload:{modalConfirmLoading:!0}});case 2:return e.next=4,p(function(e){return e.customerMannagement.pageType});case 4:return n=e.sent,e.next=7,s(f(n,"edit"),c);case 7:if(!(r=e.sent)||200!==r.code){e.next=16;break}return e.next=11,i({type:"extendAll",payload:{showModal:!1}});case 11:if(o.default.success(r.message),"c"!==n){e.next=15;break}return e.next=15,i(d.routerRedux.push("/offline_data/customerMannagement"));case 15:l&&l();case 16:return e.next=18,i({type:"extendAll",payload:{modalConfirmLoading:!1}});case 18:case"end":return e.stop()}},e,this)}),fetchDelete:u.default.mark(function e(t,a){var n,r,c=t.payload,l=t.succCB,s=a.call,d=a.put,i=a.select;return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,d({type:"extendAll",payload:{modalConfirmLoading:!0}});case 2:return e.next=4,i(function(e){return e.customerMannagement.pageType});case 4:return n=e.sent,e.next=7,s(f(n,"delete"),c);case 7:if(!(r=e.sent)||200!==r.code){e.next=13;break}return e.next=11,d({type:"extendAll",payload:{showModal:!1}});case 11:o.default.success(r.message),l&&l();case 13:return e.next=15,d({type:"extendAll",payload:{modalConfirmLoading:!1}});case 15:case"end":return e.stop()}},e,this)}),fetchClearCacheSearchFormData:u.default.mark(function e(t,a){var n=t.succCB,r=void 0===n?function(){}:n,o=a.put;return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,o({type:"extendAll",payload:m()});case 2:return e.next=4,r();case 4:case"end":return e.stop()}},e,this)})},reducers:{saveTableData:function(e,t){return(0,s.default)({},e,{data:(0,s.default)({},e.data,t.payload)})},saveDetailTableData:function(e,t){return(0,s.default)({},e,{detailTableData:(0,s.default)({},e.detailTableData,t.payload)})},saveRecordData:function(e,t){return(0,s.default)({},e,{recordData:(0,s.default)({},e.recordData,t.payload)})},changeLoading:function(e,t){return(0,s.default)({},e,{loading:t.payload})},extendAll:function(e,t){var a=t.payload;return(0,s.default)({},e,a)},saveCacheSearchFormData:function(e,t){var a=t.payload;return(0,s.default)({},e,{cacheSearchFormData:a})},clear:function(){return x()},clearFormData:function(e){return(0,s.default)({},e,p())},clearDetailTableData:function(e){return(0,s.default)({},e,y())}}},e.exports=t.default},816:function(e,t,a){"use strict";function n(e){if(d)return void e(d);c.default.newInstance({prefixCls:f,transitionName:"move-up",style:{top:s},getContainer:p},function(t){if(d)return void e(d);d=t,e(t)})}function r(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:l,a=arguments[2],r=arguments[3],c={info:"info-circle",success:"check-circle",error:"cross-circle",warning:"exclamation-circle",loading:"loading"}[a];"function"==typeof t&&(r=t,t=l);var s=i++;return n(function(n){n.notice({key:s,duration:t,style:{},content:o.createElement("div",{className:f+"-custom-content "+f+"-"+a},o.createElement(u.default,{type:c}),o.createElement("span",null,e)),onClose:r})}),function(){d&&d.removeNotice(s)}}Object.defineProperty(t,"__esModule",{value:!0});var o=a(4),c=(a.n(o),a(296)),u=a(289),l=3,s=void 0,d=void 0,i=1,f="ant-message",p=void 0;t.default={info:function(e,t,a){return r(e,t,"info",a)},success:function(e,t,a){return r(e,t,"success",a)},error:function(e,t,a){return r(e,t,"error",a)},warn:function(e,t,a){return r(e,t,"warning",a)},warning:function(e,t,a){return r(e,t,"warning",a)},loading:function(e,t,a){return r(e,t,"loading",a)},config:function(e){void 0!==e.top&&(s=e.top,d=null),void 0!==e.duration&&(l=e.duration),void 0!==e.prefixCls&&(f=e.prefixCls),void 0!==e.getContainer&&(p=e.getContainer)},destroy:function(){d&&(d.destroy(),d=null)}}},817:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=a(176),r=(a.n(n),a(863));a.n(r)},863:function(e,t){}});