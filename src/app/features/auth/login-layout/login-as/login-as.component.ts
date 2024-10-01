import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AdminService, Admin } from '../../../../services/admin.service';

interface Role {
  name: string;
  route: string;
  role: string;
  tabindex: number;
}

@Component({
  selector: 'app-login-as',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login-as.component.html',
  styleUrls: ['./login-as.component.css']
})
export class LoginAsComponent implements OnInit {
  username: string = '';
  password: string = '';
  selectedRole: Role = { name: '', route: '/admin/dashboard', role: '', tabindex: 0 };
  roles: Role[] = [
    { name: 'Admin', route: '/admin/dashboard', role: 'ADMIN', tabindex: 0 },
    { name: 'Kiosk', route: '/kiosk-selection', role: 'KIOSK', tabindex: 1 },
    { name: 'Desk Attendant', route: '/desk-attendant/dashboard', role: 'DESK ATTENDANT', tabindex: 2 },
    { name: 'Queue Display', route: '/queueing-selection', role: 'QUEUE_DISPLAY', tabindex: 3 }
  ];
  
  backgroundImageUrl: string = 'https://cdn.builder.io/api/v1/image/assets/TEMP/4a5c72fd598e49614aaa41b6e88bd5f08fef538407efee83459a593d2d0e5a55?placeholderIfAbsent=true&apiKey=f35c25b17acb406083beeda46a28c843';
  errorMessage: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private adminService: AdminService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const role = params['role'];
      console.log(`Query Param Role: ${role}`);
      this.selectedRole = this.roles.find(r => r.role === role) || this.selectedRole;
      console.log(`Selected Role on Init: ${this.selectedRole.name}`);
    });
  }

  onSubmit() {
    console.log('Submit button clicked');
    console.log(`Logging in as ${this.selectedRole.name}`);
    console.log(`Username: ${this.username}`);
    console.log(`Password: ${this.password}`);

    const users: Admin[] = this.adminService.getUsers();
    const user = users.find(u => u.username === this.username && u.password === this.password);

    if (user) {
      if (this.isUserTypeMatchingRole(user.type, this.selectedRole.name)) {
        console.log('Login successful');
        this.router.navigate([this.selectedRole.route]);
      } else {
        console.log('User type does not match selected role');
        this.showError('User type does not match selected role');
      }
    } else {
      console.log('Invalid username or password');
      this.showError('Invalid username or password');
    }
  }

  private isUserTypeMatchingRole(userType: string, roleName: string): boolean {
    const lowerUserType = userType.toLowerCase();
    const lowerRoleName = roleName.toLowerCase();

    if (lowerRoleName === 'admin') return lowerUserType === 'admin';
    if (lowerRoleName === 'kiosk') return lowerUserType === 'kiosk';
    if (lowerRoleName === 'desk attendant') return lowerUserType === 'desk attendant';
    if (lowerRoleName === 'queue display') return lowerUserType === 'queue display';

    return false;
  }

  getLoginAs() {
    return this.selectedRole ? this.selectedRole.name : 'LOGIN AS';
  }

  showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 5000); // Clear error message after 5 seconds
  }
}