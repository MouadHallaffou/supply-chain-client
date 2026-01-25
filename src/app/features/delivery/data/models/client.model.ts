export interface Client {
  clientId: string;
  name: string;
  email: string;
  phoneNumber: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClientPage {
  content: Client[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  empty: boolean;
}

export interface ClientQueryParams {
  page: number;
  size: number;
  sortBy: string;
  sortDir: 'asc' | 'desc';
}

export interface ClientState {
  clients: Client[];
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
  queryParams: ClientQueryParams;
  loading: boolean;
  loaded: boolean;
  error: string | null;
}
