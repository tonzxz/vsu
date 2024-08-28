//a-user-management.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateAccountModalComponent } from './create-account-modal/create-account-modal.component';

// Updated User interface
interface User {
  username: string;
  fullName: string;
  location: string;
  type: string;
  status: 'Enable' | 'Disable';
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
  Math = Math;

  users: User[] = [];
  filteredUsers: User[] = [];

  searchQuery = '';
  showModal = false;
  selectedUser: User | null = null;

  locations = ['Accounting Office', 'Registrar', 'Cash Division'];
  accountTypes = ['Desk attendant', 'Kiosk', 'Queue Display'];

  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  isEditing = false;

  performanceMetrics = {
    totalCheckIns: 43212,
    totalCheckInsToday: 1345,
    averageTimeService: '7:30 mins'
  };

  ngOnInit() {
    this.users = [
      { username: 'Carlo', fullName: 'Carlo Batumbakal', location: 'Accounting Office', type: 'Desk Attendant', status: 'Enable' },
      { username: 'Jhielo', fullName: 'Jhielo Gonzales', location: 'Accounting Office', type: 'Kiosk', status: 'Enable', password: 'O^P!DApB@Rr#'},
      { username: 'Orlan', fullName: 'Jan Orlan Cardona', location: 'Registrar', type: 'Kiosk', status: 'Disable', password: 'lg4PZz5O8$Sg'},
      { username: 'Sean', fullName: 'Sean Palacay', location: 'Cash Division', type: 'Kiosk', status: 'Enable', password: 'AJG8&726tr5s'},
    ];

    this.filteredUsers = [...this.users];
    this.updatePagination();
  }

  searchUsers() {
    this.filteredUsers = this.users.filter(user =>
      user.username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      user.fullName.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
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

  onAccountCreated(newAccount: User) {
    if (this.isEditing && this.selectedUser) {
      const index = this.users.findIndex(u => u.username === this.selectedUser!.username);
      if (index !== -1) {
        this.users[index] = newAccount;
      }
    } else {
      this.users.push(newAccount);
    }

    this.filteredUsers = [...this.users];
    this.updatePagination();
    this.closeModal();
  }

  editUser(user: User) {
    this.selectedUser = { ...user };
    this.isEditing = true;
    this.showModal = true;
  }

  deleteUser(user: User) {
    const index = this.users.indexOf(user);
    if (index > -1) {
      this.users.splice(index, 1);
      this.filteredUsers = this.filteredUsers.filter(u => u !== user);
      this.updatePagination();
    }
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);
    this.currentPage = 1;
  }

  get paginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(startIndex, startIndex + this.pageSize);
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
}