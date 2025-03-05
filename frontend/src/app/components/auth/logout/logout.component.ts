import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';
import { AuthState } from '../../../services/auth/auth-state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  imports: [CommonModule],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css',
})
export class LogoutComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private authState: AuthState,
  ) {}

  ngOnInit(): void {
    this.authService.logout().subscribe({
      next: () => {
        // Clear tokens from localStorage
        this.authState.logout();
        // Redirect to the login page.
        this.router.navigate(['/login']).then(() => {
          console.log('Logged out and navigated to login.');
        });
      },
      error: (error) => {
        console.error('Logout failed', error);
        // Optionally clear tokens and redirect anyway.
        this.authState.logout();
        this.router.navigate(['/login']);
      },
    });
  }
}
