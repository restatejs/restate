!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.Restate=t():(e.Restate=e.Restate||{},e.Restate.coreModel=t())}(this,(function(){return(()=>{"use strict";var e={};return(()=>{var t=e;Object.defineProperty(t,"__esModule",{value:!0}),t.CoreModel=void 0;t.CoreModel=class{constructor(e,t){if(this.$resourceName=e,this.$restate=t,t.has(e))throw new Error(`RESTATE ERROR: there is already a Model that the resource name is '${e}'`);t.set(e,this),this.$httpClient=t.httpClient,this.$restate.store.has(e)?this.$resource=this.$restate.store.get(e):this.$resource=this.$restate.store.add(e)}}})(),e})()}));
//# sourceMappingURL=CoreModel.js.map