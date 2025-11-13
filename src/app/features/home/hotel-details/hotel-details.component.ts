import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HotelService } from '../../../services/hotel.service';

@Component({
  selector: 'app-hotel-details',
  imports: [],
  templateUrl: './hotel-details.component.html',
  styleUrl: './hotel-details.component.scss'
})
export class HotelDetailsComponent {

  id: string | null = '';
  locationName: string | null = '';
  checkIn: string | null = '';
  checkOut: string | null = '';

  hotels: any[] = [];

  isLoading = signal(true);

  constructor(private route: ActivatedRoute, private hotelService: HotelService, private location: Location) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.id = params.get('id');
      this.locationName = params.get('location');
      this.checkIn = params.get('checkIn');
      this.checkOut = params.get('checkOut');

      if (this.id && this.locationName && this.checkIn && this.checkOut) {
        this.hotelService.getHotelDetails(this.id, this.locationName, this.checkIn, this.checkOut).subscribe({
          next: (data) => {
            this.hotels = data;
            this.isLoading.set(false);
          },
          error: (err) => {
            console.error('Error fetching available rooms', err);
            this.isLoading.set(false);
          }
        });
      }
    });
  }

  goBack() {
    this.location.back();
  }
}
