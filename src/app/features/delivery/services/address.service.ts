import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Address, AddressPage, AddressRequest, AddressQueryParams } from '../data/models/address.model';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private graphqlEndpoint = `${environment.graphUrl}`;
  constructor(private http: HttpClient) {}

  // Méthode privée pour construire le corps de la requête GraphQL
  private createGraphQLRequest(query: string, variables: any): any {
    return {
      query,
      variables
    };
  }

  // Requête GraphQL pour obtenir toutes les addresses
  private getAllAddressesQuery = `
   query GetAllAddresses($page: Int!, $size: Int!, $sortBy: String!, $sortDir: String!) {
     getAllAddresses(page: $page, size: $size, sortBy: $sortBy, sortDir: $sortDir) {
       content {
         addressId
         street
         city
         state
         country
         zipCode
         clientId
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

  // Requête GraphQL pour obtenir une address par ID
  private getAddressByIdQuery = `
   query GetAddressById($id: ID!) {
     getAddressById(id: $id) {
       addressId
       street
       city
       state
       country
       zipCode
       clientId
       createdAt
       updatedAt
     }
   }
 `;

  // Mutation GraphQL pour créer une address
  private createAddressMutation = `
   mutation CreateAddress($input: AddressInput!) {
     createAddress(input: $input) {
       addressId
       street
       city
       state
       country
       zipCode
       clientId
       createdAt
       updatedAt
     }
   }
 `;

  // Mutation GraphQL pour mettre à jour une address
  private updateAddressMutation = `
   mutation UpdateAddress($id: ID!, $input: AddressInput!) {
     updateAddress(id: $id, input: $input) {
       addressId
       street
       city
       state
       country
       zipCode
       clientId
       createdAt
       updatedAt
     }
   }
 `;

  // Mutation GraphQL pour supprimer une address
  private deleteAddressMutation = `
   mutation DeleteAddress($id: ID!) {
     deleteAddress(id: $id)
   }
 `;

  getAllAddresses(params: AddressQueryParams): Observable<AddressPage> {
    const { page, size, sortBy, sortDir } = params;
    const request = this.createGraphQLRequest(this.getAllAddressesQuery, {
      page,
      size,
      sortBy,
      sortDir
    });

    return this.http.post<{ data: { getAllAddresses: AddressPage } }>(this.graphqlEndpoint, request).pipe(
      map(response => response.data.getAllAddresses)
    );
  }

  getAddressById(id: number): Observable<Address> {
    const request = this.createGraphQLRequest(this.getAddressByIdQuery, { id });

    return this.http.post<{ data: { getAddressById: Address } }>(this.graphqlEndpoint, request).pipe(
      map(response => response.data.getAddressById)
    );
  }

  createAddress(address: AddressRequest): Observable<Address> {
    const request = this.createGraphQLRequest(this.createAddressMutation, { input: address });

    return this.http.post<{ data: { createAddress: Address } }>(this.graphqlEndpoint, request).pipe(
      map(response => response.data.createAddress)
    );
  }

  updateAddress(id: number, address: AddressRequest): Observable<Address> {
    const request = this.createGraphQLRequest(this.updateAddressMutation, { id, input: address });

    return this.http.post<{ data: { updateAddress: Address } }>(this.graphqlEndpoint, request).pipe(
      map(response => response.data.updateAddress)
    );
  }

  deleteAddress(id: number): Observable<boolean> {
    const request = this.createGraphQLRequest(this.deleteAddressMutation, { id });

    return this.http.post<{ data: { deleteAddress: boolean } }>(this.graphqlEndpoint, request).pipe(
      map(response => response.data.deleteAddress)
    );
  }
}
