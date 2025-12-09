export interface Cliente {
  id?: number;
  name: string;
  email: string;
  phone: string;
}

export interface SaveClientRequest {
  name: string;
  email: string;
  phone: string;
}

export interface UpdateClientRequest {
  name: string;
  email: string;
  phone: string;
}

export interface SaveClientResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface ClientDetailResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface ListClientResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
}
