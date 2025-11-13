import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatSliderModule} from '@angular/material/slider';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-filter',

  imports: [CommonModule, FormsModule],
  templateUrl: './search-filter.component.html',
  styleUrl: './search-filter.component.scss'
})
export class SearchFilterComponent {
  priceRange: number | null = null;
  minPrice: number = 50;
  maxPrice: number = 1000;

constructor(private router: Router) {}


  applyFilter() {
    this.router.navigate([], {
      queryParams: {
        price: this.priceRange
      },
      queryParamsHandling: 'merge'
    });
  }
}
