import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import * as ClientActions from '../../store/client/client.actions';
import { selectClientViewModel } from '../../store/client/client.selectors';
import { Client } from '../../data/models/client.model';
import {AsyncPipe, DatePipe} from '@angular/common';
import {RouterLink} from '@angular/router';

interface ClientViewModel {
  clients: Client[];
  loading: boolean;
  error: string | null;
  pagination: {
    totalElements: number;
    totalPages: number;
    page: number;
    size: number;
  };
}

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  imports: [
    AsyncPipe,
    DatePipe,
    RouterLink
  ],
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
  vm$: Observable<{
    showLoading: boolean;
    showError: boolean;
    showContent: boolean;
    isEmpty: boolean;
    error: string | null;
    clients: Client[];
    pagination: {
      page: number;
      totalPages: number;
      totalElements: number;
      size: number;
    };
  }>;

  constructor(private store: Store) {
    this.vm$ = this.store.select(selectClientViewModel).pipe(
      map(viewModel => ({
        showLoading: viewModel.loading,
        showError: !!viewModel.error && !viewModel.loading,
        showContent: !viewModel.loading && !viewModel.error && viewModel.clients.length > 0,
        isEmpty: !viewModel.loading && !viewModel.error && viewModel.clients.length === 0,
        error: viewModel.error,
        clients: viewModel.clients,
        pagination: {
          page: viewModel.pagination.page,
          totalPages: viewModel.pagination.totalPages,
          totalElements: viewModel.pagination.totalElements,
          size: viewModel.pagination.size
        }
      }))
    );
  }

  ngOnInit(): void {
    this.loadClients();
  }

  // client-list.component.ts
  loadClients(): void {
    this.store.dispatch(ClientActions.loadClients({
      queryParams: {
        page: 0,
        size: 10,
        sortBy: 'clientId',
        sortDir: 'asc'
      }
    }));
  }


  onPageChange(newPage: number): void {
    this.store.dispatch(ClientActions.updateQueryParams({ queryParams: { page: newPage } }));
  }

  onPageSizeChange(newSize: number): void {
    this.store.dispatch(ClientActions.updateQueryParams({ queryParams: { size: newSize, page: 0 } }));
  }

  onSort(sortBy: string, sortDir: 'asc' | 'desc'): void {
    this.store.dispatch(ClientActions.updateQueryParams({ queryParams: { sortBy, sortDir } }));
  }

  onDeleteClient(clientId: string | undefined): void {
    if (clientId && confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      // Dispatch action to delete client
      console.log('Delete client:', clientId);
    }
  }
}

