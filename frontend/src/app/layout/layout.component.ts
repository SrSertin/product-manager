import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet, RouterLink, RouterLinkActive,
    MatSidenavModule, MatToolbarModule, MatListModule,
    MatIconModule, MatButtonModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav mode="side" opened class="sidenav">
        <div class="brand">
          <mat-icon>storefront</mat-icon>
          <span>Backoffice</span>
        </div>
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active-link">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>
          <a mat-list-item routerLink="/products" routerLinkActive="active-link">
            <mat-icon matListItemIcon>inventory_2</mat-icon>
            <span matListItemTitle>Productos</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <span class="spacer"></span>
          <span class="user-info">
            <mat-icon>person</mat-icon>
            {{ auth.user()?.username }}
            <small class="role-badge">{{ auth.user()?.role }}</small>
          </span>
          <button mat-icon-button (click)="auth.logout()" title="Cerrar sesión">
            <mat-icon>logout</mat-icon>
          </button>
        </mat-toolbar>
        <div class="page-content">
          <router-outlet />
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container { height: 100vh; }

    .sidenav {
      width: 220px;
      background: #1a237e;
      color: white;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 20px 16px 16px;
      font-size: 1.1rem;
      font-weight: 600;
      color: white;
      border-bottom: 1px solid rgba(255,255,255,.15);
      margin-bottom: 8px;
    }

    mat-nav-list a {
      color: rgba(255,255,255,.8);
      border-radius: 8px;
      margin: 2px 8px;
    }

    mat-nav-list a.active-link {
      background: rgba(255,255,255,.15);
      color: white;
    }

    .spacer { flex: 1; }

    .user-info {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: .9rem;
    }

    .role-badge {
      background: rgba(255,255,255,.25);
      padding: 2px 8px;
      border-radius: 12px;
      font-size: .7rem;
      font-weight: 600;
    }

    .page-content { padding: 24px; }
  `]
})
export class LayoutComponent {
  auth = inject(AuthService);
}
