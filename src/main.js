import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import "/css/tailwind.css";
import axios from "./plugins/axios";

Vue.prototype.$http = axios;

Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
}).$mount("#app");
