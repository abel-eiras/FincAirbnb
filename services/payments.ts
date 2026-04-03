import { apiClient } from './apiClient';

export interface PaymentIntentResult {
  clientSecret: string;
}

export interface PaymentStatus {
  estadoPago: 'pendente' | 'pagado' | 'reembolsado' | 'fallido';
  stripePaymentIntentId: string | null;
}

export async function createPaymentIntent(alugamentoId: string): Promise<PaymentIntentResult> {
  return apiClient.post<PaymentIntentResult>('/payments/create-intent', { alugamentoId });
}

export async function getPaymentStatus(alugamentoId: string): Promise<PaymentStatus> {
  return apiClient.get<PaymentStatus>(`/payments/alugamento/${alugamentoId}`);
}
