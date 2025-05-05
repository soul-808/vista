import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface LoginCredentials {
  username: string;
  password: string;
  role: string;
}

export interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    console.log('Login attempt with credentials:', credentials);
    return this.http.post<AuthResponse>('/api/auth/login', credentials).pipe(
      tap((response) => {
        console.log('Login response received:', response);
        this.setToken(response.token);
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log('Logging out, removing token');
      sessionStorage.removeItem(this.TOKEN_KEY);
    }
  }

  isAuthenticated(): boolean {
    const hasToken = !!this.getToken();
    console.log('Checking authentication status:', hasToken);
    return hasToken;
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const token = sessionStorage.getItem(this.TOKEN_KEY);
      console.log(
        'Getting token from storage:',
        token ? 'Token exists' : 'No token found'
      );
      return token;
    }
    return null;
  }

  private setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log('Setting token in storage');
      sessionStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  getUserInfo(): any | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }
}
