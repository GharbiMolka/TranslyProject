import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OffreService, Offre } from '../../services/offre';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-offre',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list-offre.html',
  styleUrls: ['./list-offre.css']
})
export class ListOffre implements OnInit {
  offres: Offre[] = [];
  errorMessage = '';
  selectedOffre?: Offre;
  modalType: 'details' | 'edit' | 'delete' | 'priseEnCharge' | null = null;
  searchPrix: number | null = null;
  filterDelai: number | null = null;
  filterStatut: string = '';
  filterDate: string = ''; 


  constructor(
    private offreService: OffreService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.offreService.getByConnectedUser().subscribe({
      next: data => {
        this.offres = (data as any).$values || [];
        console.log('Offres récupérées :', this.offres);
      },
      error: err => {
        console.error('Erreur lors du chargement des offres :', err);
        this.errorMessage = 'Impossible de charger les offres.';
      }
    });
  }

  ouvrirModal(offre: Offre, type: 'details' | 'edit' | 'delete'  | 'priseEnCharge') {
    this.selectedOffre = offre;
    this.modalType = type;
  }

  fermerModal() {
    this.selectedOffre = undefined;
    this.modalType = null;
  }

  modifierOffre(): void {
  if (!this.selectedOffre) return;

  this.offreService.update(this.selectedOffre.idOffre, this.selectedOffre).subscribe({
    next: () => {
      alert('Offre modifiée avec succès');
      this.fermerModal();
    },
    error: err => {
      console.error(err);
      alert("Erreur lors de la modification.");
    }
  });
}

confirmerSuppression(): void {
  if (!this.selectedOffre) return;

  this.offreService.delete(this.selectedOffre.idOffre).subscribe({
    next: () => {
      this.offres = this.offres.filter(o => o.idOffre !== this.selectedOffre?.idOffre);
      alert("Offre supprimée");
      this.fermerModal();
    },
    error: err => {
      console.error(err);
      alert("Erreur lors de la suppression.");
    }
  });
}
filteredOffres(): Offre[] {
  return this.offres.filter(o => {
    const prixOK = this.searchPrix == null || o.prixPropose >= this.searchPrix;
    const delaiOK = this.filterDelai == null || o.delaiLivraison <= this.filterDelai;
    const statutOK = !this.filterStatut || o.statut === this.filterStatut;

    const dateOK = !this.filterDate || o.dateOffre?.startsWith(this.filterDate);

    return prixOK && delaiOK && statutOK && dateOK;
  });
}

changerPriseEnCharge(valeur: 'oui' | 'non'): void {
  if (!this.selectedOffre) return;

  this.offreService.updatePriseEnCharge(this.selectedOffre.idOffre, valeur).subscribe({
    next: () => {
      alert(`Prise en charge ${valeur === 'oui' ? 'acceptée' : 'refusée'} avec succès.`);
      this.fermerModal();
      // Mettre à jour localement l’objet modifié
      this.selectedOffre!.priseEnCharge = valeur;
    },
    error: err => {
      console.error(err);
      alert("Erreur lors de la mise à jour de la prise en charge.");
    }
  });
}



}


