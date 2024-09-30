import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Counter, CounterStateService } from '../../../services/counter-state.service';

@Component({
  selector: 'app-counter-selection',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './counter-selection.component.html',
  styleUrls: ['./counter-selection.component.css']
})
export class CounterSelectionComponent implements OnInit {
  @Output() counterSelected = new EventEmitter<{tab: string, counterId: number}>();

  counters: { [key: string]: Counter[] } = {};
  tabs: string[] = ['Registrar', 'Cash Division', 'Accounting Office'];
  selectedCounters: { [key: string]: number | null } = {};

  constructor(private counterStateService: CounterStateService) {}

  ngOnInit() {
    this.counters = this.counterStateService.getCounters();
    this.counterStateService.counters$.subscribe(counters => {
      this.counters = counters;
    });
    this.tabs.forEach(tab => this.selectedCounters[tab] = null);
  }

  selectCounter(tab: string, counterId: number) {
    this.selectedCounters[tab] = counterId;
    // Deselect counters in other tabs
    this.tabs.forEach(t => {
      if (t !== tab) this.selectedCounters[t] = null;
    });
  }

  isAnyCounterSelected(): boolean {
    return Object.values(this.selectedCounters).some(value => value !== null);
  }

  confirmSelection() {
    const selectedTab = this.tabs.find(tab => this.selectedCounters[tab] !== null);
    if (selectedTab) {
      const counterId = this.selectedCounters[selectedTab];
      if (counterId !== null) {
        this.counterSelected.emit({tab: selectedTab, counterId});
      }
    }
  }

  isCounterSelected(tab: string, counterId: number): boolean {
    return this.selectedCounters[tab] === counterId;
  }
}