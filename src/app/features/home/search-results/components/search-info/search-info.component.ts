import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search-info',
  imports: [CommonModule, FormsModule],
  templateUrl: './search-info.component.html',
  styleUrl: './search-info.component.scss'
})
export class SearchInfoComponent {

  location: string | null = '';
  checkIn: string | null = '';
  checkOut: string | null = '';


isEditing = signal(false);

  toggleEdit() {
    if (this.isEditing()) {
      // Apply changes - navigate with updated query params
      this.navigate();
    }
    this.isEditing.update(value => !value);
  }

  constructor(private route: ActivatedRoute,private router: Router) {}


  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.location = params.get('location');
      this.checkIn = params.get('checkIn');
      this.checkOut = params.get('checkOut');
    });
  }

  navigate() {
   this.router.navigate(['search'], {
      queryParams: {
        location: this.location,
        checkIn: this.checkIn,
        checkOut: this.checkOut
      }
    });
  }


}
