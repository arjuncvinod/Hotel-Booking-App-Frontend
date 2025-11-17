import { Component, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { Location } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;

  constructor(
    private authService: AuthService,
    private toast: HotToastService,
    private location: Location
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe(() => {
      this.isLoggedIn = this.authService.isLoggedIn();
    });
  }

  logout() {
    this.authService.logout();
    this.toast.success('Logged out successfully!');
  }
}
