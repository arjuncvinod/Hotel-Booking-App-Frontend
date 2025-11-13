import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hotel-card',
  imports: [CommonModule],
  templateUrl: './hotel-card.component.html',
  styleUrl: './hotel-card.component.scss'
})
export class HotelCardComponent {
    @Input() name= 'The Manhattan View';
    @Input() image= 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop';
    @Input() rating= 4;
    @Input() score= 5
    @Input() location= 'Times Square, New York';
    @Input() amenities= ['wifi', 'pool', 'restaurant', 'parking', 'gym'];
    @Input() price= 350;

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
}


