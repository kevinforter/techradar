import { inject, PLATFORM_ID } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpEvent,
  HttpErrorResponse,
  HttpHandlerFn,
} from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

export const authInterceptorFn: HttpInterceptorFn = (
  req,
  next: HttpHandlerFn,
): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Only try to get tokens if running in the browser.
  let accessToken: string | null = null;
  let refreshToken: string | null = null;
  if (isPlatformBrowser(platformId)) {
    accessToken = localStorage.getItem('accessToken');
    refreshToken = localStorage.getItem('refreshToken');
  }

  const authReq = accessToken
    ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
    : req;

  return next(authReq).pipe(
    catchError((err) => {
      if (err instanceof HttpErrorResponse && err.status === 403) {
        // Handle token refresh logic.
        if (refreshToken) {
          return authService.refreshToken(refreshToken).pipe(
            switchMap((response: any) => {
              const newAccessToken = response.accessToken;
              const newRefreshToken =
                response.refreshToken?.token || refreshToken;
              if (isPlatformBrowser(platformId)) {
                localStorage.setItem('accessToken', newAccessToken);
                localStorage.setItem('refreshToken', newRefreshToken);
              }
              // Retry the original request with the new token.
              const newAuthReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newAccessToken}` },
              });
              return next(newAuthReq);
            }),
            catchError((refreshError) => {
              router.navigate(['/login']);
              return throwError(() => refreshError);
            }),
          );
        } else {
          router.navigate(['/login']);
          return throwError(() => err);
        }
      }
      return throwError(() => err);
    }),
  );
};
