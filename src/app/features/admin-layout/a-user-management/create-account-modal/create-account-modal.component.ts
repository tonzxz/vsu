//create-account-modal.component.ts
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
  @Output() close = new EventEmitter<void>();
  @Output() accountCreated = new EventEmitter<User>();

  username = '';
  fullName = '';
  department = 'Accounting Office';
  type = 'Desk attendant';
  status: 'Online' | 'Offline' = 'Online';
  password = '';
  passwordVisible = false; // Retain the password visibility toggle feature

  departments = ['Accounting Office', 'Registrar', 'Cash Division'];
  accountTypes = ['Desk attendant', 'Kiosk', 'Queue Display'];

  ngOnInit() {
    if (this.editingUser) {
      this.username = this.editingUser.username;
      this.fullName = this.editingUser.fullName;
      this.department = this.editingUser.department;
      this.type = this.editingUser.type;
      this.status = this.editingUser.status;
      this.password = this.editingUser.password || '';
    }
  }

  closeModal() {
    this.close.emit();
  }

  submitForm() {
    const newUser: User = {
      username: this.username,
      fullName: this.fullName,
      department: this.department,
      type: this.type,
      status: this.status,
    };

    if (this.type === 'Kiosk') {
      newUser.password = this.password || this.generateDepartmentPassword(this.department);
    }

    this.accountCreated.emit(newUser);
    this.closeModal();
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
