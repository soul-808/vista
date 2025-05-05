import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { NavigationService, NavItem } from '../services/navigation.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit {
  showNav = true;
  currentYear = new Date().getFullYear();
  navItems: NavItem[] = [];
  userRole: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private navigationService: NavigationService
  ) {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let child = this.route.firstChild;
          while (child?.firstChild) {
            child = child.firstChild;
          }
          return child?.snapshot.data?.['showNav'] !== false;
        })
      )
      .subscribe((show) => (this.showNav = show));
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    this.loadUserInfo();
    this.loadNavItems();
  }

  private loadUserInfo() {
    const userInfo = this.authService.getUserInfo();
    if (userInfo) {
      this.userRole = userInfo.role || '';
    }
  }

  private loadNavItems() {
    this.navItems = this.navigationService.getAuthorizedNavItems();
  }
}
