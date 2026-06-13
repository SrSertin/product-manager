import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { ProductService } from '../../core/services/product.service';
import { DashboardStats } from '../../core/models/product.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatCardModule, MatIconModule, MatButtonModule,
    MatProgressSpinnerModule, MatDividerModule
  ],
  template: `
    <h1 class="page-title">Dashboard</h1>


    @if (loading) {
      <div class="center"><mat-spinner /></div>
    } @else if (stats) {
      <div class="kpi-grid">
        <mat-card class="kpi-card">
          <mat-icon class="kpi-icon blue">grid_view</mat-icon>
          <div class="kpi-value">{{ stats.totalProducts }}</div>
          <div class="kpi-label">Total Products</div>
        </mat-card>
        <mat-card class="kpi-card">
          <mat-icon class="kpi-icon green">task_alt</mat-icon>
          <div class="kpi-value">{{ stats.activeProducts }}</div>
          <div class="kpi-label">Active</div>
        </mat-card>
        <mat-card class="kpi-card">
          <mat-icon class="kpi-icon orange">report_problem</mat-icon>
          <div class="kpi-value">{{ stats.lowStockProducts }}</div>
          <div class="kpi-label">Low Stock (&lt;10)</div>
        </mat-card>
        <mat-card class="kpi-card">
          <mat-icon class="kpi-icon purple">payments</mat-icon>
          <div class="kpi-value">{{ stats.inventoryValue | number:'1.0-0' }} €</div>
          <div class="kpi-label">Inventory Value</div>
        </mat-card>
      </div>

      <div class="charts-row">
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Products by Category</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            @for (cat of stats.productsByCategory; track cat.category) {
              <div class="bar-row">
                <span class="bar-label">{{ cat.category }}</span>
                <div class="bar-track">
                  <div class="bar-fill" [style.width.%]="barPct(cat.count)"></div>
                </div>
                <span class="bar-count">{{ cat.count }}</span>
              </div>
            }
          </mat-card-content>
        </mat-card>

        <mat-card class="quick-actions-card">
          <mat-card-header>
            <mat-card-title>Quick Actions</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <a mat-stroked-button color="primary" routerLink="/products" class="action-btn">
              <mat-icon>view_list</mat-icon> View all products
            </a>
            <a mat-flat-button color="primary" routerLink="/products/new" class="action-btn">
              <mat-icon>add_circle_outline</mat-icon> New product
            </a>
          </mat-card-content>
        </mat-card>
      </div>
    }
  `,
  styles: [`
    .page-title { margin: 0 0 24px; font-size: 1.6rem; font-weight: 600; color: #1a237e; }

    .center { display: flex; justify-content: center; padding: 60px; }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .kpi-card {
      padding: 20px;
      text-align: center;
      border-radius: 12px !important;
    }

    .kpi-icon { font-size: 40px; width: 40px; height: 40px; margin-bottom: 8px; }
    .kpi-icon.blue   { color: #1565c0; }
    .kpi-icon.green  { color: #2e7d32; }
    .kpi-icon.orange { color: #e65100; }
    .kpi-icon.purple { color: #6a1b9a; }

    .kpi-value { font-size: 2rem; font-weight: 700; color: #212121; }
    .kpi-label { font-size: .85rem; color: #757575; margin-top: 4px; }

    .charts-row {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 16px;
    }

    .bar-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 10px 0;
    }

    .bar-label { width: 110px; font-size: .85rem; text-align: right; }

    .bar-track {
      flex: 1;
      background: #e3e8f0;
      border-radius: 4px;
      height: 16px;
      overflow: hidden;
    }

    .bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #1a237e, #3949ab);
      border-radius: 4px;
      transition: width .4s ease;
    }

    .bar-count { width: 28px; font-size: .85rem; font-weight: 600; }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      width: 100%;
    }

    @media (max-width: 768px) {
      .charts-row { grid-template-columns: 1fr; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  private productService = inject(ProductService);
  stats: DashboardStats | null = null;
  loading = true;

  ngOnInit() {
    this.productService.getDashboard().subscribe({
      next: data => { this.stats = data; this.loading = false; },
      error: ()   => { this.loading = false; }
    });
  }

  barPct(count: number): number {
    if (!this.stats?.productsByCategory.length) return 0;
    const max = Math.max(...this.stats.productsByCategory.map(c => c.count));
    return max ? (count / max) * 100 : 0;
  }
}
