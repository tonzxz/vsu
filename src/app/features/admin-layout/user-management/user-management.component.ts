import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UswagonCoreService } from 'uswagon-core';
import { CreateAccountModalComponent } from "./create-account-modal/create-account-modal.component";
import { UswagonAuthService } from 'uswagon-auth';
import { LottieAnimationComponent } from '../../../shared/components/lottie-animation/lottie-animation.component';
import { environment } from '../../../../environment/environment';

interface User {
  role: string;
  id: string;
  username: string;
  fullname: string;
  division_id: string;
  division: string;
  is_online: boolean;
  number: string;
  profile?: string;
  password?: string;
}

interface Divisions { 
  id: string;
  name: string;
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
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, CreateAccountModalComponent, LottieAnimationComponent],
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  paginatedUsers: User[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
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
  isSuperAdmin: boolean = this.auth.accountLoggedIn() === 'superadmin';

  divisions: Divisions[] = [];

  constructor(private API: UswagonCoreService, private auth: UswagonAuthService) {}

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    this.API.setLoading(true);
    const [users, divisions] = await Promise.all([this.fetchUsers(), this.fetchDivisions()]);
    this.users = users;
    this.filteredUsers = [...this.users];
    this.updatePagination();
    this.API.setLoading(false);
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);
    this.paginatedUsers = this.filteredUsers.slice(
      (this.currentPage - 1) * this.pageSize,
      this.currentPage * this.pageSize
    );
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  searchUsers() {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredUsers = this.users.filter(user => 
      user.username.toLowerCase().includes(query) ||
      user.fullname.toLowerCase().includes(query) ||
      user.division.toLowerCase().includes(query)
    );
    this.currentPage = 1; // Reset to the first page after searching
    this.updatePagination();
  }

  async fetchDivisions() {
    const data = await this.API.read({
      selectors: ['*'],
      tables: 'divisions',
      conditions: `WHERE id != '${environment.administrators}'`
    });

    if (data.success) {
      this.divisions = data.output as Divisions[];
      if (!this.isSuperAdmin) {
        this.divisions = this.divisions.filter(
          division => division.id === this.auth.getUser().division_id
        );
      }
    } else {
      throw new Error('Failed to fetch divisions');
    }

    return this.divisions;
  }

  async fetchUsers(): Promise<User[]> {
    const conditions = this.isSuperAdmin
      ? 'WHERE divisions.id = desk_attendants.division_id'
      : `WHERE divisions.id = desk_attendants.division_id AND divisions.id = '${this.auth.getUser().division_id}'`;

    // Fetch users from both desk attendants and administrators in parallel
    const [deskAttendantData, adminData] = await Promise.all([
      this.API.read({
        selectors: ['desk_attendants.*, divisions.name as division'],
        tables: 'desk_attendants, divisions',
        conditions: conditions
      }),
      this.API.read({
        selectors: ['administrators.*, divisions.name as division'],
        tables: 'administrators, divisions',
        conditions: conditions.replace('desk_attendants', 'administrators')
      })
    ]);

    let users: User[] = [];

    // Combine and process users concurrently using map and async functions.
    if (deskAttendantData.success) {
      const deskAttendants = deskAttendantData.output.map((user: any) => this.processUser(user, 'Desk attendant'));
      users.push(...await Promise.all(deskAttendants));
    }

    if (adminData.success) {
      const admins = adminData.output.map((user: any) => this.processUser(user, user.role || 'Administrator'));
      users.push(...await Promise.all(admins));
    }

    console.log('Users fetched:', users);
    return users;
  }

  async processUser(user: any, role: string): Promise<User> {
    const decryptedPassword = await this.API.decrypt(user.password);
    return {
      id: user.id,
      fullname: user.fullname,
      username: user.username,
      profile: this.getImageURL(user.profile),
      password: decryptedPassword,
      division_id: user.division_id,
      division: user.division || 'Not Available',
      is_online: user.is_online,
      role: role,
      number: user.number || '' // Defaulting to an empty string if 'number' is not available.
    };
  }
  

  getImageURL(file: string): string | undefined {
    return this.API.getFileURL(file);
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
    if (!confirmed) return;

    try {
      const response = await this.API.delete({
        tables: user.role === 'Desk attendant' ? 'desk_attendants' : 'administrators',
        conditions: `WHERE id = '${user.id}'`
      });

      if (response && response.success) {
        this.users = this.users.filter(u => u.id !== user.id);
        this.filteredUsers = this.filteredUsers.filter(u => u.id !== user.id);
        this.API.sendFeedback('success', 'User has been deleted!', 5000);
        console.log('User deleted successfully:', user.fullname);
      } else {
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
    try {
      await this.loadData();
  
      this.API.sendFeedback('success', this.selectedUser ? 'User has been updated!' : 'New user has been added!', 5000);
    } catch (error) {
      console.error('Error while refreshing user list:', error);
      this.API.sendFeedback('error', 'An error occurred while refreshing the user list.', 5000);
    } finally {
      this.closeModal();
    }
  }
  

  editUser(user: User) {
    this.selectedUser = user;
    this.showModal = true;
  }
}