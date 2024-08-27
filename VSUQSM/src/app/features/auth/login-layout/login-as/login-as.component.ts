import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';

interface Role {
  [x: string]: any;
  name: string;
  route: string;
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
  selectedRole: Role = { name: '', route: '/admin/dashboard' }; // Provide a default value
  roles: any[] = [
    { name: 'Admin', route: '/admin/dashboard', role: 'ADMIN', tabindex: 0 },
    { name: 'Kiosk', route: '/kiosk-selection', role: 'KIOSK', tabindex: 1 },
    { name: 'Desk Attendant', route: '/desk-attendant/dashboard', role: 'DESK ATTENDANT', tabindex: 2 },
    { name: 'Queue Display', route: '/queueing-selection', role: 'QUEUE_DISPLAY', tabindex: 3 }
  ];
  
  backgroundImageUrl: string = 'https://cdn.builder.io/api/v1/image/assets/TEMP/4a5c72fd598e49614aaa41b6e88bd5f08fef538407efee83459a593d2d0e5a55?placeholderIfAbsent=true&apiKey=f35c25b17acb406083beeda46a28c843';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const role = params['role'];
      console.log(`Query Param Role: ${role}`); // Log the role from query parameters
      this.selectedRole = this.roles.find(r => r['role'] === role) || this.selectedRole;
      console.log(`Selected Role on Init: ${this.selectedRole.name}`); // Log the selected role
    });
  }
  

  onSubmit() {
    // Log the login details
    console.log('Submit button clicked');
    console.log(`Logging in as ${this.selectedRole.name}`);
    console.log(`Username: ${this.username}`);
    console.log(`Password: ${this.password}`);
    // You can add your authentication logic here

    // Navigate to the route based on the selected role
    if (this.selectedRole) {
      this.router.navigate([this.selectedRole.route]);
    }
  }

  getLoginAs() {
    return this.selectedRole ? this.selectedRole.name : 'LOGIN AS';
  }
}
