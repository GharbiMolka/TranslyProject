import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService, LoginDTO } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    HttpClientModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  credentials: LoginDTO = { email: '', mdp: '' };
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(form: NgForm) {
    this.error = '';

    form.control.markAllAsTouched(); // Active l'affichage des erreurs dans le formulaire

    const emailVide = !this.credentials.email.trim();
    const mdpVide = !this.credentials.mdp.trim();

    if (emailVide && mdpVide) {
      this.error = "Veuillez remplir les champs Email et Mot de passe.";
      return;
    }

    if (emailVide) {
      this.error = "Veuillez saisir votre adresse e-mail.";
      return;
    }

    if (mdpVide) {
      this.error = "Veuillez saisir votre mot de passe.";
      return;
    }

    // Appel API
    this.authService.login(this.credentials).subscribe({
      next: (res) => {
        const token = res.token;
        const userId = res.user.id;
        const role = res.user.role;

        this.authService.setUserSession(userId, role, token);

        switch (role) {
          case 'Client':
            this.router.navigate(['/dashboardclient']);
            break;
          case 'Fournisseur':
            this.router.navigate(['/dashboardfournisseur']);
            break;
          case 'Transporteur':
            this.router.navigate(['/dashboardtransporteur']);
            break;
        }
      },
      error: (err) => {
        this.error = err.error?.message || "Email ou mot de passe incorrect.";
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToOubliermdp() {
    this.router.navigate(['/oubliermdp']);
  }
}
