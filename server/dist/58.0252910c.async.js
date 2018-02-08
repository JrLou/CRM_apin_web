webpackJsonp([58],{692:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=a(7),u=n(r),c=a(815),o=n(c),s=a(120),d=n(s);a(816);var i=a(292),l=a(183);t.default={namespace:"bannerList",state:{data:{data:[],option:{}},editData:{},loading:!1,banner_url:"",uploadSuccess:!1},effects:{fetch:d.default.mark(function e(t,a){var n,r=t.payload,u=a.call,c=a.put;return d.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,c({type:"changeLoading",payload:!0});case 2:return e.next=4,u(i.queryBanner,r);case 4:if(!((n=e.sent)&&n.code>=1)){e.next=8;break}return e.next=8,c({type:"save",payload:n});case 8:return e.next=10,c({type:"changeLoading",payload:!1});case 10:case"end":return e.stop()}},e,this)}),delete:d.default.mark(function e(t,a){var n,r=t.payload,u=t.callback,c=a.call,o=a.put;return d.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,o({type:"changeLoading",payload:!0});case 2:return e.next=4,c(i.deleteBanner,r);case 4:return n=e.sent,u&&u(n),e.next=8,o({type:"changeLoading",payload:!1});case 8:return e.next=10,o(l.routerRedux.push("/operations/banner"));case 10:case"end":return e.stop()}},e,this)}),changeStatus:d.default.mark(function e(t,a){var n,r=t.payload,u=t.callback,c=a.call,o=a.put;return d.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,o({type:"changeLoading",payload:!0});case 2:return e.next=4,c(i.changeStatus,r);case 4:return n=e.sent,u&&u(n),e.next=8,o({type:"changeLoading",payload:!1});case 8:return e.next=10,o(l.routerRedux.push("/operations/banner"));case 10:case"end":return e.stop()}},e,this)}),toAdd:d.default.mark(function e(t,a){var n=t.payload,r=(a.call,a.put);return d.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r({type:"changeEditData",payload:n});case 2:return e.next=4,r(l.routerRedux.push("/operations/banner/bannerAdd"));case 4:case"end":return e.stop()}},e,this)}),toEdit:d.default.mark(function e(t,a){var n=t.payload,r=(a.call,a.put);return d.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r({type:"changeEditData",payload:n});case 2:return e.next=4,r(l.routerRedux.push("/operations/banner/bannerEdit"));case 4:case"end":return e.stop()}},e,this)}),cancelEdit:d.default.mark(function e(t,a){var n=(t.payload,a.call,a.put);return d.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,n({type:"changeEditData",payload:{}});case 2:return e.next=4,n({type:"changeBaseImg",payload:""});case 4:return e.next=6,n(l.routerRedux.push("/operations/banner"));case 6:case"end":return e.stop()}},e,this)}),checkEdit:d.default.mark(function e(t,a){var n,r=t.payload,u=(t.callback,a.call),c=a.put;return d.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u(i.editBannerImg,r);case 2:if(!((n=e.sent)&&n.code>=1)){e.next=9;break}return e.next=6,c({type:"changeEditData",payload:{}});case 6:return e.next=8,c(l.routerRedux.push("/operations/banner"));case 8:o.default.success("banner\u7f16\u8f91\u6210\u529f");case 9:case"end":return e.stop()}},e,this)}),addBanner:d.default.mark(function e(t,a){var n,r=t.payload,u=(t.callback,a.call),c=a.put;return d.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u(i.addBannerImg,r);case 2:if(!((n=e.sent)&&n.code>=1)){e.next=11;break}return e.next=6,c({type:"changeEditData",payload:{}});case 6:return e.next=8,c({type:"changeBaseImg",payload:""});case 8:return o.default.success("\u6dfb\u52a0\u6210\u529f"),e.next=11,c(l.routerRedux.push("/operations/banner"));case 11:case"end":return e.stop()}},e,this)}),baseImg:d.default.mark(function e(t,a){var n,r=t.payload,u=(t.callback,a.call),c=a.put;return d.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,c({type:"changeFlag",payload:!1});case 2:return e.next=4,c({type:"changeBaseImg",payload:""});case 4:return e.next=6,u(i.baseImg,r);case 6:if(n=e.sent,1!=n.code){e.next=14;break}return e.next=10,c({type:"changeBaseImg",payload:n.data});case 10:return e.next=12,c({type:"changeFlag",payload:!0});case 12:e.next=15;break;case 14:o.default.error(n.msg);case 15:case"end":return e.stop()}},e,this)})},reducers:{save:function(e,t){return(0,u.default)({},e,{data:t.payload})},changeEditData:function(e,t){return(0,u.default)({},e,{editData:t.payload,banner_url:t.payload.banner_url,uploadSuccess:!0})},changeLoading:function(e,t){return(0,u.default)({},e,{loading:t.payload})},changeBaseImg:function(e,t){return(0,u.default)({},e,{banner_url:t.payload})},changeFlag:function(e,t){return(0,u.default)({},e,{uploadSuccess:t.payload})}}},e.exports=t.default},815:function(e,t,a){"use strict";function n(e){if(i)return void e(i);c.default.newInstance({prefixCls:p,transitionName:"move-up",style:{top:d},getContainer:f},function(t){if(i)return void e(i);i=t,e(t)})}function r(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:s,a=arguments[2],r=arguments[3],c={info:"info-circle",success:"check-circle",error:"cross-circle",warning:"exclamation-circle",loading:"loading"}[a];"function"==typeof t&&(r=t,t=s);var d=l++;return n(function(n){n.notice({key:d,duration:t,style:{},content:u.createElement("div",{className:p+"-custom-content "+p+"-"+a},u.createElement(o.default,{type:c}),u.createElement("span",null,e)),onClose:r})}),function(){i&&i.removeNotice(d)}}Object.defineProperty(t,"__esModule",{value:!0});var u=a(4),c=(a.n(u),a(296)),o=a(289),s=3,d=void 0,i=void 0,l=1,p="ant-message",f=void 0;t.default={info:function(e,t,a){return r(e,t,"info",a)},success:function(e,t,a){return r(e,t,"success",a)},error:function(e,t,a){return r(e,t,"error",a)},warn:function(e,t,a){return r(e,t,"warning",a)},warning:function(e,t,a){return r(e,t,"warning",a)},loading:function(e,t,a){return r(e,t,"loading",a)},config:function(e){void 0!==e.top&&(d=e.top,i=null),void 0!==e.duration&&(s=e.duration),void 0!==e.prefixCls&&(p=e.prefixCls),void 0!==e.getContainer&&(f=e.getContainer)},destroy:function(){i&&(i.destroy(),i=null)}}},816:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=a(176),r=(a.n(n),a(857));a.n(r)},857:function(e,t){}});