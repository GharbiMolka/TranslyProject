import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DemandeService, DemandeLivraison } from '../../services/demande';
import { AuthService } from '../../services/auth';
import { OffreService } from '../../services/offre';
import { Commande, CommandeService } from '../../services/commande';
import { Offre } from '../../services/offre';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-liste-demandes',
  standalone: true,
  imports: [CommonModule , FormsModule],
  templateUrl: './list-demande.html',
  styleUrls: ['./list-demande.css']
})
export class ListeDemande implements OnInit {
  demandes: DemandeLivraison[] = [];
  errorMessage = '';
  selectedDemande?: DemandeLivraison;
  modalType: 'details' | 'edit' | 'delete' | 'offres' | null = null;
  offreEnCoursConfirmation?: { id: number, action: 'Acceptée' | 'Refusée' };
  commandeLiee?: Commande;
  offresPourDemande: Offre[] = [];
  searchTerm: string = '';
selectedStatut: string = ''; 

  constructor(
    private demandeService: DemandeService,
    private offreService : OffreService,
    private authService: AuthService,
    private commandeService: CommandeService,
    private router: Router
  ) {}

ngOnInit(): void {
  this.demandeService.getByConnectedUser().subscribe({
    next: data => {
      this.demandes = (data as any).$values || [];
      console.log('Demandes récupérées:', this.demandes);
    },
    error: err => {
      console.error('Erreur lors du chargement des demandes :', err);
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

    return matchSearch && matchStatut;
  });
}

openModal(type: 'details' | 'edit' | 'delete' | 'offres', demande: DemandeLivraison) {
  this.selectedDemande = demande;
  this.modalType = type;

  if (type === 'details' && demande.id_Commande) {
    this.commandeService.getCommandeById(demande.id_Commande).subscribe({
      next: data => this.commandeLiee = data,
      error: err => {
        console.error("Erreur récupération commande liée :", err);
        this.commandeLiee = undefined;
      }
    });
  }
}

  closeModal() {
    this.modalType = null;
    this.selectedDemande = undefined;
  }

  confirmDelete() {
    if (!this.selectedDemande) return;
    this.demandeService.delete(this.selectedDemande.id).subscribe({
      next: () => {
        this.demandes = this.demandes.filter(d => d.id !== this.selectedDemande?.id);
        this.closeModal();
      },
      error: (err) => console.error('Erreur suppression demande :', err)
    });
  }

  saveEdit() {
    if (!this.selectedDemande) return;
    this.demandeService.update(this.selectedDemande.id, this.selectedDemande).subscribe({
      next: () => this.closeModal(),
      error: (err) => console.error('Erreur modification', err)
    });
  }


  formatDate(date: string | Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = ('0' + (d.getMonth() + 1)).slice(-2);
  const day = ('0' + d.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}

loadOffresPourDemande(demandeId: number): void {
  this.demandeService.getOffresPourDemande(demandeId).subscribe({
    next: data => {
      this.offresPourDemande = (data as any).$values || data;
      this.modalType = 'offres';
    },
    error: err => {
      console.error('Erreur chargement offres :', err);
      this.offresPourDemande = [];
    }
  });
}

changerStatut(offreId: number, nouveauStatut: 'Acceptée' | 'Refusée') {
  this.offreEnCoursConfirmation = { id: offreId, action: nouveauStatut };
}

confirmerChangementStatut() {
  if (!this.offreEnCoursConfirmation) return;
  const { id, action } = this.offreEnCoursConfirmation;

  this.offreService.updateStatut(id, action).subscribe({
    next: () => {
      const offre = this.offresPourDemande.find(o => o.idOffre === id);
      if (offre) offre.statut = action;
      this.offreEnCoursConfirmation = undefined;
    },
    error: err => {
      console.error('Erreur lors du changement de statut :', err);
      this.offreEnCoursConfirmation = undefined;
    }
  });
}

annulerConfirmation() {
  this.offreEnCoursConfirmation = undefined;
}

}
