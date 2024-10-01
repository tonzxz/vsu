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
  randomCode = ''; // Initialize randomCode

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

      // Generate the random code if the editing user is a Kiosk
      if (this.isKiosk()) {
        this.randomCode = this.editingUser.password || this.generateRandomCode();
      }
    } else {
      this.generateRandomCode(); // Generate code for new user
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
      department: this.department,
      type: this.type,
      status: this.status,
      password: this.isKiosk() ? this.randomCode : this.password, // Use randomCode for Kiosk
    };

    this.accountCreated.emit(newUser);
    this.close.emit();
  }

  isFormValid() {
    return (this.isKiosk() && this.randomCode) || (this.username && this.fullName && this.password);
  }

  isKiosk() {
    return this.type === 'Kiosk';
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  generateRandomCode() {
    // Generate a 6-digit random number
    this.randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    return this.randomCode; // Optionally return the generated code if needed
  }

  onTypeChange() {
    if (this.isKiosk()) {
      this.generateKioskUsernames(); // Generate new usernames for Kiosk
      this.randomCode = this.generateRandomCode(); // Generate a new code when type changes to Kiosk
    } else {
      this.randomCode = ''; // Clear the random code if not Kiosk
      this.username = ''; // Clear username when switching from Kiosk
      this.fullName = ''; // Clear full name when switching from Kiosk
    }
  }

  generateKioskUsernames() {
    const departmentCount = this.existingUsers.filter(user => user.department === this.department && user.type === 'Kiosk').length;
    const count = departmentCount + 1; // Increment counter for new username
    this.username = `${this.department.replace(/\s+/g, '')}${count}`; // Remove spaces in department name
    this.fullName = `${this.department} Kiosk User ${count}`; // Generate full name
  }

  isDuplicateUser() {
    return this.existingUsers.some(user => 
      user.username === this.username || user.fullName === this.fullName
    );
  }
}
