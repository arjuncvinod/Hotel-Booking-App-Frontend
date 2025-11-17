import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-user-login',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.scss'
})
export class UserLoginComponent {

  email = '';
  password = '';
  error = '';

  constructor(
    private auth: AuthService, 
    private router: Router,
    private location: Location,
    private toast: HotToastService
  ) {}

  login() {
    this.error = '';

    if (!this.email || !this.password) {
      this.toast.warning('Please enter both email and password');
      return;
    }

    const loadingToast = this.toast.loading('Logging in...', {
      duration: 30000 
    });

    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        loadingToast.close(); 
        this.toast.success('Login successful!');
        setTimeout(() => {
          this.location.back();
        }, 500);
      },
      error: (err) => {
        loadingToast.close(); 
        this.error = 'Invalid credentials';
        this.toast.error('Invalid email or password');
      }
    });
  }
}
