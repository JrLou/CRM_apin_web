webpackJsonp([69],{712:function(e,t,a){"use strict";function s(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=a(7),n=s(r),u=a(120),c=s(u),f=a(291);t.default={namespace:"monitor",state:{tags:[]},effects:{fetchTags:c.default.mark(function e(t,a){var s,r=a.call,n=a.put;return c.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r(f.queryTags);case 2:return s=e.sent,e.next=5,n({type:"saveTags",payload:s.list});case 5:case"end":return e.stop()}},e,this)})},reducers:{saveTags:function(e,t){return(0,n.default)({},e,{tags:t.payload})}}},e.exports=t.default}});