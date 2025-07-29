import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AuthService, UserDTO } from '../../services/auth';
import { HttpClientModule } from '@angular/common/http';
import { RouterOutlet , RouterLink} from '@angular/router'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-details-user',
  standalone: true,
  imports: [CommonModule, HttpClientModule  ],    
  templateUrl: './detail-user.html',
  styleUrls: ['./detail-user.css']
})
export class DetailUser implements OnInit {
  userId: number | null = null;
  userData: UserDTO | null = null;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      this.userId = +paramId;

      this.authService.getUserById(this.userId).subscribe({
        next: (user) => {
          console.log('Données utilisateur :', user);
          this.userData = user;
        },
        error: (err) => {
          console.error('Erreur lors du chargement du profil utilisateur', err);
        }
      });
    }
  }


goToEdituser(): void {
  const role = this.authService.getUserRole();

  if (this.userId !== null && role) {
    switch (role.toLowerCase()) {
      case 'fournisseur':
        this.router.navigate(['/dashboardfournisseur/edit-user', this.userId]);
        break;
      case 'client':
        this.router.navigate(['/dashboardclient/edit-user', this.userId]);
        break;
      case 'transporteur':
        this.router.navigate(['/dashboardtransporteur/edit-user', this.userId]);
        break;
      default:
        this.router.navigate(['/dashboard']);
        break;
    }
  }
}


}
