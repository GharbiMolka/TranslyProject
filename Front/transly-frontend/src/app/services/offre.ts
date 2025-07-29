import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Offre {
  idOffre: number;
  prixPropose: number;
  delaiLivraison: number;
  statut: string;
  dateOffre: string;
  id_Demande: number;
  id_User: number;
}

@Injectable({
  providedIn: 'root'
})
export class OffreService {

  private apiUrl = 'https://localhost:7267/api/OffreApi';

  constructor(private http: HttpClient) {}

  //GET: Toutes les offres
  getAll(): Observable<Offre[]> {
    return this.http.get<Offre[]>(this.apiUrl);
  }

  // GET: Une offre par ID
  getById(id: number): Observable<Offre> {
    return this.http.get<Offre>(`${this.apiUrl}/${id}`);
  }

  // POST: Ajouter une offre 
  create(offre: Omit<Offre, 'idOffre' | 'dateOffre' | 'id_User'>): Observable<any> {
    return this.http.post(this.apiUrl, offre);
  }

  //  PUT: Modifier une offre (réservée au propriétaire)
  update(id: number, offre: Offre): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, offre);
  }

  // DELETE: Supprimer une offre
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // GET: Offres de l'utilisateur connecté
 getByConnectedUser(): Observable<Offre[]> {
  return this.http.get<Offre[]>(`${this.apiUrl}/Transporteur`);
}


// Accepter ou refuser une offre sur une demande 
updateStatut(idOffre: number, statut: string): Observable<any> {
  return this.http.patch(`${this.apiUrl}/${idOffre}/statut`, JSON.stringify(statut), {
    headers: { 'Content-Type': 'application/json' }
  });
}


}
