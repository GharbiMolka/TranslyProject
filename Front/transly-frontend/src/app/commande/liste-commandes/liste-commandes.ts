import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommandeService, Commande } from '../../services/commande';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { DeleteCommande } from '../delete-commande/delete-commande'; 
import { DetailCommande } from '../detail-commande/detail-commande';
import { EditCommande } from '../edit-commande/edit-commande';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-liste-commandes',
  standalone: true,
  imports: [CommonModule, DeleteCommande, DetailCommande, EditCommande, FormsModule], 
  templateUrl: './liste-commandes.html',
  styleUrls: ['./liste-commandes.css']
})
export class ListeCommandes implements OnInit {
  commandes: Commande[] = [];
  errorMessage: string = '';
  showDeleteModal = false;
  selectedCommandeId: number | null = null;
  selectedCommandeDetails?: Commande;
showDetailModal = false;
showEditModal = false;
commandeToEdit?: Commande;
searchTerm: string = '';
selectedStatut: string = '';
selectedGouvernorat: string = '';
get filteredCommandes(): Commande[] {
  return this.commandes.filter(c => {
    const search = this.searchTerm.toLowerCase();
    const matchSearch = c.adresse?.toLowerCase().includes(search) || c.description?.toLowerCase().includes(search);
    const matchStatut = this.selectedStatut ? c.statut === this.selectedStatut : true;
    const matchGov = this.selectedGouvernorat ? c.gouvernorat === this.selectedGouvernorat : true;
    return matchSearch && matchStatut && matchGov;
  });
}

gouvernorats: string[] = []; // à générer automatiquement ci-dessous


  constructor(
    private commandeService: CommandeService,
    private authService: AuthService,
    private router: Router
  ) {}

ngOnInit(): void {
  this.commandeService.getCommandesPourClient().subscribe({
    next: (data: any) => {
      console.log('Réponse API = ', data);
      this.commandes = data?.$values ?? [];
    },
    error: (err) => {
      this.errorMessage = 'Erreur lors du chargement des commandes';
      console.error(err);
    }
  });
  this.gouvernorats = [...new Set(this.commandes.map(c => c.gouvernorat).filter(Boolean))];
}

  openDeleteModal(id: number) {
    this.selectedCommandeId = id;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.selectedCommandeId = null;
    this.showDeleteModal = false;
  }

  deleteCommande() {
    if (this.selectedCommandeId !== null) {
      this.commandeService.deleteCommande(this.selectedCommandeId).subscribe(() => {
        this.commandes = this.commandes.filter(c => c.id_Com !== this.selectedCommandeId);
        this.closeDeleteModal();
      });
    }
  }

openDetailModal(commande: Commande) {
  this.selectedCommandeDetails = commande;
  this.showDetailModal = true;
}

closeDetailModal() {
  this.showDetailModal = false;
  this.selectedCommandeDetails = undefined;
}


openEditModal(commande: Commande) {
  this.commandeToEdit = { ...commande }; // clone pour éviter de modifier directement
  this.showEditModal = true;
}

closeEditModal() {
  this.showEditModal = false;
  this.commandeToEdit = undefined;
}

saveEditedCommande(updated: Commande) {
  this.commandeService.updateCommande(updated.id_Com, updated).subscribe(() => {
    const index = this.commandes.findIndex(c => c.id_Com === updated.id_Com);
    if (index !== -1) this.commandes[index] = updated;
    this.closeEditModal();
  });
}



 goToAddCommande() {
  this.router.navigate(['/dashboardclient/add-commande']);
  }
}
