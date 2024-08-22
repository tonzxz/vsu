import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Counter {
  id: number;
  name: string;
  isActive: boolean;
}

@Component({
  selector: 'app-terminal-management',
  templateUrl: './a-terminal-management.component.html',
  styleUrls: ['./a-terminal-management.component.css'],
  standalone: true,
  imports: [CommonModule]  // <-- Import CommonModule here
})
export class ATerminalManagementComponent implements OnInit {
  counters: { [key: string]: Counter[] } = {
    'Registrar': [],
    'Cash Division': [],
    'Accounting Office': []
  };
  activeTab: 'Registrar' | 'Cash Division' | 'Accounting Office' = 'Registrar';
  maxCounters: number = 10; // Maximum number of counters per tab

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Initialize some default values for each tab
    this.counters['Registrar'] = [
      { id: 1, name: 'R1', isActive: false },
      { id: 2, name: 'R2', isActive: false }
    ];
    this.counters['Cash Division'] = [
      { id: 1, name: 'C1', isActive: false },
      { id: 2, name: 'C2', isActive: false }
    ];
    this.counters['Accounting Office'] = [
      { id: 1, name: 'A1', isActive: false },
      { id: 2, name: 'A2', isActive: false }
    ];
  }

  addCounter(): void {
    const countersForTab = this.counters[this.activeTab];
    if (countersForTab.length < this.maxCounters) { // Check if the limit is reached
      const prefix = this.getPrefixForActiveTab();
      const newId = countersForTab.length + 1;
      const newCounterName = `${prefix}${newId}`;

      countersForTab.push({
        id: newId,
        name: newCounterName,
        isActive: false
      });

      // Force change detection
      this.cdr.detectChanges();
    } else {
      console.log(`Maximum of ${this.maxCounters} counters reached for ${this.activeTab}`);
    }
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

  deleteCounter(counterId: number): void {
    this.counters[this.activeTab] = this.counters[this.activeTab].filter(counter => counter.id !== counterId);

    // Force change detection
    this.cdr.detectChanges();
  }

  shouldShowAddButton(): boolean {
    return this.counters[this.activeTab].length < this.maxCounters;
  }
}
