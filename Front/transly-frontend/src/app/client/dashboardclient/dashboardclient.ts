import { Component ,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet , RouterLink} from '@angular/router'; 
import { AuthService } from '../../services/auth';


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
 constructor(private router: Router ,  private authService: AuthService) {}

 ngOnInit(): void {
    this.userId = this.authService.getUserId(); // Appel une seule fois
  }
 

   goToListCommande() {
  this.router.navigate(['/dashboardclient/liste-commandes']);
  }

  getUserId(): number | null {
  return this.authService.getUserId();
}

   goToDetailuser(): void {
    if (this.userId !== null) {
      this.router.navigate(['/dashboardclient/detail-user', this.userId]);
    }
    }
}

