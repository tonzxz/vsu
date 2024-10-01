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
  @Input() existingUsers: User[] = []; // New input to check for duplicates
  @Output() close = new EventEmitter<void>();
  @Output() accountCreated = new EventEmitter<User>();

  username = '';
  fullName = '';
  type = 'Desk attendant';
  department = 'Accounting Office';
  status: 'Online' | 'Offline' = 'Online';
  password = '';
  passwordVisible = false;

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

    if (this.isDuplicateUser()) {
      this.showError = true;
      this.errorMessage = 'A user with this username or full name already exists.';
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
      type: this.type,
      department: this.department,
      status: this.editingUser ? this.editingUser.status : 'Online',
    };

    if (this.type === 'Kiosk') {
      newUser.password = this.password || this.generateDepartmentPassword(this.department);
    }

    this.accountCreated.emit(newUser);
    this.closeModal();
  }

  isFormValid(): boolean {
    return this.username.trim() !== '' && 
           this.fullName.trim() !== '' && 
           this.type !== '' && 
           this.department !== '' &&
           (this.type !== 'Kiosk' || this.password.trim() !== '');
  }

  isDuplicateUser(): boolean {
    return this.existingUsers.some(user => 
      (user.username.toLowerCase() === this.username.toLowerCase() ||
       user.fullName.toLowerCase() === this.fullName.toLowerCase()) &&
      (!this.editingUser || user.username !== this.editingUser.username)
    );
  }

  isKiosk(): boolean {
    return this.type === 'Kiosk';
  }

  generateRandomPassword() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    this.password = result;
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  generateDepartmentPassword(department: string): string {
    const base = department.toLowerCase().replace(/\s+/g, '-');
    return `${base}-${Math.random().toString(36).substring(2, 8)}`;
  }
}