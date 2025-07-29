import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet , RouterLink} from '@angular/router'; 
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';


@Component({
  selector: 'app-dashboardfournisseur',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet, 
  ],
  templateUrl: './dashboardfournisseur.html',
  styleUrls: ['./dashboardfournisseur.css']
})
export class Dashboardfournisseur implements OnInit {
   userId: number | null = null;
   nombreCommandesRecentes = 0;

  constructor(private router: Router,
    private authService: AuthService
  ) {}
   ngOnInit(): void {
    this.userId = this.authService.getUserId(); 
    
  }

  goToListProduits() {
    this.router.navigate(['/dashboardfournisseur/liste-produits']);
  }

  
  getUserId(): number | null {
  return this.authService.getUserId();
}

 goToDetailuser(): void {
    if (this.userId !== null) {
      this.router.navigate(['/dashboardfournisseur/detail-user', this.userId]);
    }
}

goToCommandeFournisseur (): void {
this.router.navigate(['/dashboardfournisseur/list-commande-fournisseur']);}

goToListDemande (): void {
this.router.navigate(['/dashboardfournisseur/list-demande']);}
}

