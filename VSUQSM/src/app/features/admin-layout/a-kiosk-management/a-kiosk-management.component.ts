import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

// Interface defining the structure of a Counter object
interface Counter {
  id: number;          // Unique identifier for the counter
  name: string;        // Name of the counter
  isActive: boolean;   // Indicates if the counter is active
}

@Component({
  selector: 'app-a-kiosk-management',            // Component selector for Angular
  templateUrl: './a-kiosk-management.component.html',  // HTML template for the component
  styleUrls: ['./a-kiosk-management.component.css'],   // CSS styles for the component
  standalone: true,                               // Allows the component to be used independently
  imports: [CommonModule]                         // Importing CommonModule for common Angular directives
})
export class AKioskManagementComponent implements OnInit {
  
  // State variables
  counters: { [key: string]: Counter[] } = {     // Object to hold counters for each tab
    'Registrar': [],
    'Cash Division': [],
    'Accounting Office': []
  };

  activeTab: 'Registrar' | 'Cash Division' | 'Accounting Office' = 'Registrar'; // Currently active tab
  maxCounters: number = 10;                                                       // Maximum allowed counters across all tabs
  tabs: ('Registrar' | 'Cash Division' | 'Accounting Office')[] = ['Registrar', 'Cash Division', 'Accounting Office'];  // List of available tabs
  selectedCounter: Counter | null = null;                                         // Currently selected counter

  // Inject ChangeDetectorRef for manual change detection
  constructor(private cdr: ChangeDetectorRef) {}

  // Lifecycle hook: initializes counters for all tabs on component initialization
  ngOnInit(): void {
    this.tabs.forEach(tab => {
      this.initializeCounters(tab);  // Initialize counters for each tab
    });
  }

  // Initialize two counters for the specified tab
  private initializeCounters(tab: string): void {
    this.counters[tab] = [
      { id: 1, name: this.getCounterName(tab, 1), isActive: false },
      { id: 2, name: this.getCounterName(tab, 2), isActive: false }
    ];
  }

  // Adds a new counter to the currently active tab if the limit is not exceeded
  addCounter(): void {
    const countersForTab = this.counters[this.activeTab];  // Get counters for the active tab

    if (this.getTotalCounters() < this.maxCounters) {  // Check if total counters are below the max limit
      const newId = countersForTab.length + 1;  // New ID for the counter
      const newCounterName = this.getCounterName(this.activeTab, newId);  // Generate a new counter name

      // Add the new counter to the active tab
      countersForTab.push({
        id: newId,
        name: newCounterName,
        isActive: false
      });

      this.cdr.detectChanges();  // Trigger change detection to update the view
    } else {
      console.log(`Maximum of ${this.maxCounters} counters reached across all tabs`);  // Log message if limit reached
    }
  }

  // Toggle the active/inactive status of a counter
  toggleCounterStatus(counter: Counter): void {
    counter.isActive = !counter.isActive;  // Flip the isActive status
    this.cdr.detectChanges();  // Trigger change detection to update the view
  }

  // Handle tab clicks to change the active tab
  onTabClick(tab: 'Registrar' | 'Cash Division' | 'Accounting Office'): void {
    this.activeTab = tab;  // Set the active tab
    this.selectedCounter = null;  // Deselect any counter when changing tabs
    this.cdr.detectChanges();  // Trigger change detection
  }

  // Delete a counter by its ID and rename remaining counters
  deleteCounter(counterId: number): void {
    // Remove the counter with the specified ID from the active tab
    this.counters[this.activeTab] = this.counters[this.activeTab].filter(counter => counter.id !== counterId);
    
    this.renameCounters(this.activeTab);  // Rename counters to maintain sequential IDs

    // Deselect the counter if it was selected for deletion
    if (this.selectedCounter && this.selectedCounter.id === counterId) {
      this.selectedCounter = null;  // Reset selected counter
    }

    this.cdr.detectChanges();  // Trigger change detection
  }

  // Renames counters in a specific tab to maintain sequential order after deletion
  private renameCounters(tab: string): void {
    this.counters[tab] = this.counters[tab].map((counter, index) => ({
      ...counter,
      id: index + 1,  // Assign a new sequential ID
      name: this.getCounterName(tab, index + 1)  // Update name based on new ID
    }));
  }

  // Check if the "Add Counter" button should be shown based on the total counters
  shouldShowAddButton(): boolean {
    return this.getTotalCounters() < this.maxCounters;  // Show button if under the maximum limit
  }

  // Calculate the total number of counters across all tabs
  getTotalCounters(): number {
    return Object.values(this.counters).reduce((total, tabCounters) => total + tabCounters.length, 0);
  }

  // Select or deselect a counter
  selectCounter(counter: Counter): void {
    this.selectedCounter = this.selectedCounter === counter ? null : counter;  // Toggle selection
    this.cdr.detectChanges();  // Trigger change detection
  }

  // Deletes the currently selected counter if any
  deleteSelectedCounter(): void {
    if (this.selectedCounter) {
      this.deleteCounter(this.selectedCounter.id);  // Call deleteCounter with the selected counter's ID
    }
  }

  // Generate a counter name based on the tab and counter ID
  private getCounterName(tab: string, id: number): string {
    // Return an empty prefix as there are no specific prefixes defined
    const prefix = tab === 'Registrar' ? '' : tab === 'Cash Division' ? '' : '';
    return `${prefix}${id}`;  // Return the formatted counter name
  }
}
