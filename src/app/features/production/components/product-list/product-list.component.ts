import {Component, OnInit, signal} from '@angular/core';
import {ProductService} from '../../services/product.service';
import {Product} from '../../models/product';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit{
  constructor(
    private router: Router,
    private productService: ProductService
  ) {
  }

  allProducts = signal<Product[]>([]);
  products = signal<Product[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  showDeleteModal = signal(false);
  selectedProduct = signal<Product | null>(null);

  totalItems = signal(0);
  sortControl = new FormControl('name');

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.error.set(null);

    this.productService.getAll(0, 100).subscribe({
      next: (response: any) => {
        console.log('API Response:', response);
        const products = response.content || [];
        this.allProducts.set(products);
        this.products.set(products);
        this.totalItems.set(response.totalElements || 0);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erreur lors du chargement des produits');
        console.error('Erreur:', err);
        this.loading.set(false);
      }
    });
  }

  onSortChange(): void {
    const sorted = [...this.products()];
    const sortValue = this.sortControl.value;

    if (sortValue === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortValue === 'price') {
      sorted.sort((a, b) => a.costPerUnit - b.costPerUnit);
    } else if (sortValue === 'stock') {
      sorted.sort((a, b) => a.stock - b.stock);
    }

    this.products.set(sorted);
  }

  onAdd(): void {
    this.router.navigate(['/products/new']);
  }

  onEdit(product: Product): void {
    this.router.navigate(['/products/edit', product.productId]);
  }

  onDelete(product: Product): void {
    this.confirmDelete(product);
    this.deleteProduct();
  }

  confirmDelete(product: Product): void {
    this.selectedProduct.set(product);
    this.showDeleteModal.set(true);
  }

  deleteProduct(): void {
    const product = this.selectedProduct();
    if (!product) return;

    this.productService.delete(product.productId).subscribe({
      next: () => {
        this.success.set('Produit supprimé avec succès');
        this.showDeleteModal.set(false);
        this.loadProducts();
      },
      error: (err) => {
        this.error.set('Erreur lors de la suppression du produit');
        console.error('Erreur:', err);
      }
    });
  }
}
