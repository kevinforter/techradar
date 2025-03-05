import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient) {}

  register(user: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/register`, user)
      .pipe(catchError(this.handleError<any>('register')));
  }

  login(credentials: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/login`, credentials)
      .pipe(catchError(this.handleError<any>('login')));
  }

  logout(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http
      .delete(`${this.apiUrl}/logout`, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        body: { token: refreshToken },
      })
      .pipe(catchError(this.handleError<any>('logout')));
  }

  refreshToken(refreshToken: string): Observable<any> {
    return this.http
      .post(
        `${this.apiUrl}/token`,
        { token: refreshToken },
        { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) },
      )
      .pipe(catchError(this.handleError<any>('refreshToken')));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
