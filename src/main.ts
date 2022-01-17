import Vue from 'vue';
import VueRouter from 'vue-router';

import '@fortawesome/fontawesome-free/css/all.min.css';

import APITokenView from '@/components/api_token.vue';
import CourseAdmin from '@/components/course_admin/course_admin.vue';
import CourseList from '@/components/course_list/course_list.vue';
import ProjectList from '@/components/course_view.vue';
import ProjectAdmin from '@/components/project_admin/project_admin.vue';
import ProjectView from '@/components/project_view/project_view.vue';
import SuperuserDashboard from '@/components/superuser_dashboard.vue';
import UIDemos from '@/demos/ui_demos.vue';
import LoginForm from '@/components/login_form.vue';

import App from './app.vue';

Vue.config.productionTip = false;
Vue.use(VueRouter);

const ROUTES = [
  { path: '/', name: "course_list", component: CourseList },
  { path: '/web/course_admin/:course_id', name: "course_admin", component: CourseAdmin },
  { path: '/web/course/:course_id', name: "course_view", component: ProjectList },
  { path: '/web/project_admin/:project_id', name: 'project_admin', component: ProjectAdmin },
  { path: '/web/project/:project_id', component: ProjectView },
  { path: '/web/superusers', component: SuperuserDashboard },
  { path: '/__demos__', component: UIDemos },
  { path: '/web/__apitoken__', component: APITokenView },
  { path: '/web/login', component: LoginForm }
];

const ROUTER = new VueRouter({
  routes: ROUTES,
  mode: 'history'
});

new Vue({
  router: ROUTER,
  render: h => h(App)
}).$mount('#app');
