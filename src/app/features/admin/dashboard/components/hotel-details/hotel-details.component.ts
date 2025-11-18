import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HotelService } from './../../../../../services/admin/hotel.service';
import { ModalComponent } from '../../../../../shared/modal/modal.component';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-hotel-details',
  imports: [CommonModule, DecimalPipe, ReactiveFormsModule, ModalComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './hotel-details.component.html',
  styleUrl: './hotel-details.component.scss'
})
export class HotelDetailsComponent implements OnInit {

  hotel: any = null;
  hotelId: number = 0;
  isLoading: boolean = true;
  showAddRoomModal: boolean = false;
  showEditRoomModal: boolean = false;
  showDeleteRoomModal: boolean = false;
  roomTypes: any[] = [];
  isAddingRoom: boolean = false;
  isEditingRoom: boolean = false;
  isDeleteMode: boolean = false;
  selectedRoomId: number | null = null;
  selectedRoomNumber: string = '';

  roomForm!: FormGroup;

  constructor(
    private hotelService: HotelService,
    private route: ActivatedRoute,
    private toast: HotToastService,
    private fb: FormBuilder
  ) {
    this.initializeForm();
  }

  initializeForm() {
    this.roomForm = this.fb.group({
      roomNumber: ['', [Validators.required, Validators.minLength(1)]],
      roomTypeId: ['', Validators.required],
      status: [0, Validators.required],
      pricePerNight: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.hotelId = parseInt(id, 10);
        this.fetchHotelDetails();
        this.fetchRoomTypes();
      }
    });
  }

  fetchHotelDetails() {
    this.isLoading = true;
    this.hotelService.getHotelById(this.hotelId).subscribe({
      next: (data: any) => {
        this.hotel = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error fetching hotel details', err);
        this.toast.error('Failed to load hotel details');
        this.isLoading = false;
      }
    });
  }

  fetchRoomTypes() {
    this.hotelService.getRoomTypes().subscribe({
      next: (data: any) => {
        this.roomTypes = data;
      },
      error: (err: any) => {
        console.error('Error fetching room types', err);
        this.toast.error('Failed to load room types');
      }
    });
  }

  // Add Room Methods
  openAddRoomModal() {
    this.roomForm.reset({ status: 0 });
    this.showAddRoomModal = true;
  }

  closeAddRoomModal() {
    this.showAddRoomModal = false;
  }

  addRoom() {
    if (this.roomForm.invalid) {
      this.toast.error('Please fill all required fields correctly');
      return;
    }

    this.isAddingRoom = true;
    const formValue = this.roomForm.value;
    const roomData = {
      roomNumber: formValue.roomNumber,
      hotelId: this.hotelId,
      roomTypeId: formValue.roomTypeId,
      status: Number(formValue.status),
      pricePerNight: formValue.pricePerNight
    };

    console.log('Sending room data:', roomData);
    this.hotelService.addRoom(roomData).subscribe({
      next: () => {
        this.toast.success('Room added successfully');
        this.closeAddRoomModal();
        this.fetchHotelDetails();
        this.isAddingRoom = false;
      },
      error: (err: any) => {
        console.error('Error adding room', err);
        console.error('Error response:', err.error);
        const errorMsg = err.error?.message || err.error || 'Failed to add room';
        this.toast.error(errorMsg);
        this.isAddingRoom = false;
      }
    });
  }

  // Edit Room Methods
  openEditRoomModal(room: any) {
    this.selectedRoomId = room.id;
    this.roomForm.patchValue({
      roomNumber: room.roomNumber,
      roomTypeId: room.roomTypeId,
      status: room.status,
      pricePerNight: room.pricePerNight
    });
    this.showEditRoomModal = true;
  }

  closeEditRoomModal() {
    this.showEditRoomModal = false;
    this.selectedRoomId = null;
  }

  updateRoom() {
    if (this.roomForm.invalid) {
      this.toast.error('Please fill all required fields correctly');
      return;
    }

    this.isEditingRoom = true;
    const formValue = this.roomForm.value;
    const roomData = {
      roomNumber: formValue.roomNumber,
      hotelId: this.hotelId,
      roomTypeId: formValue.roomTypeId,
      status: Number(formValue.status),
      pricePerNight: formValue.pricePerNight
    };

    console.log('Updating room data:', roomData);
    this.hotelService.updateRoom(this.selectedRoomId!, roomData).subscribe({
      next: () => {
        this.toast.success('Room updated successfully');
        this.closeEditRoomModal();
        this.fetchHotelDetails();
        this.isEditingRoom = false;
      },
      error: (err: any) => {
        console.error('Error updating room', err);
        const errorMsg = err.error?.message || err.error || 'Failed to update room';
        this.toast.error(errorMsg);
        this.isEditingRoom = false;
      }
    });
  }

  // Delete Room Methods
  openDeleteRoomModal(room: any) {
    this.selectedRoomId = room.id;
    this.selectedRoomNumber = room.roomNumber;
    this.showDeleteRoomModal = true;
  }

  closeDeleteRoomModal() {
    this.showDeleteRoomModal = false;
    this.selectedRoomId = null;
    this.selectedRoomNumber = '';
  }

  deleteRoom() {
    this.isDeleteMode = true;
    this.hotelService.deleteRoom(this.selectedRoomId!).subscribe({
      next: () => {
        this.toast.success('Room deleted successfully');
        this.closeDeleteRoomModal();
        this.fetchHotelDetails();
        this.isDeleteMode = false;
      },
      error: (err: any) => {
        console.error('Error deleting room', err);
        const errorMsg = err.error?.message || err.error || 'Failed to delete room';
        this.toast.error(errorMsg);
        this.isDeleteMode = false;
      }
    });
  }

}
