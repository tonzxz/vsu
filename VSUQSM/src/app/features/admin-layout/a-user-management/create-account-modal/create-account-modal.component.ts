import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  username: string;
  fullName: string;
  location: string;
  type: string;
  status: 'Active' | 'Inactive';
  password?: string;
}

@Component({
  selector: 'app-create-account-modal',
  templateUrl: './create-account-modal.component.html',
  styleUrls: ['./create-account-modal.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CreateAccountModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() accountCreated = new EventEmitter<User>();
  @Input() editingUser: User | null = null;

  newAccount: User = {
    fullName: '',
    username: '',
    password: '',
    location: '',
    type: '',
    status: 'Active'
  };

  locations = ['Accounting Office', 'Registrar', 'Admin Office'];
  accountTypes = ['Desk attendant', 'Manager', 'Admin'];

  showModal = true;

  ngOnInit() {
    if (this.editingUser) {
      this.newAccount = { ...this.editingUser };
    }
  }

  createNewAccount() {
    console.log('Creating/Updating account:', this.newAccount);
    this.accountCreated.emit(this.newAccount);
    this.closeModal();
  }

  closeModal() {
    this.showModal = false;
    this.close.emit();
  }
}