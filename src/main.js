import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './styles/global.css';
import { api, userApi, request } from './apis/index.js';
import { initializeStores } from './stores/index.js';

const app = createApp(App);
const pinia = createPinia();

// 使用Pinia
app.use(pinia);
// 使用路由
app.use(router);

// 将API方法挂载到全局属性上，方便在组件中使用
app.config.globalProperties.$api = api;
app.config.globalProperties.$userApi = userApi;
app.config.globalProperties.$request = request;

// 初始化所有stores
initializeStores();

app.mount('#app');
