import { api } from './api';

export type CustomerNote = {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    displayName: string;
  };
};

export type CustomerInvoice = {
  id: string;
  number: number;
  numberText?: string | null;
  type: 'INVOICE' | 'CREDIT_NOTE';
  status: 'OPEN' | 'PAID' | 'VOID';
  issuedAt: string;
  totalCents: number;
};

export type Customer = {
  id: string;
  name: string;
  email: string | null;
  address: string | null;
  contactPerson: string | null;
  phone: string | null;
};

export type CustomerDetail = Customer & {
  notes: CustomerNote[];
  invoices: CustomerInvoice[];
};

export type PaginationMeta = {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
};

type ListCustomersResponse = {
  customers: Customer[];
  meta: PaginationMeta;
};

type DetailCustomerResponse = {
  customer: CustomerDetail;
};

type UpsertCustomerResponse = {
  customer: Customer;
};

export type CustomerPayload = {
  name: string;
  email?: string;
  address?: string;
  contactPerson?: string;
  phone?: string;
};

export const listCustomers = async (page = 1, perPage = 10) => {
  const { data } = await api.get<ListCustomersResponse>('/api/customers', {
    params: { page, perPage }
  });
  return data;
};

export const getCustomer = async (id: string) => {
  const { data } = await api.get<DetailCustomerResponse>(`/api/customers/${id}`);
  return data.customer;
};

export const createCustomer = async (payload: CustomerPayload) => {
  const { data } = await api.post<UpsertCustomerResponse>('/api/customers', payload);
  return data.customer;
};

export const updateCustomer = async (id: string, payload: CustomerPayload) => {
  const { data } = await api.patch<UpsertCustomerResponse>(`/api/customers/${id}`, payload);
  return data.customer;
};
