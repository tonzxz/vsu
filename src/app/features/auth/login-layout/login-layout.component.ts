import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UswagonAuthService } from 'uswagon-auth';

@Component({
  selector: 'app-login-layout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './login-layout.component.html',
  styleUrls: ['./login-layout.component.css']
})
export class LoginLayoutComponent implements OnInit {
  username: string = '';
  password: string = '';
  roles: any[] = [
    { name: 'Admin', route: '/login-as', role: 'admin', tabindex: 0 },
    { name: 'Kiosk', route: '/kiosk-selection', role: 'kiosk', tabindex: 1 },
    { name: 'Desk Attendant', route: '/login-as', role: 'desk_attendants', tabindex: 2 },
    { name: 'Queue Display', route: '/queueing-selection', role: 'queue_display', tabindex: 3 }
  ];
  selectedRole: any;

  constructor(private router: Router, private auth:UswagonAuthService) {}

  ngOnInit(): void {
    const userole = this.auth.accountLoggedIn();

    if(userole == 'desk_attendants'){
      this.router.navigate(['/desk-attendant/dashboard']);
    }
    if(userole != null){
      this.router.navigate(['/admin/dashboard']);
    }
  }

  updateRole(roleName: string): void {
    const role = this.roles.find(r => r.name === roleName);
    if (role) {
      this.selectedRole = role;
      this.setTabIndexes(role.tabindex);
      console.log(`Selected Role: ${role.name}`); // Log the role name to the console
      this.router.navigate([role.route], {
        queryParams: { role: role.role } // Ensure the correct role is passed
      });
    }
  }
  

  setTabIndexes(selectedTabIndex: number) {
    this.roles.forEach(role => {
      role.tabindex = role.tabindex === selectedTabIndex ? 0 : -1;
    });
  }
}
