import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

interface MenuItem {
  title: string;
  route: string;
  active: boolean;
  svgIcon: string;  // Added svgIcon property
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './da-sidebar.component.html',
  styleUrls: ['./da-sidebar.component.css']
})
export class DaSidebarComponent {
  appTitle = 'Visayas State University';

  menuItems: MenuItem[] = [
    { 
      title: 'Dashboard', 
      route: '/desk-attendant/dashboard', 
      active: true, 
      svgIcon: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 21H26V26H24V21ZM20 16H22V26H20V16ZM11 26C9.67441 25.9984 8.40356 25.4711 7.46622 24.5338C6.52888 23.5964 6.00159 22.3256 6 21H8C8 21.5933 8.17595 22.1734 8.50559 22.6667C8.83524 23.1601 9.30377 23.5446 9.85195 23.7716C10.4001 23.9987 11.0033 24.0581 11.5853 23.9424C12.1672 23.8266 12.7018 23.5409 13.1213 23.1213C13.5409 22.7018 13.8266 22.1672 13.9424 21.5853C14.0581 21.0033 13.9987 20.4001 13.7716 19.8519C13.5446 19.3038 13.1601 18.8352 12.6667 18.5056C12.1734 18.1759 11.5933 18 11 18V16C12.3261 16 13.5979 16.5268 14.5355 17.4645C15.4732 18.4021 16 19.6739 16 21C16 22.3261 15.4732 23.5979 14.5355 24.5355C13.5979 25.4732 12.3261 26 11 26Z" fill="#2F4A2C"/>
        <path d="M28 2H4C3.46957 2 2.96086 2.21071 2.58579 2.58579C2.21071 2.96086 2 3.46957 2 4V28C2 28.5304 2.21071 29.0391 2.58579 29.4142C2.96086 29.7893 3.46957 30 4 30H28C28.5302 29.9992 29.0384 29.7882 29.4133 29.4133C29.7882 29.0384 29.9992 28.5302 30 28V4C30 3.46957 29.7893 2.96086 29.4142 2.58579C29.0391 2.21071 28.5304 2 28 2ZM28 11H14V4H28V11ZM12 4V11H4V4H12ZM4 28V13H28L28.002 28H4Z" fill="#2F4A2C"/>
      </svg>` 
    },
    { 
      title: 'Content Management', 
      route: '/desk-attendant/contentmgmt', 
      active: false,
      svgIcon: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 4H22V2H10V4ZM4 6H28C28.5304 6 29.0391 6.21071 29.4142 6.58579C29.7893 6.96086 30 7.46957 30 8V24C30 24.5304 29.7893 25.0391 29.4142 25.4142C29.0391 25.7893 28.5304 26 28 26H4C3.46957 26 2.96086 25.7893 2.58579 25.4142C2.21071 25.0391 2 24.5304 2 24V8C2 7.46957 2.21071 6.96086 2.58579 6.58579C2.96086 6.21071 3.46957 6 4 6ZM4 10V24H28V10H4ZM14 14H18C18.5304 14 19.0391 14.2107 19.4142 14.5858C19.7893 14.9609 20 15.4696 20 16V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H14C13.4696 22 12.9609 21.7893 12.5858 21.4142C12.2107 21.0391 12 20.5304 12 20V16C12 15.4696 12.2107 14.9609 12.5858 14.5858C12.9609 14.2107 13.4696 14 14 14ZM24 8H28V8.5V8Z" fill="#2F4A2C"/>
      </svg>` 
    },
    { 
      title: 'Terminal Management', 
      route: '/desk-attendant/terminalmgmt', 
      active: false,
      svgIcon: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 16C18.1217 16 20.1566 15.1571 21.6569 13.6569C23.1571 12.1566 24 10.1217 24 8C24 5.87827 23.1571 3.84344 21.6569 2.34315C20.1566 0.842854 18.1217 0 16 0C13.8783 0 11.8434 0.842854 10.3431 2.34315C8.84285 3.84344 8 5.87827 8 8C8 10.1217 8.84285 12.1566 10.3431 13.6569C11.8434 15.1571 13.8783 16 16 16ZM16 20C11.58 20 0 22.29 0 26.71V32H32V26.71C32 22.29 20.42 20 16 20Z" fill="#2F4A2C"/>
      </svg>` 
    },
      ];

  constructor(private router: Router) {}

  setActiveItem(index: number): void {
    this.menuItems.forEach(item => item.active = false);
    this.menuItems[index].active = true;
    this.router.navigate([this.menuItems[index].route]);
  }

  logout(): void {
    this.router.navigate(['login']);
  }
}
