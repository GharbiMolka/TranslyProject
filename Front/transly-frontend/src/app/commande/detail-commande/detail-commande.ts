import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Commande } from '../../services/commande'; 
import { UserService, User } from '../../services/user'; // à créer
import { AuthService } from '../../services/auth';
@Component({
  selector: 'app-detail-commande',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-commande.html',
  styleUrls: ['./detail-commande.css']
})
export class DetailCommande implements OnInit {
  @Input() show: boolean = false;
  @Input() commande?: Commande; 
  @Output() close = new EventEmitter<void>();

  userCommande?: User;
roleUserConnecte: string = '';
  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
this.roleUserConnecte = this.authService.getUserRole() || '';    
    if (this.commande && this.roleUserConnecte === 'Fournisseur') {
      this.userService.getUserById(this.commande.id_User).subscribe({
        next: (data) => this.userCommande = data,
        error: (err) => console.error("Erreur chargement user", err)
      });
    }
  }

  onClose() {
    this.close.emit();
  }
}
