import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OffreService } from '../../services/offre';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-add-offre',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-offre.html',
  styleUrls: ['./add-offre.css']
})
export class AddOffre implements OnInit {
  id_Demande!: number;
  id_User!: number;

  offreForm = {
    prixPropose: 0,
    delaiLivraison: 1,
    statut: 'En attente'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private offreService: OffreService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.id_User = this.authService.getUserId()!;

    const idDemandeParam = this.route.snapshot.paramMap.get('id');
    if (!this.id_User || !idDemandeParam) {
      alert('Utilisateur non connecté ou demande introuvable');
      this.router.navigate(['/']);
      return;
    }

    this.id_Demande = +idDemandeParam;
  }

  envoyerOffre(): void {
    const offreDto = {
      prixPropose: this.offreForm.prixPropose,
      delaiLivraison: this.offreForm.delaiLivraison,
      statut: this.offreForm.statut,
      id_Demande: this.id_Demande
    };

    this.offreService.create(offreDto).subscribe({
      next: () => {
        alert('Offre envoyée avec succès');
        this.router.navigate(['/dashboardtransporteur/list-offre']);
      },
      error: (err) => {
        console.error(err);
        alert('Erreur lors de l\'envoi de l\'offre');
      }
    });
  }
}
