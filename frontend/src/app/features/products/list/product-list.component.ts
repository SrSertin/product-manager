import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product, PageResponse, ProductFilter } from '../../../core/models/product.model';

const CATEGORIES = ['Electrónica', 'Hogar', 'Deporte', 'Oficina', 'Juguetería'];
const DISPLAYED_COLUMNS = ['sku', 'name', 'category', 'price', 'stock', 'active', 'actions'];

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatChipsModule,
    MatProgressSpinnerModule, MatTooltipModule,
    MatDialogModule, MatSnackBarModule, MatSlideToggleModule
  ],
  template: `
    <div class="list-header">
      <h1 class="page-title">Productos</h1>
      @if (auth.isAdmin()) {
        <a mat-flat-button color="primary" routerLink="/products/new">
          <mat-icon>add</mat-icon> Nuevo producto
        </a>
      }
    </div>

    <!-- Filtros -->
    <div class="filters-bar" [formGroup]="filterForm">
      <mat-form-field appearance="outline" class="filter-search">
        <mat-label>Buscar por nombre o SKU</mat-label>
        <input matInput formControlName="search">
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>

      <mat-form-field appearance="outline" class="filter-cat">
        <mat-label>Categoría</mat-label>
        <mat-select formControlName="category">
          <mat-option value="">Todas</mat-option>
          @for (cat of categories; track cat) {
            <mat-option [value]="cat">{{ cat }}</mat-option>
          }
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="filter-active">
        <mat-label>Estado</mat-label>
        <mat-select formControlName="active">
          <mat-option value="">Todos</mat-option>
          <mat-option [value]="true">Activos</mat-option>
          <mat-option [value]="false">Inactivos</mat-option>
        </mat-select>
      </mat-form-field>

      <button mat-stroked-button (click)="resetFilters()">
        <mat-icon>clear</mat-icon> Limpiar
      </button>
    </div>

    <!-- Tabla -->
    <div class="table-wrapper mat-elevation-z2">
      @if (loading()) {
        <div class="table-loading"><mat-spinner diameter="40" /></div>
      }
      <table mat-table [dataSource]="data" matSort (matSortChange)="onSort($event)">

        <ng-container matColumnDef="sku">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>SKU</th>
          <td mat-cell *matCellDef="let p"><code>{{ p.sku }}</code></td>
        </ng-container>

        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Nombre</th>
          <td mat-cell *matCellDef="let p">{{ p.name }}</td>
        </ng-container>

        <ng-container matColumnDef="category">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Categoría</th>
          <td mat-cell *matCellDef="let p">
            <span class="cat-chip">{{ p.category }}</span>
          </td>
        </ng-container>

        <ng-container matColumnDef="price">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Precio</th>
          <td mat-cell *matCellDef="let p">{{ p.price | number:'1.2-2' }} €</td>
        </ng-container>

        <ng-container matColumnDef="stock">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Stock</th>
          <td mat-cell *matCellDef="let p">
            <span [class.low-stock]="p.stock < 10">{{ p.stock }}</span>
          </td>
        </ng-container>

        <ng-container matColumnDef="active">
          <th mat-header-cell *matHeaderCellDef>Activo</th>
          <td mat-cell *matCellDef="let p">
            <mat-icon [class.active]="p.active" [class.inactive]="!p.active">
              {{ p.active ? 'check_circle' : 'cancel' }}
            </mat-icon>
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let p">
            <a mat-icon-button [routerLink]="['/products', p.id, 'edit']" matTooltip="Editar"
               *ngIf="auth.isAdmin()">
              <mat-icon>edit</mat-icon>
            </a>
            <button mat-icon-button color="warn" matTooltip="Eliminar"
                    (click)="confirmDelete(p)" *ngIf="auth.isAdmin()">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="columns"></tr>
        <tr mat-row *matRowDef="let row; columns: columns;"></tr>

        <tr class="mat-row" *matNoDataRow>
          <td class="mat-cell no-data" [attr.colspan]="columns.length">
            No hay productos para los filtros seleccionados.
          </td>
        </tr>
      </table>

      <mat-paginator
        [length]="total"
        [pageSize]="filter.size"
        [pageSizeOptions]="[5, 10, 25, 50]"
        (page)="onPage($event)"
        showFirstLastButtons />
    </div>
  `,
  styles: [`
    .list-header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 20px;
    }

    .page-title { margin: 0; font-size: 1.6rem; font-weight: 600; color: #1a237e; }

    .filters-bar {
      display: flex; gap: 12px; align-items: center;
      flex-wrap: wrap; margin-bottom: 16px;
    }

    .filter-search { flex: 2; min-width: 220px; }
    .filter-cat    { flex: 1; min-width: 160px; }
    .filter-active { flex: 1; min-width: 140px; }

    .table-wrapper { border-radius: 12px; overflow: hidden; position: relative; }

    .table-loading {
      position: absolute; inset: 0;
      display: flex; align-items: center; justify-content: center;
      background: rgba(255,255,255,.7); z-index: 10;
    }

    table { width: 100%; }

    code {
      background: #e8eaf6; color: #1a237e;
      padding: 2px 6px; border-radius: 4px;
      font-size: .85rem;
    }

    .cat-chip {
      background: #e3f2fd; color: #1565c0;
      padding: 2px 10px; border-radius: 12px;
      font-size: .8rem; font-weight: 500;
    }

    .low-stock { color: #e65100; font-weight: 700; }

    mat-icon.active   { color: #2e7d32; }
    mat-icon.inactive { color: #bdbdbd; }

    .no-data { text-align: center; padding: 32px; color: #9e9e9e; }
  `]
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private snackBar       = inject(MatSnackBar);
  auth                   = inject(AuthService);

  readonly columns    = DISPLAYED_COLUMNS;
  readonly categories = CATEGORIES;

  data: Product[] = [];
  total  = 0;
  loading = signal(false);

  filter: ProductFilter = { page: 0, size: 10, sort: 'createdAt,desc' };

  filterForm = inject(FormBuilder).group({
    search:   [''],
    category: [''],
    active:   ['']
  });

  ngOnInit() {
    this.filterForm.valueChanges.pipe(
      debounceTime(350),
      distinctUntilChanged()
    ).subscribe(() => {
      this.filter.page = 0;
      this.load();
    });
    this.load();
  }

  load() {
    const v = this.filterForm.value;
    this.filter = {
      ...this.filter,
      search:   v.search   || undefined,
      category: v.category || undefined,
      active:   v.active !== '' ? v.active as unknown as boolean : undefined,
    };
    this.loading.set(true);
    this.productService.getAll(this.filter).subscribe({
      next: (res: PageResponse<Product>) => {
        this.data  = res.content;
        this.total = res.totalElements;
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onPage(e: PageEvent)  { this.filter.page = e.pageIndex; this.filter.size = e.pageSize; this.load(); }
  onSort(s: Sort)       { this.filter.sort = s.active && s.direction ? `${s.active},${s.direction}` : 'createdAt,desc'; this.filter.page = 0; this.load(); }
  resetFilters()        { this.filterForm.reset({ search: '', category: '', active: '' }); }

  confirmDelete(product: Product) {
    if (!confirm(`¿Eliminar "${product.name}"?`)) return;
    this.productService.delete(product.id).subscribe({
      next: () => {
        this.snackBar.open('Producto eliminado', 'Cerrar', { duration: 3000 });
        this.load();
      },
      error: () => this.snackBar.open('Error al eliminar', 'Cerrar', { duration: 3000 })
    });
  }
}
