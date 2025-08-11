import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet , RouterLink} from '@angular/router'; 
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { NotificationService } from '../../services/notification';


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
    activeItem: string = 'accueil';
    userName: string = '';
    notifications: string[] = [];
    showNotifications = false;
  

  constructor(private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}
   ngOnInit(): void {
    this.userId = this.authService.getUserId(); 
     const user = this.authService.getUser();
  if (user) {
    this.userId = user.id;
    this.userName = `${user.prenom} ${user.nom}`;
  this.notificationService.startConnection(this.userId!, user.role); 
  this.notificationService.fournisseurNotifications$.subscribe((msgs: string[]) => {
  this.notifications = msgs;
});
  }
  }

   toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  hideNotifications(): void {
    this.showNotifications = false;
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
this.activeItem = 'commandes';
this.router.navigate(['/dashboardfournisseur/list-commande-fournisseur']);}

goToListDemande (): void {
this.activeItem = 'demandes';
this.router.navigate(['/dashboardfournisseur/list-demande']);}

goToHome(): void {
    this.activeItem = 'accueil';
    this.router.navigate(['/dashboardclient']);
  }
}
