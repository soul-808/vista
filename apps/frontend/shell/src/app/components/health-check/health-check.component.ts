// apps/frontend/shell/src/app/components/health-check/health-check.component.ts

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-health-check',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './health-check.component.html',
  styleUrls: ['./health-check.component.scss']
})
export class HealthCheckComponent implements OnInit {
  status: string = 'Loading...';
  error: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<{ status: string }>('/api/health').subscribe({
      next: (res) => {
        this.status = res.status;
      },
      error: (err) => {
        this.error = 'Failed to fetch health check';
        console.error(err);
      }
    });
  }
}
