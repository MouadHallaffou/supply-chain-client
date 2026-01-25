import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FournisseurModel, FournisseurCreateDto, FournisseurUpdateDto } from '../models/fournisseur.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FournisseurService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/fournisseurs`;

  getAll(): Observable<FournisseurModel[]> {
    return this.http.get<FournisseurModel[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getById(id: number): Observable<FournisseurModel> {
    return this.http.get<FournisseurModel>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  create(fournisseur: FournisseurCreateDto): Observable<FournisseurModel> {
    return this.http.post<FournisseurModel>(this.apiUrl, fournisseur).pipe(
      catchError(this.handleError)
    );
  }

  update(id: number, fournisseur: FournisseurUpdateDto): Observable<FournisseurModel> {
    return this.http.put<FournisseurModel>(`${this.apiUrl}/${id}`, fournisseur).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  searchByName(name: string): Observable<FournisseurModel[]> {
    const params = new HttpParams().set('name', name);
    return this.http.get<FournisseurModel[]>(`${this.apiUrl}/search`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      switch (error.status) {
        case 400:
          errorMessage = 'Requête invalide. Vérifiez les données saisies.';
          break;
        case 401:
          errorMessage = 'Non autorisé. Veuillez vous authentifier.';
          break;
        case 403:
          errorMessage = 'Accès interdit.';
          break;
        case 404:
          errorMessage = 'FournisseurModel non trouvé.';
          break;
        case 409:
          errorMessage = 'Ce fournisseur existe déjà.';
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
