import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reinisialisermdp',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './reinisialisermdp.html',
  styleUrl: './reinisialisermdp.css'
})
export class Reinisialisermdp implements OnInit {
  token = '';
  newPassword = '';
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  submit() {
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      this.successMessage = '';
      return;
    }

    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: () => {
        this.successMessage = 'Mot de passe réinitialisé avec succès.';
        this.errorMessage = '';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.errorMessage = "Une erreur s'est produite lors de la réinitialisation.";
        this.successMessage = '';
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
