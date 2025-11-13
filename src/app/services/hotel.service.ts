import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HotelService {

  constructor(private http: HttpClient) { }

  getAvailableRooms(location: string, checkIn: string, checkOut: string, sort: string,price: string): Observable<any> {
    const params = new HttpParams()
      .set('location', location)
      .set('checkInDate', checkIn)
      .set('checkOutDate', checkOut)
      .set('price', price)
      .set('sort',sort );;




    return this.http.get(`${environment.apiUrl}/hotel/available-rooms`, { params });
  }
}
