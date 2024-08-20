import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  username: string;
  fullName: string;
  location: string;
  type: string;
  status: 'Active' | 'Inactive';
  password: string;
}

@Component({
  selector: 'a-user-management',
  templateUrl: './a-user-management.component.html',
  styleUrls: ['./a-user-management.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AUserManagementComponent implements OnInit {
  users: User[] = [
    { username: 'Test User', fullName: 'Test Name', location: 'Registrar', type: 'Desk attendant', status: 'Active', password: '' },
    // Add more users as needed
  ];

  performanceMetrics = {
    totalCheckIns: 43212,
    averageCheckInTime: '7:30 mins',
    totalCheckInsToday: 1345,
    totalCheckInsThisWeek: 12124,
    averageTimeService: '7:30 mins',
    rating: 4
  };

  selectedUser = 'Jhielo Gonzales';
  showModal = false;
  newAccount: User = {
    username: '',
    fullName: '',
    location: '',
    type: '',
    status: 'Active',
    password: ''
  };

  searchQuery = '';
  filteredUsers: User[] = [];
  locations = ['Accounting Office', 'Registrar', 'Admin Office'];
  accountTypes = ['Desk attendant', 'Manager', 'Admin'];

  ngOnInit() {
    this.filteredUsers = this.users;
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.resetNewAccount();
  }

  createNewAccount() {
    console.log('Creating new account with:', this.newAccount);
    if (this.newAccount.username && this.newAccount.fullName && this.newAccount.location && this.newAccount.type && this.newAccount.password) {
      this.users.push({ ...this.newAccount });
      this.filteredUsers = [...this.users];
      this.closeModal();
    } else {
      console.log('Please fill in all fields');
    }
  }
  

  private resetNewAccount() {
    this.newAccount = {
      username: '',
      fullName: '',
      location: '',
      type: '',
      status: 'Active',
      password: ''
    };
  }

  editUser(user: User) {
    console.log('Editing user:', user);
    // Implement edit functionality
  }

  deleteUser(user: User) {
    const index = this.users.indexOf(user);
    if (index > -1) {
      this.users.splice(index, 1);
      this.filteredUsers = [...this.users];
    }
  }

  searchUsers() {
    this.filteredUsers = this.users.filter(user =>
      user.username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      user.location.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      user.type.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
