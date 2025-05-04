import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('=== Functional Interceptor Debug ===');
  console.log('Request URL:', req.url);
  console.log('Request method:', req.method);
  console.log('Current headers:', req.headers.keys());

  const authService = inject(AuthService);

  // Skip interceptor for login request
  if (req.url.includes('/api/auth/login')) {
    console.log('Skipping interceptor for login request');
    return next(req);
  }

  const token = authService.getToken();
  console.log('Token from storage:', token ? 'Token exists' : 'No token found');

  if (token) {
    console.log('Adding Authorization header with token');
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('New headers after adding token:', cloned.headers.keys());
    return next(cloned);
  }

  console.log('No token found, proceeding without Authorization header');
  return next(req);
};
