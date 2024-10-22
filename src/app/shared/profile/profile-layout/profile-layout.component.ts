import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UswagonAuthService } from 'uswagon-auth';
import { UswagonCoreService } from 'uswagon-core';
import { gsap } from 'gsap';
import { EditProfileModalComponent } from './edit-profile-modal/edit-profile-modal.component';
import { ChangePasswordModalComponent } from './change-password-modal/change-password-modal.component';

interface User {
  id: string;
  fullname: string;
  username: string;
  division_id: string;
  role?: string;
  profile?: string;
  division: string;
}

interface Divisions {
  id: string;
  name: string;
}

@Component({
  selector: 'app-profile-layout',
  standalone: true,
  imports: [CommonModule, FormsModule, EditProfileModalComponent,ChangePasswordModalComponent
  ],
  templateUrl: './profile-layout.component.html',
  styleUrls: ['./profile-layout.component.css']
})
export class ProfileLayoutComponent {
  user: User = {} as User; // Represents the currently logged-in user
  showModal = false; // Controls modal visibility
  divisions: Divisions[] = []; // Divisions available for selection

  currentPassword = '';
  newPassword = '';
  confirmNewPassword = '';
  userLogs = [
    { date: '2024-10-21 14:00', activity: 'Logged in from New York' },
    { date: '2024-10-20 09:30', activity: 'Changed profile picture' },
    { date: '2024-10-19 16:15', activity: 'Updated email address' }
  ];

  @ViewChild('contentContainer') contentContainer!: ElementRef;
  @ViewChild('profilePhoto') profilePhoto!: ElementRef;
  @ViewChild('formContainer') formContainer!: ElementRef;

  constructor(private auth: UswagonAuthService, public API: UswagonCoreService) {
    this.user = this.auth.getUser();
  }

  ngAfterViewInit() {
    gsap.from(this.contentContainer.nativeElement, {
      opacity: 0,
      y: 30,
      duration: 1.5,
      ease: 'power2.out'
    });

    gsap.from(this.profilePhoto.nativeElement, {
      opacity: 0,
      scale: 0.8,
      duration: 1.2,
      ease: 'back.out(1.7)',
      delay: 0.5
    });

    gsap.from(this.formContainer.nativeElement, {
      opacity: 0,
      x: 50,
      duration: 1,
      ease: 'power2.out',
      delay: 0.8
    });
  }

  loadUserData() {
    // Refetch the user data from the backend instead of using cached data.
    const userId = this.auth.getUser().id; // Make sure this ID is correct and up-to-date
    const targetTable = this.auth.getUser().role === 'superadmin' || this.auth.getUser().role === 'admin' ? 'administrators' : 'desk_attendants';

    this.API.read({
      selectors: ['*'],
      tables: targetTable,
      conditions: `WHERE id = '${userId}'`
    }).then((response) => {
      if (response.success && response.output && response.output.length > 0) {
        this.user = response.output[0]; // Assuming the response contains the user data
        console.log('User data loaded:', this.user);
      } else {
        console.error('Failed to load user data:', response.output);
      }
    }).catch((error) => {
      console.error('Error loading user data:', error);
    });
  }

  getUserProfile() {
    return this.user.profile
      ? this.API.getFileURL(this.user.profile)
      : 'assets/images/noprofile.png';
  }

  editUser(): void {
    this.showModal = true;
  }

 saveUserInfo(updatedUser: Partial<User>): void {
    const mergedUser: Omit<User, 'password'> = {
      ...this.user,
      ...updatedUser,
    };

    const targetTable = this.user.role === 'superadmin' || this.user.role === 'admin' ? 'administrators' : 'desk_attendants';
    const { role, ...valuesToUpdate } = targetTable === 'desk_attendants' ? mergedUser : mergedUser;

    console.log('Saving user info to table:', targetTable, 'with values:', valuesToUpdate);

    this.API.update({
      tables: targetTable,
      values: valuesToUpdate,
      conditions: `WHERE id = '${this.user.id}'`
    }).then((response) => {
      if (response.success) {
        this.loadUserData(); // Reload the updated user data
        this.closeModal();
        this.API.sendFeedback('success', 'User profile updated successfully!', 5000);
        console.log('User profile updated successfully.');
      } else {
        console.error('Failed to update user profile:', response.output);
        this.API.sendFeedback('error', 'Failed to update user profile.', 5000);
      }
    }).catch((error) => {
      console.error('Error updating user profile:', error);
      this.API.sendFeedback('error', 'An error occurred while updating the profile.', 5000);
    });
  }


  refreshUserData() {
    const targetTable = this.user.role === 'superadmin' || this.user.role === 'admin' ? 'administrators' : 'desk_attendants';

    // Adjust the read call based on the user's role
    this.API.read({
      selectors: ['*'],  // Adjust this to select specific fields if needed
      tables: targetTable,
      conditions: `WHERE id = '${this.user.id}'`
    }).then((response) => {
      if (response.success && response.output && response.output.length > 0) {
        // Update the user object with the latest data from the backend.
        this.user = response.output[0];  // Assuming the API returns the updated user data as the first item in output
        console.log('User data successfully refreshed:', this.user);
      } else {
        console.error('Failed to refresh user data:', response.output);
        this.API.sendFeedback('error', 'Failed to fetch updated user data.', 5000);
      }
    }).catch((error) => {
      console.error('Error refreshing user data:', error);
      this.API.sendFeedback('error', 'An error occurred while refreshing user data.', 5000);
    });
  }


  showPasswordModal = false;

initiatePasswordChange(): void {
  this.showPasswordModal = true;
}

closePasswordModal(): void {
  this.showPasswordModal = false;
  this.currentPassword = '';
  this.newPassword = '';
  this.confirmNewPassword = '';
}
  changePassword(): void {
    if (this.newPassword !== this.confirmNewPassword) {
      this.API.sendFeedback('error', 'Passwords do not match', 5000);
      return;
    }

    if (this.newPassword.length < 8) {
      this.API.sendFeedback('error', 'Password must be at least 8 characters long', 5000);
      return;
    }

    // Add your password change API logic here
    console.log('Changing password:', {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
    });

    // After successful password change:
    this.closePasswordModal();
    this.API.sendFeedback('success', 'Password updated successfully', 5000);
  }


handlePasswordChange(data: {currentPassword: string, newPassword: string}): void {
  // Your API call to change password
  // Close modal after successful change
  this.closePasswordModal();
}



  closeModal(): void {
    this.showModal = false;
  }

}


