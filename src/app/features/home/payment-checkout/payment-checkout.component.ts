import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { BookingService } from '../../../services/booking.service';

@Component({
  selector: 'app-payment-checkout',
  imports: [],
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

  constructor(private router: Router, private bookingService: BookingService, private location: Location) {
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
    this.bookingService.createBooking({
      customerId: this.customerId,
      roomId: this.roomId,
      checkInDate: this.checkIn,
      checkOutDate: this.checkOut,
      status: this.status,
      totalAmount: this.totalAmount
    }).subscribe({
      next: (response) => {
        console.log('Booking created successfully:', response);
        alert('Payment Successful! Booking Confirmed.');
      },
      error: (error) => {
        console.error('Error creating booking:', error);
      }
    });
  }

  cancel() {
    this.location.back();
  }
}