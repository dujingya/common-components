import Vue from 'vue';
import App from './App';
Vue.config.productionTip = false;
App.mpType = 'app';

const app = new Vue(App);
// （注意：不能在const app = new Vue(App) 之前添加）,全局变量
Vue.prototype.globalData = { }
app.$mount();



