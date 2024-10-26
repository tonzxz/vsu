import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-change-password-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password-modal.component.html'
})
export class ChangePasswordModalComponent {
  @Input() userId!: string;
  @Input() userRole!: string; 

  @Output() closeModal = new EventEmitter<void>();
  @Output() passwordChanged = new EventEmitter<{currentPassword: string, newPassword: string}>();

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  errorMessage = '';
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  ngOnInit() {
    console.log('True na baUser ID for password change:', this.userId, this.userRole); 
  }

  close() {
    this.closeModal.emit();
  }

  togglePasswordVisibility(field: 'current' | 'new' | 'confirm') {
    switch (field) {
      case 'current':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }

  submitForm() {
    this.errorMessage = '';

    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'All fields are required';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'New passwords do not match';
      return;
    }

    if (this.newPassword.length < 8) {
      this.errorMessage = 'Password must be at least 8 characters long';
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(this.newPassword)) {
      this.errorMessage = 'Password does not meet the requirements';
      return;
    }

    this.passwordChanged.emit({
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    });

    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }
}
