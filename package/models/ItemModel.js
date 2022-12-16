!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.Restate=t():(e.Restate=e.Restate||{},e.Restate.itemModel=t())}(this,(()=>(()=>{"use strict";var e={583:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.HTTPModel=void 0;const s=r(149);t.HTTPModel=class{constructor({resourceName:e,axios:t,afterRequest:r}){this.$resourceName=e,this.$axios=t,this.$afterRequest=r}request(e,t,r){return(0,s.load)((async()=>{const{data:r}=await this.$axios.request({url:e,method:t?.method,params:t?.query,data:t?.data});this.$afterRequest&&await this.$afterRequest(r),t?.afterRequest&&await t.afterRequest(r)}),r)}}},502:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.ItemResource=void 0;t.ItemResource=class{constructor({state:e,computedState:t}){this.$state=e,this.$computedState=t}get(){return this.$computedState}set(e){this.$state.value=e}setProperty(e,t){const r=this.$state.value;if(!r)throw new Error("Property not updated.");r[e]=t}has(){return!!this.$state.value}clear(){this.$state.value=void 0}}},731:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.useItemResource=void 0;const s=r(734),o=r(502);t.useItemResource=function(e){const t=(0,s.ref)(void 0),r=function(e,t){return(0,s.computed)((()=>{if(!e.value)return;const r={...e.value};return t.forEach(((e,t)=>{if(t in r)throw new Error(`The ${String(t)} property is already defined.`);r[t]=e(r)})),r}))}(t,new Map(Object.entries(e?.computedProperties||[])));return new o.ItemResource({state:t,computedState:r})}},149:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.load=void 0;const s=r(734);t.load=function(e,t){const r=(0,s.ref)(!0),o={loaded:(async()=>(await e(),r.value=!1,!0))(),loading:r};return t&&(o.data=t),o}},734:e=>{e.exports=require("vue")}},t={};function r(s){var o=t[s];if(void 0!==o)return o.exports;var u=t[s]={exports:{}};return e[s](u,u.exports,r),u.exports}var s={};return(()=>{var e=s;Object.defineProperty(e,"__esModule",{value:!0}),e.ItemModel=void 0;const t=r(731),o=r(583);class u extends o.HTTPModel{constructor({resourceName:e,axios:r,computedProperties:s={},mapAfterRequest:o}){super({resourceName:e,axios:r}),this.$resource=(0,t.useItemResource)({computedProperties:s}),this.$computedProperties=new Map(Object.entries(s)),this.$mapAfterRequest=o}data(){return this.$resource.get()}show(e){const t=this.$resource.get();return this.request(`${this.$resourceName}`,{method:"GET",query:e?.query,afterRequest:e=>{const t=this.$mapAfterRequest?.(e)??e;this.$resource.set(t)}},t)}update(e,t){return this.request(`/${this.$resourceName}`,{method:"PUT",query:t?.query,data:e,afterRequest:()=>{Object.entries(e).forEach((([e,t])=>{this.$resource.setProperty(e,t)}))}})}}e.ItemModel=u})(),s})()));