export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1',

  keycloak: {
    realm: 'supply-chain',
    url: 'http://localhost:8082',
    clientId: 'supply-chain-client'
  }
};
