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

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
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
    this.router.navigate(['/dashboardtransporteur/liste-demande']);
  }

 

   goToListOffre(): void {
    this.router.navigate(['/dashboardtransporteur/liste-offre']);
  }
}
