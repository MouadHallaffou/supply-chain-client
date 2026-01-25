import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Client, ClientPage, ClientQueryParams } from '../data/models/client.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private graphqlEndpoint = `${environment.graphUrl}`;

  constructor(private http: HttpClient) {}

  // Méthode privée pour construire le corps de la requête GraphQL
  private createGraphQLRequest(query: string, variables: any): any {
    return {
      query,
      variables
    };
  }

  // Requête GraphQL pour obtenir tous les clients
  private getAllClientsQuery = `
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
    const request = this.createGraphQLRequest(this.getAllClientsQuery, {
      page,
      size,
      sortBy,
      sortDir
    });


    return this.http.post<{ data: { getAllClients: ClientPage } }>(this.graphqlEndpoint, request).pipe(
      map(response => response.data.getAllClients)
    );
  }

}
