import { Component ,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet , RouterLink} from '@angular/router'; 
import { AuthService } from '../../services/auth';

import { NotificationService } from '../../services/notification';


@Component({
  selector: 'app-dashboardclient',
  standalone: true,
  imports: [
     CommonModule,
    RouterOutlet, 
  
  ],
  templateUrl: './dashboardclient.html',
  styleUrl: './dashboardclient.css'
})
export class Dashboardclient implements OnInit {
   userId: number | null = null;
   userName: string = '';
   activeItem: string = 'accueil';
    notifications: string[] = [];
    showNotifications = false;
  
 constructor(private router: Router ,  private authService: AuthService , private notificationService: NotificationService) {}

ngOnInit(): void {
  const user = this.authService.getUser(); // méthode qui retourne { id, nom, prenom, role }
  if (user) {
    this.userId = user.id;
    this.userName = `${user.prenom} ${user.nom}`;
    
    this.notificationService.startConnection(user.id, user.role); // ⚠️ bien passer le rôle

    this.notificationService.clientNotifications$.subscribe(msgs => {
      this.notifications = msgs;
    });
  }
}
  
isActive(route: string): boolean {
  return this.router.url === route;
}
   goToListCommande() {
     this.activeItem = 'commandes';
  this.router.navigate(['/dashboardclient/liste-commandes']);
  }

  getUserId(): number | null {
  return this.authService.getUserId();
}

   goToDetailuser(): void {
    if (this.userId !== null) {
     this.activeItem = 'profil';
      this.router.navigate(['/dashboardclient/detail-user', this.userId]);
    }
    }

      goToHome(): void {
    this.activeItem = 'accueil';
    this.router.navigate(['/dashboardclient']);
  }
}

