import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  username: string;
  role: string;
}

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  //const token = localStorage.getItem('accessToken');
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!token) {
    router.navigate(['/login']);
    return false;
  }
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (decoded.role === 'CTO' || decoded.role === 'Tech_Lead') {
      return true;
    } else {
      router.navigate(['/login']);
      return false;
    }
  } catch (error) {
    console.error('Error decoding token:', error);
    router.navigate(['/login']);
    return false;
  }
};
