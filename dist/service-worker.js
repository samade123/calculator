if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let r=Promise.resolve();return c[e]||(r=new Promise(async r=>{if("document"in self){const c=document.createElement("script");c.src=e,document.head.appendChild(c),c.onload=r}else importScripts(e),r()})),r.then(()=>{if(!c[e])throw new Error(`Module ${e} didn’t register its module`);return c[e]})},r=(r,c)=>{Promise.all(r.map(e)).then(e=>c(1===e.length?e[0]:e))},c={require:Promise.resolve(r)};self.define=(r,i,n)=>{c[r]||(c[r]=Promise.resolve().then(()=>{let c={};const a={uri:location.origin+r.slice(1)};return Promise.all(i.map(r=>{switch(r){case"exports":return c;case"module":return a;default:return e(r)}})).then(e=>{const r=n(...e);return c.default||(c.default=r),c})}))}}define("./service-worker.js",["./workbox-468c4d03"],(function(e){"use strict";e.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"icon_128x128.a874881a1c14621349cfd918e8421e2f.png",revision:"a874881a1c14621349cfd918e8421e2f"},{url:"icon_192x192.40c16a2adc7d2e9062a7fec6fa0821da.png",revision:"40c16a2adc7d2e9062a7fec6fa0821da"},{url:"icon_256x256.4570bd3b7215ce8c8882f8bb2619e257.png",revision:"4570bd3b7215ce8c8882f8bb2619e257"},{url:"icon_384x384.c9d979877464840a6215aa5023be1f34.png",revision:"c9d979877464840a6215aa5023be1f34"},{url:"icon_512x512.f05a5a741d641d2a456f05712d233f94.png",revision:"f05a5a741d641d2a456f05712d233f94"},{url:"icon_96x96.416381c283c3630f13bd31bb0bce4db5.png",revision:"416381c283c3630f13bd31bb0bce4db5"},{url:"index.html",revision:"0ea9d40e6c11b266c5d4e556de81964c"},{url:"main-65c1210fdb8c91dd11ee.js",revision:"e5ff0ea7713db5582736e8c7cbb5da1a"},{url:"main-80783ba2b2644e76e405.css",revision:"84ce8df52988f8889273befab83d38ff"},{url:"manifest.c70024803416be6089b888b316a770f7.json",revision:"c70024803416be6089b888b316a770f7"},{url:"site/images/calculator-line.png",revision:"0690c4236f5d0746862fdbd3a26c81fa"},{url:"site/images/playstore.png",revision:"ab732ab38b63f03cc527e1c3c7ff8651"},{url:"site/images/playstore.webp",revision:"a5b52fc35214397c742d0e84a9312c13"}],{})}));
