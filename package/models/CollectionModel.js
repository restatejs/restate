!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.Restate=t():(e.Restate=e.Restate||{},e.Restate.collectionModel=t())}(this,(()=>(()=>{"use strict";var e={589:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Resource=void 0;const s=r(734);t.Resource=class{constructor(){this.state=(0,s.reactive)({data:{}})}get(e){return void 0===this.state.data[e]&&this.set(e,{}),(0,s.toRef)(this.state.data,e)}getAll(){return(0,s.computed)((()=>Object.values(this.state.data)))}set(e,t){return this.state.data[e]=(0,s.ref)(t),this}setProperty(e,t,r){const s=this.state.data[e];return s&&Reflect.set(s,t,r),this}has(e){return e in this.state.data}delete(e){delete this.state.data[e]}clear(){this.state.data={}}}},607:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0});r(752).__exportStar(r(589),t)},93:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.CoreModel=void 0;const s=r(607);t.CoreModel=class{constructor(e){this.$resourceName=e,this.$resource=new s.Resource}}},704:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.createURL=void 0,t.createURL=function(e,t,r){let s=e.replace(/(\/:\w+)/g,(e=>{const r=e.slice(2);if(!t[r])throw new Error;return`/${t[r]}`}));return r&&(s+=`?${new URLSearchParams(r)}`),s}},149:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.load=void 0;const s=r(734);t.load=function(e){const t=(0,s.ref)(!0);return{loaded:(async()=>(await e(),t.value=!1,!0))(),loading:t}}},752:e=>{e.exports=require("tslib")},734:e=>{e.exports=require("vue")}},t={};function r(s){var o=t[s];if(void 0!==o)return o.exports;var a=t[s]={exports:{}};return e[s](a,a.exports,r),a.exports}var s={};return(()=>{var e=s;Object.defineProperty(e,"__esModule",{value:!0}),e.CollectionModel=void 0;const t=r(734),o=r(704),a=r(149),i=r(93);class u extends i.CoreModel{constructor(e,t,r){super(e),this.$resourceName=e,this.$axios=t,this.options=r,this.$pk="id",this.$mapAfterRequest=void 0,this.options?.mapAfterRequest&&(this.$mapAfterRequest=this.options.mapAfterRequest)}data(){return this.$resource.getAll()}item(e){return this.$resource.get(e)}index(e){const t=(0,o.createURL)("/:resourceName",{resourceName:this.$resourceName},e?.query),{loaded:r,loading:s}=(0,a.load)((async()=>{const{data:r}=await this.$axios.get(t);!0!==e?.merge&&this.$resource.clear(),r.forEach((t=>{const r=e?.mapAfterRequest?.(t)??this.$mapAfterRequest?.(t)??t;this.$resource.set(t[this.$pk],r)}))}));return{data:this.$resource.getAll(),loaded:r,loading:s}}show(e,t){const r=(0,o.createURL)("/:resourceName/:id",{resourceName:this.$resourceName,id:e},t?.query),{loaded:s,loading:i}=(0,a.load)((async()=>{const{data:s}=await this.$axios.get(r),o=t?.mapAfterRequest?.(s)??this.$mapAfterRequest?.(s)??s;this.$resource.set(e,o)}));return{data:this.$resource.get(e),loaded:s,loading:i}}store(e,r){const s=(0,o.createURL)("/:resourceName",{resourceName:this.$resourceName},r?.query),i=(0,t.ref)(null),u=(0,t.computed)((()=>null===i.value?null:this.$resource.get(i.value).value)),{loaded:c,loading:d}=(0,a.load)((async()=>{const{data:t}=await this.$axios.post(s,e);this.$resource.set(t[this.$pk],t),i.value=t[this.$pk]}));return{data:u,loaded:c,loading:d}}update(e,t,r){const s=(0,o.createURL)("/:resourceName/:id",{resourceName:this.$resourceName,id:e},r?.query);return(0,a.load)((async()=>{await this.$axios.put(s,t),Object.entries(t).forEach((([t,r])=>this.$resource.setProperty(e,t,r)))}))}destroy(e,t){const r=(0,o.createURL)("/:resourceName/:id",{resourceName:this.$resourceName,id:e},t?.query);return(0,a.load)((async()=>{await this.$axios.delete(r),this.$resource.delete(e)}))}}e.CollectionModel=u})(),s})()));