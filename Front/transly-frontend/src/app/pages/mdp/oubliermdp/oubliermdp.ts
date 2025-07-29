import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-oubliermdp',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './oubliermdp.html',
  styleUrl: './oubliermdp.css'
})
export class Oubliermdp {
  email = '';
  message = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }

  submitEmail() {
    this.authService.requestPasswordReset(this.email).subscribe({
      next: () => {
        this.message = 'Lien de réinitialisation envoyé. Vérifiez votre e-mail.';
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Erreur lors de l\'envoi. Vérifiez votre adresse.';
        this.message = '';
      }
    });
  }
}
