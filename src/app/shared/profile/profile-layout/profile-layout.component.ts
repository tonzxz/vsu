import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UswagonAuthService } from 'uswagon-auth';
import { UswagonCoreService } from 'uswagon-core';
import { gsap } from 'gsap';
import { CreateAccountModalComponent } from '../../../features/admin-layout/user-management/create-account-modal/create-account-modal.component';




interface User {
  id: string;
  fullname: string;
  username: string;
  division_id: string;
  position?: string;
  employeeId?: string;
  phone?: string;
  email?: string;
  department?: string;
  profile?: string;
}

interface Divisions {
  id: string;
  name: string;
}
@Component({
  selector: 'app-profile-layout',
  standalone: true,
  imports: [CommonModule, FormsModule,CreateAccountModalComponent],
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

  constructor(private auth: UswagonAuthService, private API: UswagonCoreService) {
    this.user = this.auth.getUser();
  }

  ngOnInit() {
    this.loadUserData();
    this.fetchDivisions();
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
    this.user = this.auth.getUser();
  }

  fetchDivisions() {
    this.API.read({
      selectors: ['*'],
      tables: 'divisions',
      conditions: ''
    }).then((data) => {
      if (data.success) {
        this.divisions = data.output as Divisions[];
      } else {
        console.error('Failed to fetch divisions');
      }
    });
  }

  getUserProfile() {
    return this.user.profile
      ? this.API.getFileURL(this.user.profile)
      : 'assets/images/noprofile.png';
  }


  editUser(): void {
    // Open the modal to edit the current user's details
    this.showModal = true;
  }

  saveUserInfo(updatedUser: Omit<User, 'password'>): void {
    console.log('Saving user info:', updatedUser);

    this.API.update({
      tables: 'desk_attendants',
      values: updatedUser,
      conditions: `WHERE id = '${this.user.id}'`
    }).then((response) => {
      if (response.success) {
        this.user = { ...this.user, ...updatedUser };
        this.closeModal();
        console.log('User profile updated successfully.');
      } else {
        console.error('Failed to update user profile:', response.output);
      }
    }).catch((error) => {
      console.error('Error updating user profile:', error);
    });
  }

  closeModal(): void {
    this.showModal = false;
  }


  updateProfile(): void {
    console.log('Updating profile:', this.user);
    // Implement API call to update the user profile
  }

  changePassword(): void {
    if (this.newPassword !== this.confirmNewPassword) {
      console.error('Passwords do not match');
      return;
    }
    console.log('Changing password:', {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
    });
    // Implement API call to change the password here
  }
}
