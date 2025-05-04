import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginCredentials } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  errorMessage: string = '';
  roles = [
    { value: 'engineer', label: 'Engineer' },
    { value: 'compliance', label: 'Compliance Officer' },
    { value: 'executive', label: 'Executive' },
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      role: ['engineer', [Validators.required]],
      rememberMe: [false],
    });
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill in all fields';
      this.loginForm.markAllAsTouched();
      return;
    }
    this.errorMessage = '';
    const credentials: LoginCredentials = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
      role: this.loginForm.value.role,
    };
    this.authService.login(credentials).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.errorMessage = 'Login failed. Please check your credentials.';
        console.error('Login error:', error);
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
