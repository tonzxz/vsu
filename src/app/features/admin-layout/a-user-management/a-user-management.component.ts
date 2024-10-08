// a-user-management.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateAccountModalComponent } from './create-account-modal/create-account-modal.component';
import { AdminService } from '../../../services/admin.service';

// User interface with a selected property for checkbox functionality
interface User {
  username: string;
  fullName: string;
  department: string;
  type: string;
  status: 'Online' | 'Offline';
  location?: string;  // Optional field
  password?: string;  // Optional field
  selected?: boolean; // Property to manage row selection
}

@Component({
  selector: 'app-user-management',
  templateUrl: './a-user-management.component.html',
  styleUrls: ['./a-user-management.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, CreateAccountModalComponent],
})


export class AUserManagementComponent implements OnInit {


  constructor(private adminService: AdminService) {

  }
  // Complete list of users
  users: User[] = [];

  // Users filtered based on search query
  filteredUsers: User[] = [];

  // Array to store selected users
  selectedUsers: User[] = [];

  // Search query string
  searchQuery = '';

  // Controls the visibility of the Create/Edit Account modal
  showModal = false;

  // The user currently being edited (if any)
  selectedUser: User | null = null;

  // Predefined departments and account types
  departments = ['Accounting Office', 'Registrar', 'Cash Division'];
  accountTypes = ['Desk Attendant', 'Kiosk', 'Queue Display'];

  // Pagination variables
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  // Flag to determine if the modal is in edit mode
  isEditing = false;

  // User performance metrics
  performanceMetrics = {
    totalCheckIns: 43212,
    totalCheckInsToday: 1345,
    averageTimeService: '7:30 mins',
  };


  ngOnInit() {  
    
    this.adminService.fetchUsers();
    this.filteredUsers = [...this.users];
    this.updatePagination();
  }


  searchUsers() {
    const query = this.searchQuery.trim().toLowerCase();
    if (query) {
      this.filteredUsers = this.users.filter(
        (user) =>
          user.username.toLowerCase().includes(query) ||
          user.fullName.toLowerCase().includes(query)
      );
    } else {
      this.filteredUsers = [...this.users];
    }
    this.updatePagination();
  }

  
  openModal() {
    this.showModal = true;
    this.isEditing = false;
    this.selectedUser = null;
  }

  
  closeModal() {
    this.showModal = false;
    this.selectedUser = null;
  }

  /**
   * Handles the creation or updating of a user account.
   * @param newAccount The new or updated user account.
   */
  onAccountCreated(newAccount: User) {
    if (this.isEditing && this.selectedUser) {
      const index = this.users.findIndex(
        (u) => u.username === this.selectedUser!.username
      );
      if (index !== -1) {
        // Preserve status and password if not updated
        newAccount.status = this.users[index].status;
        if (!newAccount.password) {
          newAccount.password = this.users[index].password;
        }
        this.users[index] = { ...newAccount, selected: false };
      }
      // Remove from selectedUsers if present
      this.selectedUsers = this.selectedUsers.filter(u => u.username !== this.selectedUser!.username);
    } else {
      this.users.push({ ...newAccount, selected: false });
    }
  
    this.filteredUsers = [...this.users];
    this.updatePagination();
    this.closeModal();
  }

  /**
   * Opens the modal in edit mode for a specific user.
   * @param user The user to be edited.
   */
  editUser(user: User) {
    this.selectedUser = { ...user };
    this.isEditing = true;
    this.showModal = true;
  }

  /**
   * Deletes a specific user from the list.
   * @param user The user to be deleted.
   */
  deleteUser(user: User) {
    this.users = this.users.filter((u) => u.username !== user.username);
    this.filteredUsers = this.filteredUsers.filter((u) => u.username !== user.username);
    // Also remove from selectedUsers if present
    this.selectedUsers = this.selectedUsers.filter((u) => u.username !== user.username);
    this.updatePagination();
  }

  /**
   * Updates the selectedUsers array based on individual checkbox state.
   * @param user The user whose selection state has changed.
   */
  updateSelectedUsers(user: User) {
    if (user.selected) {
      if (!this.selectedUsers.find(u => u.username === user.username)) {
        this.selectedUsers.push(user);
      }
    } else {
      this.selectedUsers = this.selectedUsers.filter((u) => u.username !== user.username);
    }
  }

  /**
   * Toggles the selection of all users on the current page.
   * @param event The change event from the select all checkbox.
   */
  toggleSelectAll(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const paginated = this.paginatedUsers;

    paginated.forEach((user) => {
      user.selected = isChecked;
      if (isChecked) {
        if (!this.selectedUsers.find(u => u.username === user.username)) {
          this.selectedUsers.push(user);
        }
      } else {
        this.selectedUsers = this.selectedUsers.filter((u) => u.username !== user.username);
      }
    });
  }

  /**
   * Initiates editing for the first selected user.
   * Assumes only one user is selected for editing.
   */
  editSelectedUser() {
    if (this.selectedUsers.length === 1) {
      this.editUser(this.selectedUsers[0]);
    }
  }

  /**
   * Deletes all selected users from the list.
   */
  deleteSelectedUsers() {
    // Clone the selectedUsers array to prevent mutation issues during iteration
    const usersToDelete = [...this.selectedUsers];
    usersToDelete.forEach((user) => this.deleteUser(user));
    this.selectedUsers = [];
  }

  /**
   * Updates pagination details based on the current filteredUsers list.
   */
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.pageSize) || 1;
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
  }

  /**
   * Retrieves the users to be displayed on the current page.
   */
  get paginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(startIndex, startIndex + this.pageSize);
  }

  /**
   * Navigates to the previous page in pagination.
   */
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  /**
   * Navigates to the next page in pagination.
   */
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  /**
   * Navigates to a specific page number in pagination.
   * @param page The page number to navigate to.
   */
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  /**
   * Toggles the selection of a user when the row is clicked.
   * @param user The user whose row has been clicked.
   */
  toggleRowSelection(user: User) {
    user.selected = !user.selected;
    this.updateSelectedUsers(user);
  }
}
