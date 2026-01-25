import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClientOrder } from '../data/models/client-order.model';
import { ClientOrderInput } from '../data/models/client-order-input.model';
import { environment } from '../../../../environments/environment';

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
  private graphqlEndpoint = `${environment.graphUrl}`;

  constructor(private http: HttpClient) {}

  // Méthode privée pour construire le corps de la requête GraphQL
  private createGraphQLRequest(query: string, variables: any): any {
    return {
      query,
      variables
    };
  }

  // Requête GraphQL pour obtenir toutes les commandes
  private getAllClientOrdersQuery = `
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
  private getClientOrderByIdQuery = `
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
  private getClientOrdersByStatusQuery = `
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
  private createClientOrderMutation = `
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
  private updateClientOrderMutation = `
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
  private cancelClientOrderMutation = `
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
    console.log('getAllClientOrders - Query:', this.getAllClientOrdersQuery);

    const request = this.createGraphQLRequest(this.getAllClientOrdersQuery, variables);
    console.log('getAllClientOrders - Request:', request);

    return this.http.post<any>(this.graphqlEndpoint, request).pipe(
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
    const request = this.createGraphQLRequest(this.getClientOrderByIdQuery, { id });

    return this.http.post<any>(this.graphqlEndpoint, request).pipe(
      map(response => {
        // Vérifier s'il y a des erreurs GraphQL
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
    const request = this.createGraphQLRequest(this.getClientOrdersByStatusQuery, {
      status,
      page: page ?? 0,
      size: size ?? 10
    });

    return this.http.post<any>(this.graphqlEndpoint, request).pipe(
      map(response => {
        // Vérifier s'il y a des erreurs GraphQL
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
    const request = this.createGraphQLRequest(this.createClientOrderMutation, { input });

    return this.http.post<any>(this.graphqlEndpoint, request).pipe(
      map(response => {
        // Vérifier s'il y a des erreurs GraphQL
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
    const request = this.createGraphQLRequest(this.updateClientOrderMutation, { id, input });

    return this.http.post<any>(this.graphqlEndpoint, request).pipe(
      map(response => {
        // Vérifier s'il y a des erreurs GraphQL
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
    const request = this.createGraphQLRequest(this.cancelClientOrderMutation, { id });

    return this.http.post<any>(this.graphqlEndpoint, request).pipe(
      map(response => {
        // Vérifier s'il y a des erreurs GraphQL
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
