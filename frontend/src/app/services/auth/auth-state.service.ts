import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';

export interface JwtPayload {
  username: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthState {
  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  private _userRole = new BehaviorSubject<string | null>(null);

  // Expose the authentication state as observables.
  isLoggedIn$ = this._isLoggedIn.asObservable();
  userRole$ = this._userRole.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.checkAuth();
  }

  // Checks localStorage for a token and updates the auth state.
  checkAuth(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        this._isLoggedIn.next(true);
        try {
          const decoded = jwtDecode<JwtPayload>(token);
          this._userRole.next(decoded.role);
        } catch (error) {
          console.error('Error decoding token:', error);
          this._isLoggedIn.next(false);
          this._userRole.next(null);
        }
      } else {
        this._isLoggedIn.next(false);
        this._userRole.next(null);
      }
    }
  }

  // Call this method when a user logs in.
  login(token: string, refreshToken: string): void {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    this._isLoggedIn.next(true);
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      this._userRole.next(decoded.role);
    } catch (error) {
      console.error('Error decoding token during login:', error);
      this._userRole.next(null);
    }
  }

  // Call this when a user logs out.
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this._isLoggedIn.next(false);
    this._userRole.next(null);
  }

  checkIfAdmin(): boolean {
    const role = this._userRole.getValue();
    return role === 'CTO' || role === 'Tech_Lead';
  }
}
