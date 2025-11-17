import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HotelService } from '../../../../../services/admin/hotel.service';
import { ModalComponent } from '../../../../../shared/modal/modal.component';
import { LoaderComponent } from '../../../../../shared/loader/loader.component';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-manage-hotels',
  imports: [CommonModule, FormsModule, ModalComponent,LoaderComponent],
  templateUrl: './manage-hotels.component.html',
  styleUrl: './manage-hotels.component.scss'
})
export class ManageHotelsComponent implements OnInit {

  hotels: any[] = [];
  isLoading = true;
  showAddModal = false;
  showEditModal = false;
  showDeleteModal = false;
  selectedHotelId: number | null = null;
  selectedHotelName: string = '';

  hotelForm = {
    name: '',
    address: '',
    city: '',
    country: '',
    phoneNumber: ''
  };

  constructor(private hotelService: HotelService,private toast: HotToastService) { }

  ngOnInit() {
    this.hotelService.getHotels().subscribe({
      next: (data: any) => {
        this.hotels = data;
        this.isLoading = false;
        console.log('Hotels fetched:', this.hotels);
      },
      error: (err: any) => {
        console.error('Error fetching hotels', err);
        this.toast.error('Failed to load hotels');
        this.isLoading = false;
      }
    });
  }

  openAddModal() {
    this.showAddModal = true;
    this.resetForm();
  }

  closeAddModal() {
    this.showAddModal = false;
    this.resetForm();
  }

  openEditModal(hotel: any) {
    this.selectedHotelId = hotel.id;
    this.hotelForm = {
      name: hotel.name,
      address: hotel.address,
      city: hotel.city,
      country: hotel.country,
      phoneNumber: hotel.phoneNumber
    };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedHotelId = null;
    this.resetForm();
  }

  openDeleteModal(hotel: any) {
    this.selectedHotelId = hotel.id;
    this.selectedHotelName = hotel.name;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedHotelId = null;
    this.selectedHotelName = '';
  }

  confirmDelete() {
    if (this.selectedHotelId !== null) {
      this.deleteHotel(this.selectedHotelId);
    }
  }

  resetForm() {
    this.hotelForm = {
      name: '',
      address: '',
      city: '',
      country: '',
      phoneNumber: ''
    };
  }

  onSubmit() {
    if (!this.hotelForm.name || !this.hotelForm.address || !this.hotelForm.city || 
        !this.hotelForm.country || !this.hotelForm.phoneNumber) {
      this.toast.warning('Please fill in all fields');
      return;
    }

    if (this.showEditModal && this.selectedHotelId !== null) {
      this.updateHotel(
        this.selectedHotelId,
        this.hotelForm.name,
        this.hotelForm.address,
        this.hotelForm.city,
        this.hotelForm.country,
        this.hotelForm.phoneNumber
      );
    } else {
      this.addHotel(
        this.hotelForm.name,
        this.hotelForm.address,
        this.hotelForm.city,
        this.hotelForm.country,
        this.hotelForm.phoneNumber
      );
    }
  }

  addHotel(name: string, address: string, city: string, country: string, phoneNumber: string) { 
    const newHotel = {
      name: name,
      address: address,
      city: city,
      country: country,
      phoneNumber: phoneNumber
    };
    this.hotelService.addHotel(newHotel).subscribe({
      next: (data: any) => {
        console.log('Hotel added:', data);
        this.hotels.push(data);
        this.closeAddModal();
        this.toast.success('Hotel added successfully!');
      },
      error: (err: any) => {
        console.error('Error adding hotel', err);
        this.toast.error('Failed to add hotel');
      }
    });
  }

  updateHotel(id: number, name: string, address: string, city: string, country: string, phoneNumber: string) {
    const updatedHotel = {
      name: name,
      address: address,
      city: city,
      country: country,
      phoneNumber: phoneNumber
    };
    this.hotelService.updateHotel(id.toString(), updatedHotel).subscribe({
      next: (data: any) => {
        console.log('Hotel updated:', data);
        this.closeEditModal();
        this.toast.success('Hotel updated successfully!');
        this.ngOnInit();
      },
      error: (err: any) => {
        console.error('Error updating hotel', err);
        this.toast.error('Failed to update hotel');
      }
    });
  }

  deleteHotel(id: number) {
    this.hotelService.deleteHotel(id.toString()).subscribe({
      next: () => {
        console.log('Hotel deleted');
        this.ngOnInit();
        this.closeDeleteModal();
        this.toast.success('Hotel deleted successfully!');
      },
      error: (err: any) => {
        console.error('Error deleting hotel', err);
        this.toast.error('Failed to delete hotel');
        this.closeDeleteModal();
      }
    });
  }
}