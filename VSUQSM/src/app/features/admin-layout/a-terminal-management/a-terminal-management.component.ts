import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Counter {
  id: number;
  name: string;
  isActive: boolean;
}

@Component({
  selector: 'app-terminal-management',
  templateUrl: './a-terminal-management.component.html',
  styleUrls: ['./a-terminal-management.component.css']
})
export class ATerminalManagementComponent implements OnInit {
  counters: Counter[] = [];
  activeTab: 'Registrar' | 'Cash Division' | 'Accounting Office' = 'Cash Division';

  constructor() { }

  ngOnInit(): void {
    // Initialize with two counters
    this.counters = [
      { id: 1, name: 'Counter 1', isActive: false },
      { id: 2, name: 'Counter 2', isActive: false }
    ];
  }

  addCounter(): void {
    const newId = this.counters.length + 1;
    this.counters.push({
      id: newId,
      name: `Counter ${newId}`,
      isActive: false
    });
  }

  toggleCounterStatus(counter: Counter): void {
    counter.isActive = !counter.isActive;
  }

  changeTab(tab: 'Registrar' | 'Cash Division' | 'Accounting Office'): void {
    this.activeTab = tab;
  }

  logout(): void {
    // Implement logout logic here
    console.log('Logout clicked');
  }

  navigateTo(route: string): void {
    // Implement navigation logic here
    console.log(`Navigating to ${route}`);
  }
}