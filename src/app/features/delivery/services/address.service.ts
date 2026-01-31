import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Apollo, gql } from 'apollo-angular';
import {
  Address,
  AddressPage,
  AddressRequest,
  AddressQueryParams,
} from '../data/models/address.model';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  constructor(private apollo: Apollo) {}

  // Requête GraphQL pour obtenir toutes les addresses
  private getAllAddressesQuery = gql`
    query GetAllAddresses(
      $page: Int!
      $size: Int!
      $sortBy: String!
      $sortDir: String!
    ) {
      getAllAddresses(
        page: $page
        size: $size
        sortBy: $sortBy
        sortDir: $sortDir
      ) {
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
  private getAddressByIdQuery = gql`
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
  private createAddressMutation = gql`
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
  private updateAddressMutation = gql`
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
  private deleteAddressMutation = gql`
    mutation DeleteAddress($id: ID!) {
      deleteAddress(id: $id)
    }
  `;

  getAllAddresses(params: AddressQueryParams): Observable<AddressPage> {
    const { page, size, sortBy, sortDir } = params;

    return this.apollo
      .query<{ getAllAddresses: AddressPage }>({
        query: this.getAllAddressesQuery,
        variables: {
          page,
          size,
          sortBy,
          sortDir,
        },
        fetchPolicy: 'network-only',
      })
      .pipe(map((response) => response.data.getAllAddresses));
  }

  getAddressById(id: number): Observable<Address> {
    return this.apollo
      .query<{ getAddressById: Address }>({
        query: this.getAddressByIdQuery,
        variables: { id },
        fetchPolicy: 'network-only',
      })
      .pipe(map((response) => response.data.getAddressById));
  }

  createAddress(address: AddressRequest): Observable<Address> {
    return this.apollo
      .mutate<{ createAddress: Address }>({
        mutation: this.createAddressMutation,
        variables: { input: address },
      })
      .pipe(map((response) => response.data!.createAddress));
  }

  updateAddress(id: number, address: AddressRequest): Observable<Address> {
    return this.apollo
      .mutate<{ updateAddress: Address }>({
        mutation: this.updateAddressMutation,
        variables: { id, input: address },
      })
      .pipe(map((response) => response.data!.updateAddress));
  }

  deleteAddress(id: number): Observable<boolean> {
    return this.apollo
      .mutate<{ deleteAddress: boolean }>({
        mutation: this.deleteAddressMutation,
        variables: { id },
      })
      .pipe(map((response) => response.data!.deleteAddress));
  }
}
