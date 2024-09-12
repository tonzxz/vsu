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
  imports: [CommonModule]  // Import CommonModule for Angular's common directives
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

  // Maximum number of counters allowed per tab
  maxCounters: number = 10;

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

    // Check if the maximum number of counters has been reached
    if (countersForTab.length < this.maxCounters) {
      const prefix = this.getPrefixForActiveTab(); // Get prefix based on the active tab
      const newCounterName = `${prefix}${countersForTab.length + 1}`; // Create counter name with prefix

      // Add the new counter to the list
      countersForTab.push({
        id: countersForTab.length + 1,
        name: newCounterName,
        isActive: false
      });

      // Reassign IDs to maintain sequential numbering
      this.reassignSequentialIds();

      // Force change detection to update the view
      this.cdr.detectChanges();
    } else {
      console.log(`Maximum of ${this.maxCounters} counters reached for ${this.activeTab}`);
    }
  }

  // Reassigns sequential IDs to counters
  reassignSequentialIds(): void {
    this.counters[this.activeTab].forEach((counter, index) => {
      counter.id = index + 1;
      counter.name = `${this.getPrefixForActiveTab()}${counter.id}`;
    });
  }

  // Method to get the prefix for the active tab (R for Registrar, C for Cash Division, A for Accounting Office)
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

  // Method to delete a counter by its ID from the active tab
  deleteCounter(counterId: number): void {
    this.counters[this.activeTab] = this.counters[this.activeTab].filter(counter => counter.id !== counterId);

    // Reassign IDs after deletion to maintain sequential order
    this.reassignSequentialIds();

    // Force change detection to update the view
    this.cdr.detectChanges();
  }

  // Method to toggle the status (active/inactive) of a counter
  toggleCounterStatus(counter: Counter): void {
    counter.isActive = !counter.isActive;
  }

  // Method to change the active tab
  changeTab(tab: 'Registrar' | 'Cash Division' | 'Accounting Office'): void {
    this.activeTab = tab;
  }

  // Method to determine if the "Add Counter" button should be displayed
  shouldShowAddButton(): boolean {
    return this.counters[this.activeTab].length < this.maxCounters;
  }
}
