!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.Restate=t():(e.Restate=e.Restate||{},e.Restate.vueStore=t())}(this,(()=>(()=>{"use strict";var e={774:(e,t,s)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.VueStore=void 0;const r=s(734),o=s(816);t.VueStore=class{constructor(){this.resources=new Map,this.store=(0,r.reactive)({})}get(e){return this.resources.get(e)}add(e){const t=new o.VueStoreResource(e,this.store);return this.resources.set(e,t),t}has(e){return this.resources.has(e)}delete(e){return delete this.store[e],this.resources.delete(e)}clear(){Object.keys(this.store).forEach((e=>delete this.store[e])),this.resources.clear()}}},816:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.VueStoreResource=void 0;t.VueStoreResource=class{constructor(e,t){this.resourceName=e,this.store=t,e in t||(t[e]={data:{}}),this.state=t[e]}get(e){const t=this.state.data[e];return t||(this.state.data[e]={}),t}getAll(){return Object.values(this.state.data)}set(e,t){return this.state.data[e]=t,this}setProperty(e,t,s){const r=this.state.data[e];return r&&Reflect.set(r,t,s),this}has(e){return e in this.state.data}delete(e){delete this.state.data[e]}clear(){this.state.data={}}}},303:(e,t,s)=>{Object.defineProperty(t,"__esModule",{value:!0});s(752).__exportStar(s(774),t)},752:e=>{e.exports=require("tslib")},734:e=>{e.exports=require("vue")}},t={};var s=function s(r){var o=t[r];if(void 0!==o)return o.exports;var a=t[r]={exports:{}};return e[r](a,a.exports,s),a.exports}(303);return s})()));