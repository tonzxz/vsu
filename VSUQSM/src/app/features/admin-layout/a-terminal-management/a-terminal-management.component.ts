import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

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
  counters: { [key: string]: Counter[] } = {
    'Registrar': [],
    'Cash Division': [],
    'Accounting Office': []
  };
  activeTab: 'Registrar' | 'Cash Division' | 'Accounting Office' = 'Cash Division';

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.counters['Cash Division'] = [
      { id: 1, name: 'C1', isActive: false },
      { id: 2, name: 'C2', isActive: false }
    ];
    // Initialize other tabs with empty counters
    this.counters['Registrar'] = [];
    this.counters['Accounting Office'] = [];
  }

  addCounter(): void {
    console.log('Add Counter clicked');
    console.log('Active Tab:', this.activeTab);
    const prefix = this.getPrefixForActiveTab();
    console.log('Prefix:', prefix);

    const countersForTab = this.counters[this.activeTab];
    const newId = countersForTab.length + 1;
    console.log('New Counter ID:', newId);
    const newCounterName = `${prefix}${newId}`;
    console.log('New Counter Name:', newCounterName);

    countersForTab.push({
      id: newId,
      name: newCounterName,
      isActive: false
    });

    // Force change detection
    this.cdr.detectChanges();
    console.log('Counters:', this.counters[this.activeTab]);
  }

  getPrefixForActiveTab(): string {
    switch (this.activeTab) {
      case 'Registrar':
        return 'R';
      case 'Cash Division':
        return 'C';
      case 'Accounting Office':
        return 'A';
      default:
        return '';
    }
  }

  toggleCounterStatus(counter: Counter): void {
    counter.isActive = !counter.isActive;
  }

  changeTab(tab: 'Registrar' | 'Cash Division' | 'Accounting Office'): void {
    this.activeTab = tab;
  }

  logout(): void {
    console.log('Logout clicked');
  }

  navigateTo(route: string): void {
    console.log(`Navigating to ${route}`);
  }
}
