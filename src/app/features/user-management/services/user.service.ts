import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserModel, CreateUserDto, UpdateUserDto } from '../models/user.model';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/users`;

  private usersSubject = new BehaviorSubject<UserModel[]>([]);
  public users$ = this.usersSubject.asObservable();

  getUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(this.baseUrl).pipe(
      tap(users => this.usersSubject.next(users)),
      catchError(this.handleError)
    );
  }

  getUserById(userId: string): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.baseUrl}/${userId}`).pipe(
      catchError(this.handleError)
    );
  }

  createUser(userData: CreateUserDto): Observable<UserModel> {
    return this.http.post<UserModel>(this.baseUrl, userData).pipe(
      tap(() => this.refreshUsers()),
      catchError(this.handleError)
    );
  }

  updateUser(userId: string, userData: UpdateUserDto): Observable<UserModel> {
    return this.http.put<UserModel>(`${this.baseUrl}/${userId}`, userData).pipe(
      tap(() => this.refreshUsers()),
      catchError(this.handleError)
    );
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/softDelete/${userId}`, {}).pipe(
      tap(() => this.refreshUsers()),
      catchError(this.handleError)
    );
  }

  deactivateUser(userId: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/deactivate/${userId}`, {}).pipe(
      tap(() => this.refreshUsers()),
      catchError(this.handleError)
    );
  }

  activateUser(userId: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/activate/${userId}`, {}).pipe(
      tap(() => this.refreshUsers()),
      catchError(this.handleError)
    );
  }

  private refreshUsers(): void {
    this.getUsers().subscribe();
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = 'Requête invalide. Vérifiez les données saisies.';
          break;
        case 401:
          errorMessage = 'Non autorisé. Veuillez vous reconnecter.';
          break;
        case 403:
          errorMessage = 'Accès interdit. Vous n\'avez pas les droits nécessaires.';
          break;
        case 404:
          errorMessage = 'Ressource non trouvée.';
          break;
        case 409:
          errorMessage = 'Conflit. Cette ressource existe déjà.';
          break;
        case 500:
          errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
          break;
        default:
          errorMessage = `Erreur ${error.status}: ${error.message}`;
      }
    }

    console.error('Erreur API:', error);
    return throwError(() => new Error(errorMessage));
  }
}
