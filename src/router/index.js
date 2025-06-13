import { createRouter, createWebHistory } from 'vue-router'

// 导入页面组件
import Home from '../views/Home.vue'
import ApiDemo from '../views/ApiDemo.vue'
import About from '../views/About.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: '首页' }
  },
  {
    path: '/api-demo',
    name: 'ApiDemo',
    component: ApiDemo,
    meta: { title: 'API演示' }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: { title: '关于我们' }
  },
  // 404 页面重定向
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // 路由切换时滚动到顶部
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫 - 设置页面标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - Agent Front`
  }
  next()
})

export default router
