import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { BookingService } from '../../../services/booking.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { LoaderComponent } from '../../../shared/loader/loader.component';

@Component({
  selector: 'app-booking',
  imports: [CommonModule, RouterLink, LoaderComponent, FormsModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss'
})
export class BookingComponent implements OnInit {

  customerId: number | null = null;
  bookings: any[] = [];
  filteredBookings: any[] = [];
  isLoading = true;
  selectedFilter: string = 'all';

  constructor(
    private authService: AuthService, 
    private bookingService: BookingService,
    private toast: HotToastService
  ){}

  ngOnInit() {
    this.customerId = this.authService.getUserId(); 
    
    if (this.customerId !== null) {
      this.bookingService.getBookingDetailsByCustomer(this.customerId).subscribe({
        next: (data: any) => {
          this.bookings = data;
          this.filteredBookings = data;
          this.isLoading = false;
          if (this.bookings.length === 0) {
            this.toast.info('No bookings found');
          }
        },
        error: (error) => {
          console.error('Error fetching booking details:', error);
          this.isLoading = false;
          this.toast.error('Failed to load bookings');
        }
      });
    } else {
      this.isLoading = false;
      this.toast.warning('Please login to view your bookings');
    }
  }

  getStatusText(status: number): string {
    const statusMap: { [key: number]: string } = {
      0: 'Pending',
      1: 'Confirmed',
      2: 'Cancelled',
      3: 'Completed'
    };
    return statusMap[status] || 'Unknown';
  }

  getStatusClass(status: number): string {
    const statusClassMap: { [key: number]: string } = {
      0: 'status-pending',
      1: 'status-confirmed',
      2: 'status-cancelled',
      3: 'status-completed'
    };
    return statusClassMap[status] || '';
  }

  filterBookings(filter: string) {
    this.selectedFilter = filter;
    
    if (filter === 'all') {
      this.filteredBookings = this.bookings;
    } else {
      const statusMap: { [key: string]: number } = {
        'pending': 0,
        'confirmed': 1,
        'cancelled': 2,
      };
      
      const statusValue = statusMap[filter];
      this.filteredBookings = this.bookings.filter(booking => booking.status === statusValue);
    }
  }
  

}
