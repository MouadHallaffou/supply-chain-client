import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RoleModel, createRoleDto, updateRoleDto } from '../models/role.model';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/roles`;


  private rolesSubject = new BehaviorSubject<RoleModel[]>([]);
  public roles$ = this.rolesSubject.asObservable();

  /**
   * Récupère tous les rôles
   */
  getRoles(): Observable<RoleModel[]> {
    return this.http.get<RoleModel[]>(this.baseUrl).pipe(
      tap((roles: RoleModel[]) => this.rolesSubject.next(roles)),
      catchError(this.handleError)
    );
  }

  /**
   * Récupère un rôle par ID
   */
  getRoleById(id: number): Observable<RoleModel> {
    return this.http.get<RoleModel>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crée un nouveau rôle
   */
  createRole(roleData: createRoleDto): Observable<RoleModel> {
    return this.http.post<RoleModel>(this.baseUrl, roleData).pipe(
      tap(() => this.refreshRoles()),
      catchError(this.handleError)
    );
  }

  /**
   * Met à jour un rôle
   */
  updateRole(id: number, roleData: updateRoleDto): Observable<RoleModel> {
    return this.http.put<RoleModel>(`${this.baseUrl}/${id}`, roleData).pipe(
      tap(() => this.refreshRoles()),
      catchError(this.handleError)
    );
  }

  /**
   * Supprime un rôle
   */
  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => this.refreshRoles()),
      catchError(this.handleError)
    );
  }

  /**
   * Rafraîchit la liste des rôles
   */
  private refreshRoles(): void {
    this.getRoles().subscribe();
  }

  /**
   * Gestion des erreurs
   */
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
          errorMessage = 'Non autorisé.';
          break;
        case 403:
          errorMessage = 'Accès interdit.';
          break;
        case 404:
          errorMessage = 'Ressource non trouvée.';
          break;
        case 409:
          errorMessage = 'Ce rôle existe déjà.';
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
