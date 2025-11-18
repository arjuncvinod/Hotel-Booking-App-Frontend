import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoomTypeService {

  constructor(private http: HttpClient) { }

  getRoomTypes(): any {
    return this.http.get(`${environment.apiUrl}/RoomType`); 
  }

  updateRoomType(roomTypeId: number, roomTypeData: any): any {
    return this.http.put(`${environment.apiUrl}/RoomType/${roomTypeId}`, roomTypeData); 
  }

  deleteRoomType(roomTypeId: number): any {
    return this.http.delete(`${environment.apiUrl}/RoomType/${roomTypeId}`);
  }

  addRoomType(roomTypeData: any): any {
    return this.http.post(`${environment.apiUrl}/RoomType`, roomTypeData); 
  }

}
