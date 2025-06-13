import { createApp } from 'vue';
import App from './App.vue';
import './styles/global.css';
import { api, userApi, request } from './apis/index.js';

const app = createApp(App);

// 将API方法挂载到全局属性上，方便在组件中使用
app.config.globalProperties.$api = api;
app.config.globalProperties.$userApi = userApi;
app.config.globalProperties.$request = request;

app.mount('#app');
