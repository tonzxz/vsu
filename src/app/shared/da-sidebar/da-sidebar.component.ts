// da-sidebar.component.ts
import { Component, Input, Output, EventEmitter, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

interface MenuItem {
  title: string;
  route: string;
  active: boolean;
  icon: string;
}

@Component({
  selector: 'app-da-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './da-sidebar.component.html',
  styleUrls: ['./da-sidebar.component.css']
})
export class DaSidebarComponent implements OnInit {
  @Input() isExpanded: boolean = true; // Receives the current state from the parent
  @Input() isMobile: boolean = false;  // Receives the mobile state from the parent
  

  appTitle = 'Visayas State University';

  menuItems: MenuItem[] = [
    { title: 'Dashboard', route: '/desk-attendant/dashboard', active: true, icon: 'dashboard' },
    { title: 'Content Management', route: '/desk-attendant/contentmgmt', active: false, icon: 'content_paste' },
    { title: 'Terminal Management', route: '/desk-attendant/terminalmgmt', active: false, icon: 'computer' },
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.updateActiveItem();
    // Subscribe to router events to update active menu item on navigation
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateActiveItem();
    });
  }

  // Emit the toggle event to the parent component

  toggleSidebar(): void {
    this.isExpanded = !this.isExpanded;
  }
  // Set the active menu item and navigate
  setActiveItem(index: number): void {
    this.menuItems.forEach(item => item.active = false);
    this.menuItems[index].active = true;
    this.router.navigate([this.menuItems[index].route]);
    
  }

  // Update active menu item based on current route
  private updateActiveItem(): void {
    const currentRoute = this.router.url;
    this.menuItems.forEach(item => {
      item.active = this.router.isActive(item.route, {
        paths: 'exact',
        queryParams: 'ignored',
        fragment: 'ignored',
        matrixParams: 'ignored',
      });
    });
  }

  // Logout function to navigate to login page
  logout(): void {
    // Implement your logout logic here (e.g., clearing tokens)
    this.router.navigate(['/login']);
  }
}
