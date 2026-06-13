import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule
  ],
  template: `
    <div class="login-wrapper">
      <mat-card class="login-card">
        <mat-card-header>
          <div class="logo">
            <mat-icon>storefront</mat-icon>
          </div>
          <mat-card-title>Product Manager</mat-card-title>
          <mat-card-subtitle>Sign in to continue</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="submit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Username</mat-label>
              <input matInput formControlName="username" autocomplete="username">
              <mat-icon matSuffix>person</mat-icon>
              @if (form.get('username')?.hasError('required') && form.get('username')?.touched) {
                <mat-error>Username is required</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput [type]="hidePass ? 'password' : 'text'" formControlName="password" autocomplete="current-password">
              <button mat-icon-button matSuffix type="button" (click)="hidePass = !hidePass">
                <mat-icon>{{ hidePass ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              @if (form.get('password')?.hasError('required') && form.get('password')?.touched) {
                <mat-error>Password is required</mat-error>
              }
            </mat-form-field>

            @if (errorMsg) {
              <p class="error-msg">{{ errorMsg }}</p>
            }

            <button mat-flat-button color="primary" type="submit" class="full-width submit-btn" [disabled]="loading">
              @if (loading) {
                <mat-spinner diameter="20" />
              } @else {
                Sign in
              }
            </button>
          </form>
        </mat-card-content>

        <mat-card-footer>
          <p class="hint">Demo: <strong>admin / admin123</strong> · <strong>viewer / viewer123</strong></p>
        </mat-card-footer>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a237e 0%, #3949ab 100%);
    }

    .login-card {
      width: 380px;
      padding: 8px;
    }

    mat-card-header {
      flex-direction: column;
      align-items: center;
      padding-bottom: 16px;
    }

    .logo {
      background: #1a237e;
      border-radius: 50%;
      width: 56px; height: 56px;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 12px;
      mat-icon { color: white; font-size: 32px; width: 32px; height: 32px; }
    }

    mat-card-title { font-size: 1.4rem; font-weight: 700; }
    mat-card-subtitle { text-align: center; }

    .full-width { width: 100%; }

    .submit-btn {
      margin-top: 8px;
      height: 44px;
      font-size: 1rem;
    }

    .error-msg {
      color: #d32f2f;
      font-size: .85rem;
      margin: -4px 0 8px;
    }

    .hint {
      text-align: center;
      font-size: .8rem;
      color: #666;
      padding: 8px 0 4px;
    }
  `]
})
export class LoginComponent {
  private auth   = inject(AuthService);
  private router = inject(Router);
  private fb     = inject(FormBuilder);

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  loading  = false;
  hidePass = true;
  errorMsg = '';

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading  = true;
    this.errorMsg = '';
    const { username, password } = this.form.value;
    this.auth.login({ username: username!, password: password! }).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => {
        this.errorMsg = 'Invalid username or password';
        this.loading  = false;
      }
    });
  }
}
