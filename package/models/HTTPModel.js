!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.Restate=t():(e.Restate=e.Restate||{},e.Restate.httpModel=t())}(this,(()=>(()=>{"use strict";var e={149:(e,t,a)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.load=void 0;const o=a(734);t.load=function(e,t){const a=(0,o.ref)(!0),r={loaded:(async()=>(await e(),a.value=!1,!0))(),loading:a};return t&&(r.data=t),r}},734:e=>{e.exports=require("vue")}},t={};function a(o){var r=t[o];if(void 0!==r)return r.exports;var s=t[o]={exports:{}};return e[o](s,s.exports,a),s.exports}var o={};return(()=>{var e=o;Object.defineProperty(e,"__esModule",{value:!0}),e.HTTPModel=void 0;const t=a(149);e.HTTPModel=class{constructor({resourceName:e,axios:t,afterRequest:a}){this.$resourceName=e,this.$axios=t,this.$afterRequest=a}request(e,a,o){return(0,t.load)((async()=>{const{data:t}=await this.$axios.request({url:e,method:a?.method,params:a?.query,data:a?.data});this.$afterRequest&&await this.$afterRequest(t),a?.afterRequest&&await a.afterRequest(t)}),o)}}})(),o})()));