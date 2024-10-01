import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Counter {
  id: number;
  name: string;
  isActive: boolean;
  hoverState: boolean; // Property to manage hover state
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

  // State variables for dialogs
  showConfirmationDialog: boolean = false;
  counterToDelete: Counter | null = null;
  showCodeEntryDialog: boolean = false;
  codeInput: string = '';
  
  // State for unassign confirmation
  showUnassignCodeDialog: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.tabs.forEach(tab => {
      this.initializeCounters(tab);
    });
  }

  private initializeCounters(tab: string): void {
    this.counters[tab] = [
      { id: 1, name: this.getCounterName(tab, 1), isActive: true, hoverState: false },
      { id: 2, name: this.getCounterName(tab, 2), isActive: true, hoverState: false }
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
        isActive: true,
        hoverState: false
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
    counter.isActive = !counter.isActive;
    counter.hoverState = false;
  }

  changeButtonText(counter: Counter, isHovered: boolean): void {
    counter.hoverState = isHovered;
  }

  confirmDeleteCounter(counter: Counter, event: MouseEvent): void {
    event.stopPropagation();
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
    this.selectedCounter = counter;
    this.codeInput = '';
    this.showCodeEntryDialog = true;
  }

  cancelCodeEntry(): void {
    this.showCodeEntryDialog = false;
    this.selectedCounter = null;
  }

  assignCode(): void {
    if (this.selectedCounter) {
      this.selectedCounter.assignedCode = this.codeInput;
    }
    this.showCodeEntryDialog = false;
    this.selectedCounter = null;
  }

  // New method to confirm unassigning the code
  confirmUnassignCode(): void {
    this.showUnassignCodeDialog = true;
    this.showCodeEntryDialog = false; // Hide the code entry dialog while confirming
  }

  cancelUnassignCode(): void {
    this.showUnassignCodeDialog = false;
    this.selectedCounter = null;
  }

  // Method to unassign the code after confirmation
  unassignCodeConfirmed(): void {
    if (this.selectedCounter) {
      this.selectedCounter.assignedCode = undefined; // Clear the assigned code
    }
    this.showUnassignCodeDialog = false;
    this.selectedCounter = null;
  }
}
