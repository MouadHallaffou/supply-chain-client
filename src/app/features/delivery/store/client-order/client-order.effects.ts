import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { ClientOrderService } from '../../services/client-order.service';
import * as ClientOrderActions from './client-order.actions';

@Injectable()
export class ClientOrderEffects {
  // Déclaration des propriétés
  loadClientOrders$;
  loadClientOrderById$;
  loadClientOrdersByStatus$;
  createClientOrder$;
  updateClientOrder$;
  cancelClientOrder$;

  constructor(
    private actions$: Actions,
    private clientOrderService: ClientOrderService
  ) {
    console.log('ClientOrderEffects constructor - Service:', this.clientOrderService);

    // Initialisation des effets APRÈS l'injection
    this.loadClientOrders$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ClientOrderActions.loadClientOrders),
        switchMap(({ page, size, sortBy }) => {
          console.log('ClientOrderEffects - Service:', this.clientOrderService);

          if (!this.clientOrderService) {
            console.error('ClientOrderService is undefined!');
            return of(ClientOrderActions.loadClientOrdersFailure({
              error: 'ClientOrderService is not available'
            }));
          }

          return this.clientOrderService.getAllClientOrders(
            page ?? 0,
            size ?? 10,
            sortBy ?? 'createdAt'
          ).pipe(
            map((response) =>
              ClientOrderActions.loadClientOrdersSuccess({
                clientOrders: response.content,
                totalElements: response.totalElements,
                totalPages: response.totalPages,
                currentPage: response.number
              })
            ),
            catchError((error) => {
              console.error('Error loading client orders:', error);
              return of(ClientOrderActions.loadClientOrdersFailure({
                error: error?.message || 'Unknown error'
              }));
            })
          );
        })
      )
    );

    this.loadClientOrderById$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ClientOrderActions.loadClientOrderById),
        switchMap(({ orderId }) =>
          this.clientOrderService.getClientOrderById(orderId).pipe(
            map((clientOrder) =>
              ClientOrderActions.loadClientOrderByIdSuccess({ clientOrder })
            ),
            catchError((error) => {
              console.error('Error loading client order by id:', error);
              return of(ClientOrderActions.loadClientOrderByIdFailure({
                error: error?.message || 'Unknown error'
              }));
            })
          )
        )
      )
    );

    this.loadClientOrdersByStatus$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ClientOrderActions.loadClientOrdersByStatus),
        switchMap(({ status, page, size }) =>
          this.clientOrderService.getClientOrdersByStatus(status, page ?? 0, size ?? 10).pipe(
            map((response) =>
              ClientOrderActions.loadClientOrdersByStatusSuccess({
                clientOrders: response.content,
                totalElements: response.totalElements,
                totalPages: response.totalPages,
                currentPage: response.number
              })
            ),
            catchError((error) => {
              console.error('Error loading client orders by status:', error);
              return of(ClientOrderActions.loadClientOrdersByStatusFailure({
                error: error?.message || 'Unknown error'
              }));
            })
          )
        )
      )
    );

    this.createClientOrder$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ClientOrderActions.createClientOrder),
        switchMap(({ input }) =>
          this.clientOrderService.createClientOrder(input).pipe(
            map((clientOrder) =>
              ClientOrderActions.createClientOrderSuccess({ clientOrder })
            ),
            catchError((error) => {
              console.error('Error creating client order:', error);
              return of(ClientOrderActions.createClientOrderFailure({
                error: error?.message || 'Unknown error'
              }));
            })
          )
        )
      )
    );

    this.updateClientOrder$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ClientOrderActions.updateClientOrder),
        switchMap(({ orderId, input }) =>
          this.clientOrderService.updateClientOrder(orderId, input).pipe(
            map((clientOrder) =>
              ClientOrderActions.updateClientOrderSuccess({ clientOrder })
            ),
            catchError((error) => {
              console.error('Error updating client order:', error);
              return of(ClientOrderActions.updateClientOrderFailure({
                error: error?.message || 'Unknown error'
              }));
            })
          )
        )
      )
    );

    this.cancelClientOrder$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ClientOrderActions.cancelClientOrder),
        switchMap(({ orderId }) =>
          this.clientOrderService.cancelClientOrder(orderId).pipe(
            map((clientOrder) =>
              ClientOrderActions.cancelClientOrderSuccess({ clientOrder })
            ),
            catchError((error) => {
              console.error('Error canceling client order:', error);
              return of(ClientOrderActions.cancelClientOrderFailure({
                error: error?.message || 'Unknown error'
              }));
            })
          )
        )
      )
    );
  }
}
