import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DemandeService, DemandeLivraison } from '../../services/demande';

@Component({
  selector: 'app-edit-demande',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-demande.html',
  styleUrls: ['./edit-demande.css']
})
export class EditDemande implements OnInit {
  demande: DemandeLivraison = {
    id: 0,
    id_Commande: 0,
    id_User: 0,
    adresseEnlevement: '',
    adresseLivraison: '',
    dateSouhaitee: '',
    statut: ''
  };

  constructor(
    private route: ActivatedRoute,
    private demandeService: DemandeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      this.demandeService.getById(id).subscribe({
        next: (data) => this.demande = data,
        error: (err) => console.error('Erreur chargement demande', err)
      });
    }
  }

  onSubmit(): void {
    this.demandeService.update(this.demande.id, this.demande).subscribe({
      next: () => this.router.navigate(['/dashboardfournisseur/list-demandes']),
      error: (err) => console.error('Erreur modification', err)
    });
  }
}
