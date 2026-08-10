import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { ConfirmModal } from '../confirm-modal/confirm-modal';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, ConfirmModal],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

  showLogoutModal = false;

  constructor(private router: Router, private authService: AuthService) {}

  logout(): void {
    this.showLogoutModal = true;
  }

  confirmLogout(): void {
    this.showLogoutModal = false;
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}