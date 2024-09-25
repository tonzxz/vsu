import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Counter {
  id: number;
  name: string;
  isActive: boolean;
}

@Component({
  selector: 'app-a-kiosk-management',
  templateUrl: './a-kiosk-management.component.html',
  styleUrls: ['./a-kiosk-management.component.css'],
  standalone: true,
  imports: [CommonModule]
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

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.tabs.forEach(tab => {
      this.counters[tab] = [
        { id: 1, name: '1', isActive: false },
        { id: 2, name: '2', isActive: false },
      ];
    });
  }

  addCounter(): void {
    const countersForTab = this.counters[this.activeTab];
    if (countersForTab.length < this.maxCounters) {
      const newId = countersForTab.length + 1;
      const newCounterName = `${newId}`;
      countersForTab.push({
        id: newId,
        name: newCounterName,
        isActive: false
      });
      this.cdr.detectChanges();
    } else {
      console.log(`Maximum of ${this.maxCounters} counters reached for ${this.activeTab}`);
    }
  }

  toggleCounterStatus(counter: Counter): void {
    counter.isActive = !counter.isActive;
    this.cdr.detectChanges();
  }

  onTabClick(tab: 'Registrar' | 'Cash Division' | 'Accounting Office'): void {
    this.activeTab = tab;
    this.selectedCounter = null;  // Deselect counter when changing tabs
  }

  deleteCounter(counterId: number): void {
    this.counters[this.activeTab] = this.counters[this.activeTab].filter(counter => counter.id !== counterId);
    if (this.selectedCounter && this.selectedCounter.id === counterId) {
      this.selectedCounter = null;
    }
    this.cdr.detectChanges();
  }

  shouldShowAddButton(): boolean {
    return this.getTotalCounters() < this.maxCounters;
  }

  getTotalCounters(): number {
    return Object.values(this.counters).reduce((total, tabCounters) => total + tabCounters.length, 0);
  }

  selectCounter(counter: Counter): void {
    this.selectedCounter = this.selectedCounter === counter ? null : counter;
  }

  deleteSelectedCounter(): void {
    if (this.selectedCounter) {
      this.deleteCounter(this.selectedCounter.id);
    }
  }
}