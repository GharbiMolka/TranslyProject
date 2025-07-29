import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DemandeService } from '../../services/demande';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-add-demande',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-demande.html',
  styleUrls: ['./add-demande.css']
})
export class AddDemande implements OnInit {
  idCommande!: number;
  idUser!: number;
  demandeForm = {
    adresseEnlevement: '',
    adresseLivraison: '',
    dateSouhaitee: '',
    statut: 'En attente' 
  };
  minDate: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private demandeService: DemandeService,
    private authService: AuthService
  ) {}

 ngOnInit(): void {
    const today = new Date();
  this.minDate = today.toISOString().split('T')[0];
  this.idUser = this.authService.getUserId()!; 

  const idCommandeFromRoute = this.route.snapshot.paramMap.get('id');
  if (!this.idUser || !idCommandeFromRoute) {
    alert('Utilisateur non connecté ou commande introuvable');
    this.router.navigate(['/']);
    return;
  }

  this.idCommande = +idCommandeFromRoute;
}

  envoyerDemande(): void {
    const demande = {
      id_Commande: this.idCommande,
      id_User: this.idUser,
      adresseEnlevement: this.demandeForm.adresseEnlevement,
      adresseLivraison: this.demandeForm.adresseLivraison,
      dateSouhaitee: this.demandeForm.dateSouhaitee,
      statut: this.demandeForm.statut
    };

    this.demandeService.create(demande).subscribe({
      next: () => {
        alert('Demande envoyée avec succès');
        this.router.navigate(['/dashboardfournisseur/list-demande']);
      },
      error: (err) => {
        console.error(err);
        alert('Erreur lors de l\'envoi de la demande');
      }
    });
  }
}
