import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Apollo, gql } from 'apollo-angular';
import { ClientOrder } from '../data/models/client-order.model';
import { ClientOrderInput } from '../data/models/client-order-input.model';

interface ClientOrderPage {
  content: ClientOrder[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClientOrderService {
  constructor(private apollo: Apollo) {}

  // Requête GraphQL pour obtenir toutes les commandes
  private getAllClientOrdersQuery = gql`
    query GetAllClientOrders($page: Int, $size: Int, $sortBy: String) {
      getAllClientOrders(page: $page, size: $size, sortBy: $sortBy) {
        content {
          orderId
          orderNumber
          status
          totalAmount
          createdAt
          updatedAt
        }
        totalElements
        totalPages
        number
        size
      }
    }
  `;

  // Requête GraphQL pour obtenir une commande par ID
  private getClientOrderByIdQuery = gql`
    query GetClientOrderById($id: ID!) {
      getClientOrderById(id: $id) {
        orderId
        orderNumber
        status
        totalAmount
        createdAt
        updatedAt
      }
    }
  `;

  // Requête GraphQL pour obtenir les commandes par statut
  private getClientOrdersByStatusQuery = gql`
    query GetClientOrdersByStatus($status: String!, $page: Int!, $size: Int!) {
      getClientOrdersByStatus(status: $status, page: $page, size: $size) {
        content {
          orderId
          orderNumber
          status
          totalAmount
          createdAt
          updatedAt
        }
        totalElements
        totalPages
        number
        size
      }
    }
  `;

  // Mutation GraphQL pour créer une commande
  private createClientOrderMutation = gql`
    mutation CreateClientOrder($input: ClientOrderInput!) {
      createClientOrder(input: $input) {
        orderId
        orderNumber
        status
        totalAmount
        createdAt
        updatedAt
      }
    }
  `;

  // Mutation GraphQL pour mettre à jour une commande
  private updateClientOrderMutation = gql`
    mutation UpdateClientOrder($id: ID!, $input: ClientOrderInput!) {
      updateClientOrder(id: $id, input: $input) {
        orderId
        orderNumber
        status
        totalAmount
        createdAt
        updatedAt
      }
    }
  `;

  // Mutation GraphQL pour annuler une commande
  private cancelClientOrderMutation = gql`
    mutation CancelClientOrder($id: ID!) {
      cancelClientOrder(id: $id) {
        orderId
        orderNumber
        status
        updatedAt
      }
    }
  `;

  getAllClientOrders(page?: number, size?: number, sortBy?: string): Observable<ClientOrderPage> {
    const variables = {
      page: page ?? 0,
      size: size ?? 10,
      sortBy: sortBy ?? 'createdAt'
    };

    console.log('getAllClientOrders - Variables:', variables);

    return this.apollo.query<{ getAllClientOrders: ClientOrderPage }>({
      query: this.getAllClientOrdersQuery,
      variables,
      fetchPolicy: 'network-only'
    }).pipe(
      map(response => {
        console.log('GraphQL Response:', response);

        // Vérifier s'il y a des erreurs GraphQL
        if (response.errors && response.errors.length > 0) {
          console.error('GraphQL Errors:', response.errors);
          response.errors.forEach((error: any, index: number) => {
            console.error(`Error ${index + 1}:`, error.message);
            console.error('Locations:', error.locations);
            console.error('Path:', error.path);
          });
          throw new Error(`GraphQL Error: ${response.errors[0].message}`);
        }

        if (!response || !response.data || !response.data.getAllClientOrders) {
          console.error('Invalid GraphQL response:', response);
          throw new Error('Invalid response from server - no data');
        }
        return response.data.getAllClientOrders;
      })
    );
  }

  getClientOrderById(id: string): Observable<ClientOrder> {
    return this.apollo.query<{ getClientOrderById: ClientOrder }>({
      query: this.getClientOrderByIdQuery,
      variables: { id },
      fetchPolicy: 'network-only'
    }).pipe(
      map(response => {
        if (response.errors && response.errors.length > 0) {
          console.error('GraphQL Errors:', response.errors);
          throw new Error(`GraphQL Error: ${response.errors[0].message}`);
        }

        if (!response || !response.data || !response.data.getClientOrderById) {
          console.error('Invalid GraphQL response:', response);
          throw new Error('Invalid response from server - no data');
        }

        return response.data.getClientOrderById;
      })
    );
  }

  getClientOrdersByStatus(status: string, page?: number, size?: number): Observable<ClientOrderPage> {
    return this.apollo.query<{ getClientOrdersByStatus: ClientOrderPage }>({
      query: this.getClientOrdersByStatusQuery,
      variables: {
        status,
        page: page ?? 0,
        size: size ?? 10
      },
      fetchPolicy: 'network-only'
    }).pipe(
      map(response => {
        if (response.errors && response.errors.length > 0) {
          console.error('GraphQL Errors:', response.errors);
          throw new Error(`GraphQL Error: ${response.errors[0].message}`);
        }

        if (!response || !response.data || !response.data.getClientOrdersByStatus) {
          console.error('Invalid GraphQL response:', response);
          throw new Error('Invalid response from server - no data');
        }

        return response.data.getClientOrdersByStatus;
      })
    );
  }

  createClientOrder(input: ClientOrderInput): Observable<ClientOrder> {
    return this.apollo.mutate<{ createClientOrder: ClientOrder }>({
      mutation: this.createClientOrderMutation,
      variables: { input }
    }).pipe(
      map(response => {
        if (response.errors && response.errors.length > 0) {
          console.error('GraphQL Errors:', response.errors);
          throw new Error(`GraphQL Error: ${response.errors[0].message}`);
        }

        if (!response || !response.data || !response.data.createClientOrder) {
          console.error('Invalid GraphQL response:', response);
          throw new Error('Invalid response from server - no data');
        }

        return response.data.createClientOrder;
      })
    );
  }

  updateClientOrder(id: string, input: ClientOrderInput): Observable<ClientOrder> {
    return this.apollo.mutate<{ updateClientOrder: ClientOrder }>({
      mutation: this.updateClientOrderMutation,
      variables: { id, input }
    }).pipe(
      map(response => {
        if (response.errors && response.errors.length > 0) {
          console.error('GraphQL Errors:', response.errors);
          throw new Error(`GraphQL Error: ${response.errors[0].message}`);
        }

        if (!response || !response.data || !response.data.updateClientOrder) {
          console.error('Invalid GraphQL response:', response);
          throw new Error('Invalid response from server - no data');
        }

        return response.data.updateClientOrder;
      })
    );
  }

  cancelClientOrder(id: string): Observable<ClientOrder> {
    return this.apollo.mutate<{ cancelClientOrder: ClientOrder }>({
      mutation: this.cancelClientOrderMutation,
      variables: { id }
    }).pipe(
      map(response => {
        if (response.errors && response.errors.length > 0) {
          console.error('GraphQL Errors:', response.errors);
          throw new Error(`GraphQL Error: ${response.errors[0].message}`);
        }

        if (!response || !response.data || !response.data.cancelClientOrder) {
          console.error('Invalid GraphQL response:', response);
          throw new Error('Invalid response from server - no data');
        }

        return response.data.cancelClientOrder;
      })
    );
  }
}