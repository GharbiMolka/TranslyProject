import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, UserDTO } from '../../services/auth';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './edit-user.html',
  styleUrls: ['./edit-user.css']
})
export class EditUser implements OnInit {
  editForm!: FormGroup;
  userId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

 ngOnInit(): void {
  const paramId = this.route.snapshot.paramMap.get('id');
  if (paramId) {
    this.userId = +paramId;
  } else {
    this.userId = this.authService.getUserId();
  }

  this.editForm = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    mdp: ['', Validators.required],
    adresse: [''],
    gouvernorat: [''],
    ville: [''],
    role: [''],
    tel: ['']
  });

  if (this.userId !== null) {
    this.authService.getUserById(this.userId).subscribe({
      next: (userData) => {
        console.log('Données reçues de l’API :', userData); 
        this.editForm.patchValue(userData);
        this.editForm.get('mdp')?.setValue(''); 
      },
      error: (err) => {
        console.error('Erreur de chargement utilisateur', err);
      }
    });
  }
}


  onSubmit(): void {
    if (this.editForm.valid && this.userId !== null) {
      const userData: UserDTO = this.editForm.value;
      this.authService.updateUser(this.userId, userData).subscribe({
        next: () => {
          alert('Profil mis à jour avec succès');
          this.router.navigate(['/dashboardfournisseur']); // adapte si besoin
        },
        error: err => {
          console.error(err);
          alert('Erreur lors de la mise à jour');
        }
      });
    }
  }
}
