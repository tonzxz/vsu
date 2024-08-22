import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-account-modal',
  templateUrl: './create-account-modal.component.html',
  styleUrls: ['./create-account-modal.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CreateAccountModalComponent {
  @Output() close = new EventEmitter<void>();

  newAccount: any = {
    fullName: '',
    username: '',
    password: '',
    location: '',
    type: ''
  };
  locations = ['Accounting Office', 'Registrar', 'Admin Office'];
  accountTypes = ['Desk attendant', 'Manager', 'Admin'];
  
  showModal = true;

  createNewAccount() {
    // Implement the logic to create a new account
    console.log('Creating new account:', this.newAccount);
  }

  closeModal() {
    this.showModal = false;
    this.close.emit();  // Emit event to notify the parent component to close the modal
  }
}
