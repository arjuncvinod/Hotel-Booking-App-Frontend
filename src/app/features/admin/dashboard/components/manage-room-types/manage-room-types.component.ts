import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoomTypeService } from '../../../../../services/admin/room-type.service';
import { ModalComponent } from '../../../../../shared/modal/modal.component';
import { LoaderComponent } from '../../../../../shared/loader/loader.component';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-manage-room-types',
  imports: [CommonModule, FormsModule, ModalComponent, LoaderComponent],
  templateUrl: './manage-room-types.component.html',
  styleUrl: './manage-room-types.component.scss'
})
export class ManageRoomTypesComponent implements OnInit {

  roomTypes: any[] = [];
  isLoading = true;
  showAddModal = false;
  showEditModal = false;
  showDeleteModal = false;
  selectedRoomTypeId: number | null = null;
  selectedRoomTypeName: string = '';

  roomTypeForm = {
    typeName: '',
    description: '',
    capacity: 1
  };

  constructor(private roomTypeService: RoomTypeService, private toast: HotToastService) { }

  ngOnInit() {
    this.fetchRoomTypes();
  }

  fetchRoomTypes() {
    this.isLoading = true;
    this.roomTypeService.getRoomTypes().subscribe({
      next: (data: any) => {
        this.roomTypes = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error fetching room types', err);
        this.toast.error('Failed to load room types');
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

  openEditModal(roomType: any) {
    this.selectedRoomTypeId = roomType.id;
    this.roomTypeForm = {
      typeName: roomType.typeName,
      description: roomType.description,
      capacity: roomType.capacity
    };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedRoomTypeId = null;
    this.resetForm();
  }

  openDeleteModal(roomType: any) {
    this.selectedRoomTypeId = roomType.id;
    this.selectedRoomTypeName = roomType.typeName;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedRoomTypeId = null;
    this.selectedRoomTypeName = '';
  }

  confirmDelete() {
    if (this.selectedRoomTypeId !== null) {
      this.deleteRoomType(this.selectedRoomTypeId);
    }
  }

  resetForm() {
    this.roomTypeForm = {
      typeName: '',
      description: '',
      capacity: 1
    };
  }

  onSubmit() {
    if (!this.roomTypeForm.typeName || !this.roomTypeForm.description || this.roomTypeForm.capacity < 1) {
      this.toast.warning('Please fill in all fields with valid values');
      return;
    }

    if (this.showEditModal && this.selectedRoomTypeId !== null) {
      this.updateRoomType(this.selectedRoomTypeId);
    } else {
      this.addRoomType();
    }
  }

  addRoomType() {
    this.roomTypeService.addRoomType(this.roomTypeForm).subscribe({
      next: (data: any) => {
        console.log('Room type added:', data);
        this.fetchRoomTypes();
        this.closeAddModal();
        this.toast.success('Room type added successfully!');
      },
      error: (err: any) => {
        console.error('Error adding room type', err);
        this.toast.error('Failed to add room type');
      }
    });
  }

  updateRoomType(id: number) {
    this.roomTypeService.updateRoomType(id, this.roomTypeForm).subscribe({
      next: (data: any) => {
        console.log('Room type updated:', data);
        this.closeEditModal();
        this.toast.success('Room type updated successfully!');
        this.fetchRoomTypes();
      },
      error: (err: any) => {
        console.error('Error updating room type', err);
        this.toast.error('Failed to update room type');
      }
    });
  }

  deleteRoomType(id: number) {
    this.roomTypeService.deleteRoomType(id).subscribe({
      next: () => {
        console.log('Room type deleted');
        this.fetchRoomTypes();
        this.closeDeleteModal();
        this.toast.success('Room type deleted successfully!');
      },
      error: (err: any) => {
        console.error('Error deleting room type', err);
        this.toast.error('Failed to delete room type');
        this.closeDeleteModal();
      }
    });
  }

}
