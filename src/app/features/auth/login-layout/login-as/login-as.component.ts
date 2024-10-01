import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { UserService, User, KioskUser } from '../../../../services/user.service';

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
  kioskCode: string = '';
  selectedRole: string = '';
  returnUrl: string = '/';
  errorMessage: string = '';

  backgroundImageUrl: string = 'https://cdn.builder.io/api/v1/image/assets/TEMP/4a5c72fd598e49614aaa41b6e88bd5f08fef538407efee83459a593d2d0e5a55?placeholderIfAbsent=true&apiKey=f35c25b17acb406083beeda46a28c843';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.selectedRole = this.route.snapshot.queryParams['role'] || '';
  }

  onSubmit() {
    const user = this.userService.getAllUsers().find(u => 
      u.username === this.username && 
      u.password === this.password &&
      this.isUserTypeMatchingRole(u.type, this.selectedRole)
    );

    if (user) {
      console.log('Login successful');
      this.userService.setCurrentUser(user);

      let route = this.returnUrl;
      if (user.role.toLowerCase() === 'admin') {
        route = '/admin/dashboard';
      } else if (user.role.toLowerCase() === 'desk attendant') {
        route = '/desk-attendant/dashboard';
      }
      
      this.router.navigateByUrl(route);
    } else {
      console.log('Invalid username or password');
      this.showError('Invalid username or password');
    }
  }

  private isUserTypeMatchingRole(userType: string, roleName: string): boolean {
    const lowerUserType = userType.toLowerCase();
    const lowerRoleName = roleName.toLowerCase();

    if (lowerRoleName === 'admin') return lowerUserType === 'admin';
    if (lowerRoleName === 'desk attendant') return lowerUserType === 'desk attendant';
    return false;
  }

  showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }

  // Implement getLoginAs method
  getLoginAs(): string {
    return this.selectedRole.charAt(0).toUpperCase() + this.selectedRole.slice(1);
  }
}
