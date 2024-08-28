import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  username: string;
  fullName: string;
  location: string;
  type: string;
  status: 'Enable' | 'Disable';
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
  location = 'Accounting Office';
  type = 'Desk attendant';
  status: 'Enable' | 'Disable' = 'Enable';
  password = '';
  passwordVisible = false; // Added property

  ngOnInit() {
    if (this.editingUser) {
      this.username = this.editingUser.username;
      this.fullName = this.editingUser.fullName;
      this.location = this.editingUser.location;
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
      location: this.location,
      type: this.type,
      status: this.status,
    };

    if (this.type === 'Kiosk') {
      newUser.password = this.password;
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
    for (let i = 0; i < 12; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    this.password = result;
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
