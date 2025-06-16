import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '../stores/user.js';

// 导入页面组件
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: '首页' },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: '用户登录' },
  },
  // 404 页面重定向
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  // 路由切换时滚动到顶部
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

// 路由守卫 - 设置页面标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - Agent Front`;
  }
  
  // 检查路由是否需要登录
  if (to.meta.requiresAuth) {
    const userStore = useUserStore();
    if (!userStore.isLoggedIn) {
      // 未登录，重定向到登录页面
      next('/login');
      return;
    }
  }
  
  next();
});

export default router;
