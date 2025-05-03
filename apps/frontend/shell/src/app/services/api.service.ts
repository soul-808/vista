import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient, private config: ConfigService) {
    console.log('\n\nApiService initialized');
    console.log('\n\nConfigService instance:', this.config);
  }

  getHealth(): Observable<{ status: string }> {
    try {
      const apiUrl = this.config.apiUrl;
      
      if (!apiUrl) {
        console.error('\n\n%c ERROR: API URL is undefined or null', 'color: red; font-weight: bold');
        throw new Error('API URL is undefined or null');
      }
      
      console.log('\n\n%c API URL being used:', 'color: green; font-weight: bold', apiUrl);
      console.log('\n\n%c Making health check request to:', 'color: yellow', `${apiUrl}/health`);
      
      // Show a warning if using localhost
      if (apiUrl.includes('localhost')) {
        console.warn('\n\n%c WARNING: Using localhost API URL! This will not work in production!', 'color: red; background: yellow; font-weight: bold');
      }
      
      return this.http.get<{ status: string }>(`${apiUrl}/health`);
    } catch (error) {
      console.error('\n\nError in getHealth():', error);
      throw error;
    }
  }

  get<T>(endpoint: string): Observable<T> {
    const apiUrl = this.config.apiUrl;
    if (!apiUrl) {
      throw new Error('API URL is undefined or null');
    }
    return this.http.get<T>(`${apiUrl}${endpoint}`);
  }

  post<T>(endpoint: string, data: unknown): Observable<T> {
    const apiUrl = this.config.apiUrl;
    if (!apiUrl) {
      throw new Error('API URL is undefined or null');
    }
    return this.http.post<T>(`${apiUrl}${endpoint}`, data);
  }
} 