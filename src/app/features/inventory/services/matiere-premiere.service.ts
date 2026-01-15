import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { MatierePremiere, MatierePremiereCreateDto, MatierePremiereUpdateDto } from '../models/matiere-premiere';

@Injectable({
  providedIn: 'root'
})
export class MatierePremiereService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/matieres-premieres`;

  getAll(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}&size=${size}`);
  }

  getById(id: number): Observable<MatierePremiere> {
    return this.http.get<MatierePremiere>(`${this.apiUrl}/${id}`);
  }

  create(matierePremiere: MatierePremiereCreateDto): Observable<MatierePremiere> {
    return this.http.post<MatierePremiere>(this.apiUrl, matierePremiere);
  }

  update(id: number, matierePremiere: MatierePremiereUpdateDto): Observable<MatierePremiere> {
    return this.http.put<MatierePremiere>(`${this.apiUrl}/${id}`, matierePremiere);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  filterByStockCritique(stockCritique: number, page: number = 0, size: number = 5): Observable<any> {
    return this.http.get(`${this.apiUrl}/filtrer-par-stock-critique?stockCritique=${stockCritique}&page=${page}&size=${size}`);
  }
}
