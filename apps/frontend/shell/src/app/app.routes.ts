import { Routes } from '@angular/router';
import { HealthCheckComponent } from './components/health-check/health-check.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { RoleGuard } from './auth/role.guard';
import { MainLayoutComponent } from './layouts/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout.component';
import { FederatedComplianceComponent } from './components/federated-compliance.component';
import { FederatedSummaryComponent } from './components/federated-summary.component';
import { UserRole } from '../../../shared/src/lib/models/roles.enum';

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
        canActivate: [AuthGuard, RoleGuard],
        data: {
          showNav: true,
          roles: [UserRole.EXECUTIVE, UserRole.ENGINEER],
        },
      },
      {
        path: 'compliance',
        component: FederatedComplianceComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {
          showNav: true,
          roles: [UserRole.EXECUTIVE, UserRole.COMPLIANCE],
        },
      },
      {
        path: 'summary',
        component: FederatedSummaryComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {
          showNav: true,
          roles: [UserRole.EXECUTIVE],
        },
      },
    ],
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [{ path: 'login', component: LoginComponent }],
  },
  { path: '**', redirectTo: 'home' },
];
