import Vuesax from 'vuesax'
import VueWindowSize from 'vue-window-size';
// require('vuesax/dist/vuesax.css') //Vuesax styles
require('../scss/app.scss');
window.Vue = require('vue');
Vue.config.devtools = true /* Uncomment if vue extension devtools isn't working */

Vue.use(VueWindowSize);
Vue.use(Vuesax, {
  theme:{
    colors:{
      primary:'#FAF8F2',
    }
  }
})

require('./components');
//instantiate page vue
var app = new Vue({
  el: 'main',
  data: {

  },
  watch: {

    // "room.participants": {
    //   deep: true,
    //   immediate: true,
    //   handler: 'setParticipantList'
    // },
  },
  methods: {

  },
  mounted() {
  }
});

 if ('serviceWorker' in navigator) {
   window.addEventListener('load', () => {
     navigator.serviceWorker.register('/service-worker.js').then(registration => {
       console.log('SW registered: ', registration);
     }).catch(registrationError => {
       console.log('SW registration failed: ', registrationError);
     });
   });
 }
