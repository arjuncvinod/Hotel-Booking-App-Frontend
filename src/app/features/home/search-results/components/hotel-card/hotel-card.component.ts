import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hotel-card',
  imports: [CommonModule],
  templateUrl: './hotel-card.component.html',
  styleUrl: './hotel-card.component.scss'
})
export class HotelCardComponent {
    @Input() id= 0;
    @Input() name= '';
    @Input() image= 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop';
    @Input() rating= 0;
    @Input() score= 5;
    @Input() location= '';
    @Input() amenities= ['wifi', 'pool', 'restaurant', 'parking', 'gym'];
    @Input() price= 350;

    checkIn= '';
    checkOut= '';

    constructor(private router: Router) {}

    get stars(): number[] {
        return Array(this.rating).fill(0);
    }

    get scoreText(): string {
        if (this.score >= 4.5) return 'Excellent';
        if (this.score >= 4.0) return 'Very Good';
        if (this.score >= 3.5) return 'Good';
        if (this.score >= 3.0) return 'Fair';
        if (this.score >= 2.0) return 'Average';
        return 'Poor';
    }

    get scoreColor(): string {
        return this.scoreText.toLowerCase().replace(' ', '-');
    }

    ngOnInit() {
      this.router.routerState.root.queryParamMap.subscribe(params => {
        this.checkIn = params.get('checkIn') || '';
        this.checkOut = params.get('checkOut') || '';

      });
    }

    navigate() {
        this.router.navigate(['/hotel'], { queryParams: { id: this.id, checkIn: this.checkIn, checkOut: this.checkOut, location: this.location } });
    }
}


