import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UswagonCoreService } from 'uswagon-core';
import { CreateAccountModalComponent } from "./create-account-modal/create-account-modal.component";

interface User {
  id: string;
  username: string;
  fullname: string;
  division: string;
  is_online: boolean;
  number: string;
  profile?: string;
  password?: string;
}

interface PerformanceMetrics {
  totalCheckIns: number;
  averageCheckInTime: number;
  totalCheckInsToday: number;
  totalCheckInsThisWeek: number;
  averageTimeService: string;
  rating: number;
}

@Component({
  selector: 'app-user-management',
  templateUrl: './a-user-management.component.html',
  styleUrls: ['./a-user-management.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, CreateAccountModalComponent],
})
export class AUserManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchQuery = '';
  performanceMetrics: PerformanceMetrics = {
    totalCheckIns: 43212,
    averageCheckInTime: 43212,
    totalCheckInsToday: 1345,
    totalCheckInsThisWeek: 12124,
    averageTimeService: '7:30 mins',
    rating: 4
  };
  currentUser: User | null = null;
  showModal = false;
  selectedUser: User | null = null;

  constructor(private API: UswagonCoreService) {}

  ngOnInit() {
    this.fetchUsers();
 

  }



  async fetchUsers() {
    const data = await this.API.read({
      selectors: [
        '*'
      ],
      tables: 'desk_attendants',
      conditions: ``
    });
  
    if (data.success && data.output.length > 0) {
      this.users = await Promise.all(data.output.map(async (user: {
        password: any;
        fullname: any;
        username: any;
        id: string;
        profile: string;
        division: string;
        is_online: boolean;
      }) => {

        const decryptedPassword = await this.API.decrypt(user.password);
      
        return {
          id: user.id,
          fullname: user.fullname,
          username: user.username,
          profile: this.getImageURL(user.profile),
          password: decryptedPassword, 
          division: user.division || 'Not Available',
          is_online: user.is_online
        };
      }));
      
      this.filteredUsers = [...this.users];
      this.setCurrentUser(this.users[0]);
      console.log('Users fetched:', this.users);
    } else {
      console.error('No users found or query failed');
    }
  }
  
  
  getImageURL(file: string): string | undefined {
    return this.API.getFileURL(file);
  }

  searchUsers() {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredUsers = this.users.filter(user => 
      user.username.toLowerCase().includes(query) ||
      user.fullname.toLowerCase().includes(query) ||
      user.division.toLowerCase().includes(query)
    );
  }

  setCurrentUser(user: User) {
    this.currentUser = user;
  }

  createNewAccount() {
    this.selectedUser = null;
    this.showModal = true;
  }

  async deleteUser(user: User) {
   
    const confirmed = confirm(`Are you sure you want to delete ${user.fullname}?`);

    if (!confirmed) {
      return; 
    }

    try {
      if (!user.id) {
        console.error('User ID is undefined');
        alert('Failed to delete user: User ID is undefined');
        return;
      }

      const response = await this.API.delete({
        tables: 'desk_attendants',
        conditions: `WHERE id = '${user.id}'` 
      });

      if (response && response.success) {
        this.users = this.users.filter(u => u.id !== user.id);
        this.filteredUsers = this.filteredUsers.filter(u => u.id !== user.id);

        console.log('User deleted successfully:', user.fullname);
      } else {
        console.error('Failed to delete user:', response.output);
        alert(`Failed to delete user: ${response.output || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error occurred during user deletion:', error);
    }
  }

  viewUserDetails(user: User) {
    this.setCurrentUser(user);
  }

  closeModal() {
    this.showModal = false;
    this.selectedUser = null;
  }

  async onAccountCreated(partialUser: Partial<User>) {
    if (this.selectedUser) {
      const index = this.users.findIndex(u => u.id === partialUser.id);
      if (index !== -1) {
        this.users[index] = { ...this.users[index], ...partialUser };
      }
    } else {
      const newUser: User = {
        ...partialUser,
        division: 'NA',
        is_online: false,
        number: ''
      } as User;
      this.users.push(newUser);
    }
    this.closeModal();
    await this.fetchUsers(); 
  }

editUser(user: User) {
  this.selectedUser = user;  
  this.showModal = true;     
}

}
