import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UswagonCoreService } from 'uswagon-core';

interface User {
  id: string;
  division_id: string;
  username: string;
  fullname: string;
  profile?: string;
  role?: string;
}

interface Divisions {
  id: string;
  name: string;
}

@Component({
  selector: 'app-edit-profile-modal',
  templateUrl: './edit-profile-modal.component.html',
  styleUrls: ['./edit-profile-modal.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class EditProfileModalComponent {
  @Input() user: User = {} as User;
  @Input() divisions: Divisions[] = [];
  @Output() closeModal = new EventEmitter<void>();
  @Output() profileUpdated = new EventEmitter<Partial<User>>();

  updatedUser: User = {} as User;
  passwordVisible: boolean = false;
  showError: boolean = false;
  errorMessage: string = '';

  // Change this from `private` to `public`
  constructor(public API: UswagonCoreService) {}

  ngOnInit() {
    // Initialize the updatedUser with the current user data
    this.updatedUser = { ...this.user };
  }

  async submitForm() {
    try {
      // Emit the updated user data to the parent component
      this.profileUpdated.emit(this.updatedUser);
      this.close();
    } catch (error) {
      console.error('Error updating profile:', error);
      this.showError = true;
      this.errorMessage = 'An error occurred. Please try again.';
    }
  }


  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const fileExtension = file.name.split('.').pop();
      const newFileName = `${this.updatedUser.fullname.replace(/\s+/g, '_')}-${Date.now()}.${fileExtension}`;
      const location = `userProfiles/${newFileName}`;

      this.API.uploadFile(file, location)
        .then(() => {
          console.log('File uploaded successfully');
          this.updatedUser.profile = location;
        })
        .catch((error) => {
          console.error('Error uploading file:', error);
        });
    }
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  close() {
    this.closeModal.emit();
  }
}
