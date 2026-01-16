import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MatierePremiereService {

  private readonly apiUrl = `${environment.apiUrl}/matieres-premieres`;
  private readonly http = inject(HttpClient);

  getAll(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}&size=${size}`).pipe(
      catchError(this.handleError)
    );
  }

  getByFournisseurId(fournisseurId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/by-fournisseur/${fournisseurId}`).pipe(
      catchError(this.handleError)
    );
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  create(matiere: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, matiere).pipe(
      catchError(this.handleError)
    );
  }

  update(id: number, matiere: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, matiere).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  filterByStockCritique(stockCritique: number, page: number = 0, size: number = 5): Observable<any> {
    return this.http.get(`${this.apiUrl}/filtrer-par-stock-critique?stockCritique=${stockCritique}&page=${page}&size=${size}`);
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Une erreur inconnue est survenue';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur côté client: ${error.error.message}`;
    } else {
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
        case 500:
          errorMessage = 'Erreur interne du serveur';
          break;
        default:
          errorMessage = `Erreur serveur: ${error.message}`;
      }
    }
    console.error('Erreur HTTP:', error);
    return new Observable(observer => {
      observer.error(new Error(errorMessage));
    });
  }
}
