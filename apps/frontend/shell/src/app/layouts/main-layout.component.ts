import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';

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

  constructor(private router: Router, private route: ActivatedRoute) {
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
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem('auth_token');
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    // Additional initialization logic if needed
  }
}
