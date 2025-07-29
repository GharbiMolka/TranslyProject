import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemandeService, DemandeLivraison } from '../../services/demande';

@Component({
  selector: 'app-delete-demande',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-demande.html',
  styleUrls: ['./delete-demande.css']
})
export class DeleteDemande implements OnInit {
  demandeId!: number;
  demande!: DemandeLivraison;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private demandeService: DemandeService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.demandeId = +idParam;
      this.demandeService.getById(this.demandeId).subscribe({
        next: (data) => this.demande = data,
        error: (err) => console.error('Erreur récupération demande :', err)
      });
    }
  }

  confirmDelete(): void {
    this.demandeService.delete(this.demandeId).subscribe({
      next: () => this.router.navigate(['/dashboardfournisseur/list-demandes']),
      error: (err) => console.error('Erreur suppression demande :', err)
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboardfournisseur/list-demandes']);
  }
}
