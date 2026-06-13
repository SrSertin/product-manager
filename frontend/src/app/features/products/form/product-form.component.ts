import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductService } from '../../../core/services/product.service';

const CATEGORIES = ['Electronics', 'Home', 'Sports', 'Office', 'Toys'];

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule,
    MatSlideToggleModule, MatProgressSpinnerModule, MatSnackBarModule
  ],
  template: `
    <div class="form-wrapper">
      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title>{{ isEdit ? 'Edit product' : 'New product' }}</mat-card-title>
          <mat-card-subtitle>{{ isEdit ? 'Update product details' : 'Fill in the form to create a product' }}</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          @if (loadingData) {
            <div class="center"><mat-spinner /></div>
          } @else {
            <form [formGroup]="form" (ngSubmit)="submit()">
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>SKU</mat-label>
                  <input matInput formControlName="sku" placeholder="Ej: ELEC-001">
                  @if (form.get('sku')?.hasError('required') && form.get('sku')?.touched) {
                    <mat-error>SKU is required</mat-error>
                  }
                  @if (form.get('sku')?.hasError('maxlength') && form.get('sku')?.touched) {
                    <mat-error>Maximum 50 characters</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Category</mat-label>
                  <mat-select formControlName="category">
                    @for (cat of categories; track cat) {
                      <mat-option [value]="cat">{{ cat }}</mat-option>
                    }
                  </mat-select>
                  @if (form.get('category')?.hasError('required') && form.get('category')?.touched) {
                    <mat-error>Category is required</mat-error>
                  }
                </mat-form-field>
              </div>

              <mat-form-field appearance="outline" class="full">
                <mat-label>Name</mat-label>
                <input matInput formControlName="name" placeholder="Product name">
                @if (form.get('name')?.hasError('required') && form.get('name')?.touched) {
                  <mat-error>Name is required</mat-error>
                }
              </mat-form-field>

              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Price (€)</mat-label>
                  <input matInput type="number" formControlName="price" min="0" step="0.01">
                  <mat-icon matSuffix>euro</mat-icon>
                  @if (form.get('price')?.hasError('required') && form.get('price')?.touched) {
                    <mat-error>Price is required</mat-error>
                  }
                  @if (form.get('price')?.hasError('min') && form.get('price')?.touched) {
                    <mat-error>Price cannot be negative</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Stock</mat-label>
                  <input matInput type="number" formControlName="stock" min="0">
                  <mat-icon matSuffix>inventory</mat-icon>
                  @if (form.get('stock')?.hasError('required') && form.get('stock')?.touched) {
                    <mat-error>Stock is required</mat-error>
                  }
                  @if (form.get('stock')?.hasError('min') && form.get('stock')?.touched) {
                    <mat-error>Stock cannot be negative</mat-error>
                  }
                </mat-form-field>
              </div>

              <mat-slide-toggle formControlName="active" color="primary">
                Active
              </mat-slide-toggle>

              <div class="form-actions">
                <a mat-stroked-button routerLink="/products">Cancel</a>
                <button mat-flat-button color="primary" type="submit" [disabled]="saving">
                  @if (saving) {
                    <mat-spinner diameter="20" />
                  } @else {
                    {{ isEdit ? 'Save changes' : 'Create product' }}
                  }
                </button>
              </div>
            </form>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-wrapper {
      max-width: 700px;
      margin: 0 auto;
    }

    mat-card-header { margin-bottom: 16px; }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .full { width: 100%; }

    mat-form-field { width: 100%; }

    mat-slide-toggle { margin: 8px 0 24px; }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 16px;
    }

    .center { display: flex; justify-content: center; padding: 40px; }
  `]
})
export class ProductFormComponent implements OnInit {
  private productService = inject(ProductService);
  private route          = inject(ActivatedRoute);
  private router         = inject(Router);
  private fb             = inject(FormBuilder);
  private snackBar       = inject(MatSnackBar);

  readonly categories = CATEGORIES;

  isEdit      = false;
  productId?: number;
  loadingData = false;
  saving      = false;

  form = this.fb.group({
    sku:      ['', [Validators.required, Validators.maxLength(50)]],
    name:     ['', [Validators.required, Validators.maxLength(200)]],
    category: ['', Validators.required],
    price:    [0,  [Validators.required, Validators.min(0)]],
    stock:    [0,  [Validators.required, Validators.min(0)]],
    active:   [true]
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit    = true;
      this.productId = +id;
      this.loadingData = true;
      this.productService.getById(this.productId).subscribe({
        next: p => {
          this.form.patchValue(p);
          this.loadingData = false;
        },
        error: () => { this.router.navigate(['/products']); }
      });
    }
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const data = this.form.value as any;
    const op   = this.isEdit
      ? this.productService.update(this.productId!, data)
      : this.productService.create(data);

    op.subscribe({
      next: () => {
        this.snackBar.open(
          this.isEdit ? 'Product updated' : 'Product created',
          'Close', { duration: 3000 }
        );
        this.router.navigate(['/products']);
      },
      error: (err) => {
        const msg = err.error?.message || 'Error saving product';
        this.snackBar.open(msg, 'Close', { duration: 4000 });
        this.saving = false;
      }
    });
  }
}
