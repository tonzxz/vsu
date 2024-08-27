import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login-layout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './login-layout.component.html',
  styleUrls: ['./login-layout.component.css']
})
export class LoginLayoutComponent {
  username: string = '';
  password: string = '';
  roles: any[] = [
    { name: 'Admin', route: '/login-as', role: 'ADMIN', tabindex: 0 },
    { name: 'Kiosk', route: '/kiosk-selection', role: 'KIOSK', tabindex: 1 },
    { name: 'Desk Attendant', route: '/login-as', role: 'DESK ATTENDANT', tabindex: 2 },
    { name: 'Queue Display', route: '/queueing-selection', role: 'QUEUE_DISPLAY', tabindex: 3 }
  ];
  selectedRole: any;

  constructor(private router: Router) {}

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
