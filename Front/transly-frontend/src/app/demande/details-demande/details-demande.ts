import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemandeService, DemandeLivraison } from '../../services/demande';

@Component({
  selector: 'app-details-demande',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details-demande.html',
  styleUrls: ['./details-demande.css']
})
export class DetailsDemande implements OnInit {
  demande?: DemandeLivraison;
  demandeId!: number;

  constructor(
    private route: ActivatedRoute,
    private demandeService: DemandeService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.demandeId = +idParam;
      this.demandeService.getById(this.demandeId).subscribe({
        next: (data) => this.demande = data,
        error: (err) => console.error('Erreur chargement demande', err)
      });
    }
  }
}
