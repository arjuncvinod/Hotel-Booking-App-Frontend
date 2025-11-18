import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../../../../shared/loader/loader.component';
import { CustomerService } from '../../../../../services/admin/customer.service';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-manage-customers',
  imports: [CommonModule, LoaderComponent],
  templateUrl: './manage-customers.component.html',
  styleUrl: './manage-customers.component.scss'
})
export class ManageCustomersComponent implements OnInit {

  customers: any[] = [];
  isLoading: boolean = true;

  constructor(
    private customerService: CustomerService,
    private toast: HotToastService
  ) { }

  ngOnInit() {
    this.fetchCustomers();
  }

  fetchCustomers() {
    this.isLoading = true;
    this.customerService.getCustomers().subscribe({
      next: (data: any) => {
        this.customers = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error fetching customers', err);
        this.toast.error('Failed to load customers');
        this.isLoading = false;
      }
    });
  }

}
