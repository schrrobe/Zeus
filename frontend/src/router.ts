import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from './pages/LoginPage.vue';
import RegisterOrgPage from './pages/RegisterOrgPage.vue';
import DashboardPage from './pages/DashboardPage.vue';
import CustomersPage from './pages/CustomersPage.vue';
import CustomerDetailPage from './pages/CustomerDetailPage.vue';
import InvoicesPage from './pages/InvoicesPage.vue';
import InvoicesCreatePage from './pages/InvoicesCreatePage.vue';
import ProductsPage from './pages/ProductsPage.vue';
import SettingsPage from './pages/SettingsPage.vue';
import UsersPage from './pages/UsersPage.vue';
import AdminPage from './pages/AdminPage.vue';

const routes = [
  { path: '/', name: 'login', component: LoginPage },
  { path: '/register', name: 'register', component: RegisterOrgPage },
  { path: '/dashboard', name: 'dashboard', component: DashboardPage },
  { path: '/customers', name: 'customers', component: CustomersPage },
  { path: '/customers/:id', name: 'customer-detail', component: CustomerDetailPage },
  { path: '/invoices', name: 'invoices', component: InvoicesPage },
  { path: '/invoices/new', name: 'invoice-create', component: InvoicesCreatePage },
  { path: '/products', name: 'products', component: ProductsPage },
  { path: '/settings', name: 'settings', component: SettingsPage },
  { path: '/users', name: 'users', component: UsersPage },
  { path: '/admin', name: 'admin', component: AdminPage }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});
