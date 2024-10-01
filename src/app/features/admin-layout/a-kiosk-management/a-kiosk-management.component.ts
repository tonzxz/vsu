import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Counter {
  id: number;
  name: string;
  isActive: boolean;
  hoverState: boolean; // New property to manage hover state
  assignedCode?: string; // Property to store the assigned code
}

@Component({
  selector: 'app-a-kiosk-management',
  templateUrl: './a-kiosk-management.component.html',
  styleUrls: ['./a-kiosk-management.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AKioskManagementComponent implements OnInit {
  counters: { [key: string]: Counter[] } = {
    'Registrar': [],
    'Cash Division': [],
    'Accounting Office': []
  };

  activeTab: 'Registrar' | 'Cash Division' | 'Accounting Office' = 'Registrar';
  maxCounters: number = 10;
  tabs: ('Registrar' | 'Cash Division' | 'Accounting Office')[] = ['Registrar', 'Cash Division', 'Accounting Office'];
  selectedCounter: Counter | null = null;

  // New state variable for the confirmation dialog
  showConfirmationDialog: boolean = false;  
  counterToDelete: Counter | null = null;  // Holds the counter to delete
  
  // New state variable for the code entry dialog
  showCodeEntryDialog: boolean = false;  
  codeInput: string = '';  // Holds the code input value

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.tabs.forEach(tab => {
      this.initializeCounters(tab);
    });
  }

  private initializeCounters(tab: string): void {
    this.counters[tab] = [
      { id: 1, name: this.getCounterName(tab, 1), isActive: true, hoverState: false }, // Default isActive to true
      { id: 2, name: this.getCounterName(tab, 2), isActive: true, hoverState: false }  // Default isActive to true
    ];
  }

  addCounter(): void {
    const countersForTab = this.counters[this.activeTab];
    if (this.getTotalCounters() < this.maxCounters) {
      const newId = countersForTab.length + 1;
      const newCounterName = this.getCounterName(this.activeTab, newId);
      countersForTab.push({
        id: newId,
        name: newCounterName,
        isActive: true, // Set to true to make the counter active by default
        hoverState: false // Initialize hover state
      });
    }
  }
  

  getCounterName(tab: string, counterId: number): string {
    return `${tab} Counter ${counterId}`;
  }

  getTotalCounters(): number {
    return Object.values(this.counters).flat().length;
  }

  shouldShowAddButton(): boolean {
    return this.getTotalCounters() < this.maxCounters;
  }

  onTabClick(tab: 'Registrar' | 'Cash Division' | 'Accounting Office'): void {
    this.activeTab = tab;
  }

  selectCounter(counter: Counter): void {
    this.selectedCounter = this.selectedCounter === counter ? null : counter;
  }

  toggleCounterStatus(counter: Counter): void {
    counter.isActive = !counter.isActive;  // Toggle active state
    counter.hoverState = false; // Reset hover state when clicked
  }

  changeButtonText(counter: Counter, isHovered: boolean): void {
    counter.hoverState = isHovered; // Manage hover state
  }
  

  confirmDeleteCounter(counter: Counter, event: MouseEvent): void {
    event.stopPropagation();  // Prevent click event on the card
    this.showConfirmationDialog = true;
    this.counterToDelete = counter;
  }

  cancelDelete(): void {
    this.showConfirmationDialog = false;
    this.counterToDelete = null;
  }

  deleteSelectedCounter(): void {
    if (this.counterToDelete) {
      const index = this.counters[this.activeTab].indexOf(this.counterToDelete);
      if (index !== -1) {
        this.counters[this.activeTab].splice(index, 1);
      }
      this.counterToDelete = null;
    }
    this.showConfirmationDialog = false;
  }

  openCodeEntryPopup(counter: Counter): void {
    this.selectedCounter = counter;  // Set the selected counter
    this.codeInput = '';  // Reset the input
    this.showCodeEntryDialog = true;  // Show the code entry dialog
  }

  cancelCodeEntry(): void {
    this.showCodeEntryDialog = false;  // Close the dialog
    this.selectedCounter = null;  // Reset selected counter
  }

  assignCode(): void {
    if (this.selectedCounter) {
      this.selectedCounter.assignedCode = this.codeInput;  // Assign the code to the selected counter
    }
    this.showCodeEntryDialog = false;  // Close the dialog
    this.selectedCounter = null;  // Reset selected counter
  }
}
