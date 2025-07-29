import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <== Import ici
import { DemandeService, DemandeLivraison } from '../../services/demande';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-demande-transporteur',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list-demande-transporteur.html',
  styleUrls: ['./list-demande-transporteur.css']
})
export class ListDemandeTransporteur implements OnInit {
  demandes: DemandeLivraison[] = [];
  errorMessage: string = '';
  searchTerm: string = '';
  selectedStatut: string = '';
  selectedDate: string = '';
 

  constructor(
    private demandeService: DemandeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.demandeService.getAll().subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) {
          this.demandes = data;
        } else if (data?.$values && Array.isArray(data.$values)) {
          this.demandes = data.$values;
        } else {
          this.errorMessage = 'Format de réponse inattendu de l’API.';
          this.demandes = [];
          console.warn('Réponse inattendue:', data);
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des demandes', err);
        this.errorMessage = 'Impossible de charger les demandes.';
      }
    });
  }

  
get filteredDemandes(): DemandeLivraison[] {
  return this.demandes.filter(d => {
    const search = this.searchTerm.toLowerCase();
    const matchSearch =
      d.adresseEnlevement?.toLowerCase().includes(search) ||
      d.adresseLivraison?.toLowerCase().includes(search);

    const matchStatut = this.selectedStatut ? d.statut === this.selectedStatut : true;

    const matchDate = this.selectedDate
      ? d.dateSouhaitee?.startsWith(this.selectedDate)
      : true;

    return matchSearch && matchStatut && matchDate;
  });
}

resetDateFilter() {
  this.selectedDate = '';
}
  faireOffre(idOffre: number) {
    this.router.navigate(['/dashboardtransporteur/add-offre', idOffre]);
  }
}
