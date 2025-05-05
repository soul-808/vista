import { Routes } from '@angular/router';
import { HealthCheckComponent } from './components/health-check/health-check.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { MainLayoutComponent } from './layouts/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout.component';
import { FederatedComplianceComponent } from './components/federated-compliance.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard],
        data: { showNav: true },
      },
      {
        path: 'health',
        component: HealthCheckComponent,
        canActivate: [AuthGuard],
        data: { showNav: true },
      },
      {
        path: 'compliance',
        component: FederatedComplianceComponent,
        canActivate: [AuthGuard],
        data: { showNav: true },
      },
    ],
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [{ path: 'login', component: LoginComponent }],
  },
];
