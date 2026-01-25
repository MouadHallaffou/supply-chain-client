import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as ClientActions from './client.actions';
import { catchError, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { ClientState } from './client.state';
import { selectClientQueryParams } from './client.selectors';
import { ClientService } from '../../services/client.service';

@Injectable()
export class ClientEffects {
  private readonly actions$ = inject(Actions);
  private readonly clientService = inject(ClientService);
  private readonly store = inject(Store<ClientState>);

  loadClients$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.loadClients),
      withLatestFrom(this.store.select(selectClientQueryParams)),
      mergeMap(([action, queryParams]) =>
        this.clientService.getAllClients(queryParams).pipe(
          map(response => ClientActions.loadClientsSuccess({
            clients: response.content,
            totalElements: response.totalElements,
            totalPages: response.totalPages,
            page: response.number,
            size: response.size
          })),
          catchError(error => of(ClientActions.loadClientsFailure({
            error: error.message || 'Unknown error occurred'
          })))
        )
      )
    )
  );

  updateQueryParams$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.updateQueryParams),
      map(() => ClientActions.loadClients({}))
    )
  );
}
