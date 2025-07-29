import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommandeService, Commande } from '../../services/commande';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-commandes-fournisseur',
  standalone: true,
  templateUrl: './liste-commandes-fournisseur.html',
  styleUrls: ['./liste-commandes-fournisseur.css'],
   imports: [CommonModule, FormsModule],
})
export class ListeCommandesFournisseur implements OnInit {
  commandes: Commande[] = [];
  errorMessage: string = '';
  commandeSelectionneeId: number | null = null;
  typeAction: 'accept' | 'refuse' | null = null;
  selectedCommandeDetails?: Commande;
  showDetailModal = false;

 searchTerm: string = '';
 selectedStatut: string = '';
 selectedGouvernorat: string = '';

 get filteredCommandes(): Commande[] {
  return this.commandes
    .filter(c => c.statut !== 'Refusée') // on exclut les refusées comme avant
    .filter(c => {
      const search = this.searchTerm.toLowerCase();
      const matchSearch = c.adresse?.toLowerCase().includes(search) || c.description?.toLowerCase().includes(search);
      const matchStatut = this.selectedStatut ? c.statut === this.selectedStatut : true;
      const matchGov = this.selectedGouvernorat ? c.gouvernorat === this.selectedGouvernorat : true;
      return matchSearch && matchStatut && matchGov;
    });
}

  constructor(
    private commandeService: CommandeService,
    private authService: AuthService,
    private router: Router
  ) {}

ngOnInit(): void {
  this.commandeService.getAllCommandes().subscribe({
    next: (data: any) => {
      console.log('Réponse API =', data);
      this.commandes = data?.$values ?? []; 
    },
    error: (err) => {
      console.error(err);
      this.errorMessage = "Erreur lors du chargement des commandes";
    }
  });
}

get commandesSansRefusees(): Commande[] {
  return this.commandes.filter(c => c.statut !== 'Refusée');
}

accepterCommande(id: number) {
  this.commandeService.changerStatutCommande(id, 'Acceptée').subscribe({
    next: () => {
      this.commandes = this.commandes.map(c =>
        c.id_Com === id ? { ...c, statut: 'Acceptée' } : c
      );
    },
    error: (err) => {
      console.error(err);
      this.errorMessage = "Erreur lors de l'acceptation de la commande.";
    }
  });
}

refuserCommande(id: number) {
  this.commandeService.changerStatutCommande(id, 'Refusée').subscribe({
    next: () => {
      this.commandes = this.commandes.map(c =>
        c.id_Com === id ? { ...c, statut: 'Refusée' } : c
      );
    },
    error: (err) => {
      console.error(err);
      this.errorMessage = "Erreur lors du refus de la commande.";
    }
  });
}

ouvrirConfirmation(id: number, action: 'accept' | 'refuse') {
  this.commandeSelectionneeId = id;
  this.typeAction = action;
  const modal = document.getElementById('confirmationModal');
  if (modal) modal.classList.add('show');
}

fermerModal() {
  const modal = document.getElementById('confirmationModal');
  if (modal) modal.classList.remove('show');
  this.commandeSelectionneeId = null;
  this.typeAction = null;
}

confirmerAction() {
  if (!this.commandeSelectionneeId || !this.typeAction) return;

  const statut = this.typeAction === 'accept' ? 'Acceptée' : 'Refusée';

  this.commandeService.changerStatutCommande(this.commandeSelectionneeId, statut).subscribe({
    next: () => {
      this.commandes = this.commandes.map(c =>
        c.id_Com === this.commandeSelectionneeId ? { ...c, statut } : c
      );
      this.fermerModal();
    },
    error: (err) => {
      console.error(err);
      this.errorMessage = `Erreur lors du traitement de la commande.`;
      this.fermerModal();
    }
  });
}
faireDemande(idCommande: number) {
 this.router.navigate(['/dashboardfournisseur/add-demande', idCommande]);
}
openDetailModal(commande: Commande) {
  this.selectedCommandeDetails = commande;
  this.showDetailModal = true;
}

closeDetailModal() {
  this.showDetailModal = false;
  this.selectedCommandeDetails = undefined;
}


}
