import { Injectable } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';
import {
  UserRole,
  RoleUtils,
} from '../../../../shared/src/lib/models/roles.enum';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const userInfo = this.authService.getUserInfo();
    if (!userInfo) {
      this.router.navigate(['/login']);
      return false;
    }

    const userRole = userInfo.role?.toLowerCase() || '';

    // Executive role can access all routes
    if (RoleUtils.isExecutiveRole(userRole)) {
      return true;
    }

    // Get allowed roles from route data
    const allowedRoles = (route.data['roles'] as UserRole[]) || [];

    // Check if user's role is included in the allowed roles
    const hasPermission = allowedRoles.some(
      (role) => role.toLowerCase() === userRole
    );

    if (!hasPermission) {
      console.log(
        `User with role ${userRole} doesn't have permission to access ${state.url}`
      );
      this.router.navigate(['/home']);
      return false;
    }

    return true;
  }
}
