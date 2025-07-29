import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ à importer pour ngClass

@Component({
  selector: 'app-delete-commande',
  standalone: true,
  imports: [CommonModule], // ✅ important pour ngClass, ngIf...
  templateUrl: './delete-commande.html',
  styleUrls: ['./delete-commande.css']
})
export class DeleteCommande {
  @Input() show: boolean = false;
  @Output() confirmDelete = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirmDelete.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
