import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HotelService {

  constructor(private http: HttpClient) { }

  getHotels(): any {
    return this.http.get(`${environment.apiUrl}/hotel`); 
  }

  addHotel(hotelData: any): any {
    return this.http.post(`${environment.apiUrl}/hotel`, hotelData); 
  }

  updateHotel(hotelId: string, hotelData: any): any {
    return this.http.put(`${environment.apiUrl}/hotel/${hotelId}`, hotelData); 
  }

  deleteHotel(hotelId: string): any {
    return this.http.delete(`${environment.apiUrl}/hotel/${hotelId}`); 
  }

  getHotelById(hotelId: number): any {
    return this.http.get(`${environment.apiUrl}/hotel/${hotelId}`); 
  }


  addRoom(roomData: any): any {
    return this.http.post(`${environment.apiUrl}/room`, roomData); 
  }

  getRoomTypes(): any {
    return this.http.get(`${environment.apiUrl}/RoomType`); 
  }

  updateRoom(roomId: number, roomData: any): any {
    return this.http.put(`${environment.apiUrl}/room/${roomId}`, roomData); 
  }

  deleteRoom(roomId: number): any {
    return this.http.delete(`${environment.apiUrl}/room/${roomId}`); 
  }

  


}
