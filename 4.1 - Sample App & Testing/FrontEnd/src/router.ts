import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/home',
      name: 'home',
      component: Home,
      props: (route: any) => ({ userId: route.query.id, userName: route.query.name }),
    },
  ],
});
