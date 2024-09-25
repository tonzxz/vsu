import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

// Interface representing a Counter object
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
  imports: [CommonModule]
})
export class ATerminalManagementComponent implements OnInit {
  // Object holding counters for each tab
  counters: { [key: string]: Counter[] } = {
    'Registrar': [],
    'Cash Division': [],
    'Accounting Office': []
  };

  // Active tab being displayed
  activeTab: 'Registrar' | 'Cash Division' | 'Accounting Office' = 'Registrar';

  // Maximum number of counters allowed across all tabs
  maxCounters: number = 10;

  // Array of tab names for ngFor in the template
  tabs: ('Registrar' | 'Cash Division' | 'Accounting Office')[] = ['Registrar', 'Cash Division', 'Accounting Office'];

  // Selected counter for deletion
  selectedCounter: Counter | null = null;

  // Counter ID tracker to ensure unique IDs
  private counterIdTracker: { [key: string]: number } = {
    'Registrar': 2,
    'Cash Division': 2,
    'Accounting Office': 2
  };

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Initialize default counters for each tab
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

  // Method to add a new counter to the active tab
  addCounter(): void {
    const countersForTab = this.counters[this.activeTab];
    const totalCounters = this.getTotalCounters();

    if (totalCounters < this.maxCounters) {
      const prefix = this.getPrefixForActiveTab();
      const newId = ++this.counterIdTracker[this.activeTab];
      const newCounterName = `${prefix}${newId}`;

      countersForTab.push({
        id: newId,
        name: newCounterName,
        isActive: false
      });

      this.cdr.detectChanges();
    } else {
      // Optionally, you can use a notification service to alert the user
      alert(`Maximum of ${this.maxCounters} terminals reached across all tabs.`);
    }
  }

  // Method to select a counter for potential deletion
  selectCounter(counter: Counter): void {
    if (this.selectedCounter === counter) {
      this.selectedCounter = null;
    } else {
      this.selectedCounter = counter;
    }
    this.cdr.detectChanges();
  }

  // Method to delete the selected counter
  deleteSelectedCounter(): void {
    if (this.selectedCounter) {
      this.counters[this.activeTab] = this.counters[this.activeTab].filter(
        counter => counter.id !== this.selectedCounter!.id
      );
      this.selectedCounter = null;
      this.cdr.detectChanges();
    }
  }

  // Method to toggle the status (active/inactive) of a counter
  toggleCounterStatus(counter: Counter): void {
    counter.isActive = !counter.isActive;
    this.cdr.detectChanges();
  }

  // Method to change the active tab
  onTabClick(tab: 'Registrar' | 'Cash Division' | 'Accounting Office'): void {
    this.activeTab = tab;
    this.selectedCounter = null; // Deselect counter when changing tabs
    this.cdr.detectChanges();
  }

  // Method to determine if the "Add Counter" button should be displayed
  shouldShowAddButton(): boolean {
    return this.getTotalCounters() < this.maxCounters;
  }

  // Method to calculate the total number of counters across all tabs
  getTotalCounters(): number {
    return Object.values(this.counters).reduce((acc, curr) => acc + curr.length, 0);
  }

  // Method to get the prefix for the active tab (R for Registrar, C for Cash Division, A for Accounting Office)
  private getPrefixForActiveTab(): string {
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
}