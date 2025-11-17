import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-hero',
  imports: [CommonModule, FormsModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
  location = '';
  checkIn = '';
  checkOut = '';

  constructor(private router: Router, private toast: HotToastService) {}

  popularDestinations = [
    { name: 'Paris', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop' },
    { name: 'Tokyo', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop' },
    { name: 'Santorini', image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&h=300&fit=crop' },
    { name: 'New York', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop' },
    { name: 'Sydney', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&h=300&fit=crop' },
    { name: 'Rome', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop' }
  ];

  searchHotels() {

    if (!this.location || !this.checkIn || !this.checkOut) {
      this.toast.warning('Please fill in all search fields.');
      return;
    }
    if(this.checkIn > this.checkOut){
        this.toast.warning('Check-in date cannot be later than check-out date.');
        return;
    }

    this.router.navigate(['/search'], { queryParams: {
        location: this.location,
        checkIn: this.checkIn,
        checkOut: this.checkOut
      }
    });
  }
}
