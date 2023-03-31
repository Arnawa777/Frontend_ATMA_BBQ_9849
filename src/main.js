import Vue from 'vue'
import App from './App.vue'
import vuetify from '@/plugins/vuetify'
import router from './router'
import axios from 'axios'
import VueQrcode from '@chenfengyuan/vue-qrcode';
import VueQrCode from "@chenfengyuan/vue-qrcode"; 

Vue.config.productionTip = false
Vue.component(VueQrCode.name,VueQrcode); 
Vue.prototype.$http = axios;
Vue.prototype.$api = 'http://127.0.0.1:8000/api/';

// php artisan serve --host=192.168.8.100 --port=8000
new Vue({
  vuetify,
  router,
  render: h => h(App),
}).$mount('#app')
