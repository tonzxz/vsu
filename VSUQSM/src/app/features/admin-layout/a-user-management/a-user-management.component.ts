import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateAccountModalComponent } from './create-account-modal/create-account-modal.component';

// Define the User interface to represent user data
interface User {
  username: string;
  fullName: string;
  location: string;
  type: string;
  status: 'Active' | 'Inactive';
  password?: string;
}

@Component({
  selector: 'app-user-management',
  templateUrl: './a-user-management.component.html',
  styleUrls: ['./a-user-management.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, CreateAccountModalComponent]
})
export class AUserManagementComponent implements OnInit {
  // Expose Math functions to the template
  Math = Math;

  // Arrays to hold the list of users and the filtered users
  users: User[] = [];
  filteredUsers: User[] = [];

  // Variables for search, modal control, and user selection
  searchQuery = '';
  showModal = false;
  selectedUser: User | null = null;

  // Predefined lists for locations and account types
  locations = ['Accounting Office', 'Registrar', 'Admin Office'];
  accountTypes = ['Desk attendant', 'Manager', 'Admin'];

  // Variables for pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  // Boolean to determine if the modal is in editing mode
  isEditing = false;

  // Placeholder for performance metrics (static data)
  performanceMetrics = {
    totalCheckIns: 43212,
    totalCheckInsToday: 1345,
    averageTimeService: '7:30 mins'
  };

  ngOnInit() {
    // Initialize the component with some test data
    this.users = [
      { username: 'testuser', fullName: 'Test User', location: 'Accounting Office', type: 'Desk attendant', status: 'Active' },
      { username: 'jhielo', fullName: 'Jhielo Gonzales', location: 'Accounting Office', type: 'Manager', status: 'Active' },
      // Add more test users here if needed
    ];

    // Copy the initial user list to the filtered list and update pagination
    this.filteredUsers = [...this.users];
    this.updatePagination();
  }

  // Method to filter users based on the search query
  searchUsers() {
    this.filteredUsers = this.users.filter(user =>
      user.username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      user.fullName.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.updatePagination();
  }

  // Method to open the create/edit account modal
  openModal() {
    this.showModal = true;
    this.isEditing = false;
    this.selectedUser = null;
  }

  // Method to close the modal and reset selected user
  closeModal() {
    this.showModal = false;
    this.selectedUser = null;
  }

  // Method to handle account creation or update after the modal form is submitted
  onAccountCreated(newAccount: User) {
    if (this.isEditing && this.selectedUser) {
      // Update the existing user in the list
      const index = this.users.findIndex(u => u.username === this.selectedUser!.username);
      if (index !== -1) {
        this.users[index] = newAccount;
      }
    } else {
      // Add a new user to the list
      this.users.push(newAccount);
    }

    // Update the filtered users list and pagination, then close the modal
    this.filteredUsers = [...this.users];
    this.updatePagination();
    this.closeModal();
  }

  // Method to enter editing mode for a specific user
  editUser(user: User) {
    this.selectedUser = { ...user };
    this.isEditing = true;
    this.showModal = true;
  }

  // Method to delete a user from the list
  deleteUser(user: User) {
    const index = this.users.indexOf(user);
    if (index > -1) {
      this.users.splice(index, 1);
      this.filteredUsers = this.filteredUsers.filter(u => u !== user);
      this.updatePagination();
    }
  }

  // Method to update pagination details based on the filtered users list
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);
    this.currentPage = 1;
  }

  // Getter to retrieve the users to be displayed on the current page
  get paginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(startIndex, startIndex + this.pageSize);
  }

  // Method to navigate to the previous page
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Method to navigate to the next page
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
}
