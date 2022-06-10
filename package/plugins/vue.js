!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.Restate=t():(e.Restate=e.Restate||{},e.Restate.vue=t())}(this,(()=>(()=>{"use strict";var e={578:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Restate=void 0;t.Restate=class{constructor(e,t){this.httpClient=e,this.store=t,this.$models=new Map}get(e){return this.$models.get(e)}entries(){return this.$models.entries()}set(e,t){return this.$models.set(e,t),this}has(e){return this.$models.has(e)}delete(e){return this.$models.delete(e)}clear(){return this.$models.clear()}}},383:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.AxiosHTTPClient=void 0;t.AxiosHTTPClient=class{constructor(e){this.axios=e}async get(e){return(await this.axios.get(e)).data}async post(e,t){return(await this.axios.post(e,t)).data}async put(e,t){await this.axios.put(e,t)}async delete(e){await this.axios.delete(e)}}},774:(e,t,s)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.VueStore=void 0;const r=s(734),o=s(816);t.VueStore=class{constructor(){this.resources=new Map,this.store=(0,r.reactive)({})}get(e){return this.resources.get(e)}add(e){const t=new o.VueStoreResource(e,this.store);return this.resources.set(e,t),t}has(e){return this.resources.has(e)}delete(e){return delete this.store[e],this.resources.delete(e)}clear(){Object.keys(this.store).forEach((e=>delete this.store[e])),this.resources.clear()}}},816:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.VueStoreResource=void 0;t.VueStoreResource=class{constructor(e,t){this.resourceName=e,this.store=t,e in t||(t[e]={data:{}}),this.state=t[e]}get(e){const t=this.state.data[e];return t||(this.state.data[e]={}),t}getAll(){return Object.values(this.state.data)}set(e,t){return this.state.data[e]=t,this}setProperty(e,t,s){const r=this.state.data[e];return r&&Reflect.set(r,t,s),this}has(e){return e in this.state.data}delete(e){delete this.state.data[e]}clear(){this.state.data={}}}},607:(e,t,s)=>{Object.defineProperty(t,"__esModule",{value:!0});const r=s(752),o=s(578);r.__exportStar(s(578),t),t.default=o.Restate},560:(e,t,s)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.BaseModel=void 0;const r=s(93);function o(e,t,s){let r=e.replace(/(\/:\w+)/g,(e=>{const s=e.slice(2);if(!t[s])throw new Error;return`/${t[s]}`}));return s&&(r+=`?${new URLSearchParams(s)}`),r}class i extends r.CoreModel{constructor(e,t){super(e,t),this.$resourceName=e,this.$restate=t,this.$pk="id"}index(e){const t=o("/:resourceName",{resourceName:this.$resourceName},e?.query);return this.$httpClient.get(t).then((t=>{!0!==e?.merge&&this.$resource.clear(),t.forEach((e=>this.$resource.set(e[this.$pk],e)))})),this.$resource.getAll()}show(e,t){const s=o("/:resourceName/:id",{resourceName:this.$resourceName,id:e},t?.query);return this.$httpClient.get(s).then((t=>this.$resource.set(e,t))),this.$resource.get(e)}async store(e,t){const s=o("/:resourceName",{resourceName:this.$resourceName},t?.query);return await this.$httpClient.post(s,e).then((e=>this.$resource.set(e[this.$pk],e))),!0}async update(e,t,s){const r=o("/:resourceName/:id",{resourceName:this.$resourceName,id:e},s?.query);return await this.$httpClient.put(r,t),Object.entries(t).forEach((([t,s])=>this.$resource.setProperty(e,t,s))),!0}async destroy(e,t){const s=o("/:resourceName/:id",{resourceName:this.$resourceName,id:e},t?.query);return await this.$httpClient.delete(s),this.$resource.delete(e),!0}}t.BaseModel=i},93:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.CoreModel=void 0;t.CoreModel=class{constructor(e,t){if(this.$resourceName=e,this.$restate=t,t.has(e))throw new Error(`RESTATE ERROR: there is already a Model that the resource name is '${e}'.`);t.set(e,this),this.$httpClient=t.httpClient,t.store.has(e)?this.$resource=t.store.get(e):this.$resource=t.store.add(e)}}},27:(e,t,s)=>{Object.defineProperty(t,"__esModule",{value:!0});s(752).__exportStar(s(666),t)},127:(e,t,s)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.provider=void 0;const r=s(752).__importDefault(s(167)),o=s(383),i=s(774),a=new o.AxiosHTTPClient(r.default),u=new i.VueStore;t.provider={httpClient:a,store:u}},666:(e,t,s)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.useRestate=void 0;const r=s(752).__importDefault(s(607)),o=s(560),i=s(127);t.useRestate=function(e){window.restate||(window.restate=new r.default(i.provider.httpClient,i.provider.store));const{restate:t}=window;let s=t.get(e);return s||(s=new o.BaseModel(e,t),t.set(e,s)),s}},167:e=>{e.exports=require("axios")},752:e=>{e.exports=require("tslib")},734:e=>{e.exports=require("vue")}},t={};var s=function s(r){var o=t[r];if(void 0!==o)return o.exports;var i=t[r]={exports:{}};return e[r](i,i.exports,s),i.exports}(27);return s})()));