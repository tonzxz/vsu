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
    { username: 'TestUser', fullName: 'Test Name', location: 'Registrar', type: 'Desk attendant', status: 'Active', password: '' },
    // Add more users here for testing
  ];

  performanceMetrics = {
    totalCheckIns: 43212,
    averageCheckInTime: '7:30 mins',
    totalCheckInsToday: 1345,
    totalCheckInsThisWeek: 13124,
    averageTimeService: '7:30 mins',
    rating: 4
  };

  selectedUser: string = '';
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

  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  Math = Math; // Make Math available in the template

  ngOnInit() {
    this.filteredUsers = this.users;
    this.updatePagination();
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.resetNewAccount();
  }

  createNewAccount() {
    if (this.isFormValid()) {
      if (this.selectedUser) {
        this.updateUser();
      } else {
        this.users.push({ ...this.newAccount });
        this.filteredUsers = [...this.users];
        this.closeModal();
        this.updatePagination();
      }
    } else {
      console.log('Please fill in all fields');
    }
  }

  private updateUser() {
    const index = this.users.findIndex(user => user.username === this.selectedUser);
    if (index > -1) {
      this.users[index] = { ...this.newAccount };
      this.filteredUsers = [...this.users];
      this.closeModal();
      this.updatePagination();
      this.selectedUser = '';
    }
  }

  isFormValid(): boolean {
    return this.newAccount.username.trim() !== '' &&
           this.newAccount.fullName.trim() !== '' &&
           this.newAccount.location !== '' &&
           this.newAccount.type !== '' &&
           this.newAccount.password.trim() !== '';
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
    this.selectedUser = user.username;
    this.newAccount = { ...user };
    this.showModal = true;
    // Implement additional logic if needed
  }

  deleteUser(user: User) {
    const index = this.users.indexOf(user);
    if (index > -1) {
      this.users.splice(index, 1);
      this.filteredUsers = [...this.users];
      this.updatePagination();
    }
  }

  searchUsers() {
    this.filteredUsers = this.users.filter(user =>
      user.username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      user.fullName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      user.location.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      user.type.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  get paginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(startIndex, startIndex + this.pageSize);
  }
}
