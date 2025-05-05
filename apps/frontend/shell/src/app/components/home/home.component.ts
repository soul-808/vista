import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IconsModule } from '../../shared/icons.module';
import { AuthService } from '../../auth/auth.service';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, IconsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  userPermissions = {
    executive: false,
    compliance: false,
    infrastructure: false,
  };

  activeRole: string | null = null;
  animateIn = false;
  showAccessDenied = false;
  deniedRole: string | null = null;
  currentYear = new Date().getFullYear();

  constructor(
    private router: Router,
    private authService: AuthService,
    private navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    // Trigger animation after component initializes
    setTimeout(() => {
      this.animateIn = true;
    }, 100);

    // Set user permissions based on role
    const userInfo = this.authService.getUserInfo();
    if (userInfo && userInfo.role) {
      const role = userInfo.role.toLowerCase();
      this.userPermissions.executive = role === 'executive';
      this.userPermissions.compliance =
        role === 'compliance' || role === 'executive';
      this.userPermissions.infrastructure =
        role === 'engineer' || role === 'executive';
    }
  }

  handleRoleClick(role: string): void {
    if (this.userPermissions[role as keyof typeof this.userPermissions]) {
      this.activeRole = role;
    } else {
      this.deniedRole = role;
      this.showAccessDenied = true;
    }
  }

  navigateToRole(): void {
    if (!this.activeRole) return;

    let path = '/';
    switch (this.activeRole) {
      case 'executive':
        path = '/summary';
        break;
      case 'compliance':
        path = '/compliance';
        break;
      case 'infrastructure':
        path = '/infrastructure';
        break;
    }

    this.router.navigate([path]);
  }

  closeRoleModal(): void {
    this.activeRole = null;
  }

  closeAccessDeniedModal(): void {
    this.showAccessDenied = false;
  }
}
