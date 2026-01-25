import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, withLatestFrom, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import * as AddressActions from './address.actions';
import { AddressService } from '../../services/address.service';
import { selectQueryParams } from './address.selectors';

@Injectable()
export class AddressEffects {
  private readonly actions$ = inject(Actions);
  private readonly addressService = inject(AddressService);
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);

  // Load Addresses Effect
  loadAddresses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AddressActions.loadAddresses),
      withLatestFrom(this.store.select(selectQueryParams)),
      mergeMap(([action, queryParams]) => {
        const params = { ...queryParams, ...action.queryParams };
        return this.addressService.getAllAddresses(params).pipe(
          map((response) =>
            AddressActions.loadAddressesSuccess({
              addresses: response.content,
              totalElements: response.totalElements,
              totalPages: response.totalPages,
              page: response.number,
              size: response.size
            })
          ),
          catchError((error) => {
            const errorMessage = this.handleError(error);
            return of(AddressActions.loadAddressesFailure({ error: errorMessage }));
          })
        );
      })
    )
  );

  // Load Single Address Effect
  loadAddress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AddressActions.loadAddress),
      mergeMap((action) =>
        this.addressService.getAddressById(action.id).pipe(
          map((address) => AddressActions.loadAddressSuccess({ address })),
          catchError((error) => {
            const errorMessage = this.handleError(error);
            return of(AddressActions.loadAddressFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  // Create Address Effect
  createAddress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AddressActions.createAddress),
      mergeMap((action) =>
        this.addressService.createAddress(action.address).pipe(
          map((address) => {
            this.toastr.success('Address created successfully');
            this.router.navigate(['/delivery/addresses']);
            return AddressActions.createAddressSuccess({ address });
          }),
          catchError((error) => {
            const errorMessage = this.handleError(error);
            this.toastr.error(errorMessage);
            return of(AddressActions.createAddressFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  // Update Address Effect
  updateAddress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AddressActions.updateAddress),
      mergeMap((action) =>
        this.addressService.updateAddress(action.id, action.address).pipe(
          map((address) => {
            this.toastr.success('Address updated successfully');
            this.router.navigate(['/delivery/addresses']);
            return AddressActions.updateAddressSuccess({ address });
          }),
          catchError((error) => {
            const errorMessage = this.handleError(error);
            this.toastr.error(errorMessage);
            return of(AddressActions.updateAddressFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  // Delete Address Effect
  deleteAddress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AddressActions.deleteAddress),
      mergeMap((action) =>
        this.addressService.deleteAddress(action.id).pipe(
          map(() => {
            this.toastr.success('Address deleted successfully');
            return AddressActions.deleteAddressSuccess({ id: action.id });
          }),
          catchError((error) => {
            const errorMessage = this.handleError(error);
            this.toastr.error(errorMessage);
            return of(AddressActions.deleteAddressFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  // Navigation Effects
  navigateAfterCreate$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AddressActions.createAddressSuccess),
        tap(() => {
          this.router.navigate(['/delivery/addresses']);
        })
      ),
    { dispatch: false }
  );

  navigateAfterUpdate$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AddressActions.updateAddressSuccess),
        tap(() => {
          this.router.navigate(['/delivery/addresses']);
        })
      ),
    { dispatch: false }
  );

  // Error Handling
  private handleError(error: any): string {
    if (error.status === 400) {
      return 'Bad request. Please check your data.';
    } else if (error.status === 401) {
      return 'Unauthorized. Please login again.';
    } else if (error.status === 403) {
      return 'Forbidden. You do not have permission.';
    } else if (error.status === 404) {
      return 'Resource not found.';
    } else if (error.status === 409) {
      return 'Conflict. Resource already exists.';
    } else if (error.status === 500) {
      return 'Internal server error. Please try again later.';
    } else {
      return error.message || 'An unexpected error occurred';
    }
  }
}
