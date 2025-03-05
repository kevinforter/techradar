import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TechService {
  private apiUrl = 'http://localhost:3000/api/v1/tech';

  constructor(private http: HttpClient) {}

  getAllTech(): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/`)
      .pipe(catchError(this.handleError<any>('getAllTech')));
  }

  getTech(_id: string): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/${_id}`)
      .pipe(catchError(this.handleError<any>('getTech')));
  }

  addTech(data: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/`, data, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(catchError(this.handleError<any>('addTech')));
  }

  updateTech(_id: string, data: any): Observable<any> {
    return this.http
      .put(`${this.apiUrl}/${_id}`, data, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(catchError(this.handleError<any>('updateTech')));
  }

  publishTech(_id: string, data: any): Observable<any> {
    console.log(data);
    return this.http
      .put(`${this.apiUrl}/publish/${_id}`, data, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(catchError(this.handleError<any>('publishedTech')));
  }

  deleteTech(_id: string): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/${_id}`, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(catchError(this.handleError<any>('deleteTech')));
  }

  deleteMultipleTech(data: any): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/`, { body: { ids: data } })
      .pipe(catchError(this.handleError<any>('deleteMultipleTech')));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
