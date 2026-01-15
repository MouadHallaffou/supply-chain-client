import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Fournisseur, FournisseurCreateDto, FournisseurUpdateDto } from '../models/fournisseur';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FournisseurService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/fournisseurs`;

  // GET - Récupérer tous les fournisseurs
  getAll(): Observable<Fournisseur[]> {
    return this.http.get<Fournisseur[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // GET - Récupérer un fournisseur par ID
  getById(id: number): Observable<Fournisseur> {
    return this.http.get<Fournisseur>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // POST - Créer un nouveau fournisseur
  create(fournisseur: FournisseurCreateDto): Observable<Fournisseur> {
    return this.http.post<Fournisseur>(this.apiUrl, fournisseur).pipe(
      catchError(this.handleError)
    );
  }

  // PUT - Mettre à jour un fournisseur
  update(id: number, fournisseur: FournisseurUpdateDto): Observable<Fournisseur> {
    return this.http.put<Fournisseur>(`${this.apiUrl}/${id}`, fournisseur).pipe(
      catchError(this.handleError)
    );
  }

  // DELETE - Supprimer un fournisseur
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // GET - Rechercher par nom
  searchByName(name: string): Observable<Fournisseur[]> {
    const params = new HttpParams().set('name', name);
    return this.http.get<Fournisseur[]>(`${this.apiUrl}/search`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Gestion des erreurs HTTP
   */
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
          errorMessage = 'Fournisseur non trouvé.';
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
