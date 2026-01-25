import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as AddressActions from '../../store/address/address.actions';
import { selectAddressesListViewModel } from '../../store/address/address.selectors';

@Component({
  selector: 'app-address-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.css']
})
export class AddressListComponent implements OnInit {
  private store = inject(Store);
  vm$: Observable<any>;

  constructor() {
    this.vm$ = this.store.select(selectAddressesListViewModel);
  }

  ngOnInit(): void {
    this.loadAddresses();
  }

  loadAddresses(): void {
    this.store.dispatch(AddressActions.loadAddresses({}));
  }

  onPageChange(page: number): void {
    this.store.dispatch(AddressActions.updateQueryParams({ queryParams: { page } }));
    this.store.dispatch(AddressActions.loadAddresses({ queryParams: { page } }));
  }

  onDeleteAddress(id: number): void {
    if (confirm('Are you sure you want to delete this address?')) {
      this.store.dispatch(AddressActions.deleteAddress({ id }));
    }
  }
}
