import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../../../../shared/loader/loader.component';
import { EmployeeService } from '../../../../../services/admin/employee.service';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-manage-employees',
  imports: [CommonModule, LoaderComponent],
  templateUrl: './manage-employees.component.html',
  styleUrl: './manage-employees.component.scss'
})
export class ManageEmployeesComponent implements OnInit {

  employees: any[] = [];
  isLoading: boolean = true;

  constructor(
    private employeeService: EmployeeService,
    private toast: HotToastService
  ) { }

  ngOnInit() {
    this.fetchEmployees();
  }

  fetchEmployees() {
    this.isLoading = true;
    this.employeeService.getEmployees().subscribe({
      next: (data: any) => {
        this.employees = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error fetching employees', err);
        this.toast.error('Failed to load employees');
        this.isLoading = false;
      }
    });
  }

}
