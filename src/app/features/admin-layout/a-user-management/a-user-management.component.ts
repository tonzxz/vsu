import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UswagonCoreService } from 'uswagon-core';
import { CreateAccountModalComponent } from "./create-account-modal/create-account-modal.component";

interface User {
  id: string;
  number: string;
  fullname: string;
  username: string;
  division: string;
  is_online: boolean;
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

  constructor(private API: UswagonCoreService) {}

  ngOnInit() {
    this.fetchUsers();
  }

  // get

  async fetchUsers() {
    const data = await this.API.read({
      selectors: [
        'terminals.id',
        'terminals.number',
        'desk_attendants.fullname',
        'desk_attendants.username',
        'divisions.name AS division',
        'terminals.is_online'
      ],
      tables: 'terminals',
      conditions: `
        LEFT JOIN desk_attendants ON terminals.desk_attendant_id = desk_attendants.id
        LEFT JOIN divisions ON terminals.division_id = divisions.id
      `
    });

    if (data.success && data.output.length > 0) {
      this.users = data.output;
      this.filteredUsers = [...this.users];
      this.setCurrentUser(this.users[0]); 
      console.log('Users fetched:', this.users);
    } else {
      console.error('No users found or query failed');
    }
  }

  // create account

  async createUsers() {
    
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
    // You might want to fetch or update performance metrics for the selected user here
  }

  createNewAccount() {
    // Implement create new account functionality
  }

  deleteUser(user: User) {
    // Implement delete user functionality
  }

  viewUserDetails(user: User) {
    this.setCurrentUser(user);
  }



}