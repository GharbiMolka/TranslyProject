import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService, UserDTO } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  user: UserDTO = {
    nom: '',
    prenom: '',
    email: '',
    mdp: '',
    adresse: '',
    gouvernorat: '',
    ville: '',
    role: '',
    tel: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.register(this.user).subscribe({
      next: (res) => {
        console.log('Inscription réussie', res);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Erreur d’inscription :', err);
      }
    });
  }


  goToLogin() {
    this.router.navigate(['/login']);
  }

}
