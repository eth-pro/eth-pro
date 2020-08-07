import Vue from 'vue'
import Router from 'vue-router'

const Home = r => require.ensure([], () => r(require('@/pages/Home.vue')), 'Home')
const About = r => require.ensure([], () => r(require('@/pages/About.vue')), 'About')
const EPRO = r => require.ensure([], () => r(require('@/pages/EPRO.vue')), 'EPRO')

Vue.use(Router)

let router = new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: About,
      alias: '/'
    },
    {
      path: '/eth',
      name: 'ETH',
      component: Home,
      
    },
    {
      path: '/epro',
      name: 'EPRO',
      component: EPRO
    }
  ]
})

export default router
