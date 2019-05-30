import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import BoxList from './views/BoxList.vue'
import OrderList from './views/OrderList.vue'
import ChargerList from './views/ChargerList.vue'
import FeedbackList from './views/FeedbackList.vue'
import Advertise from './views/Advertise.vue'
import Works from './views/Works.vue'
import Home from './views/Home.vue'
import Index from './views/Index.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/Home',
      name: 'Home',
      component: Home
    },
    {
      path: '/Index',
      name: 'Index',
      component: Index,
      children: [
        {
          path: 'BoxList',
          component: BoxList
        },
        {
          path: 'OrderList',
          component: OrderList
        },
        {
          path: 'ChargerList',
          component: ChargerList
        },
        {
          path: 'FeedbackList',
          component: FeedbackList
        },
        {
          path: 'Advertise',
          component: Advertise
        },
        {
          path: 'Works',
          component: Works
        }
      ]
    }
  ]
})
