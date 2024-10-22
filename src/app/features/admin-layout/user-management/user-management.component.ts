import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UswagonCoreService } from 'uswagon-core';
import { CreateAccountModalComponent } from "./create-account-modal/create-account-modal.component";
import { UswagonAuthService } from 'uswagon-auth';
import { LottieAnimationComponent } from '../../../shared/components/lottie-animation/lottie-animation.component';
import { environment } from '../../../../environment/environment';

interface User {
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
  name:string;
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
  isSuperAdmin: boolean = this.auth.accountLoggedIn() == 'superadmin';


  divisions: Divisions[] = [];

  constructor(private API: UswagonCoreService, private auth:UswagonAuthService) {}

  ngOnInit() {
    this.loadData();


  }

  async loadData(){
    this.API.setLoading(true);
    await this.fetchUsers();
    await this.fetchDivisions();
    this.API.setLoading(false);
  }

  async fetchDivisions(){
    const data = await this.API.read({
      selectors: [
        '*'
      ],
      tables: 'divisions',
      conditions: `WHERE id != '${environment.administrators}'`
    });

    if(data.success){
      this.divisions  = data.output as Divisions[];
      if(!this.isSuperAdmin){
        this.divisions = this.divisions.filter((division)=> division.id == this.auth.getUser().division_id );
      }
    }else{
      throw new Error('Something went wrong');
    }

  }

  async fetchUsers() {
    let conditions ='';

    if(this.isSuperAdmin){
      conditions =  `WHERE divisions.id = desk_attendants.division_id`;
    }else{
       conditions =  `WHERE divisions.id = desk_attendants.division_id AND divisions.id = '${this.auth.getUser().division_id}'`
    }

    const data = await this.API.read({
      selectors: [
        'desk_attendants.*, divisions.name as division'
      ],
      tables: 'desk_attendants,divisions',
      conditions:conditions
    });

    if (data.success && data.output.length > 0) {
      this.users = await Promise.all(data.output.map(async (user: {
        password: any;
        fullname: any;
        username: any;
        id: string;
        profile: string;
        division_id: string;
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
          division_id: user.division_id,
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
        this.API.sendFeedback('success', 'User has been deleted!',5000);
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
        this.API.sendFeedback('success', 'User has been updated!',5000);
      }

    } else {
      const newUser: User = {
        ...partialUser,
        division: this.divisions.find( (division)=> division.id == partialUser.division_id)?.name,
        is_online: false,
        number: ''
      } as User;
      this.API.sendFeedback('success', 'New user has been added!',5000);
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
