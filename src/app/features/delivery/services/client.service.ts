import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Apollo, gql } from 'apollo-angular';
import { Client, ClientPage, ClientQueryParams } from '../data/models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  constructor(private apollo: Apollo) {}

  // Requête GraphQL pour obtenir tous les clients
  private getAllClientsQuery = gql`
    query GetAllClients($page: Int!, $size: Int!, $sortBy: String!, $sortDir: String!) {
      getAllClients(page: $page, size: $size, sortBy: $sortBy, sortDir: $sortDir) {
        content {
          clientId
          name
          email
          phoneNumber
          createdAt
          updatedAt
        }
        totalElements
        totalPages
        number
        size
        empty
      }
    }
  `;

  getAllClients(params: ClientQueryParams): Observable<ClientPage> {
    const { page, size, sortBy, sortDir } = params;
    
    return this.apollo.query<{ getAllClients: ClientPage }>({
      query: this.getAllClientsQuery,
      variables: {
        page,
        size,
        sortBy,
        sortDir
      },
      fetchPolicy: 'network-only' // Pour éviter le cache
    }).pipe(
      map(response => response.data.getAllClients)
    );
  }
}