import { Routes } from '@angular/router';
import { HealthCheckComponent } from './components/health-check/health-check.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'health', component: HealthCheckComponent }
];
