import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DemandeLivraison {
  id:number;
 id_Commande: number;
  id_User: number;
  adresseEnlevement: string;
  adresseLivraison: string;
  dateSouhaitee: string; 
  statut: string;
}
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
export class DemandeService {

  private apiUrl = 'https://localhost:7267/api/DemandeApi';

  constructor(private http: HttpClient) {}

  getAll(): Observable<DemandeLivraison[]> {
    return this.http.get<DemandeLivraison[]>(this.apiUrl);
  }

  getById(id: number): Observable<DemandeLivraison> {
    return this.http.get<DemandeLivraison>(`${this.apiUrl}/${id}`);
  }

  create(demande: Omit<DemandeLivraison, 'id' | 'dateDemande'>): Observable<any> {
  return this.http.post(this.apiUrl, demande);
}

  update(id: number, demande: DemandeLivraison): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, demande);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

 getByConnectedUser(): Observable<DemandeLivraison[]> {
  return this.http.get<DemandeLivraison[]>(`${this.apiUrl}/user`);
}

getOffresPourDemande(idDemande: number): Observable<Offre[]> {
  return this.http.get<Offre[]>(`${this.apiUrl}/${idDemande}/offres`);
}
}
