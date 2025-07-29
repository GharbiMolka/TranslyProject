import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommandeService, CommandeCreateDto } from '../../services/commande';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-commande',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-commande.html',
  styleUrls: ['./add-commande.css']
})
export class AddCommande implements OnInit {
  commandeForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private commandeService: CommandeService,
    private router: Router
  ) {}

 ngOnInit(): void {
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0]; // → "2025-07-09"

  this.commandeForm = this.fb.group({
    dateCommande: [formattedDate, Validators.required],
    adresse: ['', Validators.required],
    gouvernorat: ['', Validators.required],
    ville: ['', Validators.required],
    statut: [''],
    description: ['']
  });
}

  onSubmit(): void {
    if (this.commandeForm.invalid) {
      return;
    }

    const dto: CommandeCreateDto = {
      dateCommande: this.commandeForm.value.dateCommande,
      adresse: this.commandeForm.value.adresse,
      gouvernorat: this.commandeForm.value.gouvernorat,
      ville: this.commandeForm.value.ville,
      statut: this.commandeForm.value.statut,
      description: this.commandeForm.value.description
    };

    this.commandeService.createCommande(dto).subscribe({
      next: () => {
        console.log('Commande ajoutée avec succès.');
        this.router.navigate(['/dashboardclient/liste-commandes']);
      },
      error: (err) => {
        console.error('Erreur lors de l’ajout de la commande :', err);
      }
    });
  }
}
