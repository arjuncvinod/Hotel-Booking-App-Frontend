// services/payment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface CreateOrderResponse {
  id: string;
  amountInPaise: number;
  currency: string;
  receipt: string;
  keyId: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private baseUrl = `${environment.apiUrl}/payment`;

  constructor(private http: HttpClient) {}

  createOrder(data: { amount: number; bookingId: number; receipt: string }) {
    return this.http.post<CreateOrderResponse>(`${this.baseUrl}/create-order`, data);
  }

  verifyPayment(data: {
    razorpayOrderId: string;
    razorpayPaymentId?: string | null;
    razorpaySignature?: string | null;
  }) {
    return this.http.post<{ success: boolean }>(`${this.baseUrl}/verify`, data);
  }
}