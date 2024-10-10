import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

// Interface defining the structure of a Counter object
interface Counter {
  id: number;          // Unique ID of the counter
  name: string;        // Name of the counter
  isActive: boolean;   // Whether the counter is active or not
}

@Component({
  selector: 'app-terminal-management',  // Component selector used in templates
  templateUrl: './terminal-management.component.html',  // HTML template for the component
  styleUrls: ['./terminal-management.component.css'],  // CSS for the component
  standalone: true,  // Allows the component to be used without being declared in a module
  imports: [CommonModule]  // Importing CommonModule to use Angular common directives
})
export class TerminalManagementComponent implements OnInit {

  // Dictionary to hold counters for each tab
  counters: { [key: string]: Counter[] } = {
    'Registrar': [],         // Counters for Registrar tab
    'Cash Division': [],     // Counters for Cash Division tab
    'Accounting Office': []  // Counters for Accounting Office tab
  };

  // The currently active tab
  activeTab: 'Registrar' | 'Cash Division' | 'Accounting Office' = 'Registrar';

  // Maximum allowed counters across all tabs
  maxCounters: number = 10;

  // Array of all available tabs
  tabs: ('Registrar' | 'Cash Division' | 'Accounting Office')[] = ['Registrar', 'Cash Division', 'Accounting Office'];

  // Currently selected counter (null means no selection)
  selectedCounter: Counter | null = null;

  // Injecting ChangeDetectorRef to trigger manual change detection
  constructor(private cdr: ChangeDetectorRef) {}

  // Lifecycle hook that initializes the counters for each tab
  ngOnInit(): void {
    this.initializeCounters('Registrar');
    this.initializeCounters('Cash Division');
    this.initializeCounters('Accounting Office');
  }

  // Initializes default counters for a specific tab
  private initializeCounters(tab: string): void {
    this.counters[tab] = [
      { id: 1, name: this.getCounterName(tab, 1), isActive: false },
      { id: 2, name: this.getCounterName(tab, 2), isActive: false }
    ];
  }

  // Adds a new counter to the current active tab
  addCounter(): void {
    const countersForTab = this.counters[this.activeTab];
    const totalCounters = this.getTotalCounters();

    // Check if total counters exceed the maximum allowed counters
    if (totalCounters < this.maxCounters) {
      const newId = countersForTab.length + 1;
      const newCounterName = this.getCounterName(this.activeTab, newId);

      // Push a new counter to the active tab's list of counters
      countersForTab.push({
        id: newId,
        name: newCounterName,
        isActive: false
      });

      // Trigger change detection to update the UI
      this.cdr.detectChanges();
    } else {
      alert(`Maximum of ${this.maxCounters} terminals reached across all tabs.`);
    }
  }

  // Select or deselect a counter
  selectCounter(counter: Counter): void {
    this.selectedCounter = this.selectedCounter === counter ? null : counter;
    this.cdr.detectChanges();
  }

  // Deletes the currently selected counter from the active tab
  deleteSelectedCounter(): void {
    if (this.selectedCounter) {
      // Remove the selected counter from the list
      this.counters[this.activeTab] = this.counters[this.activeTab].filter(
        counter => counter.id !== this.selectedCounter!.id
      );

      // Rename the remaining counters to ensure sequential IDs
      this.renameCouners(this.activeTab);
      this.selectedCounter = null;

      // Trigger change detection to update the UI
      this.cdr.detectChanges();
    }
  }

  // Renames counters after deletion to maintain sequential order
  private renameCouners(tab: string): void {
    this.counters[tab] = this.counters[tab].map((counter, index) => ({
      ...counter,
      id: index + 1,  // Reassign sequential ID
      name: this.getCounterName(tab, index + 1)  // Reassign name with new ID
    }));
  }

  // Toggles the active status of a counter
  toggleCounterStatus(counter: Counter): void {
    counter.isActive = !counter.isActive;
    this.cdr.detectChanges();
  }

  // Changes the active tab and resets the selected counter
  onTabClick(tab: 'Registrar' | 'Cash Division' | 'Accounting Office'): void {
    this.activeTab = tab;
    this.selectedCounter = null;  // Clear selection when switching tabs
    this.cdr.detectChanges();
  }

  // Determines if the "Add Counter" button should be shown
  shouldShowAddButton(): boolean {
    return this.getTotalCounters() < this.maxCounters;
  }

  // Calculates the total number of counters across all tabs
  getTotalCounters(): number {
    return Object.values(this.counters).reduce((acc, curr) => acc + curr.length, 0);
  }

  // Returns a counter name based on the tab and counter ID
  private getCounterName(tab: string, id: number): string {
    const prefix = tab === 'Registrar' ? 'R' : tab === 'Cash Division' ? 'C' : 'A';  // Prefix based on tab
    return `${prefix}${id}`;  // Combine prefix and counter ID to form the name
  }
}
