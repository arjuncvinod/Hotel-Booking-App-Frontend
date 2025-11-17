import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../../../../shared/modal/modal.component';

@Component({
  selector: 'app-manage-employees',
  imports: [CommonModule, ModalComponent],
  templateUrl: './manage-employees.component.html',
  styleUrl: './manage-employees.component.scss'
})
export class ManageEmployeesComponent {

  showFormModal = false;

}
