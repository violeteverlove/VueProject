import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import VideoPlayer from 'vue-video-player'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
Vue.use(VideoPlayer)

Vue.use(VueRouter);



const routes = [
  {
    path: '/',
    //路由重定向
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    children: [
      {
        //子路由的路径要么吧/去掉，要么把父子路由写上
        path: '/popup',
        name: 'MyPopup',
        component: () => import(/* webpackChunkName: "about" */ '../views/MyPopup.vue')
      }
    ]
  },
  {
    path: '/classify',
    name: 'Classify',
    component: () => import(/* webpackChunkName: "about" */ '../views/Classify.vue')
  },
  {
    path: '/person',
    name: 'Person',
    component: () => import(/* webpackChunkName: "about" */ '../views/Person.vue')
  },
  {
    path: '/play',
    name: 'Play',
    component: () => import(/* webpackChunkName: "about" */ '../views/Play.vue')
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})

export default router
