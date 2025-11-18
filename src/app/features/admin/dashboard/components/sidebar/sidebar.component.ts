import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from "@angular/router";
import { AuthService } from '../../../../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  constructor(private authService: AuthService, private router: Router) { }

  logout() {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}
