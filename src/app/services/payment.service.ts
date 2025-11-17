import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PaymentService {

  constructor(private http: HttpClient) {}

  createOrder(amount: number) {
    return this.http.post(`${environment.apiUrl}/payment/create-order`, { amount });
  }

  verifyPayment(data: any) {
    return this.http.post(`${environment.apiUrl}/payment/verify`, data);
  }
}
