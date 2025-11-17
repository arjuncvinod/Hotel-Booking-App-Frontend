import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { BookingService } from '../../../services/booking.service';
import { PaymentService } from '../../../services/payment.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-payment-checkout',
  imports: [CommonModule],
  templateUrl: './payment-checkout.component.html',
  styleUrl: './payment-checkout.component.scss'
})
export class PaymentCheckoutComponent {

  roomId: number | undefined;
  checkIn: string | undefined;
  checkOut: string | undefined;
  customerId: number | undefined;
  status: number | undefined;
  totalAmount: number | undefined;
  isProcessing = false;

  constructor(
    private router: Router, 
    private bookingService: BookingService,
    private paymentService: PaymentService,
    private location: Location,
    private toast: HotToastService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as {
      roomId: number;
      checkIn: string;
      checkOut: string;
      customerId: number;
      status: number;
      totalAmount: number;
    };

    if (state) {
      this.roomId = state.roomId;
      this.checkIn = state.checkIn;
      this.checkOut = state.checkOut;
      this.customerId = state.customerId;
      this.status = state.status;
      this.totalAmount = state.totalAmount;
    }
  }

  makePayment() {
    if (!this.totalAmount || this.totalAmount <= 0) {
      this.toast.error('Invalid amount');
      return;
    }

    this.isProcessing = true;
    const loadingToast = this.toast.loading('Processing payment...', { duration: 30000 });

    // Create order first
    this.paymentService.createOrder(this.totalAmount).subscribe({
      next: (response: any) => {
        loadingToast.close();
        this.initializeRazorpay(response);
      },
      error: (error) => {
        loadingToast.close();
        this.isProcessing = false;
        console.error('Order creation failed:', error);
        this.toast.error('Failed to create order. Please try again.');
      }
    });
  }

  private initializeRazorpay(orderData: any) {
    const options: any = {
      key: environment.razorpayKeyId, 
      amount: this.totalAmount! * 100, 
      currency: 'INR',
      name: 'StayHub',
      description: `Booking for Room #${this.roomId}`,
      order_id: orderData.id,
      handler: (response: any) => {
      this.verifyPayment(response);
      },
      prefill: {
      contact: '9999999999', 
      email: 'customer@example.com' 
      },
      theme: {
      color: '#2563eb'
      },
      modal: {
      ondismiss: () => {
        this.isProcessing = false;
        this.toast.warning('Payment cancelled');
      }
      }
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  }

  private verifyPayment(paymentResponse: any) {
    const verifyData = {
      orderId: paymentResponse.razorpay_order_id,
      paymentId: paymentResponse.razorpay_payment_id,
      signature: paymentResponse.razorpay_signature
    };

    const loadingToast = this.toast.loading('Verifying payment...', { duration: 30000 });

    this.paymentService.verifyPayment(verifyData).subscribe({
      next: (response: any) => {
        loadingToast.close();
        if (response.success) {
          this.createBooking();
        } else {
          this.isProcessing = false;
          this.toast.error('Payment verification failed');
        }
      },
      error: (error) => {
        loadingToast.close();
        this.isProcessing = false;
        console.error('Payment verification error:', error);
        this.toast.error('Payment verification failed. Please try again.');
      }
    });
  }

  private createBooking() {
    const loadingToast = this.toast.loading('Creating booking...', { duration: 30000 });

    this.bookingService.createBooking({
      customerId: this.customerId,
      roomId: this.roomId,
      checkInDate: this.checkIn,
      checkOutDate: this.checkOut,
      status: this.status,
      totalAmount: this.totalAmount
    }).subscribe({
      next: (response) => {
        loadingToast.close();
        this.isProcessing = false;
        console.log('Booking created successfully:', response);
        this.toast.success('Payment Successful! Booking Confirmed.');
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      },
      error: (error) => {
        loadingToast.close();
        this.isProcessing = false;
        console.error('Error creating booking:', error);
        this.toast.error('Booking creation failed. Please try again.');
      }
    });
  }

  cancel() {
    if (this.isProcessing) {
      this.toast.warning('Payment in progress');
      return;
    }
    this.location.back();
  }
}
