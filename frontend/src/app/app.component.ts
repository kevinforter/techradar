import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthState } from './services/auth/auth-state.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  isAdmin$: Observable<boolean>;

  constructor(private authState: AuthState) {
    // The login state is available directly.
    this.isLoggedIn$ = this.authState.isLoggedIn$;
    // Determine if the user is admin based on the role.
    this.isAdmin$ = this.authState.userRole$.pipe(
      map((role) => role === 'CTO' || role === 'Tech_Lead'),
    );
  }

  ngOnInit(): void {
    // Update the authentication state on app initialization.
    this.authState.checkAuth();
  }
}
