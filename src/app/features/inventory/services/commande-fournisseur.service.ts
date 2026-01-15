import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommandeFournisseurService {

  private readonly apiUrl = `${environment.apiUrl}/commande-fournisseurs`;
  private readonly http = inject(HttpClient);

  getAll(page: number = 0, size: number = 10) {
    return this.http.get<any>(`${this.apiUrl}?page=${page}&size=${size}`).pipe(
      catchError(this.handleError)
    );
  }

  create(commande: any) {
    return this.http.post<any>(this.apiUrl, commande).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: number) {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  handleError(error: any) {
    let errorMessage = 'Une erreur inconnue est survenue';
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur côté client: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      switch (error.status) {
        case 400:
          errorMessage = 'Requête invalide';
          break;
        case 401:
          errorMessage = 'Non autorisé';
          break;
        case 403:
          errorMessage = 'Accès refusé';
          break;
        case 404:
          errorMessage = 'Ressource non trouvée';
          break;
        case 409:
          errorMessage = 'Conflit de données';
          break;
        case 500:
          errorMessage = 'Erreur interne du serveur';
          break;
        default:
          errorMessage = `Erreur serveur: ${error.message}`;
      }
    }
    console.error('Erreur HTTP:', error);
    return throwError(() => new Error(errorMessage));
  }


}
