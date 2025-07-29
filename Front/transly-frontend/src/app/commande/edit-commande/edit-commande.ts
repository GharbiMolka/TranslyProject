import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Commande } from '../../services/commande';

@Component({
  selector: 'app-edit-commande',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-commande.html',
  styleUrls: ['./edit-commande.css']
})
export class EditCommande implements OnInit {
  @Input() show: boolean = false;
  @Input() commande?: Commande;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Commande>();

  commandeForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.commandeForm = this.fb.group({
      dateCommande: [this.commande?.dateCommande || ''],
      description: [this.commande?.description || ''],
      adresse: [this.commande?.adresse || ''],
      ville: [this.commande?.ville || ''],
      gouvernorat: [this.commande?.gouvernorat || '']
    });
  }
ngOnChanges(changes: SimpleChanges): void {
  if (changes['commande'] && this.commande) {
    this.commandeForm?.patchValue({
      dateCommande: this.commande.dateCommande,
      description: this.commande.description,
      adresse: this.commande.adresse,
      ville: this.commande.ville,
      gouvernorat: this.commande.gouvernorat
    });
  }
}
  onClose() {
    this.close.emit();
  }

  onSave() {
    const updatedCommande: Commande = {
      ...this.commande!,
      ...this.commandeForm.value
    };
    this.save.emit(updatedCommande);
  }
}
