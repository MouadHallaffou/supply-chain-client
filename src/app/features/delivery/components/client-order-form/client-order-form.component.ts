import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';

import * as ClientOrderActions from '../../store/client-order/client-order.actions';
import * as ClientActions from '../../store/client/client.actions';
import * as AddressActions from '../../store/address/address.actions';

import {
  selectSelectedClientOrder,
  selectClientOrderLoading,
  selectClientOrderError
} from '../../store/client-order/client-order.selectors';

import { selectAllClients } from '../../store/client/client.selectors';
import { selectAddresses } from '../../store/address/address.selectors';

import { ClientOrder, ClientOrderStatus } from '../../data/models/client-order.model';
import { Client } from '../../data/models/client.model';
import { Address } from '../../data/models/address.model';

@Component({
  selector: 'app-client-order-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './client-order-form.component.html',
  styleUrl: './client-order-form.component.css'
})
export class ClientOrderFormComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  orderForm!: FormGroup;
  isEditMode = false;
  orderId: string | null = null;

  loading = false;
  submitting = false;
  error: string | null = null;

  selectedOrder: ClientOrder | null = null;
  clients: Client[] = [];
  addresses: Address[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadClients();
    this.loadAddresses();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.orderId = id;
      this.loadOrder(id);
    }

    // Souscrire aux changements du store
    this.subscribeToStoreChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm(): void {
    this.orderForm = this.fb.group({
      clientId: ['', Validators.required],
      deliveryAddressId: [''],
      items: this.fb.array([this.createItemGroup()])
    });
  }

  createItemGroup(): FormGroup {
    return this.fb.group({
      productId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  get items(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  addItem(): void {
    this.items.push(this.createItemGroup());
  }

  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  loadClients(): void {
    this.store.dispatch(ClientActions.loadClients({
      queryParams: { page: 0, size: 100, sortBy: 'name', sortDir: 'asc' }
    }));
  }

  loadAddresses(): void {
    this.store.dispatch(AddressActions.loadAddresses({}));
  }

  loadOrder(id: string): void {
    this.loading = true;
    this.store.dispatch(ClientOrderActions.loadClientOrderById({ orderId: id }));
  }

  subscribeToStoreChanges(): void {
    // Écouter les changements de commande sélectionnée
    this.store.select(selectSelectedClientOrder)
      .pipe(takeUntil(this.destroy$))
      .subscribe(order => {
        if (order && this.isEditMode) {
          this.selectedOrder = order;
          this.patchFormWithOrder(order);
          this.loading = false;
        }
      });

    // Écouter les changements de clients
    this.store.select(selectAllClients)
      .pipe(takeUntil(this.destroy$))
      .subscribe(clients => {
        this.clients = clients;
      });

    // Écouter les changements d'adresses
    this.store.select(selectAddresses)
      .pipe(takeUntil(this.destroy$))
      .subscribe(addresses => {
        this.addresses = addresses;
      });

    // Écouter les erreurs
    this.store.select(selectClientOrderError)
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        this.error = error;
        this.submitting = false;
      });

    // Écouter le chargement
    this.store.select(selectClientOrderLoading)
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.loading = loading;
      });
  }

  patchFormWithOrder(order: ClientOrder): void {
    this.orderForm.patchValue({
      clientId: order.clientId,
      deliveryAddressId: order.deliveryAddressId || ''
    });

    // Supprimer les items existants et ajouter ceux de la commande
    this.items.clear();
    if (order.items && order.items.length > 0) {
      order.items.forEach(item => {
        this.items.push(this.fb.group({
          productId: [item.productId, Validators.required],
          quantity: [item.quantity, [Validators.required, Validators.min(1)]]
        }));
      });
    } else {
      this.items.push(this.createItemGroup());
    }
  }

  onSubmit(): void {
    if (this.orderForm.invalid) {
      this.markFormGroupTouched(this.orderForm);
      return;
    }

    this.submitting = true;
    const formValue = this.orderForm.value;

    // Préparer les données
    const orderInput = {
      clientId: formValue.clientId,
      deliveryAddressId: formValue.deliveryAddressId || undefined,
      items: formValue.items
    };

    if (this.isEditMode && this.orderId) {
      this.store.dispatch(ClientOrderActions.updateClientOrder({
        orderId: this.orderId,
        input: orderInput
      }));
    } else {
      this.store.dispatch(ClientOrderActions.createClientOrder({
        input: orderInput
      }));
    }

    // Attendre un peu puis rediriger si succès
    setTimeout(() => {
      if (!this.error) {
        this.router.navigate(['/delivery/client-orders']);
      }
    }, 1000);
  }

  onCancel(): void {
    if (this.orderId && confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
      this.store.dispatch(ClientOrderActions.cancelClientOrder({ orderId: this.orderId }));
      setTimeout(() => {
        this.router.navigate(['/delivery/client-orders']);
      }, 500);
    }
  }

  getTotalQuantity(): number {
    return this.items.controls.reduce((total, control) => {
      return total + (control.get('quantity')?.value || 0);
    }, 0);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.orderForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  isItemFieldInvalid(index: number, fieldName: string): boolean {
    const field = this.items.at(index).get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getStatusLabel(status: ClientOrderStatus): string {
    const labels: Record<ClientOrderStatus, string> = {
      [ClientOrderStatus.EN_PREPARATION]: 'En Préparation',
      [ClientOrderStatus.EN_ROUTE]: 'En Route',
      [ClientOrderStatus.LIVREE]: 'Livrée',
      [ClientOrderStatus.ANNULEE]: 'Annulée'
    };
    return labels[status] || status;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
      if (control instanceof FormArray) {
        control.controls.forEach(arrayControl => {
          if (arrayControl instanceof FormGroup) {
            this.markFormGroupTouched(arrayControl);
          }
        });
      }
    });
  }
}
