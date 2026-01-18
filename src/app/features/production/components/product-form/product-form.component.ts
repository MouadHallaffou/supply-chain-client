import {Component, inject, OnInit, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../../services/product.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  productForm!: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);
  isEditMode = signal(false);
  productId: number | null = null;

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      costPerUnit: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      productionTimeHours: [0, [Validators.required, Validators.min(0)]]
    });
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productId = +id;
      this.isEditMode.set(true);
      this.loadProduct(this.productId);
    }
  }

  private loadProduct(id: number): void {
    this.loading.set(true);
    this.productService.getById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          name: product.name,
          costPerUnit: product.costPerUnit,
          stock: product.stock,
          productionTimeHours: product.productionTimeHours
        });
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erreur lors du chargement du produit');
        console.error('Erreur:', err);
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const productData = this.productForm.value;

    if (this.isEditMode() && this.productId) {
      this.productService.update(this.productId, productData).subscribe({
        next: () => {
          this.success.set('Produit mis à jour avec succès');
          setTimeout(() => this.router.navigate(['/products']), 1500);
        },
        error: (err) => {
          this.error.set('Erreur lors de la mise à jour du produit');
          console.error('Erreur:', err);
          this.loading.set(false);
        }
      });
    } else {
      this.productService.create(productData).subscribe({
        next: () => {
          this.success.set('Produit créé avec succès');
          setTimeout(() => this.router.navigate(['/products']), 1500);
        },
        error: (err) => {
          this.error.set('Erreur lors de la création du produit');
          console.error('Erreur:', err);
          this.loading.set(false);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }

  get name() { return this.productForm.get('name')!; }
  get costPerUnit() { return this.productForm.get('costPerUnit')!; }
  get stock() { return this.productForm.get('stock')!; }
  get productionTimeHours() { return this.productForm.get('productionTimeHours')!; }
}
