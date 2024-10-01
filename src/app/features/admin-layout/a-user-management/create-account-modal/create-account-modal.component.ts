import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  username: string;
  fullName: string;
  department: string;
  type: string;
  status: 'Online' | 'Offline';
  password?: string;
}

@Component({
  selector: 'app-create-account-modal',
  templateUrl: './create-account-modal.component.html',
  styleUrls: ['./create-account-modal.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class CreateAccountModalComponent {
  @Input() editingUser: User | null = null;
  @Input() existingUsers: User[] = []; 
  @Output() close = new EventEmitter<void>();
  @Output() accountCreated = new EventEmitter<User>();

  username = ''; 
  fullName = '';
  type = '';
  department = '';
  status: 'Online' | 'Offline' = 'Online';
  password = '';
  passwordVisible = false;
  randomCode = ''; 

  types = ['Desk attendant', 'Kiosk', 'Queue Display'];
  departments = ['Accounting Office', 'Registrar', 'Cash Division'];

  showError = false;
  errorMessage = '';
  showConfirmation = false;

  ngOnInit() {
    if (this.editingUser) {
      this.username = this.editingUser.username;
      this.fullName = this.editingUser.fullName;
      this.type = this.editingUser.type;
      this.department = this.editingUser.department;
      this.status = this.editingUser.status;
      this.password = this.editingUser.password || '';
   
      if (this.isKiosk()) {
        this.randomCode = this.editingUser.password || this.generateRandomCode();
        this.generateKioskUsernames(); 
      }
    } else {
      this.generateRandomCode(); 
    }
  }

  closeModal() {
    this.close.emit();
  }

  submitForm() {
    if (!this.isFormValid()) {
      this.showError = true;
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    if (this.editingUser) {
      this.showConfirmation = true;
    } else {
      this.createOrUpdateAccount();
    }
  }

  confirmEdit() {
    this.createOrUpdateAccount();
    this.showConfirmation = false;
  }

  cancelEdit() {
    this.showConfirmation = false;
  }

  createOrUpdateAccount() {
    const newUser: User = {
      username: this.username,
      fullName: this.fullName,
      department: this.department,
      type: this.type,
      status: this.status,
      password: this.isKiosk() ? this.randomCode : this.password, 
    };

    this.accountCreated.emit(newUser);
    this.close.emit();
  }

  isFormValid() {
    if (this.isKiosk()) {
      return this.randomCode !== '' && this.department.trim() !== '';
    } else {
      return this.username.trim() !== '' && 
             this.fullName.trim() !== '' && 
             this.password.trim() !== '' && 
             this.department.trim() !== ''; 
    }
  }

  isKiosk() {
    return this.type === 'Kiosk';
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  generateRandomCode() {
    this.randomCode = Math.floor(100000 + Math.random() * 900000).toString();
   
    if (this.isKiosk()) {
      this.generateKioskUsernames(); 
    }
    return this.randomCode; 
  }

  onTypeChange() {
    if (this.isKiosk()) {
      this.randomCode = this.generateRandomCode(); 
    } else {
      this.randomCode = ''; 
      this.username = ''; 
      this.fullName = ''; 
    }
  }

  generateKioskUsernames() {
    this.fullName = `Kiosk User ${this.randomCode}`; 
    this.username = `kiosk_user_${this.randomCode}`; 
  }
}
