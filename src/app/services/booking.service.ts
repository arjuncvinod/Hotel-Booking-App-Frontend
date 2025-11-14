import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private http: HttpClient) { }


  createBooking(bookingData: any) {
    return this.http.post(`${environment.apiUrl}/booking`, bookingData);
  }


}
