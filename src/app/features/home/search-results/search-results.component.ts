import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelService } from '../../../services/hotel.service';
import { SearchFilterComponent } from './components/search-filter/search-filter.component';
import { SearchInfoComponent } from './components/search-info/search-info.component';
import { HotelCardComponent } from './components/hotel-card/hotel-card.component';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { CapitalizeWordsPipe } from "../../../shared/capitalize-words.pipe";

@Component({
  selector: 'app-search-results',
  imports: [SearchFilterComponent, SearchInfoComponent, HotelCardComponent, LoaderComponent, CapitalizeWordsPipe],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss'
})
export class SearchResultsComponent {

  location: string | null = '';
  checkIn: string | null = '';
  checkOut: string | null = '';
  sortBy: string | null = '';
  price: string | null = '';

  isLoading = signal(true);

  hotels: any[] = [];

  constructor(private route: ActivatedRoute,private hotelService: HotelService, private router: Router) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.location = params.get('location');
      this.checkIn = params.get('checkIn');
      this.checkOut = params.get('checkOut');
      this.sortBy = params.get('sortBy') || '';
      this.price = params.get('price') || '';


      if (this.location && this.checkIn && this.checkOut) {
        this.hotelService.getAvailableRooms(this.location, this.checkIn, this.checkOut, this.sortBy ,this.price).subscribe({
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

  onSortChange(sortBy: string) {
    this.router.navigate([], {
      queryParams: {
        sortBy: sortBy
      },
      queryParamsHandling: 'merge'
    });
  }


}
