import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import {
  UserRole,
  RoleUtils,
} from '../../../../shared/src/lib/models/roles.enum';

export interface NavItem {
  path: string;
  label: string;
  roles: UserRole[];
  icon?: string;
}

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private navItems: NavItem[] = [
    {
      path: '/summary',
      label: 'Executive Summary',
      roles: [UserRole.EXECUTIVE],
    },
    {
      path: '/compliance',
      label: 'Compliance',
      roles: [UserRole.EXECUTIVE, UserRole.COMPLIANCE],
    },
    {
      path: '/health',
      label: 'Health Check',
      roles: [UserRole.EXECUTIVE, UserRole.ENGINEER],
    },
    // Future tabs will be added here
  ];

  constructor(private authService: AuthService) {}

  /**
   * Returns navigation items available for the current user based on their role
   */
  getAuthorizedNavItems(): NavItem[] {
    const userInfo = this.authService.getUserInfo();
    if (!userInfo) return [];

    const userRole = userInfo.role?.toLowerCase() || '';

    // Executive role can see all navigation items
    if (RoleUtils.isExecutiveRole(userRole)) {
      return this.navItems;
    }

    // Filter navigation items based on user role
    return this.navItems.filter((item) =>
      item.roles.some((role) => role.toLowerCase() === userRole)
    );
  }

  /**
   * Checks if the user has access to a specific path
   */
  canAccessPath(path: string): boolean {
    const userInfo = this.authService.getUserInfo();
    if (!userInfo) return false;

    const userRole = userInfo.role?.toLowerCase() || '';

    // Executive role can access all paths
    if (RoleUtils.isExecutiveRole(userRole)) {
      return true;
    }

    // Find the nav item for this path
    const navItem = this.navItems.find((item) => item.path === path);
    if (!navItem) return false;

    // Check if user role is in the allowed roles
    return navItem.roles.some((role) => role.toLowerCase() === userRole);
  }
}
