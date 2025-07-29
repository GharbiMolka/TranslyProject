import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CommandeCreateDto {
  dateCommande: Date;
  adresse: string;
  gouvernorat: string;
  ville: string;
  statut?: string;    
  description: string;  
  user?: {
    nom: string;
    prenom: string;
    email?: string;
  };
}

export interface Commande extends CommandeCreateDto {
  id_Com: number;
  dateCommande: Date;
  id_User: number;
}



@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private apiUrl = 'https://localhost:7267/api/CommandeApi';

  constructor(private http: HttpClient) {}

  createCommande(dto: CommandeCreateDto): Observable<any> {
    return this.http.post(this.apiUrl, dto);
  }

   // Récupérer toutes les commandes du client connecté
  getCommandesPourClient(): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${this.apiUrl}/client/commandes`);
  }

  // Récupérer une commande par ID
  getCommandeById(id: number): Observable<Commande> {
    return this.http.get<Commande>(`${this.apiUrl}/${id}`);
  }

  // Modifier une commande
  updateCommande(id: number, dto: CommandeCreateDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, dto);
  }

  // Supprimer une commande
  deleteCommande(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Récupérer toutes les commandes 
getAllCommandes(): Observable<Commande[]> {
  return this.http.get<Commande[]>(`${this.apiUrl}/all`);
}
// Changer le statut d'une commande 
changerStatutCommande(id: number, nouveauStatut: string) {
  return this.http.patch(`${this.apiUrl}/${id}/changer-statut?nouveauStatut=${nouveauStatut}`, null);
}


}
