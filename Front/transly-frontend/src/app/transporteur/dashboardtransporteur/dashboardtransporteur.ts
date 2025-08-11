import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-dashboardtransporteur',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,

  ],
  templateUrl: './dashboardtransporteur.html',
  styleUrl: './dashboardtransporteur.css'
})
export class Dashboardtransporteur implements OnInit {
  userId: number | null = null;
    activeItem: string = 'accueil';
    userName: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
       const user = this.authService.getUser();
  if (user) {
    this.userId = user.id;
    this.userName = `${user.prenom} ${user.nom}`;
  }
  }

  getUserId(): number | null {
    return this.authService.getUserId();
  }

  goToDetailuser(): void {
    if (this.userId !== null) {
      this.router.navigate(['/dashboardtransporteur/detail-user', this.userId]);
    }
  }

  goToListDemandes(): void {
    this.activeItem = 'demandes';
    this.router.navigate(['/dashboardtransporteur/liste-demande']);
  }
  goToHome(): void {
    this.activeItem = 'accueil';
    this.router.navigate(['/dashboardclient']);
  }
   goToListOffre(): void {
       this.activeItem = 'offres';
    this.router.navigate(['/dashboardtransporteur/liste-offre']);
  }
}
