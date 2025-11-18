import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { BookingService } from '../../../services/booking.service';
import { PaymentService, CreateOrderResponse } from '../../../services/payment.service';
import { AuthService } from '../../../services/auth.service';
import { HotToastService } from '@ngxpert/hot-toast';

declare var Razorpay: any; // Loaded via index.html

@Component({
  selector: 'app-payment-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-checkout.component.html',
  styleUrl: './payment-checkout.component.scss'
})
export class PaymentCheckoutComponent {
  roomId!: number;
  checkIn!: string;
  checkOut!: string;
  customerId!: number;
  totalAmount!: number;

  isProcessing = false;

  constructor(
    private router: Router,
    private location: Location,
    private bookingService: BookingService,
    private paymentService: PaymentService,
    private authService: AuthService,
    private toast: HotToastService
  ) {
    this.loadState();
  }

  private loadState() {
    const state = history.state;
    if (!state || !state.roomId || !state.totalAmount) {
      this.toast.error('Invalid booking data');
      this.location.back();
      return;
    }

    this.roomId = state.roomId;
    this.checkIn = state.checkIn;
    this.checkOut = state.checkOut;
    this.customerId = state.customerId;
    this.totalAmount = state.totalAmount;
  }

  makePayment() {
    if (this.isProcessing) return;

    this.isProcessing = true;
    const toast = this.toast.loading('Creating your booking...', { duration: 60000 });

    this.bookingService.createBooking({
      customerId: this.customerId!,
      roomId: this.roomId!,
      checkInDate: this.checkIn!,
      checkOutDate: this.checkOut!,
      totalAmount: this.totalAmount!
    }).subscribe({
      next: (res: any) => {
        toast.close();
        const booking = Array.isArray(res) ? res[0] : res;
        this.createRazorpayOrder(booking);
      },
      error: () => {
        toast.close();
        this.isProcessing = false;
        this.toast.error('Failed to create booking');
      }
    });
  }

  private createRazorpayOrder(booking: any) {
    const toast = this.toast.loading('Setting up secure payment...');

    // Use the SAME receipt that backend will use
    const receipt = `booking_${booking.id}`;

    this.paymentService.createOrder({
      amount: this.totalAmount,
      bookingId: booking.id,
      receipt
    }).subscribe({
      next: (order: CreateOrderResponse) => {
        toast.close();
        this.launchRazorpay(order, booking);
      },
      error: () => {
        toast.close();
        this.isProcessing = false;
        this.toast.error('Payment setup failed');
      }
    });
  }

  private launchRazorpay(order: CreateOrderResponse, booking: any) {
    const options: any = {
      key: order.keyId,
      amount: order.amountInPaise,     // Already in paise — DO NOT multiply!
      currency: order.currency,
      name: 'StayHub',
      description: `Booking #${booking.id}`,
      order_id: order.id,
      receipt: order.receipt,

      prefill: {
        name: this.authService.getUserId() || 'Guest',
        email: this.authService.getUserEmail() || 'guest@stayhub.com',
        contact: '9999999999'
      },

      theme: { color: '#2563eb' },

      handler: (response: any) => {
        this.verifyPaymentOnServer({
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature
        });
      },

      modal: {
        ondismiss: () => {
          this.isProcessing = false;
          this.toast.warning('Payment cancelled');

          // CRITICAL: Tell backend payment was cancelled
          this.verifyPaymentOnServer({
            razorpayOrderId: order.id,
            razorpayPaymentId: null,
            razorpaySignature: null
          });
        }
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  }

  private verifyPaymentOnServer(data: {
    razorpayOrderId: string;
    razorpayPaymentId?: string | null;
    razorpaySignature?: string | null;
  }) {
    const toast = this.toast.loading('Verifying payment with bank...');

    this.paymentService.verifyPayment({
      razorpayOrderId: data.razorpayOrderId,
      razorpayPaymentId: data.razorpayPaymentId ?? null,
      razorpaySignature: data.razorpaySignature ?? null
    }).subscribe({
      next: (res: any) => {
        toast.close();
        this.isProcessing = false;

        if (res.success) {
          this.toast.success('Payment Successful! Your room is confirmed');
            this.location.back()
        } else {
          this.toast.error('Payment failed or cancelled. Booking has been cancelled.');
         this.location.back()
        }
      },
      error: () => {
        toast.close();
        this.isProcessing = false;
        this.toast.error('Verification failed. Contact support if charged.');
      }
    });
  }

  cancel() {
    if (this.isProcessing) {
      this.toast.info('Please wait, payment in progress...');
      return;
    }
    this.location.back();
  }
}