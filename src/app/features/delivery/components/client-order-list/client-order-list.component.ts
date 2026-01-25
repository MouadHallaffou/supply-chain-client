import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { AsyncPipe, DatePipe, NgClass, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import * as ClientOrderActions from '../../store/client-order/client-order.actions';
import {
  selectAllClientOrders,
  selectClientOrderLoading,
  selectClientOrderError,
  selectClientOrderPagination
} from '../../store/client-order/client-order.selectors';
import { ClientOrder, ClientOrderStatus } from '../../data/models/client-order.model';

interface ClientOrderViewModel {
  showLoading: boolean;
  showError: boolean;
  showContent: boolean;
  isEmpty: boolean;
  error: string | null;
  orders: ClientOrder[];
  pagination: {
    page: number;
    totalPages: number;
    totalElements: number;
    size: number;
  };
}

@Component({
  selector: 'app-client-order-list',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    RouterLink,
    NgClass,
    FormsModule,
    DecimalPipe
  ],
  templateUrl: './client-order-list.component.html',
  styleUrl: './client-order-list.component.css'
})
export class ClientOrderListComponent implements OnInit {
  vm$: Observable<ClientOrderViewModel>;
  selectedStatus: string = '';
  searchTerm: string = '';

  constructor(private store: Store) {
    this.vm$ = this.store.select(state => ({
      orders: selectAllClientOrders(state),
      loading: selectClientOrderLoading(state),
      error: selectClientOrderError(state),
      pagination: selectClientOrderPagination(state)
    })).pipe(
      map(viewModel => ({
        showLoading: viewModel.loading,
        showError: !!viewModel.error && !viewModel.loading,
        showContent: !viewModel.loading && !viewModel.error && viewModel.orders.length > 0,
        isEmpty: !viewModel.loading && !viewModel.error && viewModel.orders.length === 0,
        error: viewModel.error,
        orders: viewModel.orders,
        pagination: {
          page: viewModel.pagination.currentPage,
          totalPages: viewModel.pagination.totalPages,
          totalElements: viewModel.pagination.totalElements,
          size: viewModel.pagination.pageSize
        }
      }))
    );
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    if (this.selectedStatus) {
      this.store.dispatch(ClientOrderActions.loadClientOrdersByStatus({
        status: this.selectedStatus,
        page: 0,
        size: 10
      }));
    } else {
      this.store.dispatch(ClientOrderActions.loadClientOrders({
        page: 0,
        size: 10,
        sortBy: 'createdAt'
      }));
    }
  }

  onStatusChange(): void {
    this.loadOrders();
  }

  onPageChange(newPage: number): void {
    if (this.selectedStatus) {
      this.store.dispatch(ClientOrderActions.loadClientOrdersByStatus({
        status: this.selectedStatus,
        page: newPage,
        size: 10
      }));
    } else {
      this.store.dispatch(ClientOrderActions.loadClientOrders({
        page: newPage,
        size: 10,
        sortBy: 'createdAt'
      }));
    }
  }

  onCancelOrder(orderId: string): void {
    if (confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
      this.store.dispatch(ClientOrderActions.cancelClientOrder({ orderId }));
    }
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
}
