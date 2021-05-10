import { createRouter, createWebHistory } from "vue-router";
import Home from '../views/Home.vue';
import cookie from 'js-cookie'
import {request} from "../network/request";
const routes = [
  {
    path: '/',
    redirect: '/login'
},{
        path: "/",
        name: "Home",
        component: Home,
        children:[
            { path: "/market/firstpage",
              name: "firstpage",
              meta: {
                  title: '首页'
              },
              component: () => import (
              "../views/supermarket/FirstPage.vue")
          },
            { path: "/market/marketinfo",
              name: "marketinfo",
              meta: {
                  title: '商店信息'
              },
              component: () => import (
              "../views/supermarket/MarketInfo.vue")
          },
          { path: "/market/order",
            name: "order",
            meta: {
                title: '订单管理'
            },
            component: () => import (
            "../views/supermarket/Order.vue")
          },
          { path: "/market/remark",
            name: "remark",
            meta: {
                title: '评价管理'
            },
            component: () => import (
            "../views/supermarket/Remark.vue")
          },
          { path: "/market/product",
            name: "product",
            meta: {
                title: '商品管理'
            },
            component: () => import (
            "../views/supermarket/Product.vue")
          },
          { path: "/market/type",
            name: "type",
            meta: {
                title: '类别管理'
            },
            component: () => import (
            "../views/supermarket/Type.vue")
          },
          { path: "/manage/homepage",
            name: "homepage",
            meta: {
                title: '首页'
            },
            component: () => import (
            "../views/administrator/HomePage.vue")
          },
          { path: "/manage/approve",
            name: "approve",
            meta: {
                title: '申请审批'
            },
            component: () => import (
            "../views/administrator/Approve.vue")
          },
          { path: "/manage/market",
            name: "market",
            meta: {
                title: '超市管理'
            },
            component: () => import (
            "../views/administrator/Market.vue")
          },
          { path: "/manage/user",
            name: "user",
            meta: {
                title: '用户管理'
            },
            component: () => import (
            "../views/administrator/User.vue")
          },
          { path: "/manage/pictureshift",
          name: "pictureshift",
          meta: {
              title: '轮播图管理'
          },
          component: () => import (
          "../views/administrator/PictureShift.vue")
        }
        ]
}
,{
    path: "/login",
    name: "Login",
    meta: {
        title: '登录'
    },
    component: () => import (
    /* webpackChunkName: "login" */
    "../views/Login.vue")
},{
  path: "/register",
  name: "Register",
  meta: {
      title: '注册'
  },
  component: () => import (
  /* webpackChunkName: "login" */
  "../views/supermarket/Register.vue")
}
];

const router = createRouter({
  mode: 'history', 
  history: createWebHistory(),
  routes
});
router.beforeEach((to,from,next)=>{
    if(to.name === 'Login' || to.name === 'Register')
        next()
    else if(to.name !== 'Login' && to.name !== 'Register'&&cookie.get('user')==undefined){
      next({name:'Login'})
    }
    else{
      request({
        method:'post',
        url:'/user/logintest',
        dataType:'json',
        async:false,
        data:{
            userId:JSON.parse(cookie.get('user')).username,
            password:JSON.parse(cookie.get('user')).password
        }
    }).then(res=>{
        if(res.data==""){
          next({name:'Login'})
        }else{
          if((to.name === 'firstpage' || to.name === 'marketinfo'|| to.name === 'order'|| to.name === 'remark'|| to.name === 'product'|| to.name === 'type')&& res.data.amount!=-1){
            cookie.set('market',  res.data, { expires: 7 });
            cookie.set('user', {username:JSON.parse(cookie.get('user')).username,password:JSON.parse(cookie.get('user')).password}, { expires: 7 });
            next()
          }else if((to.name === 'homepage' || to.name === 'approve'|| to.name === 'market' || to.name === 'user' || to.name === 'pictureshift')&&res.data.amount==-1){
            cookie.set('user', {username:JSON.parse(cookie.get('user')).username,password:JSON.parse(cookie.get('user')).password,sid:res.data.sid}, { expires: 7 });
            next()
          }else{
            next({name:'Login'})
          }
      }
    }).catch(err=>{
        console.log(err);
    })
		}
})
export default router;
