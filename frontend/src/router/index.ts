import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import AuthLayout from '../pages/auth/AuthLayout.vue';
import DashboardPage from '../pages/dashboard/DashboardPage.vue';
import AdminDashboard from '../pages/admin/AdminDashboard.vue';
import PortfolioDetail from '../pages/portfolio/PortfolioDetail.vue';
import SignInPage from '../pages/auth/SignInPage.vue';
import RegisterPage from '../pages/auth/RegisterPage.vue';
import SubscriptionPage from '../pages/subscription/SubscriptionPage.vue';
import { useAuthStore } from '../stores/auth';

const routes: RouteRecordRaw[] = [
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      { path: 'signin', component: SignInPage },
      { path: 'register', component: RegisterPage }
    ]
  },
  {
    path: '/',
    component: DashboardPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/portfolio/:id',
    component: PortfolioDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/subscription',
    component: SubscriptionPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    component: AdminDashboard,
    meta: { requiresAdmin: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next({ path: '/auth/signin' });
    return;
  }
  if (to.meta.requiresAdmin && !auth.isAdmin) {
    next({ path: '/' });
    return;
  }
  next();
});

export default router;
