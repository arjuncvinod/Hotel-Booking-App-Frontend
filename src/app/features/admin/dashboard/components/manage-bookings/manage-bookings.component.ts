import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../../../../shared/loader/loader.component';
import { BookingService } from '../../../../../services/admin/booking.service';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-manage-bookings',
  imports: [CommonModule, LoaderComponent],
  templateUrl: './manage-bookings.component.html',
  styleUrl: './manage-bookings.component.scss'
})
export class ManageBookingsComponent implements OnInit {

  bookings: any[] = [];
  isLoading: boolean = true;

  constructor(
    private bookingService: BookingService,
    private toast: HotToastService
  ) { }

  ngOnInit() {
    this.fetchBookings();
  }

  fetchBookings() {
    this.isLoading = true;
    this.bookingService.getBookings().subscribe({
      next: (data: any) => {
        this.bookings = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error fetching bookings', err);
        this.toast.error('Failed to load bookings');
        this.isLoading = false;
      }
    });
  }

  getStatusLabel(status: number): string {
    switch(status) {
      case 0:
        return 'Pending';
      case 1:
        return 'Confirmed';
      case 2:
        return 'Cancelled';
      case 3:
        return 'Completed';
      default:
        return 'Unknown';
    }
  }

  getStatusClass(status: number): string {
    switch(status) {
      case 0:
        return 'status-pending';
      case 1:
        return 'status-confirmed';
      case 2:
        return 'status-cancelled';
      case 3:
        return 'status-completed';
      default:
        return 'status-unknown';
    }
  }

}
