import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  email = '';
  password = '';
  error = '';

  constructor(
    private auth: AuthService, 
    private router: Router,
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
          this.router.navigate(['/admin/dashboard']);
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
